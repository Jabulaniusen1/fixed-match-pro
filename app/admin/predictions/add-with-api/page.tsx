'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { AdminLayout } from '@/components/admin/admin-layout'
import { toast } from 'sonner'
import { Database } from '@/types/database'

type UserProfile = Pick<Database['public']['Tables']['users']['Row'], 'is_admin'>

interface PreviewPrediction {
  plan_type: string
  home_team: string
  away_team: string
  league: string
  prediction_type: string
  odds: number
  confidence: number
  kickoff_time: string
  status: string
}

function AddPredictionWithAPIContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const planSlug = searchParams.get('plan') || 'profit-multiplier'
  
  const [loading, setLoading] = useState(false)
  const [updating, setUpdating] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [date, setDate] = useState(() => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  })
  const [minConfidence, setMinConfidence] = useState([70]) // Default minimum confidence: 70%
  const [previewPredictions, setPreviewPredictions] = useState<PreviewPrediction[]>([])
  const [selectedPredictions, setSelectedPredictions] = useState<Set<number>>(new Set())

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      const { data: userProfile } = await supabase
        .from('users')
        .select('is_admin')
        .eq('id', user.id)
        .single()

      const typedUserProfile = userProfile as UserProfile | null

      if (!typedUserProfile?.is_admin) {
        router.push('/dashboard')
        return
      }

      setCheckingAuth(false)
    }

    checkAuth()
  }, [router])

  // Map plan slug to plan_type
  const getPlanTypeFromSlug = (slug: string): string => {
    const mapping: Record<string, string> = {
      'profit-multiplier': 'profit_multiplier',
      'daily-2-odds': 'daily_2_odds',
      'standard': 'standard',
      'free': 'free'
    }
    return mapping[slug] || 'profit_multiplier'
  }

  const handleSyncPredictions = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setPreviewPredictions([])
    setSelectedPredictions(new Set())

    try {
      const planType = getPlanTypeFromSlug(planSlug)
      const response = await fetch('/api/football/sync-predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date,
          planType,
          minConfidence: minConfidence[0],
          preview: true, // Enable preview mode
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch predictions')
      }

      if (data.predictions && Array.isArray(data.predictions)) {
        setPreviewPredictions(data.predictions)
        // Select all by default
        setSelectedPredictions(new Set(data.predictions.map((_: any, index: number) => index)))
        
        const message = data.filtered > 0
          ? `Found ${data.predictions.length} predictions! ${data.filtered} predictions were filtered out (confidence < ${data.minConfidence}%)`
          : `Found ${data.predictions.length} predictions!`
        
        toast.success(message)
      } else {
        toast.info('No predictions found for the selected date')
      }
    } catch (error: any) {
      console.error('Error fetching predictions:', error)
      toast.error(error.message || 'Failed to fetch predictions')
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAll = () => {
    if (selectedPredictions.size === previewPredictions.length) {
      setSelectedPredictions(new Set())
    } else {
      setSelectedPredictions(new Set(previewPredictions.map((_, index) => index)))
    }
  }

  const handleToggleSelection = (index: number) => {
    const newSelected = new Set(selectedPredictions)
    if (newSelected.has(index)) {
      newSelected.delete(index)
    } else {
      newSelected.add(index)
    }
    setSelectedPredictions(newSelected)
  }

  const handleUpdateSelected = async () => {
    if (selectedPredictions.size === 0) {
      toast.error('Please select at least one prediction to update')
      return
    }

    setUpdating(true)

    try {
      const predictionsToInsert = Array.from(selectedPredictions).map(index => previewPredictions[index])
      
      const response = await fetch('/api/football/insert-predictions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          predictions: predictionsToInsert,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to insert predictions')
      }

      toast.success(`Successfully inserted ${data.synced || 0} predictions!`)
      router.push('/admin/predictions')
    } catch (error: any) {
      console.error('Error inserting predictions:', error)
      toast.error(error.message || 'Failed to insert predictions')
      setUpdating(false)
    }
  }

  if (checkingAuth) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold">Add Predictions with API</h1>
            <p className="text-sm lg:text-base text-muted-foreground">
              Sync predictions from API Football for {planSlug.replace('-', ' ')}
            </p>
          </div>
          <Button variant="outline" onClick={() => router.back()} size="sm" className="text-xs lg:text-sm">
            Cancel
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base lg:text-lg">Sync Predictions</CardTitle>
            <CardDescription className="text-xs lg:text-sm">
              Fetch predictions from API Football for the selected date
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSyncPredictions} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="date">Date *</Label>
                <Input
                  name="date"
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Select the date for which you want to sync predictions
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="confidence">Minimum Confidence Level</Label>
                    <span className="text-sm font-semibold text-[#1e40af]">{minConfidence[0]}%</span>
                  </div>
                  <div className="relative">
                    <input
                      id="confidence"
                      type="range"
                      min={50}
                      max={100}
                      step={5}
                      value={minConfidence[0]}
                      onChange={(e) => setMinConfidence([parseInt(e.target.value)])}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer range-slider"
                      style={{
                        background: `linear-gradient(to right, #1e40af 0%, #1e40af ${((minConfidence[0] - 50) / 50) * 100}%, #e5e7eb ${((minConfidence[0] - 50) / 50) * 100}%, #e5e7eb 100%)`
                      }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground px-1">
                    <span>50%</span>
                    <span>75%</span>
                    <span>100%</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Only predictions with confidence level of <strong>{minConfidence[0]}%</strong> or higher will be synced
                  </p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? 'Fetching Predictions...' : 'Fetch Predictions'}
                </Button>
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {previewPredictions.length > 0 && (
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base lg:text-lg">Preview Predictions</CardTitle>
                  <CardDescription className="text-xs lg:text-sm">
                    Review and select predictions to insert ({selectedPredictions.size} of {previewPredictions.length} selected)
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSelectAll}
                  >
                    {selectedPredictions.size === previewPredictions.length ? 'Deselect All' : 'Select All'}
                  </Button>
                  <Button
                    type="button"
                    onClick={handleUpdateSelected}
                    disabled={updating || selectedPredictions.size === 0}
                  >
                    {updating ? 'Updating...' : `Update Selected (${selectedPredictions.size})`}
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={selectedPredictions.size === previewPredictions.length && previewPredictions.length > 0}
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Match</TableHead>
                      <TableHead>League</TableHead>
                      <TableHead>Prediction</TableHead>
                      <TableHead>Odds</TableHead>
                      <TableHead>Confidence</TableHead>
                      <TableHead>Kickoff</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {previewPredictions.map((prediction, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Checkbox
                            checked={selectedPredictions.has(index)}
                            onCheckedChange={() => handleToggleSelection(index)}
                          />
                        </TableCell>
                        <TableCell className="font-medium">
                          {prediction.home_team} vs {prediction.away_team}
                        </TableCell>
                        <TableCell>{prediction.league}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{prediction.prediction_type}</Badge>
                        </TableCell>
                        <TableCell>{prediction.odds.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge variant={prediction.confidence >= 80 ? 'default' : 'secondary'}>
                            {prediction.confidence}%
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(prediction.kickoff_time).toLocaleString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  )
}

export default function AddPredictionWithAPIPage() {
  return (
    <Suspense fallback={
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-muted-foreground">Loading...</div>
        </div>
      </AdminLayout>
    }>
      <AddPredictionWithAPIContent />
    </Suspense>
  )
}

