import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const entries = await req.json();
    const normalized = (Array.isArray(entries) ? entries : [entries])
      .map((item) => ({
        lat: String(item.lat ?? item.latitude ?? ''),
        lon: String(item.lon ?? item.longitude ?? ''),
        summary: String(item.summary ?? 'Импортировано'),
        helium3: Number(item.helium3 ?? 0),
        titanium: Number(item.titanium ?? 0),
        silicon: Number(item.silicon ?? 0),
        craters: Number(item.craters ?? 0),
        slopes: Number(item.slopes ?? 0),
        radioactivity: Number(item.radioactivity ?? 0),
        created_at: item.created_at ? String(item.created_at) : undefined,
      }))
      .filter((x) => x.lat && x.lon);

    if (!normalized.length)
      return NextResponse.json({ error: 'Нет валидных записей для импорта' }, { status: 400 });

    const { data, error } = await supabase
      .from('lunar_analysis')
      .insert(normalized)
      .select();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    const { data: fullHistory, error: err2 } = await supabase
      .from('lunar_analysis')
      .select('*')
      .order('created_at', { ascending: false });

    if (err2) return NextResponse.json({ error: err2.message }, { status: 500 });

    return NextResponse.json(fullHistory);
  } catch (err) {
    return NextResponse.json({ error: 'Ошибка импорта: ' + (err as any)?.message }, { status: 400 });
  }
}
