'use client'

import React, { useState, useMemo, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  Search,
  MapPin,
  Star,
  Tag,
  Clock,
  Heart,
  Filter,
  CheckCircle2,
  Sparkles,
  X,
  Share2,
  ExternalLink,
  Navigation,
  Info,
  Waves,
  ShieldCheck,
  ShieldAlert,
  Eye,
  Compass,
  Check,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Flame,
  TreePine,
  Church,
  Landmark,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import RatingPieChart from '@/components/ui/RatingPieChart'
import {
  PlaceItem,
  PlaceCategory,
  PlaceRegion,
  PLACES_DATA,
} from '@/lib/data/placesData'

interface PlacesViewClientProps {
  initialPlaces?: PlaceItem[]
}

// Category cards shown in hero carousel (identical to goa.app screenshot)
const HERO_CATEGORIES = [
  {
    id: 'waterfall_nature' as PlaceCategory,
    title: 'Waterfalls',
    count: '78 Places',
    image: 'https://storage.googleapis.com/goa-app-12a91.appspot.com/2021-11-11T07%3A45%3A28.541Ztamdi-surla-waterfall.webp?GoogleAccessId=firebase-adminsdk-zeqcj%40goa-app-12a91.iam.gserviceaccount.com&Expires=16447017600&Signature=OLvh5s%2BhNIrObUVlw%2BrkDElYcCkgs9XlBsNm%2FOlpAySSWQwMTX3PSnjFv0yPJO0kwqaNBgXU68M1yi145HOeefoJY%2BarZX9bqpG0wZctRwl0z2n9ywbWhjUYV3DnLDIOXYKBADXu0FpDg0Ci1FvSrqOSQK1luOQF3EOzrjTDFmG0q8IQbQmFnmN4dCvyViexL6jjVizjIWfSyvO87Q7z5%2FSvYHuT2KRhT1NF4%2Bhla61MO213to5om6YMlQlktXQ%2BQ8ihYw6IRVnuazvsSxp3JRtLv5tM7xrQDzN36VLHZUuw1fI6EByjRd152YhS1D25ZLBpby%2BEyz6vv8WhZV2txA%3D%3D',
  },
  {
    id: 'beach' as PlaceCategory,
    title: 'Beaches',
    count: '114 Places',
    image: 'https://storage.googleapis.com/goa-app-12a91.appspot.com/2021-11-11T07%3A44%3A20.681Zbutterfly-beach.webp?GoogleAccessId=firebase-adminsdk-zeqcj%40goa-app-12a91.iam.gserviceaccount.com&Expires=16447017600&Signature=e78bZ0k%2Fvr6Yk6dHs%2FQ731X02BDmUyqQnJ268hYAggU7lkn%2BSk3%2FMoP3jrEAyOHRnx7E%2BgO7bnmYuuQ0y4qyfftAKWwBk7nS2zvUyWBItXhcUDM860UTrnBfvWZYObXCUWi%2Fdl2%2BKHqHvLhRYfDBOhLjx8t2dMTUAb0Sefad7cWJ%2BBqrnRQq%2FN4Ue4JWlvCWXwGJQ6p11hMiGM%2BDc6w8lhtRuiyFOdsRMWDdeWdD3KEy4DiLSQ6icPoCtviFObPtD3VqVi%2F6PVPWCBJFPBp8zBplVIf3MJrLL0lV%2Bh3ttV8QoK%2FOgTBAc1XRHlqgHrV66kMqfH1%2FQ984fQMbe8XVSA%3D%3D',
  },
  {
    id: 'heritage_fort' as PlaceCategory,
    title: 'Forts',
    count: '70 Places',
    image: 'https://storage.googleapis.com/goa-app-12a91.appspot.com/2021-11-11T07%3A44%3A44.654Zterekhol-fort.webp?GoogleAccessId=firebase-adminsdk-zeqcj%40goa-app-12a91.iam.gserviceaccount.com&Expires=16447017600&Signature=det0OORxpMcU19m7%2B07NzYy%2B4b%2BAIm5nIZusET6ssncOA4xHSbiPPGGkh0HJStwPf4IZTPx4XKaZ8wTLmA4vRXvWFiN43%2BtIkcmAZUT4LGR91KyWPb5BVF3mK7uf64HmBKsGgJM%2B9%2FPq0sfayiy4mTIlNnkOhlruBCcrIpuid7QnnoQ10rVOH4k7tjvJeFviEimprILr500FYyQ3Isc5sKIVxSUzJn7cOIDWaJreyu3%2B%2Bk7tULC4Dih0PUnHCpmT9fSCeHph0BRq5jS%2B5riN4KLb%2FKjgC01zdTtPgq6hkBVYhfoyRpJCsL9URblRbd4PHTgZYmaAYCRdsKDZbc97DA%3D%3D',
  },
  {
    id: 'church' as PlaceCategory,
    title: 'Religious',
    count: '243 Places',
    image: 'https://storage.googleapis.com/goa-app-12a91.appspot.com/2021-11-11T07%3A45%3A05.881Zbom-jesus.webp?GoogleAccessId=firebase-adminsdk-zeqcj%40goa-app-12a91.iam.gserviceaccount.com&Expires=16447017600&Signature=E8WbgxEvUeX0Lj07HS9MognmMFhSZWegm6CgS%2FYfdE8x47hQUyzNHWiZ6z4%2F9UnyxVhvAN2UwPJcZxL2kX%2FL0l3sy1cEojtdyrlOepPCj793Eod3XN65iK2TM963UIchr5IxZfSenXkcy1i8W0UzGRwT3VxPnhuVKRIgc9U0GaAaCbg5vqWLlE%2F9XrfODFIaKl4hkuyjtDPQlaKeINp%2FXFQ%2FukP0hQlXEeWqK3vnd9%2FCC9P4FB%2FyF%2FT0eZ5AkuXRtxNu5yfunWnVNBEdP0Nk6MIo4%2BZOe5n7ZLgGpxvoHPPhnlRpe5XnpNgvoNe1RTsEAziNRQ4UY6oI%2BtgdScZROw%3D%3D',
  },
  {
    id: 'wildlife' as PlaceCategory,
    title: 'Wildlife',
    count: '18 Places',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800',
  },
  {
    id: 'quarter_market' as PlaceCategory,
    title: 'Quarters & Markets',
    count: '42 Places',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800',
  },
  {
    id: 'viewpoint_island' as PlaceCategory,
    title: 'Islands & Views',
    count: '25 Places',
    image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800',
  },
]

const REGIONS: { id: 'all' | PlaceRegion; label: string }[] = [
  { id: 'all', label: 'All Goa' },
  { id: 'North Goa', label: 'North Goa' },
  { id: 'South Goa', label: 'South Goa' },
  { id: 'Panaji & Central', label: 'Panaji & Central' },
]

export default function PlacesViewClient({
  initialPlaces = PLACES_DATA,
}: PlacesViewClientProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<'all' | PlaceCategory>('all')
  const [selectedRegion, setSelectedRegion] = useState<'all' | PlaceRegion>('all')
  const [onlyGreenFlag, setOnlyGreenFlag] = useState(false)
  const [onlyFreeEntry, setOnlyFreeEntry] = useState(false)
  const [onlyWaterSports, setOnlyWaterSports] = useState(false)
  const [onlySaved, setOnlySaved] = useState(false)
  const [sortBy, setSortBy] = useState<'rating' | 'reviews' | 'name'>('rating')

  // Saved / Bookmarked items in localStorage
  const [savedIds, setSavedIds] = useState<string[]>([])
  const [selectedPlace, setSelectedPlace] = useState<PlaceItem | null>(null)
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0)
  const [showSafetyModal, setShowSafetyModal] = useState(false)

  // Carousel scroll ref
  const categoryScrollRef = useRef<HTMLDivElement>(null)

  // Load saved places on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('goa_saved_places')
      if (stored) {
        setSavedIds(JSON.parse(stored))
      }
    } catch {
      // Ignore
    }
  }, [])

  const toggleSave = (id: string, name: string) => {
    setSavedIds((prev) => {
      const exists = prev.includes(id)
      const next = exists ? prev.filter((item) => item !== id) : [...prev, id]
      try {
        localStorage.setItem('goa_saved_places', JSON.stringify(next))
      } catch {
        // Ignore
      }
      if (exists) {
        toast.info(`Removed "${name}" from saved places`)
      } else {
        toast.success(`Saved "${name}" to your Goa favorites!`)
      }
      return next
    })
  }

  const handleShare = (place: PlaceItem) => {
    if (typeof window !== 'undefined') {
      const shareData = {
        title: `${place.name} — Goa Places`,
        text: `Explore ${place.name} in ${place.location}!`,
        url: window.location.href,
      }
      if (navigator.share) {
        navigator.share(shareData).catch(() => {})
      } else {
        navigator.clipboard.writeText(
          `${place.name} (${place.location}) - Check on Google Maps: ${place.googleMapsUrl}`
        )
        toast.success('Place link copied to clipboard!')
      }
    }
  }

  const scrollCategory = (direction: 'left' | 'right') => {
    if (categoryScrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320
      categoryScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  // Filter places
  const filteredPlaces = useMemo(() => {
    return initialPlaces
      .filter((place) => {
        // Search
        if (searchQuery.trim()) {
          const query = searchQuery.toLowerCase().trim()
          const matchesName = place.name.toLowerCase().includes(query)
          const matchesLocation = place.location.toLowerCase().includes(query)
          const matchesTaluka = place.taluka.toLowerCase().includes(query)
          const matchesCategory = place.categoryLabel.toLowerCase().includes(query)
          const matchesTags = place.tags.some((t) => t.toLowerCase().includes(query))
          const matchesHighlights = place.highlights.some((h) => h.toLowerCase().includes(query))
          if (
            !matchesName &&
            !matchesLocation &&
            !matchesTaluka &&
            !matchesCategory &&
            !matchesTags &&
            !matchesHighlights
          ) {
            return false
          }
        }

        // Category filter
        if (selectedCategory !== 'all') {
          if (selectedCategory === 'church') {
            // Include churches and temples under religious
            if (place.category !== 'church' && place.category !== 'temple') return false
          } else if (place.category !== selectedCategory) {
            return false
          }
        }

        // Region filter
        if (selectedRegion !== 'all' && place.region !== selectedRegion) {
          return false
        }

        // Flags
        if (onlyGreenFlag && place.beachSafety?.flagStatus !== 'safe') {
          return false
        }

        if (onlyFreeEntry && !place.entryFee.toLowerCase().includes('free')) {
          return false
        }

        if (onlyWaterSports && !place.beachSafety?.waterSportsAvailable) {
          return false
        }

        if (onlySaved && !savedIds.includes(place.id)) {
          return false
        }

        return true
      })
      .sort((a, b) => {
        if (sortBy === 'rating') return b.rating - a.rating
        if (sortBy === 'reviews') return b.reviewsCount - a.reviewsCount
        if (sortBy === 'name') return a.name.localeCompare(b.name)
        return 0
      })
  }, [
    initialPlaces,
    searchQuery,
    selectedCategory,
    selectedRegion,
    onlyGreenFlag,
    onlyFreeEntry,
    onlyWaterSports,
    onlySaved,
    savedIds,
    sortBy,
  ])

  // Subsets for curated sections matching goa.app
  const bestPlaces = useMemo(() => initialPlaces.filter((p) => p.rating >= 4.8), [initialPlaces])
  const popularBeaches = useMemo(
    () => initialPlaces.filter((p) => p.category === 'beach'),
    [initialPlaces]
  )
  const historicForts = useMemo(
    () => initialPlaces.filter((p) => p.category === 'heritage_fort'),
    [initialPlaces]
  )
  const religiousSites = useMemo(
    () => initialPlaces.filter((p) => p.category === 'church' || p.category === 'temple'),
    [initialPlaces]
  )
  const natureWaterfalls = useMemo(
    () =>
      initialPlaces.filter(
        (p) => p.category === 'waterfall_nature'
      ),
    [initialPlaces]
  )

  const isFiltering =
    selectedCategory !== 'all' ||
    selectedRegion !== 'all' ||
    onlyGreenFlag ||
    onlyFreeEntry ||
    onlyWaterSports ||
    onlySaved ||
    searchQuery.trim().length > 0

  const renderPlaceCard = (place: PlaceItem) => {
    const isSaved = savedIds.includes(place.id)
    return (
      <Card
        key={place.id}
        className="group overflow-hidden rounded-2xl border border-slate-200/90 hover:shadow-xl transition-all duration-300 bg-white flex flex-col justify-between"
      >
        <div>
          {/* Image with badges */}
          <div className="relative h-48 w-full overflow-hidden bg-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={place.image}
              alt={place.name}
              className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />

            {/* Top Badges */}
            <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between pointer-events-none">
              <div className="flex flex-wrap gap-1">
                {/* Beach Flag Badge */}
                {place.beachSafety && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm backdrop-blur-md pointer-events-auto ${
                      place.beachSafety.flagStatus === 'safe'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    {place.beachSafety.flagStatus === 'safe' ? (
                      <ShieldCheck className="h-3 w-3" />
                    ) : (
                      <ShieldAlert className="h-3 w-3" />
                    )}
                    {place.beachSafety.flagStatus === 'safe' ? 'Safe Swim' : 'Caution'}
                  </span>
                )}

                {place.isUnesco && (
                  <span className="bg-indigo-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm backdrop-blur-md pointer-events-auto">
                    <Sparkles className="h-3 w-3" /> UNESCO
                  </span>
                )}
              </div>

              {/* Heart / Save button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  toggleSave(place.id, place.name)
                }}
                aria-label={isSaved ? 'Remove from saved' : 'Save place'}
                className={`pointer-events-auto p-1.5 rounded-full backdrop-blur-md transition-all shadow-md ${
                  isSaved
                    ? 'bg-rose-500 text-white hover:bg-rose-600'
                    : 'bg-white/90 text-slate-700 hover:text-rose-500 hover:bg-white'
                }`}
              >
                <Heart className={`h-3.5 w-3.5 ${isSaved ? 'fill-white' : ''}`} />
              </button>
            </div>

            {/* Bottom image location & rating */}
            <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between text-white pointer-events-none">
              <span className="bg-black/60 backdrop-blur-md text-[10px] font-medium px-2 py-0.5 rounded-full">
                {place.taluka}
              </span>

              <span className="bg-white/95 backdrop-blur-md text-slate-900 text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                {place.rating} ({place.reviewsCount.toLocaleString()})
              </span>
            </div>
          </div>

          {/* Card Body */}
          <CardContent className="p-4 space-y-2">
            <div>
              <div className="flex items-center justify-between gap-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#EA580C]">
                  {place.categoryLabel}
                </span>
                <span className="text-[10px] font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded">
                  {place.entryFee}
                </span>
              </div>
              <Link href={`/places/${place.slug}`}>
                <h3 className="font-extrabold text-base text-slate-900 group-hover:text-[#EA580C] transition-colors line-clamp-1 mt-0.5">
                  {place.name}
                </h3>
              </Link>
            </div>

            <p className="flex items-center gap-1 text-xs text-slate-500 line-clamp-1">
              <MapPin className="h-3 w-3 text-slate-400 shrink-0" />
              {place.location}
            </p>

            <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
              {place.description}
            </p>
          </CardContent>
        </div>

        {/* Card Footer Actions */}
        <div className="p-4 pt-0 border-t border-slate-100 flex items-center gap-2 mt-auto">
          <Link href={`/places/${place.slug}`} className="flex-1">
            <Button
              size="sm"
              className="w-full bg-[#EA580C] hover:bg-[#c2410c] text-white text-xs font-bold rounded-xl h-8"
            >
              <Eye className="h-3 w-3 mr-1" />
              View Details
            </Button>
          </Link>

          <button
            onClick={() => {
              setSelectedPlace(place)
              setActiveGalleryIndex(0)
            }}
            className="p-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-xl transition-colors"
            title="Quick Preview"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
          </button>

          <a
            href={place.googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-xl transition-colors"
            title="Open in Google Maps"
          >
            <Navigation className="h-3.5 w-3.5 text-[#EA580C]" />
          </a>

          <button
            onClick={() => handleShare(place)}
            className="p-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 hover:text-slate-900 rounded-xl transition-colors"
            title="Share Spot"
          >
            <Share2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </Card>
    )
  }

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24 text-slate-900">
      {/* 1. HERO BANNER — IDENTICAL TO GOA.APP SCREENSHOT */}
      <div className="relative w-full bg-gradient-to-r from-teal-900 via-sky-900 to-cyan-900 overflow-hidden text-white pt-10 pb-20 sm:pt-14 sm:pb-28">
        {/* Coastal Ocean Photo with subtle overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center mix-blend-overlay opacity-40 pointer-events-none"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600)',
          }}
        />

        {/* Tropical palm frond decoration coming from top-right (as seen on goa.app) */}
        <div
          className="absolute top-0 right-0 w-80 sm:w-96 h-64 sm:h-80 bg-contain bg-no-repeat bg-right-top opacity-50 pointer-events-none"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=800)',
          }}
        />

        {/* Dashed map flight route illustration in the sky */}
        <div className="absolute top-6 left-1/3 right-1/4 h-12 hidden md:block opacity-40 pointer-events-none">
          <svg className="w-full h-full" viewBox="0 0 500 80" fill="none">
            <path
              d="M 10 60 Q 150 10 300 40 T 480 30"
              stroke="white"
              strokeWidth="2"
              strokeDasharray="6 6"
            />
            <circle cx="10" cy="60" r="4" fill="white" />
            <path
              d="M 480 20 C 475 20, 470 25, 470 30 C 470 38, 480 48, 480 48 C 480 48, 490 38, 490 30 C 490 25, 485 20, 480 20 Z"
              fill="#FF7B00"
            />
          </svg>
        </div>

        {/* Hero Title & Subtitle Container */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 space-y-2 z-10">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white drop-shadow-md">
            Places
          </h1>
          <p className="text-base sm:text-lg font-medium text-white/90 drop-shadow">
            Most Popular Tourist Places
          </p>
        </div>

        {/* 2. CATEGORY TILES CAROUSEL OVERLAPPING THE BANNER (EXACTLY AS GOA.APP) */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 mt-8 z-20">
          <div className="relative flex items-center">
            {/* Horizontal Scroll Cards Container */}
            <div
              ref={categoryScrollRef}
              className="flex items-center gap-4 overflow-x-auto pb-4 pt-1 scrollbar-none scroll-smooth w-full"
            >
              {HERO_CATEGORIES.map((cat) => {
                const isActive = selectedCategory === cat.id
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory((prev) => (prev === cat.id ? 'all' : cat.id))
                    }}
                    className={`group relative h-40 w-64 sm:h-44 sm:w-72 shrink-0 rounded-2xl overflow-hidden shadow-lg transition-all text-left border-2 ${
                      isActive
                        ? 'border-[#EA580C] ring-4 ring-orange-500/30 scale-105'
                        : 'border-white/20 hover:border-white/50 hover:scale-[1.02]'
                    }`}
                  >
                    {/* Background photo */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={cat.image}
                      alt={cat.title}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    {/* Dark gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />

                    {/* Category Label, Orange bar, and Place count */}
                    <div className="absolute bottom-4 left-4 right-4 space-y-1">
                      <h3 className="text-lg font-black text-white tracking-wide drop-shadow">
                        {cat.title}
                      </h3>
                      {/* Signature goa.app orange underline bar */}
                      <div className="h-0.5 w-16 bg-[#EA580C] rounded-full" />
                      <p className="text-xs font-semibold text-white/80 pt-0.5">
                        {cat.count}
                      </p>
                    </div>

                    {/* Active checkmark pill */}
                    {isActive && (
                      <span className="absolute top-3 right-3 bg-[#EA580C] text-white text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                        <Check className="h-3 w-3" /> Selected
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Circular Orange Right Arrow Button (Matching goa.app screenshot) */}
            <button
              onClick={() => scrollCategory('right')}
              className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 h-11 w-11 rounded-full bg-[#EA580C] hover:bg-[#c2410c] text-white items-center justify-center shadow-xl z-30 transition-transform active:scale-95"
              aria-label="Scroll categories right"
            >
              <ChevronRight className="h-6 w-6 stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* 3. SEARCH & QUICK FILTER BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 -mt-6 sm:-mt-8 relative z-30 space-y-6">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-lg space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search places, waterfalls, beaches, forts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-11 pl-10 pr-10 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:bg-white transition-all text-slate-900"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Region Selectors */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
              {REGIONS.map((region) => {
                const isActive = selectedRegion === region.id
                return (
                  <button
                    key={region.id}
                    onClick={() => setSelectedRegion(region.id)}
                    className={`px-3.5 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                      isActive
                        ? 'bg-slate-900 text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {region.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Quick Filters (Safety flag, free entry, water sports, saved) */}
          <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Filters:
            </span>

            {/* Green Flag Beach Safety Filter */}
            <button
              onClick={() => setOnlyGreenFlag((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                onlyGreenFlag
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
              }`}
            >
              <ShieldCheck className="h-3.5 w-3.5" />
              🟢 Safe for Swimming (Green Flag)
            </button>

            {/* Free Entry */}
            <button
              onClick={() => setOnlyFreeEntry((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                onlyFreeEntry
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
              }`}
            >
              <Tag className="h-3.5 w-3.5" />
              Free Entry
            </button>

            {/* Water Sports */}
            <button
              onClick={() => setOnlyWaterSports((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                onlyWaterSports
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'bg-sky-50 text-sky-800 border border-sky-200 hover:bg-sky-100'
              }`}
            >
              <Waves className="h-3.5 w-3.5" />
              Water Sports
            </button>

            {/* Saved Places */}
            <button
              onClick={() => setOnlySaved((prev) => !prev)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                onlySaved
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
              }`}
            >
              <Heart
                className={`h-3.5 w-3.5 ${onlySaved ? 'fill-white' : 'fill-rose-500 text-rose-500'}`}
              />
              Saved ({savedIds.length})
            </button>

            {/* Drishti Marine Guide Button */}
            <button
              onClick={() => setShowSafetyModal(true)}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#EA580C] hover:underline ml-auto"
            >
              <Info className="h-3.5 w-3.5" />
              Beach Flag Guide
            </button>

            {/* Clear All */}
            {isFiltering && (
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedCategory('all')
                  setSelectedRegion('all')
                  setOnlyGreenFlag(false)
                  setOnlyFreeEntry(false)
                  setOnlyWaterSports(false)
                  setOnlySaved(false)
                }}
                className="text-xs text-slate-500 hover:text-slate-900 underline ml-2"
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {/* 4. CONTENT SECTIONS */}
        {isFiltering ? (
          /* FILTERED RESULTS VIEW */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                Matching Destinations ({filteredPlaces.length})
              </h2>

              <div className="flex items-center gap-2">
                <label className="text-xs text-slate-500 hidden sm:inline">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-xs font-semibold bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-[#EA580C]"
                >
                  <option value="rating">Top Rated (★)</option>
                  <option value="reviews">Most Popular</option>
                  <option value="name">Alphabetical</option>
                </select>
              </div>
            </div>

            {filteredPlaces.length === 0 ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
                <Compass className="h-10 w-10 text-[#EA580C] mx-auto" />
                <h3 className="text-base font-bold text-slate-800">No destinations found</h3>
                <p className="text-xs text-slate-500">
                  Try clearing some filters or searching for another spot in Goa.
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery('')
                    setSelectedCategory('all')
                    setSelectedRegion('all')
                    setOnlyGreenFlag(false)
                    setOnlyFreeEntry(false)
                    setOnlyWaterSports(false)
                    setOnlySaved(false)
                  }}
                  variant="outline"
                  size="sm"
                  className="rounded-xl"
                >
                  Reset Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredPlaces.map((place) => renderPlaceCard(place))}
              </div>
            )}
          </div>
        ) : (
          /* DEFAULT CURATED SECTIONS (AS SHOWN IN GOA.APP SCREENSHOT) */
          <div className="space-y-12">
            {/* SECTION 1: "Best Places to visit in Goa" (EXACTLY AS IN SCREENSHOT) */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Best Places to visit in Goa
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Highest rated destinations across North and South Goa
                  </p>
                </div>
                <button
                  onClick={() => setSortBy('rating')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#EA580C] hover:text-[#c2410c] hover:underline"
                >
                  <span>See All</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {bestPlaces.slice(0, 8).map((place) => renderPlaceCard(place))}
              </div>
            </section>

            {/* SECTION 2: Famous Beaches in Goa */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span>🏖️</span> Famous Beaches in Goa
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Golden sands, sunset views, and live Drishti Marine safety zones
                  </p>
                </div>
                <button
                  onClick={() => setSelectedCategory('beach')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#EA580C] hover:text-[#c2410c] hover:underline"
                >
                  <span>See All Beaches ({popularBeaches.length})</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {popularBeaches.slice(0, 4).map((place) => renderPlaceCard(place))}
              </div>
            </section>

            {/* SECTION 3: Historic Forts & Heritage */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span>🏰</span> Historic Forts & Monuments
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    Centuries of Portuguese battlements overlooking the Arabian Sea
                  </p>
                </div>
                <button
                  onClick={() => setSelectedCategory('heritage_fort')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#EA580C] hover:text-[#c2410c] hover:underline"
                >
                  <span>See All Forts ({historicForts.length})</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {historicForts.map((place) => renderPlaceCard(place))}
              </div>
            </section>

            {/* SECTION 4: Sacred Religious Sites & UNESCO Cathedrals */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span>⛪</span> Religious Landmarks & UNESCO Sites
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    UNESCO world heritage cathedrals and 400-year-old temple shrines
                  </p>
                </div>
                <button
                  onClick={() => setSelectedCategory('church')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#EA580C] hover:text-[#c2410c] hover:underline"
                >
                  <span>See All Religious ({religiousSites.length})</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {religiousSites.map((place) => renderPlaceCard(place))}
              </div>
            </section>

            {/* SECTION 5: Waterfalls */}
            <section className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span>🌊</span> Waterfalls of Goa
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500">
                    From iconic cascading giants like Dudhsagar to hidden gems nestled deep in the Western Ghats
                  </p>
                </div>
                <button
                  onClick={() => setSelectedCategory('waterfall_nature')}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#EA580C] hover:text-[#c2410c] hover:underline"
                >
                  <span>See All Waterfalls ({natureWaterfalls.length})</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {natureWaterfalls.map((place) => renderPlaceCard(place))}
              </div>
            </section>
          </div>
        )}
      </div>

      {/* 5. INTERACTIVE PLACE DETAIL MODAL */}
      {selectedPlace && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 relative flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header & Close Button */}
            <button
              onClick={() => setSelectedPlace(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/50 hover:bg-black/75 text-white transition-colors"
              aria-label="Close dialog"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Gallery Slider Area */}
            <div className="relative h-64 sm:h-80 w-full bg-slate-900 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedPlace.gallery[activeGalleryIndex] || selectedPlace.image}
                alt={selectedPlace.name}
                className="h-full w-full object-cover transition-opacity duration-300"
              />

              {/* Prev / Next Controls if multiple photos */}
              {selectedPlace.gallery.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveGalleryIndex((prev) =>
                        prev === 0 ? selectedPlace.gallery.length - 1 : prev - 1
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm transition-colors"
                    aria-label="Previous photo"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() =>
                      setActiveGalleryIndex((prev) =>
                        prev === selectedPlace.gallery.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm transition-colors"
                    aria-label="Next photo"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Bottom Gallery Thumbnails */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2 overflow-x-auto">
                {selectedPlace.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveGalleryIndex(idx)}
                    className={`h-11 w-16 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                      activeGalleryIndex === idx
                        ? 'border-[#EA580C] scale-105 shadow-md'
                        : 'border-white/60 opacity-70 hover:opacity-100'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img} alt="Thumbnail" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-8 space-y-6">
              {/* Title & Quick Metadata */}
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#EA580C] bg-orange-50 px-2.5 py-1 rounded-md">
                    {selectedPlace.categoryLabel}
                  </span>
                  <span className="text-xs font-bold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                    {selectedPlace.taluka} • {selectedPlace.region}
                  </span>
                  {selectedPlace.isUnesco && (
                    <span className="text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-2.5 py-1 rounded-md">
                      🏛️ UNESCO World Heritage
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                      {selectedPlace.name}
                    </h2>
                    {selectedPlace.localName && (
                      <p className="text-sm font-semibold text-slate-600 mt-0.5">
                        {selectedPlace.localName}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 bg-amber-50 px-3 py-1.5 rounded-xl border border-amber-200/80">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="text-sm font-bold text-slate-900">
                      {selectedPlace.rating}
                    </span>
                    <span className="text-xs text-slate-600">
                      ({selectedPlace.reviewsCount.toLocaleString()} reviews)
                    </span>
                  </div>
                </div>

                <p className="flex items-center gap-1.5 text-xs text-slate-600">
                  <MapPin className="h-3.5 w-3.5 text-[#EA580C] shrink-0" />
                  {selectedPlace.fullAddress}
                </p>
              </div>

              {/* Beach Safety Banner if Applicable */}
              {selectedPlace.beachSafety && (
                <div
                  className={`p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    selectedPlace.beachSafety.flagStatus === 'safe'
                      ? 'bg-emerald-50/80 border-emerald-200 text-emerald-950'
                      : 'bg-amber-50/80 border-amber-200 text-amber-950'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <ShieldCheck
                      className={`h-5 w-5 shrink-0 mt-0.5 ${
                        selectedPlace.beachSafety.flagStatus === 'safe'
                          ? 'text-emerald-600'
                          : 'text-amber-600'
                      }`}
                    />
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-wide">
                        {selectedPlace.beachSafety.flagLabel}
                      </p>
                      <p className="text-xs mt-0.5 opacity-90">
                        {selectedPlace.beachSafety.swimZone}
                      </p>
                      {selectedPlace.beachSafety.tideAdvisory && (
                        <p className="text-[11px] font-medium mt-1 text-slate-600">
                          🌊 {selectedPlace.beachSafety.tideAdvisory}
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/80 border border-current self-start sm:self-auto shrink-0">
                    Lifeguards On Patrol
                  </span>
                </div>
              )}

              {/* Key Quick Facts Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                    🕒 Operational Timings
                  </span>
                  <p className="text-xs font-bold text-slate-800 mt-1">
                    {selectedPlace.timings}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                    🎟️ Entry Ticket
                  </span>
                  <p className="text-xs font-bold text-slate-800 mt-1">
                    {selectedPlace.entryFee}
                  </p>
                </div>

                <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-600 block">
                    🌅 Best Time to Visit
                  </span>
                  <p className="text-xs font-bold text-slate-800 mt-1">
                    {selectedPlace.bestTimeToVisit}
                  </p>
                </div>
              </div>

              {/* Overview / Description */}
              <div className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  About This Destination
                </h3>
                <p className="text-sm text-slate-700 leading-relaxed">
                  {selectedPlace.description}
                </p>
                {selectedPlace.history && (
                  <p className="text-xs text-slate-600 leading-relaxed bg-orange-50/50 p-3.5 rounded-xl border border-orange-100 italic">
                    <strong>Historical Insight:</strong> {selectedPlace.history}
                  </p>
                )}
              </div>

              {/* Key Highlights */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Key Highlights & Things to Do
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedPlace.highlights.map((highlight, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700"
                    >
                      <CheckCircle2 className="h-4 w-4 text-[#EA580C] shrink-0 mt-0.5" />
                      <span>{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities & Facilities */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">
                  Visitor Amenities & Facilities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedPlace.amenities.map((amenity, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700"
                    >
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              {/* Travel Tips */}
              {selectedPlace.travelTips && selectedPlace.travelTips.length > 0 && (
                <div className="p-4 bg-sky-50 rounded-2xl border border-sky-200/80 space-y-2">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-sky-900 flex items-center gap-1.5">
                    <Info className="h-4 w-4 text-sky-700" />
                    Local Travel Tips & Guidelines
                  </h4>
                  <ul className="space-y-1.5 text-xs text-sky-950">
                    {selectedPlace.travelTips.map((tip, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-sky-600">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Rating Pie Chart Breakdown */}
              <RatingPieChart
                ratings={selectedPlace.reviews?.map((r) => r.rating) || []}
                totalReviewsCount={selectedPlace.reviewsCount}
                averageRating={selectedPlace.rating}
                title="Visitor Rating Breakdown (Color-Coded Pie Chart)"
              />

              {/* Action Buttons Footer */}
              <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <Link
                  href={`/places/${selectedPlace.slug}`}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#EA580C] hover:bg-[#c2410c] text-white font-bold text-xs shadow-md transition-colors"
                >
                  <Eye className="h-4 w-4" />
                  View Dedicated Place Page & Reviews
                </Link>

                <a
                  href={selectedPlace.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
                >
                  <Navigation className="h-4 w-4 text-[#EA580C]" />
                  Maps
                </a>

                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => toggleSave(selectedPlace.id, selectedPlace.name)}
                    variant="outline"
                    className={`flex-1 sm:flex-none text-xs font-bold rounded-xl h-11 px-4 ${
                      savedIds.includes(selectedPlace.id)
                        ? 'border-rose-300 bg-rose-50 text-rose-700'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <Heart
                      className={`h-4 w-4 mr-1.5 ${
                        savedIds.includes(selectedPlace.id)
                          ? 'fill-rose-500 text-rose-500'
                          : ''
                      }`}
                    />
                    {savedIds.includes(selectedPlace.id) ? 'Saved' : 'Save Place'}
                  </Button>

                  <Button
                    onClick={() => handleShare(selectedPlace)}
                    variant="outline"
                    className="h-11 px-3.5 rounded-xl border-slate-200 text-slate-700 hover:bg-slate-50"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DRISHTI MARINE BEACH FLAG SAFETY GUIDE MODAL */}
      {showSafetyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 space-y-5 border border-slate-200 shadow-2xl relative">
            <button
              onClick={() => setShowSafetyModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="space-y-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#EA580C]">
                Official GTDC & Drishti Marine Guidelines
              </span>
              <h3 className="text-xl font-black text-slate-900">
                Goa Coastal Beach Safety Flags
              </h3>
            </div>

            <div className="space-y-3">
              {/* Green Flag */}
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200">
                <div className="h-8 w-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  🟢
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-950 uppercase tracking-wide">
                    Green Flag — Safe for Swimming
                  </h4>
                  <p className="text-xs text-emerald-900 mt-0.5">
                    Indicates calm seas and safe gradients monitored actively by Drishti Marine lifeguards. Always swim between patrol flags.
                  </p>
                </div>
              </div>

              {/* Yellow Flag */}
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-amber-50 border border-amber-200">
                <div className="h-8 w-8 rounded-full bg-amber-500 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  🟡
                </div>
                <div>
                  <h4 className="text-xs font-bold text-amber-950 uppercase tracking-wide">
                    Yellow Flag — Caution / Swim with Care
                  </h4>
                  <p className="text-xs text-amber-900 mt-0.5">
                    Moderate rip currents, underwater rocks, or drop-offs present. Do not venture past waist-deep waters.
                  </p>
                </div>
              </div>

              {/* Red Flag */}
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-red-50 border border-red-200">
                <div className="h-8 w-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold text-sm shrink-0">
                  🔴
                </div>
                <div>
                  <h4 className="text-xs font-bold text-red-950 uppercase tracking-wide">
                    Red Flag — High Danger (No Swimming)
                  </h4>
                  <p className="text-xs text-red-900 mt-0.5">
                    Severe undertow, sudden deep channels, or rough swells. Water entry is strictly prohibited by law.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 space-y-1">
              <p className="font-bold text-slate-800">Emergency Coastal Helpline:</p>
              <p>
                For beach emergencies or water rescue, dial <strong>112</strong> immediately to connect with Drishti Marine emergency response.
              </p>
            </div>

            <Button
              onClick={() => setShowSafetyModal(false)}
              className="w-full bg-[#EA580C] hover:bg-[#c2410c] text-white font-bold text-xs rounded-xl h-10"
            >
              I Understand
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
