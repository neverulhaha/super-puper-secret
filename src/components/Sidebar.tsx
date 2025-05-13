'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Map,
  Building2,
  Grid as Grid3D,
  Battery,
  Navigation,
  Bot,
  Heart,
  ClipboardList,
  Shield,
  BarChart3,
  User,
} from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

const navigation = [
  { name: 'Профиль', icon: User, href: '/profile' },
  { name: 'Панель управления', icon: LayoutDashboard, href: '/dashboard' },
  { name: 'Анализ участка', icon: Map, href: '/analysis' },
  { name: 'Инфраструктура', icon: Building2, href: '/infrastructure' },
  { name: 'Ресурсы', icon: Battery, href: '/resources' },
  { name: 'Навигация', icon: Navigation, href: '/navigation' },
  { name: 'Управление роботами', icon: Bot, href: '/robotics' },
  { name: 'Медицина', icon: Heart, href: '/medical' },
  { name: 'Администрирование', icon: ClipboardList, href: '/admin' },
  { name: 'Безопасность', icon: Shield, href: '/security' },
  { name: 'Аналитика', icon: BarChart3, href: '/analytics' },
]

export function Sidebar() {
  const supabase = createClientComponentClient()
  const [name, setName] = useState('Пользователь')
  const [avatar, setAvatar] = useState('/photo/default.jpg')
  const pathname = usePathname()

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) return

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
    loadUser()
  }, [supabase])

  return (
    <aside className="fixed top-0 left-0 h-full w-72 bg-gray-900 text-white p-4 z-10">
      <Link href="/profile" className="block mb-8 px-4 flex items-center gap-3 cursor-pointer hover:bg-gray-800 rounded-lg">
        <img
          src={avatar}
          alt="Аватар"
          className="w-10 h-10 rounded-full object-cover border-2 border-gray-700"
        />
        <h2 className="text-white font-semibold truncate">{name}</h2>
      </Link>
      <nav className="space-y-1" aria-label="Главное меню">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                `flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ` +
                (isActive
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white')
              }
            >
              <item.icon className="w-6 h-6" />
              <span className="flex-1">{item.name}</span>
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
