import React from 'react'
import { notFound } from 'next/navigation'
import {
  getRestaurantById,
  RESTAURANTS_DATA,
} from '@/lib/data/restaurantsData'
import { RestaurantDetailClient } from '@/components/restaurants/RestaurantDetailClient'

interface Props {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: Props) {
  const restaurant = getRestaurantById(params.id)
  if (!restaurant) {
    return {
      title: 'Restaurant Not Found — Goa Tourism',
    }
  }

  return {
    title: `${restaurant.name} | Boutique Cafe in Fontainhas — Goa Restaurants`,
    description: `${restaurant.tagline}. Located at ${restaurant.location}. Reserve tables, view menu, and get ${restaurant.featuredOffer || 'exclusive offers'}.`,
  }
}

export function generateStaticParams() {
  return RESTAURANTS_DATA.map((r) => ({
    id: r.id,
  }))
}

export default function SingleRestaurantSingularRoute({ params }: Props) {
  const restaurant = getRestaurantById(params.id)

  if (!restaurant) {
    notFound()
  }

  return <RestaurantDetailClient restaurant={restaurant} />
}

