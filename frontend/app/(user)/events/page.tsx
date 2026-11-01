import React from 'react'
import EventsViewClient from '@/components/events/EventsViewClient'
import { EVENTS_DATA, EventItem } from '@/lib/data/eventsData'
import { createClient } from '@/lib/supabase/server'

export const metadata = {
  title: 'Events & Parties in Goa — Official Goa Tourism Events Calendar',
  description:
    'Explore today, tomorrow, weekend and upcoming music festivals, beach parties, cultural carnivals, and food fairs across Goa.',
}

export const dynamic = 'force-dynamic'

export default async function EventsPage() {
  let dbEvents: EventItem[] = []

  try {
    const supabase = createClient()
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('start_date', { ascending: true })

    if (data && data.length > 0) {
      dbEvents = data.map((e: any) => {
        const photos =
          Array.isArray(e.photos) && e.photos.length > 0
            ? e.photos
            : ['https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1200']

        return {
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
      })
    }
  } catch {
    // Fallback cleanly to EVENTS_DATA
  }

  const allEvents = [...dbEvents, ...EVENTS_DATA]

  return <EventsViewClient initialEvents={allEvents} />
}

