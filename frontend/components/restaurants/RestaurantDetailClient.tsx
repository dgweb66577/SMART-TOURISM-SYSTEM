'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  MapPin,
  Star,
  Clock,
  Phone,
  MessageCircle,
  Share2,
  Heart,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Tag,
  Check,
  Calendar,
  Users,
  UtensilsCrossed,
  Sparkles,
  Navigation,
  Copy,
  Lock,
  Unlock,
  CheckCircle2,
  X,
  Coffee,
  ExternalLink,
  Camera,
  Maximize2,
  Compass,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  RestaurantDetail,
  RESTAURANTS_DATA,
  DishItem,
} from '@/lib/data/restaurantsData'

interface Props {
  restaurant: RestaurantDetail
}

export function RestaurantDetailClient({ restaurant }: Props) {
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [activeMediaTab, setActiveMediaTab] = useState<'photos' | 'menu'>('photos')
  const [selectedMenuCategory, setSelectedMenuCategory] = useState<string>('all')
  const [vegOnlyFilter, setVegOnlyFilter] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [copiedCoupon, setCopiedCoupon] = useState(false)
  const [selectedPhotoPreview, setSelectedPhotoPreview] = useState<string | null>(null)

  // Offer unlock states (exact goa.app feature)
  const [unlockedOffers, setUnlockedOffers] = useState<string[]>([])

  // Booking widget states
  const [bookingDate, setBookingDate] = useState('Today')
  const [bookingTime, setBookingTime] = useState('08:00 PM')
  const [bookingGuests, setBookingGuests] = useState('2')
  const [seatingPreference, setSeatingPreference] = useState('Indoor AC')
  const [isBooked, setIsBooked] = useState(false)

  // Review Form
  const [newReviewAuthor, setNewReviewAuthor] = useState('')
  const [newReviewRating, setNewReviewRating] = useState(5)
  const [newReviewComment, setNewReviewComment] = useState('')
  const [reviewsList, setReviewsList] = useState(restaurant.reviews)

  // Dish order simulator
  const [orderItems, setOrderItems] = useState<{ [id: string]: number }>({})

  const allImages = [restaurant.image, ...(restaurant.gallery || [])]

  // Offers matching the goa.app style
  const offers = [
    {
      id: 'offer-1',
      title: `${restaurant.featuredOffer || 'Flat 15% Off'} on F&B at ${restaurant.name} Panjim`,
      condition: `On food and beverage bill above ₹${restaurant.priceRange === '₹₹₹' ? '2500' : '2000'}`,
      code: restaurant.couponCode || 'GOA15',
    },
    {
      id: 'offer-2',
      title: `Free Chef Special Dessert on orders above ₹${restaurant.priceRange === '₹₹₹' ? '3000' : '1800'}`,
      condition: 'Valid on dine-in only • Cannot be combined with other offers',
      code: `${(restaurant.couponCode || 'GOA').replace(/\d+/g, '')}SWEET`,
    },
    {
      id: 'offer-3',
      title: 'Complimentary Welcome Drink for goa.app Verified Guests',
      condition: 'Show your verified reservation or digital pass at entry',
      code: 'GOAWELCOME',
    },
  ]

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Restaurant link copied to clipboard!')
    }
  }

  const handleCopyCoupon = () => {
    if (restaurant.couponCode) {
      navigator.clipboard.writeText(restaurant.couponCode)
      setCopiedCoupon(true)
      toast.success(`Coupon code ${restaurant.couponCode} copied!`)
      setTimeout(() => setCopiedCoupon(false), 3000)
    }
  }

  const toggleBookmark = () => {
    setIsSaved((prev) => {
      const next = !prev
      toast.success(
        next
          ? `Added ${restaurant.name} to your Goa bucket list!`
          : `Removed ${restaurant.name} from saved spots`
      )
      return next
    })
  }

  const handleUnlockOffer = (offerId: string, code: string) => {
    setUnlockedOffers((prev) => [...prev, offerId])
    navigator.clipboard.writeText(code)
    toast.success(`Offer unlocked! Code "${code}" copied to clipboard.`, {
      description: 'Show this code to your server before requesting the bill.',
    })
  }

  const handleReserveTable = (e: React.FormEvent) => {
    e.preventDefault()
    setIsBooked(true)
    toast.success('Table reserved successfully!', {
      description: `Party of ${bookingGuests} booked for ${bookingDate} at ${bookingTime} (${seatingPreference}). ${restaurant.featuredOffer} applied!`,
    })
  }

  const handleAddDish = (dish: DishItem) => {
    setOrderItems((prev) => ({
      ...prev,
      [dish.id]: (prev[dish.id] || 0) + 1,
    }))
    toast.success(`Added "${dish.name}" to your order list`)
  }

  const handleRemoveDish = (dishId: string) => {
    setOrderItems((prev) => {
      const updated = { ...prev }
      if (updated[dishId] > 1) {
        updated[dishId] -= 1
      } else {
        delete updated[dishId]
      }
      return updated
    })
  }

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newReviewAuthor.trim() || !newReviewComment.trim()) {
      toast.error('Please enter your name and a brief review')
      return
    }
    const reviewObj = {
      id: `rev-${Date.now()}`,
      author: newReviewAuthor,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150',
      rating: newReviewRating,
      date: 'Today',
      comment: newReviewComment,
    }
    setReviewsList([reviewObj, ...reviewsList])
    setNewReviewAuthor('')
    setNewReviewComment('')
    toast.success('Thank you! Your verified review has been posted.')
  }

  // Filter dishes
  const filteredDishes = restaurant.menu.filter((dish) => {
    if (vegOnlyFilter && !dish.isVeg) return false
    if (selectedMenuCategory === 'all') return true
    return dish.category === selectedMenuCategory
  })

  // Calculate order total
  const totalItemsCount = Object.values(orderItems).reduce((a, b) => a + b, 0)
  const rawSubtotal = Object.entries(orderItems).reduce((sum, [id, qty]) => {
    const dish = restaurant.menu.find((d) => d.id === id)
    return sum + (dish ? dish.price * qty : 0)
  }, 0)
  const discountAmount = Math.round(rawSubtotal * ((restaurant.discountPercent || 15) / 100))
  const finalTotal = Math.max(0, rawSubtotal - discountAmount)

  // Nearby restaurants
  const nearbyRestaurants = RESTAURANTS_DATA.filter((r) => r.id !== restaurant.id).slice(0, 3)

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-28 md:pb-20">
      {/* ═══════════════════════════════════════════════════════ */}
      {/* 1. HERO BANNER — Exact layout from goa.app screenshot */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
        <div className="relative h-72 sm:h-96 md:h-[460px] w-full rounded-2xl md:rounded-3xl overflow-hidden shadow-sm">
          <div
            className="absolute inset-0 bg-cover bg-center transition-all duration-700"
            style={{ backgroundImage: `url('${allImages[activeImageIndex]}')` }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

          {/* Top Right Actions */}
          <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
            <button
              onClick={handleShare}
              className="h-9 w-9 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/30 transition-colors"
              title="Share"
            >
              <Share2 className="h-4 w-4" />
            </button>
            <button
              onClick={toggleBookmark}
              className={`h-9 w-9 rounded-full backdrop-blur-md flex items-center justify-center transition-colors ${
                isSaved ? 'bg-red-500 text-white' : 'bg-white/20 text-white hover:bg-white/30'
              }`}
              title={isSaved ? 'Saved' : 'Save'}
            >
              <Heart className={`h-4 w-4 ${isSaved ? 'fill-white' : ''}`} />
            </button>
          </div>

          {/* Gallery navigation controls */}
          {allImages.length > 1 && (
            <>
              <button
                onClick={() => setActiveImageIndex((prev) => (prev === 0 ? allImages.length - 1 : prev - 1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors z-10"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={() => setActiveImageIndex((prev) => (prev === allImages.length - 1 ? 0 : prev + 1))}
                className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-black/60 transition-colors z-10"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </>
          )}

          {/* Center-Left Signature White Logo Badge (exact match to goa.app screenshot) */}
          <div className="absolute left-6 sm:left-10 bottom-24 sm:bottom-28 z-10">
            <div className="w-24 h-24 sm:w-28 sm:h-28 bg-white rounded-2xl shadow-2xl flex flex-col items-center justify-center p-2.5 border border-slate-100">
              <div className="w-full h-full border border-stone-800 rounded-full px-2 py-1.5 flex flex-col items-center justify-center text-center">
                <Coffee className="h-3.5 w-3.5 text-stone-700 mb-0.5" />
                <span className="text-[11px] font-medium tracking-tight text-stone-700 leading-none">
                  {restaurant.id === 'mos-cafe-panjim-goa' ? "mo's" : restaurant.logoText.split(' ')[0]}
                </span>
                <span className="text-[9px] font-serif italic text-stone-500 uppercase tracking-wider leading-none mt-0.5">
                  {restaurant.id === 'mos-cafe-panjim-goa' ? "cafeteria" : (restaurant.categoryLabel || 'Kitchen')}
                </span>
              </div>
            </div>
          </div>

          {/* Restaurant Name & Location (bottom left overlay) */}
          <div className="absolute bottom-5 sm:bottom-7 left-6 sm:left-10 right-6 text-white z-10">
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black tracking-tight drop-shadow-md">
              {restaurant.name}
            </h1>
            <div className="flex items-center gap-1.5 mt-1.5">
              <MapPin className="h-4 w-4 text-[#EA580C] shrink-0" />
              <span className="text-sm sm:text-base font-semibold text-white/95 drop-shadow">
                {restaurant.location}
              </span>
            </div>
          </div>
        </div>

        {/* Thumbnail strip */}
        {allImages.length > 1 && (
          <div className="flex items-center gap-2 overflow-x-auto pt-3 pb-1 scrollbar-none">
            {allImages.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative flex-shrink-0 w-20 sm:w-24 h-14 sm:h-16 rounded-xl overflow-hidden border-2 transition-all ${
                  activeImageIndex === idx
                    ? 'border-[#EA580C] ring-2 ring-[#EA580C]/30 scale-105'
                    : 'border-slate-200 opacity-75 hover:opacity-100 shadow-xs'
                }`}
              >
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url('${img}')` }}
                />
              </button>
            ))}
          </div>
        )}
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-8 space-y-10">

        {/* ═══════════════════════════════════════════════════════ */}
        {/* 2. OFFERS & HOW TO REDEEM (Exact goa.app feature)      */}
        {/* ═══════════════════════════════════════════════════════ */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: OFFERS */}
          <div className="lg:col-span-8 space-y-4">
            <h2 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-wider">
              OFFERS
            </h2>

            <div className="space-y-3.5">
              {offers.map((offer) => {
                const isUnlocked = unlockedOffers.includes(offer.id)

                return (
                  <div
                    key={offer.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#FFF7ED] border border-orange-200/90 border-l-[6px] border-l-[#EA580C] shadow-xs hover:shadow-md transition-all"
                  >
                    <div className="space-y-1.5 flex-1">
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {offer.title}
                      </h3>
                      <p className="text-xs text-slate-600 flex items-center gap-1.5">
                        <span className="h-4 w-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[10px] font-black shrink-0">
                          ✓
                        </span>
                        {offer.condition}
                      </p>
                    </div>

                    <div className="shrink-0 self-start sm:self-center">
                      {isUnlocked ? (
                        <div className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-center shadow-xs">
                          <div className="flex items-center gap-1.5 justify-center text-[11px] font-black uppercase">
                            <Check className="h-3.5 w-3.5 stroke-[3]" />
                            <span>UNLOCKED</span>
                          </div>
                          <span className="text-xs font-mono font-black tracking-widest block mt-0.5">
                            {offer.code}
                          </span>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleUnlockOffer(offer.id, offer.code)}
                          className="bg-[#EA580C] hover:bg-[#c2410c] text-white px-4 py-2.5 rounded-xl shadow-xs text-center transition-all active:scale-95 flex flex-col items-center justify-center min-w-[135px]"
                        >
                          <div className="flex items-center gap-1.5 text-[10px] font-extrabold tracking-wider uppercase opacity-95">
                            <Lock className="h-3 w-3 fill-white" />
                            <span>OFFER LOCKED</span>
                          </div>
                          <span className="text-xs font-black tracking-wide uppercase mt-0.5">
                            UNLOCK NOW
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column: HOW TO REDEEM OFFERS ? */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-xs space-y-4">
              <h2 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                HOW TO REDEEM OFFERS ?
              </h2>

              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-orange-50 border border-orange-200 text-[#EA580C] flex items-center justify-center font-extrabold text-sm shrink-0">
                    1
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex-1 flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Click Unlock Now</span>
                    <div className="bg-[#EA580C] text-white px-2 py-0.5 rounded-lg text-[9px] font-black uppercase flex items-center gap-1">
                      <Lock className="h-2.5 w-2.5" />
                      <span>Unlock</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-orange-50 border border-orange-200 text-[#EA580C] flex items-center justify-center font-extrabold text-sm shrink-0">
                    2
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex-1">
                    <span className="text-xs font-bold text-slate-700 block">Copy or Save Coupon Code</span>
                    <span className="text-[11px] text-slate-500">Auto-copies code to your clipboard</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-xl bg-orange-50 border border-orange-200 text-[#EA580C] flex items-center justify-center font-extrabold text-sm shrink-0">
                    3
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex-1">
                    <span className="text-xs font-bold text-slate-700 block">Show to Server Before Billing</span>
                    <span className="text-[11px] text-slate-500">Enjoy instant discount on dining!</span>
                  </div>
                </div>
              </div>

              {restaurant.couponCode && (
                <div className="pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between bg-slate-50 rounded-xl p-3 border border-slate-200">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-slate-400 font-bold block">
                        Quick Promo Code
                      </span>
                      <span className="text-sm font-black tracking-widest text-slate-900">
                        {restaurant.couponCode}
                      </span>
                    </div>
                    <button
                      onClick={handleCopyCoupon}
                      className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
                      title="Copy promo code"
                    >
                      {copiedCoupon ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* 3. DETAILS, MAPS, MENU & STICKY RESERVATION WIDGET     */}
        {/* ═══════════════════════════════════════════════════════ */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT 2 COLUMNS: METADATA, ABOUT, NEARBY, LOCATION & MAP, PHOTOS & MENU, REVIEWS */}
          <div className="lg:col-span-2 space-y-8">

            {/* Quick Info Bar */}
            <div className="flex flex-wrap items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-1.5 bg-amber-500 text-white font-black text-sm px-2.5 py-1 rounded-xl shadow-xs">
                <Star className="h-4 w-4 fill-white" />
                <span>{restaurant.rating}</span>
              </div>
              <span className="text-xs font-bold text-slate-700">
                {restaurant.reviewsCount} Verified Reviews
              </span>
              <span className="h-4 w-px bg-slate-300 hidden sm:block" />
              <span className="text-xs font-extrabold text-slate-900">{restaurant.priceForTwo} for two</span>
              <span className="h-4 w-px bg-slate-300 hidden sm:block" />
              <div className="flex items-center gap-1.5 flex-wrap">
                {restaurant.cuisine.map((c) => (
                  <span
                    key={c}
                    className="text-xs font-semibold px-2.5 py-0.5 rounded-lg bg-white border border-slate-200 text-slate-700"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            {/* About Restaurant */}
            <div className="space-y-3">
              <h2 className="text-xl font-black text-slate-900 tracking-tight">
                About {restaurant.name}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {restaurant.about}
              </p>
            </div>

            {/* Things to do nearby (Inspired by goa.app Kala Academy highlight) */}
            {restaurant.nearbyAttractions && restaurant.nearbyAttractions.length > 0 && (
              <div className="p-5 rounded-2xl bg-slate-50/80 border border-slate-200/80 space-y-3">
                <div className="flex items-center gap-2">
                  <Compass className="h-4 w-4 text-[#EA580C]" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-slate-700">
                    Things to do near {restaurant.name}
                  </h3>
                </div>
                <div className="space-y-2.5">
                  {restaurant.nearbyAttractions.map((spot, i) => (
                    <p key={i} className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      <span className="font-bold text-slate-800">About {spot.distance} from {restaurant.name}, </span>
                      <span className="font-semibold text-slate-900">{spot.name}</span> is {spot.desc}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════ */}
            {/* GOOGLE MAPS LOCATION (Exact layout from user screenshot) */}
            {/* ═══════════════════════════════════════════════════════ */}
            <div className="space-y-3">
              <h2 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-wider">
                {restaurant.name.toUpperCase()} LOCATION
              </h2>
              <p className="text-xs sm:text-sm text-slate-700 font-medium">
                {restaurant.fullAddress}
              </p>

              {/* Interactive Google Maps Embed with Floating "Open in Maps" button */}
              <div className="relative w-full h-72 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-slate-100">
                <iframe
                  title={`${restaurant.name} Google Map`}
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    `${restaurant.name}, ${restaurant.fullAddress}`
                  )}&t=&z=16&ie=UTF8&iwloc=&output=embed`}
                  className="w-full h-full border-0"
                  loading="lazy"
                  allowFullScreen
                />

                {/* Floating "Open in Maps" pill button matching the screenshot */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                    `${restaurant.name} ${restaurant.fullAddress}`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute top-3 left-3 bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg border border-slate-200 shadow-md flex items-center gap-1.5 transition-all z-10 group"
                >
                  <span className="text-slate-900">Open in Maps</span>
                  <ExternalLink className="h-3.5 w-3.5 text-[#EA580C] group-hover:translate-x-0.5 transition-transform" />
                </a>
              </div>
            </div>

            {/* Address & Timings Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-[#EA580C]" />
                  <span className="text-sm font-bold text-slate-900">Address & Landmark</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{restaurant.fullAddress}</p>
                <p className="text-[11px] text-slate-400">Landmark: {restaurant.landmark}</p>
              </div>

              <div className="p-4 rounded-2xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm font-bold text-slate-900">Timings</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 rounded">
                    Open Now
                  </span>
                </div>
                <p className="text-xs font-semibold text-slate-700">{restaurant.openingHours}</p>
                <div className="flex items-center gap-2 mt-2">
                  <a
                    href={`tel:${restaurant.phone}`}
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 font-bold hover:bg-slate-100"
                  >
                    <Phone className="h-3 w-3 text-slate-500" />
                    Call
                  </a>
                  <a
                    href={`https://wa.me/${restaurant.whatsapp.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 font-bold hover:bg-emerald-100"
                  >
                    <MessageCircle className="h-3.5 w-3.5 text-emerald-600" />
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>

            {/* Amenities */}
            <div className="space-y-3">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Highlights & Amenities
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {restaurant.amenities.map((amenity, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-semibold text-slate-700"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="truncate">{amenity}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ═══════════════════════════════════════════════════════ */}
            {/* 4. PHOTOS & MENU TABS (Exact match to user screenshot) */}
            {/* ═══════════════════════════════════════════════════════ */}
            <div className="space-y-5 pt-4 border-t border-slate-100">
              <h2 className="text-sm sm:text-base font-black text-slate-900 uppercase tracking-wider">
                {restaurant.name.toUpperCase()} PHOTOS & MENU
              </h2>

              {/* Tab Selector: [Photos]  [Menu] */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                <button
                  onClick={() => setActiveMediaTab('photos')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeMediaTab === 'photos'
                      ? 'bg-orange-50 text-[#EA580C] border border-orange-200 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <Camera className="h-3.5 w-3.5" />
                  <span>Photos</span>
                </button>
                <button
                  onClick={() => setActiveMediaTab('menu')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeMediaTab === 'menu'
                      ? 'bg-orange-50 text-[#EA580C] border border-orange-200 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                  }`}
                >
                  <UtensilsCrossed className="h-3.5 w-3.5" />
                  <span>Menu</span>
                </button>
              </div>

              {/* TAB CONTENT: PHOTOS GALLERY */}
              {activeMediaTab === 'photos' && (
                <div className="space-y-4 animate-in fade-in duration-200">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {allImages.map((img, i) => (
                      <div
                        key={i}
                        onClick={() => setSelectedPhotoPreview(img)}
                        className="group relative h-40 sm:h-48 rounded-2xl overflow-hidden cursor-pointer shadow-xs border border-slate-200/90"
                      >
                        <div
                          className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                          style={{ backgroundImage: `url('${img}')` }}
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                          <Maximize2 className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-[11px] text-slate-400 text-center">
                    Click any photo to expand in full view
                  </p>
                </div>
              )}

              {/* TAB CONTENT: MENU */}
              {activeMediaTab === 'menu' && (
                <div className="space-y-5 animate-in fade-in duration-200">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <p className="text-xs text-slate-500">
                      Freshly prepared daily with locally sourced Goan produce
                    </p>

                    {/* Veg Toggle */}
                    <button
                      onClick={() => setVegOnlyFilter((v) => !v)}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors self-start sm:self-auto ${
                        vegOnlyFilter
                          ? 'border-green-600 bg-green-50 text-green-700'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="h-3 w-3 border-2 border-green-600 flex items-center justify-center p-0.5 rounded-sm">
                        <div className={`h-1.5 w-1.5 rounded-full ${vegOnlyFilter ? 'bg-green-600' : ''}`} />
                      </div>
                      <span>Veg Only</span>
                    </button>
                  </div>

                  {/* Category filter pills */}
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                    {[
                      { id: 'all', label: 'All Items' },
                      { id: 'starters', label: 'Starters' },
                      { id: 'goan', label: 'Goan Specials' },
                      { id: 'mains', label: 'Main Course' },
                      { id: 'tandoor', label: 'Tandoor & Breads' },
                      { id: 'desserts', label: 'Desserts' },
                      { id: 'drinks', label: 'Beverages' },
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedMenuCategory(cat.id)}
                        className={`px-3 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-colors ${
                          selectedMenuCategory === cat.id
                            ? 'bg-[#EA580C] text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Menu items list */}
                  <div className="space-y-3">
                    {filteredDishes.length === 0 ? (
                      <p className="text-xs text-slate-500 py-6 text-center">
                        No dishes found matching your current filter.
                      </p>
                    ) : (
                      filteredDishes.map((dish) => {
                        const quantity = orderItems[dish.id] || 0
                        return (
                          <div
                            key={dish.id}
                            className="flex items-start justify-between gap-4 p-4 rounded-2xl border border-slate-100 hover:border-slate-200 transition-colors bg-white shadow-xs"
                          >
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`h-3.5 w-3.5 border-2 flex items-center justify-center p-0.5 rounded-sm ${
                                    dish.isVeg ? 'border-green-600' : 'border-red-600'
                                  }`}
                                >
                                  <div
                                    className={`h-1.5 w-1.5 rounded-full ${
                                      dish.isVeg ? 'bg-green-600' : 'bg-red-600'
                                    }`}
                                  />
                                </div>
                                <span className="font-extrabold text-sm text-slate-900">{dish.name}</span>
                                {dish.isBestseller && (
                                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                                    Bestseller
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 leading-relaxed max-w-xl">{dish.desc}</p>
                              <span className="text-sm font-black text-slate-900 block pt-1">₹{dish.price}</span>
                            </div>

                            <div className="shrink-0 self-center">
                              {quantity === 0 ? (
                                <Button
                                  onClick={() => handleAddDish(dish)}
                                  variant="outline"
                                  size="sm"
                                  className="text-xs font-bold text-[#EA580C] border-orange-200 hover:bg-orange-50 hover:text-[#EA580C] h-8 px-3 rounded-xl"
                                >
                                  + Add
                                </Button>
                              ) : (
                                <div className="flex items-center gap-1.5 bg-[#EA580C] text-white rounded-xl p-1 shadow-xs">
                                  <button
                                    onClick={() => handleRemoveDish(dish.id)}
                                    className="h-6 w-6 rounded-lg bg-black/20 hover:bg-black/30 flex items-center justify-center font-bold text-xs"
                                  >
                                    -
                                  </button>
                                  <span className="text-xs font-extrabold px-1.5">{quantity}</span>
                                  <button
                                    onClick={() => handleAddDish(dish)}
                                    className="h-6 w-6 rounded-lg bg-black/20 hover:bg-black/30 flex items-center justify-center font-bold text-xs"
                                  >
                                    +
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })
                    )}
                  </div>

                  {/* Order Simulator Preview */}
                  {totalItemsCount > 0 && (
                    <div className="p-4 rounded-2xl bg-orange-50 border border-orange-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-in fade-in">
                      <div>
                        <span className="text-xs font-bold text-[#EA580C] block">
                          {totalItemsCount} dishes selected for your table
                        </span>
                        <span className="text-xs text-slate-600">
                          Subtotal: ₹{rawSubtotal} - Discount ({restaurant.discountPercent}%): ₹{discountAmount}
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <span className="text-[10px] text-slate-500 block uppercase font-bold">Estimated Bill</span>
                          <span className="text-base font-black text-slate-900">₹{finalTotal}</span>
                        </div>
                        <Button
                          onClick={() => {
                            const widget = document.getElementById('reservation-widget')
                            if (widget) widget.scrollIntoView({ behavior: 'smooth' })
                          }}
                          className="bg-[#EA580C] hover:bg-[#c2410c] text-white text-xs font-bold"
                        >
                          Proceed to Reserve
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Photo Lightbox Modal */}
            {selectedPhotoPreview && (
              <div
                onClick={() => setSelectedPhotoPreview(null)}
                className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-150"
              >
                <div className="relative max-w-4xl w-full max-h-[85vh] rounded-3xl overflow-hidden shadow-2xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedPhotoPreview}
                    alt="Photo Preview"
                    className="w-full h-full object-contain max-h-[80vh] mx-auto rounded-2xl"
                  />
                  <button
                    onClick={() => setSelectedPhotoPreview(null)}
                    className="absolute top-4 right-4 h-10 w-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/90 transition-colors"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>
            )}

            {/* ═══════════════════════════════════════════════════════ */}
            {/* 5. REVIEWS SECTION                                    */}
            {/* ═══════════════════════════════════════════════════════ */}
            <div className="space-y-6 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-black text-slate-900 tracking-tight">
                    Reviews & Experiences
                  </h2>
                  <p className="text-xs text-slate-500">
                    Real dining experiences from verified visitors
                  </p>
                </div>
                <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-900 font-extrabold text-xs px-3 py-1 rounded-xl">
                  <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                  <span>{restaurant.rating} / 5.0</span>
                </div>
              </div>

              <div className="space-y-4">
                {reviewsList.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl border border-slate-100 space-y-2 bg-white">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="h-8 w-8 rounded-full bg-slate-200 overflow-hidden">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={rev.avatar} alt={rev.author} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-slate-900">{rev.author}</h4>
                          <span className="text-[10px] text-slate-400">{rev.date}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, s) => (
                          <Star
                            key={s}
                            className={`h-3 w-3 ${
                              s < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                  </div>
                ))}
              </div>

              {/* Add Review Form */}
              <form onSubmit={handleAddReview} className="pt-4 border-t border-slate-100 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Leave a Verified Review
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Your Name (e.g. Diya Fernandes)"
                    value={newReviewAuthor}
                    onChange={(e) => setNewReviewAuthor(e.target.value)}
                    className="h-10 px-3 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                  />
                  <div className="flex items-center gap-2 px-3 h-10 rounded-xl border border-slate-200 bg-slate-50">
                    <span className="text-xs text-slate-500 font-semibold">Rating:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setNewReviewRating(star)}
                          className="p-0.5 focus:outline-none"
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
                  placeholder="Share details about the dishes, flavors, atmosphere, and service..."
                  rows={3}
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  className="w-full p-3 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#EA580C]"
                />
                <Button
                  type="submit"
                  size="sm"
                  className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold"
                >
                  Post Review
                </Button>
              </form>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════ */}
          {/* RIGHT COLUMN: BOOKING + SCHEDULE (sticky)             */}
          {/* ═══════════════════════════════════════════════════════ */}
          <div className="space-y-6">
            <div id="reservation-widget" className="sticky top-20 space-y-6">

              {/* Table Booking */}
              <Card className="rounded-2xl border-slate-200 bg-white p-5 shadow-lg space-y-5">
                <div className="border-b border-slate-100 pb-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-lg text-slate-900">
                      Reserve a Table
                    </h3>
                    <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase">
                      Instant Confirm
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Zero booking fees &bull; Verified seat holding
                  </p>
                </div>

                {isBooked ? (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-3 animate-in fade-in">
                    <div className="h-10 w-10 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto">
                      <Check className="h-5 w-5 stroke-[3px]" />
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-emerald-950">Table Confirmed!</h4>
                      <p className="text-xs text-emerald-800 mt-1">
                        Reserved for {bookingGuests} guests on {bookingDate} at {bookingTime} ({seatingPreference}).
                      </p>
                    </div>
                    <div className="text-[11px] bg-white p-2.5 rounded-xl border border-emerald-200 text-slate-700 font-mono">
                      Booking Pass: GOA-{Math.floor(100000 + Math.random() * 900000)}
                    </div>
                    <Button
                      onClick={() => setIsBooked(false)}
                      variant="outline"
                      size="sm"
                      className="text-xs font-bold text-emerald-800 border-emerald-300 w-full"
                    >
                      Book Another Table
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleReserveTable} className="space-y-4 text-xs">
                    {/* Date */}
                    <div>
                      <label className="font-bold text-slate-700 block mb-1.5">Select Date</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Today', 'Tomorrow', 'Fri, 31 Oct'].map((d) => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setBookingDate(d)}
                            className={`p-2.5 rounded-xl border text-center font-bold transition-colors ${
                              bookingDate === d
                                ? 'border-[#EA580C] bg-orange-50 text-[#EA580C]'
                                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Guests */}
                    <div>
                      <label className="font-bold text-slate-700 block mb-1.5">Guests</label>
                      <div className="grid grid-cols-5 gap-1.5">
                        {['1', '2', '4', '6', '8+'].map((g) => (
                          <button
                            key={g}
                            type="button"
                            onClick={() => setBookingGuests(g)}
                            className={`py-2 rounded-xl border text-center font-bold transition-colors ${
                              bookingGuests === g
                                ? 'bg-[#EA580C] text-white border-[#EA580C]'
                                : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {g}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Time */}
                    <div>
                      <label className="font-bold text-slate-700 block mb-1.5">Time Slot</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['01:00 PM', '01:30 PM', '02:00 PM', '07:30 PM', '08:00 PM', '08:30 PM'].map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => setBookingTime(slot)}
                            className={`py-2 rounded-xl border text-center font-bold transition-colors ${
                              bookingTime === slot
                                ? 'border-[#EA580C] bg-orange-50 text-[#EA580C]'
                                : 'border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Seating */}
                    <div>
                      <label className="font-bold text-slate-700 block mb-1.5">Seating Preference</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Indoor AC', 'Garden Terrace'].map((pref) => (
                          <button
                            key={pref}
                            type="button"
                            onClick={() => setSeatingPreference(pref)}
                            className={`py-2 rounded-xl border text-center font-semibold transition-colors ${
                              seatingPreference === pref
                                ? 'border-slate-900 bg-slate-900 text-white'
                                : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                            }`}
                          >
                            {pref}
                          </button>
                        ))}
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full h-11 bg-[#EA580C] hover:bg-[#c2410c] text-white font-extrabold text-xs shadow-md rounded-xl"
                    >
                      Confirm Reservation ({restaurant.featuredOffer || '15% Off'})
                    </Button>

                    <p className="text-[10px] text-slate-400 text-center leading-tight">
                      Free cancellation up to 15 mins before slot. Table held for 20 mins.
                    </p>
                  </form>
                )}
              </Card>

              {/* Weekly Schedule */}
              <Card className="rounded-2xl border-slate-200 bg-white p-5 shadow-sm space-y-3 text-xs">
                <h4 className="font-black text-slate-900 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-[#EA580C]" />
                  Weekly Schedule
                </h4>
                <div className="space-y-1.5">
                  {Object.entries(restaurant.schedule).map(([day, hours]) => {
                    const isToday =
                      day.toLowerCase() ===
                      new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase()

                    return (
                      <div
                        key={day}
                        className={`flex items-center justify-between py-1 px-2 rounded-lg ${
                          isToday ? 'bg-orange-50 font-bold text-[#EA580C]' : 'text-slate-600'
                        }`}
                      >
                        <span>{day}</span>
                        <span>{hours}</span>
                      </div>
                    )
                  })}
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* 6. SIMILAR RESTAURANTS                                 */}
        {/* ═══════════════════════════════════════════════════════ */}
        <section className="pt-8 border-t border-slate-200 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-slate-900">Similar Restaurants</h2>
              <p className="text-xs text-slate-500">Other popular dining places you might enjoy</p>
            </div>
            <Link
              href="/restaurants"
              className="text-xs font-bold text-[#EA580C] hover:underline flex items-center gap-1"
            >
              Browse All ({RESTAURANTS_DATA.length}) <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {nearbyRestaurants.map((item) => (
              <Link
                key={item.id}
                href={`/restaurants/${item.id}`}
                className="group rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-xl transition-all duration-300 bg-white flex flex-col"
              >
                <div className="relative h-44 w-full overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                    style={{ backgroundImage: `url('${item.image}')` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-[#EA580C] text-white">
                    {item.featuredOffer || item.categoryLabel}
                  </span>
                  <div className="absolute bottom-2 inset-x-3 text-white flex items-center justify-between">
                    <span className="text-xs font-bold truncate">{item.name}</span>
                    <span className="text-[11px] font-bold text-amber-300 flex items-center gap-0.5">
                      <Star className="h-3 w-3 fill-amber-300" />
                      {item.rating}
                    </span>
                  </div>
                </div>
                <div className="p-3 text-xs text-slate-600 space-y-1">
                  <p className="truncate text-slate-500">{item.location}</p>
                  <p className="font-bold text-slate-900">{item.priceForTwo} for two</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
