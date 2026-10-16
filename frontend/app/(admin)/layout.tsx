'use client'

import React from 'react'
import { RoleGuard } from '@/components/auth/RoleGuard'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RoleGuard allowedRoles={['platform_admin']}>
      <div className="flex min-h-screen bg-slate-50 text-slate-900">
        <AdminSidebar />
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <main className="p-6 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
        </div>
      </div>
    </RoleGuard>
  )
}
