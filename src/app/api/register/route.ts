import { supabaseAdmin } from '@/lib/supabase-admin';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { first_name, email, password } = await request.json();

    if (!first_name || !email || !password) {
      return NextResponse.json({ error: 'Все поля обязательны' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Неверный формат email' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Пароль должен быть не менее 6 символов' }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'https://super-puper-secret.vercel.app/confirmed',
        data: { first_name },
      },
    });

    if (error) {
      const lower = error.message.toLowerCase();
      if (lower.includes('user already registered')) {
        return NextResponse.json({
          error: 'Пользователь с таким email уже зарегистрирован. Пожалуйста, войдите в аккаунт.',
        }, { status: 409 });
      }

      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    const user = data?.user;
    if (!user || !user.id) {
      return NextResponse.json({ error: 'Регистрация не удалась. Попробуйте позже.' }, { status: 500 });
    }

    const { data: existing } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    if (!existing) {
      const { error: profileError } = await supabaseAdmin.from('users').insert([
        {
          id: user.id,
          email,
          first_name,
          avatar_url: '',
        },
      ]);

      if (profileError) {
        console.error('Ошибка вставки профиля:', profileError);
        return NextResponse.json({
          error: `Ошибка вставки профиля: ${profileError.message}`,
        }, { status: 500 });
      }
    } else {
      console.log('Профиль уже существует, вставка пропущена.');
    }

    return NextResponse.json({ message: 'Письмо для подтверждения отправлено. Подтвердите email.' });

  } catch (err) {
  console.error('Регистрация упала с ошибкой:', err)
  return NextResponse.json({ error: 'Ошибка сервера. Попробуйте позже.' }, { status: 500 })
}

}
