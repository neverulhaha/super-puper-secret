'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    setError(null)

    const res = await fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({ first_name: name, email, password }),
      headers: { 'Content-Type': 'application/json' },
    })
    const data = await res.json()
    if (data.error) {
      setError(data.error)
    } else {
      setMessage('Регистрация успешна, для дальнейшего использования платформы подтвердите email')
      setTimeout(() => router.push('/login'), 1000)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-white rounded-lg shadow-xl p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-medium text-center mb-4 text-black">Регистрация</h2>
        {message && <p className="text-green-600 text-center text-sm sm:text-base mb-4">{message}</p>}
        {error && <p className="text-red-600 text-center text-sm sm:text-base mb-4">{error}</p>}
        <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Имя</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full text-black px-3 py-2 sm:px-4 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full text-black px-3 py-2 sm:px-4 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm sm:text-base font-medium text-gray-700 mb-1">Пароль</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full text-black px-3 py-2 sm:px-4 sm:py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              required
              minLength={6}
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
          >
            Зарегистрироваться
          </button>
        </form>
      </div>
    </div>
  )
}
