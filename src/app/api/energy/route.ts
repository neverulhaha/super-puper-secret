import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('energy_system')
      .select('*')
      .single();

    if (error) {
      return NextResponse.json({
        efficiency: 0,
        message: 'Не удалось загрузить данные об энергосистеме, используем дефолтные значения.'
      });
    }

    if (!data) {
      return NextResponse.json({
        efficiency: 0,
        message: 'Данные об энергосистеме пусты, используем дефолтные значения.'
      });
    }

    return NextResponse.json({
      ...data,
      message: 'Данные об энергосистеме успешно загружены.'
    });
  } catch (error) {
    return NextResponse.json({
      efficiency: 0,
      message: 'Произошла ошибка, используем дефолтные значения.'
    });
  }
}
