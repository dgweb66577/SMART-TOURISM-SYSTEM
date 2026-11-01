import React from 'react'
import { notFound } from 'next/navigation'
import EventDetailClient from '@/components/events/EventDetailClient'
import { EVENTS_DATA, EventItem } from '@/lib/data/eventsData'
import { createClient } from '@/lib/supabase/server'

interface EventPageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: EventPageProps) {
  const { slug } = params
  const event = EVENTS_DATA.find((e) => e.slug === slug || e.id === slug)

  if (!event) {
    return {
      title: 'Event Not Found — Goa Tourism',
    }
  }

  return {
    title: `${event.name} | Events & Parties in Goa — Goa Tourism`,
    description: event.description,
  }
}

export default async function EventDetailPage({ params }: EventPageProps) {
  const { slug } = params

  // 1. Check local EVENTS_DATA
  let event = EVENTS_DATA.find((e) => e.slug === slug || e.id === slug)

  // 2. If not found in static list, check Supabase
  if (!event) {
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('events')
        .select('*')
        .or(`id.eq.${slug},slug.eq.${slug}`)
        .single()

      if (data) {
        const e = data as any
        const photos =
          Array.isArray(e.photos) && e.photos.length > 0
            ? e.photos
            : ['https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200']

        event = {
          id: e.id,
          slug: e.slug || e.id,
          name: e.title || e.name,
          category: e.category || 'music',
          categoryLabel: e.category_label || 'Event',
          region: (e.address?.toLowerCase().includes('south') ? 'South Goa' : 'North Goa') as any,
          city: e.city || 'Goa',
          venue: e.venue || 'Goa Venue',
          fullAddress: e.address || 'Goa, India',
          coordinates: {
            lat: e.latitude || 15.4989,
            lng: e.longitude || 73.8278,
          },
          googleMapsUrl: `https://maps.google.com/?q=${encodeURIComponent((e.venue || e.name) + ' Goa')}`,
          startDate: e.start_date || 'Upcoming',
          startTime: e.start_time || '6:00 PM',
          endTime: e.end_time || '11:00 PM',
          dayOfWeek: 'Weekend',
          month: 'GOA',
          day: '2026',
          timeFilter: 'upcoming',
          isFeatured: !!e.is_featured,
          isPopular: true,
          isParty: (e.category || '').toLowerCase().includes('party'),
          free: e.price === 0,
          price: e.price || 0,
          priceUnit: e.price === 0 ? 'Free Entry' : '/pass',
          image: photos[0],
          gallery: photos,
          description: e.description || 'Verified event listed on the Goa Tourism platform.',
          about: e.about || e.description || 'Experience authentic celebrations in Goa.',
          highlights: ['Live Music & Entertainment', 'Local & International Food Stalls'],
          guidelines: ['Carry valid ID', 'Follow local event regulations'],
          organizer: {
            name: e.organizer_name || 'Verified Event Organizer',
            verified: true,
          },
          rating: 4.8,
          reviewsCount: 150,
          ticketTiers: [
            {
              id: 'gen',
              name: 'General Admission',
              price: e.price || 0,
              description: 'Standard event access',
              available: true,
            },
          ],
          reviews: [],
        }
      }
    } catch {
      // Ignore
    }
  }

  if (!event) {
    notFound()
  }

  // Get similar events from same category or region
  const similarEvents = EVENTS_DATA.filter(
    (e) => e.id !== event?.id && (e.category === event?.category || e.region === event?.region)
  ).slice(0, 4)

  return <EventDetailClient event={event} similarEvents={similarEvents} />
}

