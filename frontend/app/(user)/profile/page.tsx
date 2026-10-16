'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '@/lib/stores/authStore'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { User, LogOut, Shield, Heart, MapPin, Sparkles, LogIn } from 'lucide-react'
import { toast } from 'sonner'

export default function ProfilePage() {
  const router = useRouter()
  const { user, role, clearAuth, initialize } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  const handleSignOut = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      clearAuth()
      toast.success('Signed out successfully')
      router.push('/login')
    } catch {
      toast.error('Failed to sign out')
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Account Profile
        </h1>
        <p className="text-sm text-slate-500">
          Manage your Goa Smart Tourism traveler details and preferences
        </p>
      </div>

      <Card className="border-slate-200/80 rounded-2xl bg-white shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-[#0077B6] to-[#0096C7] h-24 w-full relative" />
        <CardContent className="pt-0 relative px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-12 mb-6 gap-4">
            <div className="flex items-end gap-4">
              <div className="h-20 w-20 rounded-2xl bg-white p-1 ring-4 ring-white shadow-lg flex items-center justify-center">
                <div className="h-full w-full rounded-xl bg-gradient-to-tr from-[#0077B6] to-[#00B4D8] text-white flex items-center justify-center font-bold text-2xl">
                  {user?.email ? user.email.charAt(0).toUpperCase() : 'U'}
                </div>
              </div>
              <div className="pb-1">
                <h2 className="text-xl font-bold text-slate-900">
                  {user?.email?.split('@')[0] || 'Traveler'}
                </h2>
                <p className="text-xs text-slate-500">{user?.email || 'Guest Explorer'}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 text-xs font-bold uppercase tracking-wider text-sky-800 bg-sky-100 px-3 py-1 rounded-full">
                <Shield className="h-3.5 w-3.5 text-[#0077B6]" />
                Role: {role || 'Tourist'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-100">
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-2xl font-bold text-[#0077B6]">4</span>
              <p className="text-xs text-slate-500 mt-0.5">Places Saved</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-2xl font-bold text-[#FF7B00]">2</span>
              <p className="text-xs text-slate-500 mt-0.5">Trips Planned</p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-2xl font-bold text-emerald-600">1</span>
              <p className="text-xs text-slate-500 mt-0.5">Claimed Offer</p>
            </div>
          </div>

          <div className="pt-6 flex justify-end gap-3">
            {user ? (
              <Button
                id="profile-sign-out-btn"
                variant="outline"
                onClick={handleSignOut}
                className="text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            ) : (
              <Link href="/login">
                <Button className="text-xs font-semibold bg-[#0077B6] hover:bg-[#0096C7] text-white gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign In to Your Account
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
