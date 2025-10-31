'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Login attempted:', { username, password })
    // Simple redirect for testing
    router.push('/admin/dashboard')
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0F715D', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      <div style={{ maxWidth: '400px', width: '100%', backgroundColor: 'white', borderRadius: '8px', padding: '32px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ color: '#0F715D', fontSize: '24px', fontWeight: 'bold', marginBottom: '8px' }}>
            Login Admin Masjid
          </h2>
          <p style={{ color: '#40A49C', fontSize: '14px' }}>
            Kelola informasi masjid Anda
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '14px'
              }}
              placeholder="Masukkan username"
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '4px' }}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '4px',
                fontSize: '14px'
              }}
              placeholder="Masukkan password"
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: '#0F715D',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Login
          </button>
        </form>

        <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f9fafb', borderRadius: '4px', fontSize: '12px', color: '#6b7280' }}>
          <p style={{ fontWeight: 'bold', marginBottom: '8px' }}>Default Login:</p>
          <p>Username: <span style={{ fontFamily: 'monospace', backgroundColor: '#e5e7eb', padding: '2px 4px', borderRadius: '2px' }}>admin</span></p>
          <p>Password: <span style={{ fontFamily: 'monospace', backgroundColor: '#e5e7eb', padding: '2px 4px', borderRadius: '2px' }}>admin123</span></p>
        </div>

        <div style={{ marginTop: '16px', textAlign: 'center' }}>
          <a
            href="/"
            style={{ color: '#0F715D', textDecoration: 'none', fontSize: '14px' }}
          >
            ← Kembali ke Layar Masjid
          </a>
        </div>
      </div>
    </div>
  )
}