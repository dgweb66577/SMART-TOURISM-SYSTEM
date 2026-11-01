import React from 'react'
import PlacesViewClient from '@/components/places/PlacesViewClient'
import { PLACES_DATA, PlaceItem, PlaceCategory } from '@/lib/data/placesData'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Explore Destinations — Goa Smart Tourism',
  description:
    'Explore pristine beaches with safety flags, historic forts, UNESCO churches, sacred temples, and waterfalls across Goa.',
}

export const dynamic = 'force-dynamic'

export default async function ExplorePage() {
  let approvedDbPlaces: PlaceItem[] = []

  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('places')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false })

    if (data && data.length > 0) {
      approvedDbPlaces = data.map((p: any) => {
        const catLower = (p.category || '').toLowerCase()
        let cat: PlaceCategory = 'beach'
        if (catLower.includes('fort') || catLower.includes('heritage')) cat = 'heritage_fort'
        else if (catLower.includes('church') || catLower.includes('cathedral')) cat = 'church'
        else if (catLower.includes('temple')) cat = 'temple'
        else if (catLower.includes('waterfall') || catLower.includes('nature')) cat = 'waterfall_nature'
        else if (catLower.includes('wildlife') || catLower.includes('bird')) cat = 'wildlife'
        else if (catLower.includes('market') || catLower.includes('quarter')) cat = 'quarter_market'

        const photos =
          Array.isArray(p.photos) && p.photos.length > 0
            ? p.photos
            : ['https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200']

        return {
          id: p.id,
          slug: p.id,
          name: p.name,
          category: cat,
          categoryLabel: p.category || 'Attraction',
          region: (p.address?.toLowerCase().includes('south') ? 'South Goa' : 'North Goa') as any,
          taluka: 'Goa',
          location: p.address || 'Goa',
          fullAddress: p.address || 'Goa, India',
          coordinates: {
            lat: p.latitude || 15.4989,
            lng: p.longitude || 73.8278,
          },
          googleMapsUrl: `https://maps.google.com/?q=${encodeURIComponent(p.name + ' ' + (p.address || 'Goa'))}`,
          rating: 4.8,
          reviewsCount: 120,
          image: photos[0],
          gallery: photos,
          description: p.description || 'Verified partner destination listed on Goa Tourism platform.',
          highlights: ['Verified partner destination', 'Authentic local experience'],
          bestTimeToVisit: 'October to May',
          timings: typeof p.opening_hours === 'string' ? p.opening_hours : '9:00 AM – 6:00 PM',
          entryFee: 'Free Entry',
          amenities: ['Verified Spot', 'Parking Available'],
          travelTips: ['Follow local visitor guidelines.'],
          tags: ['Verified Partner', 'Explore Goa'],
          reviews: [],
        }
      })
    }
  } catch {
    // If db is momentarily unreachable, fallback cleanly to PLACES_DATA
  }

  const allPlaces = [...approvedDbPlaces, ...PLACES_DATA]

  return <PlacesViewClient initialPlaces={allPlaces} />
}
