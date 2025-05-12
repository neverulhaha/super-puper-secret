'use client'

import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Camera } from 'lucide-react'

export default function ProfileUI() {
  const [profile, setProfile]       = useState<any>(null)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [message, setMessage]       = useState<string | null>(null)
  const [loading, setLoading]       = useState(true)

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [pwdMessage, setPwdMessage] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      const { data: authData } = await supabase.auth.getUser()
      if (!authData.user) {
        setLoading(false)
        return
      }
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single()
      if (data) setProfile(data)
      setLoading(false)
    }
    load()
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!profile) return
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setAvatarFile(file)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return

    setMessage(null)
    let avatar_url = profile.avatar_url

    if (avatarFile) {
      const formData = new FormData()
      formData.append('file', avatarFile)
      const uploadRes = await fetch('/api/upload-avatar', {
        method: 'POST',
        body: formData,
      })
      if (!uploadRes.ok) {
        const { error } = await uploadRes.json().catch(() => ({ error: 'Ошибка загрузки' }))
        setMessage(error)
        return
      }
      const { publicUrl } = await uploadRes.json()
      avatar_url = publicUrl
    }

    const { error } = await supabase
      .from('users')
      .update({ ...profile, avatar_url })
      .eq('id', profile.id)

    if (!error) {
      setProfile({ ...profile, avatar_url })
      setMessage('Профиль обновлён')
    } else {
      setMessage('Ошибка при сохранении')
    }
  }

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setPwdMessage(null)

    const { currentPassword, newPassword, confirmPassword } = passwordData
    if (!currentPassword) {
      setPwdMessage('Введите текущий пароль')
      return
    }
    if (newPassword.length < 6) {
      setPwdMessage('Новый пароль должен быть не менее 6 символов')
      return
    }
    if (newPassword !== confirmPassword) {
      setPwdMessage('Пароли не совпадают')
      return
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword })
    if (error) {
      setPwdMessage(error.message)
    } else {
      setPwdMessage('Пароль успешно изменён')
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    }
  }

  if (loading)  return <div className="text-center text-gray-500 mt-8">Загрузка...</div>
  if (!profile) return <div className="text-center text-gray-500 mt-8">Профиль не найден</div>

  const avatarSrc = profile.avatar_url || '/photo/default.jpg'

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-8 space-y-10">
      <h1 className="text-2xl font-bold text-gray-800">Профиль пользователя</h1>
      {message && <p className="text-green-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-[200px_1fr] gap-8 items-stretch">
          <div className="relative w-full group pl-4 overflow-hidden rounded-lg">
            <img
              src={avatarSrc}
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
            <Field label="ID"        name="id"         value={profile.id}        readOnly />
            <Field label="Email"     name="email"      value={profile.email}     readOnly />
            <Field label="Имя"       name="first_name" value={profile.first_name} onChange={handleChange} />
            <Field label="Фамилия"   name="last_name"  value={profile.last_name}  onChange={handleChange} />
            <Field label="Отчество"  name="middle_name"value={profile.middle_name} onChange={handleChange} />
            <Field label="Профессия" name="profession" value={profile.profession} onChange={handleChange} />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Сохранить профиль
        </button>
      </form>

      <form onSubmit={handlePasswordSubmit} className="mt-10 space-y-4 max-w-md">
        <h2 className="text-xl font-semibold mb-4 text-gray-800">Изменить пароль</h2>
        {pwdMessage && <p className="text-red-600">{pwdMessage}</p>}

        <div>
          <label className="block font-medium mb-1 text-gray-700">Текущий пароль</label>
          <input
            type="password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            className="w-full border rounded px-3 py-2 text-black"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1 text-gray-700">Новый пароль</label>
          <input
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            className="w-full border rounded px-3 py-2 text-black"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1 text-gray-700">Подтверждение пароля</label>
          <input
            type="password"
            name="confirmPassword"
            value={passwordData.confirmPassword}
            onChange={handlePasswordChange}
            className="w-full border rounded px-3 py-2 text-black"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          Изменить пароль
        </button>
      </form>
    </div>
  )
}

function Field({
  label,
  name,
  value,
  readOnly = false,
  onChange,
}: {
  label: string
  name: string
  value: any
  readOnly?: boolean
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <input
        type="text"
        name={name}
        value={value || ''}
        readOnly={readOnly}
        onChange={onChange}
        className={`w-full border rounded px-3 py-2 text-black ${
          readOnly ? 'bg-gray-100 cursor-not-allowed' : ''
        }`}
      />
    </div>
  )
}
