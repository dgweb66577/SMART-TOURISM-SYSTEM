import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Store, MapPin, Phone, Mail, Clock, Camera } from 'lucide-react'

export const metadata = {
  title: 'My Place Profile — Goa Partner',
}

export default function PlaceProfilePage() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Place Listing</h1>
        <p className="text-sm text-slate-500">Edit venue information, contact details, and operating hours</p>
      </div>

      <Card className="border-slate-200/90 shadow-sm rounded-2xl bg-white">
        <CardHeader className="p-6 border-b border-slate-100">
          <CardTitle className="text-base font-bold">Venue Information</CardTitle>
          <CardDescription className="text-xs">Saved in public.places PostgreSQL table</CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Venue Name</Label>
              <Input defaultValue="Curlies Beach Shack" />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Input defaultValue="Restaurant & Beach Bar" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Address & Landmarks</Label>
            <Input defaultValue="St. Michael Vaddo, South Anjuna, Anjuna, Goa 403509" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Contact Phone</Label>
              <Input defaultValue="+91 98221 23456" />
            </div>
            <div className="space-y-1.5">
              <Label>Contact Email</Label>
              <Input defaultValue="bookings@curliesgoa.com" />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label>Operating Hours</Label>
            <Input defaultValue="Daily 08:30 AM – 03:00 AM" />
          </div>

          <div className="pt-2 flex justify-end">
            <Button className="bg-[#0077B6] hover:bg-[#005f92] text-white text-xs font-semibold">
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
