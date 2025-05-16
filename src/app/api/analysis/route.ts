import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';


export async function GET() {
  const supabase = createRouteHandlerClient ({ cookies })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const { data, error } = await supabase
    .from('lunar_analysis')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient ({ cookies })

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })

  const body = await req.json()
  const { lat, lon } = body
  const toNum = (x: string) => Math.abs(parseFloat(x))
  const helium3 = +(Math.abs(Math.sin(toNum(lat) * 1.5 + toNum(lon) * 0.7)) * 20 + 5).toFixed(1)
  const titanium = +(Math.abs(Math.cos(toNum(lat) * 0.8 - toNum(lon) * 1.1)) * 30 + 10).toFixed(1)
  const silicon = +(100 - helium3 - titanium).toFixed(1)

  const craters = +(Math.abs(Math.cos(toNum(lat) + toNum(lon))) * 100).toFixed(0)
  const slopes = +(Math.abs(Math.sin(toNum(lat) * 0.5 - toNum(lon))) * 100).toFixed(0)
  const radioactivity = +(Math.abs(Math.sin(toNum(lat) * 2 + toNum(lon) * 3)) * 100).toFixed(0)
  let summary = "Низкая опасность"
  const danger = craters * 0.3 + slopes * 0.5 + radioactivity * 0.2
  if (danger > 120) summary = "Высокая опасность"
  else if (danger > 70) summary = "Средняя опасность"

  const { data, error } = await supabase
    .from('lunar_analysis')
    .insert([{
      user_id: user.id,
      lat, lon, summary,
      helium3, titanium, silicon,
      craters, slopes, radioactivity
    }])
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data[0])
}
