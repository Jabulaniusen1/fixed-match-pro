'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle2, TrendingUp, Target, BarChart3, Clock, Zap } from 'lucide-react'

export function WhatWeOfferSection() {
  return (
    <section className="py-12 lg:py-16 bg-gradient-to-br from-[#1e3a8a] via-[#1e3a8a] to-[#0f172a] relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="text-center mb-8 lg:mb-10">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-3 leading-tight">
            What We Offer
          </h2>
          <p className="text-base lg:text-lg text-white/90 max-w-3xl mx-auto">
            Professional fixed match predictions and expert betting tips for consistent wins
          </p>
        </div>
          
        <div className="grid gap-4 md:gap-5 md:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
            <Card className="border border-white/20 bg-white/90 backdrop-blur-sm hover:shadow-lg hover:border-white/40 transition-all duration-300 rounded-xl">
              <CardHeader className="p-4 lg:p-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-100 to-green-200 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  </div>
                  <CardTitle className="text-base lg:text-lg font-bold text-gray-900">Free Daily Predictions</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 lg:p-5 pt-0">
                <p className="text-sm text-gray-600 leading-relaxed">
                  Test our accuracy with free tips from top global leagues before going VIP.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-white/20 bg-white/90 backdrop-blur-sm hover:shadow-lg hover:border-white/40 transition-all duration-300 rounded-xl">
              <CardHeader className="p-4 lg:p-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center flex-shrink-0">
                    <Target className="h-5 w-5 text-blue-600" />
                  </div>
                  <CardTitle className="text-base lg:text-lg font-bold text-gray-900">VIP Predictions</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 lg:p-5 pt-0">
                <p className="text-sm text-gray-600 leading-relaxed">
                  90% accuracy with advanced analytics, verified sources, and expert match reviews.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-white/20 bg-white/90 backdrop-blur-sm hover:shadow-lg hover:border-white/40 transition-all duration-300 rounded-xl">
              <CardHeader className="p-4 lg:p-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-5 w-5 text-purple-600" />
                  </div>
                  <CardTitle className="text-base lg:text-lg font-bold text-gray-900">Profit Multiplier</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 lg:p-5 pt-0">
                <p className="text-sm text-gray-600 leading-relaxed">
                  High-value predictions with odds 2.80-4.30+ and expert-curated accumulators.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-white/20 bg-white/90 backdrop-blur-sm hover:shadow-lg hover:border-white/40 transition-all duration-300 rounded-xl">
              <CardHeader className="p-4 lg:p-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center flex-shrink-0">
                    <BarChart3 className="h-5 w-5 text-orange-600" />
                  </div>
                  <CardTitle className="text-base lg:text-lg font-bold text-gray-900">Correct Score</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 lg:p-5 pt-0">
                <p className="text-sm text-gray-600 leading-relaxed">
                  Elite-tier plan with 95% accuracy for ultra-precise scoreline predictions.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-white/20 bg-white/90 backdrop-blur-sm hover:shadow-lg hover:border-white/40 transition-all duration-300 rounded-xl">
              <CardHeader className="p-4 lg:p-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-yellow-100 to-yellow-200 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-yellow-600" />
                  </div>
                  <CardTitle className="text-base lg:text-lg font-bold text-gray-900">Daily 2+ Odds</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 lg:p-5 pt-0">
                <p className="text-sm text-gray-600 leading-relaxed">
                  Safe, steady strategy with expert-reviewed daily 2+ odds delivered every morning.
                </p>
              </CardContent>
            </Card>

            <Card className="border border-white/20 bg-white/90 backdrop-blur-sm hover:shadow-lg hover:border-white/40 transition-all duration-300 rounded-xl">
              <CardHeader className="p-4 lg:p-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center flex-shrink-0">
                    <Zap className="h-5 w-5 text-red-600" />
                  </div>
                  <CardTitle className="text-base lg:text-lg font-bold text-gray-900">Live Scores</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-4 lg:p-5 pt-0">
                <p className="text-sm text-gray-600 leading-relaxed">
                  Real-time match stats, live tracking, and momentum insights for active games.
                </p>
              </CardContent>
            </Card>
          </div>
      </div>
    </section>
  )
}

