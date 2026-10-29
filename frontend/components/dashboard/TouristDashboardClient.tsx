'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import {
  Compass,
  MapPin,
  Star,
  Sun,
  Waves,
  Calendar,
  Sparkles,
  ArrowRight,
  Send,
  Bot,
  Clock,
  PhoneCall,
  ShieldCheck,
  Tag,
  Luggage,
  Heart,
  ChevronRight,
  ChevronLeft,
  UtensilsCrossed,
  Car,
  Palmtree,
  PartyPopper,
  Package,
  Layers,
  Bike,
  Flame,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/stores/authStore'
import { toast } from 'sonner'
import { RestaurantsViewClient } from '@/components/restaurants/RestaurantsViewClient'

interface Place {
  id: string
  name: string
  category: string
  address: string
  description?: string | null
  photos?: string[] | null
  status: string
}

export function TouristDashboardClient() {
  const { user } = useAuthStore()
  const [activeTab, setActiveTab] = useState<'overview' | 'restaurants' | 'itinerary' | 'saved'>('overview')
  const [places, setPlaces] = useState<Place[]>([])
  const [loadingPlaces, setLoadingPlaces] = useState(true)
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['p1', 'p2', 'r1'])
  const [aiQuestion, setAiQuestion] = useState('')
  const [aiResponse, setAiResponse] = useState<string | null>(null)
  const [isAiLoading, setIsAiLoading] = useState(false)

  // Carousel ref for dashboard featured dining offers
  const offersScrollRef = useRef<HTMLDivElement>(null)

  const scrollOffers = (dir: 'left' | 'right') => {
    if (offersScrollRef.current) {
      const amount = dir === 'left' ? -280 : 280
      offersScrollRef.current.scrollBy({ left: amount, behavior: 'smooth' })
    }
  }

  // Fetch approved places for the user recommendations
  useEffect(() => {
    const fetchLivePlaces = async () => {
      try {
        const supabase = createClient()
        const { data } = await supabase
          .from('places')
          .select('*')
          .eq('status', 'approved')
          .limit(6)

        if (data && data.length > 0) {
          setPlaces(data)
        }
      } catch {
        // Fallback gracefully
      } finally {
        setLoadingPlaces(false)
      }
    }
    fetchLivePlaces()
  }, [])

  const toggleBookmark = (id: string, name: string) => {
    setBookmarkedIds((prev) => {
      const exists = prev.includes(id)
      if (exists) {
        toast.info(`Removed "${name}" from saved places`)
        return prev.filter((item) => item !== id)
      } else {
        toast.success(`Saved "${name}" to your Goa bucket list!`)
        return [...prev, id]
      }
    })
  }

  const handleAskAI = (promptText?: string) => {
    const query = promptText || aiQuestion
    if (!query.trim()) return

    setIsAiLoading(true)
    setAiResponse(null)

    setTimeout(() => {
      if (query.toLowerCase().includes('restaurant') || query.toLowerCase().includes('food') || query.toLowerCase().includes('eat')) {
        setAiResponse(
          '🍲 Top Dining Recommendation: Check out "Dropiet Beach Lounge" in Candolim or "1961" in Fontainhas for authentic Indo-Portuguese recipes. You can also explore the Restaurants tab right here for exclusive 10-20% discount passes!'
        )
      } else if (query.toLowerCase().includes('sunset')) {
        setAiResponse(
          '🌅 Top Sunset Pick: Head over to Vagator Cliffs or our newly verified partner "Sunset Shack Calangute" for chilled acoustic music and prime ocean views. Best arrival time: 5:45 PM before the 6:28 PM sunset.'
        )
      } else if (query.toLowerCase().includes('waterfall') || query.toLowerCase().includes('south')) {
        setAiResponse(
          '🌴 Scenic Nature Pick: Dudhsagar Waterfalls is at peak beauty. For coastal serenity, take the winding coast road down to Palolem Beach and Cola Beach lagoon!'
        )
      } else {
        setAiResponse(
          `✨ Smart Goa Recommendation for "${query}": North Goa is buzzing with sunset beach shacks, seafood bistros, and night markets, while South Goa offers tranquil heritage walks and uncrowded shores. Check out our curated itineraries or ask for a specific location!`
        )
      }
      setIsAiLoading(false)
    }, 600)
  }

  const userDisplayName =
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'Traveler'

  // Goa.app quick categories
  const goaCategories = [
    { label: 'Restaurants', icon: UtensilsCrossed, action: () => setActiveTab('restaurants'), highlight: true },
    { label: 'Activities', icon: Compass, href: '/explore?cat=activities' },
    { label: 'Rentals', icon: Bike, href: '/explore?cat=rentals' },
    { label: 'Taxi', icon: Car, href: '/explore?cat=taxi' },
    { label: 'Beach Shacks', icon: Palmtree, href: '/explore?cat=shacks' },
    { label: 'Packages', icon: Package, href: '/explore?cat=packages' },
    { label: 'Events', icon: PartyPopper, href: '/explore?cat=events' },
  ]

  // Featured dining offers (from Image 2 & goa.app)
  const dashboardOffers = [
    {
      name: "MO's Cafe",
      offer: 'Flat 15% Off',
      logo: "MO'S",
      logoBg: 'bg-white text-stone-900 border border-stone-800',
      location: 'Panaji',
      image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=600',
    },
    {
      name: 'Dropiet Beach Lounge',
      offer: 'Flat 10% Off',
      logo: 'DROPIET',
      logoBg: 'bg-black text-amber-300',
      location: 'Candolim',
      image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=600',
    },
    {
      name: '1961 Restaurant & Bar',
      offer: 'Flat 15% Off',
      logo: '1961',
      logoBg: 'bg-amber-950 text-amber-200',
      location: 'Fontainhas',
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600',
    },
    {
      name: "Fortune's Feast",
      offer: 'Flat 15% Off',
      logo: 'Fortune',
      logoBg: 'bg-purple-950 text-pink-300',
      location: 'Calangute',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=600',
    },
    {
      name: 'Cafe WE',
      offer: 'Flat 20% Off',
      logo: 'CAFE WE',
      logoBg: 'bg-zinc-900 text-stone-200',
      location: 'Anjuna',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=600',
    },
    {
      name: 'Blue Heaven Shack',
      offer: 'Flat 10% Off',
      logo: 'BLUE HEAVEN',
      logoBg: 'bg-sky-900 text-sky-200',
      location: 'Baga',
      image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600',
    },
    {
      name: 'Kolliste Kitchen',
      offer: 'Flat 15% Off',
      logo: 'Kolliste',
      logoBg: 'bg-emerald-950 text-amber-300',
      location: 'Vagator',
      image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=600',
    },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
      {/* 1. TOP CATEGORIES STRIP (Directly inspired by goa.app) */}
      <section className="bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-slate-200/90 shadow-sm">
        <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          {goaCategories.map((item, i) => {
            const Icon = item.icon
            const isTabActive = item.label === 'Restaurants' && activeTab === 'restaurants'

            if (item.action) {
              return (
                <button
                  key={i}
                  onClick={item.action}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                    isTabActive
                      ? 'bg-[#EA580C] text-white shadow-md shadow-orange-500/20'
                      : item.highlight
                      ? 'bg-orange-50 text-[#EA580C] hover:bg-orange-100 border border-orange-200'
                      : 'text-slate-700 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </button>
              )
            }

            return (
              <Link
                key={i}
                href={item.href || '/explore'}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-50 whitespace-nowrap transition-colors"
              >
                <Icon className="h-4 w-4 text-slate-500" />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </div>
      </section>

      {/* 2. DASHBOARD NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'overview'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Sparkles className="h-3.5 w-3.5" />
          Overview
        </button>

        <button
          onClick={() => setActiveTab('restaurants')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'restaurants'
              ? 'bg-[#EA580C] text-white shadow-sm'
              : 'text-slate-600 hover:text-[#EA580C] hover:bg-orange-50 font-semibold'
          }`}
        >
          <UtensilsCrossed className="h-3.5 w-3.5" />
          Restaurants & Dining
          <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded-full font-extrabold uppercase">
            Offers
          </span>
        </button>

        <button
          onClick={() => setActiveTab('itinerary')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'itinerary'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Luggage className="h-3.5 w-3.5" />
          My Itinerary
        </button>

        <button
          onClick={() => setActiveTab('saved')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
            activeTab === 'saved'
              ? 'bg-slate-900 text-white shadow-sm'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Heart className="h-3.5 w-3.5" />
          Saved ({bookmarkedIds.length})
        </button>
      </div>

      {/* 3. CONDITIONAL TAB VIEW: RESTAURANTS TAB */}
      {activeTab === 'restaurants' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <RestaurantsViewClient />
        </div>
      )}

      {/* 4. CONDITIONAL TAB VIEW: OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Welcome Banner (Clean, NO APP LOGO) */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#EA580C] via-[#F97316] to-[#C2410C] text-white p-6 sm:p-8 shadow-xl shadow-orange-950/10">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold">
                  <Sparkles className="h-3.5 w-3.5 text-amber-200" />
                  Goa Explorer Pass Active
                </div>
                <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
                  Welcome to Goa, {userDisplayName}!
                </h1>
                <p className="text-orange-100 text-sm sm:text-base leading-relaxed">
                  Your personalized smart travel hub for verified beach venues, dining discount passes, coastal conditions, and custom trip trails.
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    onClick={() => setActiveTab('restaurants')}
                    className="bg-white text-[#EA580C] hover:bg-orange-50 font-extrabold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-md transition-all"
                  >
                    <UtensilsCrossed className="h-4 w-4" />
                    Browse Restaurants & Offers
                  </button>
                  <Link href="/explore">
                    <Button
                      variant="outline"
                      className="bg-white/10 hover:bg-white/20 text-white border-white/30 text-xs font-semibold gap-1.5"
                    >
                      <Compass className="h-4 w-4" />
                      Explore Destinations
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Quick Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
                <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-black text-white">{bookmarkedIds.length}</div>
                  <div className="text-[11px] text-orange-100 font-medium">Saved Spots</div>
                </div>
                <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center">
                  <div className="text-2xl font-black text-amber-200">2</div>
                  <div className="text-[11px] text-orange-100 font-medium">Upcoming Trips</div>
                </div>
                <div className="bg-white/15 backdrop-blur-md border border-white/20 rounded-2xl p-4 text-center col-span-2 sm:col-span-1">
                  <div className="text-2xl font-black text-emerald-200">6</div>
                  <div className="text-[11px] text-orange-100 font-medium">Partner Deals</div>
                </div>
              </div>
            </div>

            {/* Subtle background waves */}
            <div className="absolute -right-10 -bottom-10 opacity-15 pointer-events-none">
              <Waves className="w-96 h-96 text-white" />
            </div>
          </div>

          {/* FEATURED DINING OFFERS CAROUSEL (Directly on Dashboard) */}
          <section className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                    Featured Dining Offers
                  </h2>
                  <span className="text-[10px] font-black bg-orange-100 text-[#EA580C] px-2 py-0.5 rounded-full uppercase">
                    goa.app Verified
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Save 10% to 20% on Goa’s top beach shacks, Portuguese cafes, and coastal bistros
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollOffers('left')}
                  className="h-8 w-8 rounded-full border border-slate-200 hover:bg-slate-100 flex items-center justify-center text-slate-600 transition-colors"
                  aria-label="Previous offers"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={() => scrollOffers('right')}
                  className="h-8 w-8 rounded-full bg-[#EA580C] hover:bg-[#c2410c] text-white flex items-center justify-center shadow-md transition-colors"
                  aria-label="Next offers"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setActiveTab('restaurants')}
                  className="text-xs font-bold text-slate-700 hover:text-[#EA580C] ml-2 flex items-center gap-0.5"
                >
                  See All <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Scrollable Row */}
            <div
              ref={offersScrollRef}
              className="flex items-center gap-3.5 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory scroll-smooth"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {dashboardOffers.map((item, i) => (
                <div
                  key={i}
                  onClick={() => setActiveTab('restaurants')}
                  className="flex-shrink-0 w-48 sm:w-52 h-48 rounded-2xl overflow-hidden relative cursor-pointer group shadow-sm hover:shadow-xl transition-all duration-300 snap-start"
                >
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url('${item.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/20" />

                  {/* Logo Center Badge */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className={`px-2.5 py-1 rounded-md text-xs font-extrabold uppercase shadow-md ${item.logoBg}`}>
                      {item.logo}
                    </div>
                  </div>

                  {/* Bottom Discount Label */}
                  <div className="absolute bottom-0 inset-x-0 bg-emerald-950/90 py-1.5 px-3 text-center border-t border-emerald-500/30">
                    <span className="text-xs font-black text-emerald-200">{item.offer}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Live Goa Coastal Conditions & Active Trip Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coastal Weather & Beach Safety */}
            <Card className="rounded-3xl border-slate-200/90 shadow-sm bg-white overflow-hidden">
              <CardHeader className="bg-gradient-to-br from-amber-50/40 to-white pb-3 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-xl bg-orange-100 text-[#EA580C] flex items-center justify-center">
                      <Sun className="h-4 w-4" />
                    </div>
                    <CardTitle className="text-base font-bold text-slate-900">
                      Goa Live Conditions
                    </CardTitle>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live Feed
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-3xl font-black text-slate-900">31°C</div>
                    <div className="text-xs text-slate-500 font-medium">Sunny &bull; North Goa Shores</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-700">Sunset Today</div>
                    <div className="text-sm font-black text-[#EA580C]">6:28 PM</div>
                  </div>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Waves className="h-3.5 w-3.5 text-sky-500" /> Beach Swimming:
                    </span>
                    <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                      🟢 Green Flag (Safe)
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5 text-slate-400" /> High / Low Tide:
                    </span>
                    <span className="font-semibold text-slate-700">3:45 PM / 9:20 PM</span>
                  </div>
                  <div className="flex items-center justify-between py-1">
                    <span className="text-slate-500 flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5 text-slate-400" /> Lifeguards on Duty:
                    </span>
                    <span className="font-semibold text-slate-700">Drishti Marine Active</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Current Active Trip Card */}
            <Card className="lg:col-span-2 rounded-3xl border-slate-200/90 shadow-sm bg-white overflow-hidden flex flex-col justify-between">
              <CardHeader className="bg-gradient-to-br from-orange-50/40 to-white pb-3 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center">
                      <Luggage className="h-4 w-4" />
                    </div>
                    <div>
                      <CardTitle className="text-base font-bold text-slate-900">
                        Active Trip Itinerary
                      </CardTitle>
                      <CardDescription className="text-xs">
                        North Goa Sun, Sand & Coastal Flavors
                      </CardDescription>
                    </div>
                  </div>
                  <Link href="/trips">
                    <Button variant="ghost" size="sm" className="text-xs text-[#EA580C] font-bold gap-1">
                      Manage Trips <ArrowRight className="h-3 w-3" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                {/* Timeline Stops */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                      Morning • 10:30 AM
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">Aguada Fort Visit</h4>
                    <p className="text-xs text-slate-500">Sinquerim lighthouse & sea view</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-orange-50/70 border border-orange-200 space-y-1 relative">
                    <span className="absolute -top-2 right-2 text-[9px] font-black bg-[#EA580C] text-white px-2 py-0.5 rounded-full uppercase">
                      Next Stop
                    </span>
                    <span className="text-[10px] font-bold text-orange-800 uppercase tracking-wider">
                      Afternoon • 01:30 PM
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">Sunset Shack Calangute</h4>
                    <p className="text-xs text-slate-500">Goan seafood & fresh mocktails</p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Sunset • 05:45 PM
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">Vagator Cliffs</h4>
                    <p className="text-xs text-slate-500">Sunset acoustic session</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-500">Want to add stops or change dates?</span>
                  <Link href="/trips">
                    <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold">
                      Customize Schedule
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Smart Goa Concierge */}
          <Card className="rounded-3xl border-slate-200/90 shadow-sm bg-gradient-to-br from-white to-orange-50/20 overflow-hidden">
            <CardHeader className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-2xl bg-[#EA580C] text-white flex items-center justify-center shadow-md shadow-orange-500/20">
                  <Bot className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-lg font-black text-slate-900">
                    Goa AI Smart Concierge
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Ask anything about beach tides, local shacks, hidden gems, or culinary hotspots
                  </CardDescription>
                </div>
              </div>
              <span className="text-[11px] font-bold text-orange-800 bg-orange-100 px-3 py-1 rounded-full self-start sm:self-auto">
                Powered by Smart Tourism AI
              </span>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {/* Quick Prompts */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-semibold text-slate-500">Try asking:</span>
                {[
                  '🍲 Best Fish Curry Thali in Panaji',
                  '🌅 Top quiet sunset beach shacks today',
                  '🛵 Scenic scooter trails in South Goa',
                ].map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setAiQuestion(prompt)
                      handleAskAI(prompt)
                    }}
                    className="text-xs bg-white border border-slate-200 hover:border-orange-300 hover:bg-orange-50 text-slate-700 px-3 py-1 rounded-full transition-all shadow-2xs"
                  >
                    {prompt}
                  </button>
                ))}
              </div>

              {/* AI Input Form */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask Goa AI: e.g. What are the best restaurants in Calangute with live music?"
                  value={aiQuestion}
                  onChange={(e) => setAiQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
                  className="flex-1 h-11 px-4 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                />
                <Button
                  onClick={() => handleAskAI()}
                  disabled={isAiLoading || !aiQuestion.trim()}
                  className="h-11 px-5 bg-[#EA580C] hover:bg-[#c2410c] text-white font-bold gap-2 text-xs"
                >
                  <Send className="h-3.5 w-3.5" />
                  Ask AI
                </Button>
              </div>

              {/* AI Response Display */}
              {aiResponse && (
                <div className="p-4 rounded-2xl bg-orange-50/80 border border-orange-200/80 text-xs sm:text-sm text-slate-800 space-y-1 animate-in fade-in duration-300">
                  <div className="font-bold text-[#EA580C] flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" /> Goa AI Assistant:
                  </div>
                  <p className="leading-relaxed">{aiResponse}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Verified Places from Database */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Verified Goa Venues
                </h2>
                <p className="text-xs text-slate-500">
                  Live database approved beach venues and heritage spots
                </p>
              </div>
              <Link href="/explore">
                <Button variant="ghost" size="sm" className="text-xs text-[#EA580C] font-bold gap-1">
                  Browse All <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {places.map((place) => {
                const isSaved = bookmarkedIds.includes(place.id)

                return (
                  <Card
                    key={place.id}
                    className="group rounded-2xl border-slate-200/80 hover:shadow-lg transition-all bg-white overflow-hidden flex flex-col justify-between"
                  >
                    <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={
                          place.photos && place.photos.length > 0
                            ? place.photos[0]
                            : 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800'
                        }
                        alt={place.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <button
                        onClick={() => toggleBookmark(place.id, place.name)}
                        className="absolute top-3 right-3 h-8 w-8 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-700 hover:text-rose-600 transition-colors shadow-sm"
                        title={isSaved ? 'Remove Bookmark' : 'Save Place'}
                      >
                        <Heart
                          className={`h-4 w-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`}
                        />
                      </button>
                      <span className="absolute bottom-3 left-3 bg-emerald-600/90 backdrop-blur-md text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                        <ShieldCheck className="h-3 w-3" />
                        Verified
                      </span>
                    </div>

                    <CardContent className="p-4 space-y-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#EA580C]">
                        {place.category}
                      </span>
                      <h3 className="font-bold text-base text-slate-900 group-hover:text-[#EA580C] transition-colors line-clamp-1">
                        {place.name}
                      </h3>
                      <p className="flex items-center gap-1 text-xs text-slate-500 line-clamp-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        {place.address}
                      </p>
                      {place.description && (
                        <p className="text-xs text-slate-600 line-clamp-2">
                          {place.description}
                        </p>
                      )}

                      <div className="pt-2 flex items-center justify-between border-t border-slate-100">
                        <span className="text-[11px] font-bold text-slate-700 flex items-center gap-1">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          4.9 (120+ reviews)
                        </span>
                        <Link href="/explore">
                          <Button size="sm" variant="ghost" className="h-7 text-xs text-[#EA580C] font-bold px-2">
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </div>

          {/* Safety & Assistance helpline */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-5 rounded-2xl bg-orange-50 border border-orange-200 space-y-2">
              <span className="text-[10px] font-bold text-orange-800 bg-orange-200/80 px-2 py-0.5 rounded uppercase">
                Dining Perks
              </span>
              <h4 className="font-bold text-slate-900 text-sm">Up to 20% Off at 35+ Partner Shacks</h4>
              <p className="text-xs text-slate-600">
                Claim your instant bill discount simply by clicking "Book Table" in the Restaurants tab.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-sky-50 border border-sky-200 space-y-2">
              <span className="text-[10px] font-bold text-sky-800 bg-sky-200/80 px-2 py-0.5 rounded uppercase">
                Coastal Safety
              </span>
              <h4 className="font-bold text-slate-900 text-sm">Drishti Marine Live Monitoring</h4>
              <p className="text-xs text-slate-600">
                Always follow lifeguard flags: Green means safe swimming, Red means stay out of the water.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950 px-2 py-0.5 rounded uppercase">
                  24/7 Helpline
                </span>
                <PhoneCall className="h-4 w-4 text-emerald-400" />
              </div>
              <h4 className="font-bold text-white text-sm">Goa Tourist Assistance</h4>
              <p className="text-xs text-slate-300">
                Tourist Police: <strong className="text-white">1364</strong> | Emergency: <strong className="text-white">112</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5. CONDITIONAL TAB VIEW: ITINERARY TAB */}
      {activeTab === 'itinerary' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900">Your Goa Trip Trail</h2>
              <p className="text-xs text-slate-500">Scheduled stops, reservations, and timings</p>
            </div>
            <Link href="/trips">
              <Button size="sm" className="bg-[#EA580C] hover:bg-[#c2410c] text-white text-xs font-bold">
                Open Itinerary Planner
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="h-10 w-10 rounded-xl bg-orange-100 text-[#EA580C] flex items-center justify-center font-bold text-sm shrink-0">
                1
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">10:30 AM – Morning</span>
                <h4 className="font-bold text-slate-900 text-sm">Aguada Fort & Lighthouse</h4>
                <p className="text-xs text-slate-500 mt-0.5">Explore 17th-century ramparts overlooking Arabian Sea</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-2xl bg-orange-50 border border-orange-200">
              <div className="h-10 w-10 rounded-xl bg-[#EA580C] text-white flex items-center justify-center font-bold text-sm shrink-0">
                2
              </div>
              <div>
                <span className="text-[10px] font-bold text-orange-700 uppercase">01:30 PM – Lunch Reservation</span>
                <h4 className="font-bold text-slate-900 text-sm">Sunset Shack Calangute (Flat 15% Off Applied)</h4>
                <p className="text-xs text-slate-500 mt-0.5">Goan fish curry rice and chilled tender coconut water</p>
              </div>
            </div>

            <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="h-10 w-10 rounded-xl bg-slate-200 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0">
                3
              </div>
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">05:45 PM – Sunset</span>
                <h4 className="font-bold text-slate-900 text-sm">Vagator Beach & Chapora Cliffs</h4>
                <p className="text-xs text-slate-500 mt-0.5">Panoramic sunset view over Ozran beach</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. CONDITIONAL TAB VIEW: SAVED BUCKET LIST */}
      {activeTab === 'saved' && (
        <div className="bg-white rounded-3xl p-6 border border-slate-200 space-y-4 animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900">Saved Places & Restaurants</h2>
              <p className="text-xs text-slate-500">Your bookmarked Goa spots for quick access</p>
            </div>
            <button
              onClick={() => setActiveTab('restaurants')}
              className="text-xs font-bold text-[#EA580C] hover:underline"
            >
              Browse more restaurants &rarr;
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-[#EA580C]">Restaurant</span>
                <Heart className="h-4 w-4 fill-red-500 text-red-500" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Dropiet Beach Lounge</h4>
              <p className="text-xs text-slate-500">Candolim • Flat 10% Off</p>
              <button
                onClick={() => setActiveTab('restaurants')}
                className="text-xs font-bold text-[#EA580C] mt-2 block"
              >
                View Menu & Reserve &rarr;
              </button>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-sky-600">Beach</span>
                <Heart className="h-4 w-4 fill-red-500 text-red-500" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Palolem Beach</h4>
              <p className="text-xs text-slate-500">Canacona, South Goa</p>
              <Link href="/explore" className="text-xs font-bold text-slate-700 mt-2 block">
                View Details &rarr;
              </Link>
            </div>

            <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase text-amber-600">Heritage</span>
                <Heart className="h-4 w-4 fill-red-500 text-red-500" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm">Aguada Fort</h4>
              <p className="text-xs text-slate-500">Sinquerim, Candolim</p>
              <Link href="/explore" className="text-xs font-bold text-slate-700 mt-2 block">
                View Details &rarr;
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
