'use client'

import { MosqueConfig } from '@/types/AdminTypes'

interface MarqueeSettingsProps {
  config: MosqueConfig
  onUpdate: (updates: Partial<MosqueConfig>) => void
}

export default function MarqueeSettings({ config, onUpdate }: MarqueeSettingsProps) {
  // Provide default values for backward compatibility
  const marqueeSettings = config.settings.marqueeAnimation || {
    animationDuration: 60,
    fontSize: 'medium' as 'small' | 'medium' | 'large',
    backgroundColor: 'bg-blue-900',
    textColor: 'text-white',
    pauseOnHover: true
  }

  const handleSettingsUpdate = (updates: Partial<typeof marqueeSettings>) => {
    const updatedConfig = {
      ...config,
      settings: {
        ...config.settings,
        marqueeAnimation: {
          ...marqueeSettings,
          ...updates
        }
      }
    }
    onUpdate(updatedConfig)
  }

  const backgroundColorOptions = [
    { value: 'bg-black', label: 'Hitam' },
    { value: 'bg-blue-900', label: 'Biru Tua' },
    { value: 'bg-green-900', label: 'Hijau Tua' },
    { value: 'bg-red-900', label: 'Merah Tua' },
    { value: 'bg-gray-900', label: 'Abu-abu Tua' },
    { value: 'bg-purple-900', label: 'Ungu Tua' },
    { value: 'bg-indigo-900', label: 'Indigo Tua' }
  ]

  const textColorOptions = [
    { value: 'text-white', label: 'Putih' },
    { value: 'text-yellow-300', label: 'Kuning Muda' },
    { value: 'text-green-300', label: 'Hijau Muda' },
    { value: 'text-blue-300', label: 'Biru Muda' }
  ]

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Pengaturan Teks Berjalan</h3>

      {/* Animation Duration */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Durasi Animasi (detik)
        </label>
        <input
          type="range"
          min="10"
          max="120"
          value={marqueeSettings.animationDuration}
          onChange={(e) => handleSettingsUpdate({ animationDuration: parseInt(e.target.value) })}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>10s (cepat)</span>
          <span className="font-medium text-gray-900">{marqueeSettings.animationDuration}s</span>
          <span>120s (lambat)</span>
        </div>
      </div>

      {/* Font Size */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Ukuran Font
        </label>
        <div className="flex space-x-4">
          {[
            { value: 'small', label: 'Kecil' },
            { value: 'medium', label: 'Sedang' },
            { value: 'large', label: 'Besar' }
          ].map((size) => (
            <button
              key={size.value}
              onClick={() => handleSettingsUpdate({ fontSize: size.value as 'small' | 'medium' | 'large' })}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                marqueeSettings.fontSize === size.value
                  ? 'bg-mosqueGreen text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {size.label}
            </button>
          ))}
        </div>
      </div>

      {/* Background Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Warna Latar
        </label>
        <select
          value={marqueeSettings.backgroundColor}
          onChange={(e) => handleSettingsUpdate({ backgroundColor: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mosqueGreen focus:border-transparent"
        >
          {backgroundColorOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Text Color */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Warna Teks
        </label>
        <select
          value={marqueeSettings.textColor}
          onChange={(e) => handleSettingsUpdate({ textColor: e.target.value })}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mosqueGreen focus:border-transparent"
        >
          {textColorOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Pause on Hover */}
      <div>
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            checked={marqueeSettings.pauseOnHover}
            onChange={(e) => handleSettingsUpdate({ pauseOnHover: e.target.checked })}
            className="w-4 h-4 text-mosqueGreen bg-gray-100 border-gray-300 rounded focus:ring-mosqueGreen focus:ring-2"
          />
          <span className="text-sm font-medium text-gray-700">
          Jeda saat hover (pause on hover)
          </span>
        </label>
        <p className="text-xs text-gray-500 mt-1 ml-7">
          Teks akan berhenti berjalan saat cursor di atasnya
        </p>
      </div>

      {/* Preview */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Pratinjau</h4>
        <div className={`${marqueeSettings.backgroundColor} ${marqueeSettings.textColor} py-2 px-3 rounded overflow-hidden`}>
          <div className="flex whitespace-nowrap animate-marquee-preview">
            <span className={`inline-block ${marqueeSettings.fontSize === 'small' ? 'text-sm' : marqueeSettings.fontSize === 'large' ? 'text-lg' : 'text-base'}`}>
              Contoh pengumuman berjalan • Ini adalah preview dari pengaturan Anda •
            </span>
            <span className={`inline-block ${marqueeSettings.fontSize === 'small' ? 'text-sm' : marqueeSettings.fontSize === 'large' ? 'text-lg' : 'text-base'}`}>
              Contoh pengumuman berjalan • Ini adalah preview dari pengaturan Anda •
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee-preview {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee-preview {
          animation: marquee-preview ${marqueeSettings.animationDuration}s linear infinite;
        }
      `}</style>
    </div>
  )
}