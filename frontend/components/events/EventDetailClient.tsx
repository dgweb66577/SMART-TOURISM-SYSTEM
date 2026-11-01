'use client'

import React, { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  MapPin,
  Calendar,
  Clock,
  Star,
  Share2,
  Heart,
  Navigation,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Ticket,
  CheckCircle2,
  ShieldCheck,
  Music,
  Users,
  Info,
  Check,
  AlertCircle,
  X,
  CreditCard,
  QrCode,
  Download,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import RatingPieChart from '@/components/ui/RatingPieChart'
import { EventItem, TicketTier, EventReview } from '@/lib/data/eventsData'

interface EventDetailClientProps {
  event: EventItem
  similarEvents?: EventItem[]
}

export default function EventDetailClient({
  event,
  similarEvents = [],
}: EventDetailClientProps) {
  const [activePhotoIndex, setActivePhotoIndex] = useState(0)
  const [isSaved, setIsSaved] = useState(false)

  // Booking state
  const [selectedTier, setSelectedTier] = useState<TicketTier>(
    event.ticketTiers[0] || {
      id: 'default',
      name: 'General Entry',
      price: event.price,
      description: 'Regular admission pass',
      available: true,
    }
  )
  const [ticketQuantity, setTicketQuantity] = useState(1)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [bookingConfirmed, setBookingConfirmed] = useState(false)
  const [bookingPassId, setBookingPassId] = useState('')

  // Reviews state with authentic defaults
  const defaultReviews: EventReview[] =
    event.reviews && event.reviews.length > 0
      ? event.reviews
      : [
          {
            id: 'rev-default-1',
            author: 'Aakash Mehra',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=120',
            rating: 5,
            date: 'October 2026',
            comment: `Spectacular vibes at ${event.name}! The sound production, lights, and crowd management were superb.`,
          },
          {
            id: 'rev-default-2',
            author: 'Jessica D’Souza',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120',
            rating: 5,
            date: 'September 2026',
            comment: 'One of the best experiences in Goa! Great crowd, cold drinks, and fast bar counters.',
          },
          {
            id: 'rev-default-3',
            author: 'Rahul Sen',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120',
            rating: 4,
            date: 'August 2026',
            comment: 'Loved the music lineup and the location. Arrive a bit early to avoid parking congestion.',
          },
        ]

  const [reviewsList, setReviewsList] = useState<EventReview[]>(defaultReviews)
  const [newReviewAuthor, setNewReviewAuthor] = useState('')
  const [newReviewRating, setNewReviewRating] = useState(5)
  const [newReviewComment, setNewReviewComment] = useState('')

  // Check saved state from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('goa_saved_events')
      if (stored) {
        const ids: string[] = JSON.parse(stored)
        setIsSaved(ids.includes(event.id))
      }
    } catch {
      // Ignore
    }
  }, [event.id])

  const toggleSave = () => {
    try {
      const stored = localStorage.getItem('goa_saved_events')
      let ids: string[] = stored ? JSON.parse(stored) : []
      if (ids.includes(event.id)) {
        ids = ids.filter((id) => id !== event.id)
        setIsSaved(false)
        toast.info(`Removed "${event.name}" from saved events`)
      } else {
        ids.push(event.id)
        setIsSaved(true)
        toast.success(`Saved "${event.name}" to your favorites!`)
      }
      localStorage.setItem('goa_saved_events', JSON.stringify(ids))
    } catch {
      // Ignore
    }
  }

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      const shareData = {
        title: `${event.name} — Goa Events`,
        text: `Check out ${event.name} in ${event.city}, Goa!`,
        url: window.location.href,
      }
      if (navigator.share) {
        navigator.share(shareData).catch(() => {})
      } else {
        navigator.clipboard.writeText(window.location.href)
        toast.success('Event link copied to clipboard!')
      }
    }
  }

  const handleBookTickets = () => {
    const passCode = `GOA-EV-${Math.floor(100000 + Math.random() * 900000)}`
    setBookingPassId(passCode)
    setShowBookingModal(true)
    setBookingConfirmed(true)
  }

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) {
      toast.error('Please enter your name and review message.')
      return
    }

    const newRev: EventReview = {
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
    toast.success('Thank you! Your verified event review has been posted.')
  }

  // Synthesize ratings array for PieChart
  const synthesizedRatings = useMemo(() => {
    const list: number[] = []
    reviewsList.forEach((r) => list.push(r.rating))
    // augment up to 25 items reflecting average rating
    const avg = event.rating || 4.8
    const fillCount = Math.max(0, 25 - list.length)
    for (let i = 0; i < fillCount; i++) {
      if (i < fillCount * 0.75) list.push(Math.round(avg))
      else if (i < fillCount * 0.9) list.push(4)
      else list.push(5)
    }
    return list
  }, [reviewsList, event.rating])

  const galleryList = event.gallery && event.gallery.length > 0 ? event.gallery : [event.image]
  const totalPrice = selectedTier.price * ticketQuantity

  return (
    <div className="min-h-screen bg-[#FAF9F6] pb-24 text-slate-900">
      {/* 1. Breadcrumb Bar */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link href="/events" className="hover:text-slate-900 transition-colors">
              Events
            </Link>
            <span>/</span>
            <span className="font-semibold text-slate-900 truncate max-w-[200px] sm:max-w-none">
              {event.name}
            </span>
          </div>

          <Link
            href="/events"
            className="inline-flex items-center gap-1 font-bold text-[#EA580C] hover:underline"
          >
            <ChevronLeft className="h-4 w-4" /> Back to All Events
          </Link>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* ================= LEFT COLUMN: EVENT DETAILS (8 Cols) ================= */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. Hero Image & Thumbnail Strip (matching goa.app places layout) */}
            <div className="space-y-3">
              <div className="relative h-72 sm:h-96 md:h-[420px] w-full rounded-2xl overflow-hidden shadow-md bg-slate-900">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={galleryList[activePhotoIndex] || event.image}
                  alt={event.name}
                  className="h-full w-full object-cover transition-opacity duration-300"
                />

                {/* Top Category Badge */}
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-white/95 backdrop-blur-md text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full shadow-md flex items-center gap-1.5 border border-slate-200">
                    <span className="h-2 w-2 rounded-full bg-[#EA580C]" />
                    {event.categoryLabel}
                  </span>
                </div>

                {/* Date & Time pill (Bottom Left) */}
                <div className="absolute bottom-4 left-4 z-10">
                  <span className="bg-slate-900/85 backdrop-blur-md text-white text-xs font-bold px-3.5 py-1.5 rounded-xl shadow-md flex items-center gap-2 border border-white/20">
                    <Calendar className="h-3.5 w-3.5 text-[#EA580C]" />
                    <span>{event.startDate}</span>
                    <span className="opacity-40">|</span>
                    <Clock className="h-3.5 w-3.5 text-[#EA580C]" />
                    <span>{event.startTime}</span>
                  </span>
                </div>

                {/* Previous / Next buttons */}
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

              {/* Thumbnails Row directly below image */}
              {galleryList.length > 1 && (
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
              )}
            </div>

            {/* 2. Event Title, Venue & Ratings */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight">
                    {event.name}
                  </h1>
                  <p className="flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600">
                    <MapPin className="h-4 w-4 text-[#EA580C] shrink-0" />
                    <span>
                      {event.venue}, {event.city}
                    </span>
                  </p>
                </div>

                {/* Golden Stars Rating Badge */}
                <div className="flex items-center gap-1.5 shrink-0 bg-amber-50 px-3.5 py-2 rounded-xl border border-amber-200/80">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-slate-900 ml-1">
                    {event.rating}
                  </span>
                  <span className="text-xs text-slate-500">
                    ({event.reviewsCount.toLocaleString()})
                  </span>
                </div>
              </div>

              {/* Main Description */}
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed pt-1">
                {event.description}
              </p>

              {/* Quick Info Grid (Date, Time, Location, Entry) */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Date
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900 mt-0.5 block">
                    {event.startDate}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Timing
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900 mt-0.5 block">
                    {event.startTime} - {event.endTime}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Location
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-slate-900 mt-0.5 block truncate">
                    {event.city}
                  </span>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Admission
                  </span>
                  <span className="text-xs sm:text-sm font-extrabold text-[#EA580C] mt-0.5 block">
                    {event.free ? 'Free Entry' : `₹${event.price.toLocaleString()} ${event.priceUnit}`}
                  </span>
                </div>
              </div>

              {/* Actions Row: Directions, Save, Share */}
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <a
                  href={event.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#EA580C] hover:bg-[#c2410c] text-white text-xs font-bold shadow-sm transition-all"
                >
                  <Navigation className="h-4 w-4" />
                  Get Venue Directions
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
                  {isSaved ? 'Saved to Favorites' : 'Save Event'}
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

            {/* 3. About the Event */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-4">
              <h2 className="text-lg font-black uppercase tracking-tight text-slate-900 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#EA580C]" /> About This Event
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">{event.about}</p>

              {/* Performing Artists / Lineup */}
              {event.lineup && event.lineup.length > 0 && (
                <div className="pt-3 space-y-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    Lineup & Performing Artists
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {event.lineup.map((artist, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 bg-orange-50 border border-orange-200 text-orange-950 font-bold text-xs rounded-xl flex items-center gap-1.5"
                      >
                        <Music className="h-3.5 w-3.5 text-[#EA580C]" />
                        {artist}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Event Highlights */}
              <div className="pt-4 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Event Highlights
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {event.highlights.map((h, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-800"
                    >
                      <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Guidelines & Terms */}
              <div className="pt-4 space-y-2.5">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Important Guidelines & Entry Rules
                </h3>
                <div className="space-y-2">
                  {event.guidelines.map((rule, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2 text-xs text-slate-600 bg-amber-50/50 p-2.5 rounded-lg border border-amber-100"
                    >
                      <Info className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <span>{rule}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Organizer verification footer */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span>
                    Organized by{' '}
                    <strong className="text-slate-900 font-bold">
                      {event.organizer.name}
                    </strong>
                  </span>
                </div>
                {event.organizer.verified && (
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Verified Organizer
                  </span>
                )}
              </div>
            </div>

            {/* 4. Verified Reviews & Rating Pie Chart (Exact implementation like places & restaurants) */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h2 className="text-xl font-black uppercase tracking-tight text-slate-900">
                    Event Reviews & Ratings
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Verified feedback from attendees and festival goers
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-sm font-extrabold text-slate-900">
                    {event.rating} out of 5
                  </span>
                </div>
              </div>

              {/* Pie Chart Component */}
              <RatingPieChart
                ratings={synthesizedRatings}
                totalReviewsCount={event.reviewsCount}
                averageRating={event.rating}
                title="Event Attendee Rating Breakdown"
              />

              {/* Review Submission Form */}
              <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-4">
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Star className="h-4 w-4 text-[#EA580C]" /> Share Your Event Experience
                </h3>

                <form onSubmit={handleAddReview} className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Priya Naik"
                        value={newReviewAuthor}
                        onChange={(e) => setNewReviewAuthor(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-xs font-semibold text-slate-600 block mb-1">
                        Rating (1 to 5 Stars)
                      </label>
                      <div className="flex items-center gap-1.5 h-9">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            type="button"
                            key={star}
                            onClick={() => setNewReviewRating(star)}
                            className="p-1 text-amber-400 hover:scale-110 transition-transform"
                          >
                            <Star
                              className={`h-5 w-5 ${
                                star <= newReviewRating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-300'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="text-xs font-bold text-slate-700 ml-2">
                          {newReviewRating} Star{newReviewRating > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 block mb-1">
                      Your Review
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Share details about the venue, crowd, artists, parking, or overall vibe..."
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="bg-[#EA580C] hover:bg-[#c2410c] text-white text-xs font-bold rounded-xl h-9 px-4"
                  >
                    Post Verified Review
                  </Button>
                </form>
              </div>

              {/* Reviews List */}
              <div className="space-y-3 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Attendee Reviews ({reviewsList.length})
                </h3>

                <div className="space-y-3">
                  {reviewsList.map((rev) => (
                    <div
                      key={rev.id}
                      className="p-4 rounded-xl border border-slate-200 bg-white space-y-2 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={rev.avatar}
                            alt={rev.author}
                            className="h-8 w-8 rounded-full object-cover border border-slate-200"
                          />
                          <div>
                            <span className="text-xs font-bold text-slate-900 block">
                              {rev.author}
                            </span>
                            <span className="text-[10px] text-slate-400 font-medium">
                              {rev.date}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-0.5 text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-3.5 w-3.5 ${
                                i < rev.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-200'
                              }`}
                            />
                          ))}
                        </div>
                      </div>

                      <p className="text-xs text-slate-700 leading-relaxed">
                        {rev.comment}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ================= RIGHT COLUMN: TICKET BOOKING & VENUE (4 Cols) ================= */}
          <div className="lg:col-span-4 space-y-6">
            {/* Sticky Ticket Booking Box */}
            <div className="sticky top-20 bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-sm space-y-5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    Entry & Tickets
                  </span>
                  <div className="text-2xl font-black text-slate-900 mt-0.5">
                    {event.free ? (
                      <span className="text-emerald-600">Free Entry</span>
                    ) : (
                      <>
                        ₹{selectedTier.price.toLocaleString()}
                        <span className="text-xs font-normal text-slate-500 ml-1">
                          {event.priceUnit}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="h-10 w-10 rounded-xl bg-orange-50 border border-orange-200 text-[#EA580C] flex items-center justify-center">
                  <Ticket className="h-5 w-5" />
                </div>
              </div>

              {/* Ticket Tier Selection */}
              {event.ticketTiers.length > 0 && (
                <div className="space-y-2.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Select Ticket Option:
                  </label>
                  <div className="space-y-2">
                    {event.ticketTiers.map((tier) => {
                      const isChosen = selectedTier.id === tier.id
                      return (
                        <div
                          key={tier.id}
                          onClick={() => setSelectedTier(tier)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all ${
                            isChosen
                              ? 'border-[#EA580C] bg-orange-50/60 ring-1 ring-[#EA580C]'
                              : 'border-slate-200 hover:border-slate-300 bg-white'
                          }`}
                        >
                          <div className="flex items-center justify-between text-xs font-bold">
                            <span className="text-slate-900">{tier.name}</span>
                            <span className="text-[#EA580C]">
                              {tier.price === 0 ? 'FREE' : `₹${tier.price.toLocaleString()}`}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">
                            {tier.description}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Quantity Counter (if not free) */}
              {!event.free && (
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xs font-bold text-slate-700">Quantity</span>
                  <div className="flex items-center gap-3 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200">
                    <button
                      onClick={() => setTicketQuantity((q) => Math.max(1, q - 1))}
                      className="h-6 w-6 rounded-md bg-white text-slate-700 font-bold hover:bg-slate-200 flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="text-xs font-extrabold text-slate-900 w-4 text-center">
                      {ticketQuantity}
                    </span>
                    <button
                      onClick={() => setTicketQuantity((q) => Math.min(10, q + 1))}
                      className="h-6 w-6 rounded-md bg-white text-slate-700 font-bold hover:bg-slate-200 flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}

              {/* Total & Book Button */}
              <div className="pt-2 border-t border-slate-100 space-y-3">
                {!event.free && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-500">Total Payable:</span>
                    <span className="text-lg font-black text-slate-900">
                      ₹{totalPrice.toLocaleString()}
                    </span>
                  </div>
                )}

                <Button
                  onClick={handleBookTickets}
                  className="w-full bg-[#EA580C] hover:bg-[#c2410c] text-white font-bold rounded-xl h-12 text-sm shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Ticket className="h-4 w-4" />
                  {event.free ? 'Register for Free Spot' : 'Book Tickets Now'}
                </Button>

                <p className="text-[11px] text-slate-400 text-center flex items-center justify-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                  Instant confirmation & official QR entry pass
                </p>
              </div>

              {/* Venue Snapshot Card */}
              <div className="pt-4 border-t border-slate-100 space-y-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Venue Location
                </span>
                <p className="text-xs font-bold text-slate-900">{event.venue}</p>
                <p className="text-xs text-slate-500">{event.fullAddress}</p>
                <a
                  href={event.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#EA580C] hover:underline pt-1"
                >
                  <Navigation className="h-3.5 w-3.5" /> Open in Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Similar / More Events Carousel */}
        {similarEvents.length > 0 && (
          <section className="pt-12 border-t border-slate-200 space-y-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-slate-900">
                You May Also Like
              </h2>
              <p className="text-xs text-slate-500">
                More top events in {event.region} and surrounding areas
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {similarEvents.map((sim) => (
                <Link
                  key={sim.id}
                  href={`/events/${sim.slug}`}
                  className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-36 w-full overflow-hidden bg-slate-900">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={sim.image}
                        alt={sim.name}
                        className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <span className="absolute top-2 left-2 bg-white/95 text-slate-900 text-[10px] font-bold px-2 py-0.5 rounded shadow-xs">
                        {sim.categoryLabel}
                      </span>
                    </div>

                    <div className="p-3.5 space-y-1">
                      <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 group-hover:text-[#EA580C] transition-colors">
                        {sim.name}
                      </h3>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        {sim.city}
                      </p>
                    </div>
                  </div>

                  <div className="px-3.5 pb-3 pt-1 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-900">
                      {sim.free ? 'Free Entry' : `₹${sim.price}`}
                    </span>
                    <span className="text-[11px] font-bold text-[#EA580C]">
                      View →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Ticket Confirmation Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 space-y-5">
            <button
              onClick={() => setShowBookingModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center space-y-2">
              <div className="h-14 w-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <Check className="h-7 w-7 stroke-[3]" />
              </div>
              <h3 className="text-xl font-black text-slate-900">
                Booking Confirmed!
              </h3>
              <p className="text-xs text-slate-500">
                Your official pass has been generated. Show this at the event entrance counter.
              </p>
            </div>

            {/* Pass Preview Card */}
            <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-4 shadow-lg border border-slate-800">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
                    Official Event Pass
                  </span>
                  <h4 className="text-sm font-bold text-white line-clamp-1">
                    {event.name}
                  </h4>
                </div>
                <QrCode className="h-8 w-8 text-white/80 shrink-0" />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">
                    Pass ID
                  </span>
                  <span className="font-mono font-bold text-white">
                    {bookingPassId}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">
                    Tier / Type
                  </span>
                  <span className="font-bold text-white">
                    {selectedTier.name} (x{ticketQuantity})
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">
                    Date & Time
                  </span>
                  <span className="font-bold text-white">
                    {event.startDate} · {event.startTime}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 block uppercase">
                    Venue
                  </span>
                  <span className="font-bold text-white truncate block">
                    {event.venue}
                  </span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-slate-400">Status:</span>
                <span className="font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                  Active / Valid
                </span>
              </div>
            </div>

            <Button
              onClick={() => {
                setShowBookingModal(false)
                toast.success(`Pass ${bookingPassId} saved to your Goa Tourism Wallet!`)
              }}
              className="w-full bg-[#EA580C] hover:bg-[#c2410c] text-white font-bold rounded-xl h-11 text-xs"
            >
              Done & Save to Wallet
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
