import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import fs from 'fs'
import type { Database } from './types'
import { AUTH_COOKIE_NAME } from './client'

export const DEFAULT_SUPABASE_URL = 'http://127.0.0.1:54321'
export const DEFAULT_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0'

export function createClient() {
  const cookieStore = cookies()

  let supabaseUrl =
    process.env.SUPABASE_INTERNAL_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    DEFAULT_SUPABASE_URL
  const supabaseAnonKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || DEFAULT_ANON_KEY

  // Inside a Docker container, 127.0.0.1 or localhost refers to the container itself.
  // Map local Supabase requests to host.docker.internal so the server can reach GoTrue / Postgres.
  try {
    const isDocker = fs.existsSync('/.dockerenv') || process.env.HOSTNAME === '0.0.0.0'
    if (
      isDocker &&
      !process.env.SUPABASE_INTERNAL_URL &&
      (supabaseUrl.includes('127.0.0.1') || supabaseUrl.includes('localhost'))
    ) {
      supabaseUrl = supabaseUrl
        .replace('127.0.0.1', 'host.docker.internal')
        .replace('localhost', 'host.docker.internal')
    }
  } catch {
    // Non-filesystem environments or fallback
  }

  return createServerClient<Database>(supabaseUrl, supabaseAnonKey, {
    cookieOptions: {
      name: AUTH_COOKIE_NAME,
    },
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
      set(name: string, value: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value, ...options })
        } catch {
          // Can happen in Server Components; safe to ignore when middleware refreshes sessions
        }
      },
      remove(name: string, options: CookieOptions) {
        try {
          cookieStore.set({ name, value: '', ...options })
        } catch {
          // Can happen in Server Components; safe to ignore when middleware refreshes sessions
        }
      },
    },
  })
}
