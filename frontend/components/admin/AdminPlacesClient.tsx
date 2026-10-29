'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import {
  MapPin,
  Check,
  X,
  Loader2,
  Clock,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Search,
} from 'lucide-react'

interface PlaceItem {
  id: string
  name: string
  category: string
  address: string
  description?: string | null
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  contact_phone?: string | null
  contact_email?: string | null
}

export function AdminPlacesClient() {
  const [places, setPlaces] = useState<PlaceItem[]>([])
  const [loading, setLoading] = useState(true)
  const [updatingId, setUpdatingId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const fetchPlaces = useCallback(async () => {
    setLoading(true)
    try {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('places')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        toast.error('Failed to load places: ' + error.message)
      } else {
        setPlaces((data as PlaceItem[]) || [])
      }
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Error fetching places')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPlaces()
  }, [fetchPlaces])

  const handleStatusUpdate = async (id: string, newStatus: 'approved' | 'rejected') => {
    setUpdatingId(id)
    try {
      const supabase = createClient()
      const { error } = await (supabase
        .from('places') as any)
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq('id', id)

      if (error) {
        toast.error('Failed to update status: ' + error.message)
        return
      }

      setPlaces((prev) =>
        prev.map((p) => (p.id === id ? { ...p, status: newStatus } : p))
      )

      toast.success(
        newStatus === 'approved'
          ? 'Place approved! It is now live to tourists on the explore page.'
          : 'Place has been marked as rejected.'
      )
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Update failed')
    } finally {
      setUpdatingId(null)
    }
  }

  const filteredPlaces = places.filter((p) => {
    const matchesTab = activeTab === 'all' || p.status === activeTab
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.address.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesTab && matchesSearch
  })

  const pendingCount = places.filter((p) => p.status === 'pending').length

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Places & Venue Moderation
          </h1>
          <p className="text-sm text-slate-500">
            Review submissions from Place Owners and publish them live to tourists
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={fetchPlaces}
          disabled={loading}
          className="gap-2 self-start sm:self-auto text-xs"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh Queue
        </Button>
      </div>

      {/* Tabs and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'all'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({places.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeTab === 'pending'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'approved'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Approved ({places.filter((p) => p.status === 'approved').length})
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === 'rejected'
                ? 'bg-rose-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rejected ({places.filter((p) => p.status === 'rejected').length})
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search venue or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Places List Card */}
      <Card className="border-slate-200/90 shadow-sm rounded-2xl bg-white overflow-hidden">
        <CardHeader className="p-6 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-bold text-slate-900">Listings Queue</CardTitle>
            <CardDescription className="text-xs text-slate-500">
              Live database records from <code className="text-sky-600">public.places</code>
            </CardDescription>
          </div>
          {pendingCount > 0 && (
            <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
              <Clock className="h-3 w-3" /> {pendingCount} Pending Review
            </span>
          )}
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-sky-600" />
            </div>
          ) : filteredPlaces.length === 0 ? (
            <div className="text-center py-16 px-4">
              <MapPin className="h-10 w-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-600">No place listings found</p>
              <p className="text-xs text-slate-400 mt-1">
                {activeTab !== 'all' ? `No listings with status "${activeTab}".` : 'No venue submissions yet.'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {filteredPlaces.map((place) => {
                const isBusy = updatingId === place.id

                return (
                  <div
                    key={place.id}
                    className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/80 transition-colors"
                  >
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <h3 className="font-bold text-base text-slate-900">{place.name}</h3>
                        <span
                          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full flex items-center gap-1 ${
                            place.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : place.status === 'rejected'
                              ? 'bg-rose-100 text-rose-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {place.status === 'approved' && <CheckCircle2 className="h-3 w-3" />}
                          {place.status === 'rejected' && <XCircle className="h-3 w-3" />}
                          {place.status === 'pending' && <Clock className="h-3 w-3" />}
                          {place.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                        <span className="font-semibold text-slate-700 capitalize">{place.category}</span>
                        <span>&bull;</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          {place.address}
                        </span>
                        {place.contact_phone && (
                          <>
                            <span>&bull;</span>
                            <span>{place.contact_phone}</span>
                          </>
                        )}
                      </div>
                      {place.description && (
                        <p className="text-xs text-slate-600 line-clamp-2 mt-1">
                          {place.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                      {place.status !== 'approved' && (
                        <Button
                          size="sm"
                          disabled={isBusy}
                          onClick={() => handleStatusUpdate(place.id, 'approved')}
                          className="text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                        >
                          {isBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                          Approve
                        </Button>
                      )}
                      {place.status !== 'rejected' && (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={isBusy}
                          onClick={() => handleStatusUpdate(place.id, 'rejected')}
                          className="text-xs gap-1.5 text-rose-600 border-rose-200 hover:bg-rose-50 font-semibold"
                        >
                          {isBusy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
                          Reject
                        </Button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
