'use client'

import React, { useState, useEffect } from 'react'
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
  Bookmark,
  Send,
  Bot,
  Clock,
  PhoneCall,
  ShieldCheck,
  Tag,
  Luggage,
  Heart,
  ChevronRight,
  TrendingUp,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'
import { useAuthStore } from '@/lib/stores/authStore'
import { toast } from 'sonner'

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
  const { user, role } = useAuthStore()
  const [places, setPlaces] = useState<Place[]>([])
  const [loadingPlaces, setLoadingPlaces] = useState(true)
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(['p1', 'p2'])
  const [aiQuestion, setAiQuestion] = useState('')
  const [aiResponse, setAiResponse] = useState<string | null>(null)
  const [isAiLoading, setIsAiLoading] = useState(false)

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
      if (query.toLowerCase().includes('sunset')) {
        setAiResponse(
          '🌅 Top Sunset Pick: Head over to Vagator Cliffs or our newly verified partner "Sunset Shack Calangute" for chilled acoustic music and prime ocean views. Best arrival time: 5:45 PM before the 6:28 PM sunset.'
        )
      } else if (query.toLowerCase().includes('food') || query.toLowerCase().includes('curry') || query.toLowerCase().includes('thali')) {
        setAiResponse(
          '🍲 Goan Culinary Pick: For an authentic Fish Curry Thali, visit local heritage spots in Panaji or beachfront shacks along Calangute. Ask for fresh Kingfish (Viswon) or Butter Garlic Crab!'
        )
      } else if (query.toLowerCase().includes('waterfall') || query.toLowerCase().includes('south')) {
        setAiResponse(
          '🌴 Scenic Nature Pick: Dudhsagar Waterfalls is at peak beauty. For coastal serenity, take the winding coast road down to Palolem Beach and Cola Beach lagoon!'
        )
      } else {
        setAiResponse(
          `✨ Smart Goa Recommendation for "${query}": North Goa is buzzing with sunset beach shacks and night markets, while South Goa offers tranquil heritage walks and uncrowded shores. Would you like a custom 1-day itinerary?`
        )
      }
      setIsAiLoading(false)
    }, 600)
  }

  const userDisplayName =
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'Traveler'

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      {/* 1. Hero Welcome & Quick Stats */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#0077B6] via-[#0096C7] to-[#023E8A] text-white p-6 sm:p-8 shadow-xl shadow-sky-900/10">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-md text-amber-200 text-xs font-semibold">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              Goa Explorer Pass Active
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              Welcome to Goa, {userDisplayName}! 🌴
            </h1>
            <p className="text-sky-100 text-sm sm:text-base leading-relaxed">
              Your personalized smart travel hub for verified beach venues, daily coastal conditions, and upcoming trip trails.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/explore">
                <Button className="bg-[#FF7B00] hover:bg-[#e06c00] text-white font-bold text-xs gap-1.5 shadow-md">
                  <Compass className="h-4 w-4" />
                  Explore Destinations
                </Button>
              </Link>
              <Link href="/trips">
                <Button variant="outline" className="bg-white/10 hover:bg-white/20 text-white border-white/30 text-xs font-semibold gap-1.5">
                  <Luggage className="h-4 w-4" />
                  My Itineraries
                </Button>
              </Link>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 shrink-0">
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-center">
              <div className="text-2xl font-black text-white">{bookmarkedIds.length}</div>
              <div className="text-[11px] text-sky-200 font-medium">Saved Places</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-center">
              <div className="text-2xl font-black text-amber-300">2</div>
              <div className="text-[11px] text-sky-200 font-medium">Upcoming Trips</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl p-4 text-center col-span-2 sm:col-span-1">
              <div className="text-2xl font-black text-emerald-300">3</div>
              <div className="text-[11px] text-sky-200 font-medium">Partner Deals</div>
            </div>
          </div>
        </div>

        {/* Decorative Wave in background */}
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Waves className="w-96 h-96 text-white" />
        </div>
      </div>

      {/* 2. Live Goa Coastal Widget & Active Trip Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coastal Weather & Beach Safety */}
        <Card className="rounded-3xl border-slate-200/90 shadow-sm bg-white overflow-hidden">
          <CardHeader className="bg-gradient-to-br from-sky-50 to-white pb-3 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-sky-100 text-[#0077B6] flex items-center justify-center">
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
                <div className="text-sm font-black text-[#FF7B00]">6:28 PM</div>
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Waves className="h-3.5 w-3.5 text-sky-500" /> Beach Swimming:
                </span>
                <span className="font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
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
          <CardHeader className="bg-gradient-to-br from-amber-50/50 to-white pb-3 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center">
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
                <Button variant="ghost" size="sm" className="text-xs text-[#0077B6] font-bold gap-1">
                  Manage Trips <ArrowRight className="h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            {/* Timeline Stops */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-sky-50/60 border border-sky-100 space-y-1">
                <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider">
                  Morning • 10:30 AM
                </span>
                <h4 className="font-bold text-sm text-slate-900">Aguada Fort Visit</h4>
                <p className="text-xs text-slate-500">Sinquerim lighthouse & sea view</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 space-y-1 relative">
                <span className="absolute -top-2 right-2 text-[9px] font-black bg-[#FF7B00] text-white px-2 py-0.5 rounded-full uppercase">
                  Next Stop
                </span>
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">
                  Afternoon • 01:30 PM
                </span>
                <h4 className="font-bold text-sm text-slate-900">Sunset Shack Calangute</h4>
                <p className="text-xs text-slate-500">Goan seafood & fresh mocktails</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
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
                <Button size="sm" className="bg-[#0077B6] hover:bg-[#005f92] text-white text-xs font-semibold">
                  Customize Schedule
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. AI Smart Goa Concierge */}
      <Card className="rounded-3xl border-slate-200/90 shadow-sm bg-gradient-to-br from-white to-sky-50/30 overflow-hidden">
        <CardHeader className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-[#0077B6] to-[#00B4D8] text-white flex items-center justify-center shadow-md shadow-sky-500/20">
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-black text-slate-900">
                Goa AI Smart Concierge
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Ask anything about beach tides, local shacks, hidden gems, or itinerary advice
              </CardDescription>
            </div>
          </div>
          <span className="text-[11px] font-bold text-sky-800 bg-sky-100 px-3 py-1 rounded-full self-start sm:self-auto">
            Powered by Smart Tourism AI
          </span>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {/* Quick Prompts */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-slate-500">Try asking:</span>
            {[
              '🌅 Best quiet sunset spots today',
              '🍲 Top Fish Curry Thali near Calangute',
              '🌴 Nature trails in South Goa',
            ].map((prompt, i) => (
              <button
                key={i}
                onClick={() => {
                  setAiQuestion(prompt)
                  handleAskAI(prompt)
                }}
                className="text-xs bg-white border border-slate-200/90 hover:border-sky-300 hover:bg-sky-50 text-slate-700 px-3 py-1 rounded-full transition-all shadow-2xs"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* AI Input Form */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask Goa AI: e.g. What are the best beach shacks in Calangute with live music?"
              value={aiQuestion}
              onChange={(e) => setAiQuestion(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAskAI()}
              className="flex-1 h-11 px-4 text-xs sm:text-sm rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#0077B6]"
            />
            <Button
              onClick={() => handleAskAI()}
              disabled={isAiLoading || !aiQuestion.trim()}
              className="h-11 px-5 bg-[#0077B6] hover:bg-[#005f92] text-white font-bold gap-2 text-xs"
            >
              <Send className="h-3.5 w-3.5" />
              Ask AI
            </Button>
          </div>

          {/* AI Response Display */}
          {aiResponse && (
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-200/80 text-xs sm:text-sm text-slate-800 space-y-1 animate-in fade-in duration-300">
              <div className="font-bold text-sky-900 flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-sky-600" /> Goa AI Assistant:
              </div>
              <p className="leading-relaxed">{aiResponse}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 4. Verified Partner Places & Saved Bucket List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Verified Partner Places
            </h2>
            <p className="text-xs text-slate-500">
              Live database approved venues and recommended coastal spots
            </p>
          </div>
          <Link href="/explore">
            <Button variant="ghost" size="sm" className="text-xs text-[#0077B6] font-bold gap-1">
              Browse All ({places.length}) <ChevronRight className="h-3.5 w-3.5" />
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
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF7B00]">
                    {place.category}
                  </span>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-[#0077B6] transition-colors line-clamp-1">
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
                      <Button size="sm" variant="ghost" className="h-7 text-xs text-[#0077B6] font-bold px-2">
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

      {/* 5. Exclusive Tourist Deals & Safety Helpline */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Partner Offer 1 */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-800 bg-amber-200/70 px-2 py-0.5 rounded uppercase">
              Partner Deal
            </span>
            <Tag className="h-4 w-4 text-amber-600" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">15% Off Seafood & Sunset Platters</h4>
            <p className="text-xs text-slate-600 mt-1">
              At Sunset Shack Calangute. Show your GoaSmart Tourist Pass on billing.
            </p>
          </div>
          <div className="text-[10px] font-semibold text-amber-700">Valid until 31 Oct 2026</div>
        </div>

        {/* Partner Offer 2 */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-sky-50 to-blue-50 border border-sky-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-sky-800 bg-sky-200/70 px-2 py-0.5 rounded uppercase">
              Beachside Perk
            </span>
            <Sparkles className="h-4 w-4 text-sky-600" />
          </div>
          <div>
            <h4 className="font-bold text-slate-900 text-sm">Complimentary Welcome Drink</h4>
            <p className="text-xs text-slate-600 mt-1">
              At Curlies Beach Shack & Anjuna partners when booking sunset tables.
            </p>
          </div>
          <div className="text-[10px] font-semibold text-sky-700">Valid on weekday evenings</div>
        </div>

        {/* Emergency Assistance */}
        <div className="p-5 rounded-2xl bg-slate-900 text-white space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-emerald-300 bg-emerald-950/80 border border-emerald-800 px-2 py-0.5 rounded uppercase">
              24/7 Helpline
            </span>
            <PhoneCall className="h-4 w-4 text-emerald-400" />
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">Goa Tourist Assistance</h4>
            <p className="text-xs text-slate-300 mt-1">
              Tourist Police: <strong className="text-white">1364</strong> (Toll Free)<br />
              Coastal Marine Rescue: <strong className="text-white">112</strong>
            </p>
          </div>
          <a
            href="tel:1364"
            className="inline-block text-xs font-bold text-emerald-400 hover:text-emerald-300"
          >
            Direct Emergency Call &rarr;
          </a>
        </div>
      </div>
    </div>
  )
}
