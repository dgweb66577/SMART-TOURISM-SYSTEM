'use client'

import React, { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Calendar,
  MapPin,
  Star,
  Search,
  Sparkles,
  Music,
  Waves,
  Utensils,
  Palette,
  PartyPopper,
  Heart,
  Grid,
  Filter,
  ArrowRight,
  Clock,
  Ticket,
  ChevronRight,
} from 'lucide-react'
import {
  EventItem,
  EVENT_CATEGORIES,
  EventTimeFilter,
  EventCategory,
} from '@/lib/data/eventsData'

interface EventsViewClientProps {
  initialEvents: EventItem[]
}

export default function EventsViewClient({ initialEvents }: EventsViewClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedCity, setSelectedCity] = useState<string>('all')
  const [selectedTimeFilter, setSelectedTimeFilter] = useState<string>('all')

  // Extract unique cities
  const cities = useMemo(() => {
    const set = new Set(initialEvents.map((e) => e.city))
    return ['all', ...Array.from(set)]
  }, [initialEvents])

  // Filtered list
  const filteredEvents = useMemo(() => {
    return initialEvents.filter((event) => {
      // 1. Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesName = event.name.toLowerCase().includes(q)
        const matchesVenue = event.venue.toLowerCase().includes(q)
        const matchesCity = event.city.toLowerCase().includes(q)
        const matchesDesc = event.description.toLowerCase().includes(q)
        const matchesArtist = event.lineup?.some((a) => a.toLowerCase().includes(q))
        if (!matchesName && !matchesVenue && !matchesCity && !matchesDesc && !matchesArtist) {
          return false
        }
      }

      // 2. Category
      if (selectedCategory !== 'all' && event.category !== selectedCategory) {
        return false
      }

      // 3. City
      if (selectedCity !== 'all' && event.city !== selectedCity) {
        return false
      }

      // 4. Time filter (Today, Tomorrow, Weekend)
      if (selectedTimeFilter !== 'all') {
        if (selectedTimeFilter === 'today' && event.timeFilter !== 'today') return false
        if (selectedTimeFilter === 'tomorrow' && event.timeFilter !== 'tomorrow') return false
        if (selectedTimeFilter === 'weekend' && event.timeFilter !== 'weekend') return false
      }

      return true
    })
  }, [initialEvents, searchQuery, selectedCategory, selectedCity, selectedTimeFilter])

  // Featured / Popular / Party subsets
  const popularEvents = useMemo(() => {
    return initialEvents.filter((e) => e.isPopular).slice(0, 4)
  }, [initialEvents])

  const partyEvents = useMemo(() => {
    return initialEvents.filter((e) => e.isParty).slice(0, 4)
  }, [initialEvents])

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'music':
        return <Music className="h-4 w-4" />
      case 'party_nightlife':
        return <Sparkles className="h-4 w-4" />
      case 'beach_festival':
        return <Waves className="h-4 w-4" />
      case 'food_drink':
        return <Utensils className="h-4 w-4" />
      case 'cultural_festival':
        return <Palette className="h-4 w-4" />
      case 'traditional_carnival':
        return <PartyPopper className="h-4 w-4" />
      case 'workshop_wellness':
        return <Heart className="h-4 w-4" />
      default:
        return <Grid className="h-4 w-4" />
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-slate-900 pb-24">
      {/* 1. Header Banner styled exactly like goa.app */}
      <section className="relative bg-slate-900 text-white py-12 sm:py-16 px-4 sm:px-6 overflow-hidden">
        {/* Subtle decorative background lights */}
        <div className="absolute inset-0 bg-gradient-to-r from-orange-600/20 via-rose-600/20 to-purple-600/20 pointer-events-none" />
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#EA580C]/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto space-y-6">
          <div className="max-w-2xl space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <Sparkles className="h-3.5 w-3.5" /> What&apos;s Happening in Goa
            </span>
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-tight text-white">
              EVENTS & PARTIES IN <span className="text-[#EA580C]">GOA</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300">
              Explore today, tomorrow, weekend music festivals, beach raves, and cultural carnivals.
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="bg-white/10 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-white/15 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
              {/* Search input */}
              <div className="sm:col-span-6 relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search events, artists, venues (e.g. HillTop, Sunburn, Fado)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white text-slate-900 placeholder:text-slate-400 text-sm font-medium border border-transparent focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                />
              </div>

              {/* City Filter */}
              <div className="sm:col-span-3">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white text-slate-900 text-sm font-semibold border border-transparent focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                >
                  <option value="all">All Cities / Regions</option>
                  {cities
                    .filter((c) => c !== 'all')
                    .map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                </select>
              </div>

              {/* Category Dropdown */}
              <div className="sm:col-span-3">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white text-slate-900 text-sm font-semibold border border-transparent focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                >
                  {EVENT_CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Quick Date Filters (Today, Tomorrow, Weekend matching goa.app) */}
            <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/10 text-xs font-bold">
              <span className="text-slate-400 uppercase tracking-wider text-[11px] mr-1">
                Filter by date:
              </span>
              {[
                { id: 'all', label: 'ALL TYPES' },
                { id: 'today', label: 'Today' },
                { id: 'tomorrow', label: 'Tomorrow' },
                { id: 'weekend', label: 'Weekend' },
              ].map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => setSelectedTimeFilter(btn.id)}
                  className={`px-3.5 py-1.5 rounded-lg transition-all ${
                    selectedTimeFilter === btn.id
                      ? 'bg-[#EA580C] text-white shadow-sm'
                      : 'bg-white/10 text-white/90 hover:bg-white/20'
                  }`}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Category Icon Strip */}
      <section className="border-b border-slate-200 bg-white py-4 px-4 sm:px-6 sticky top-16 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto flex items-center gap-2.5 overflow-x-auto scrollbar-none py-1">
          {EVENT_CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border shrink-0 ${
                  isSelected
                    ? 'bg-[#EA580C] text-white border-[#EA580C] shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                {getCategoryIcon(cat.id)}
                <span>{cat.label}</span>
              </button>
            )
          })}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
        {/* If user is filtering or searching, show results directly */}
        {searchQuery || selectedCategory !== 'all' || selectedCity !== 'all' || selectedTimeFilter !== 'all' ? (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">
                  Search Results
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Showing {filteredEvents.length} {filteredEvents.length === 1 ? 'event' : 'events'} matching your filters
                </p>
              </div>

              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                  setSelectedCity('all')
                  setSelectedTimeFilter('all')
                }}
                className="text-xs font-bold text-[#EA580C] hover:underline"
              >
                Reset Filters
              </button>
            </div>

            {filteredEvents.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                <PartyPopper className="h-10 w-10 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No Events Found</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  We couldn&apos;t find any events matching your selected criteria. Try resetting your search filters or exploring all categories.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                    setSelectedCity('all')
                    setSelectedTimeFilter('all')
                  }}
                  className="px-4 py-2 rounded-xl bg-[#EA580C] text-white text-xs font-bold hover:bg-[#c2410c] transition-colors"
                >
                  View All Events
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </section>
        ) : (
          <>
            {/* 3. POPULAR EVENTS IN GOA (Matching goa.app) */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">
                    POPULAR EVENTS IN <span className="text-[#EA580C]">GOA</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Most booked and highly rated experiences across the sunshine state
                  </p>
                </div>

                <Link
                  href="#all-events"
                  className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-[#EA580C] hover:underline"
                >
                  View all <ChevronRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {popularEvents.map((event) => (
                  <EventCard key={event.id} event={event} compact />
                ))}
              </div>
            </section>

            {/* 4. BEST PARTY EVENTS IN GOA (Matching goa.app) */}
            <section className="space-y-4 pt-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">
                    BEST PARTY EVENTS IN <span className="text-[#EA580C]">GOA</span>
                  </h2>
                  <p className="text-xs text-slate-500">
                    Electrifying beach clubs, psychedelic trance gatherings, and sunset sessions
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
                {partyEvents.map((event) => (
                  <EventCard key={event.id} event={event} compact />
                ))}
              </div>
            </section>

            {/* 5. ALL UPCOMING EVENTS IN GOA (Matching goa.app) */}
            <section id="all-events" className="space-y-5 pt-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">
                  UPCOMING EVENTS IN <span className="text-[#EA580C]">GOA</span>
                </h2>
                <p className="text-xs text-slate-500">
                  Full calendar of live concerts, cultural festivals, food fairs, and weekend celebrations
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {initialEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </section>
          </>
        )}
      </div>
    </div>
  )
}

