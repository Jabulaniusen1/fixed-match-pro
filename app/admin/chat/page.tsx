import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminLayout } from '@/components/admin/admin-layout'
import { AdminChat } from '@/components/admin/admin-chat'
import { Database } from '@/types/database'
import type { Metadata } from 'next'
import { adminMetadata } from '@/lib/seo/metadata'

export const metadata: Metadata = {
  ...adminMetadata,
  title: 'Chat Management',
}

type UserProfile = Pick<Database['public']['Tables']['users']['Row'], 'is_admin'>

export default async function AdminChatPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user is admin
  const { data: userProfile } = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single() as { data: UserProfile | null }

  if (!userProfile?.is_admin) {
    redirect('/dashboard')
  }

  return (
    <AdminLayout>
      <div className="space-y-4 lg:space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold">Chat Management</h1>
          <p className="text-sm lg:text-base text-muted-foreground mt-1">
            View and respond to user messages
          </p>
        </div>
        <AdminChat />
      </div>
    </AdminLayout>
  )
}

