'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import {
  Compass,
  Search,
  User as UserIcon,
  Home,
  Luggage,
  LayoutDashboard,
  LogOut,
  ChevronDown,
  UtensilsCrossed,
  Sparkles,
  Share2,
  Menu,
  X,
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

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
    { label: 'Restaurants', href: '/restaurants', icon: UtensilsCrossed },
    ...(user ? [{ label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }] : []),
    { label: 'Explore', href: '/explore', icon: Compass },
    { label: 'Trips', href: '/trips', icon: Luggage },
    { label: 'Profile', href: '/profile', icon: UserIcon },
  ]

  const headerLinks = [
    { label: 'Activities', href: '/explore?cat=activities' },
    { label: 'Rentals', href: '/explore?cat=rentals' },
    { label: 'Taxi', href: '/explore?cat=taxi' },
    { label: 'Places', href: '/explore' },
    { label: 'Packages', href: '/explore?cat=packages' },
    { label: 'Events', href: '/explore?cat=events' },
    { label: 'Restaurants', href: '/restaurants', highlight: true },
  ]

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Page link copied to clipboard!')
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-slate-900 pb-20 md:pb-0">
      {/* Top Navbar — goa.app style without app logo */}
      <header className="sticky top-0 z-40 w-full border-b border-slate-200/90 bg-white/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Left area: Clean minimal home link (NO APP LOGO as requested) */}
          <div className="flex items-center gap-6">
            <Link
              href="/"
              className="text-base font-bold tracking-tight text-slate-800 hover:text-[#EA580C] transition-colors"
            >
              Goa
            </Link>

            {/* Desktop Navigation Links (goa.app style) */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {headerLinks.map((item) => {
                const isActive =
                  item.href === '/restaurants'
                    ? pathname === '/restaurants'
                    : pathname === item.href
                return (
                  <Link
                    key={item.label}
                    href={item.href}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                      isActive
                        ? 'text-[#EA580C] font-semibold bg-orange-50'
                        : item.highlight
                        ? 'text-slate-800 hover:text-[#EA580C] hover:bg-orange-50/60 font-semibold'
                        : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
                    }`}
                  >
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>

          {/* Center Search Bar */}
          <div className="hidden md:flex flex-1 max-w-xs xl:max-w-sm mx-2">
            <div className="relative w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search places, shacks, dishes..."
                className="w-full h-9 pl-9 pr-4 text-xs rounded-full border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:bg-white transition-all"
              />
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Share button (as seen in goa.app) */}
            <button
              onClick={handleShare}
              title="Share page"
              className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors hidden sm:inline-flex"
            >
              <Share2 className="h-4 w-4" />
            </button>

            {user && (
              <Link
                href="/dashboard"
                className={`hidden sm:inline-flex text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                  pathname === '/dashboard'
                    ? 'text-orange-700 bg-orange-100'
                    : 'text-slate-700 bg-slate-100 hover:bg-slate-200'
                }`}
              >
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
              <div className="flex items-center gap-2">
                <Button
                  id="direct-sign-out-btn"
                  size="sm"
                  variant="outline"
                  onClick={handleSignOut}
                  className="flex items-center gap-1.5 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 shadow-sm h-8 px-2.5"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>

                <div className="relative" ref={dropdownRef}>
                  <button
                    id="user-menu-button"
                    onClick={() => setDropdownOpen((prev) => !prev)}
                    className="flex items-center gap-1 rounded-full focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:ring-offset-2"
                    aria-haspopup="true"
                    aria-expanded={dropdownOpen}
                  >
                    <div className="h-8 w-8 rounded-full bg-[#EA580C] text-white flex items-center justify-center font-bold text-xs shadow-sm">
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

                      <Link
                        href="/restaurants"
                        onClick={() => setDropdownOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-orange-600 hover:bg-orange-50 transition-colors"
                        role="menuitem"
                      >
                        <UtensilsCrossed className="h-3.5 w-3.5" />
                        Restaurants
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
                  <Button size="sm" variant="ghost" className="text-xs font-semibold text-slate-700 h-8">
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="text-xs font-semibold bg-[#EA580C] hover:bg-[#c2410c] text-white shadow-sm h-8">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
            {headerLinks.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2 rounded-lg text-sm font-medium ${
                  pathname === item.href
                    ? 'bg-orange-50 text-[#EA580C] font-semibold'
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </div>
        )}
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
                    ? 'text-[#EA580C] font-bold'
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
