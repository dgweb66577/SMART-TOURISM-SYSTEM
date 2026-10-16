import React from 'react'
import Link from 'next/link'
import {
  Compass,
  MapPin,
  Star,
  Calendar,
  Tag,
  ArrowRight,
  Sparkles,
  Waves,
  Coffee,
  Ship,
  Flame,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function UserHomePage() {
  const categories = [
    { label: 'All Places', icon: Compass, active: true },
    { label: 'Beaches', icon: Waves, active: false },
    { label: 'Shacks & Food', icon: Coffee, active: false },
    { label: 'Water Sports', icon: Ship, active: false },
    { label: 'Nightlife', icon: Flame, active: false },
  ]

  const nearbyPlaces = [
    {
      id: '1',
      name: 'Palolem Beach',
      category: 'Beach & Sunset',
      location: 'Canacona, South Goa',
      rating: 4.9,
      reviews: 1420,
      image:
        'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800',
      tag: 'Top Rated',
    },
    {
      id: '2',
      name: 'Aguada Fort & Lighthouse',
      category: 'Heritage Fort',
      location: 'Sinquerim, Candolim',
      rating: 4.8,
      reviews: 980,
      image:
        'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?q=80&w=800',
      tag: 'Historic',
    },
    {
      id: '3',
      name: 'Curlies Beach Shack',
      category: 'Beach Shack & Bar',
      location: 'Anjuna Beach',
      rating: 4.7,
      reviews: 2150,
      image:
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800',
      tag: 'Trending',
    },
    {
      id: '4',
      name: 'Fontainhas Latin Quarter',
      category: 'Portuguese Heritage',
      location: 'Panaji, Central Goa',
      rating: 4.9,
      reviews: 840,
      image:
        'https://images.unsplash.com/photo-1590050752117-238cb0fb12b1?q=80&w=800',
      tag: 'Cultural Gem',
    },
  ]

  const itineraries = [
    {
      title: 'North Goa Coastal Trail',
      duration: '2 Days',
      vibe: 'Sun, Shacks & Water Sports',
      stops: 'Calangute • Anjuna • Vagator • Chapora Fort',
      badge: 'Most Popular',
    },
    {
      title: 'South Goa Serenity & Heritage',
      duration: '3 Days',
      vibe: 'Peaceful Shores & Portuguese Mansions',
      stops: 'Palolem • Colva • Cabo de Rama • Chandor',
      badge: 'Relaxation',
    },
    {
      title: 'Old Goa & Cultural Immersion',
      duration: '1 Day',
      vibe: 'Churches, Spice Plantations & Latin Quarter',
      stops: 'Bom Jesus • Se Cathedral • Fontainhas',
      badge: 'Cultural',
    },
  ]

  const events = [
    {
      title: 'Anjuna Wednesday Flea Market',
      date: 'Every Wednesday • 10:00 AM',
      location: 'South Anjuna Beach',
      category: 'Market & Live Music',
    },
    {
      title: 'Goa Sunset Acoustic Sessions',
      date: 'Friday & Saturday • 05:30 PM',
      location: 'Ashwem Beach Promenade',
      category: 'Live Music',
    },
    {
      title: 'Old Goa Heritage Walk & Tasting',
      date: 'Sunday • 08:30 AM',
      location: 'Fontainhas, Panaji',
      category: 'Guided Tour',
    },
  ]

  const offers = [
    {
      title: 'Scuba & Island Combo',
      partner: 'Grande Island Adventures',
      discount: '25% OFF',
      validity: 'Valid till Sunday',
    },
    {
      title: 'Sunset Shacks Seafood Platter',
      partner: 'Baga Seaside Shacks',
      discount: 'Buy 1 Get 1 Cocktail',
      validity: 'Daily 4 PM - 7 PM',
    },
  ]

  return (
    <div className="space-y-10 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#0077B6] via-[#0096C7] to-[#023E8A] text-white py-14 sm:py-20 px-4 sm:px-6">
        {/* Decorative Wave/Sun Blur */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#FF7B00]/25 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-5">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold tracking-wide text-amber-200">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Smart Travel Guide
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white drop-shadow-sm">
            Discover <span className="text-[#FFAA00]">Goa</span>
          </h1>

          <p className="text-base sm:text-lg text-sky-100 max-w-2xl mx-auto font-normal">
            Immerse yourself in sun-soaked beaches, Portuguese heritage, authentic seaside
            cuisine, and real-time smart recommendations.
          </p>

          {/* Quick Mobile Search */}
          <div className="pt-2 max-w-md mx-auto md:hidden">
            <div className="relative">
              <input
                type="text"
                placeholder="Search places, shacks, forts..."
                className="w-full h-12 pl-4 pr-12 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-sm shadow-xl focus:outline-none"
              />
              <Button
                size="sm"
                className="absolute right-1.5 top-1.5 h-9 bg-[#FF7B00] hover:bg-[#e06c00] text-white px-3 rounded-lg"
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((c, i) => {
            const Icon = c.icon
            return (
              <button
                key={i}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  c.active
                    ? 'bg-[#0077B6] text-white shadow-md shadow-sky-500/20'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <Icon className="h-3.5 w-3.5" />
                {c.label}
              </button>
            )
          })}
        </div>
      </section>

      {/* Section 1: Nearby Places */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
              Popular Goa Spots
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Top-rated coastal attractions and cultural landmarks
            </p>
          </div>
          <Link
            href="/explore"
            className="text-xs font-bold text-[#0077B6] hover:underline flex items-center gap-1"
          >
            View all <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {nearbyPlaces.map((place) => (
            <Card
              key={place.id}
              className="group overflow-hidden border-slate-200/80 hover:shadow-lg transition-all duration-300 rounded-2xl bg-white"
            >
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={place.image}
                  alt={place.name}
                  className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold px-2.5 py-1 rounded-full">
                  {place.tag}
                </span>
                <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-md text-slate-900 text-xs font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                  <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                  {place.rating}
                </span>
              </div>
              <CardContent className="p-4 space-y-1.5">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#FF7B00]">
                  {place.category}
                </span>
                <h3 className="font-bold text-base text-slate-900 group-hover:text-[#0077B6] transition-colors line-clamp-1">
                  {place.name}
                </h3>
                <p className="text-xs text-slate-500 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                  {place.location}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Section 2: AI Curated Itineraries */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-[#FF7B00]" />
              Smart Itineraries
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Personalized schedules curated for different travel vibes
            </p>
          </div>
          <Link
            href="/trips"
            className="text-xs font-bold text-[#0077B6] hover:underline flex items-center gap-1"
          >
            Plan trip <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {itineraries.map((itinerary, i) => (
            <Card
              key={i}
              className="p-5 border-slate-200/80 hover:border-sky-300 transition-all rounded-2xl bg-gradient-to-b from-white to-sky-50/30 flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-700 bg-sky-100 px-2.5 py-0.5 rounded-full">
                    {itinerary.badge}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">
                    {itinerary.duration}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-slate-900">{itinerary.title}</h3>
                <p className="text-xs text-slate-600 font-medium">{itinerary.vibe}</p>
                <div className="pt-2 text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                  <span className="font-semibold text-slate-700">Route: </span>
                  {itinerary.stops}
                </div>
              </div>

              <Link href="/trips">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs font-semibold text-[#0077B6] border-sky-200 hover:bg-sky-50"
                >
                  View Itinerary
                </Button>
              </Link>
            </Card>
          ))}
        </div>
      </section>

      {/* Section 3 & 4: Events & Offers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Events */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-[#0077B6]" />
              Happening in Goa
            </h2>
          </div>

          <div className="space-y-3">
            {events.map((event, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-slate-200 bg-white flex items-start justify-between gap-3 shadow-sm hover:border-slate-300 transition-colors"
              >
                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-[#FF7B00] uppercase">
                    {event.category}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900">{event.title}</h4>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="h-3 w-3" /> {event.location}
                  </p>
                </div>
                <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
                  {event.date}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Offers */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Tag className="h-5 w-5 text-[#FF7B00]" />
              Exclusive Spot Deals
            </h2>
          </div>

          <div className="space-y-3">
            {offers.map((offer, i) => (
              <div
                key={i}
                className="p-4 rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50/60 to-orange-50/40 flex items-center justify-between gap-3 shadow-sm"
              >
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full uppercase">
                    {offer.discount}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900">{offer.title}</h4>
                  <p className="text-xs text-slate-500">{offer.partner}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 block mb-1">
                    {offer.validity}
                  </span>
                  <Button
                    size="sm"
                    className="h-8 text-xs bg-[#FF7B00] hover:bg-[#e06c00] text-white"
                  >
                    Claim Deal
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
