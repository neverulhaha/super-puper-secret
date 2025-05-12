import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('life_support')
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({
        status: 'Оптимально',
        message: 'Не удалось загрузить данные о системе жизнеобеспечения, используем дефолтные значения.'
      });
    }

    if (!data) {
      return NextResponse.json({
        status: 'Оптимально',
        message: 'Данные о системе жизнеобеспечения пусты, используем дефолтные значения.'
      });
    }

    return NextResponse.json({
      ...data,
      message: 'Данные о системе жизнеобеспечения успешно загружены.'
    });
  } catch (error) {
    return NextResponse.json({
      status: 'Оптимально',
      message: 'Произошла ошибка, используем дефолтные значения.'
    });
  }
}
