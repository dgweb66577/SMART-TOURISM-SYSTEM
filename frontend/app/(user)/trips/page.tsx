import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Luggage, Plus, Calendar, MapPin, Sparkles } from 'lucide-react'

export const metadata = {
  title: 'My Trips — Goa Smart Tourism',
  description: 'Manage and customize your Goa travel itineraries and saved trails.',
}

export default function TripsPage() {
  const savedTrips = [
    {
      title: 'North Goa Weekend Sun & Shacks',
      dates: 'Upcoming • Oct 24 - Oct 26',
      stops: 6,
      status: 'Active',
      places: ['Calangute Beach', 'Curlies Shack', 'Chapora Fort', 'Thalassa Siolim'],
    },
    {
      title: 'Heritage & Quiet Shores of South Goa',
      dates: 'Saved Plan',
      stops: 4,
      status: 'Draft',
      places: ['Palolem Beach', 'Cabo De Rama', 'Fontainhas', 'Martin’s Corner'],
    },
  ]

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            My Goa Trips
          </h1>
          <p className="text-sm text-slate-500">
            Smart itineraries, saved spots, and personalized travel schedules
          </p>
        </div>
        <Button className="bg-[#0077B6] hover:bg-[#005f92] text-white flex items-center gap-2 self-start sm:self-auto">
          <Plus className="h-4 w-4" />
          Plan New Itinerary
        </Button>
      </div>

      <div className="space-y-4">
        {savedTrips.map((trip, i) => (
          <Card key={i} className="p-5 border-slate-200/80 rounded-2xl bg-white shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-800 bg-sky-100 px-2.5 py-0.5 rounded-full">
                    {trip.status}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {trip.dates}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900">{trip.title}</h3>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {trip.places.map((place, pIdx) => (
                    <span
                      key={pIdx}
                      className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-md flex items-center gap-1"
                    >
                      <MapPin className="h-3 w-3 text-slate-400" />
                      {place}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 self-end md:self-center">
                <Button variant="outline" size="sm" className="text-xs">
                  Edit Plan
                </Button>
                <Button size="sm" className="bg-[#FF7B00] hover:bg-[#e06c00] text-white text-xs">
                  Start Guide
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
