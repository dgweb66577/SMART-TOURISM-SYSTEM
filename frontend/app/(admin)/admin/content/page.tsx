import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { FileText, Plus, Sparkles, Image as ImageIcon } from 'lucide-react'

export const metadata = {
  title: 'Content Management — Goa Smart Tourism Admin',
}

export default function AdminContentPage() {
  const banners = [
    { title: 'Sunburn Goa 2025 Early Access Banner', status: 'Published', slot: 'Homepage Hero' },
    { title: 'Monsoon Waterfalls & Secret Springs Trail', status: 'Draft', slot: 'Discover Itineraries' },
    { title: 'Authentic Goan Bakeries (Pao & Bebinca) Feature', status: 'Published', slot: 'Spotlight' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Content & Campaign Management</h1>
          <p className="text-sm text-slate-500">Manage promotional banners, featured itineraries, and editorial content</p>
        </div>
        <Button className="bg-[#0077B6] hover:bg-[#005f92] text-white flex items-center gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          Create Banner
        </Button>
      </div>

      <div className="space-y-3">
        {banners.map((b, i) => (
          <Card key={i} className="p-5 border-slate-200/90 rounded-2xl bg-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <ImageIcon className="h-4 w-4 text-sky-600" />
                <h3 className="font-bold text-sm text-slate-900">{b.title}</h3>
              </div>
              <p className="text-xs text-slate-500">Display Slot: {b.slot}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                b.status === 'Published'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-700'
              }`}>
                {b.status}
              </span>
              <Button size="sm" variant="outline" className="text-xs">
                Edit
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
