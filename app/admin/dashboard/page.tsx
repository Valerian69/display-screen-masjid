'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { adminService } from '@/services/AdminService'
import { MosqueConfig } from '@/types/AdminTypes'
import MosqueInfoForm from '@/components/Admin/MosqueInfoForm'
import AnnouncementManager from '@/components/Admin/AnnouncementManager'
import SettingsManager from '@/components/Admin/SettingsManager'
import LocationSelector from '@/components/Admin/LocationSelector'
import MarqueeSettings from '@/components/Admin/MarqueeSettings'

type TabType = 'mosque' | 'announcements' | 'settings' | 'location' | 'marquee'

export default function AdminDashboard() {
  const router = useRouter()
  const [mosqueConfig, setMosqueConfig] = useState<MosqueConfig | null>(null)
  const [activeTab, setActiveTab] = useState<TabType>('mosque')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const session = adminService.getCurrentSession()
    if (!session) {
      router.push('/admin/login')
      return
    }

    // Load mosque configuration
    const config = adminService.getMosqueConfig(session.user.mosqueId)
    setMosqueConfig(config)
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    adminService.logout()
    router.push('/login')
  }

  const handleMosqueConfigUpdate = async (updates: Partial<MosqueConfig>) => {
    if (!mosqueConfig) return

    try {
      await adminService.updateMosqueConfig(mosqueConfig.id, updates)
      setMosqueConfig(prev => prev ? { ...prev, ...updates } : null)
    } catch (error) {
      console.error('Error updating mosque config:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Memuat...</div>
      </div>
    )
  }

  if (!mosqueConfig) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Gagal memuat konfigurasi masjid</div>
      </div>
    )
  }

  const tabs = [
    { id: 'mosque', label: 'Info Masjid', icon: '🕌' },
    { id: 'announcements', label: 'Pengumuman', icon: '📢' },
    { id: 'location', label: 'Lokasi', icon: '📍' },
    { id: 'marquee', label: 'Teks Berjalan', icon: '📝' },
    { id: 'settings', label: 'Pengaturan', icon: '⚙️' },
  ]

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-mosqueGreen text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">
                Admin Panel - {mosqueConfig.name}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm">
                Welcome, {adminService.getCurrentSession()?.user?.username}
              </span>
              <button
                onClick={handleLogout}
                className="bg-mosqueGreen-dark hover:bg-mosqueGreen-darker px-3 py-1 rounded text-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as TabType)}
                className={`${
                  activeTab === tab.id
                    ? 'border-mosqueGreen text-mosqueGreen'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-lg shadow p-6">
          {activeTab === 'mosque' && (
            <MosqueInfoForm
              config={mosqueConfig}
              onUpdate={handleMosqueConfigUpdate}
            />
          )}

          {activeTab === 'announcements' && (
            <AnnouncementManager
              mosqueId={mosqueConfig.id}
              announcements={mosqueConfig.announcements}
              onUpdate={() => {
                // Reload mosque config to get updated announcements
                const updatedConfig = adminService.getMosqueConfig(mosqueConfig.id)
                setMosqueConfig(updatedConfig)
              }}
            />
          )}

          {activeTab === 'location' && (
            <LocationSelector
              config={mosqueConfig}
              onUpdate={handleMosqueConfigUpdate}
            />
          )}

          {activeTab === 'marquee' && (
            <MarqueeSettings
              config={mosqueConfig}
              onUpdate={handleMosqueConfigUpdate}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsManager
              config={mosqueConfig}
              onUpdate={handleMosqueConfigUpdate}
            />
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">Tautan Cepat</h3>
          <div className="flex space-x-4">
            <a
              href="/"
              target="_blank"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Lihat Layar Masjid →
            </a>
            <a
              href="/calendar"
              target="_blank"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Lihat Kalender →
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}