// Sub-component: Event Card matching EventCardGeneral from goa.app
function EventCard({ event, compact = false }: { event: EventItem; compact?: boolean }) {
  return (
    <Link
      href={`/events/${event.slug}`}
      className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
    >
      <div>
        {/* Cover Image Container */}
        <div className={`relative ${compact ? 'h-44' : 'h-52'} w-full overflow-hidden bg-slate-900`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={event.image}
            alt={event.name}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Category Tag (Top Left) */}
          <div className="absolute top-3 left-3 z-10">
            <span className="bg-white/95 backdrop-blur-md text-slate-900 text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm border border-slate-200">
              {event.categoryLabel}
            </span>
          </div>

          {/* Location Badge (Top Right) */}
          <div className="absolute top-3 right-3 z-10">
            <span className="bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1">
              <MapPin className="h-3 w-3 text-[#EA580C]" />
              {event.city}
            </span>
          </div>

          {/* Free Badge if free */}
          {event.free && (
            <div className="absolute bottom-3 right-3 z-10">
              <span className="bg-emerald-600 text-white text-[10px] font-extrabold uppercase px-2 py-0.5 rounded shadow-sm">
                Free Entry
              </span>
            </div>
          )}
        </div>

        {/* Card Body matching date-details-parent from goa.app */}
        <div className="p-4 sm:p-5 flex items-start gap-3.5">
          {/* Date Container (Left Box) */}
          <div className="flex flex-col items-center justify-center shrink-0 w-12 text-center border-r border-slate-200 pr-3">
            <span className="text-[11px] font-extrabold text-[#EA580C] uppercase tracking-wider">
              {event.month}
            </span>
            <span className="text-xl font-black text-slate-900 leading-none mt-0.5">
              {event.day}
            </span>
          </div>

          {/* Event Info (Right) */}
          <div className="flex-1 min-w-0 space-y-1.5">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-[#EA580C] transition-colors line-clamp-2">
              {event.name}
            </h3>

            <p className="text-xs text-slate-500 flex items-center gap-1 truncate">
              <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span>{event.venue}</span>
            </p>

            <div className="flex items-center gap-2 pt-1 text-xs">
              <span className="flex items-center gap-1 font-bold text-slate-800">
                <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                {event.rating}
              </span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-500 font-medium">
                {event.reviewsCount} reviews
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer / Price & CTA */}
      <div className="px-4 sm:px-5 pb-4 pt-2 border-t border-slate-100 flex items-center justify-between">
        <div>
          <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
            Pricing
          </span>
          <span className="text-sm font-extrabold text-slate-900">
            {event.free ? (
              <span className="text-emerald-700 font-bold">Free Entry</span>
            ) : (
              <>
                ₹{event.price.toLocaleString()}{' '}
                <span className="text-xs font-normal text-slate-500">
                  {event.priceUnit}
                </span>
              </>
            )}
          </span>
        </div>

        <span className="inline-flex items-center gap-1 text-xs font-bold text-[#EA580C] group-hover:translate-x-0.5 transition-transform">
          Details <ArrowRight className="h-3.5 w-3.5" />
        </span>
      </div>
    </Link>
  )
}

