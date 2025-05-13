'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Camera } from 'lucide-react'

export default function ProfileUI() {
  const [profile, setProfile] = useState<{
    id: string
    email: string
    first_name: string
    last_name: string
    middle_name: string | null
    profession: string | null
    avatar_url: string | null
  } | null>(null)

  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        setLoading(false)
        return
      }
      const { data, error } = await supabase
        .from('users')
        .select('id,email,first_name,last_name,middle_name,profession,avatar_url')
        .eq('id', user.id)
        .single()
      if (error) {
        setMessage('Не удалось загрузить профиль')
      } else {
        setProfile(data)
      }
      setLoading(false)
    }
    load()
  }, [])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && profile) {
      setAvatarFile(file)
      setProfile({ ...profile, avatar_url: URL.createObjectURL(file) })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    setMessage(null)

    let avatar_url = profile.avatar_url

    if (avatarFile) {
      const ext = avatarFile.name.split('.').pop()
      const filePath = `${profile.id}/${Date.now()}.${ext}`
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, avatarFile, { cacheControl: '3600', upsert: false })
      if (uploadError) {
        setMessage('Ошибка при загрузке аватара: ' + uploadError.message)
        return
      }
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath)
      avatar_url = urlData.publicUrl
    }
    const updates: Partial<typeof profile> = {
      first_name: profile.first_name,
      last_name:  profile.last_name,
      middle_name: profile.middle_name,
      profession: profile.profession,
      avatar_url,
    }

    const { error: updateError } = await supabase
      .from('users')
      .update(updates)
      .eq('id', profile.id)

    if (updateError) {
      setMessage('Ошибка при сохранении профиля')
    } else {
      setProfile({ ...profile, ...updates } as any)
      setAvatarFile(null)
      setMessage('Профиль обновлён')
    }
  }

  if (loading) return <div className="text-center text-gray-500 mt-8">Загрузка...</div>
  if (!profile) return <div className="text-center text-gray-500 mt-8">Профиль не найден</div>

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8 space-y-10">
      <h1 className="text-2xl font-bold text-gray-800">Профиль пользователя</h1>
      {message && <p className="text-green-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-[200px_1fr] gap-8 items-start">
          <div className="relative w-full group overflow-hidden rounded-lg">
            <img
              src={profile.avatar_url || '/photo/default.jpg'}
              alt="Фото профиля"
              className="w-full h-full rounded-lg object-cover border border-gray-200"
            />
            <label
              htmlFor="avatar-upload"
              className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center rounded-lg opacity-0 group-hover:opacity-100 transition"
            >
              <Camera className="w-6 h-6 text-white" />
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>
          <div className="grid grid-cols-2 gap-4 pr-4">
            <Field label="Имя"      name="first_name" value={profile.first_name} onChange={e => setProfile({ ...profile, first_name: e.target.value })} />
            <Field label="Фамилия"  name="last_name"  value={profile.last_name}  onChange={e => setProfile({ ...profile, last_name: e.target.value })} />
            <Field label="Отчество" name="middle_name" value={profile.middle_name || ''}  onChange={e => setProfile({ ...profile, middle_name: e.target.value })} />
            <Field label="Профессия" name="profession" value={profile.profession || ''} onChange={e => setProfile({ ...profile, profession: e.target.value })} />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Сохранить профиль
        </button>
      </form>
    </div>
  )
}

function Field({
  label,
  name,
  value,
  onChange,
}: {
  label: string
  name: string
  value: any
  onChange: React.ChangeEventHandler<HTMLInputElement>
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border rounded px-3 py-2 text-black"
      />
    </div>
  )
}
