import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from './types'
import { AUTH_COOKIE_NAME } from './client'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabaseUrl =
    process.env.SUPABASE_INTERNAL_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return { supabaseResponse, supabase: null, user: null }
  }

  const supabase = createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookieOptions: {
      name: AUTH_COOKIE_NAME,
    },
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value,
          ...options,
        })
        supabaseResponse = NextResponse.next({
          request: {
            headers: request.headers,
          },
        })
        supabaseResponse.cookies.set({
          name,
          value,
          ...options,
        })
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({
          name,
          value: '',
          ...options,
        })
        supabaseResponse = NextResponse.next({
          request: {
            headers: request.headers,
          },
        })
        supabaseResponse.cookies.set({
          name,
          value: '',
          ...options,
        })
      },
    },
  })

  // IMPORTANT: Avoid running custom code between createServerClient and getUser.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return { supabaseResponse, supabase, user }
}
