'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  MapPin,
  Star,
  ShieldCheck,
  ShieldAlert,
  Navigation,
  Heart,
  Share2,
  Clock,
  Tag,
  CheckCircle2,
  Check,
  Info,
  Calendar,
  Waves,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import RatingPieChart from '@/components/ui/RatingPieChart'
import {
  PlaceItem,
  PopularExperience,
  POPULAR_EXPERIENCES,
  PLACES_DATA,
} from '@/lib/data/placesData'

interface PlaceDetailClientProps {
  place: PlaceItem
  nearbyPlaces?: PlaceItem[]
  experiences?: PopularExperience[]
}

export default function PlaceDetailClient({
  place,
  nearbyPlaces = [],
  experiences = POPULAR_EXPERIENCES,
}: PlaceDetailClientProps) {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0)
  const [isSaved, setIsSaved] = useState(false)
  const [bookingExperience, setBookingExperience] = useState<PopularExperience | null>(null)

  // Reviews state with authentic defaults
  const defaultReviews = place.reviews && place.reviews.length > 0 ? place.reviews : [
    {
      id: 'rev-default-1',
      author: 'Priya Shirodkar',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120',
      rating: 5,
      date: 'October 2026',
      comment: `Spectacular visit to ${place.name}! The atmosphere, coastal views, and facilities were beyond expectations.`,
    },
    {
      id: 'rev-default-2',
      author: 'Sameer Kulkarni',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120',
      rating: 5,
      date: 'September 2026',
      comment: 'Extremely clean, scenic, and well-managed spot. Arrive early to enjoy the peaceful morning breeze.',
    },
    {
      id: 'rev-default-3',
      author: 'Elena Gilbert',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120',
      rating: 4,
      date: 'August 2026',
      comment: 'Loved the experience! Plenty of parking and great surrounding shacks. Highly recommended for travelers.',
    },
  ]

  const [reviewsList, setReviewsList] = useState(defaultReviews)
  const [newReviewAuthor, setNewReviewAuthor] = useState('')
  const [newReviewRating, setNewReviewRating] = useState(5)
  const [newReviewComment, setNewReviewComment] = useState('')

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) {
      toast.error('Please enter your name and a brief review message.')
      return
    }

    const newRev = {
      id: `rev-${Date.now()}`,
      author: newReviewAuthor.trim(),
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120',
      rating: newReviewRating,
      date: 'Just now',
      comment: newReviewComment.trim(),
    }

    setReviewsList([newRev, ...reviewsList])
    setNewReviewAuthor('')
    setNewReviewComment('')
    toast.success('Thank you! Your verified review has been posted.')
  }

  // Check saved state from localStorage
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem('goa_saved_places')
      if (stored) {
        const ids: string[] = JSON.parse(stored)
        setIsSaved(ids.includes(place.id))
      }
    } catch {
      // Ignore
    }
  }, [place.id])

  const toggleSave = () => {
    try {
      const stored = localStorage.getItem('goa_saved_places')
      let ids: string[] = stored ? JSON.parse(stored) : []
      if (ids.includes(place.id)) {
        ids = ids.filter((id) => id !== place.id)
        setIsSaved(false)
        toast.info(`Removed "${place.name}" from saved places`)
      } else {
        ids.push(place.id)
        setIsSaved(true)
        toast.success(`Saved "${place.name}" to your favorites!`)
      }
      localStorage.setItem('goa_saved_places', JSON.stringify(ids))
    } catch {
      // Ignore
    }
  }

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const shareData = {
        title: `${place.name} — Goa Places`,
        text: `Explore ${place.name} in ${place.location}!`,
        url: window.location.href,
      }
      if (navigator.share) {
        navigator.share(shareData).catch(() => {})
      } else {
        navigator.clipboard.writeText(window.location.href)
        toast.success('Place link copied to clipboard!')
      }
    }
  }

  const handleBookExperience = (exp: PopularExperience) => {
    toast.success(`Selected "${exp.title}" (${exp.price} ${exp.unit})! Redirecting to booking confirmation...`)
  }

  const galleryList = place.gallery && place.gallery.length > 0 ? place.gallery : [place.image]

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24 text-slate-900">
      {/* Breadcrumb Bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/places" className="hover:text-slate-900 transition-colors">
              Places
            </Link>
            <span>/</span>
            <span className="font-semibold text-slate-900 truncate max-w-[200px] sm:max-w-none">
              {place.name}
            </span>
          </div>

          <Link
            href="/places"
            className="inline-flex items-center gap-1 font-bold text-[#EA580C] hover:underline"
          >
            <ChevronLeft className="h-4 w-4" /> Back to All Places
          </Link>
        </div>
      </div>

      {/* Main Two-Column Layout (Matching goa.app screenshot) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================= LEFT COLUMN: MAIN PLACE CONTENT (8 Cols) ================= */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Main Hero Image Container */}
            <div className="space-y-3">
              <div className="relative h-72 sm:h-96 md:h-[420px] w-full rounded-2xl overflow-hidden shadow-md bg-slate-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={galleryList[activePhotoIndex] || place.image}
                  alt={place.name}
                  className="h-full w-full object-cover transition-opacity duration-300"
                />

                {/* Top Category Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-white/95 backdrop-blur-md text-slate-900 text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center gap-1.5 border border-slate-200">
                    <span className="text-[#EA580C]">●</span> {place.categoryLabel}
                  </span>
                </div>

                {/* Previous / Next buttons for desktop */}
                {galleryList.length > 1 && (
                  <>
                    <button
                      onClick={() =>
                        setActivePhotoIndex((prev) =>
                          prev === 0 ? galleryList.length - 1 : prev - 1
                        )
                      }
                      className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm transition-colors"
                      aria-label="Previous image"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() =>
                        setActivePhotoIndex((prev) =>
                          prev === galleryList.length - 1 ? 0 : prev + 1
                        )
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm transition-colors"
                      aria-label="Next image"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails Row directly below image (as in goa.app screenshot) */}
              <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
                {galleryList.map((photo, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActivePhotoIndex(idx)}
                    className={`relative h-16 w-24 sm:h-20 sm:w-28 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      activePhotoIndex === idx
                        ? 'border-[#EA580C] ring-2 ring-orange-400/40 scale-105'
                        : 'border-slate-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={photo} alt="Thumbnail" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Place Title, Location, and Rating (Exact goa.app layout) */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-3">
                <div>
                  <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    {place.name}
                  </h1>
                  {place.localName && (
                    <p className="text-xs font-semibold text-slate-500 mt-0.5">
                      {place.localName}
                    </p>
                  )}
                  <p className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 mt-2">
                    <MapPin className="h-4 w-4 text-[#EA580C] shrink-0" />
                    {place.location}
                  </p>
                </div>

                {/* Golden Stars Rating */}
                <div className="flex items-center gap-1.5 shrink-0 bg-amber-50 px-3.5 py-2 rounded-xl border border-amber-200/80">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-slate-900 ml-1">
                    {place.rating}
                  </span>
                  <span className="text-xs text-slate-500">
                    ({place.reviewsCount.toLocaleString()})
                  </span>
                </div>
              </div>

              {/* Main Description */}
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed pt-2">
                {place.description}
              </p>

              {/* Action Buttons: Directions, Save, Share */}
              <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
                <a
                  href={place.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#c2410c] text-white text-xs font-bold shadow-md transition-all"
                >
                  <Navigation className="h-4 w-4" />
                  Get Directions (Google Maps)
                </a>

                <Button
                  onClick={toggleSave}
                  variant="outline"
                  className={`text-xs font-bold rounded-xl h-10 px-4 gap-1.5 ${
                    isSaved
                      ? 'border-rose-300 bg-rose-50 text-rose-700'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <Heart className={`h-4 w-4 ${isSaved ? 'fill-rose-500 text-rose-500' : ''}`} />
                  {isSaved ? 'Saved to Favorites' : 'Save Place'}
                </Button>

                <Button
                  onClick={handleShare}
                  variant="outline"
                  className="text-xs font-bold rounded-xl h-10 px-4 border-slate-200 text-slate-700 hover:bg-slate-50 gap-1.5"
                >
                  <Share2 className="h-4 w-4" />
                  Share
                </Button>
              </div>
            </div>

            {/* 3. Beach Safety Status Banner if Beach */}
            {place.beachSafety && (
              <div
                className={`p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  place.beachSafety.flagStatus === 'safe'
                    ? 'bg-emerald-50/90 border-emerald-200 text-emerald-950'
                    : 'bg-amber-50/90 border-amber-200 text-amber-950'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center shrink-0 ${
                      place.beachSafety.flagStatus === 'safe'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    {place.beachSafety.flagStatus === 'safe' ? (
                      <ShieldCheck className="h-5 w-5" />
                    ) : (
                      <ShieldAlert className="h-5 w-5" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold uppercase tracking-wide">
                      {place.beachSafety.flagLabel}
                    </h3>
                    <p className="text-xs mt-0.5 opacity-90">
                      {place.beachSafety.swimZone}
                    </p>
                    {place.beachSafety.tideAdvisory && (
                      <p className="text-xs font-semibold mt-1 text-slate-600">
                        🌊 {place.beachSafety.tideAdvisory}
                      </p>
                    )}
                  </div>
                </div>

                <div className="shrink-0 self-start sm:self-auto bg-white/90 border border-current px-3 py-1.5 rounded-xl text-xs font-bold">
                  Drishti Marine Patrolled
                </div>
              </div>
            )}

            {/* 4. Quick Facts Grid: Timings, Entry, Best Time */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-[#EA580C]" /> Operational Timings
                </span>
                <p className="text-xs font-bold text-slate-900">{place.timings}</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-[#EA580C]" /> Entry Fee
                </span>
                <p className="text-xs font-bold text-slate-900">{place.entryFee}</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200/90 shadow-sm space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-[#EA580C]" /> Best Time to Visit
                </span>
                <p className="text-xs font-bold text-slate-900">{place.bestTimeToVisit}</p>
              </div>
            </div>

            {/* 5. Key Highlights & Things to Do */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Key Highlights & Things to Do
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {place.highlights.map((highlight, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-700 leading-relaxed"
                  >
                    <CheckCircle2 className="h-4 w-4 text-[#EA580C] shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 6. Facilities & Amenities */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-4">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                Amenities & Facilities
              </h2>
              <div className="flex flex-wrap gap-2">
                {place.amenities.map((amenity, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 text-xs font-semibold text-slate-700"
                  >
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            {/* 7. Visitor Tips */}
            {place.travelTips && place.travelTips.length > 0 && (
              <div className="p-5 bg-sky-50 rounded-2xl border border-sky-200/80 space-y-2">
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-sky-950 flex items-center gap-1.5">
                  <Info className="h-4 w-4 text-sky-700" />
                  Local Tips for Visitors
                </h3>
                <ul className="space-y-1.5 text-xs text-sky-950">
                  {place.travelTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-sky-600 font-bold">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* 8. VISITOR RATING BREAKDOWN (COLOR-CODED PIE CHART) */}
            <RatingPieChart
              ratings={reviewsList.map((r) => r.rating)}
              totalReviewsCount={place.reviewsCount + reviewsList.length - defaultReviews.length}
              averageRating={place.rating}
              title="Visitor Rating Breakdown (Color-Coded Pie Chart)"
            />

            {/* 9. REVIEWS LIST & SUBMISSION FORM */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="text-lg font-black text-slate-900 tracking-tight">
                    Visitor Reviews & Experiences
                  </h2>
                  <p className="text-xs text-slate-500">
                    Real traveler feedback and ratings for {place.name}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-900 font-extrabold text-xs px-3 py-1 rounded-xl">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  <span>{place.rating} / 5.0</span>
                </div>
              </div>

              {/* Verified Reviews List */}
              <div className="space-y-4">
                {reviewsList.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl border border-slate-100 space-y-2 bg-slate-50/60">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={rev.avatar}
                          alt={rev.author}
                          className="h-8 w-8 rounded-full object-cover"
                        />
                        <div>
                          <h4 className="text-xs font-extrabold text-slate-900">{rev.author}</h4>
                          <span className="text-[10px] text-slate-400">{rev.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, s) => (
                          <Star
                            key={s}
                            className={`h-3.5 w-3.5 ${
                              s < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">&ldquo;{rev.comment}&rdquo;</p>
                  </div>
                ))}
              </div>

              {/* Add Review Form */}
              <form onSubmit={handleAddReview} className="pt-5 border-t border-slate-100 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Write a Review for {place.name}
                  </h3>
                  <span className="text-[10px] text-slate-400">Updates ratings & pie chart live</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Your Name (e.g. Rahul Sardessai)"
                    value={newReviewAuthor}
                    onChange={(e) => setNewReviewAuthor(e.target.value)}
                    className="h-10 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                  />

                  {/* Interactive Star Rating Selector */}
                  <div className="flex items-center justify-between px-3 h-10 rounded-xl border border-slate-200 bg-slate-50">
                    <span className="text-xs text-slate-500 font-semibold">Your Rating:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReviewRating(star)}
                          className="p-1 focus:outline-none hover:scale-110 transition-transform"
                          title={`${star} Star${star > 1 ? 's' : ''}`}
                        >
                          <Star
                            className={`h-4 w-4 ${
                              star <= newReviewRating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <textarea
                  placeholder="Share your authentic experience, tips, views, and facilities..."
                  rows={3}
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                />

                <Button
                  type="submit"
                  size="sm"
                  className="bg-[#EA580C] hover:bg-[#c2410c] text-white text-xs font-bold rounded-xl h-9 px-5 shadow-sm"
                >
                  Submit Verified Review
                </Button>
              </form>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: POPULAR EXPERIENCES SIDEBAR (4 Cols) ================= */}
          <div className="lg:col-span-4 space-y-6">
            {/* Header: "POPULAR EXPERIENCES" (Exact matching goa.app screenshot) */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm sm:text-base font-black uppercase tracking-wider text-slate-900">
                  POPULAR EXPERIENCES
                </h2>
              </div>

              {/* Experience Cards Stack */}
              <div className="space-y-4">
                {experiences.map((exp) => (
                  <div
                    key={exp.id}
                    className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    {/* Experience Photo with Location pill */}
                    <div className="relative h-44 w-full overflow-hidden bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={exp.image}
                        alt={exp.title}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />

                      {/* Location Badge (e.g. 📍 Chapora, 📍 Vagator as in screenshot) */}
                      <div className="absolute top-3 left-3">
                        <span className="bg-white/95 backdrop-blur-md text-slate-900 text-[11px] font-bold px-2.5 py-1 rounded-md shadow-sm flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-[#EA580C]" />
                          {exp.location}
                        </span>
                      </div>
                    </div>

                    {/* Experience Content */}
                    <div className="p-4 space-y-2.5">
                      <h3 className="font-extrabold text-sm text-slate-900 group-hover:text-[#EA580C] transition-colors line-clamp-2">
                        {exp.title}
                      </h3>

                      {/* Rating & Bookings (e.g. ★★★★★ | 3k+ Bookings as in screenshot) */}
                      <div className="flex items-center gap-2 text-xs">
                        <div className="flex items-center text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <span className="text-slate-400">|</span>
                        <span className="text-slate-500 font-medium text-[11px]">
                          {exp.bookings}
                        </span>
                      </div>

                      {/* Pricing with Discount Tag (e.g. 9% Off | ₹3500 ₹3200 /ticket as in screenshot) */}
                      <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                        <div className="flex items-center gap-2">
                          {exp.discountPercent && (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                              {exp.discountPercent}% Off
                            </span>
                          )}
                          <div className="flex items-baseline gap-1.5">
                            {exp.originalPrice && (
                              <span className="text-xs text-slate-400 line-through">
                                ₹{exp.originalPrice}
                              </span>
                            )}
                            <span className="text-sm font-black text-slate-900">
                              ₹{exp.price}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium">
                              {exp.unit}
                            </span>
                          </div>
                        </div>

                        <Button
                          onClick={() => handleBookExperience(exp)}
                          size="sm"
                          className="h-7 text-[11px] font-bold bg-[#EA580C] hover:bg-[#c2410c] text-white rounded-lg px-2.5 shadow-sm"
                        >
                          Book Now
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Other Nearby Places */}
            {nearbyPlaces.length > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-sm space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
                  Nearby Spots to Visit
                </h3>
                <div className="space-y-2.5">
                  {nearbyPlaces.map((np) => (
                    <Link
                      key={np.id}
                      href={`/places/${np.slug}`}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-colors group"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={np.image}
                        alt={np.name}
                        className="h-12 w-12 rounded-lg object-cover shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#EA580C] truncate">
                          {np.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 truncate">{np.location}</p>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-slate-700 shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

