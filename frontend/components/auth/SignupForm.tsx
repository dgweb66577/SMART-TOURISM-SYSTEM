'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import { Loader2, Mail, Lock, ShieldCheck } from 'lucide-react'

import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/stores/authStore'
import { signupSchema, type SignupInput } from '@/lib/validations/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function SignupForm() {
  const router = useRouter()
  const { setUser, fetchRole } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [isOAuthLoading, setIsOAuthLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (values: SignupInput) => {
    setIsLoading(true)
    try {
      const supabase = createClient()
      const origin =
        typeof window !== 'undefined'
          ? window.location.origin
          : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          emailRedirectTo: `${origin}/`,
        },
      })

      if (error) {
        toast.error(error.message)
        return
      }

      if (data.user) {
        setUser(data.user)
        await fetchRole(data.user.id)
        toast.success('Account created! Welcome to Goa Smart Tourism.')
        window.location.href = '/dashboard'
      } else {
        toast.success('Registration initiated. Please verify your email!')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed'
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

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback`,
        },
      })

      if (error) {
        if (error.message.includes('not enabled') || error.message.includes('Unsupported provider') || error.message.includes('validation_failed')) {
          toast.info(
            'Google Sign-In is ready! To activate real Google logins, add your GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in supabase/config.toml. For now, you can sign up with Email & Password.',
            { duration: 6000 }
          )
        } else {
          toast.error(error.message)
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Google authentication failed'
      toast.error(msg)
    } finally {
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
        Sign up with Google
      </Button>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-slate-200" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-white px-3 text-slate-400 font-medium tracking-wider">
            Or register with email
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="signup-email">Email Address</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              id="signup-email"
              type="email"
              placeholder="name@example.com"
              className="pl-9"
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div className="space-y-2">
          <Label htmlFor="signup-password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              id="signup-password"
              type="password"
              placeholder="Min 8 chars, 1 uppercase, 1 number, 1 special"
              className="pl-9"
              {...register('password')}
            />
          </div>
          {errors.password && (
            <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>
          )}
        </div>

        {/* Confirm Password */}
        <div className="space-y-2">
          <Label htmlFor="signup-confirm-password">Confirm Password</Label>
          <div className="relative">
            <ShieldCheck className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
            <Input
              id="signup-confirm-password"
              type="password"
              placeholder="Re-enter password"
              className="pl-9"
              {...register('confirmPassword')}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-red-500 font-medium">
              {errors.confirmPassword.message}
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
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>
      </form>
    </div>
  )
}
