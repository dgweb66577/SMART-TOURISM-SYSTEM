import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Star, MessageSquare, CornerDownRight } from 'lucide-react'

export const metadata = {
  title: 'Customer Reviews — Goa Partner',
}

export default function PlaceReviewsPage() {
  const reviews = [
    {
      author: 'Aarav M.',
      rating: 5,
      date: '2 days ago',
      comment: 'Amazing sunset views and fresh butter garlic calamari. Loved the chill electronic music vibes!',
      replied: true,
      reply: 'Thanks Aarav! Glad you enjoyed our seafood and sunset session. Come back soon!',
    },
    {
      author: 'Elena K.',
      rating: 4,
      date: '5 days ago',
      comment: 'Great beachfront ambiance. Quick service even on a busy Saturday evening.',
      replied: false,
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Guest Reviews & Feedback</h1>
        <p className="text-sm text-slate-500">Monitor guest experiences and respond to reviews</p>
      </div>

      <div className="space-y-4">
        {reviews.map((r, i) => (
          <Card key={i} className="p-5 border-slate-200/90 rounded-2xl bg-white shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-bold text-sm text-slate-900">{r.author}</h4>
                <div className="flex items-center gap-1 text-amber-500 mt-0.5">
                  {[...Array(5)].map((_, sIdx) => (
                    <Star
                      key={sIdx}
                      className={`h-3.5 w-3.5 ${
                        sIdx < r.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-200'
                      }`}
                    />
                  ))}
                  <span className="text-xs text-slate-400 ml-1.5">{r.date}</span>
                </div>
              </div>
              {!r.replied && (
                <Button size="sm" variant="outline" className="text-xs text-[#0077B6] border-sky-200">
                  Reply
                </Button>
              )}
            </div>

            <p className="text-xs text-slate-700 leading-relaxed">&ldquo;{r.comment}&rdquo;</p>

            {r.replied && (
              <div className="ml-4 pl-3 border-l-2 border-[#0077B6] bg-slate-50 p-2.5 rounded-r-lg space-y-1">
                <p className="text-[11px] font-bold text-[#0077B6] flex items-center gap-1">
                  <CornerDownRight className="h-3 w-3" /> Your Response:
                </p>
                <p className="text-xs text-slate-600">{r.reply}</p>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  )
}
