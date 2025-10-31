'use client'

import { useState } from 'react'
import { MosqueConfig } from '@/types/AdminTypes'

interface SettingsManagerProps {
  config: MosqueConfig
  onUpdate: (updates: Partial<MosqueConfig>) => void
}

export default function SettingsManager({ config, onUpdate }: SettingsManagerProps) {
  const [settings, setSettings] = useState(config.settings)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')

  const handleChange = (key: keyof typeof settings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setMessage('')

    try {
      onUpdate({ settings })
      setMessage('Pengaturan berhasil diperbarui!')
      setTimeout(() => setMessage(''), 3000)
    } catch (error) {
      setMessage('Gagal memperbarui pengaturan')
    } finally {
      setIsSaving(false)
    }
  }

  const resetToDefaults = () => {
    if (confirm('Apakah Anda yakin ingin mereset ke pengaturan default?')) {
      const defaultSettings = {
        blackoutPeriod: 13,
        slideTransitionTime: 7,
        upcomingPrayerDays: 3,
        autoRefreshInterval: 60,
        displayMode: 'tv' as const,
        language: 'id' as const
      }
      setSettings(defaultSettings)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Pengaturan Tampilan</h2>

      {message && (
        <div className={`mb-4 p-3 rounded ${
          message.includes('berhasil')
            ? 'bg-green-100 text-green-700 border border-green-200'
            : 'bg-red-100 text-red-700 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Display Settings */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4">Pengaturan Tampilan</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mode Tampilan
              </label>
              <select
                value={settings.displayMode}
                onChange={(e) => handleChange('displayMode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mosqueGreen"
              >
                <option value="tv">TV/Layar Besar</option>
                <option value="mobile">Mobile/ Tablet</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Optimalkan tampilan untuk perangkat yang digunakan
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bahasa
              </label>
              <select
                value={settings.language}
                onChange={(e) => handleChange('language', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mosqueGreen"
              >
                <option value="id">Bahasa Indonesia</option>
                <option value="en">English</option>
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Pilih bahasa untuk tampilan
              </p>
            </div>
          </div>
        </div>

        {/* Timing Settings */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4">Pengaturan Waktu</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Periode Blackout (menit)
              </label>
              <input
                type="number"
                min="1"
                max="60"
                value={settings.blackoutPeriod}
                onChange={(e) => handleChange('blackoutPeriod', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mosqueGreen"
              />
              <p className="text-xs text-gray-500 mt-1">
                Durasi layar menjadi gelap saat waktu sholat
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Waktu Transisi Slide (detik)
              </label>
              <input
                type="number"
                min="3"
                max="30"
                value={settings.slideTransitionTime}
                onChange={(e) => handleChange('slideTransitionTime', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mosqueGreen"
              />
              <p className="text-xs text-gray-500 mt-1">
                Durasi setiap slide ditampilkan
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hari Mendatang yang Ditampilkan
              </label>
              <input
                type="number"
                min="1"
                max="7"
                value={settings.upcomingPrayerDays}
                onChange={(e) => handleChange('upcomingPrayerDays', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mosqueGreen"
              />
              <p className="text-xs text-gray-500 mt-1">
                Jumlah hari ke depan yang ditampilkan di slider
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Interval Auto Refresh (menit)
              </label>
              <input
                type="number"
                min="5"
                max="120"
                value={settings.autoRefreshInterval}
                onChange={(e) => handleChange('autoRefreshInterval', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mosqueGreen"
              />
              <p className="text-xs text-gray-500 mt-1">
                Interval refresh otomatis halaman
              </p>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Preview Pengaturan</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Mode Tampilan:</span>
              <div className="text-gray-600">
                {settings.displayMode === 'tv' ? 'TV/Layar Besar' : 'Mobile/Tablet'}
              </div>
            </div>
            <div>
              <span className="font-medium">Bahasa:</span>
              <div className="text-gray-600">
                {settings.language === 'id' ? 'Bahasa Indonesia' : 'English'}
              </div>
            </div>
            <div>
              <span className="font-medium">Blackout:</span>
              <div className="text-gray-600">{settings.blackoutPeriod} menit</div>
            </div>
            <div>
              <span className="font-medium">Slide:</span>
              <div className="text-gray-600">{settings.slideTransitionTime} detik</div>
            </div>
            <div>
              <span className="font-medium">Hari Mendatang:</span>
              <div className="text-gray-600">{settings.upcomingPrayerDays} hari</div>
            </div>
            <div>
              <span className="font-medium">Auto Refresh:</span>
              <div className="text-gray-600">{settings.autoRefreshInterval} menit</div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between">
          <button
            type="button"
            onClick={resetToDefaults}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
          >
            Reset ke Default
          </button>

          <button
            type="submit"
            disabled={isSaving}
            className="bg-mosqueGreen text-white px-6 py-2 rounded-md hover:bg-mosqueGreen-dark focus:outline-none focus:ring-2 focus:ring-mosqueGreen focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Menyimpan...' : 'Simpan Pengaturan'}
          </button>
        </div>
      </form>

      {/* Additional Information */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">💡 Tips Pengaturan</h4>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• <strong>Mode TV:</strong> Untuk layar besar 1080p, font lebih besar</li>
          <li>• <strong>Mode Mobile:</strong> Untuk tablet/phone, layout lebih kompak</li>
          <li>• <strong>Blackout:</strong> Redupkan layar saat waktu sholat untuk fokus jamaah</li>
          <li>• <strong>Slide Transition:</strong> Sesuaikan dengan kecepatan baca</li>
          <li>• <strong>Auto Refresh:</strong> Pastikan data selalu terupdate</li>
        </ul>
      </div>
    </div>
  )
}