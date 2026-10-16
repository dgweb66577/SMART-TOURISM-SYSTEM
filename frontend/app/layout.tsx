import type { Metadata, Viewport } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/sonner'

export const metadata: Metadata = {
  title: 'Goa Smart Tourism — AI-Powered Coastal Companion',
  description:
    'Experience Goa with smart recommendations, real-time itineraries, beach shacks, water sports, and Portuguese heritage exploration.',
  applicationName: 'Goa Smart Tourism PWA',
  keywords: ['Goa Tourism', 'Goa PWA', 'Beaches', 'Shacks', 'Itineraries', 'Smart Travel'],
  authors: [{ name: 'Goa Smart Tourism Team' }],
}

export const viewport: Viewport = {
  themeColor: '#0077B6',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  )
}
