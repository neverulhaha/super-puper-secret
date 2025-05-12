import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('security_status')
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({
        status: 'Защищено',
        message: 'Не удалось загрузить данные о безопасности, используем дефолтные значения.'
      });
    }

    if (!data) {
      return NextResponse.json({
        status: 'Защищено',
        message: 'Данные о безопасности пусты, используем дефолтные значения.'
      });
    }

    return NextResponse.json({
      ...data,
      message: 'Данные о безопасности успешно загружены.'
    });
  } catch (error) {
    return NextResponse.json({
      status: 'Защищено',
      message: 'Произошла ошибка, используем дефолтные значения.'
    });
  }
}
