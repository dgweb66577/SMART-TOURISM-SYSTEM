import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Users, MapPin, AlertCircle, MessageSquare, TrendingUp, CheckCircle2, Clock } from 'lucide-react'

export const metadata = {
  title: 'Admin Overview — Goa Smart Tourism',
}

export default function AdminOverviewPage() {
  const stats = [
    {
      title: 'Total Users',
      value: '12,480',
      change: '+14% this month',
      icon: Users,
      color: 'text-sky-600 bg-sky-50',
    },
    {
      title: 'Verified Places',
      value: '384',
      change: '+8 this week',
      icon: MapPin,
      color: 'text-emerald-600 bg-emerald-50',
    },
    {
      title: 'Pending Issues',
      value: '12',
      change: '3 critical alerts',
      icon: AlertCircle,
      color: 'text-rose-600 bg-rose-50',
    },
    {
      title: 'User Reviews',
      value: '4,892',
      change: '98% positive sentiment',
      icon: MessageSquare,
      color: 'text-amber-600 bg-amber-50',
    },
  ]

  const recentSubmissions = [
    {
      place: 'Curlies Sunset Point',
      category: 'Beach Shack',
      submittedBy: 'vendor@curlies.goa',
      time: '15 mins ago',
      status: 'Pending Review',
    },
    {
      place: 'Morjim Kite Surfing Club',
      category: 'Water Sports',
      submittedBy: 'info@morjimkites.com',
      time: '2 hours ago',
      status: 'Approved',
    },
    {
      place: 'Reis Magos Heritage Gallery',
      category: 'Culture & Museum',
      submittedBy: 'curator@reismagos.in',
      time: '5 hours ago',
      status: 'Pending Review',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Platform Administration
        </h1>
        <p className="text-sm text-slate-500">
          Global system health, place listings verification, and user management
        </p>
      </div>

      {/* 4 Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((s, i) => {
          const Icon = s.icon
          return (
            <Card key={i} className="border-slate-200/90 shadow-sm rounded-2xl bg-white p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {s.title}
                </span>
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${s.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <div className="mt-3">
                <div className="text-3xl font-black text-slate-900 tracking-tight">
                  {s.value}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 font-medium">
                  <TrendingUp className="h-3.5 w-3.5 text-emerald-600" />
                  {s.change}
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Place Approvals Queue Table */}
      <Card className="border-slate-200/90 shadow-sm rounded-2xl bg-white overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
          <CardTitle className="text-base font-bold text-slate-900">
            Recent Place Verification Requests
          </CardTitle>
          <CardDescription className="text-xs text-slate-500">
            Listings submitted by business in-charges requiring administrator approval
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {recentSubmissions.map((row, i) => (
              <div
                key={i}
                className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors"
              >
                <div className="space-y-1">
                  <h4 className="font-bold text-sm text-slate-900">{row.place}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="text-[#FF7B00] font-semibold">{row.category}</span>
                    <span>&bull;</span>
                    <span>{row.submittedBy}</span>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-slate-400 hidden sm:inline flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {row.time}
                  </span>
                  <span
                    className={`text-[11px] font-bold px-2.5 py-1 rounded-full ${
                      row.status === 'Approved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {row.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
