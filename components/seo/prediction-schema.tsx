'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

interface PredictionSchemaProps {
  predictions?: Array<{
    home_team: string
    away_team: string
    league: string
    prediction_type: string
    odds: number
    kickoff_time: string
    confidence?: number
  }>
}

export function PredictionSchema({ predictions }: PredictionSchemaProps) {
  const pathname = usePathname()

  useEffect(() => {
    // Only add schema on home page or predictions pages
    if (pathname !== '/' && !pathname.includes('/predictions') && !pathname.includes('/match')) {
      return
    }

    // Create organization schema
    const organizationSchema = {
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Fixed Match Pro',
      url: 'https://fixedmatchpro.com',
      logo: 'https://fixedmatchpro.com/fixed-match-pro logo.png',
      description: 'Professional fixed match predictions and accurate betting tips',
      sameAs: [
        'https://t.me/fixedmatchpro',
      ],
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'Customer Service',
        email: 'support@fixedmatchpro.com',
      },
    }

    // Create website schema
    const websiteSchema = {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      name: 'Fixed Match Pro',
      url: 'https://fixedmatchpro.com',
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://fixedmatchpro.com/search?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    }

    // Create service schema for prediction service
    const serviceSchema = {
      '@context': 'https://schema.org',
      '@type': 'Service',
      serviceType: 'Football Prediction Service',
      provider: {
        '@type': 'Organization',
        name: 'Fixed Match Pro',
      },
      description: 'Professional fixed match predictions and accurate betting tips',
      areaServed: 'Worldwide',
      offers: {
        '@type': 'Offer',
        priceCurrency: 'NGN',
        availability: 'https://schema.org/InStock',
      },
    }

    // Add schemas to page
    const scripts = [
      { id: 'org-schema', schema: organizationSchema },
      { id: 'website-schema', schema: websiteSchema },
      { id: 'service-schema', schema: serviceSchema },
    ]

    scripts.forEach(({ id, schema }) => {
      // Remove existing script if present
      const existing = document.getElementById(id)
      if (existing) {
        existing.remove()
      }

      // Add new script
      const script = document.createElement('script')
      script.id = id
      script.type = 'application/ld+json'
      script.text = JSON.stringify(schema)
      document.head.appendChild(script)
    })

    // Cleanup on unmount
    return () => {
      scripts.forEach(({ id }) => {
        const script = document.getElementById(id)
        if (script) {
          script.remove()
        }
      })
    }
  }, [pathname, predictions])

  return null
}

