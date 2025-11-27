'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Lock } from 'lucide-react'
import { Prediction, CorrectScorePrediction } from '@/types'
import { formatTime, getDateRange } from '@/lib/utils/date'
import { CircularProgress } from '@/components/ui/circular-progress'
import { cn } from '@/lib/utils'
import Image from 'next/image'

interface PremiumPrediction {
  id: string
  home_team: string
  away_team: string
  league: string
  prediction_type?: string
  score_prediction?: string
  odds: number
  confidence?: number
  kickoff_time: string
  status: 'not_started' | 'live' | 'finished'
  type: 'profit_multiplier' | 'correct_score'
  home_team_logo?: string | null
  away_team_logo?: string | null
}

export function PremiumPredictionsSection() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [predictions, setPredictions] = useState<PremiumPrediction[]>([])
  const [loading, setLoading] = useState(true)
  const [dateType, setDateType] = useState<'previous' | 'today' | 'tomorrow'>('today')
  const [teamLogos, setTeamLogos] = useState<Record<string, string | null>>({})

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      const supabase = createClient()

      // Check user
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      // Fetch profit multiplier and correct score predictions
      const { from, to } = getDateRange(dateType)
      const fromTimestamp = `${from}T00:00:00.000Z`
      const toTimestamp = `${to}T23:59:59.999Z`
      
      const [profitMultiplierResult, correctScoreResult] = await Promise.all([
        supabase
          .from('predictions')
          .select('*')
          .eq('plan_type', 'profit_multiplier')
          .gte('kickoff_time', fromTimestamp)
          .lte('kickoff_time', toTimestamp)
          .gte('odds', 2.8)
          .lte('odds', 4.3)
          .order('kickoff_time', { ascending: true })
          .limit(5),
        supabase
          .from('correct_score_predictions')
          .select('*')
          .gte('kickoff_time', fromTimestamp)
          .lte('kickoff_time', toTimestamp)
          .order('kickoff_time', { ascending: true })
          .limit(5)
      ])

      const allPredictions: PremiumPrediction[] = []

      // Combine profit multiplier predictions
      if (profitMultiplierResult.data) {
        profitMultiplierResult.data.forEach((pred: Prediction) => {
          allPredictions.push({
            id: pred.id,
            home_team: pred.home_team,
            away_team: pred.away_team,
            league: pred.league,
            prediction_type: pred.prediction_type,
            odds: pred.odds,
            confidence: pred.confidence,
            kickoff_time: pred.kickoff_time,
            status: pred.status,
            type: 'profit_multiplier'
          })
        })
      }

      // Combine correct score predictions
      if (correctScoreResult.data) {
        correctScoreResult.data.forEach((pred: CorrectScorePrediction) => {
          allPredictions.push({
            id: pred.id,
            home_team: pred.home_team,
            away_team: pred.away_team,
            league: pred.league,
            score_prediction: pred.score_prediction,
            odds: pred.odds || 0,
            kickoff_time: pred.kickoff_time,
            status: pred.status,
            type: 'correct_score'
          })
        })
      }

      // Sort by kickoff time and take first 3
      allPredictions.sort((a, b) => 
        new Date(a.kickoff_time).getTime() - new Date(b.kickoff_time).getTime()
      )
      setPredictions(allPredictions.slice(0, 3))

      // Fetch team logos
      if (allPredictions.length > 0) {
        const predictionsByDate = new Map<string, PremiumPrediction[]>()
        allPredictions.forEach((pred) => {
          const kickoffDate = new Date(pred.kickoff_time).toISOString().split('T')[0]
          if (!predictionsByDate.has(kickoffDate)) {
            predictionsByDate.set(kickoffDate, [])
          }
          predictionsByDate.get(kickoffDate)!.push(pred)
        })

        try {
          const newLogos: Record<string, string | null> = {}
          for (const [date, datePredictions] of predictionsByDate.entries()) {
            try {
              const response = await fetch(`/api/football/fixtures?from=${date}&to=${date}`)
              if (!response.ok) continue
              
              const fixturesData = await response.json()
              const fixtures = Array.isArray(fixturesData) ? fixturesData : (Array.isArray(fixturesData?.data) ? fixturesData.data : [])
              
              datePredictions.forEach((pred) => {
                const fixture = fixtures.find((f: any) => {
                  const homeMatch = f.match_hometeam_name?.toLowerCase() === pred.home_team.toLowerCase() ||
                                   f.match_hometeam_name?.toLowerCase().includes(pred.home_team.toLowerCase()) ||
                                   pred.home_team.toLowerCase().includes(f.match_hometeam_name?.toLowerCase() || '')
                  
                  const awayMatch = f.match_awayteam_name?.toLowerCase() === pred.away_team.toLowerCase() ||
                                   f.match_awayteam_name?.toLowerCase().includes(pred.away_team.toLowerCase()) ||
                                   pred.away_team.toLowerCase().includes(f.match_awayteam_name?.toLowerCase() || '')
                  
                  return homeMatch && awayMatch
                })
                
                if (fixture) {
                  if (fixture.team_home_badge) {
                    newLogos[pred.home_team] = fixture.team_home_badge
                  }
                  if (fixture.team_away_badge) {
                    newLogos[pred.away_team] = fixture.team_away_badge
                  }
                }
              })
            } catch (err) {
              console.error(`Error fetching fixtures for date ${date}:`, err)
            }
          }
          
          if (Object.keys(newLogos).length > 0) {
            setTeamLogos((latestLogos) => ({ ...latestLogos, ...newLogos }))
          }
        } catch (error) {
          console.error('Error fetching team logos:', error)
        }
      }

      setLoading(false)
    }

    fetchData()
  }, [dateType])

  const handleSubscribe = () => {
    if (!user) {
      router.push('/login')
    } else {
      router.push('/subscriptions')
    }
  }

  const getTeamLogo = (teamName: string): string | null => {
    return teamLogos[teamName] || null
  }

  return (
    <section className="py-8 lg:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-4 lg:mb-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 lg:gap-0">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1e40af] mb-1 lg:mb-2">Premium Predictions</h2>
            <p className="text-sm lg:text-base text-gray-600">Exclusive high-value predictions - Subscribe to unlock</p>
          </div>
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setDateType('previous')}
              className={`px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                dateType === 'previous'
                  ? 'bg-[#1e40af] text-white shadow-sm'
                  : 'text-gray-600 hover:text-[#1e40af] hover:bg-white'
              }`}
            >
              Previous
            </button>
            <button
              onClick={() => setDateType('today')}
              className={`px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                dateType === 'today'
                  ? 'bg-[#1e40af] text-white shadow-sm'
                  : 'text-gray-600 hover:text-[#1e40af] hover:bg-white'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setDateType('tomorrow')}
              className={`px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 rounded-md text-xs sm:text-sm font-medium transition-all ${
                dateType === 'tomorrow'
                  ? 'bg-[#1e40af] text-white shadow-sm'
                  : 'text-gray-600 hover:text-[#1e40af] hover:bg-white'
              }`}
            >
              Tomorrow
            </button>
          </div>
        </div>

        {loading ? (
          <>
            {/* Mobile Loading State */}
            <div className="lg:hidden space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-100 rounded-lg p-3 space-y-2 animate-pulse">
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-16 bg-gray-300 rounded" />
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-24 bg-gray-300 rounded" />
                      <div className="h-6 w-6 bg-gray-300 rounded-full" />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="h-3 w-20 bg-gray-300 rounded" />
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-24 bg-gray-300 rounded" />
                      <div className="h-6 w-6 bg-gray-300 rounded-full" />
                    </div>
                  </div>
                  <div className="bg-[#1e40af] text-white px-2 py-2 rounded grid grid-cols-5 gap-1 text-[10px] sm:text-xs font-semibold">
                    <div>Status</div>
                    <div className="text-center">Tip</div>
                    <div className="text-center">Score</div>
                    <div className="text-center">Odd</div>
                    <div className="text-center">Conf</div>
                  </div>
                  <div className="bg-gray-200 px-2 py-2 rounded grid grid-cols-5 gap-1 items-center">
                    <div className="h-4 w-12 bg-gray-300 rounded" />
                    <div className="h-4 w-10 bg-gray-300 rounded mx-auto" />
                    <div className="h-4 w-10 bg-gray-300 rounded mx-auto" />
                    <div className="h-4 w-10 bg-gray-300 rounded mx-auto" />
                    <div className="h-8 w-8 bg-gray-300 rounded-full mx-auto" />
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Loading State */}
            <div className="hidden lg:block space-y-0 border-2 border-gray-200 rounded-xl overflow-hidden bg-white shadow-lg">
              <div className="bg-gradient-to-r from-[#1e40af] to-[#1e3a8a] text-white px-6 py-4 grid grid-cols-12 gap-4 items-center font-bold text-sm">
                <div className="col-span-2">Time & League</div>
                <div className="col-span-4">Teams</div>
                <div className="col-span-1 text-center hidden sm:block">Score</div>
                <div className="col-span-1 text-center">Status</div>
                <div className="col-span-1 text-center">Tip</div>
                <div className="col-span-1 text-center hidden md:block">Odd</div>
                <div className="col-span-2 text-center hidden lg:block">Confidence</div>
              </div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="px-6 py-4 grid grid-cols-12 gap-4 items-center border-t animate-pulse">
                  <div className="col-span-2">
                    <div className="h-4 w-16 bg-gray-200 rounded" />
                    <div className="h-3 w-24 bg-gray-200 rounded mt-2" />
                  </div>
                  <div className="col-span-4 flex items-center gap-3">
                    <div className="h-6 w-6 bg-gray-200 rounded-full" />
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    <span className="text-gray-400">vs</span>
                    <div className="h-6 w-6 bg-gray-200 rounded-full" />
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                  </div>
                  <div className="col-span-1">
                    <div className="h-4 w-12 bg-gray-200 rounded mx-auto" />
                  </div>
                  <div className="col-span-1">
                    <div className="h-6 w-16 bg-gray-200 rounded mx-auto" />
                  </div>
                  <div className="col-span-1">
                    <div className="h-6 w-16 bg-gray-200 rounded mx-auto" />
                  </div>
                  <div className="col-span-1">
                    <div className="h-4 w-12 bg-gray-200 rounded mx-auto" />
                  </div>
                  <div className="col-span-2 flex justify-center">
                    <div className="h-12 w-12 bg-gray-200 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : predictions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No premium predictions available for this date.</p>
              </CardContent>
            </Card>
        ) : (
          <>
            {/* Mobile View */}
            <div className="lg:hidden space-y-3">
              {predictions.map((prediction) => (
                <div
                  key={prediction.id}
                  onClick={handleSubscribe}
                  className="bg-gray-100 rounded-lg p-3 space-y-2 cursor-pointer hover:bg-gray-200 transition-colors"
                >
                  {/* Top Row: Time and Home Team */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {formatTime(prediction.kickoff_time)}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{prediction.home_team}</span>
                      {getTeamLogo(prediction.home_team) ? (
                        <div className="relative w-6 h-6 flex-shrink-0">
                          <Image
                            src={getTeamLogo(prediction.home_team)!}
                            alt={prediction.home_team}
                            width={24}
                            height={24}
                            className="object-contain rounded-full"
                            unoptimized
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold">
                          {prediction.home_team.charAt(0)}
                        </div>
                      )}
                    </div>
          </div>

                  {/* Second Row: League and Away Team */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-600">{prediction.league}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{prediction.away_team}</span>
                      {getTeamLogo(prediction.away_team) ? (
                        <div className="relative w-6 h-6 flex-shrink-0">
                          <Image
                            src={getTeamLogo(prediction.away_team)!}
                            alt={prediction.away_team}
                            width={24}
                            height={24}
                            className="object-contain rounded-full"
                            unoptimized
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-bold">
                          {prediction.away_team.charAt(0)}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Header Bar */}
                  <div className="bg-[#1e40af] text-white px-2 py-2 rounded grid grid-cols-5 gap-1 text-[10px] sm:text-xs font-semibold">
                    <div className="text-center">Status</div>
                    <div className="text-center">Tip</div>
                    <div className="text-center">Score</div>
                    <div className="text-center">Odd</div>
                    <div className="text-center">Conf</div>
                  </div>

                  {/* Prediction Row */}
                  <div 
                    onClick={handleSubscribe}
                    className="bg-gray-200 px-2 py-2 rounded grid grid-cols-5 gap-1 items-center cursor-pointer hover:bg-gray-300 transition-colors"
                  >
                    <div className="flex items-center justify-center">
                      <Badge
                        variant={prediction.status === 'finished' ? 'default' : prediction.status === 'live' ? 'destructive' : 'outline'}
                        className="text-[10px] px-1.5 py-0.5"
                      >
                        {prediction.status === 'finished' ? 'FT' : prediction.status === 'live' ? 'Live' : 'NS'}
                      </Badge>
                    </div>
                    <div className="text-[10px] sm:text-xs font-medium text-gray-900 text-center truncate flex items-center justify-center gap-1">
                      <Lock className="h-4 w-4 text-[#f97316]" />
                    </div>
                    <div className="text-[10px] sm:text-xs font-semibold text-gray-900 text-center">
                      -
                    </div>
                    <div className="text-[10px] sm:text-xs font-semibold text-gray-900 text-center flex items-center justify-center gap-1">
                      <Lock className="h-4 w-4 text-[#f97316]" />
                    </div>
                    <div className="flex items-center justify-center">
                      {prediction.confidence ? (
                        <CircularProgress value={prediction.confidence} size={32} strokeWidth={3} />
                      ) : (
                        <Lock className="h-4 w-4 text-[#f97316]" />
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View */}
            <div className="hidden lg:block space-y-0 border-2 border-gray-200 rounded-xl overflow-hidden bg-white shadow-lg">
              {/* Header */}
              <div className="bg-gradient-to-r from-[#1e40af] to-[#1e3a8a] text-white px-3 sm:px-4 lg:px-6 py-3 lg:py-4 grid grid-cols-12 gap-2 lg:gap-4 items-center font-bold text-xs sm:text-sm shadow-md">
                <div className="col-span-2 lg:col-span-2">Time & League</div>
                <div className="col-span-4">Teams</div>
                <div className="col-span-1 text-center hidden sm:block">Score</div>
                <div className="col-span-1 text-center">Status</div>
                <div className="col-span-1 text-center">Tip</div>
                <div className="col-span-1 text-center hidden md:block">Odd</div>
                <div className="col-span-2 text-center hidden lg:block">Confidence</div>
              </div>

              {/* Predictions */}
              {predictions.map((prediction, index) => (
                <div
                  key={prediction.id}
                  onClick={handleSubscribe}
                  className={cn(
                    'px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-5 grid grid-cols-12 gap-2 lg:gap-4 items-center border-b border-gray-100 bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-green-50 hover:shadow-md transition-all duration-300 cursor-pointer transform hover:scale-[1.01] hover:border-l-4 hover:border-l-[#f97316]',
                    index === predictions.length - 1 && 'border-b-0',
                    index % 2 === 0 && 'bg-gray-50/50'
                  )}
                >
                  {/* Time & League */}
                  <div className="col-span-2 lg:col-span-2">
                    <div className="text-xs sm:text-sm font-medium text-gray-900">
                      {formatTime(prediction.kickoff_time)}
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5 lg:mt-1 truncate">{prediction.league}</div>
                  </div>

                  {/* Teams */}
                  <div className="col-span-4 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      {getTeamLogo(prediction.home_team) ? (
                        <div className="relative w-6 h-6 flex-shrink-0">
                          <Image
                            src={getTeamLogo(prediction.home_team)!}
                            alt={prediction.home_team}
                            width={24}
                            height={24}
                            className="object-contain"
                            unoptimized
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {prediction.home_team.charAt(0)}
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {prediction.home_team}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getTeamLogo(prediction.away_team) ? (
                        <div className="relative w-6 h-6 flex-shrink-0">
                          <Image
                            src={getTeamLogo(prediction.away_team)!}
                            alt={prediction.away_team}
                            width={24}
                            height={24}
                            className="object-contain"
                            unoptimized
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold flex-shrink-0">
                          {prediction.away_team.charAt(0)}
                        </div>
                      )}
                      <span className="text-sm font-medium text-gray-900 truncate">
                        {prediction.away_team}
                      </span>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="col-span-1 text-center hidden sm:block">
                    <span className="text-sm font-semibold text-gray-900">-</span>
                  </div>

                  {/* Status */}
                  <div className="col-span-1 text-center">
                    <Badge
                      variant={prediction.status === 'finished' ? 'default' : prediction.status === 'live' ? 'destructive' : 'outline'}
                      className="text-xs"
                    >
                      {prediction.status === 'finished' ? 'FT' : prediction.status === 'live' ? 'Live' : 'NS'}
                    </Badge>
                  </div>

                  {/* Tip with Lock */}
                  <div className="col-span-1 text-center">
                    <Lock className="h-5 w-5 text-[#f97316] mx-auto" />
                  </div>

                  {/* Odd with Lock */}
                  <div className="col-span-1 text-center hidden md:block">
                    <Lock className="h-5 w-5 text-[#f97316] mx-auto" />
                  </div>

                  {/* Confidence */}
                  <div className="col-span-2 flex justify-center hidden lg:flex">
                    {prediction.confidence ? (
                      <CircularProgress value={prediction.confidence} size={50} strokeWidth={5} />
                    ) : (
                      <Lock className="h-5 w-5 text-[#f97316]" />
                    )}
          </div>
        </div>
              ))}
            </div>

            {/* Subscribe CTA */}
            <div className="mt-6 text-center">
              <Button
                onClick={handleSubscribe}
                className="bg-gradient-to-r from-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#f97316] text-white font-bold px-8 py-3 rounded-lg text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                Subscribe to Unlock Premium Predictions
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  )
}

