import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from './lib/supabase/middleware'
import type { UserRole } from './lib/supabase/types'

export async function middleware(request: NextRequest) {
  const { supabaseResponse, supabase, user } = await updateSession(request)
  const pathname = request.nextUrl.pathname

  // Retrieve user role from user_roles table if authenticated
  let role: UserRole = 'user'
  if (user && supabase) {
    const { data: roleRecords } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)

    if (roleRecords && roleRecords.length > 0) {
      const roles = roleRecords.map((r) => r.role)
      if (roles.includes('platform_admin')) {
        role = 'platform_admin'
      } else if (roles.includes('place_incharge')) {
        role = 'place_incharge'
      } else {
        role = 'user'
      }
    } else if (user.user_metadata?.role) {
      const metaRole = user.user_metadata.role
      if (metaRole === 'platform_admin' || metaRole === 'place_incharge') {
        role = metaRole
      }
    }
  }

  const isAuthRoute =
    pathname === '/login' ||
    pathname === '/signup' ||
    pathname === '/register-partner'
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/')
  const isPlaceRoute = pathname === '/place' || pathname.startsWith('/place/')
  const isUserProtectedRoute =
    pathname === '/dashboard' ||
    pathname.startsWith('/dashboard/') ||
    pathname === '/profile' ||
    pathname.startsWith('/profile/') ||
    pathname === '/trips' ||
    pathname.startsWith('/trips/')

  // 1. Authenticated users visiting /login or /signup get redirected to their role home
  if (user && isAuthRoute) {
    const redirectMap: Record<UserRole, string> = {
      platform_admin: '/admin',
      place_incharge: '/place/dashboard',
      user: '/dashboard',
    }
    const targetUrl = request.nextUrl.clone()
    targetUrl.pathname = redirectMap[role] || '/dashboard'
    targetUrl.search = ''
    return NextResponse.redirect(targetUrl)
  }

  // Helper to build redirect URL with original return path
  const redirectToLogin = () => {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    loginUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(loginUrl)
  }

  const redirectToUnauthorized = () => {
    const unauthUrl = request.nextUrl.clone()
    unauthUrl.pathname = '/unauthorized'
    unauthUrl.search = ''
    return NextResponse.redirect(unauthUrl)
  }

  // 2. /admin/* -> only platform_admin
  if (isAdminRoute) {
    if (!user) {
      return redirectToLogin()
    }
    if (role !== 'platform_admin') {
      return redirectToUnauthorized()
    }
  }

  // 3. /place/* -> only place_incharge
  if (isPlaceRoute) {
    if (!user) {
      return redirectToLogin()
    }
    if (role !== 'place_incharge') {
      return redirectToUnauthorized()
    }
  }

  // 4. /profile, /trips -> any authenticated user
  if (isUserProtectedRoute) {
    if (!user) {
      return redirectToLogin()
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - static image and media assets
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)',
  ],
}
