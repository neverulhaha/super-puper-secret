export const runtime = 'edge'

import { NextRequest, NextResponse }       from 'next/server'
import { createRouteHandlerClient }        from '@supabase/auth-helpers-nextjs'
import { supabaseAdmin }                   from '@/lib/supabase-admin'
import { cookies }                         from 'next/headers'

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const file = form.get('file') as File
  if (!file) {
    return NextResponse.json({ error: 'No file' }, { status: 400 })
  }

  const sb = createRouteHandlerClient({ cookies: () => cookies() })
  const { data: { user } } = await sb.auth.getUser()
  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const ext      = file.name.split('.').pop()
  const fileName = `${user.id}.${ext}`

  const { error: uploadError } = await supabaseAdmin
    .storage
    .from('avatars')
    .upload(fileName, file, { upsert: true })

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 })
  }

  const { data: { publicUrl } } = supabaseAdmin
    .storage
    .from('avatars')
    .getPublicUrl(fileName)

  return NextResponse.json({ publicUrl })
}
