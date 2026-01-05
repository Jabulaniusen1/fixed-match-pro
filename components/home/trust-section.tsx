'use client'

import { Trophy, Users, TrendingUp, Shield, Star } from 'lucide-react'

export function TrustSection() {
  return (
    <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1e3a8a] mb-4">
            Why Trust Fixed Match Pro?
          </h2>
          <p className="text-base lg:text-lg text-gray-600 max-w-3xl mx-auto">
            Join thousands of successful bettors who rely on our professional predictions
          </p>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-gray-100">
            <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] mb-4 mx-auto">
              <Trophy className="h-8 w-8 text-white" />
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#1e3a8a] mb-2">95%+</div>
              <div className="text-sm text-gray-600 font-medium">Accuracy Rate</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-gray-100">
            <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-[#22c55e] to-[#16a34a] mb-4 mx-auto">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#22c55e] mb-2">10K+</div>
              <div className="text-sm text-gray-600 font-medium">Active Users</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-gray-100">
            <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-[#f97316] to-[#ea580c] mb-4 mx-auto">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#f97316] mb-2">50K+</div>
              <div className="text-sm text-gray-600 font-medium">Predictions Delivered</div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border-2 border-gray-100">
            <div className="flex items-center justify-center w-16 h-16 rounded-xl bg-gradient-to-br from-[#8b5cf6] to-[#7c3aed] mb-4 mx-auto">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#8b5cf6] mb-2">24/7</div>
              <div className="text-sm text-gray-600 font-medium">Support Available</div>
            </div>
          </div>
        </div>

        {/* Trust Badges */}
        <div className="bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] rounded-2xl p-8 lg:p-12 text-white">
          <div className="text-center mb-8">
            <h3 className="text-2xl lg:text-3xl font-bold mb-4">Trusted & Verified</h3>
            <p className="text-white/90 max-w-2xl mx-auto">
              Our platform is built on transparency, accuracy, and proven results
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="flex items-center justify-center mb-3">
                <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                <Star className="h-6 w-6 text-yellow-400 fill-yellow-400" />
              </div>
              <div className="text-lg font-semibold">5.0 Rating</div>
              <div className="text-sm text-white/80">From 2,000+ Reviews</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">✓</div>
              <div className="text-lg font-semibold">Verified Predictions</div>
              <div className="text-sm text-white/80">All tips are verified</div>
            </div>
            
            <div className="text-center">
              <div className="text-3xl font-bold mb-2">🔒</div>
              <div className="text-lg font-semibold">Secure Platform</div>
              <div className="text-sm text-white/80">Your data is protected</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

