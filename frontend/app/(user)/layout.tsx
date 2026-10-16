'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Palmtree,
  Search,
  Compass,
  User as UserIcon,
  Home,
  Luggage,
  LayoutDashboard,
  LogOut,
  ChevronDown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/lib/stores/authStore'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, role, clearAuth, initialize, setUser } = useAuthStore()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Initialize auth state and subscribe to auth changes
  useEffect(() => {
    initialize()

    try {
      const supabase = createClient()
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        if (session?.user) {
          setUser(session.user)
          useAuthStore.getState().fetchRole(session.user.id)
        } else {
          clearAuth()
        }
      })

      return () => {
        subscription.unsubscribe()
      }
    } catch (err) {
      console.error('Failed to setup auth listener:', err)
    }
  }, [initialize, setUser, clearAuth])

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleSignOut = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
      clearAuth()
      setDropdownOpen(false)
      toast.success('Signed out successfully')
      router.push('/login')
    } catch {
      toast.error('Failed to sign out. Please try again.')
    }
  }

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    ...(user ? [{ label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }] : []),
    { label: 'Explore', href: '/explore', icon: Compass },
    { label: 'Trips', href: '/trips', icon: Luggage },
    { label: 'Profile', href: '/profile', icon: UserIcon },
  ]

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-slate-900 pb-20 md:pb-0">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#0077B6] to-[#0096C7] flex items-center justify-center text-white shadow-md shadow-sky-500/20">
              <Palmtree className="h-5 w-5 text-amber-200" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight text-slate-900 leading-none">
                Goa<span className="text-[#FF7B00]">Smart</span>
              </span>
              <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
                Explore &bull; Stay &bull; Vibe
              </span>
            </div>
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-4">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search beaches, beach shacks, heritage forts, cafes..."
                className="w-full h-10 pl-10 pr-4 rounded-full border border-slate-200 bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#0077B6] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Right Navigation & Auth State */}
          <div className="flex items-center gap-2 sm:gap-3">
            <Link href="/explore" className="hidden sm:inline-flex text-xs font-semibold text-slate-600 hover:text-[#0077B6] px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors">
              Destinations
            </Link>

            {user && (
              <Link href="/dashboard" className="hidden sm:inline-flex text-xs font-semibold text-sky-800 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg transition-colors">
                Dashboard
              </Link>
            )}

            {role === 'platform_admin' && (
              <Link href="/admin">
                <Button size="sm" variant="outline" className="text-xs border-amber-300 bg-amber-50 text-amber-900 hover:bg-amber-100">
                  Admin Portal
                </Button>
              </Link>
            )}

            {role === 'place_incharge' && (
              <Link href="/place/dashboard">
                <Button size="sm" variant="outline" className="text-xs border-blue-300 bg-blue-50 text-blue-900 hover:bg-blue-100">
                  Place Manager
                </Button>
              </Link>
            )}

            {user ? (
              <div className="flex items-center gap-2 sm:gap-3">
                <Button
                  id="direct-sign-out-btn"
                  size="sm"
                  variant="outline"
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 shadow-sm"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Sign Out</span>
                </Button>

                <div className="relative" ref={dropdownRef}>
                  <button
                    id="user-menu-button"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-1.5 rounded-full focus:outline-none focus:ring-2 focus:ring-[#0077B6] focus:ring-offset-2"
                    aria-haspopup="true"
                    aria-expanded={dropdownOpen}
                  >
                  <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-[#0077B6] to-[#00B4D8] text-white flex items-center justify-center font-bold text-xs ring-2 ring-sky-100 hover:ring-sky-300 transition-all shadow-sm">
                    {user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <ChevronDown className={`h-3.5 w-3.5 text-slate-500 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div
                    id="user-dropdown-menu"
                    className="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/60 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    role="menu"
                  >
                    {/* User info header */}
                    <div className="px-4 py-2.5 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900 truncate">{user.email}</p>
                      <p className="text-[10px] text-slate-400 capitalize">{role?.replace('_', ' ') || 'Tourist'}</p>
                    </div>

                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                      role="menuitem"
                    >
                      <UserIcon className="h-3.5 w-3.5 text-slate-400" />
                      My Profile
                    </Link>

                    <Link
                      href="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                      role="menuitem"
                    >
                      <LayoutDashboard className="h-3.5 w-3.5 text-slate-400" />
                      Dashboard
                    </Link>

                    <div className="border-t border-slate-100 mt-1 pt-1">
                      <button
                        id="sign-out-button"
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
                        role="menuitem"
                      >
                        <LogOut className="h-3.5 w-3.5" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button size="sm" variant="ghost" className="text-xs font-semibold text-slate-700">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="text-xs font-semibold bg-[#FF7B00] hover:bg-[#e06c00] text-white shadow-sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1">{children}</main>

      {/* Mobile Bottom Navigation Bar (PWA Style) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg border-t border-slate-200/90 px-2 py-1 shadow-lg">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname?.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center justify-center py-1.5 px-3 rounded-lg transition-colors ${
                  isActive
                    ? 'text-[#0077B6] font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'}`} />
                <span className="text-[10px] mt-0.5">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
