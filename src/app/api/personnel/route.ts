import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('personnel')
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({
        current: 0,
        total: 0,
        message: 'Не удалось загрузить данные о персонале, используем дефолтные значения.'
      });
    }

    if (!data) {
      return NextResponse.json({
        current: 0,
        total: 0,
        message: 'Данные о персонале пусты, используем дефолтные значения.'
      });
    }

    return NextResponse.json({
      ...data,
      message: 'Данные о персонале успешно загружены.'
    });
  } catch (error) {
    return NextResponse.json({
      current: 0,
      total: 0,
      message: 'Произошла ошибка, используем дефолтные значения.'
    });
  }
}
