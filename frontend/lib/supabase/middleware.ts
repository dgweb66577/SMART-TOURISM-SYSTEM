import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from './types'
import { AUTH_COOKIE_NAME } from './client'

const DEFAULT_SUPABASE_URL = 'http://127.0.0.1:54321'
const DEFAULT_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  let supabaseUrl =
    process.env.SUPABASE_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    DEFAULT_SUPABASE_URL
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_ANON_KEY

  // Inside a Docker container, 127.0.0.1 or localhost refers to the container itself.
  if (
    !process.env.SUPABASE_INTERNAL_URL &&
    process.env.HOSTNAME === '0.0.0.0' &&
    (supabaseUrl.includes('127.0.0.1') || supabaseUrl.includes('localhost'))
  ) {
    supabaseUrl = supabaseUrl
      .replace('127.0.0.1', 'host.docker.internal')
      .replace('localhost', 'host.docker.internal')
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
