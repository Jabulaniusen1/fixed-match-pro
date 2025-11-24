import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminLayout } from '@/components/admin/admin-layout'
import { VIPWinsManager } from '@/components/admin/vip-wins-manager'
import { Database } from '@/types/database'

type UserProfile = Pick<Database['public']['Tables']['users']['Row'], 'is_admin'>

export default async function AdminVIPWinsPage() {
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

  // Get all VIP winnings ordered by date (newest first)
  const { data: winnings } = await supabase
    .from('vip_winnings')
    .select('*')
    .order('date', { ascending: false })

  // Get all plans
  const { data: plans } = await supabase
    .from('plans')
    .select('*')
    .order('created_at')

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">VIP Previous Wins</h1>
          <p className="text-sm lg:text-base text-gray-600 mt-1">
            Manage VIP winning records for each plan type
          </p>
        </div>

        <VIPWinsManager
          winnings={winnings || []}
          plans={plans || []}
        />
      </div>
    </AdminLayout>
  )
}

