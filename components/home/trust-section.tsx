'use client'

import { Trophy, Users, TrendingUp, Shield, Star } from 'lucide-react'

export function TrustSection() {
  return (
    <section className="py-8 lg:py-12 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-6 lg:mb-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#1e3a8a] mb-2">
            Why Trust Fixed Match Pro?
          </h2>
          <p className="text-sm lg:text-base text-gray-600 max-w-3xl mx-auto">
            Join thousands of successful bettors who rely on our professional predictions
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 lg:p-5 shadow-md border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] mb-3 mx-auto">
              <Trophy className="h-6 w-6 text-white" />
            </div>
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-bold text-[#1e3a8a] mb-1">95%+</div>
              <div className="text-xs text-gray-600 font-medium">Accuracy Rate</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 lg:p-5 shadow-md border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-[#22c55e] to-[#16a34a] mb-3 mx-auto">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-bold text-[#22c55e] mb-1">10K+</div>
              <div className="text-xs text-gray-600 font-medium">Active Users</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 lg:p-5 shadow-md border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-[#f97316] to-[#ea580c] mb-3 mx-auto">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-bold text-[#f97316] mb-1">50K+</div>
              <div className="text-xs text-gray-600 font-medium">Predictions Delivered</div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 lg:p-5 shadow-md border border-gray-200">
            <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] mb-3 mx-auto">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div className="text-center">
              <div className="text-2xl lg:text-3xl font-bold text-[#8b5cf6] mb-1">24/7</div>
              <div className="text-xs text-gray-600 font-medium">Support Available</div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] rounded-xl p-6 lg:p-8 text-white">
          <div className="text-center mb-6">
            <h3 className="text-xl lg:text-2xl font-bold mb-2">Trusted & Verified</h3>
            <p className="text-sm text-white/90 max-w-2xl mx-auto">
              Our platform is built on transparency, accuracy, and proven results
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
              </div>
              <div className="text-base font-semibold">5.0 Rating</div>
              <div className="text-xs text-white/80">From 2,000+ Reviews</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">✓</div>
              <div className="text-base font-semibold">Verified Predictions</div>
              <div className="text-xs text-white/80">All tips are verified</div>
            </div>
            
            <div className="text-center">
              <div className="text-2xl font-bold mb-1">🔒</div>
              <div className="text-base font-semibold">Secure Platform</div>
              <div className="text-xs text-white/80">Your data is protected</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

