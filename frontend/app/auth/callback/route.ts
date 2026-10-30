import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  // Resolve external browser-facing base URL (prevent 0.0.0.0 from internal container bindings)
  const forwardedHost = request.headers.get('x-forwarded-host')
  const host = forwardedHost || request.headers.get('host') || 'localhost:3000'
  const isLocal =
    host.includes('localhost') ||
    host.includes('127.0.0.1') ||
    host.includes('0.0.0.0')

  let redirectBase: string
  if (isLocal) {
    const cleanHost = host.replace('0.0.0.0', 'localhost')
    redirectBase = `http://${cleanHost}`
  } else {
    const proto = request.headers.get('x-forwarded-proto') ?? 'https'
    redirectBase = `${proto}://${host}`
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  if (appUrl && !appUrl.includes('0.0.0.0')) {
    redirectBase = appUrl
  }

  if (code) {
    const supabase = createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${redirectBase}${next}`)
    } else {
      console.error('[OAuth Callback] exchangeCodeForSession failed:', error)
    }
  }

  // Return to login with error if exchange failed
  return NextResponse.redirect(`${redirectBase}/login?error=oauth_failed`)
}
