import React from 'react'
import { TouristDashboardClient } from '@/components/dashboard/TouristDashboardClient'

export const metadata = {
  title: 'Dashboard — Goa Tourism',
  description: 'Your personal Goa travel hub with active itineraries, live beach safety, and saved coastal venues.',
}

export default function UserDashboardPage() {
  return <TouristDashboardClient />
}
