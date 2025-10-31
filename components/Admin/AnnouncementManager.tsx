'use client'

import { useState, useEffect } from 'react'
import { adminService } from '@/services/AdminService'
import { Announcement } from '@/types/AdminTypes'

interface AnnouncementManagerProps {
  mosqueId: string
  announcements: Announcement[]
  onUpdate: () => void
}

export default function AnnouncementManager({ mosqueId, announcements, onUpdate }: AnnouncementManagerProps) {
  const [announcementsList, setAnnouncementsList] = useState<Announcement[]>(announcements)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [message, setMessage] = useState('')

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    type: 'info' as 'info' | 'warning' | 'urgent',
    startTime: '',
    endTime: '',
    isActive: true
  })

  useEffect(() => {
    setAnnouncementsList(announcements)
  }, [announcements])

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      type: 'info',
      startTime: '',
      endTime: '',
      isActive: true
    })
    setIsAdding(false)
    setEditingId(null)
  }

  const handleEdit = (announcement: Announcement) => {
    setFormData({
      title: announcement.title,
      message: announcement.message,
      type: announcement.type,
      startTime: announcement.startTime || '',
      endTime: announcement.endTime || '',
      isActive: announcement.isActive
    })
    setEditingId(announcement.id)
    setIsAdding(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage('')

    try {
      if (editingId) {
        await adminService.saveAnnouncement(mosqueId, { ...formData, id: editingId })
        setMessage('Pengumuman berhasil diperbarui!')
      } else {
        await adminService.saveAnnouncement(mosqueId, formData)
        setMessage('Pengumuman berhasil ditambahkan!')
      }

      resetForm()
      onUpdate()
    } catch (error) {
      setMessage('Gagal menyimpan pengumuman')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus pengumuman ini?')) return

    try {
      await adminService.deleteAnnouncement(mosqueId, id)
      setMessage('Pengumuman berhasil dihapus!')
      onUpdate()
    } catch (error) {
      setMessage('Gagal menghapus pengumuman')
    }
  }

  const toggleActive = async (id: string, isActive: boolean) => {
    try {
      const announcement = announcementsList.find(a => a.id === id)
      if (!announcement) return

      await adminService.saveAnnouncement(mosqueId, {
        ...announcement,
        isActive
      })
      onUpdate()
    } catch (error) {
      setMessage('Gagal mengubah status pengumuman')
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'bg-red-100 text-red-800 border-red-200'
      case 'warning': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-blue-100 text-blue-800 border-blue-200'
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'urgent': return 'Penting'
      case 'warning': return 'Peringatan'
      default: return 'Informasi'
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Pengelolaan Pengumuman</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="bg-mosqueGreen text-white px-4 py-2 rounded-md hover:bg-mosqueGreen-dark"
        >
          + Tambah Pengumuman
        </button>
      </div>

      {message && (
        <div className={`mb-4 p-3 rounded ${
          message.includes('berhasil')
            ? 'bg-green-100 text-green-700 border border-green-200'
            : 'bg-red-100 text-red-700 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-4">
            {editingId ? 'Edit Pengumuman' : 'Tambah Pengumuman Baru'}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Judul Pengumuman *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mosqueGreen"
                  placeholder="Judul pengumuman"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipe Pengumuman
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({...formData, type: e.target.value as 'info' | 'warning' | 'urgent'})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mosqueGreen"
                >
                  <option value="info">Informasi</option>
                  <option value="warning">Peringatan</option>
                  <option value="urgent">Penting</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Isi Pengumuman *
              </label>
              <textarea
                required
                rows={3}
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mosqueGreen"
                placeholder="Isi pengumuman yang akan ditampilkan"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Waktu Mulai (Opsional)
                </label>
                <input
                  type="datetime-local"
                  value={formData.startTime}
                  onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mosqueGreen"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Waktu Selesai (Opsional)
                </label>
                <input
                  type="datetime-local"
                  value={formData.endTime}
                  onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mosqueGreen"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                className="mr-2"
              />
              <label htmlFor="isActive" className="text-sm text-gray-700">
                Aktifkan pengumuman
              </label>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-mosqueGreen text-white px-4 py-2 rounded-md hover:bg-mosqueGreen-dark"
              >
                {editingId ? 'Perbarui' : 'Simpan'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Announcements List */}
      <div className="space-y-4">
        {announcementsList.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Belum ada pengumuman. Klik &quot;Tambah Pengumuman&quot; untuk membuat yang baru.
          </div>
        ) : (
          announcementsList.map((announcement) => (
            <div key={announcement.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded ${getTypeColor(announcement.type)}`}>
                      {getTypeLabel(announcement.type)}
                    </span>
                    {!announcement.isActive && (
                      <span className="px-2 py-1 text-xs font-medium rounded bg-gray-100 text-gray-600">
                        Tidak Aktif
                      </span>
                    )}
                  </div>

                  <h3 className="font-semibold text-lg mb-1">{announcement.title}</h3>
                  <p className="text-gray-700 mb-2">{announcement.message}</p>

                  <div className="text-sm text-gray-500 space-x-4">
                    <span>Dibuat: {new Date(announcement.createdAt).toLocaleString('id-ID')}</span>
                    {announcement.startTime && (
                      <span>Mulai: {new Date(announcement.startTime).toLocaleString('id-ID')}</span>
                    )}
                    {announcement.endTime && (
                      <span>Selesai: {new Date(announcement.endTime).toLocaleString('id-ID')}</span>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => toggleActive(announcement.id, !announcement.isActive)}
                    className={`px-3 py-1 text-sm rounded ${
                      announcement.isActive
                        ? 'bg-green-100 text-green-700 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {announcement.isActive ? 'Aktif' : 'Nonaktif'}
                  </button>
                  <button
                    onClick={() => handleEdit(announcement)}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(announcement.id)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}