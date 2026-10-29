import React from 'react'
import { RestaurantsViewClient } from '@/components/restaurants/RestaurantsViewClient'

export const metadata = {
  title: 'Restaurants — Best Restaurants in Goa',
  description:
    'Discover best restaurants in Goa. From beach shacks and authentic Goan seafood to family dining, Portuguese heritage cafes, and pure vegetarian specials.',
}

export default function RestaurantsPage() {
  return <RestaurantsViewClient />
}

