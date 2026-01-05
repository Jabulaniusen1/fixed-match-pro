'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { getStandings, TOP_LEAGUES, getLeagueName, Standing } from '@/lib/api-football'

export function LeagueTableSection() {
  const [standings, setStandings] = useState<Record<string, Standing[]>>({})
  const [loading, setLoading] = useState(true)
  const [activeLeague, setActiveLeague] = useState(TOP_LEAGUES.PREMIER_LEAGUE)

  useEffect(() => {
    const fetchStandings = async () => {
      setLoading(true)
      const leagues = Object.values(TOP_LEAGUES)
      const standingsData: Record<string, Standing[]> = {}

      try {
        await Promise.all(
          leagues.map(async (leagueId) => {
            try {
              const data = await getStandings(leagueId)
              // Ensure data is an array
              if (Array.isArray(data)) {
                standingsData[leagueId] = data
              } else if (data && typeof data === 'object') {
                // Try to extract array from response object
                const arrayData = Object.values(data).find((val: any) => Array.isArray(val))
                standingsData[leagueId] = Array.isArray(arrayData) ? arrayData : []
              } else {
                standingsData[leagueId] = []
              }
            } catch (error) {
              console.error(`Error fetching standings for ${leagueId}:`, error)
              standingsData[leagueId] = []
            }
          })
        )

        setStandings(standingsData)
      } catch (error) {
        console.error('Error fetching standings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStandings()
  }, [])

  const currentStandings = standings[activeLeague] || []

  return (
    <section className="py-8 lg:py-12 bg-gradient-to-b from-white via-gray-50/30 to-white">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="mb-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-gray-900">League Tables</h2>
          <p className="text-sm text-gray-600">Current standings for top European leagues</p>
        </div>
        
        {/* League Tabs - Horizontal Pills */}
        <div className="mb-6">
          <Tabs value={activeLeague} onValueChange={setActiveLeague}>
            <div className="flex flex-wrap justify-center gap-2">
              <TabsList className="bg-transparent p-0 h-auto">
                <TabsTrigger 
                  value={TOP_LEAGUES.PREMIER_LEAGUE} 
                  className="data-[state=active]:bg-[#1e3a8a] data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-gray-700 data-[state=inactive]:border data-[state=inactive]:border-gray-300 font-medium text-xs sm:text-sm px-4 py-2 rounded-full transition-all shadow-sm hover:shadow-md"
                >
                  Premier League
                </TabsTrigger>
                <TabsTrigger 
                  value={TOP_LEAGUES.LA_LIGA} 
                  className="data-[state=active]:bg-[#1e3a8a] data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-gray-700 data-[state=inactive]:border data-[state=inactive]:border-gray-300 font-medium text-xs sm:text-sm px-4 py-2 rounded-full transition-all shadow-sm hover:shadow-md"
                >
                  La Liga
                </TabsTrigger>
                <TabsTrigger 
                  value={TOP_LEAGUES.SERIE_A} 
                  className="data-[state=active]:bg-[#1e3a8a] data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-gray-700 data-[state=inactive]:border data-[state=inactive]:border-gray-300 font-medium text-xs sm:text-sm px-4 py-2 rounded-full transition-all shadow-sm hover:shadow-md"
                >
                  Serie A
                </TabsTrigger>
                <TabsTrigger 
                  value={TOP_LEAGUES.BUNDESLIGA} 
                  className="data-[state=active]:bg-[#1e3a8a] data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-gray-700 data-[state=inactive]:border data-[state=inactive]:border-gray-300 font-medium text-xs sm:text-sm px-4 py-2 rounded-full transition-all shadow-sm hover:shadow-md"
                >
                  Bundesliga
                </TabsTrigger>
                <TabsTrigger 
                  value={TOP_LEAGUES.LIGUE_1} 
                  className="data-[state=active]:bg-[#1e3a8a] data-[state=active]:text-white data-[state=inactive]:bg-white data-[state=inactive]:text-gray-700 data-[state=inactive]:border data-[state=inactive]:border-gray-300 font-medium text-xs sm:text-sm px-4 py-2 rounded-full transition-all shadow-sm hover:shadow-md"
                >
                  Ligue 1
                </TabsTrigger>
              </TabsList>
            </div>
            
            {Object.values(TOP_LEAGUES).map((leagueId) => (
              <TabsContent key={leagueId} value={leagueId} className="mt-6">
                {loading ? (
                  <div className="py-12 text-center text-gray-500">Loading standings...</div>
                ) : currentStandings.length === 0 ? (
                  <div className="py-12 text-center text-gray-500">
                    No standings available
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50 border-b border-gray-200">
                            <TableHead className="w-12 font-semibold text-gray-700 text-xs py-3">#</TableHead>
                            <TableHead className="font-semibold text-gray-700 text-xs py-3">Team</TableHead>
                            <TableHead className="text-center font-semibold text-gray-700 text-xs py-3">MP</TableHead>
                            <TableHead className="text-center font-semibold text-gray-700 text-xs py-3">W</TableHead>
                            <TableHead className="text-center font-semibold text-gray-700 text-xs py-3">D</TableHead>
                            <TableHead className="text-center font-semibold text-gray-700 text-xs py-3">L</TableHead>
                            <TableHead className="text-center font-semibold text-gray-700 text-xs hidden sm:table-cell py-3">GD</TableHead>
                            <TableHead className="text-center font-semibold text-gray-700 text-xs py-3">Pts</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {Array.isArray(currentStandings) && currentStandings.length > 0 ? (
                            currentStandings.slice(0, 20).map((team: Standing, index: number) => {
                              const goalsDiff = parseInt(team.overall_league_GF || '0') - parseInt(team.overall_league_GA || '0')
                              const isTopThree = parseInt(team.overall_league_position || '0') <= 3
                              return (
                                <TableRow 
                                  key={team.team_id}
                                  className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                                    isTopThree ? 'bg-gradient-to-r from-yellow-50/50 to-orange-50/50' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'
                                  }`}
                                >
                                  <TableCell className="font-bold text-gray-900 text-sm py-3">
                                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full ${
                                      isTopThree ? 'bg-[#1e3a8a] text-white' : 'bg-gray-200 text-gray-700'
                                    }`}>
                                      {team.overall_league_position}
                                    </span>
                                  </TableCell>
                                  <TableCell className="py-3">
                                    <div className="flex items-center gap-2">
                                      {team.team_badge && (
                                        <img src={team.team_badge} alt={team.team_name} className="w-6 h-6 object-contain" />
                                      )}
                                      <span className="font-medium text-sm text-gray-900 truncate">{team.team_name}</span>
                                    </div>
                                  </TableCell>
                                  <TableCell className="text-center text-sm text-gray-600 py-3">{team.overall_league_payed}</TableCell>
                                  <TableCell className="text-center font-semibold text-sm text-green-600 py-3">{team.overall_league_W}</TableCell>
                                  <TableCell className="text-center text-sm text-gray-600 py-3">{team.overall_league_D}</TableCell>
                                  <TableCell className="text-center font-semibold text-sm text-red-500 py-3">{team.overall_league_L}</TableCell>
                                  <TableCell className="text-center text-sm text-gray-700 hidden sm:table-cell py-3">
                                    <span className={goalsDiff > 0 ? 'text-green-600' : goalsDiff < 0 ? 'text-red-500' : 'text-gray-600'}>
                                      {goalsDiff > 0 ? '+' : ''}{goalsDiff}
                                    </span>
                                  </TableCell>
                                  <TableCell className="text-center font-bold text-base text-[#1e3a8a] py-3">{team.overall_league_PTS}</TableCell>
                                </TableRow>
                              )
                            })
                          ) : (
                            <TableRow>
                              <TableCell colSpan={8} className="text-center py-12 text-gray-500">
                                No standings data available
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  )
}

