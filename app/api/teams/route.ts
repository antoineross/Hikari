import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
  const supabase = createRouteHandlerClient({ cookies })

  // Check if the user is authenticated
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Fetch teams for the authenticated user
  const { data: teams, error } = await supabase
    .from('team_members')
    .select(`
      team_id,
      role,
      teams:team_id (
        id,
        name,
        created_at,
        updated_at
      )
    `)
    .eq('user_id', user.id)

  if (error) {
    console.error('Error fetching teams:', error)
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 })
  }

  // Transform the data to a more convenient format
  const formattedTeams = teams.map(({ teams, role }) => ({
    ...teams,
    role
  }))

  return NextResponse.json(formattedTeams)
}