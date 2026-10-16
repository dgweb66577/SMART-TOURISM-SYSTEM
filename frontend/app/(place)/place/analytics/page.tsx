import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { BarChart3, TrendingUp, Users, Eye, MapPin } from 'lucide-react'

export const metadata = {
  title: 'Venue Analytics — Goa Partner',
}

export default function PlaceAnalyticsPage() {
  const sources = [
    { source: 'Goa Smart Tourism PWA Search', share: '58%', visitors: '1,420' },
    { source: 'AI Curated Itineraries', share: '24%', visitors: '580' },
    { source: 'Direct Deals & Promos Link', share: '18%', visitors: '440' },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Traffic & Footfall Analytics</h1>
        <p className="text-sm text-slate-500">Track how tourists find and interact with your listing</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <Card className="p-5 border-slate-200/90 rounded-2xl bg-white shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">Monthly Impressions</span>
          <div className="text-3xl font-black text-slate-900 mt-2">18,420</div>
          <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
            <TrendingUp className="h-3.5 w-3.5" /> +22% vs last month
          </span>
        </Card>

        <Card className="p-5 border-slate-200/90 rounded-2xl bg-white shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">Profile Clicks</span>
          <div className="text-3xl font-black text-slate-900 mt-2">2,440</div>
          <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
            <TrendingUp className="h-3.5 w-3.5" /> +14% vs last month
          </span>
        </Card>

        <Card className="p-5 border-slate-200/90 rounded-2xl bg-white shadow-sm">
          <span className="text-xs font-semibold text-slate-500 uppercase">Directions Requested</span>
          <div className="text-3xl font-black text-slate-900 mt-2">890</div>
          <span className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
            <TrendingUp className="h-3.5 w-3.5" /> +9% vs last month
          </span>
        </Card>
      </div>

      <Card className="border-slate-200/90 shadow-sm rounded-2xl bg-white overflow-hidden">
        <CardHeader className="p-6 border-b border-slate-100">
          <CardTitle className="text-base font-bold">Top Discovery Sources</CardTitle>
          <CardDescription className="text-xs">Where your venue visitors originate</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-slate-100">
            {sources.map((src, i) => (
              <div key={i} className="px-6 py-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{src.source}</h4>
                  <p className="text-xs text-slate-500">{src.visitors} unique visitors</p>
                </div>
                <span className="text-xs font-bold text-sky-800 bg-sky-100 px-2.5 py-1 rounded-full">
                  {src.share}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
