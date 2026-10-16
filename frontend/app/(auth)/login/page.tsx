import React, { Suspense } from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { LoginForm } from '@/components/auth/LoginForm'
import { SunMedium, Loader2, Store, User, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sign In — Goa Smart Tourism',
  description: 'Sign in to access personalized itineraries, place management, or administration.',
}

export default function LoginPage() {
  return (
    <div className="w-full space-y-4">
      {/* Login Card */}
      <Card className="border-slate-200/90 shadow-xl shadow-slate-200/50 backdrop-blur-sm bg-white/95">
        <CardHeader className="space-y-3 text-center pb-6">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#FF7B00] to-[#FFAA00] text-white shadow-md shadow-orange-500/20">
            <SunMedium className="h-6 w-6" />
          </div>
          <div className="space-y-1">
            <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
              Welcome to Goa
            </CardTitle>
            <CardDescription className="text-sm font-medium text-slate-500">
              Sign in to continue to your dashboard
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="space-y-5">
          <Suspense
            fallback={
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-[#0077B6]" />
              </div>
            }
          >
            <LoginForm />
          </Suspense>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center text-[10px] uppercase">
              <span className="bg-white px-3 text-slate-400 font-semibold tracking-widest">
                New here?
              </span>
            </div>
          </div>

          {/* Registration Options */}
          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/signup"
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-sky-200 bg-sky-50 hover:bg-sky-100 hover:border-sky-400 transition-all group"
            >
              <div className="h-8 w-8 rounded-lg bg-sky-100 flex items-center justify-center group-hover:bg-sky-200 transition-colors">
                <User className="h-4 w-4 text-sky-600" />
              </div>
              <span className="text-xs font-bold text-sky-700">Tourist</span>
              <span className="text-[10px] text-slate-500 text-center leading-tight">
                Explore Goa places
              </span>
            </Link>
            <Link
              href="/register-partner"
              className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-orange-200 bg-orange-50 hover:bg-orange-100 hover:border-orange-400 transition-all group"
            >
              <div className="h-8 w-8 rounded-lg bg-orange-100 flex items-center justify-center group-hover:bg-orange-200 transition-colors">
                <Store className="h-4 w-4 text-orange-600" />
              </div>
              <span className="text-xs font-bold text-orange-700">Place Owner</span>
              <span className="text-[10px] text-slate-500 text-center leading-tight">
                List your venue
              </span>
            </Link>
          </div>

          {/* Admin hint */}
          <div className="flex items-center gap-2 rounded-lg bg-slate-50 border border-slate-200 px-3 py-2">
            <Shield className="h-3.5 w-3.5 text-purple-500 shrink-0" />
            <p className="text-[10px] text-slate-500 leading-tight">
              <span className="font-semibold text-slate-700">Platform Admin</span> access is
              restricted. Contact your system administrator for credentials.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
