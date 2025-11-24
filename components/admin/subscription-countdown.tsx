'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Subscription {
  id: string
  user_id: string
  plan_id: string
  expiry_date: string | null
  plan_status: string
  users?: {
    email: string
    full_name: string | null
  }
  plan?: {
    name: string
  }
}

interface SubscriptionCountdownProps {
  subscriptions: Subscription[]
}

export function SubscriptionCountdown({ subscriptions }: SubscriptionCountdownProps) {
  const [timeLeft, setTimeLeft] = useState<Record<string, string>>({})
  const [isExpiredMap, setIsExpiredMap] = useState<Record<string, boolean>>({})

  useEffect(() => {
    const calculateTimeLeft = () => {
      const newTimeLeft: Record<string, string> = {}
      const newIsExpiredMap: Record<string, boolean> = {}
      
      subscriptions.forEach((sub) => {
        if (!sub.expiry_date || sub.plan_status !== 'active') {
          newTimeLeft[sub.id] = 'N/A'
          return
        }

        const expiryDate = new Date(sub.expiry_date)
        const now = new Date()
        const difference = expiryDate.getTime() - now.getTime()
        const fiveHoursInMs = 5 * 60 * 60 * 1000

        // If expired, check if within 5 hours
        if (difference <= 0) {
          const timeSinceExpiry = Math.abs(difference)
          
          // Only show if expired less than 5 hours ago
          if (timeSinceExpiry <= fiveHoursInMs) {
            newIsExpiredMap[sub.id] = true
            
            // Calculate time since expiration
            const hours = Math.floor(timeSinceExpiry / (1000 * 60 * 60))
            const minutes = Math.floor((timeSinceExpiry % (1000 * 60 * 60)) / (1000 * 60))
            const seconds = Math.floor((timeSinceExpiry % (1000 * 60)) / 1000)
            
            if (hours > 0) {
              newTimeLeft[sub.id] = `Expired ${hours}h ${minutes}m ago`
            } else if (minutes > 0) {
              newTimeLeft[sub.id] = `Expired ${minutes}m ${seconds}s ago`
            } else {
              newTimeLeft[sub.id] = `Expired ${seconds}s ago`
            }
          }
          return
        }

        newIsExpiredMap[sub.id] = false

        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((difference % (1000 * 60)) / 1000)

        if (days > 0) {
          newTimeLeft[sub.id] = `${days}d ${hours}h ${minutes}m`
        } else if (hours > 0) {
          newTimeLeft[sub.id] = `${hours}h ${minutes}m ${seconds}s`
        } else if (minutes > 0) {
          newTimeLeft[sub.id] = `${minutes}m ${seconds}s`
        } else {
          newTimeLeft[sub.id] = `${seconds}s`
        }
      })

      setTimeLeft(newTimeLeft)
      setIsExpiredMap(newIsExpiredMap)
    }

    calculateTimeLeft()
    const interval = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(interval)
  }, [subscriptions])

  // Filter subscriptions: active with expiry date, or expired within 5 hours
  const now = new Date()
  const fiveHoursInMs = 5 * 60 * 60 * 1000
  
  const visibleSubscriptions = subscriptions.filter((sub) => {
    if (!sub.expiry_date || sub.plan_status !== 'active') return false
    
    const expiryDate = new Date(sub.expiry_date)
    const difference = expiryDate.getTime() - now.getTime()
    
    // Include if not expired, or expired within last 5 hours
    return difference > 0 || (difference <= 0 && Math.abs(difference) <= fiveHoursInMs)
  })

  if (visibleSubscriptions.length === 0) {
    return null
  }

  // Sort by expiry date (soonest first, then expired ones)
  const sortedSubscriptions = [...visibleSubscriptions].sort((a, b) => {
    if (!a.expiry_date || !b.expiry_date) return 0
    return new Date(a.expiry_date).getTime() - new Date(b.expiry_date).getTime()
  })

  return (
    <Card className="border-2 border-gray-200 shadow-sm">
      <CardHeader className="p-5 border-b border-gray-200">
        <CardTitle className="text-lg font-semibold">Subscription Expiry Countdown</CardTitle>
        <CardDescription className="text-sm mt-1">
          Active subscriptions expiring soon
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 lg:p-6">
        <div className="space-y-3 lg:space-y-4">
          {sortedSubscriptions.slice(0, 10).map((sub) => {
            const timeRemaining = timeLeft[sub.id] || 'Calculating...'
            const expiryDate = sub.expiry_date ? new Date(sub.expiry_date) : null
            const isExpired = isExpiredMap[sub.id] || false
            const isExpiringSoon = expiryDate && !isExpired && (expiryDate.getTime() - new Date().getTime()) < 24 * 60 * 60 * 1000

            return (
              <div
                key={sub.id}
                className={`flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b pb-3 lg:pb-4 last:border-b-0 ${
                  isExpired ? 'bg-red-50 border-red-200' : ''
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm lg:text-base truncate ${
                    isExpired ? 'text-red-900' : ''
                  }`}>
                    {sub.users?.full_name || sub.users?.email || 'Unknown User'}
                  </p>
                  <p className={`text-xs lg:text-sm ${
                    isExpired ? 'text-red-700' : 'text-muted-foreground'
                  }`}>
                    {sub.plan?.name || 'N/A'}
                  </p>
                </div>
                <div className="text-left sm:text-right flex-shrink-0">
                  <div className="flex items-center gap-2">
                    {isExpired ? (
                      <Badge variant="destructive" className="text-xs">
                        Expired
                      </Badge>
                    ) : isExpiringSoon ? (
                      <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                        Expiring Soon
                      </Badge>
                    ) : null}
                    <p className={`font-mono font-semibold text-sm lg:text-base ${
                      isExpired ? 'text-red-600' : isExpiringSoon ? 'text-yellow-600' : 'text-gray-900'
                    }`}>
                      {timeRemaining}
                    </p>
                  </div>
                  {expiryDate && (
                    <p className={`text-xs lg:text-sm mt-1 ${
                      isExpired ? 'text-red-600' : 'text-muted-foreground'
                    }`}>
                      {expiryDate.toLocaleDateString()} {expiryDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
        {sortedSubscriptions.length > 10 && (
          <p className="text-xs text-muted-foreground mt-4 text-center">
            Showing 10 of {sortedSubscriptions.length} active subscriptions
          </p>
        )}
      </CardContent>
    </Card>
  )
}

