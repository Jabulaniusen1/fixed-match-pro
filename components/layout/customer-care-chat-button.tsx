'use client'

import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function CustomerCareChatButton() {
  const handleClick = () => {
    window.open('https://leenkchat.vercel.app/32466905803', '_blank', 'noopener,noreferrer')
  }

  return (
    <Button
      onClick={handleClick}
      className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-[#1e3a8a] to-[#1e3a8a] hover:from-[#1e3a8a] hover:to-[#1e3a8a] border-2 border-white hover:scale-110 active:scale-95"
      aria-label="Customer Care Chat"
    >
      <MessageCircle className="h-6 w-6 text-white" />
    </Button>
  )
}
