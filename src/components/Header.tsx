'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Bell, LogOut } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export function Header() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [name, setName] = useState('Пользователь')
  const [avatar, setAvatar] = useState('/photo/default.jpg')

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
        return
      }
      const { data, error } = await supabase
        .from('users')
        .select('first_name, last_name, avatar_url')
        .eq('id', user.id)
        .single()
      if (!error && data) {
        setName(`${data.first_name} ${data.last_name}`)
        if (data.avatar_url) setAvatar(data.avatar_url)
      }
    }
    load()
  }, [supabase, router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="h-16 bg-white border-b shadow-md fixed top-0 left-72 right-0 z-10">
      <div className="h-full flex items-center justify-between px-6">
        <div className="text-xl font-semibold text-gray-800">
          Система управления лунной базой
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => {}}
            className="p-2 hover:bg-gray-100 rounded-full relative"
            aria-label="Уведомления"
          >
            <Bell className="w-5 h-5 text-gray-600" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>
          <div
            onClick={() => router.push('/profile')}
            className="flex items-center gap-3 cursor-pointer rounded-lg hover:bg-gray-100 px-2 py-1"
          >
            <span className="text-sm text-gray-600 truncate">{name}</span>
            <img
              src={avatar}
              alt="Аватар"
              className="w-8 h-8 rounded-full object-cover"
            />
          </div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-gray-100 rounded-full"
            aria-label="Выйти"
          >
            <LogOut className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  )
}
