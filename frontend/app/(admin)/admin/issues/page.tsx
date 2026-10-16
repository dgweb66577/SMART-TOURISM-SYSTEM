import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { AlertCircle, Clock, ShieldAlert } from 'lucide-react'

export const metadata = {
  title: 'Reported Issues — Goa Smart Tourism Admin',
}

export default function AdminIssuesPage() {
  const issues = [
    {
      title: 'Inaccurate coordinates for South Vagator Cliff Shack',
      reportedBy: 'tourist@traveler.com',
      severity: 'Medium',
      date: 'Today at 08:30 AM',
      status: 'Open',
    },
    {
      title: 'Outdated menu prices for Curlies Beach Shack',
      reportedBy: 'visitor@goa.app',
      severity: 'Low',
      date: 'Yesterday at 4:12 PM',
      status: 'Investigating',
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Reported Issues & Inquiries</h1>
        <p className="text-sm text-slate-500">Track bug reports, inaccurate data flags, and customer disputes</p>
      </div>

      <div className="space-y-3">
        {issues.map((issue, i) => (
          <Card key={i} className="p-5 border-slate-200/90 rounded-2xl bg-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-rose-500" />
                <h3 className="font-bold text-sm text-slate-900">{issue.title}</h3>
                <span className="text-[10px] font-bold uppercase bg-rose-50 text-rose-700 px-2 py-0.5 rounded-full">
                  {issue.severity}
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Reported by {issue.reportedBy} &bull; {issue.date}
              </p>
            </div>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md self-start sm:self-auto">
              {issue.status}
            </span>
          </Card>
        ))}
      </div>
    </div>
  )
}
