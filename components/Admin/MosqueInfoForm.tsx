'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MosqueConfig } from '@/types/AdminTypes'

interface MosqueInfoFormProps {
  config: MosqueConfig
  onUpdate: (updates: Partial<MosqueConfig>) => void
}

export default function MosqueInfoForm({ config, onUpdate }: MosqueInfoFormProps) {
  const [formData, setFormData] = useState({
    name: config.name,
    address: config.address,
    website: config.website || '',
    logo_url: config.logo_url || ''
  })
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setSaveMessage('')

    try {
      onUpdate(formData)
      setSaveMessage('Informasi masjid berhasil diperbarui!')
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (error) {
      setSaveMessage('Gagal memperbarui informasi masjid')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Informasi Masjid</h2>

      {saveMessage && (
        <div className={`mb-4 p-3 rounded ${
          saveMessage.includes('berhasil')
            ? 'bg-green-100 text-green-700 border border-green-200'
            : 'bg-red-100 text-red-700 border border-red-200'
        }`}>
          {saveMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Nama Masjid *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mosqueGreen focus:border-mosqueGreen"
            placeholder="Masukkan nama masjid"
          />
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Alamat Masjid *
          </label>
          <textarea
            id="address"
            name="address"
            required
            rows={3}
            value={formData.address}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mosqueGreen focus:border-mosqueGreen"
            placeholder="Masukkan alamat lengkap masjid"
          />
        </div>

        <div>
          <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-1">
            Website (Opsional)
          </label>
          <input
            type="url"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mosqueGreen focus:border-mosqueGreen"
            placeholder="https://website-masjid.com"
          />
        </div>

        <div>
          <label htmlFor="logo_url" className="block text-sm font-medium text-gray-700 mb-1">
            URL Logo (Opsional)
          </label>
          <input
            type="url"
            id="logo_url"
            name="logo_url"
            value={formData.logo_url}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mosqueGreen focus:border-mosqueGreen"
            placeholder="https://example.com/logo.png"
          />
          <p className="text-sm text-gray-500 mt-1">
            Masukkan URL gambar logo masjid. Disarankan ukuran persegi dengan background transparan.
          </p>
        </div>

        {/* Preview */}
        {(formData.logo_url || formData.name) && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center space-x-4">
                {formData.logo_url && (
                  <Image
                    src={formData.logo_url}
                    alt="Logo masjid"
                    width={64}
                    height={64}
                    className="object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                    }}
                  />
                )}
                <div>
                  <h4 className="font-bold text-lg">{formData.name || 'Nama Masjid'}</h4>
                  <p className="text-gray-600">{formData.address || 'Alamat Masjid'}</p>
                  {formData.website && (
                    <a
                      href={formData.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-mosqueGreen hover:text-mosqueGreen-dark text-sm"
                    >
                      {formData.website}
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-mosqueGreen text-white px-6 py-2 rounded-md hover:bg-mosqueGreen-dark focus:outline-none focus:ring-2 focus:ring-mosqueGreen focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
          </button>
        </div>
      </form>
    </div>
  )
}