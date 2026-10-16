'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/lib/stores/authStore'
import type { UserRole } from '@/lib/supabase/types'
import { Loader2 } from 'lucide-react'

interface RoleGuardProps {
  allowedRoles: UserRole[]
  children: React.ReactNode
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const router = useRouter()
  const { user, role, isLoading, initialize } = useAuthStore()

  useEffect(() => {
    initialize()
  }, [initialize])

  useEffect(() => {
    if (isLoading) return

    if (!user) {
      router.replace('/login')
      return
    }

    if (!role || !allowedRoles.includes(role)) {
      router.replace('/unauthorized')
    }
  }, [user, role, isLoading, allowedRoles, router])

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-4">
        <Loader2 className="h-10 w-10 animate-spin text-[#0077B6]" />
        <p className="text-sm font-medium text-slate-500">Verifying permissions...</p>
      </div>
    )
  }

  if (!user || !role || !allowedRoles.includes(role)) {
    return null
  }

  return <>{children}</>
}
