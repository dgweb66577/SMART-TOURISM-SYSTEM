import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tag, Plus, Clock, Percent } from 'lucide-react'

export const metadata = {
  title: 'Offers & Promos — Goa Partner',
}

export default function PlaceOffersPage() {
  const offers = [
    {
      title: 'Sunset Cocktail Happy Hour',
      discount: 'Buy 1 Get 1 Free',
      schedule: 'Daily 4:00 PM - 7:00 PM',
      claims: 64,
      status: 'Active',
    },
    {
      title: 'Weekend Seafood Platter Special',
      discount: '15% Off Total Bill',
      schedule: 'Sat & Sun All Day',
      claims: 28,
      status: 'Active',
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Promotions & Deals</h1>
          <p className="text-sm text-slate-500">Create promotional offers to attract tourists searching for deals in your area</p>
        </div>
        <Button className="bg-[#FF7B00] hover:bg-[#e06c00] text-white flex items-center gap-2 self-start sm:self-auto text-xs font-semibold">
          <Plus className="h-4 w-4" />
          Create New Offer
        </Button>
      </div>

      <div className="space-y-3">
        {offers.map((offer, i) => (
          <Card key={i} className="p-5 border-slate-200/90 rounded-2xl bg-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-[#FF7B00]" />
                <h3 className="font-bold text-sm text-slate-900">{offer.title}</h3>
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                  {offer.discount}
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1.5">
                <Clock className="h-3 w-3" /> {offer.schedule} &bull; {offer.claims} tourists claimed
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
                {offer.status}
              </span>
              <Button size="sm" variant="outline" className="text-xs">
                Edit
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
