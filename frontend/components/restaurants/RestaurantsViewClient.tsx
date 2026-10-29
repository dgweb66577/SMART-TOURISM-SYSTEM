'use client'

import React, { useState, useMemo, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Search,
  MapPin,
  Star,
  Tag,
  Phone,
  Navigation,
  Clock,
  Heart,
  ChevronRight,
  ChevronLeft,
  Filter,
  CheckCircle2,
  Calendar,
  Users,
  UtensilsCrossed,
  Sparkles,
  Salad,
  ChefHat,
  Coffee,
  X,
  Share2,
  LayoutGrid,
  Sun,
  Flame,
  Info,
  ExternalLink,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export interface RestaurantItem {
  id: string
  name: string
  category: 'casual' | 'family' | 'veg' | 'shack' | 'multi' | 'fine' | 'cafe'
  categoryLabel: string
  cuisine: string[]
  location: string
  region: 'North Goa' | 'South Goa' | 'Panaji'
  rating: number
  reviewsCount: number
  priceForTwo: string
  priceRange: '₹' | '₹₹' | '₹₹₹'
  isVeg: boolean
  hasNonVeg: boolean
  featuredOffer?: string
  image: string
  logoText: string
  logoBg: string
  openingHours: string
  phone: string
  popularDishes: string[]
  menu: {
    name: string
    price: number
    desc: string
    isVeg: boolean
  }[]
}

const RESTAURANTS_DATA: RestaurantItem[] = [
  {
    id: 'r0',
    name: "MO's Cafe",
    category: 'cafe',
    categoryLabel: 'Boutique Cafe',
    cuisine: ['Artisanal Coffee', 'Sourdough & Bagels', 'Continental'],
    location: 'Fontainhas, Panaji, North Goa',
    region: 'Panaji',
    rating: 4.8,
    reviewsCount: 1420,
    priceForTwo: '₹800',
    priceRange: '₹₹',
    isVeg: true,
    hasNonVeg: true,
    featuredOffer: 'Flat 15% Off',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800',
    logoText: "MO'S",
    logoBg: 'bg-white text-stone-900 border border-stone-700',
    openingHours: '8:30 AM – 10:30 PM',
    phone: '+91 832 242 8899',
    popularDishes: ['Avocado Sourdough Tartine', 'Nutella French Toast', 'Pour-Over Cold Brew'],
    menu: [
      { name: 'Avocado & Poached Egg Tartine', price: 360, desc: 'Hass avocado mash, soft poached organic eggs, chili oil, microgreens on house sourdough', isVeg: false },
      { name: 'Classic Fontainhas Club Sandwich', price: 380, desc: 'Grilled chicken breast or smoked paneer, fried egg, aged cheddar, herbed aioli', isVeg: false },
      { name: 'Mediterranean Mezze Bowl', price: 340, desc: 'Beetroot hummus, crispy falafel, tabbouleh, pickled olives, grilled pita', isVeg: true },
      { name: 'Berry Brioche French Toast', price: 290, desc: 'Golden soaked brioche topped with whipped mascarpone and berry compote', isVeg: true },
    ],
  },
  {
    id: 'r1',
    name: 'Dropiet Beach Lounge',
    category: 'casual',
    categoryLabel: 'Casual Dining',
    cuisine: ['Goan Seafood', 'Continental', 'Craft Cocktails'],
    location: 'Candolim Beach Road, North Goa',
    region: 'North Goa',
    rating: 4.8,
    reviewsCount: 1240,
    priceForTwo: '₹1,400',
    priceRange: '₹₹',
    isVeg: false,
    hasNonVeg: true,
    featuredOffer: 'Flat 10% Off',
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=800',
    logoText: 'DROPIET',
    logoBg: 'bg-black text-amber-300',
    openingHours: '11:00 AM – 1:00 AM',
    phone: '+91 832 248 9110',
    popularDishes: ['Butter Garlic Tiger Prawns', 'Goan Prawn Curry', 'Truffle Mushroom Pizza'],
    menu: [
      { name: 'Goan Fish Curry Rice', price: 420, desc: 'Fresh Kingfish simmered in spicy coconut & kokum gravy served with steamed rice', isVeg: false },
      { name: 'Butter Garlic Squid', price: 480, desc: 'Tender squid rings tossed in golden butter and crushed Goa garlic', isVeg: false },
      { name: 'Wood-Fired Margherita', price: 380, desc: 'San Marzano sauce, fresh mozzarella, and sweet basil leaves', isVeg: true },
      { name: 'Bebinca with Vanilla Gelato', price: 260, desc: 'Traditional seven-layered warm Goan pudding', isVeg: true },
    ],
  },
  {
    id: 'r2',
    name: '1961 Restaurant & Bar',
    category: 'multi',
    categoryLabel: 'Multi Cuisine',
    cuisine: ['Authentic Portuguese', 'Goan Heritage', 'Wine Bar'],
    location: 'Fontainhas, Panaji, Central Goa',
    region: 'Panaji',
    rating: 4.9,
    reviewsCount: 1890,
    priceForTwo: '₹1,600',
    priceRange: '₹₹',
    isVeg: false,
    hasNonVeg: true,
    featuredOffer: 'Flat 15% Off',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=800',
    logoText: '1961',
    logoBg: 'bg-amber-950 text-amber-200',
    openingHours: '12:00 PM – 11:30 PM',
    phone: '+91 832 222 1961',
    popularDishes: ['Chicken Cafreal', 'Pork Vindaloo', 'Pasteis de Nata'],
    menu: [
      { name: 'Chicken Cafreal', price: 460, desc: 'Succulent chicken leg braised in coriander, green chili, and toddy vinegar', isVeg: false },
      { name: 'Traditional Pork Vindaloo', price: 520, desc: 'Classic Goan pork belly stew with fiery Kashmiri chili and palm vinegar', isVeg: false },
      { name: 'Paneer Peri-Peri', price: 390, desc: 'Charred paneer skewers marinated in spicy red peri-peri masala', isVeg: true },
      { name: 'Serradura Pudding', price: 240, desc: 'Portuguese sawdust dessert with sweetened condensed milk and Marie crumb layers', isVeg: true },
    ],
  },
  {
    id: 'r3',
    name: "Fortune's Feast & Tandoor",
    category: 'family',
    categoryLabel: 'Family Style',
    cuisine: ['North Indian', 'Tandoori Grills', 'Coastal Curries'],
    location: 'Calangute Main Circle, North Goa',
    region: 'North Goa',
    rating: 4.7,
    reviewsCount: 960,
    priceForTwo: '₹1,100',
    priceRange: '₹₹',
    isVeg: false,
    hasNonVeg: true,
    featuredOffer: 'Flat 15% Off',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=800',
    logoText: 'Fortune',
    logoBg: 'bg-purple-950 text-pink-300',
    openingHours: '11:30 AM – 11:30 PM',
    phone: '+91 832 278 4500',
    popularDishes: ['Murgh Malai Tikka', 'Dal Makhani', 'Surmai Rawa Fry'],
    menu: [
      { name: 'Surmai (Kingfish) Rawa Fry', price: 490, desc: 'Crispy semolina crusted Kingfish steak shallow fried to perfection', isVeg: false },
      { name: 'Murgh Malai Tikka', price: 430, desc: 'Melt-in-mouth chicken chunks marinated in cream, cheese, and cardamom', isVeg: false },
      { name: 'Dal Makhani', price: 320, desc: 'Slow cooked black lentils simmered overnight with farm butter', isVeg: true },
      { name: 'Garlic Butter Naan', price: 90, desc: 'Clay oven flatbread brushed with garlic coriander butter', isVeg: true },
    ],
  },
  {
    id: 'r4',
    name: 'Cafe WE Artisan Bakery',
    category: 'cafe',
    categoryLabel: 'Casual Dining',
    cuisine: ['Artisanal Coffee', 'Sourdough & Bagels', 'Health Bowls'],
    location: 'Anjuna Flea Market Road, North Goa',
    region: 'North Goa',
    rating: 4.9,
    reviewsCount: 1420,
    priceForTwo: '₹850',
    priceRange: '₹',
    isVeg: true,
    hasNonVeg: true,
    featuredOffer: 'Flat 20% Off',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=800',
    logoText: 'CAFE WE',
    logoBg: 'bg-zinc-900 text-stone-200',
    openingHours: '8:00 AM – 8:00 PM',
    phone: '+91 98231 09876',
    popularDishes: ['Avocado Sourdough Toast', 'Iced Coconut Americano', 'Acai Berry Bowl'],
    menu: [
      { name: 'Truffle Scrambled Eggs on Sourdough', price: 340, desc: 'Pasture-raised eggs, black truffle oil, aged parmesan', isVeg: false },
      { name: 'Smashed Avo & Feta Toast', price: 360, desc: 'Fresh Hass avocado, Danish feta, chili flakes, pomegranate pearls', isVeg: true },
      { name: 'Tropical Acai Smoothie Bowl', price: 390, desc: 'Organic acai topped with house granola, chia seeds, and Goan mango slices', isVeg: true },
      { name: 'Cold Brew Coconut Latte', price: 220, desc: '18-hour cold steeped Arabica with tender coconut water milk', isVeg: true },
    ],
  },
  {
    id: 'r5',
    name: 'Blue Heaven Sunset Shack & Bar',
    category: 'shack',
    categoryLabel: 'Beach Shacks',
    cuisine: ['Goan Seafood', 'Chilled Beers', 'BBQ Grills'],
    location: 'Baga Beach Shoreline, North Goa',
    region: 'North Goa',
    rating: 4.7,
    reviewsCount: 2310,
    priceForTwo: '₹1,200',
    priceRange: '₹₹',
    isVeg: false,
    hasNonVeg: true,
    featuredOffer: 'Flat 10% Off',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800',
    logoText: 'BLUE HEAVEN',
    logoBg: 'bg-sky-900 text-sky-200',
    openingHours: '9:00 AM – 2:00 AM',
    phone: '+91 832 227 6789',
    popularDishes: ['Crab Xec Xec', 'Tandoori Pomfret', 'Feni Cocktails'],
    menu: [
      { name: 'Crab Xec Xec', price: 650, desc: 'Succulent mud crab simmered in roasted coconut, star anise, and cloves', isVeg: false },
      { name: 'Whole Tandoori Pomfret', price: 580, desc: 'Fresh catch marinated in yellow chili yogurt and grilled over coals', isVeg: false },
      { name: 'Crispy Veg Spring Rolls', price: 280, desc: 'Julienned veggies in golden rice paper wrap with sweet chili dip', isVeg: true },
      { name: 'Goa Sunrise Cocktail', price: 320, desc: 'Cazulo cashew feni, orange juice, grenadine, and lime wedge', isVeg: true },
    ],
  },
  {
    id: 'r6',
    name: 'Kolliste Coastal Kitchen',
    category: 'multi',
    categoryLabel: 'Multi Cuisine',
    cuisine: ['Traditional Goan', 'Konkan Thalis', 'Seafood'],
    location: 'Ozran Beach Road, Small Vagator, North Goa',
    region: 'North Goa',
    rating: 4.8,
    reviewsCount: 1650,
    priceForTwo: '₹1,300',
    priceRange: '₹₹',
    isVeg: false,
    hasNonVeg: true,
    featuredOffer: 'Flat 15% Off',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?q=80&w=800',
    logoText: 'Kolliste',
    logoBg: 'bg-emerald-950 text-amber-300',
    openingHours: '12:00 PM – 11:00 PM',
    phone: '+91 97654 32109',
    popularDishes: ['Special Seafood Thali', 'Prawn Balchão', 'Sol Kadhi'],
    menu: [
      { name: 'Special Goan Seafood Thali', price: 480, desc: 'Surmai Fry, Prawn Curry, Tisreo (Clams) Sukka, Kismoor, Sol Kadhi, Rice & Poee', isVeg: false },
      { name: 'Prawn Balchão with Poi', price: 460, desc: 'Spicy, tangy pickled prawn pickle served with traditional warm Goan poee bread', isVeg: false },
      { name: 'Mushroom & Green Pea Xacuti', price: 340, desc: 'Locally foraged mushrooms cooked in roasted spiced coconut gravy', isVeg: true },
      { name: 'Kokum Sol Kadhi', price: 90, desc: 'Digestive soothing drink made of coconut milk, dried kokum, and green chili', isVeg: true },
    ],
  },
  {
    id: 'r7',
    name: 'Navtara Pure Vegetarian',
    category: 'veg',
    categoryLabel: 'Pure Vegetarian',
    cuisine: ['South Indian', 'North Indian Thalis', 'Pure Veg Snacks'],
    location: '18th June Road, Panaji, Central Goa',
    region: 'Panaji',
    rating: 4.6,
    reviewsCount: 3100,
    priceForTwo: '₹600',
    priceRange: '₹',
    isVeg: true,
    hasNonVeg: false,
    featuredOffer: 'Flat 10% Off',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800',
    logoText: 'NAVTARA',
    logoBg: 'bg-green-800 text-white',
    openingHours: '7:30 AM – 11:00 PM',
    phone: '+91 832 242 1100',
    popularDishes: ['Butter Masala Dosa', 'Veg Goan Thali', 'Filter Coffee'],
    menu: [
      { name: 'Special Butter Masala Dosa', price: 160, desc: 'Crispy golden crepe filled with spiced potato mash, served with 3 chutneys & sambar', isVeg: true },
      { name: 'Executive Veg Thali', price: 240, desc: 'Paneer butter masala, veg sabzi, dal tadka, pulao, 2 chapatis, gulab jamun', isVeg: true },
      { name: 'Paneer Tikka Lababdar', price: 290, desc: 'Charcoal grilled cottage cheese simmered in rich creamy tomato and onion gravy', isVeg: true },
      { name: 'South Indian Filter Kappi', price: 60, desc: 'Traditional chicory brew poured frothed in stainless dabara set', isVeg: true },
    ],
  },
  {
    id: 'r8',
    name: 'Pousada by the Beach',
    category: 'fine',
    categoryLabel: 'Family Style',
    cuisine: ['Coastal Portuguese', 'Seafood Fine Dining', 'Sunsets'],
    location: 'Gaura Vaddo, Calangute, North Goa',
    region: 'North Goa',
    rating: 4.9,
    reviewsCount: 2200,
    priceForTwo: '₹2,200',
    priceRange: '₹₹₹',
    isVeg: false,
    hasNonVeg: true,
    featuredOffer: 'Flat 15% Off',
    image: 'https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?q=80&w=800',
    logoText: 'POUSADA',
    logoBg: 'bg-teal-950 text-amber-200',
    openingHours: '11:00 AM – 10:00 PM',
    phone: '+91 99222 22533',
    popularDishes: ['Grilled Red Snapper', 'Stuffed Squid', 'Feni Sangria'],
    menu: [
      { name: 'Whole Grilled Red Snapper', price: 850, desc: 'Fresh day catch grilled with butter, lemon, and mild Goan herbs', isVeg: false },
      { name: 'Prawn Stuffed Calamari', price: 620, desc: 'Baby squid tubes filled with spiced prawn mousse in light tomato reduction', isVeg: false },
      { name: 'Vegetable Caldinho', price: 380, desc: 'Mild, fragrant vegetable stew with coconut milk and whole cumin', isVeg: true },
      { name: 'Bebinca & Dodol Tasting Platter', price: 310, desc: 'Traditional coconut jaggery halwa and 7-layer egg pudding', isVeg: true },
    ],
  },
  {
    id: 'r9',
    name: 'Gunpowder South Indian Bistro',
    category: 'casual',
    categoryLabel: 'Casual Dining',
    cuisine: ['Kerala Coastal', 'Andhra Spice', 'Craft Cocktails'],
    location: 'Saunto Vaddo, Assagao, North Goa',
    region: 'North Goa',
    rating: 4.9,
    reviewsCount: 2840,
    priceForTwo: '₹1,500',
    priceRange: '₹₹',
    isVeg: false,
    hasNonVeg: true,
    featuredOffer: 'Flat 10% Off',
    image: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?q=80&w=800',
    logoText: 'GUNPOWDER',
    logoBg: 'bg-red-950 text-amber-300',
    openingHours: '12:00 PM – 11:00 PM',
    phone: '+91 832 226 8222',
    popularDishes: ['Kerala Beef Fry', 'Appam & Egg Roast', 'Malabar Parotta'],
    menu: [
      { name: 'Kerala Buff / Tenderloin Fry', price: 460, desc: 'Spiced tender meat slow roasted with coconut slivers, curry leaves, and pepper', isVeg: false },
      { name: 'Malabar Prawn Curry', price: 540, desc: 'Juicy tiger prawns in green mango and rich coconut gravy', isVeg: false },
      { name: 'Madras Kadai Paneer', price: 380, desc: 'Cottage cheese with freshly crushed coriander seeds and dry red chilies', isVeg: true },
      { name: 'Fluffy Hot Appams (2 pcs)', price: 110, desc: 'Fermented rice and coconut hoppers with lacy crisp borders', isVeg: true },
    ],
  },
]

export function RestaurantsViewClient() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedRegion, setSelectedRegion] = useState<string>('All')
  const [dietaryFilter, setDietaryFilter] = useState<'all' | 'veg' | 'non-veg'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [savedIds, setSavedIds] = useState<string[]>(['r1', 'r6'])

  // Modal states
  const [activeMenuRestaurant, setActiveMenuRestaurant] = useState<RestaurantItem | null>(null)
  const [activeBookingRestaurant, setActiveBookingRestaurant] = useState<RestaurantItem | null>(null)
  const [bookingGuests, setBookingGuests] = useState('2')
  const [bookingDate, setBookingDate] = useState('Today, 8:00 PM')

  // Horizontal scroll ref for featured offers
  const offersScrollRef = useRef<HTMLDivElement>(null)

  const scrollOffers = (direction: 'left' | 'right') => {
    if (offersScrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320
      offersScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' })
    }
  }

  // Map listing IDs → detail page slugs
  const idToSlug: Record<string, string> = {
    r0: 'mos-cafe-panjim-goa',
    r1: 'dropiet',
    r2: '1961',
    r3: 'fortunes-feast',
    r4: 'cafe-we',
    r5: 'blue-heaven',
    r6: 'kolliste',
    r7: 'navtara',
    r8: 'pousada-by-the-beach',
    r9: 'gunpowder',
  }

  const toggleSave = (r: RestaurantItem) => {
    setSavedIds((prev) => {
      const exists = prev.includes(r.id)
      if (exists) {
        toast.info(`Removed ${r.name} from saved spots`)
        return prev.filter((id) => id !== r.id)
      } else {
        toast.success(`Saved ${r.name} to your Goa bucket list!`)
        return [...prev, r.id]
      }
    })
  }

  const handleConfirmBooking = () => {
    if (!activeBookingRestaurant) return
    toast.success(`Table reserved at ${activeBookingRestaurant.name}!`, {
      description: `Party of ${bookingGuests} for ${bookingDate}. Confirmation SMS sent with discount code.`,
    })
    setActiveBookingRestaurant(null)
  }

  // Categories inspired by Image 2
  const categoriesList = [
    { id: 'all', label: 'ALL TYPES', icon: LayoutGrid },
    { id: 'casual', label: 'CASUAL DINING', icon: UtensilsCrossed },
    { id: 'family', label: 'FAMILY STYLE', icon: Users },
    { id: 'veg', label: 'PURE VEGETARIAN', icon: Salad },
    { id: 'shack', label: 'BEACH SHACKS', icon: Sun },
    { id: 'multi', label: 'MULTI CUISINE', icon: ChefHat },
  ]

  // Filter logic
  const filteredRestaurants = useMemo(() => {
    return RESTAURANTS_DATA.filter((item) => {
      // Category filter
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false
      }
      // Region filter
      if (selectedRegion !== 'All' && item.region !== selectedRegion) {
        return false
      }
      // Dietary filter
      if (dietaryFilter === 'veg' && !item.isVeg) {
        return false
      }
      if (dietaryFilter === 'non-veg' && !item.hasNonVeg) {
        return false
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase()
        const matchesName = item.name.toLowerCase().includes(q)
        const matchesLocation = item.location.toLowerCase().includes(q)
        const matchesCuisine = item.cuisine.some((c) => c.toLowerCase().includes(q))
        const matchesDish = item.popularDishes.some((d) => d.toLowerCase().includes(q))
        if (!matchesName && !matchesLocation && !matchesCuisine && !matchesDish) {
          return false
        }
      }
      return true
    })
  }, [selectedCategory, selectedRegion, dietaryFilter, searchQuery])

  // Featured offers list
  const featuredOffers = RESTAURANTS_DATA.filter((r) => r.featuredOffer)

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-900 pb-20">
      {/* 1. HERO BANNER (Directly matching goa.app/restaurants from Image 2) */}
      <section className="relative h-72 sm:h-80 md:h-96 w-full flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1600')`,
          }}
        >
          {/* Dark gradient overlay like goa.app */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/55 to-black/40" />
        </div>

        {/* Hero Text */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-md">
            Restaurants
          </h1>
          <p className="mt-2 text-base sm:text-lg md:text-xl font-medium text-slate-200 drop-shadow">
            Best Restaurants in Goa
          </p>
        </div>
      </section>

      {/* 2. CATEGORY SELECTOR CARDS (Floating rounded cards matching Image 2) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-10 sm:-mt-12 relative z-20">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 sm:gap-3">
          {categoriesList.map((cat) => {
            const Icon = cat.icon
            const isSelected = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex flex-col items-center justify-center p-3.5 sm:p-4 rounded-xl sm:rounded-2xl transition-all duration-200 border text-center shadow-md ${
                  isSelected
                    ? 'bg-white border-[#EA580C] ring-2 ring-[#EA580C]/20 shadow-orange-500/10'
                    : 'bg-white border-slate-100 hover:border-slate-300 hover:shadow-lg'
                }`}
              >
                <div
                  className={`h-9 w-9 rounded-lg flex items-center justify-center mb-2 transition-colors ${
                    isSelected ? 'text-[#EA580C] bg-orange-50' : 'text-amber-600 bg-amber-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                </div>
                <span
                  className={`text-[11px] sm:text-xs font-bold tracking-tight uppercase ${
                    isSelected ? 'text-[#EA580C]' : 'text-slate-800'
                  }`}
                >
                  {cat.label}
                </span>
              </button>
            )
          })}
        </div>
      </section>

      {/* 3. FEATURED OFFERS SECTION (Exact horizontal scroll matching Image 2) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-10 sm:mt-12">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
              Featured Offers
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Exclusive discount passes verified for Goa tourists
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-xs sm:text-sm font-bold text-slate-700 hover:text-[#EA580C] flex items-center gap-0.5 transition-colors"
            >
              See All <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative group">
          <div
            ref={offersScrollRef}
            className="flex items-center gap-3.5 sm:gap-4 overflow-x-auto pb-3 scrollbar-none snap-x snap-mandatory scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {featuredOffers.map((item) => (
              <div
                key={`offer-${item.id}`}
                onClick={() => setActiveBookingRestaurant(item)}
                className="flex-shrink-0 w-44 sm:w-52 h-48 sm:h-56 rounded-2xl overflow-hidden relative cursor-pointer group/card shadow-md hover:shadow-xl transition-all duration-300 snap-start"
              >
                {/* Background image */}
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover/card:scale-110"
                  style={{ backgroundImage: `url('${item.image}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/20" />

                {/* Center Logo badge like Image 2 */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div
                    className={`px-3 py-1.5 rounded-lg font-black text-xs sm:text-sm tracking-wider uppercase shadow-lg border border-white/20 ${item.logoBg}`}
                  >
                    {item.logoText}
                  </div>
                </div>

                {/* Bottom Offer Badge (exact green/dark green banner in Image 2) */}
                <div className="absolute bottom-0 inset-x-0 bg-emerald-900/90 backdrop-blur-sm py-2 px-3 text-center border-t border-emerald-500/30">
                  <span className="text-xs sm:text-sm font-extrabold text-white tracking-wide">
                    {item.featuredOffer}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Right Scroll Arrow Button (like the orange circle in Image 2) */}
          <button
            onClick={() => scrollOffers('right')}
            className="hidden sm:flex absolute -right-3 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-[#EA580C] hover:bg-[#c2410c] text-white shadow-xl items-center justify-center z-20 transition-transform hover:scale-105 active:scale-95"
            aria-label="Scroll right"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </section>

      {/* 4. SEARCH & FILTER BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-10">
        <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by restaurant name, Goan fish thali, pizza, cocktails, locality..."
                className="w-full h-11 pl-10 pr-4 text-sm rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#EA580C] transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Region Selectors */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
              {['All', 'North Goa', 'South Goa', 'Panaji'].map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`px-3 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-colors ${
                    selectedRegion === region
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {region === 'All' ? 'All Goa' : region}
                </button>
              ))}
            </div>

            {/* Veg / Non-Veg toggles */}
            <div className="flex items-center gap-1.5 border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-3">
              <button
                onClick={() => setDietaryFilter('all')}
                className={`px-3 py-2 text-xs font-bold rounded-xl transition-colors ${
                  dietaryFilter === 'all'
                    ? 'bg-orange-100 text-[#EA580C]'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                All Diets
              </button>
              <button
                onClick={() => setDietaryFilter('veg')}
                className={`px-3 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors ${
                  dietaryFilter === 'veg'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-green-600" />
                Pure Veg
              </button>
              <button
                onClick={() => setDietaryFilter('non-veg')}
                className={`px-3 py-2 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors ${
                  dietaryFilter === 'non-veg'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <span className="h-2 w-2 rounded-full bg-red-600" />
                Non-Veg
              </button>
            </div>
          </div>

          {/* Active Filter Badges */}
          {(selectedCategory !== 'all' || selectedRegion !== 'All' || dietaryFilter !== 'all' || searchQuery) && (
            <div className="flex items-center gap-2 flex-wrap pt-1 text-xs text-slate-500">
              <span className="font-semibold">Active filters:</span>
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-orange-50 text-[#EA580C] font-semibold border border-orange-200">
                  Category: {selectedCategory.toUpperCase()}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCategory('all')} />
                </span>
              )}
              {selectedRegion !== 'All' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold">
                  Region: {selectedRegion}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedRegion('All')} />
                </span>
              )}
              {dietaryFilter !== 'all' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 font-semibold">
                  Diet: {dietaryFilter}
                  <X className="h-3 w-3 cursor-pointer" onClick={() => setDietaryFilter('all')} />
                </span>
              )}
              <button
                onClick={() => {
                  setSelectedCategory('all')
                  setSelectedRegion('All')
                  setDietaryFilter('all')
                  setSearchQuery('')
                }}
                className="text-xs text-[#EA580C] hover:underline font-bold ml-2"
              >
                Reset All
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 5. RESTAURANTS DIRECTORY LISTING */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 mt-8">
        <div className="flex items-center justify-between mb-5">
          <p className="text-sm font-semibold text-slate-600">
            Showing <span className="font-bold text-slate-900">{filteredRestaurants.length}</span> top rated restaurants
          </p>
        </div>

        {filteredRestaurants.length === 0 ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-slate-200">
            <UtensilsCrossed className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No restaurants found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              We couldn't find matching places for your filter. Try clearing filters or searching another keyword.
            </p>
            <Button
              onClick={() => {
                setSelectedCategory('all')
                setSelectedRegion('All')
                setDietaryFilter('all')
                setSearchQuery('')
              }}
              variant="outline"
              size="sm"
              className="mt-4 text-xs font-semibold"
            >
              Reset Filters
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map((restaurant) => {
              const isSaved = savedIds.includes(restaurant.id)
              const detailSlug = idToSlug[restaurant.id] || restaurant.id
              const detailHref = `/restaurants/${detailSlug}`

              return (
                <Card
                  key={restaurant.id}
                  className="group rounded-2xl overflow-hidden border border-slate-200/90 hover:border-orange-300 shadow-sm hover:shadow-xl transition-all duration-300 bg-white flex flex-col"
                >
                  {/* Photo Header — clicking the image navigates to detail */}
                  <Link href={detailHref} className="relative h-52 w-full overflow-hidden block">
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                      style={{ backgroundImage: `url('${restaurant.image}')` }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/30" />

                    {/* Top tags */}
                    <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                      {restaurant.featuredOffer ? (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#EA580C] text-white shadow-md flex items-center gap-1">
                          <Tag className="h-3 w-3" />
                          {restaurant.featuredOffer}
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-black/60 text-white backdrop-blur-sm">
                          {restaurant.categoryLabel}
                        </span>
                      )}

                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          toggleSave(restaurant)
                        }}
                        className="h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center text-slate-700 hover:text-red-500 shadow-md transition-colors"
                      >
                        <Heart className={`h-4 w-4 ${isSaved ? 'fill-red-500 text-red-500' : ''}`} />
                      </button>
                    </div>

                    {/* Bottom overlay inside image */}
                    <div className="absolute bottom-3 inset-x-3 flex items-end justify-between text-white">
                      <div>
                        <span className="text-[11px] font-medium text-slate-200 flex items-center gap-1">
                          <Clock className="h-3 w-3 text-amber-300" />
                          {restaurant.openingHours}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded-md text-xs font-bold text-amber-300">
                        <Star className="h-3.5 w-3.5 fill-amber-300 text-amber-300" />
                        <span>{restaurant.rating}</span>
                        <span className="text-[10px] text-slate-300">({restaurant.reviewsCount})</span>
                      </div>
                    </div>
                  </Link>

                  {/* Body Content */}
                  <CardContent className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Name & Veg indicator — clicking name navigates to detail */}
                      <div className="flex items-start justify-between gap-2">
                        <Link href={detailHref}>
                          <h3 className="font-extrabold text-lg text-slate-900 group-hover:text-[#EA580C] transition-colors leading-snug">
                            {restaurant.name}
                          </h3>
                        </Link>
                        <div className="flex items-center gap-1 mt-1 flex-shrink-0">
                          {restaurant.isVeg && (
                            <div className="h-4 w-4 border-2 border-green-600 flex items-center justify-center p-0.5 rounded-sm" title="Pure Veg">
                              <div className="h-2 w-2 rounded-full bg-green-600" />
                            </div>
                          )}
                          {restaurant.hasNonVeg && (
                            <div className="h-4 w-4 border-2 border-red-600 flex items-center justify-center p-0.5 rounded-sm" title="Non-Veg">
                              <div className="h-2 w-2 rounded-full bg-red-600" />
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Location */}
                      <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                        <MapPin className="h-3.5 w-3.5 text-slate-400 flex-shrink-0" />
                        <span className="truncate">{restaurant.location}</span>
                      </p>

                      {/* Cuisines */}
                      <div className="flex items-center gap-1.5 flex-wrap mt-2.5">
                        {restaurant.cuisine.map((c) => (
                          <span
                            key={c}
                            className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                          >
                            {c}
                          </span>
                        ))}
                      </div>

                      {/* Popular dishes highlight */}
                      <div className="mt-3 pt-3 border-t border-slate-100">
                        <p className="text-[11px] font-medium text-slate-500">
                          <span className="font-bold text-slate-700">Must Try: </span>
                          {restaurant.popularDishes.join(', ')}
                        </p>
                      </div>
                    </div>

                    {/* Bottom Pricing & Actions */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-semibold block">Cost for two</span>
                        <span className="text-sm font-extrabold text-slate-900">{restaurant.priceForTwo}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* "Menu" opens quick modal */}
                        <Button
                          onClick={() => setActiveMenuRestaurant(restaurant)}
                          variant="outline"
                          size="sm"
                          className="text-xs font-semibold h-8 px-2.5 border-slate-300 hover:bg-slate-50"
                        >
                          Menu
                        </Button>

                        {/* "View Details" goes to full detail page */}
                        <Link href={detailHref}>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs font-semibold h-8 px-2.5 border-[#EA580C]/60 text-[#EA580C] hover:bg-orange-50"
                          >
                            Details
                          </Button>
                        </Link>

                        {/* "Book Table" opens quick booking modal */}
                        <Button
                          onClick={() => setActiveBookingRestaurant(restaurant)}
                          size="sm"
                          className="text-xs font-bold h-8 px-3.5 bg-[#EA580C] hover:bg-[#c2410c] text-white shadow-sm"
                        >
                          Book Table
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}
      </section>

      {/* 6. MODAL: VIEW RESTAURANT MENU */}
      {activeMenuRestaurant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
              <div>
                <h3 className="font-black text-lg text-slate-900">{activeMenuRestaurant.name}</h3>
                <p className="text-xs text-slate-500">Curated Chef's Menu & Goan Specialties</p>
              </div>
              <button
                onClick={() => setActiveMenuRestaurant(null)}
                className="h-8 w-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modal Menu Items */}
            <div className="p-5 overflow-y-auto space-y-4">
              {activeMenuRestaurant.menu.map((dish, i) => (
                <div key={i} className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 last:border-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <div
                        className={`h-3 w-3 border flex items-center justify-center p-0.5 rounded-sm ${
                          dish.isVeg ? 'border-green-600' : 'border-red-600'
                        }`}
                      >
                        <div
                          className={`h-1.5 w-1.5 rounded-full ${dish.isVeg ? 'bg-green-600' : 'bg-red-600'}`}
                        />
                      </div>
                      <span className="text-sm font-bold text-slate-900">{dish.name}</span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{dish.desc}</p>
                  </div>
                  <span className="font-extrabold text-sm text-slate-900 whitespace-nowrap">
                    ₹{dish.price}
                  </span>
                </div>
              ))}
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-xs text-slate-500 flex items-center gap-1">
                <Tag className="h-3.5 w-3.5 text-[#EA580C]" />
                {activeMenuRestaurant.featuredOffer || '10% Tourist Discount applicable'}
              </span>
              <Button
                onClick={() => {
                  const r = activeMenuRestaurant
                  setActiveMenuRestaurant(null)
                  setActiveBookingRestaurant(r)
                }}
                className="bg-[#EA580C] hover:bg-[#c2410c] text-white text-xs font-bold"
              >
                Reserve a Table
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 7. MODAL: BOOK A TABLE */}
      {activeBookingRestaurant && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-orange-50/60">
              <div>
                <h3 className="font-black text-lg text-slate-900">Reserve a Table</h3>
                <p className="text-xs text-slate-600">{activeBookingRestaurant.name}</p>
              </div>
              <button
                onClick={() => setActiveBookingRestaurant(null)}
                className="h-8 w-8 rounded-full bg-slate-200 hover:bg-slate-300 flex items-center justify-center text-slate-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Discount Offer Banner */}
              {activeBookingRestaurant.featuredOffer && (
                <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 flex items-center gap-2 text-xs font-bold text-[#EA580C]">
                  <Sparkles className="h-4 w-4 flex-shrink-0" />
                  <span>
                    Offer Applied: {activeBookingRestaurant.featuredOffer} automatically credited to your bill!
                  </span>
                </div>
              )}

              {/* Guest Count */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Number of Guests</label>
                <div className="grid grid-cols-5 gap-2">
                  {['1', '2', '4', '6', '8+'].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setBookingGuests(num)}
                      className={`py-2 text-xs font-bold rounded-xl border transition-colors ${
                        bookingGuests === num
                          ? 'bg-[#EA580C] text-white border-[#EA580C]'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {num} {num === '1' ? 'Guest' : 'Guests'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Time Slot */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Preferred Slot</label>
                <div className="grid grid-cols-2 gap-2 text-xs font-medium">
                  {['Today, 1:30 PM (Lunch)', 'Today, 8:00 PM (Dinner)', 'Tomorrow, 1:00 PM', 'Tomorrow, 8:30 PM'].map((slot) => (
                    <button
                      key={slot}
                      type="button"
                      onClick={() => setBookingDate(slot)}
                      className={`p-2.5 rounded-xl border text-left transition-colors ${
                        bookingDate === slot
                          ? 'border-[#EA580C] bg-orange-50 text-[#EA580C] font-bold'
                          : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contact info notice */}
              <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl">
                Table confirmation and directions link will be sent instantly to your profile contact. Instant seat guarantee.
              </div>
            </div>

            <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-end gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setActiveBookingRestaurant(null)}
                className="text-xs font-semibold"
              >
                Cancel
              </Button>
              <Button
                size="sm"
                onClick={handleConfirmBooking}
                className="bg-[#EA580C] hover:bg-[#c2410c] text-white text-xs font-bold px-4"
              >
                Confirm Reservation
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

