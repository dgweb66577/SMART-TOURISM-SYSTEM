'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Loader2, Mail, Lock, Store, Phone, User, Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const partnerSignupSchema = z.object({
  businessName: z.string().min(2, 'Business name must be at least 2 characters'),
  ownerName: z.string().min(2, 'Your name must be at least 2 characters'),
  phone: z.string().min(10, 'Enter a valid phone number'),
  email: z.string().email('Enter a valid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must include an uppercase letter')
    .regex(/[0-9]/, 'Password must include a number'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
})

type PartnerSignupInput = z.infer<typeof partnerSignupSchema>

export function RegisterPartnerForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showPw, setShowPw] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PartnerSignupInput>({
    resolver: zodResolver(partnerSignupSchema),
  })

  const onSubmit = async (values: PartnerSignupInput) => {
    setIsLoading(true)
    try {
      const supabase = createClient()

      const { data, error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          // This metadata tells the DB trigger to assign place_incharge role
          data: {
            role: 'place_incharge',
            full_name: values.ownerName,
            business_name: values.businessName,
            phone: values.phone,
          },
        },
      })

      if (error) {
        toast.error(error.message)
        return
      }

      if (data.user) {
        toast.success(`Welcome, ${values.ownerName}! Your partner account is ready.`)
        window.location.href = '/place/dashboard'
      } else {
        toast.info('Please check your email to confirm your account.')
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed. Please try again.'
      toast.error(msg)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
      {/* Business Name */}
      <div className="space-y-1.5">
        <Label htmlFor="businessName">Business / Venue Name</Label>
        <div className="relative">
          <Store className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            id="businessName"
            type="text"
            placeholder="e.g. Curlies Beach Shack"
            className="pl-9"
            {...register('businessName')}
          />
        </div>
        {errors.businessName && (
          <p className="text-xs text-red-500 font-medium">{errors.businessName.message}</p>
        )}
      </div>

      {/* Owner Name */}
      <div className="space-y-1.5">
        <Label htmlFor="ownerName">Your Full Name</Label>
        <div className="relative">
          <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            id="ownerName"
            type="text"
            placeholder="Your name"
            className="pl-9"
            {...register('ownerName')}
          />
        </div>
        {errors.ownerName && (
          <p className="text-xs text-red-500 font-medium">{errors.ownerName.message}</p>
        )}
      </div>

      {/* Phone */}
      <div className="space-y-1.5">
        <Label htmlFor="phone">Contact Phone</Label>
        <div className="relative">
          <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            id="phone"
            type="tel"
            placeholder="+91 98765 43210"
            className="pl-9"
            {...register('phone')}
          />
        </div>
        {errors.phone && (
          <p className="text-xs text-red-500 font-medium">{errors.phone.message}</p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-1.5">
        <Label htmlFor="partner-email">Business Email</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            id="partner-email"
            type="email"
            placeholder="you@yourbusiness.com"
            className="pl-9"
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-500 font-medium">{errors.email.message}</p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-1.5">
        <Label htmlFor="partner-password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            id="partner-password"
            type={showPw ? 'text' : 'password'}
            placeholder="Min. 8 chars, 1 uppercase, 1 number"
            className="pl-9 pr-10"
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
            tabIndex={-1}
          >
            {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-500 font-medium">{errors.password.message}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1.5">
        <Label htmlFor="partner-confirm-password">Confirm Password</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            id="partner-confirm-password"
            type={showPw ? 'text' : 'password'}
            placeholder="Re-enter your password"
            className="pl-9"
            {...register('confirmPassword')}
          />
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-red-500 font-medium">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button
        type="submit"
        className="w-full h-11 bg-gradient-to-r from-[#FF7B00] to-[#FF9500] hover:from-[#e06a00] hover:to-[#e08500] text-white font-bold shadow-md shadow-orange-400/20 mt-2"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Partner Account…
          </>
        ) : (
          'Register My Place'
        )}
      </Button>
    </form>
  )
}
