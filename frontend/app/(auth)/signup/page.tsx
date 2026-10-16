import React, { Suspense } from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { SignupForm } from '@/components/auth/SignupForm'
import { Compass, Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sign Up — Goa Smart Tourism',
  description: 'Join the Goa Smart Tourism platform to explore beaches, heritage, and local experiences.',
}

export default function SignupPage() {
  return (
    <Card className="border-slate-200/90 shadow-xl shadow-slate-200/50 backdrop-blur-sm bg-white/95">
      <CardHeader className="space-y-3 text-center pb-6">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0077B6] to-[#0096C7] text-white shadow-md shadow-sky-500/20">
          <Compass className="h-6 w-6" />
        </div>
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
            Begin Your Goa Journey
          </CardTitle>
          <CardDescription className="text-sm font-medium text-slate-500">
            Create an account to discover hidden gems & exclusive deals
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <Suspense
          fallback={
            <div className="flex justify-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-[#0077B6]" />
            </div>
          }
        >
          <SignupForm />
        </Suspense>

        <div className="text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link
            href="/login"
            className="font-semibold text-[#0077B6] hover:text-[#005f92] hover:underline transition-colors"
          >
            Sign in
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
