'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Send, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import { formatDistanceToNow } from 'date-fns'

interface Message {
  id: string
  user_id: string
  sender_id: string
  content: string
  read: boolean
  created_at: string
  sender?: {
    id: string
    full_name: string | null
    email: string
    avatar_url: string | null
    is_admin: boolean
  }
}

export function UserChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [user, setUser] = useState<any>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    const loadUserAndMessages = async () => {
      const supabase = createClient()
      const { data: { user: authUser } } = await supabase.auth.getUser()
      
      if (!authUser) {
        toast.error('Please log in to use chat')
        return
      }

      setUser(authUser)

      // Fetch messages
      const { data: messagesData, error } = await supabase
        .from('messages')
        .select(`
          *,
          sender:users!sender_id(id, full_name, email, avatar_url, is_admin)
        `)
        .eq('user_id', authUser.id)
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Error fetching messages:', error)
        toast.error('Failed to load messages')
      } else {
        setMessages(messagesData || [])
        
        // Mark messages as read
        const unreadIds = messagesData
          ?.filter((m: any) => !m.read && m.sender_id !== authUser.id)
          .map((m: any) => m.id) || []
        
        if (unreadIds.length > 0) {
          await supabase
            .from('messages')
            // @ts-expect-error - Supabase type inference issue
            .update({ read: true })
            .in('id', unreadIds)
        }
      }

      setLoading(false)
    }

    loadUserAndMessages()
  }, [])

  useEffect(() => {
    if (!user?.id) return

    // Set up real-time subscription
    const supabase = createClient()
    const channelName = `messages-${user.id}-${Date.now()}`
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `user_id=eq.${user.id}`,
        },
        async (payload) => {
          console.log('Real-time event received:', payload.eventType, payload.new)
          
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            try {
              // Fetch the new/updated message with sender info
              const { data: messageData, error: fetchError } = await supabase
                .from('messages')
                .select(`
                  *,
                  sender:users!sender_id(id, full_name, email, avatar_url, is_admin)
                `)
                .eq('id', payload.new.id)
                .single()

              if (fetchError) {
                console.error('Error fetching message:', fetchError)
                return
              }

              if (messageData) {
                setMessages((prev) => {
                  const exists = prev.find(m => m.id === messageData.id)
                  if (exists) {
                    return prev.map(m => m.id === messageData.id ? messageData : m)
                  }
                  return [...prev, messageData].sort((a, b) => 
                    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
                  )
                })

              // Mark as read if it's from admin
              if (messageData.sender_id !== user.id && !messageData.read) {
                await supabase
                  .from('messages')
                  // @ts-expect-error - Supabase type inference issue
                  .update({ read: true })
                  .eq('id', messageData.id)
              }
              }
            } catch (error) {
              console.error('Error processing real-time message:', error)
            }
          }
        }
      )
      .subscribe((status) => {
        console.log('Subscription status:', status)
        if (status === 'SUBSCRIBED') {
          console.log('Successfully subscribed to messages')
        } else if (status === 'CHANNEL_ERROR') {
          console.error('Channel error occurred')
        }
      })

    return () => {
      console.log('Cleaning up subscription')
      supabase.removeChannel(channel)
    }
  }, [user?.id])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newMessage.trim() || !user) return

    setSending(true)
    const supabase = createClient()
    const messageContent = newMessage.trim()

    const { data: newMessageData, error } = await supabase
      .from('messages')
      // @ts-expect-error - Supabase type inference issue
      .insert({
        user_id: user.id,
        sender_id: user.id,
        content: messageContent,
      })
      .select(`
        *,
        sender:users!sender_id(id, full_name, email, avatar_url, is_admin)
      `)
      .single()

    if (error) {
      console.error('Error sending message:', error)
      toast.error('Failed to send message')
    } else {
      // Optimistically add the message to the UI
      if (newMessageData) {
        setMessages((prev) => [...prev, newMessageData].sort((a, b) => 
          new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        ))
      }
      setNewMessage('')
      toast.success('Message sent!')
    }

    setSending(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle>Chat with Admin</CardTitle>
        <p className="text-sm text-muted-foreground">
          Send a message to the admin team. We'll respond as soon as possible.
        </p>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0">
        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-[400px]">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center">
              <div>
                <p className="text-gray-500 mb-2">No messages yet</p>
                <p className="text-sm text-gray-400">
                  Start a conversation by sending a message below
                </p>
              </div>
            </div>
          ) : (
            messages.map((message) => {
              const isOwnMessage = message.sender_id === user?.id
              const senderName = message.sender?.is_admin 
                ? 'Admin' 
                : message.sender?.full_name || message.sender?.email?.split('@')[0] || 'User'
              const senderInitial = senderName.charAt(0).toUpperCase()

              return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  {!isOwnMessage && (
                    <div className="flex-shrink-0">
                      {message.sender?.avatar_url ? (
                        <Image
                          src={message.sender.avatar_url}
                          alt={senderName}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-r from-[#1e40af] to-[#1e3a8a] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {senderInitial}
                        </div>
                      )}
                    </div>
                  )}
                  <div className={`flex flex-col max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'}`}>
                    <div className={`rounded-lg px-4 py-2 ${
                      isOwnMessage
                        ? 'bg-[#1e40af] text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}>
                      <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                    </div>
                    <span className="text-xs text-gray-500 mt-1 px-1">
                      {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  {isOwnMessage && (
                    <div className="flex-shrink-0">
                      {user?.user_metadata?.avatar_url ? (
                        <Image
                          src={user.user_metadata.avatar_url}
                          alt="You"
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-gradient-to-r from-[#1e40af] to-[#1e3a8a] rounded-full flex items-center justify-center text-white font-semibold text-sm">
                          {user?.email?.charAt(0).toUpperCase() || 'U'}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t p-4">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="min-h-[60px] resize-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  handleSendMessage(e)
                }
              }}
            />
            <Button
              type="submit"
              disabled={!newMessage.trim() || sending}
              className="self-end"
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  )
}

