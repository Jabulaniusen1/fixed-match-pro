'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Send, Mail, Phone } from 'lucide-react'
import { Database } from '@/types/database'

interface SiteConfig {
  site_header?: string
  site_subheader?: string
  telegram_link?: string
  contact_email?: string
  whatsapp_number?: string
  social_links?: {
    facebook?: string
    twitter?: string
    instagram?: string
    youtube?: string
    linkedin?: string
  }
}

type ConfigItem = Pick<Database['public']['Tables']['site_config']['Row'], 'key' | 'value'>

export function Footer() {
  const [config, setConfig] = useState<SiteConfig>({})

  useEffect(() => {
    const fetchConfig = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('site_config')
        .select('key, value')
        .in('key', ['site_header', 'site_subheader', 'telegram_link', 'contact_email', 'whatsapp_number', 'whatsapp_numbers', 'social_links'])

      if (data) {
        const configData: SiteConfig = {}
        const configItems = data as ConfigItem[]
        configItems.forEach((item) => {
          if (!item.value) return
          
          if (item.key === 'social_links') {
            // Parse JSON string if needed
            try {
              configData[item.key as keyof SiteConfig] = typeof item.value === 'string' 
                ? JSON.parse(item.value) 
                : (item.value as any)
            } catch {
              configData[item.key as keyof SiteConfig] = item.value as any
            }
          } else if (item.key === 'whatsapp_number') {
            // Use single WhatsApp number
            const value = item.value
            if (value && typeof value === 'string') {
              configData.whatsapp_number = value
            }
          } else if (item.key === 'whatsapp_numbers') {
            // Legacy support: if whatsapp_number doesn't exist, try whatsapp_numbers (array)
            if (!configData.whatsapp_number) {
              try {
                const parsed = typeof item.value === 'string' 
                  ? JSON.parse(item.value) 
                  : item.value
                if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0] === 'string') {
                  configData.whatsapp_number = parsed[0] // Use first number from legacy array
                }
              } catch {
                if (Array.isArray(item.value) && item.value.length > 0 && typeof item.value[0] === 'string') {
                  configData.whatsapp_number = item.value[0]
                }
              }
            }
          } else {
            configData[item.key as keyof SiteConfig] = item.value as any
          }
        })
        setConfig(configData)
      }
    }

    fetchConfig()
  }, [])

  return (
    <footer className="bg-gradient-to-br from-[#1e3a8a] via-[#1e3a8a] to-[#0f172a] text-white border-t border-[#1e3a8a]/50">
      <div className="container mx-auto px-4 max-w-7xl py-8 lg:py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-8">
          {/* Brand Section */}
          <div className="sm:col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <Image
                src="/fixed-match-pro logo.png"
                alt={`${config.site_header || 'Fixed Match Pro'} Logo`}
                width={60}
                height={60}
                className="w-auto object-contain brightness-0 invert"
                priority
              />
            </Link>
            <p className="text-sm text-white/90 leading-relaxed mb-4">
              {config.site_subheader || 'Your trusted source for accurate football predictions and betting tips.'}
            </p>
            
            {/* Social Media Icons */}
            <div className="flex items-center gap-2">
              {config.social_links?.facebook && (
                <a
                  href={config.social_links.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300"
                  aria-label="Facebook"
                >
                  <Facebook className="h-4 w-4 text-white" />
                </a>
              )}
              {config.social_links?.twitter && (
                <a
                  href={config.social_links.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300"
                  aria-label="Twitter"
                >
                  <Twitter className="h-4 w-4 text-white" />
                </a>
              )}
              {config.social_links?.instagram && (
                <a
                  href={config.social_links.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300"
                  aria-label="Instagram"
                >
                  <Instagram className="h-4 w-4 text-white" />
                </a>
              )}
              {config.social_links?.youtube && (
                <a
                  href={config.social_links.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300"
                  aria-label="YouTube"
                >
                  <Youtube className="h-4 w-4 text-white" />
                </a>
              )}
              {config.social_links?.linkedin && (
                <a
                  href={config.social_links.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-4 w-4 text-white" />
                </a>
              )}
              {config.telegram_link && (
                <a
                  href={config.telegram_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-all duration-300"
                  aria-label="Telegram"
                >
                  <Send className="h-4 w-4 text-white" />
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold mb-3 text-white uppercase tracking-wide">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-white/80 hover:text-white transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/subscriptions" className="text-white/80 hover:text-white transition-colors">
                  VIP Packages
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-white/80 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-white/80 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/livescores" className="text-white/80 hover:text-white transition-colors">
                  Live Scores
                </Link>
              </li>
            </ul>
          </div>

          {/* Predictions */}
          <div>
            <h4 className="text-sm font-bold mb-3 text-white uppercase tracking-wide">Predictions</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/" className="text-white/80 hover:text-white transition-colors">
                  Free Tips
                </Link>
              </li>
              <li>
                <Link href="/subscriptions" className="text-white/80 hover:text-white transition-colors">
                  VIP Packages
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-white/80 hover:text-white transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Contact */}
          <div>
            <h4 className="text-sm font-bold mb-3 text-white uppercase tracking-wide">Legal & Support</h4>
            <ul className="space-y-2 text-sm mb-4">
              <li>
                <Link href="/terms" className="text-white/80 hover:text-white transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-white/80 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-white/80 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-white/80 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
            
            {/* Contact Info */}
            {(config.contact_email || config.whatsapp_number) && (
              <div className="pt-4 border-t border-white/10 space-y-2">
            {config.contact_email && (
                  <div className="flex items-center gap-2 text-white/80 text-xs">
                    <Mail className="h-3.5 w-3.5" />
                  <a href={`mailto:${config.contact_email}`} className="hover:text-white transition-colors">
                    {config.contact_email}
                  </a>
                </div>
                )}
                {config.whatsapp_number && (
                  <div className="flex items-center gap-2 text-white/80 text-xs">
                    <Phone className="h-3.5 w-3.5" />
                    <a 
                      href={`https://wa.me/${config.whatsapp_number.replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors"
                    >
                      {config.whatsapp_number}
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-white/10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-white/70 text-center sm:text-left">
              © {new Date().getFullYear()} {config.site_header || 'Fixed Match Pro'}. All rights reserved.
            </p>
            <p className="text-xs text-white/60">
              Crafted by{' '}
              <a 
                href="https://jabulaniusen.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-white transition-colors underline"
              >
                Jabulani Usen
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}