import React from 'react'
import Link from 'next/link'
import { Palmtree, Waves } from 'lucide-react'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen flex flex-col justify-between bg-gradient-to-br from-amber-50/70 via-sky-50/50 to-blue-50/60 text-slate-900 selection:bg-[#0077B6] selection:text-white">
      {/* Ambient background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-gradient-to-br from-[#FF7B00]/15 to-transparent blur-3xl" />
        <div className="absolute top-1/2 -left-32 w-96 h-96 rounded-full bg-gradient-to-tr from-[#0077B6]/15 to-transparent blur-3xl" />
      </div>

      {/* Top Header */}
      <header className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2.5 group transition-transform active:scale-95"
        >
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-[#0077B6] to-[#0096C7] flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:shadow-lg transition-all">
            <Palmtree className="h-5 w-5 text-amber-200" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight text-slate-900 leading-none">
              Goa<span className="text-[#FF7B00]">Smart</span>
            </span>
            <span className="text-[10px] text-slate-500 font-medium tracking-widest uppercase">
              Tourism PWA
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="text-xs font-semibold text-slate-600 hover:text-[#0077B6] flex items-center gap-1.5 transition-colors"
        >
          <Waves className="h-3.5 w-3.5 text-[#0077B6]" />
          Explore Places
        </Link>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8">
        <div className="w-full max-w-lg">{children}</div>
      </main>

      {/* Minimal Footer */}
      <footer className="w-full py-4 text-center text-xs text-slate-400">
        &copy; {new Date().getFullYear()} Goa Smart Tourism Platform. All rights reserved.
      </footer>
    </div>
  )
}
