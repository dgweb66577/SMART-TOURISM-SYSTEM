import React from 'react'
import Link from 'next/link'
import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShieldAlert, Home, LogIn } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Access Denied (403) — Goa Smart Tourism',
  description: 'You do not have permission to access this resource.',
}

export default function UnauthorizedPage() {
  return (
    <Card className="border-red-100 shadow-xl shadow-red-500/5 bg-white/95 text-center">
      <CardHeader className="space-y-4 pb-4">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-red-50 text-red-600 ring-8 ring-red-50/50">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <div className="space-y-1.5">
          <span className="inline-block rounded-full bg-red-100/80 px-2.5 py-0.5 text-[11px] font-semibold text-red-700 tracking-wide uppercase">
            Error 403 &bull; Unauthorized
          </span>
          <CardTitle className="text-2xl font-bold tracking-tight text-slate-900">
            Restricted Shoreline
          </CardTitle>
          <CardDescription className="text-sm text-slate-500 max-w-sm mx-auto">
            Your current account credentials don&apos;t have authorization to view this
            dashboard or resource.
          </CardDescription>
        </div>
      </CardHeader>

      <CardContent className="pt-2 pb-6">
        <div className="rounded-lg bg-slate-50 p-3.5 text-xs text-slate-600 border border-slate-100">
          <p>
            If you are a <strong>Business Incharge</strong> or <strong>Platform Admin</strong>,
            please log in with your dedicated managerial account.
          </p>
        </div>
      </CardContent>

      <CardFooter className="flex flex-col sm:flex-row gap-3 pt-0">
        <Link href="/" className="w-full">
          <Button
            variant="default"
            className="w-full h-11 bg-[#0077B6] hover:bg-[#005f92] font-semibold flex items-center justify-center gap-2"
          >
            <Home className="h-4 w-4" />
            Go Home
          </Button>
        </Link>
        <Link href="/login" className="w-full">
          <Button
            variant="outline"
            className="w-full h-11 font-semibold flex items-center justify-center gap-2 border-slate-200"
          >
            <LogIn className="h-4 w-4" />
            Switch Account
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
