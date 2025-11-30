import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { DashboardLayout } from '@/components/dashboard/dashboard-layout'
import { UserChat } from '@/components/dashboard/user-chat'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chat with Admin',
  robots: {
    index: false,
    follow: false,
    noarchive: true,
    nosnippet: true,
  },
}

export default async function ChatPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Get user profile
  const { data: userProfile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return (
    <DashboardLayout user={user} userProfile={userProfile}>
      <div className="space-y-4 lg:space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Chat with Admin</h1>
          <p className="text-sm lg:text-base text-muted-foreground mt-1">
            Send messages to the admin team and get support
          </p>
        </div>
        <UserChat />
      </div>
    </DashboardLayout>
  )
}

