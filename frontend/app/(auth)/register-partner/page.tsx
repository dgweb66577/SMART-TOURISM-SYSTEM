import React, { Suspense } from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { RegisterPartnerForm } from '@/components/auth/RegisterPartnerForm'
import { Store, Loader2, CheckCircle2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Register Your Place — Goa Smart Tourism Partners',
  description: 'List your beach shack, resort, restaurant or attraction on Goa Smart Tourism and reach thousands of travellers.',
}

const BENEFITS = [
  'Your place goes live for thousands of Goa tourists',
  'Manage photos, hours, offers & reviews',
  'Analytics dashboard — views, inquiries & ratings',
  'Free listing, reviewed by our team within 24h',
]

export default function RegisterPartnerPage() {
  return (
    <div className="w-full space-y-5">
      {/* Hero Banner */}
      <div className="rounded-2xl bg-gradient-to-br from-[#FF7B00]/10 via-amber-50 to-orange-50 border border-orange-200/60 p-5 space-y-3">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-xl bg-gradient-to-br from-[#FF7B00] to-[#FF9500] flex items-center justify-center text-white shadow-md shadow-orange-400/20 shrink-0">
            <Store className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-900 tracking-tight">
              List Your Place on GoapSmart
            </h1>
            <p className="text-xs text-slate-500 font-medium">
              Reach travellers actively exploring Goa
            </p>
          </div>
        </div>
        <ul className="space-y-1.5">
          {BENEFITS.map((b) => (
            <li key={b} className="flex items-center gap-2 text-xs text-slate-700 font-medium">
              <CheckCircle2 className="h-3.5 w-3.5 text-orange-500 shrink-0" />
              {b}
            </li>
          ))}
        </ul>
      </div>

      {/* Registration Card */}
      <Card className="border-slate-200/90 shadow-xl shadow-slate-200/50 backdrop-blur-sm bg-white/95">
        <CardHeader className="space-y-1 pb-5">
          <CardTitle className="text-xl font-bold tracking-tight text-slate-900">
            Create Your Partner Account
          </CardTitle>
          <CardDescription className="text-sm text-slate-500">
            Fill in your business details to get started
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-5">
          <Suspense
            fallback={
              <div className="flex justify-center py-10">
                <Loader2 className="h-8 w-8 animate-spin text-[#FF7B00]" />
              </div>
            }
          >
            <RegisterPartnerForm />
          </Suspense>

          <div className="text-center text-xs text-slate-500">
            Already have a partner account?{' '}
            <Link
              href="/login"
              className="font-semibold text-[#FF7B00] hover:text-[#e06a00] hover:underline transition-colors"
            >
              Sign in here
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
