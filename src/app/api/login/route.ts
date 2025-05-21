export const runtime = 'edge'

import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient }  from '@supabase/auth-helpers-nextjs'
import { cookies }                  from 'next/headers'

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()
  const supabase = createRouteHandlerClient({
    cookies: () => cookies()
  })

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 401 })
  }

  return NextResponse.redirect(new URL('/profile', request.url))
}
