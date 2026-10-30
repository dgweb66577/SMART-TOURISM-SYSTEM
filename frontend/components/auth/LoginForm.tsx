'use client'

import React, { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2, Mail, Lock, Sparkles } from 'lucide-react'

import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/stores/authStore'
import {
  loginSchema,
  magicLinkSchema,
  type LoginInput,
  type MagicLinkInput,
} from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { UserRole } from '@/lib/supabase/types'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams?.get('redirectTo')
  const { setUser, fetchRole } = useAuthStore()

  const [isMagicLinkMode, setIsMagicLinkMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [isOAuthLoading, setIsOAuthLoading] = useState(false)

  // Standard email/password form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  // Magic link form
  const {
    register: registerMagic,
    handleSubmit: handleMagicSubmit,
    formState: { errors: magicErrors },
  } = useForm<MagicLinkInput>({
    resolver: zodResolver(magicLinkSchema),
  })

  const handleRoleRedirect = (role: UserRole | null) => {
    let target = '/dashboard'

    if (redirectTo) {
      target = redirectTo
    } else {
      switch (role) {
        case 'platform_admin':
          target = '/admin'
          break
        case 'place_incharge':
          target = '/place/dashboard'
          break
        default:
          target = '/dashboard'
          break
      }
    }

    // Full navigation to ensure session cookies are sent directly to middleware
    window.location.href = target
  }

  const onPasswordLogin = async (values: LoginInput) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })

      if (error) {
        toast.error(error.message)
        return
      }

      if (data.user) {
        setUser(data.user)
        const role = await fetchRole(data.user.id)
        toast.success('Welcome back! Signed in successfully.')
        handleRoleRedirect(role)
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred'
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const onMagicLinkLogin = async (values: MagicLinkInput) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const origin =
        typeof window !== 'undefined'
          ? window.location.origin
          : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

      const { error } = await supabase.auth.signInWithOtp({
        email: values.email,
        options: {
          emailRedirectTo: `${origin}/`,
        },
      })

      if (error) {
        toast.error(error.message)
        return
      }

      toast.success('Magic link dispatched! Please check your inbox.')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'An unexpected error occurred'
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleOAuth = async () => {
    setIsOAuthLoading(true)
    try {
      const supabase = createClient()
      const origin =
        typeof window !== 'undefined'
          ? window.location.origin
          : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

      const callbackUrl = redirectTo
        ? `${origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`
        : `${origin}/auth/callback`

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: callbackUrl,
          queryParams: {
            prompt: 'select_account',
          },
        },
      })

      if (error) {
        toast.error(error.message)
        setIsOAuthLoading(false)
      } else if (data?.url) {
        window.location.href = data.url
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google authentication failed'
      toast.error(msg)
      setIsOAuthLoading(false)
    }
  }

  return (
    <div className="w-full space-y-6">
      {/* OAuth Button */}
      <Button
        type="button"
        variant="outline"
        className="w-full h-11 relative flex items-center justify-center font-medium border-slate-300 hover:bg-slate-50 transition-colors"
        onClick={handleGoogleOAuth}
        disabled={isOAuthLoading || isLoading}
      >
        {isOAuthLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin text-[#0077B6]" />
        ) : (
          <svg className="mr-2.5 h-4 w-4" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              fill="#EA4335"
            />
          </svg>
        )}
        Continue with Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-slate-400 font-medium tracking-wider">
            Or continue with email
          </span>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => setIsMagicLinkMode(!isMagicLinkMode)}
          className="text-xs font-semibold text-[#0077B6] hover:text-[#005f92] hover:underline flex items-center gap-1 transition-colors"
        >
          <Sparkles className="h-3.5 w-3.5 text-[#FF7B00]" />
          {isMagicLinkMode ? 'Use password login instead' : 'Use magic link login'}
        </button>
      </div>

      {isMagicLinkMode ? (
        /* Magic Link Form */
        <form onSubmit={handleMagicSubmit(onMagicLinkLogin)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="magic-email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="magic-email"
                type="email"
                placeholder="name@example.com"
                className="pl-9"
                {...registerMagic('email')}
              />
            </div>
            {magicErrors.email && (
              <p className="text-xs text-red-500 font-medium">
                {magicErrors.email.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-[#0077B6] hover:bg-[#005f92] font-semibold text-white shadow-md shadow-blue-500/10"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending Magic Link...
              </>
            ) : (
              'Send Magic Link'
            )}
          </Button>
        </form>
      ) : (
        /* Password Form */
        <form onSubmit={handlePasswordSubmit(onPasswordLogin)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="login-email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="login-email"
                type="email"
                placeholder="name@example.com"
                className="pl-9"
                {...registerPassword('email')}
              />
            </div>
            {passwordErrors.email && (
              <p className="text-xs text-red-500 font-medium">
                {passwordErrors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="login-password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                className="pl-9"
                {...registerPassword('password')}
              />
            </div>
            {passwordErrors.password && (
              <p className="text-xs text-red-500 font-medium">
                {passwordErrors.password.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-[#0077B6] hover:bg-[#005f92] font-semibold text-white shadow-md shadow-blue-500/10"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>
      )}
    </div>
  )
}
