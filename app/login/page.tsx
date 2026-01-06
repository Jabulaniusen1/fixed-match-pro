'use client'

import { useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Navbar } from '@/components/layout/navbar'

function LoginForm() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      toast.success('Logged in successfully!')
      
      // Redirect to returnUrl if provided, otherwise to dashboard
      const returnUrl = searchParams.get('returnUrl')
      window.location.href = returnUrl || '/dashboard'
    } catch (error: any) {
      toast.error(error.message || 'Failed to login')
    } finally {
      setLoading(false)
    }
  }

  return (
              <form onSubmit={handleLogin} className="p-8 space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 border border-gray-300 rounded-lg focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/20 transition-all bg-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11 border border-gray-300 rounded-lg focus:border-[#1e3a8a] focus:ring-2 focus:ring-[#1e3a8a]/20 transition-all bg-white pr-12"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#1e3a8a] transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-to-r from-[#1e3a8a] to-[#0f172a] hover:from-[#1e3a8a] hover:to-[#1e3a8a] text-white font-semibold text-base rounded-lg shadow-md hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? 'Logging in...' : 'Sign In'}
                </Button>

                <div className="text-center pt-2">
                  <p className="text-sm text-gray-600">
                    Don't have an account?{' '}
                    <Link href="/signup" className="text-[#1e3a8a] font-semibold hover:underline transition-colors">
                      Sign up
                    </Link>
                  </p>
                </div>
              </form>
  )
}

export default function LoginPage() {

  return (
    <div className="flex min-h-screen flex-col bg-gray-50">
      <Navbar />
      <div className="flex flex-1">
        {/* Left Side - Hero Image */}
        <div className="hidden lg:block lg:w-1/2 relative">
          <div className="absolute inset-0">
            <Image
              src="/heropic.jpg"
              alt="Football background"
              fill
              className="object-cover"
              priority
              quality={90}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-[#1e3a8a]/90 via-[#1e3a8a]/85 to-[#0f172a]/95" />
          </div>
          <div className="relative z-10 h-full flex flex-col items-center justify-center p-12 text-white">
            <div className="max-w-md">
              <h2 className="text-5xl font-bold mb-6 leading-tight">Welcome Back</h2>
              <p className="text-lg text-white/90 leading-relaxed mb-8">
                Access your personalized dashboard and continue your winning streak with our premium predictions.
              </p>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-white/90">Premium predictions</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-white/90">Real-time updates</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-white/90">Expert analysis</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center bg-gradient-to-br from-gray-50 to-white p-4 lg:p-12">
          <div className="w-full max-w-md">
            {/* Form Container */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-br from-[#1e3a8a] to-[#0f172a] p-8 text-center">
                <h1 className="text-3xl font-bold text-white mb-2">Sign In</h1>
                <p className="text-white/80 text-sm">Welcome back to Fixed Match Pro</p>
              </div>

              {/* Form */}
              <Suspense fallback={
                <div className="p-8 space-y-5">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">
                      Email Address
                    </Label>
                    <Input
                      type="email"
                      placeholder="you@example.com"
                      disabled
                      className="h-11 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">
                      Password
                    </Label>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      disabled
                      className="h-11 border border-gray-300 rounded-lg bg-gray-50"
                    />
                  </div>
                  <Button
                    type="button"
                    disabled
                    className="w-full h-11 bg-gray-300 text-gray-500 font-semibold text-base rounded-lg"
                  >
                    Loading...
                  </Button>
                </div>
              }>
                <LoginForm />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

