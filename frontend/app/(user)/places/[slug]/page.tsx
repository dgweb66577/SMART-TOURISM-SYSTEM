import React from 'react'
import { notFound } from 'next/navigation'
import PlaceDetailClient from '@/components/places/PlaceDetailClient'
import { PLACES_DATA, POPULAR_EXPERIENCES, PlaceItem } from '@/lib/data/placesData'
import { createClient } from '@/lib/supabase/server'

interface PlacePageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: PlacePageProps) {
  const { slug } = params
  const place = PLACES_DATA.find((p) => p.slug === slug || p.id === slug)

  if (!place) {
    return {
      title: 'Place Not Found — Goa Tourism',
    }
  }

  return {
    title: `${place.name} | Places in Goa — Goa Tourism`,
    description: place.description,
  }
}

export default async function PlaceDetailPage({ params }: PlacePageProps) {
  const { slug } = params

  // 1. Check local PLACES_DATA
  let place = PLACES_DATA.find((p) => p.slug === slug || p.id === slug)

  // 2. If not found in static list, check Supabase approved places
  if (!place) {
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('places')
        .select('*')
        .eq('status', 'approved')
        .or(`id.eq.${slug},name.ilike.%${slug.replace(/-/g, ' ')}%`)
        .single()

      if (data) {
        const d = data as any
        const photos =
          Array.isArray(d.photos) && d.photos.length > 0
            ? d.photos
            : ['https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?q=80&w=1200']

        place = {
          id: d.id,
          slug: d.id,
          name: d.name,
          category: 'beach',
          categoryLabel: d.category || 'Destination',
          region: (d.address?.toLowerCase().includes('south') ? 'South Goa' : 'North Goa') as any,
          taluka: 'Goa',
          location: d.address || 'Goa',
          fullAddress: d.address || 'Goa, India',
          coordinates: {
            lat: d.latitude || 15.4989,
            lng: d.longitude || 73.8278,
          },
          googleMapsUrl: `https://maps.google.com/?q=${encodeURIComponent(d.name + ' ' + (d.address || 'Goa'))}`,
          rating: 4.8,
          reviewsCount: 120,
          image: photos[0],
          gallery: photos,
          description: d.description || 'Verified partner destination listed on Goa Tourism platform.',
          highlights: ['Verified partner spot', 'Authentic Goa experience'],
          bestTimeToVisit: 'October to May',
          timings: typeof d.opening_hours === 'string' ? d.opening_hours : '9:00 AM – 6:00 PM',
          entryFee: 'Free Entry',
          amenities: ['Verified Spot', 'Parking Available'],
          travelTips: ['Follow local guidelines.'],
          tags: ['Verified Partner'],
          reviews: [],
        }
      }
    } catch {
      // Ignore
    }
  }

  if (!place) {
    notFound()
  }

  // Get nearby places from same region or category
  const nearbyPlaces = PLACES_DATA.filter(
    (p) => p.id !== place?.id && (p.region === place?.region || p.category === place?.category)
  ).slice(0, 4)

  return (
    <PlaceDetailClient
      place={place}
      nearbyPlaces={nearbyPlaces}
      experiences={POPULAR_EXPERIENCES}
    />
  )
}
