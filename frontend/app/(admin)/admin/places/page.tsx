import React from 'react'
import { AdminPlacesClient } from '@/components/admin/AdminPlacesClient'

export const metadata = {
  title: 'Places Moderation — Goa Smart Tourism Admin',
  description: 'Approve, reject, and inspect vendor submissions',
}

export default function AdminPlacesPage() {
  return <AdminPlacesClient />
}
