import { Suspense } from 'react'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { HeroSection } from '@/components/home/hero-section'
import { FreePredictionsSection } from '@/components/home/free-predictions-section'
import { WhatWeOfferSection } from '@/components/home/what-we-offer-section'
import { VIPWinningsSection } from '@/components/home/vip-winnings-section'
import { PremiumPredictionsSection } from '@/components/home/premium-predictions-section'
import { BlogSection } from '@/components/home/blog-section'
import { LeagueTableSection } from '@/components/home/league-table-section'
import { AboutSection } from '@/components/home/about-section'
import { TrustSection } from '@/components/home/trust-section'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import type { Metadata } from 'next'
import { PredictionSchema } from '@/components/seo/prediction-schema'

export const metadata: Metadata = {
  title: "Fixed Match Pro - Professional Fixed Match Predictions & Betting Tips",
  description: "Get professional fixed match predictions, accurate betting tips, and expert analysis. Access premium fixed match predictions, VIP packages, correct score tips, and live scores. Trusted by thousands of bettors worldwide.",
  keywords: [
    "fixed match predictions",
    "fixed match pro",
    "fixed predictions",
    "free football predictions",
    "football betting tips",
    "soccer predictions today",
    "daily football tips",
    "accurate betting predictions",
    "VIP football predictions",
    "correct score predictions",
    "football betting advice",
    "sports betting tips",
    "football analysis",
    "betting predictions",
    "soccer betting tips",
    "fixed match tips"
  ],
  openGraph: {
    title: "Fixed Match Pro - Professional Fixed Match Predictions & Betting Tips",
    description: "Get professional fixed match predictions, accurate betting tips, and expert analysis. Access premium fixed match predictions and VIP packages.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function HomePage() {
  return (
    <>
      <PredictionSchema />
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-col">
        {/* Hero Section */}
        <HeroSection />
        
        {/* Section Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        
        {/* Free Predictions Section */}
        <section className="py-16 lg:py-24 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-50/30 to-transparent pointer-events-none"></div>
          <div className="container mx-auto relative z-10">
            <Suspense fallback={<div className="py-8"><div className="container mx-auto px-4">Loading predictions...</div></div>}>
              <FreePredictionsSection />
            </Suspense>
          </div>
        </section>

        {/* Section Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

        {/* VIP Winnings Showcase */}
        <section className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white relative">
          <div className="container mx-auto ">
            <VIPWinningsSection />
          </div>
        </section>

        {/* Section Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

        {/* Premium Predictions */}
        <section className="py-16 lg:py-24 bg-white relative">
          <div className=" mx-auto">
            <PremiumPredictionsSection />
          </div>
        </section>

        {/* Section Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

        {/* What We Offer - Main Feature Section */}
        <WhatWeOfferSection />
        
        {/* Section Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

        {/* Trust & Social Proof Section */}
        <TrustSection />
        
        {/* Section Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
        
        {/* CTA Buttons Section */}
        <section className="py-20 lg:py-28 bg-gradient-to-br from-[#1e3a8a] via-[#1e3a8a] to-[#0f172a] relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
          <div className="container mx-auto px-4 max-w-5xl relative z-10">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                Ready to Start Winning?
              </h2>
              <p className="text-xl lg:text-2xl text-white/90 mb-4 leading-relaxed">
                Join thousands of successful bettors who trust Fixed Match Pro
              </p>
              <p className="text-lg lg:text-xl text-white/80 mb-10">
                Professional fixed match predictions with proven accuracy
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:gap-6 sm:flex-row sm:justify-center">
              <Button 
                size="lg" 
                asChild 
                className="text-base sm:text-lg lg:text-xl bg-gradient-to-r from-[#f97316] via-[#fb923c] to-[#ea580c] hover:from-[#ea580c] hover:via-[#f97316] hover:to-[#fb923c] text-white px-10 py-7 sm:px-12 sm:py-8 rounded-xl font-bold shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-105 border-2 border-orange-400/30"
              >
                <Link href="/subscriptions">Subscribe to VIP</Link>
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                asChild 
                className="text-base sm:text-lg lg:text-xl bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 hover:bg-white hover:text-[#1e3a8a] hover:border-white px-10 py-7 sm:px-12 sm:py-8 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
              >
                <a href="https://t.me/joinsurefixedwin" target="_blank" rel="noopener noreferrer">
                  Join Telegram
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Section Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

        {/* Blog Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-b from-white to-gray-50">
          <div className="container mx-auto px-4 max-w-7xl">
            <BlogSection />
          </div>
        </section>

        {/* Section Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

        {/* League Table */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <LeagueTableSection />
          </div>
        </section>

        {/* Section Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>

        {/* About Section */}
        <section className="py-16 lg:py-24 bg-gradient-to-b from-gray-50 to-white">
          <div className="container mx-auto px-4 max-w-7xl">
            <AboutSection />
          </div>
        </section>
      </main>
      <Footer />
    </div>
    </>
  )
}
