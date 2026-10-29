'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Store, MapPin, Phone, Mail, Clock, Image,
  Loader2, CheckCircle2, AlertCircle, Save,
  TrendingUp, Eye, Star, Sparkles, ExternalLink, ArrowUpRight,
} from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import type { Database } from '@/lib/supabase/types'

type Place = Database['public']['Tables']['places']['Row']

const CATEGORIES = [
  'beach', 'heritage', 'restaurant', 'shack', 'resort', 'hotel',
  'adventure', 'culture', 'nightlife', 'shopping', 'spa', 'nature',
]

const placeSchema = z.object({
  name: z.string().min(2, 'Place name is required'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  category: z.string().min(1, 'Please select a category'),
  address: z.string().min(5, 'Address is required'),
  contact_phone: z.string().min(10, 'Enter a valid phone number'),
  contact_email: z.string().email('Enter a valid email'),
  photos: z.string().optional(),
})

type PlaceInput = z.infer<typeof placeSchema>

export function PlaceDashboardClient() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [myPlace, setMyPlace] = useState<Place | null>(null)
  const [userId, setUserId] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<PlaceInput>({ resolver: zodResolver(placeSchema) })

  const fetchMyPlace = useCallback(async (uid: string) => {
    const supabase = createClient()
    const { data, error } = await (supabase
      .from('places') as any)
      .select('*')
      .eq('owner_id', uid)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      toast.error('Failed to load your place.')
      return
    }

    if (data) {
      setMyPlace(data)
      reset({
        name: data.name,
        description: data.description ?? '',
        category: data.category,
        address: data.address,
        contact_phone: data.contact_phone ?? '',
        contact_email: data.contact_email ?? '',
        photos: (data.photos ?? []).join(', '),
      })
    }
  }, [reset])

  useEffect(() => {
    const init = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setUserId(user.id)
        await fetchMyPlace(user.id)
      }
      setLoading(false)
    }
    init()
  }, [fetchMyPlace])

  const onSubmit = async (values: PlaceInput) => {
    if (!userId) return
    setSaving(true)
    try {
      const supabase = createClient()
      const photosArr = values.photos
        ? values.photos.split(',').map((s) => s.trim()).filter(Boolean)
        : []

      const payload = {
        owner_id: userId,
        name: values.name,
        description: values.description,
        category: values.category,
        address: values.address,
        contact_phone: values.contact_phone,
        contact_email: values.contact_email,
        photos: photosArr,
        status: 'pending' as const,
      }

      let result: any

      if (myPlace) {
        // Update existing place
        result = await (supabase
          .from('places') as any)
          .update(payload)
          .eq('id', myPlace.id)
          .select()
          .single()
      } else {
        // Create new place
        result = await (supabase
          .from('places') as any)
          .insert(payload)
          .select()
          .single()
      }

      if (result.error) {
        toast.error(result.error.message)
        return
      }

      setMyPlace(result.data)
      toast.success(
        myPlace
          ? 'Place details updated! Our team will review any changes.'
          : 'Place submitted! It will go public once reviewed by our team (within 24h).'
      )
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="h-8 w-8 animate-spin text-[#0077B6]" />
      </div>
    )
  }

  const statusConfig = {
    pending: { label: 'Under Review', color: 'text-amber-700 bg-amber-50 border-amber-200', icon: Clock },
    approved: { label: 'Live & Public', color: 'text-emerald-700 bg-emerald-50 border-emerald-200', icon: CheckCircle2 },
    rejected: { label: 'Needs Changes', color: 'text-red-700 bg-red-50 border-red-200', icon: AlertCircle },
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {myPlace ? myPlace.name : 'Register Your Place'}
            </h1>
            {myPlace && (() => {
              const cfg = statusConfig[myPlace.status] ?? statusConfig.pending
              const Icon = cfg.icon
              return (
                <div className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${cfg.color}`}>
                  <Icon className="h-3.5 w-3.5" />
                  {cfg.label}
                </div>
              )
            })()}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            {myPlace
              ? 'Manage your public venue profile, photos, contact details, and visitor engagement.'
              : 'Fill in your place details below. Once submitted, our admin team reviews and publishes it live to tourists.'}
          </p>
        </div>

        {myPlace && myPlace.status === 'approved' && (
          <a
            href="/explore"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0077B6] bg-sky-50 hover:bg-sky-100 border border-sky-200 px-3.5 py-2 rounded-xl transition-colors self-start sm:self-auto"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View Public Listing
          </a>
        )}
      </div>

      {/* KPI Stats Overview (when place exists) */}
      {myPlace && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Eye className="h-3.5 w-3.5 text-sky-500" /> Tourist Views
            </span>
            <div className="text-2xl font-black text-slate-900">2,440</div>
            <div className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
              <TrendingUp className="h-3 w-3" /> +18% this month
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-amber-500" /> Tourist Inquiries
            </span>
            <div className="text-2xl font-black text-slate-900">184</div>
            <div className="text-[11px] font-semibold text-amber-700">
              Direct calls & booking requests
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-slate-200/90 shadow-sm space-y-1">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> Customer Rating
            </span>
            <div className="text-2xl font-black text-slate-900">4.9 ★</div>
            <div className="text-[11px] font-semibold text-slate-500">
              Based on 120+ verified visits
            </div>
          </div>
        </div>
      )}

      {/* Form Card */}
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 space-y-5">

        {/* Place Name */}
        <div className="space-y-1.5">
          <Label htmlFor="place-name" className="flex items-center gap-1.5">
            <Store className="h-3.5 w-3.5 text-slate-400" /> Place / Venue Name
          </Label>
          <Input id="place-name" placeholder="e.g. Sunset Shack Calangute" {...register('name')} />
          {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name.message}</p>}
        </div>

        {/* Category */}
        <div className="space-y-1.5">
          <Label htmlFor="place-category">Category</Label>
          <select
            id="place-category"
            {...register('category')}
            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#0077B6]/40 focus:border-[#0077B6] transition-colors capitalize"
          >
            <option value="">— Select a category —</option>
            {CATEGORIES.map((c) => (
              <option key={c} value={c} className="capitalize">{c.charAt(0).toUpperCase() + c.slice(1)}</option>
            ))}
          </select>
          {errors.category && <p className="text-xs text-red-500 font-medium">{errors.category.message}</p>}
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label htmlFor="place-desc">Description</Label>
          <textarea
            id="place-desc"
            rows={4}
            placeholder="Tell tourists what makes your place special…"
            {...register('description')}
            className="flex w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0077B6]/40 focus:border-[#0077B6] transition-colors resize-none"
          />
          {errors.description && <p className="text-xs text-red-500 font-medium">{errors.description.message}</p>}
        </div>

        {/* Address */}
        <div className="space-y-1.5">
          <Label htmlFor="place-address" className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-slate-400" /> Full Address
          </Label>
          <Input id="place-address" placeholder="e.g. Calangute Beach Road, North Goa 403516" {...register('address')} />
          {errors.address && <p className="text-xs text-red-500 font-medium">{errors.address.message}</p>}
        </div>

        {/* Phone + Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="place-phone" className="flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5 text-slate-400" /> Contact Phone
            </Label>
            <Input id="place-phone" type="tel" placeholder="+91 98765 43210" {...register('contact_phone')} />
            {errors.contact_phone && <p className="text-xs text-red-500 font-medium">{errors.contact_phone.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="place-email" className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5 text-slate-400" /> Contact Email
            </Label>
            <Input id="place-email" type="email" placeholder="info@myvenue.com" {...register('contact_email')} />
            {errors.contact_email && <p className="text-xs text-red-500 font-medium">{errors.contact_email.message}</p>}
          </div>
        </div>

        {/* Photos */}
        <div className="space-y-1.5">
          <Label htmlFor="place-photos" className="flex items-center gap-1.5">
            <Image className="h-3.5 w-3.5 text-slate-400" /> Photo URLs{' '}
            <span className="text-[10px] text-slate-400 font-normal">(comma-separated)</span>
          </Label>
          <Input
            id="place-photos"
            placeholder="https://your-cdn.com/photo1.jpg, https://your-cdn.com/photo2.jpg"
            {...register('photos')}
          />
          <p className="text-[10px] text-slate-400">Paste publicly accessible image URLs separated by commas</p>
        </div>

        {/* Submit */}
        <div className="pt-2 flex items-center gap-3">
          <Button
            type="submit"
            disabled={saving || !isDirty}
            className="bg-[#0077B6] hover:bg-[#005f92] text-white font-bold px-6 h-11 shadow-md shadow-blue-400/10"
          >
            {saving ? (
              <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving…</>
            ) : (
              <><Save className="mr-2 h-4 w-4" /> {myPlace ? 'Save Changes' : 'Submit for Review'}</>
            )}
          </Button>
          {!isDirty && myPlace && (
            <span className="text-xs text-slate-400">No unsaved changes</span>
          )}
        </div>
      </form>

      {/* Info Box */}
      <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-600 space-y-1.5">
        <p className="font-semibold text-slate-700">How it works:</p>
        <p>1. Submit your place details using the form above.</p>
        <p>2. Our admin team reviews your listing within <strong>24 hours</strong>.</p>
        <p>3. Once approved, your place goes <strong>live and visible</strong> to all Goa tourists.</p>
        <p>4. You can update details anytime — changes go back to review.</p>
      </div>
    </div>
  )
}
