'use client'
import React, { useState } from 'react'
import { Rocket }            from 'lucide-react'
import Link                  from 'next/link'
import { useRouter }         from 'next/navigation'

export default function LoginPage() {
  const [email,   setEmail]   = useState('')
  const [password, setPassword] = useState('')
  const [error,   setError]   = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    const res = await fetch('/api/login', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ email, password }),
    })

    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: 'Unknown error' }))
      setError(error)
      return
    }
    router.push('/profile')
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-white rounded-lg shadow-xl p-6 sm:p-8">
        <div className="flex items-center justify-center mb-6">
          <Rocket className="w-10 h-10 sm:w-12 sm:h-12 text-blue-600" />
        </div>
        <h1 className="text-xl sm:text-2xl font-medium text-center mb-4 text-black">
          Система управления лунной базой
        </h1>
        {error && (
          <p className="text-red-600 text-center text-sm sm:text-base mb-4">
            {error}
          </p>
        )}
        <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Введите email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-black px-3 py-2 sm:px-4 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">
              Пароль
            </label>
            <input
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full text-black px-3 py-2 sm:px-4 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            Войти
          </button>
          <div className="text-center">
            <Link
              href="/register"
              className="text-xs sm:text-sm text-blue-600 hover:text-blue-700 underline"
            >
              Не имеете аккаунта? Создайте один
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
