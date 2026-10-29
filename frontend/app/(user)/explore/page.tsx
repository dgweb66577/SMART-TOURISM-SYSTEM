import React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { MapPin, Star, Filter, Sparkles } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Explore Destinations — Goa Smart Tourism',
  description: 'Explore beaches, historic forts, seaside shacks, and hidden gems across Goa.',
}

export const dynamic = 'force-dynamic'

const defaultPlaces = [
  {
    id: 'p1',
    name: 'Palolem Beach',
    category: 'Beach',
    address: 'Canacona, South Goa',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800',
  },
  {
    id: 'p2',
    name: 'Aguada Fort & Lighthouse',
    category: 'Heritage Fort',
    address: 'Sinquerim, Candolim',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800',
  },
  {
    id: 'p3',
    name: 'Curlies Beach Shack',
    category: 'Restaurant & Bar',
    address: 'Anjuna Beach',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800',
  },
  {
    id: 'p4',
    name: 'Fontainhas Latin Quarter',
    category: 'Heritage',
    address: 'Panaji, Central Goa',
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=800',
  },
  {
    id: 'p5',
    name: 'Vagator Beach & Chapora',
    category: 'Beach & Cliffs',
    address: 'North Goa',
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800',
  },
  {
    id: 'p6',
    name: 'Dudhsagar Waterfalls',
    category: 'Nature & Adventure',
    address: 'Sanguem, South Goa',
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800',
  },
]

export default async function ExplorePage() {
  let approvedDbPlaces: any[] = []

  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('places')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })

    if (data && data.length > 0) {
      approvedDbPlaces = data.map((p: any) => ({
        id: p.id,
        name: p.name,
        category: p.category,
        address: p.address,
        rating: 4.9,
        image:
          p.photos && p.photos.length > 0
            ? p.photos[0]
            : 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800',
        isLiveSubmission: true,
      }))
    }
  } catch {
    // Fallback cleanly to default places if database is momentarily unreachable
  }

  const allPlaces = [...approvedDbPlaces, ...defaultPlaces]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Explore Goa
          </h1>
          <p className="text-sm text-slate-500">
            Browse verified coastal attractions, heritage points, and local favorites
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 shadow-sm self-start sm:self-auto">
          <Filter className="h-3.5 w-3.5" />
          Filter by Region & Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allPlaces.map((place) => (
          <Card
            key={place.id}
            className="group overflow-hidden rounded-2xl border-slate-200/80 hover:shadow-lg transition-all bg-white"
          >
            <div className="relative h-52 w-full overflow-hidden bg-slate-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={place.image}
                alt={place.name}
                className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {place.rating}
              </span>
              {place.isLiveSubmission && (
                <span className="absolute top-3 left-3 bg-emerald-600/95 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-md">
                  <Sparkles className="h-3 w-3" />
                  Verified Partner
                </span>
              )}
            </div>
            <CardContent className="p-4 space-y-1.5">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#FF7B00]">
                {place.category}
              </span>
              <h3 className="font-bold text-base text-slate-900 group-hover:text-[#0077B6] transition-colors">
                {place.name}
              </h3>
              <p className="flex items-center gap-1.5 text-xs text-slate-500">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                {place.address}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
