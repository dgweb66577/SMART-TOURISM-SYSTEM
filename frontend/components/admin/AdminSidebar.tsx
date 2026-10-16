'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  MapPin,
  AlertCircle,
  FileText,
  BarChart3,
  Settings,
  Palmtree,
  LogOut,
  ShieldAlert,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/stores/authStore'
import { toast } from 'sonner'

export function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, clearAuth } = useAuthStore()

  const links = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Places Moderation', href: '/admin/places', icon: MapPin },
    { label: 'Reported Issues', href: '/admin/issues', icon: AlertCircle },
    { label: 'Content Management', href: '/admin/content', icon: FileText },
    { label: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
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
          <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-[#0077B6] to-[#023E8A] flex items-center justify-center text-white shadow-sm">
            <Palmtree className="h-5 w-5 text-amber-200" />
          </div>
          <div>
            <span className="font-extrabold text-base text-slate-900 block leading-tight">
              Goa<span className="text-[#FF7B00]">Admin</span>
            </span>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded uppercase">
              Superadmin
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon
            const isActive =
              link.href === '/admin'
                ? pathname === '/admin'
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

      {/* Footer / User Profile */}
      <div className="p-4 border-t border-slate-100 space-y-3">
        <div className="flex items-center gap-2.5 px-2">
          <div className="h-8 w-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs">
            {user?.email?.charAt(0).toUpperCase() || 'A'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-900 truncate">
              {user?.email || 'admin@goa.app'}
            </p>
            <p className="text-[10px] text-slate-400">Platform Admin</p>
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
