'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronDown, User, ArrowRight, Menu, X } from 'lucide-react'

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [siteHeader, setSiteHeader] = useState('Fixed Match Pro')
  const [siteSubheader, setSiteSubheader] = useState('Professional fixed match predictions and expert betting tips')
  const [adLinks, setAdLinks] = useState<Array<{ id: string; title: string; url: string; description: string | null }>>([])

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (authUser) {
        // Fetch user profile from users table to get avatar_url and other profile data
        const { data: profile } = await supabase
          .from('users')
          .select('avatar_url, full_name, email')
          .eq('id', authUser.id)
          .single()
        
        // Merge auth user with profile data
        setUser({
          ...authUser,
          avatar_url: (profile as any)?.avatar_url || null,
          full_name: (profile as any)?.full_name || null,
        })
      } else {
        setUser(null)
      }
      
      setLoading(false)
    }
    checkUser()
  }, [pathname])

  useEffect(() => {
    const fetchConfig = async () => {
      const supabase = createClient()
      const { data: config } = await supabase
        .from('site_config')
        .select('key, value')
        .in('key', ['site_header', 'site_subheader'])

      if (config && Array.isArray(config)) {
        config.forEach((item: { key: string; value: any }) => {
          if (item.key === 'site_header' && item.value) setSiteHeader(item.value)
          if (item.key === 'site_subheader' && item.value) setSiteSubheader(item.value)
        })
      }
    }
    fetchConfig()
  }, [])

  useEffect(() => {
    const fetchAdLinks = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('ad_links')
        .select('id, title, url, description')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (data) {
        setAdLinks(data)
      }
    }
    fetchAdLinks()
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [mobileMenuOpen])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <>
    <nav className="sticky top-0 z-[100] bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 max-w-full overflow-x-hidden">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center h-12 lg:h-16">
            <Image
              src="/fixed-match-pro logo.png"
              alt={`${siteHeader} Logo`}
              width={100}
              height={60}  
              className="h-full w-auto object-contain"
              priority
            />
          </Link>

          {/* Navigation Links */}
          <div className="hidden lg:flex items-center gap-1">
            <Link
              href="/"
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                pathname === '/' 
                  ? 'text-[#1e3a8a] bg-[#1e3a8a]/10' 
                  : 'text-gray-700 hover:text-[#1e3a8a] hover:bg-gray-100'
              }`}
            >
              Home
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger className={`flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-lg transition-all focus:outline-none ${
                pathname?.includes('/dashboard/predictions') && !pathname?.includes('plan=free')
                  ? 'text-[#1e3a8a] bg-[#1e3a8a]/10'
                  : 'text-gray-700 hover:text-[#1e3a8a] hover:bg-gray-100'
              }`}>
                Premium Tips
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border-gray-200 shadow-lg rounded-xl mt-2 p-2 min-w-[200px]">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/predictions?plan=standard" className="text-gray-900 hover:bg-[#1e3a8a]/10 rounded-lg px-3 py-2">Standard Package</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/predictions?plan=daily-2-odds" className="text-gray-900 hover:bg-[#1e3a8a]/10 rounded-lg px-3 py-2">Daily 2 Odds</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/predictions?plan=profit-multiplier" className="text-gray-900 hover:bg-[#1e3a8a]/10 rounded-lg px-3 py-2">Profit Multiplier</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/predictions?plan=correct-score" className="text-gray-900 hover:bg-[#1e3a8a]/10 rounded-lg px-3 py-2">Correct Score</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger className={`flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-lg transition-all focus:outline-none ${
                pathname?.includes('plan=free')
                  ? 'text-[#1e3a8a] bg-[#1e3a8a]/10'
                  : 'text-gray-700 hover:text-[#1e3a8a] hover:bg-gray-100'
              }`}>
                Free Tips
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border-gray-200 shadow-lg rounded-xl mt-2 p-2 min-w-[200px] max-h-[400px] overflow-y-auto">
                <DropdownMenuItem asChild>
                  <Link href="/" className="text-gray-900 hover:bg-[#1e3a8a]/10 rounded-lg px-3 py-2">Free Tips</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/predictions?plan=free" className="text-gray-900 hover:bg-[#1e3a8a]/10 rounded-lg px-3 py-2">All Tips</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/predictions?plan=free&type=super-single" className="text-gray-900 hover:bg-[#1e3a8a]/10 rounded-lg px-3 py-2">Super Single</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/predictions?plan=free&type=double-chance" className="text-gray-900 hover:bg-[#1e3a8a]/10 rounded-lg px-3 py-2">Double Chance</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/predictions?plan=free&type=home-win" className="text-gray-900 hover:bg-[#1e3a8a]/10 rounded-lg px-3 py-2">Home Win</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/predictions?plan=free&type=away-win" className="text-gray-900 hover:bg-[#1e3a8a]/10 rounded-lg px-3 py-2">Away Win</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/predictions?plan=free&type=1.5-goals" className="text-gray-900 hover:bg-[#1e3a8a]/10 rounded-lg px-3 py-2">1.5 Goals</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/predictions?plan=free&type=2.5-goals" className="text-gray-900 hover:bg-[#1e3a8a]/10 rounded-lg px-3 py-2">2.5 Goals</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/predictions?plan=free&type=btts" className="text-gray-900 hover:bg-[#1e3a8a]/10 rounded-lg px-3 py-2">BTTS/GG</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <Link
              href="/subscriptions"
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                pathname === '/subscriptions' 
                  ? 'text-[#1e3a8a] bg-[#1e3a8a]/10' 
                  : 'text-gray-700 hover:text-[#1e3a8a] hover:bg-gray-100'
              }`}
            >
              VIP Packages
            </Link>

            <Link
              href="/livescores"
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                pathname === '/livescores' 
                  ? 'text-[#1e3a8a] bg-[#1e3a8a]/10' 
                  : 'text-gray-700 hover:text-[#1e3a8a] hover:bg-gray-100'
              }`}
            >
              Livescores
            </Link>

            <Link
              href="/blog"
              className={`px-4 py-2 text-sm font-semibold rounded-lg transition-all ${
                pathname === '/blog' 
                  ? 'text-[#1e3a8a] bg-[#1e3a8a]/10' 
                  : 'text-gray-700 hover:text-[#1e3a8a] hover:bg-gray-100'
              }`}
            >
              Blog
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger className={`flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-lg transition-all focus:outline-none ${
                pathname === '/faq' || pathname === '/about' || pathname === '/terms' || pathname === '/privacy'
                  ? 'text-[#1e3a8a] bg-[#1e3a8a]/10'
                  : 'text-gray-700 hover:text-[#1e3a8a] hover:bg-gray-100'
              }`}>
                More
                <ChevronDown className="h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border-gray-200 shadow-lg rounded-xl mt-2 p-2 min-w-[200px]">
                <DropdownMenuItem asChild>
                  <Link href="/faq" className="text-gray-900 hover:bg-[#1e3a8a]/10 rounded-lg px-3 py-2">FAQ</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/about" className="text-gray-900 hover:bg-[#1e3a8a]/10 rounded-lg px-3 py-2">About Us</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/terms" className="text-gray-900 hover:bg-[#1e3a8a]/10 rounded-lg px-3 py-2">Terms & Conditions</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/privacy" className="text-gray-900 hover:bg-[#1e3a8a]/10 rounded-lg px-3 py-2">Privacy Policy</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {adLinks.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-1 px-4 py-2 text-sm font-semibold rounded-lg transition-all focus:outline-none text-gray-700 hover:text-[#1e3a8a] hover:bg-gray-100">
                  Links
                  <ChevronDown className="h-4 w-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border-gray-200 shadow-lg rounded-xl mt-2 p-2 min-w-[200px]">
                  {adLinks.map((link) => (
                    <DropdownMenuItem key={link.id} asChild>
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-900 hover:bg-[#1e3a8a]/10 rounded-lg px-3 py-2"
                      >
                        {link.title}
                      </a>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

          </div>

          {/* Right Side Buttons */}
          <div className="flex items-center gap-2 lg:gap-3">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-[#1e3a8a] hover:bg-gray-100 rounded-lg transition-colors"
          >
            {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>

            {/* Desktop Auth Buttons */}
            <div className="hidden lg:flex items-center gap-2">
            {loading ? (
                <div className="h-9 w-9 animate-pulse rounded-full bg-gray-200" />
            ) : user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:bg-gray-100">
                      <Avatar className="h-9 w-9 border-2 border-gray-200">
                      { user?.avatar_url ? <AvatarImage src={user?.avatar_url} alt={user.email} /> : 
                        <AvatarFallback className="bg-[#1e3a8a] text-white text-sm">{user.email?.charAt(0).toUpperCase()}</AvatarFallback> }
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 bg-white border-gray-200 shadow-lg rounded-xl mt-2 p-2" align="end" forceMount>
                    <div className="flex items-center gap-2 p-2 mb-1">
                      <div className="flex flex-col space-y-0.5 leading-none">
                        <p className="font-semibold text-sm text-gray-900 truncate">{user.email}</p>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="bg-gray-200 my-1" />
                    <DropdownMenuItem asChild className="text-gray-900 hover:bg-[#1e3a8a]/10 rounded-lg px-3 py-2">
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                    <DropdownMenuItem asChild className="text-gray-900 hover:bg-[#1e3a8a]/10 rounded-lg px-3 py-2">
                    <Link href="/dashboard/settings">Settings</Link>
                  </DropdownMenuItem>
                    <DropdownMenuSeparator className="bg-gray-200 my-1" />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600 hover:bg-red-50 rounded-lg px-3 py-2">Log out</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/signup">
                  <Button 
                    variant="outline" 
                      size="sm"
                      className="border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400 bg-transparent rounded-lg font-semibold"
                  >
                      <User className="h-4 w-4 mr-1.5" />
                    Register
                  </Button>
                </Link>
                <Link href="/login">
                  <Button 
                      size="sm"
                      className="bg-[#1e3a8a] hover:bg-[#0f172a] text-white rounded-lg font-semibold shadow-md hover:shadow-lg transition-all"
                  >
                    Login
                      <ArrowRight className="h-4 w-4 ml-1.5" />
                  </Button>
                </Link>
              </>
            )}
            </div>
          </div>
        </div>
      </div>
    </nav>

    {/* Mobile Menu Overlay */}
    {mobileMenuOpen && (
      <div 
        className="fixed inset-0 bg-black/50 z-[9998] lg:hidden transition-opacity duration-300"
        onClick={() => setMobileMenuOpen(false)}
      />
    )}

    {/* Mobile Menu */}
    <div
      className={`lg:hidden fixed top-0 right-0 h-full w-[85vw] max-w-sm bg-white shadow-2xl z-[9999] transform transition-transform duration-300 ease-in-out overflow-y-auto ${
        mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
          <div className="flex flex-col h-full">
            {/* Mobile Menu Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-[#1e3a8a] to-[#0f172a]">
              <Link href="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                <Image
                  src="/fixed-match-pro logo.png"
                  alt={`${siteHeader} Logo`}
                  width={30}
                  height={30}
                  className="w-auto object-contain brightness-0 invert"
                  priority
                />
              </Link>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="text-white hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-white/10"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {/* Mobile Menu Content */}
            <div className="flex-1 overflow-y-auto py-4 px-4 overflow-x-hidden">
              <div className="flex flex-col gap-1 w-full">
                <Link 
                  href="/" 
                  className={`px-4 py-3 rounded-lg transition-colors w-full ${
                    pathname === '/' 
                      ? 'bg-[#1e3a8a]/10 text-[#1e3a8a] font-medium' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-[#1e3a8a]'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  href="/subscriptions" 
                  className={`px-4 py-3 rounded-lg transition-colors w-full ${
                    pathname === '/subscriptions' 
                      ? 'bg-purple-100 text-purple-600 font-medium' 
                      : 'text-purple-600 hover:bg-purple-50 hover:text-purple-700'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  VIP Packages
                </Link>
                <Link 
                  href="/dashboard/predictions?plan=standard" 
                  className="px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-[#1e3a8a] transition-colors w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Standard Package
                </Link>
                <Link 
                  href="/dashboard/predictions?plan=daily-2-odds" 
                  className="px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-[#1e3a8a] transition-colors w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Daily 2 Odds
                </Link>
                <Link 
                  href="/dashboard/predictions?plan=profit-multiplier" 
                  className="px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-[#1e3a8a] transition-colors w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profit Multiplier
                </Link>
                <Link 
                  href="/dashboard/predictions?plan=correct-score" 
                  className="px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-[#1e3a8a] transition-colors w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Correct Score
                </Link>
                <Link 
                  href="/livescores" 
                  className={`px-4 py-3 rounded-lg transition-colors w-full ${
                    pathname === '/livescores' 
                      ? 'bg-blue-100 text-blue-600 font-medium' 
                      : 'text-blue-600 hover:bg-blue-50 hover:text-blue-700'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Livescores
                </Link>
                <Link 
                  href="/blog" 
                  className={`px-4 py-3 rounded-lg transition-colors w-full ${
                    pathname === '/blog' 
                      ? 'bg-[#1e3a8a]/10 text-[#1e3a8a] font-medium' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-[#1e3a8a]'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Blog
                </Link>
                <Link 
                  href="/faq" 
                  className="px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-[#1e3a8a] transition-colors w-full"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  FAQ
                </Link>
                <Link 
                  href="/contact" 
                  className={`px-4 py-3 rounded-lg transition-colors w-full ${
                    pathname === '/contact' 
                      ? 'bg-[#1e3a8a]/10 text-[#1e3a8a] font-medium' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-[#1e3a8a]'
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact Us
                </Link>
              </div>
              {adLinks.length > 0 && (
                  <>
                    <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase">Links</div>
                    {adLinks.map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-[#1e3a8a] transition-colors w-full"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {link.title}
                      </a>
                    ))}
                  </>
                )}

              {/* User Section */}
              {loading ? (
                <div className="mt-4 px-4">
                  <div className="h-10 w-full animate-pulse rounded-lg bg-gray-200" />
                </div>
              ) : user ? (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="px-4 mb-4">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        {user?.avatar_url ? (
                          <AvatarImage src={user.avatar_url} alt={user.email} />
                        ) : (
                        <AvatarFallback className="bg-[#1e3a8a] text-white">{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{user.email}</p>
                      </div>
                    </div>
                  </div>
                  <Link 
                    href="/dashboard" 
                    className="block w-full px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-[#1e3a8a] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <Link 
                    href="/dashboard/settings" 
                    className="block w-full px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-[#1e3a8a] transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Settings
                  </Link>
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false)
                      handleLogout()
                    }}
                    className="w-full text-left px-4 py-3 rounded-lg text-gray-600 hover:bg-gray-100 hover:text-red-600 transition-colors"
                  >
                    Log out
                  </button>
                </div>
              ) : (
                <div className="mt-6 pt-6 border-t border-gray-200 px-4 space-y-2 flex flex-col gap-2 w-full">
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="w-full">
                    <Button 
                      variant="outline" 
                      className="w-full border-pink-500 text-pink-500 hover:bg-pink-500 hover:text-white bg-transparent rounded-lg"
                    >
                      <User className="h-4 w-4 mr-2" />
                      Register
                    </Button>
                  </Link>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="w-full">
                    <Button 
                      className="w-full bg-[#1e3a8a] hover:bg-[#0f172a] text-white rounded-lg"
                    >
                      <ArrowRight className="h-4 w-4 mr-2" />
                      Login
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
    </>
  )
}

