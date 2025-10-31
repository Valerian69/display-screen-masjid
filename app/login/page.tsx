'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminService } from '@/services/AdminService'
import { LoginCredentials } from '@/types/AdminTypes'

export default function AdminLogin() {
  const [credentials, setCredentials] = useState<LoginCredentials>({
    username: '',
    password: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await adminService.login(credentials)
      router.push('/admin/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login gagal')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setCredentials(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="min-h-screen bg-mosqueGreen flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Login Admin Masjid
          </h2>
          <p className="mt-2 text-center text-sm text-mosqueGreen-light">
            Kelola informasi masjid Anda
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={credentials.username}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mosqueGreen focus:border-mosqueGreen sm:text-sm"
                placeholder="Masukkan username"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={credentials.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-mosqueGreen focus:border-mosqueGreen sm:text-sm"
                placeholder="Masukkan password"
              />
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-mosqueGreen hover:bg-mosqueGreen-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-mosqueGreen disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Sedang login...' : 'Login'}
              </button>
            </div>
          </form>

          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Default Login:</strong></p>
              <p>Username: <span className="font-mono bg-gray-100 px-2 py-1 rounded">admin</span></p>
              <p>Password: <span className="font-mono bg-gray-100 px-2 py-1 rounded">admin123</span></p>
              <p className="text-xs text-amber-600 mt-2">
                ⚠️ Ganti password default untuk keamanan
              </p>
            </div>
          </div>

          <div className="mt-4">
            <a
              href="/"
              className="block w-full text-center text-sm text-mosqueGreen hover:text-mosqueGreen-dark"
            >
              ← Kembali ke Layar Masjid
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}