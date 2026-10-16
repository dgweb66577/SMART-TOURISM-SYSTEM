'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Store,
  Tag,
  Star,
  BarChart3,
  CalendarCheck,
  ShieldCheck,
  Palmtree,
  LogOut,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/stores/authStore'
import { toast } from 'sonner'

export function PlaceSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, clearAuth } = useAuthStore()

  const links = [
    { label: 'Overview', href: '/place/dashboard', icon: LayoutDashboard },
    { label: 'My Place Profile', href: '/place/profile', icon: Store },
    { label: 'Offers & Promos', href: '/place/offers', icon: Tag },
    { label: 'Customer Reviews', href: '/place/reviews', icon: Star },
    { label: 'Analytics', href: '/place/analytics', icon: BarChart3 },
    { label: 'Bookings', href: '/place/bookings', icon: CalendarCheck },
    { label: 'Verification', href: '/place/verification', icon: ShieldCheck },
  ]

  const handleSignOut = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      clearAuth()
      toast.success('Signed out')
      router.push('/login')
    } catch {
      toast.error('Failed to sign out')
    }
  }

  return (
    <aside className="w-64 border-r border-slate-200 bg-white flex flex-col justify-between h-screen sticky top-0">
      <div className="p-4 space-y-6">
        {/* Brand */}
        <div className="flex items-center gap-2.5 px-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#FF7B00] to-[#E06C00] flex items-center justify-center text-white shadow-sm">
            <Store className="h-5 w-5 text-amber-100" />
          </div>
          <div>
            <span className="font-extrabold text-base text-slate-900 block leading-tight">
              Goa<span className="text-[#0077B6]">Partner</span>
            </span>
            <span className="text-[10px] font-bold text-sky-800 bg-sky-100 px-1.5 py-0.2 rounded uppercase">
              Place Manager
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon
            const isActive =
              link.href === '/place/dashboard'
                ? pathname === '/place/dashboard'
                : pathname?.startsWith(link.href)

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-[#0077B6] text-white shadow-sm shadow-blue-500/20'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                {link.label}
              </Link>
            )
          })}
        </nav>
      </div>

      {/* Footer / Place Incharge details */}
      <div className="p-4 border-t border-slate-100 space-y-3">
        <div className="flex items-center gap-2.5 px-2">
          <div className="h-8 w-8 rounded-full bg-[#0077B6] text-white flex items-center justify-center font-bold text-xs">
            {user?.email?.charAt(0).toUpperCase() || 'P'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">
              {user?.email || 'vendor@curlies.goa'}
            </p>
            <p className="text-[10px] text-slate-400">Place Incharge</p>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  )
}
