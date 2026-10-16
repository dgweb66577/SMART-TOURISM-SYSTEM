import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Users, Search, ShieldCheck, MoreHorizontal } from 'lucide-react'

export const metadata = {
  title: 'Users Management — Goa Smart Tourism Admin',
}

export default function AdminUsersPage() {
  const users = [
    { email: 'admin@goa.app', role: 'platform_admin', joined: 'Jan 01, 2025', status: 'Active' },
    { email: 'vendor@curlies.goa', role: 'place_incharge', joined: 'Jan 03, 2025', status: 'Active' },
    { email: 'tourist@wanderer.in', role: 'user', joined: 'Jan 10, 2025', status: 'Active' },
    { email: 'incharge@aguada.gov.in', role: 'place_incharge', joined: 'Jan 12, 2025', status: 'Active' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Management & RBAC</h1>
          <p className="text-sm text-slate-500">View and promote users across platform roles</p>
        </div>
      </div>

      <Card className="border-slate-200/90 shadow-sm rounded-2xl bg-white overflow-hidden">
        <CardHeader className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base font-bold">Registered Users</CardTitle>
            <CardDescription className="text-xs">Database records from user_roles and auth.users</CardDescription>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by email..."
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-slate-200 text-xs bg-slate-50 focus:outline-none focus:ring-1 focus:ring-[#0077B6]"
            />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-3">User Email</th>
                  <th className="px-6 py-3">Assigned Role</th>
                  <th className="px-6 py-3">Joined Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium">
                {users.map((u, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-900">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                        u.role === 'platform_admin'
                          ? 'bg-amber-100 text-amber-800'
                          : u.role === 'place_incharge'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">{u.joined}</td>
                    <td className="px-6 py-4">
                      <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded text-[11px] font-semibold">
                        {u.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-slate-700">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
