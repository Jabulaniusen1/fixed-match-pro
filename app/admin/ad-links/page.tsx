import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminLayout } from '@/components/admin/admin-layout'
import { AdLinksManager } from '@/components/admin/ad-links-manager'
import { Database } from '@/types/database'

// Force dynamic rendering - this page requires admin authentication
export const dynamic = 'force-dynamic'

type UserProfile = Pick<Database['public']['Tables']['users']['Row'], 'is_admin'>

export default async function AdminAdLinksPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if user is admin
  const result = await supabase
    .from('users')
    .select('is_admin')
    .eq('id', user.id)
    .single()
  
  const userProfile = result.data as UserProfile | null

  if (!userProfile?.is_admin) {
    redirect('/dashboard')
  }

  // Get all ad links
  const { data: adLinks } = await supabase
    .from('ad_links')
    .select('*')
    .order('display_order', { ascending: true })

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Ad Links Management</h1>
          <p className="text-muted-foreground">Manage advertisement links displayed in the navbar dropdown</p>
        </div>

        <AdLinksManager adLinks={adLinks || []} />
      </div>
    </AdminLayout>
  )
}
