'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CircularProgress } from '@/components/ui/circular-progress'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { formatDate, formatTime, getDateRange } from '@/lib/utils/date'
import { getFixtures, getOdds, getStandings, getH2H, TOP_LEAGUES } from '@/lib/api-football'
import { Fixture, H2HData } from '@/lib/api-football'

interface MatchDetailProps {
  matchId: string
  predictionType?: string
  predictionData?: {
    odds: number
    prediction_type: string
    confidence: number
  } | null
}

interface H2HMatch {
  match_id: string
  match_date: string
  match_hometeam_name: string
  match_awayteam_name: string
  match_hometeam_score: string
  match_awayteam_score: string
  team_home_badge?: string
  team_away_badge?: string
  result?: 'W' | 'L' | 'D'
}

export function MatchDetail({ matchId, predictionType, predictionData }: MatchDetailProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [fixture, setFixture] = useState<Fixture | null>(null)
  const [odds, setOdds] = useState<any>(null)
  const [h2hMatches, setH2hMatches] = useState<H2HMatch[]>([])
  const [homeTeamMatches, setHomeTeamMatches] = useState<H2HMatch[]>([])
  const [awayTeamMatches, setAwayTeamMatches] = useState<H2HMatch[]>([])
  const [standings, setStandings] = useState<any[]>([])
  const [selectedPrediction, setSelectedPrediction] = useState<any>(null)

  useEffect(() => {
    const fetchMatchData = async () => {
      setLoading(true)
      try {
        // Fetch fixture details - search across multiple date ranges
        let match: Fixture | null = null
        
        // Try fetching for previous (up to 7 days back), today, and tomorrow
        const dateTypes: Array<'previous' | 'today' | 'tomorrow'> = ['previous', 'today', 'tomorrow']
        
        for (const dateType of dateTypes) {
          try {
            const { from, to } = getDateRange(dateType, undefined, dateType === 'previous' ? 7 : undefined)
            const fixtures = await getFixtures(from, undefined, to)
            
            if (Array.isArray(fixtures)) {
              const foundMatch = fixtures.find((f: any) => String(f.match_id) === String(matchId))
              if (foundMatch) {
                match = foundMatch as Fixture
                break
              }
            }
          } catch (error) {
            console.error(`Error fetching fixtures for ${dateType}:`, error)
            // Continue to next date range
          }
        }
        
        // If still not found, try searching the last 7 days individually
        if (!match) {
          for (let daysBack = 1; daysBack <= 7; daysBack++) {
            try {
              const { from, to } = getDateRange('previous', undefined, daysBack)
              const fixtures = await getFixtures(from, undefined, to)
              
              if (Array.isArray(fixtures)) {
                const foundMatch = fixtures.find((f: any) => String(f.match_id) === String(matchId))
                if (foundMatch) {
                  match = foundMatch as Fixture
                  break
                }
              }
            } catch (error) {
              console.error(`Error fetching fixtures for ${daysBack} days back:`, error)
            }
          }
        }

        if (match) {
          // Debug: Log match data to see what scores are available
          console.log('Match data:', {
            match_id: match.match_id,
            status: (match as any).match_status,
            live: (match as any).match_live,
            home_score: (match as any).match_hometeam_score,
            away_score: (match as any).match_awayteam_score,
            home_ft_score: (match as any).match_hometeam_ft_score,
            away_ft_score: (match as any).match_awayteam_ft_score,
          })
          setFixture(match as Fixture)

          // Fetch odds
          try {
            const oddsData = await getOdds(matchId)
            if (Array.isArray(oddsData) && oddsData.length > 0) {
              const matchOdds = oddsData[0] as any // API returns flat odds object
              setOdds(matchOdds)
              
              // Set selected prediction based on predictionType and predictionData
              if (predictionType || predictionData) {
                let tip = ''
                let odd = 0
                let prob = 0

                // Use database prediction data if available (has stored odds and confidence)
                if (predictionData) {
                  tip = predictionData.prediction_type
                  odd = parseFloat(predictionData.odds.toString())
                  prob = predictionData.confidence
                } else if (predictionType && matchOdds) {
                  // Match prediction type with API odds
                  const normalizedType = predictionType.toLowerCase().trim()
                  
                  if ((normalizedType === 'home win' || normalizedType.includes('home')) && matchOdds.odd_1) {
                    tip = 'Home Win'
                    odd = parseFloat(matchOdds.odd_1)
                  } else if ((normalizedType === 'away win' || normalizedType.includes('away')) && matchOdds.odd_2) {
                    tip = 'Away Win'
                    odd = parseFloat(matchOdds.odd_2)
                  } else if ((normalizedType === 'over 1.5' || normalizedType.includes('1.5')) && matchOdds['o+1.5']) {
                    tip = 'Over 1.5'
                    odd = parseFloat(matchOdds['o+1.5'])
                  } else if ((normalizedType === 'over 2.5' || normalizedType.includes('2.5')) && matchOdds['o+2.5']) {
                    tip = 'Over 2.5'
                    odd = parseFloat(matchOdds['o+2.5'])
                  } else if ((normalizedType === 'btts' || normalizedType.includes('btts') || normalizedType.includes('gg')) && matchOdds.bts_yes) {
                    tip = 'BTTS'
                    odd = parseFloat(matchOdds.bts_yes)
                  } else if ((normalizedType === 'double chance' || normalizedType.includes('double')) && matchOdds.odd_1x) {
                    tip = 'Double Chance'
                    odd = parseFloat(matchOdds.odd_1x)
                  } else if (normalizedType === 'draw' && matchOdds.odd_x) {
                    tip = 'Draw'
                    odd = parseFloat(matchOdds.odd_x)
                  }

                  // Calculate probability if we found a match
                  if (odd > 0) {
                    prob = Math.min(95, Math.max(60, 100 - (odd - 1) * 20))
                  }
                }

                if (tip && odd > 0) {
                  setSelectedPrediction({ tip, odd, prob })
                }
              }
            }
          } catch (oddsError) {
            console.error('Error fetching odds:', oddsError)
            // If API fails but we have prediction data, still show the prediction
            if (predictionData) {
              const tip = predictionData.prediction_type
              const odd = parseFloat(predictionData.odds.toString())
              const prob = predictionData.confidence
              setSelectedPrediction({ tip, odd, prob })
            }
          }

          // Fetch H2H data
          const homeTeamId = (match as any).match_hometeam_id
          const awayTeamId = (match as any).match_awayteam_id
          const leagueId = (match as any).league_id

          if (homeTeamId && awayTeamId) {
            try {
              const h2hData = await getH2H(homeTeamId, awayTeamId)
              if (h2hData && typeof h2hData === 'object') {
                // H2H matches
                if (Array.isArray(h2hData.firstTeam_VS_secondTeam)) {
                  setH2hMatches(h2hData.firstTeam_VS_secondTeam.slice(0, 10))
                }
                // Home team recent matches
                if (Array.isArray(h2hData.firstTeam_lastResults)) {
                  setHomeTeamMatches(h2hData.firstTeam_lastResults.slice(0, 5))
                }
                // Away team recent matches
                if (Array.isArray(h2hData.secondTeam_lastResults)) {
                  setAwayTeamMatches(h2hData.secondTeam_lastResults.slice(0, 5))
                }
              }
            } catch (h2hError) {
              console.error('Error fetching H2H data:', h2hError)
            }
          }

          // Fetch standings
          if (leagueId) {
            try {
              const leagueStandings = await getStandings(leagueId)
              if (Array.isArray(leagueStandings)) {
                setStandings(leagueStandings)
              }
            } catch (standingsError) {
              console.error('Error fetching standings:', standingsError)
            }
          }
        }
      } catch (error) {
        console.error('Error fetching match data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchMatchData()
  }, [matchId, predictionType])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-64 bg-gray-200 rounded" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  if (!fixture) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Button onClick={() => router.back()} variant="outline" className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Match not found</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const homeTeam = (fixture as any).match_hometeam_name
  const awayTeam = (fixture as any).match_awayteam_name
  const homeLogo = (fixture as any).team_home_badge
  const awayLogo = (fixture as any).team_away_badge
  const league = (fixture as any).league_name
  const matchDate = (fixture as any).match_date
  const matchTime = (fixture as any).match_time

  // Get last 5 results for teams
  const getLast5Results = (matches: H2HMatch[], teamId: string) => {
    return matches
      .slice(0, 5)
      .map((match: any) => {
        const isHomeTeam = match.match_hometeam_id === teamId
        const homeScore = parseInt(match.match_hometeam_score || '0')
        const awayScore = parseInt(match.match_awayteam_score || '0')

        if (homeScore > awayScore) {
          return isHomeTeam ? 'W' : 'L'
        } else if (awayScore > homeScore) {
          return isHomeTeam ? 'L' : 'W'
        } else {
          return 'D'
        }
      })
      .reverse()
  }

  const homeTeamId = (fixture as any).match_hometeam_id
  const awayTeamId = (fixture as any).match_awayteam_id
  const homeLast5 = getLast5Results(homeTeamMatches, homeTeamId)
  const awayLast5 = getLast5Results(awayTeamMatches, awayTeamId)

  return (
    <div className="container mx-auto px-4 max-w-6xl py-6 lg:py-8">
      <Button onClick={() => router.back()} variant="outline" size="sm" className="mb-4 text-sm h-9">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      {/* Match Header */}
      <Card className="mb-6 shadow-md border border-gray-200 rounded-xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-[#1e3a8a] via-[#1e3a8a] to-[#0f172a] text-white py-4 px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div>
              <CardTitle className="text-lg sm:text-xl font-bold mb-1">{league}</CardTitle>
              <div className="text-xs sm:text-sm text-white/90">
                {formatDate(new Date(`${matchDate} ${matchTime || '00:00'}`))} • {matchTime || '00:00'}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-5 px-5 pb-5">
          {/* Prediction Banner */}
          {selectedPrediction && (
            <div className="mb-5 bg-gradient-to-r from-[#f97316] to-[#ea580c] text-white px-4 py-3 rounded-lg shadow-md">
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">Tip:</span>
                  <Badge className="bg-white text-[#f97316] font-bold text-sm px-3 py-1">
                    {selectedPrediction.tip}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">Odd:</span>
                  <span className="font-bold text-lg">{selectedPrediction.odd.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm">Prob:</span>
                  <div className="flex items-center gap-2">
                    <CircularProgress value={selectedPrediction.prob} size={36} strokeWidth={4} />
                    <span className="font-bold text-lg">{selectedPrediction.prob}%</span>
                  </div>
                </div>
              </div>
            </div>
          )}

            {/* Teams */}
            <div className="flex items-center justify-between mb-5 gap-4">
              <div className="flex-1 text-center">
                <div className="flex justify-center mb-2">
                  {homeLogo ? (
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                      <Image
                        src={homeLogo}
                        alt={homeTeam}
                        width={80}
                        height={80}
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-2xl sm:text-3xl font-bold">
                      {homeTeam.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="font-bold text-sm sm:text-base mb-2 text-gray-900 truncate px-2">{homeTeam}</div>
                <div className="flex justify-center gap-1">
                  {homeLast5.map((result, idx) => (
                    <div
                      key={idx}
                      className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        result === 'W'
                          ? 'bg-green-500 text-white'
                          : result === 'L'
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-400 text-white'
                      }`}
                    >
                      {result}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mx-4 sm:mx-6 flex flex-col items-center justify-center flex-shrink-0">
                {(() => {
                  const matchStatus = ((fixture as any)?.match_status || '').toString().trim()
                  const isLive = (fixture as any)?.match_live === '1'
                  const isFinished = matchStatus === 'Finished' || 
                                   matchStatus === 'FT' || 
                                   matchStatus === 'Match Finished' ||
                                   matchStatus.toLowerCase().includes('finished')
                  
                  // For finished matches, prefer FT scores, fallback to regular scores
                  let homeScore = ''
                  let awayScore = ''
                  
                  if (isFinished) {
                    // Check FT scores first (for finished matches)
                    homeScore = ((fixture as any)?.match_hometeam_ft_score || 
                                (fixture as any)?.match_hometeam_score || '').toString().trim()
                    awayScore = ((fixture as any)?.match_awayteam_ft_score || 
                                (fixture as any)?.match_awayteam_score || '').toString().trim()
                  } else {
                    // For live or upcoming matches, use regular scores
                    homeScore = ((fixture as any)?.match_hometeam_score || '').toString().trim()
                    awayScore = ((fixture as any)?.match_awayteam_score || '').toString().trim()
                  }
                  
                  // Clean up scores - remove null/undefined strings
                  homeScore = homeScore === 'null' || homeScore === 'undefined' ? '' : homeScore
                  awayScore = awayScore === 'null' || awayScore === 'undefined' ? '' : awayScore
                  
                  // Check if we have valid scores (non-empty and numeric)
                  const hasScores = homeScore !== '' && awayScore !== '' && 
                                   !isNaN(Number(homeScore)) && !isNaN(Number(awayScore))
                  
                  if (hasScores && (isFinished || isLive)) {
                    return (
                      <div className="flex flex-col items-center gap-2">
                        <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900">
                          {homeScore} - {awayScore}
                        </div>
                        {isLive && (
                          <Badge className="bg-red-500 text-white animate-pulse text-xs px-2 py-0.5">
                            LIVE
                          </Badge>
                        )}
                        {isFinished && !isLive && (
                          <Badge variant="secondary" className="bg-gray-500 text-white text-xs px-2 py-0.5">
                            FT
                          </Badge>
                        )}
                      </div>
                    )
                  }
                  return (
                    <div className="text-xl sm:text-2xl font-bold text-gray-400">VS</div>
                  )
                })()}
              </div>

              <div className="flex-1 text-center">
                <div className="flex justify-center mb-2">
                  {awayLogo ? (
                    <div className="relative w-16 h-16 sm:w-20 sm:h-20">
                      <Image
                        src={awayLogo}
                        alt={awayTeam}
                        width={80}
                        height={80}
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-2xl sm:text-3xl font-bold">
                      {awayTeam.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="font-bold text-sm sm:text-base mb-2 text-gray-900 truncate px-2">{awayTeam}</div>
                <div className="flex justify-center gap-1">
                  {awayLast5.map((result, idx) => (
                    <div
                      key={idx}
                      className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                        result === 'W'
                          ? 'bg-green-500 text-white'
                          : result === 'L'
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-400 text-white'
                      }`}
                    >
                      {result}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Betting Odds */}
            {odds && (
              <div className="grid grid-cols-3 gap-3 mt-5 pt-5 border-t border-gray-200">
                <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                  <div className="text-xs text-gray-600 mb-1 font-medium">Home</div>
                  <div className="text-xl sm:text-2xl font-bold text-[#1e3a8a]">{odds.odd_1 || 'N/A'}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                  <div className="text-xs text-gray-600 mb-1 font-medium">Draw</div>
                  <div className="text-xl sm:text-2xl font-bold text-gray-700">{odds.odd_x || 'N/A'}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200">
                  <div className="text-xs text-gray-600 mb-1 font-medium">Away</div>
                  <div className="text-xl sm:text-2xl font-bold text-[#1e3a8a]">{odds.odd_2 || 'N/A'}</div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Head to Head History */}
        {h2hMatches.length > 0 && (
          <Card className="mb-5 shadow-md border border-gray-200 rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-[#1e3a8a] via-[#1e3a8a] to-[#0f172a] text-white py-3 px-5">
              <CardTitle className="text-base sm:text-lg font-bold">Head to Head History</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 px-4 pb-4">
              <div className="space-y-2">
                {h2hMatches.map((match: any, index: number) => {
                  const homeScore = parseInt(match.match_hometeam_score || '0')
                  const awayScore = parseInt(match.match_awayteam_score || '0')
                  const isHomeWin = homeScore > awayScore
                  const isAwayWin = awayScore > homeScore

                  return (
                    <div
                      key={match.match_id}
                      className={`flex items-center gap-3 py-2.5 px-3 rounded-lg border border-gray-200 ${
                        index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      } hover:bg-blue-50/50 transition-colors`}
                    >
                      <div className="text-xs text-gray-500 w-20 flex-shrink-0">
                        {formatDate(new Date(match.match_date))}
                      </div>
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">{match.match_hometeam_name}</span>
                        {match.team_home_badge && (
                          <div className="relative w-5 h-5 flex-shrink-0">
                            <Image
                              src={match.team_home_badge}
                              alt={match.match_hometeam_name}
                              width={20}
                              height={20}
                              className="object-contain"
                              unoptimized
                            />
                          </div>
                        )}
                      </div>
                      <span className="font-bold text-sm text-gray-900 px-2 flex-shrink-0">
                        {match.match_hometeam_score} - {match.match_awayteam_score}
                      </span>
                      <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                        {match.team_away_badge && (
                          <div className="relative w-5 h-5 flex-shrink-0">
                            <Image
                              src={match.team_away_badge}
                              alt={match.match_awayteam_name}
                              width={20}
                              height={20}
                              className="object-contain"
                              unoptimized
                            />
                          </div>
                        )}
                        <span className="text-xs sm:text-sm font-medium text-gray-900 truncate text-right">{match.match_awayteam_name}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Team Recent Matches */}
        <div className="grid md:grid-cols-2 gap-4 mb-5">
          {homeTeamMatches.length > 0 && (
            <Card className="shadow-md border border-gray-200 rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#1e3a8a] via-[#1e3a8a] to-[#0f172a] text-white py-3 px-5">
                <CardTitle className="text-sm sm:text-base font-bold truncate">{homeTeam} - Last 5</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 px-4 pb-4">
                <div className="space-y-2">
                  {homeTeamMatches.slice(0, 5).map((match: any, index: number) => {
                    const isHomeTeam = match.match_hometeam_id === homeTeamId
                    const homeScore = parseInt(match.match_hometeam_score || '0')
                    const awayScore = parseInt(match.match_awayteam_score || '0')
                    let result: 'W' | 'L' | 'D' = 'D'
                    if (homeScore > awayScore) {
                      result = isHomeTeam ? 'W' : 'L'
                    } else if (awayScore > homeScore) {
                      result = isHomeTeam ? 'L' : 'W'
                    }

                    return (
                      <div
                        key={match.match_id}
                        className={`flex items-center gap-3 py-2.5 px-3 rounded-lg border border-gray-200 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        } hover:bg-blue-50/50 transition-colors`}
                      >
                        <div className="text-xs text-gray-500 w-20 flex-shrink-0">
                          {formatDate(new Date(match.match_date))}
                        </div>
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">{match.match_hometeam_name}</span>
                          {match.team_home_badge && (
                            <div className="relative w-5 h-5 flex-shrink-0">
                              <Image
                                src={match.team_home_badge}
                                alt={match.match_hometeam_name}
                                width={20}
                                height={20}
                                className="object-contain"
                                unoptimized
                              />
                            </div>
                          )}
                        </div>
                        <span className="font-bold text-sm text-gray-900 px-2 flex-shrink-0">
                          {match.match_hometeam_score} - {match.match_awayteam_score}
                        </span>
                        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                          {match.team_away_badge && (
                            <div className="relative w-5 h-5 flex-shrink-0">
                              <Image
                                src={match.team_away_badge}
                                alt={match.match_awayteam_name}
                                width={20}
                                height={20}
                                className="object-contain"
                                unoptimized
                              />
                            </div>
                          )}
                          <span className="text-xs sm:text-sm font-medium text-gray-900 truncate text-right">{match.match_awayteam_name}</span>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                            result === 'W'
                              ? 'bg-green-500 text-white'
                              : result === 'L'
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-400 text-white'
                          }`}
                        >
                          {result}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {awayTeamMatches.length > 0 && (
            <Card className="shadow-md border border-gray-200 rounded-xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-[#1e3a8a] via-[#1e3a8a] to-[#0f172a] text-white py-3 px-5">
                <CardTitle className="text-sm sm:text-base font-bold truncate">{awayTeam} - Last 5</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 px-4 pb-4">
                <div className="space-y-2">
                  {awayTeamMatches.slice(0, 5).map((match: any, index: number) => {
                    const isHomeTeam = match.match_hometeam_id === awayTeamId
                    const homeScore = parseInt(match.match_hometeam_score || '0')
                    const awayScore = parseInt(match.match_awayteam_score || '0')
                    let result: 'W' | 'L' | 'D' = 'D'
                    if (homeScore > awayScore) {
                      result = isHomeTeam ? 'W' : 'L'
                    } else if (awayScore > homeScore) {
                      result = isHomeTeam ? 'L' : 'W'
                    }

                    return (
                      <div
                        key={match.match_id}
                        className={`flex items-center gap-3 py-2.5 px-3 rounded-lg border border-gray-200 ${
                          index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                        } hover:bg-blue-50/50 transition-colors`}
                      >
                        <div className="text-xs text-gray-500 w-20 flex-shrink-0">
                          {formatDate(new Date(match.match_date))}
                        </div>
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">{match.match_hometeam_name}</span>
                          {match.team_home_badge && (
                            <div className="relative w-5 h-5 flex-shrink-0">
                              <Image
                                src={match.team_home_badge}
                                alt={match.match_hometeam_name}
                                width={20}
                                height={20}
                                className="object-contain"
                                unoptimized
                              />
                            </div>
                          )}
                        </div>
                        <span className="font-bold text-sm text-gray-900 px-2 flex-shrink-0">
                          {match.match_hometeam_score} - {match.match_awayteam_score}
                        </span>
                        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                          {match.team_away_badge && (
                            <div className="relative w-5 h-5 flex-shrink-0">
                              <Image
                                src={match.team_away_badge}
                                alt={match.match_awayteam_name}
                                width={20}
                                height={20}
                                className="object-contain"
                                unoptimized
                              />
                            </div>
                          )}
                          <span className="text-xs sm:text-sm font-medium text-gray-900 truncate text-right">{match.match_awayteam_name}</span>
                        </div>
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                            result === 'W'
                              ? 'bg-green-500 text-white'
                              : result === 'L'
                              ? 'bg-red-500 text-white'
                              : 'bg-gray-400 text-white'
                          }`}
                        >
                          {result}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* League Standings */}
        {standings.length > 0 && (
          <Card className="shadow-md border border-gray-200 rounded-xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-[#1e3a8a] via-[#1e3a8a] to-[#0f172a] text-white py-3 px-5">
              <CardTitle className="text-base sm:text-lg font-bold">{league} Standings</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 px-4 pb-4">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[500px]">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-2.5 px-3 text-xs font-bold text-gray-700">P</th>
                      <th className="text-left py-2.5 px-3 text-xs font-bold text-gray-700">Team</th>
                      <th className="text-center py-2.5 px-3 text-xs font-bold text-gray-700">M</th>
                      <th className="text-center py-2.5 px-3 text-xs font-bold text-gray-700">W</th>
                      <th className="text-center py-2.5 px-3 text-xs font-bold text-gray-700">GD</th>
                      <th className="text-center py-2.5 px-3 text-xs font-bold text-gray-700">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {standings.map((team: any, idx: number) => {
                      const isHighlighted =
                        team.team_id === homeTeamId ||
                        team.team_id === awayTeamId
                      const goalsDiff =
                        parseInt(team.overall_league_GF || '0') -
                        parseInt(team.overall_league_GA || '0')

                      return (
                        <tr
                          key={team.team_id}
                          className={`border-b border-gray-100 hover:bg-blue-50/50 transition-colors ${
                            isHighlighted ? 'bg-orange-50 font-semibold' : ''
                          } ${idx % 2 === 0 && !isHighlighted ? 'bg-gray-50/50' : ''}`}
                        >
                          <td className="py-2.5 px-3 font-medium text-xs">{team.overall_league_position}</td>
                          <td className="py-2.5 px-3 text-xs truncate max-w-[150px] sm:max-w-none">{team.team_name}</td>
                          <td className="py-2.5 px-3 text-center text-xs">{team.overall_league_payed}</td>
                          <td className="py-2.5 px-3 text-center text-xs text-green-600 font-semibold">{team.overall_league_W}</td>
                          <td className="py-2.5 px-3 text-center text-xs">{goalsDiff > 0 ? '+' : ''}{goalsDiff}</td>
                          <td className="py-2.5 px-3 text-center font-bold text-[#1e3a8a] text-xs">{team.overall_league_PTS}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
    </div>
  )
}

