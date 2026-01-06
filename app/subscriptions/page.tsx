'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PageLayout } from '@/components/layout/page-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Check } from 'lucide-react'
import { PlanWithPrice } from '@/types'
import { Combobox } from '@/components/ui/combobox'
import { getCurrencySymbol as getCurrencySymbolUtil, getCurrencyFromCountry } from '@/lib/utils/currency'

interface Country {
  name: string
  code: string
  cca3: string
}

export default function SubscriptionsPage() {
  const router = useRouter()
  const [plans, setPlans] = useState<PlanWithPrice[]>([])
  const [user, setUser] = useState<any>(null)
  const [selectedCountry, setSelectedCountry] = useState<string>('')
  const [countries, setCountries] = useState<{ value: string; label: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [loadingCountries, setLoadingCountries] = useState(true)

  // Fetch countries from API
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await fetch('/api/countries')
        if (!response.ok) throw new Error('Failed to fetch countries')
        
        const data: Country[] = await response.json()
        
        // Map to combobox format and add "Other" option
        const countryOptions = data.map((country) => ({
          value: country.name,
          label: country.name
        }))
        
        // Add "Other" option at the end
        countryOptions.push({ value: 'Other', label: 'Other' })
        
        setCountries(countryOptions)
        setLoadingCountries(false)
      } catch (error) {
        console.error('Error fetching countries:', error)
        // Fallback to basic list if API fails
        setCountries([
          { value: 'Nigeria', label: 'Nigeria' },
          { value: 'Ghana', label: 'Ghana' },
          { value: 'Kenya', label: 'Kenya' },
          { value: 'Other', label: 'Other' },
        ])
        setLoadingCountries(false)
      }
    }

    fetchCountries()
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()

      // Check user
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)

      // Fetch ALL active plans with ALL their prices from admin
      const { data: plansData } = await supabase
        .from('plans')
        .select(`
          *,
          plan_prices (*)
        `)
        .eq('is_active', true)
        .order('created_at')

      if (plansData) {
        const plansWithPrices: PlanWithPrice[] = plansData.map((plan: any) => {
          const prices = (plan.plan_prices || plan.prices || []).filter((p: any) => p !== null)
          return {
            ...plan,
            prices: prices
          }
        })
        setPlans(plansWithPrices)
      }

      setLoading(false)
    }

    fetchData()
  }, [])


  const handlePlanClick = (planSlug: string, durationDays: number) => {
    if (!user) {
      const checkoutUrl = `/checkout?plan=${planSlug}&duration=${durationDays}`
      router.push(`/login?returnUrl=${encodeURIComponent(checkoutUrl)}`)
    } else {
      router.push(`/checkout?plan=${planSlug}&duration=${durationDays}`)
    }
  }

  const getPriceForCountry = (plan: PlanWithPrice, durationDays: number) => {
    if (!plan.prices || plan.prices.length === 0 || !selectedCountry) return null

    // First, try to find exact country match
    const exactMatch = plan.prices.find(
      (p: any) => p.duration_days === durationDays && p.country === selectedCountry
    )
    if (exactMatch) return exactMatch

    // If Nigeria, look for Nigeria-specific price
    if (selectedCountry === 'Nigeria') {
      const nigeriaPrice = plan.prices.find(
        (p: any) => p.duration_days === durationDays && p.country === 'Nigeria'
      )
      if (nigeriaPrice) return nigeriaPrice
    }

    // For all other countries, look for USD prices (country = 'Other' or currency = 'USD')
    const usdPrice = plan.prices.find(
      (p: any) => p.duration_days === durationDays && (p.currency === 'USD' || p.country === 'Other')
    )
    if (usdPrice) return usdPrice

    // Fallback: try to find any price for this duration with matching currency
    const matchingCurrency = selectedCountry === 'Nigeria' ? 'NGN' : 'USD'
    const currencyPrice = plan.prices.find(
      (p: any) => p.duration_days === durationDays && p.currency === matchingCurrency
    )
    if (currencyPrice) return currencyPrice

    // Final fallback: any price for this duration
    return plan.prices.find(
      (p: any) => p.duration_days === durationDays
    )
  }

  // Get currency symbol from the selected price's currency field in the database
  const getCurrencySymbol = (selectedPrice: any) => {
    // First priority: Use currency code from database if available
    if (selectedPrice?.currency && typeof selectedPrice.currency === 'string' && selectedPrice.currency.trim()) {
      const symbol = getCurrencySymbolUtil(selectedPrice.currency.trim())
      if (symbol && symbol !== selectedPrice.currency) {
        return symbol
      }
      // If utility returns the code itself, it means it's not in the map, return it as-is
      return symbol
    }

    // Second priority: Infer currency from country name if currency not set
    if (selectedPrice?.country && typeof selectedPrice.country === 'string' && selectedPrice.country.trim()) {
      const countryCurrencyCode = getCurrencyFromCountry(selectedPrice.country.trim())
      if (countryCurrencyCode) {
        const symbol = getCurrencySymbolUtil(countryCurrencyCode)
        return symbol
      }
    }

    // Third priority: Use selected country to infer currency
    if (selectedCountry && typeof selectedCountry === 'string' && selectedCountry.trim()) {
      const userCountryCurrencyCode = getCurrencyFromCountry(selectedCountry.trim())
      if (userCountryCurrencyCode) {
        const symbol = getCurrencySymbolUtil(userCountryCurrencyCode)
        return symbol
      }
    }

    // Final fallback: Default to USD
    return '$'
  }
  const popularPlanSlug = 'daily-2-odds'

  if (loading || loadingCountries) {
    return (
      <PageLayout title="Subscriptions" subtitle="Choose your plan">
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">Loading...</div>
        </div>
      </PageLayout>
    )
  }

  return (
    <PageLayout title="VIP Packages" subtitle="Choose the perfect plan for your betting success">
      <div className="container mx-auto px-4 py-8 lg:py-12 max-w-7xl">
        {/* Country Selection - Required First Step */}
        <div className="mb-10">
          <Card className="border border-gray-200 bg-gradient-to-br from-[#1e3a8a]/5 to-white shadow-md">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold text-center text-gray-900">Select Your Country</CardTitle>
              <CardDescription className="text-center text-gray-600 mt-2">
                Choose your country to view personalized pricing and available plans
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2 pb-6">
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
                <label className="text-sm font-semibold text-gray-700 whitespace-nowrap">Country:</label>
                <div className="w-full sm:flex-1 max-w-md">
                  <Combobox
                    options={countries}
                    value={selectedCountry}
                    onValueChange={(value) => setSelectedCountry(value)}
                    placeholder="Search or select country..."
                    searchPlaceholder="Search countries..."
                    emptyMessage="No country found."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Show plans only if country is selected */}
        {!selectedCountry ? (
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="py-16 text-center">
              <div className="max-w-md mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Select Your Country
                </p>
                <p className="text-sm text-gray-500">
                  Please select a country above to view available plans and pricing.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Header Section */}
            <div className="text-center mb-10">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                Choose Your Plan
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Select the perfect package to unlock premium predictions and maximize your winning potential
              </p>
            </div>

            {/* Pricing Cards - Weekly and Monthly Side by Side */}
            <div className="mb-12">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {plans.slice(0, 4).map((plan, index) => {
              const weeklyPrice = getPriceForCountry(plan, 7)
              const monthlyPrice = getPriceForCountry(plan, 30)
              const isPopular = plan.slug === popularPlanSlug

              return (
                <div
                  key={plan.id}
                  className="relative"
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <span className="bg-gradient-to-r from-[#1e3a8a] to-[#0f172a] text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg">
                        MOST POPULAR
                      </span>
                    </div>
                  )}
                  <Card 
                    className={`h-full flex flex-col bg-white border transition-all duration-300 hover:shadow-lg ${
                      isPopular 
                        ? 'border-[#1e3a8a] border-2 shadow-lg scale-105' 
                        : 'border-gray-200 shadow-md hover:border-gray-300'
                    }`}
                  >
                    <CardHeader className={`pb-4 pt-6 px-6 ${isPopular ? 'bg-gradient-to-br from-[#1e3a8a]/5 to-white' : 'bg-white'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <CardTitle className="text-xl font-bold text-gray-900">
                          {plan.name}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="flex-1 flex flex-col px-6 pb-6 bg-white">
                      {/* Pricing - Weekly and Monthly Side by Side */}
                      <div className="mb-6">
                        <div className="grid grid-cols-2 gap-3 bg-gray-50 rounded-lg p-3">
                          {/* Weekly Pricing */}
                          <div className="text-center">
                            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Weekly</p>
                            {weeklyPrice ? (
                              <div>
                                <div className="flex items-baseline justify-center gap-1 mb-1">
                                  <span className="text-lg font-bold text-gray-900">{getCurrencySymbol(weeklyPrice)}</span>
                                  <span className="text-2xl font-bold text-gray-900">
                                    {(() => {
                                      const priceValue = typeof weeklyPrice.price === 'number' 
                                        ? weeklyPrice.price 
                                        : parseFloat(String(weeklyPrice.price || '0'))
                                      return priceValue.toLocaleString('en-US', { maximumFractionDigits: 0 })
                                    })()}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500">per week</p>
                              </div>
                            ) : (
                              <div className="text-xs text-gray-400 py-2">N/A</div>
                            )}
                          </div>

                          {/* Monthly Pricing */}
                          <div className="text-center border-l border-gray-200 pl-3">
                            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Monthly</p>
                            {monthlyPrice ? (
                              <div>
                                <div className="flex items-baseline justify-center gap-1 mb-1">
                                  <span className="text-lg font-bold text-gray-900">{getCurrencySymbol(monthlyPrice)}</span>
                                  <span className="text-2xl font-bold text-gray-900">
                                    {(() => {
                                      const priceValue = typeof monthlyPrice.price === 'number' 
                                        ? monthlyPrice.price 
                                        : parseFloat(String(monthlyPrice.price || '0'))
                                      return priceValue.toLocaleString('en-US', { maximumFractionDigits: 0 })
                                    })()}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500">per month</p>
                              </div>
                            ) : (
                              <div className="text-xs text-gray-400 py-2">N/A</div>
                            )}
                          </div>
                        </div>
                        {plan.requires_activation && (
                          <p className="text-xs text-gray-500 mt-3 text-center">* Activation fee may apply</p>
                        )}
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-6 leading-relaxed min-h-[3rem]">
                        {plan.description || 'Premium predictions for serious bettors.'}
                      </p>

                      {/* Features */}
                      <div className="mb-6 flex-1">
                        <h3 className="text-xs font-semibold text-gray-500 mb-3 uppercase tracking-wide">What's Included</h3>
                        {plan.benefits && plan.benefits.length > 0 && (
                          <ul className="space-y-2.5">
                            {plan.benefits.map((benefit, idx) => (
                              <li key={idx} className="flex items-start gap-2.5">
                                <div className="mt-0.5">
                                  <Check className="h-4 w-4 text-[#1e3a8a] flex-shrink-0" />
                                </div>
                                <span className="text-sm text-gray-700 leading-relaxed">{benefit}</span>
                              </li>
                            ))}
                            {plan.max_predictions_per_day && (
                              <li className="flex items-start gap-2.5">
                                <div className="mt-0.5">
                                  <Check className="h-4 w-4 text-[#1e3a8a] flex-shrink-0" />
                                </div>
                                <span className="text-sm text-gray-700 leading-relaxed">
                                  Up to {plan.max_predictions_per_day} predictions per day
                                </span>
                              </li>
                            )}
                          </ul>
                        )}
                      </div>

                      {/* CTA Buttons - Weekly and Monthly */}
                      <div className="space-y-2.5 mt-auto">
                        {weeklyPrice && (
                          <Button
                            className={`w-full font-semibold py-2.5 rounded-lg transition-all duration-200 text-sm ${
                              isPopular
                                ? 'bg-gray-800 hover:bg-gray-900 text-white shadow-md hover:shadow-lg'
                                : 'bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300'
                            }`}
                            onClick={() => handlePlanClick(plan.slug, 7)}
                          >
                            Get Weekly Plan
                          </Button>
                        )}
                        {monthlyPrice && (
                          <Button
                            className={`w-full font-semibold py-2.5 rounded-lg transition-all duration-200 text-sm ${
                              isPopular
                                ? 'bg-gradient-to-r from-[#1e3a8a] to-[#0f172a] hover:from-[#1e3a8a] hover:to-[#1e3a8a] text-white shadow-md hover:shadow-lg'
                                : 'bg-gradient-to-r from-[#1e3a8a] to-[#0f172a] hover:from-[#1e3a8a] hover:to-[#1e3a8a] text-white'
                            }`}
                            onClick={() => handlePlanClick(plan.slug, 30)}
                          >
                            Get Monthly Plan
                          </Button>
                        )}
                        {!weeklyPrice && !monthlyPrice && (
                          <Button
                            className="w-full font-semibold py-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-all duration-200 text-sm"
                            onClick={() => handlePlanClick(plan.slug, 30)}
                          >
                            Get Started
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )
                })}
              </div>
            </div>

            {/* Additional Plans if more than 4 */}
            {plans.length > 4 && (
          <div className="mt-16">
            <div className="text-center mb-10">
              <h3 className="text-2xl lg:text-3xl font-bold mb-2 text-gray-900">Additional Plans</h3>
              <p className="text-gray-600">Explore more options to suit your needs</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {plans.slice(4).map((plan) => {
                const weeklyPrice = getPriceForCountry(plan, 7)
                const monthlyPrice = getPriceForCountry(plan, 30)

                return (
                  <Card key={plan.id} className="h-full flex flex-col bg-white border border-gray-200 shadow-md hover:shadow-lg transition-all duration-300 hover:border-gray-300">
                    <CardHeader className="pb-4 pt-6 px-6 bg-white">
                      <CardTitle className="text-xl font-bold text-gray-900">
                        {plan.name}
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="flex-1 flex flex-col px-6 pb-6 bg-white">
                      {/* Pricing - Weekly and Monthly Side by Side */}
                      <div className="mb-6">
                        <div className="grid grid-cols-2 gap-3 bg-gray-50 rounded-lg p-3">
                          {/* Weekly Pricing */}
                          <div className="text-center">
                            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Weekly</p>
                            {weeklyPrice ? (
                              <div>
                                <div className="flex items-baseline justify-center gap-1 mb-1">
                                  <span className="text-lg font-bold text-gray-900">{getCurrencySymbol(weeklyPrice)}</span>
                                  <span className="text-2xl font-bold text-gray-900">
                                    {(() => {
                                      const priceValue = typeof weeklyPrice.price === 'number' 
                                        ? weeklyPrice.price 
                                        : parseFloat(String(weeklyPrice.price || '0'))
                                      return priceValue.toLocaleString('en-US', { maximumFractionDigits: 0 })
                                    })()}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500">per week</p>
                              </div>
                            ) : (
                              <div className="text-xs text-gray-400 py-2">N/A</div>
                            )}
                          </div>

                          {/* Monthly Pricing */}
                          <div className="text-center border-l border-gray-200 pl-3">
                            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">Monthly</p>
                            {monthlyPrice ? (
                              <div>
                                <div className="flex items-baseline justify-center gap-1 mb-1">
                                  <span className="text-lg font-bold text-gray-900">{getCurrencySymbol(monthlyPrice)}</span>
                                  <span className="text-2xl font-bold text-gray-900">
                                    {(() => {
                                      const priceValue = typeof monthlyPrice.price === 'number' 
                                        ? monthlyPrice.price 
                                        : parseFloat(String(monthlyPrice.price || '0'))
                                      return priceValue.toLocaleString('en-US', { maximumFractionDigits: 0 })
                                    })()}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500">per month</p>
                              </div>
                            ) : (
                              <div className="text-xs text-gray-400 py-2">N/A</div>
                            )}
                          </div>
                        </div>
                        {plan.requires_activation && (
                          <p className="text-xs text-gray-500 mt-3 text-center">* Activation fee may apply</p>
                        )}
                      </div>

                      <p className="text-sm text-gray-600 mb-6 leading-relaxed min-h-[3rem]">{plan.description}</p>

                      {plan.benefits && plan.benefits.length > 0 && (
                        <ul className="flex-1 space-y-2.5 mb-6">
                          {plan.benefits.slice(0, 3).map((benefit, idx) => (
                            <li key={idx} className="flex items-start gap-2.5">
                              <div className="mt-0.5">
                                <Check className="h-4 w-4 text-[#1e3a8a] flex-shrink-0" />
                              </div>
                              <span className="text-sm text-gray-700 leading-relaxed">{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      )}

                      {/* CTA Buttons - Weekly and Monthly */}
                      <div className="space-y-2.5 mt-auto">
                        {weeklyPrice && (
                          <Button
                            className="w-full font-semibold py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-900 border border-gray-300 rounded-lg transition-all duration-200 text-sm"
                            onClick={() => handlePlanClick(plan.slug, 7)}
                          >
                            Get Weekly Plan
                          </Button>
                        )}
                        {monthlyPrice && (
                          <Button
                            className="w-full font-semibold py-2.5 bg-gradient-to-r from-[#1e3a8a] to-[#0f172a] hover:from-[#1e3a8a] hover:to-[#1e3a8a] text-white rounded-lg transition-all duration-200 text-sm"
                            onClick={() => handlePlanClick(plan.slug, 30)}
                          >
                            Get Monthly Plan
                          </Button>
                        )}
                        {!weeklyPrice && !monthlyPrice && (
                          <Button
                            className="w-full font-semibold py-2.5 bg-gray-800 hover:bg-gray-900 text-white rounded-lg transition-all duration-200 text-sm"
                            onClick={() => handlePlanClick(plan.slug, 30)}
                          >
                            Get Started
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
              </div>
            </div>
          )}

          {/* Footer Note */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-sm text-gray-600 mb-2">
                All plans include 24/7 customer support and regular updates
              </p>
              <p className="text-xs text-gray-500">
                Need help choosing? Contact our support team for personalized recommendations
              </p>
            </div>
          </div>
        </>
        )}
      </div>
    </PageLayout>
  )
}

