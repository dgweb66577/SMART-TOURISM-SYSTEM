import * as React from 'react'
import { cn } from '@/lib/utils'

export const Avatar = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-slate-100',
      className
    )}
    {...props}
  />
))
Avatar.displayName = 'Avatar'

export const AvatarFallback = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'flex h-full w-full items-center justify-center rounded-full bg-[#0077B6] text-white font-bold text-xs',
      className
    )}
    {...props}
  />
))
AvatarFallback.displayName = 'AvatarFallback'
