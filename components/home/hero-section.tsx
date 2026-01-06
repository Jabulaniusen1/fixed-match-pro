'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

// const heroImage = '/hero-pics/hero-bg1.jpg'

export function HeroSection() {
  const router = useRouter()
  const [headline, setHeadline] = useState('Welcome to Fixed Match Pro')
  const [subtext, setSubtext] = useState('Professional fixed match predictions and expert betting tips. Your trusted source for accurate football predictions.')
  const [telegramLink, setTelegramLink] = useState('https://t.me/FIXED_MATCHPRO')
  const [user, setUser] = useState<any>(null)
  const [accuracy, setAccuracy] = useState(0)
  const [users, setUsers] = useState(0)

  useEffect(() => {
    const fetchConfig = async () => {
      const supabase = createClient()
      
      // Fetch site config
      const { data: config } = await supabase
        .from('site_config')
        .select('key, value')
        .in('key', ['hero_headline', 'hero_subtext', 'telegram_link'])

      if (config && Array.isArray(config)) {
        config.forEach((item: { key: string; value: any }) => {
          if (item.key === 'hero_headline') setHeadline(item.value as string)
          if (item.key === 'hero_subtext') setSubtext(item.value as string)
          if (item.key === 'telegram_link') setTelegramLink(item.value as string)
        })
      }

      // Check user
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    fetchConfig()
  }, [])

  // Ease-in-out function
  const easeInOut = (t: number): number => {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t
  }

  // Count-up animation effect
  useEffect(() => {
    const duration = 3000 // 3 seconds
    const startTime = Date.now()
    const targetAccuracy = 95
    const targetUsers = 10000

    const animate = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const eased = easeInOut(progress)

      setAccuracy(Math.floor(eased * targetAccuracy))
      setUsers(Math.floor(eased * targetUsers))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    // Start animation after a small delay
    const timeout = setTimeout(() => {
      requestAnimationFrame(animate)
    }, 300)

    return () => clearTimeout(timeout)
  }, [])

  const handleSubscribe = () => {
    if (!user) {
      router.push('/login')
    } else {
      router.push('/subscriptions')
    }
  }

  return (
    <section className="relative min-h-[450px] sm:min-h-[550px] md:min-h-[600px] lg:min-h-[700px] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/heropic.jpg"
          alt="Football stadium background"
          fill
          className="object-cover object-center scale-105"
          priority
          quality={90}
        />
        {/* Gradient Overlay with Brand Colors */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a]/80 via-[#1e3a8a]/70 to-[#0f172a]/90" />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Floating Elements - Hidden on mobile, visible on larger screens */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none hidden md:block">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#1e3a8a]/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 sm:px-6 relative z-10 py-8 sm:py-12 md:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto">
          {/* Desktop: Two-column layout, Mobile: Single column centered */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Column - Main Content */}
            <div className="text-center lg:text-left">
              {/* Trust Indicators - Desktop: Left aligned, Mobile: Centered */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 md:gap-4 mb-6 sm:mb-8">
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                  <span className="text-xl md:text-2xl font-bold text-white">{accuracy}%+</span>
                  <span className="text-sm text-white/90 whitespace-nowrap">Accuracy</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                  <span className="text-xl md:text-2xl font-bold text-white">
                    {users >= 1000 ? `${(users / 1000).toFixed(users >= 10000 ? 0 : 1)}K+` : `${users}+`}
                  </span>
                  <span className="text-sm text-white/90 whitespace-nowrap">Users</span>
                </div>
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                  <span className="text-xl md:text-2xl font-bold text-white">24/7</span>
                  <span className="text-sm text-white/90 whitespace-nowrap">Support</span>
                </div>
              </div>

              {/* Main Headline */}
              <h1 className="mb-4 sm:mb-5 md:mb-6 lg:mb-8 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black text-white tracking-tight leading-[1.1] sm:leading-tight drop-shadow-2xl">
                {headline}
              </h1>
              
              {/* Subtext */}
              <p className="mb-8 sm:mb-10 md:mb-12 text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/95 leading-relaxed max-w-2xl mx-auto lg:mx-0 font-medium drop-shadow-lg">
                {subtext}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start items-stretch sm:items-center mb-8 sm:mb-10">
                <Button
                  size="lg"
                  onClick={handleSubscribe}
                  className="w-full sm:w-auto text-base md:text-lg lg:text-xl bg-gradient-to-r from-[#f97316] via-[#fb923c] to-[#ea580c] hover:from-[#ea580c] hover:via-[#f97316] hover:to-[#fb923c] text-white px-8 py-6 md:px-10 md:py-7 lg:px-12 lg:py-8 rounded-xl font-bold shadow-2xl hover:shadow-orange-500/50 transition-all duration-300 transform hover:scale-105 border-2 border-orange-400/30"
                >
                  Subscribe to VIP
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="w-full sm:w-auto text-base md:text-lg lg:text-xl bg-white/10 backdrop-blur-sm text-white border-2 border-white/40 hover:bg-white hover:text-[#1e3a8a] hover:border-white px-8 py-6 md:px-10 md:py-7 lg:px-12 lg:py-8 rounded-xl font-bold shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105"
                >
                  <a href={telegramLink} target="_blank" rel="noopener noreferrer">
                    Telegram Tips
                  </a>
                </Button>
              </div>

              {/* Additional Trust Elements */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 md:gap-6 text-sm md:text-base text-white/80">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#22c55e] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="whitespace-nowrap">Verified Predictions</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#22c55e] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="whitespace-nowrap">Expert Analysis</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-[#22c55e] flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="whitespace-nowrap">Secure Platform</span>
                </div>
              </div>
            </div>

            {/* Right Column - Stats/Features Card (Desktop only) */}
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-2xl">
                <h3 className="text-2xl font-bold text-white mb-6">Why Choose Us</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">High Accuracy Rate</h4>
                      <p className="text-white/80 text-sm leading-relaxed">Our expert analysis ensures 95%+ accuracy in predictions, giving you the edge you need.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">24/7 Support</h4>
                      <p className="text-white/80 text-sm leading-relaxed">Round-the-clock customer support to assist you whenever you need help.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-1">Real-time Updates</h4>
                      <p className="text-white/80 text-sm leading-relaxed">Get instant notifications and updates on all your predictions and matches.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

