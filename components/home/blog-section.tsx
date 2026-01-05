'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BlogPost } from '@/types'
import Image from 'next/image'
import { getPlainTextExcerpt, stripHtmlTags } from '@/lib/utils/html'
import { format } from 'date-fns'

export function BlogSection() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPosts = async () => {
      const supabase = createClient()
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('published', true)
        .not('published_at', 'is', null)
        .order('published_at', { ascending: false })
        .limit(3)

      if (error) {
        console.error('Error fetching posts:', error)
      } else {
        setPosts(data || [])
      }

      setLoading(false)
    }

    fetchPosts()
  }, [])

  if (loading) {
    return (
      <section className="py-6 lg:py-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="mb-6 text-center">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-[#1e3a8a]">Latest Blog Posts</h2>
            <p className="text-sm lg:text-base text-gray-600">Stay updated with our latest insights and tips</p>
          </div>
          <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-40 bg-gray-200 rounded-t-lg" />
                <CardHeader className="p-4">
                  <div className="h-4 w-3/4 bg-gray-200 rounded" />
                  <div className="h-3 w-full bg-gray-200 rounded mt-2" />
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (posts.length === 0) {
    return null
  }

  return (
    <section className="py-6 lg:py-10">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-6 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 text-[#1e3a8a]">Latest Blog Posts</h2>
          <p className="text-sm lg:text-base text-gray-600 max-w-2xl mx-auto">Stay updated with our latest insights and tips</p>
        </div>
        <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mb-6">
          {posts.slice(0, 3).map((post) => {
            // Parse featured_image if it's JSON, otherwise use as URL
            let imageUrl = post.featured_image || ''
            if (imageUrl) {
              try {
                const parsed = JSON.parse(imageUrl)
                if (parsed.url) {
                  imageUrl = parsed.url
                }
              } catch {
                // Not JSON, use as-is
              }
            }
            
            return (
            <Card 
              key={post.id} 
              className="overflow-hidden border border-gray-200 hover:border-[#1e3a8a] hover:shadow-lg transition-all duration-300 rounded-xl bg-white"
            >
              {imageUrl && (
                <div className="relative h-40 w-full overflow-hidden">
                  <Image
                    src={imageUrl}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
              )}
              <CardHeader className="bg-white p-4">
                <CardTitle className="line-clamp-2 text-base lg:text-lg font-bold text-[#1e3a8a] mb-2">{post.title}</CardTitle>
                <CardDescription className="line-clamp-2 text-xs lg:text-sm text-gray-600 leading-snug">
                  {post.excerpt ? stripHtmlTags(post.excerpt) : getPlainTextExcerpt(post.content, 80)}
                </CardDescription>
                {post.published_at && (
                  <p className="text-xs text-gray-400 mt-2">
                    {format(new Date(post.published_at), 'MMM dd, yyyy')}
                  </p>
                )}
              </CardHeader>
              <CardContent className="bg-gray-50 p-4 pt-0">
                <Button 
                  asChild 
                  size="sm"
                  className="bg-gradient-to-r from-[#1e3a8a] to-[#0f172a] hover:from-[#0f172a] hover:to-[#1e3a8a] text-white font-semibold text-xs lg:text-sm w-full py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
                >
                  <Link href={`/blog/${post.id}`}>Read More</Link>
                </Button>
              </CardContent>
            </Card>
            )
          })}
        </div>
        
        {/* See More Button */}
        <div className="text-center">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="text-sm sm:text-base bg-white border border-[#1e3a8a] text-[#1e3a8a] hover:bg-[#1e3a8a] hover:text-white px-6 py-2.5 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300"
          >
            <Link href="/blog">See More Posts</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

