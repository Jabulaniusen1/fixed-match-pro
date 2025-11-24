import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { predictions } = body

    if (!predictions || !Array.isArray(predictions) || predictions.length === 0) {
      return NextResponse.json({ error: 'Predictions array is required' }, { status: 400 })
    }

    const supabase = await createClient()
    
    // Check if user is admin
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { data: userProfile } = await supabase
      .from('users')
      .select('is_admin')
      .eq('id', user.id)
      .single()

    if (!userProfile || !(userProfile as any).is_admin) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }

    // Insert selected predictions into database
    const { data, error } = await supabase
      .from('predictions')
      .insert(predictions as any)
      .select()

    if (error) {
      console.error('Error inserting predictions:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      message: 'Predictions inserted successfully', 
      synced: data?.length || 0
    })
  } catch (error: any) {
    console.error('Insert error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

