'use client'

import { useState, useEffect } from 'react'
import { MosqueConfig } from '@/types/AdminTypes'
import { myQuranService } from '@/services/MyQuranService'

interface MyQuranCity {
  id: string
  lokasi: string
}

interface LocationSelectorProps {
  config: MosqueConfig
  onUpdate: (updates: Partial<MosqueConfig>) => void
}

export default function LocationSelector({ config, onUpdate }: LocationSelectorProps) {
  const [selectedCity, setSelectedCity] = useState(config.cityId)
  const [searchTerm, setSearchTerm] = useState('')
  const [isTesting, setIsTesting] = useState(false)
  const [testResult, setTestResult] = useState<any>(null)
  const [testError, setTestError] = useState('')
  const [cities, setCities] = useState<MyQuranCity[]>([])
  const [isLoadingCities, setIsLoadingCities] = useState(true)
  const [citiesError, setCitiesError] = useState('')

  // Load cities from MyQuran API
  useEffect(() => {
    const loadCities = async () => {
      try {
        setIsLoadingCities(true)
        const citiesData = await myQuranService.getCities()
        setCities(citiesData)
        setCitiesError('')
      } catch (error) {
        console.error('Error loading cities:', error)
        setCitiesError('Gagal memuat data kota. Silakan coba lagi.')
      } finally {
        setIsLoadingCities(false)
      }
    }

    loadCities()
  }, [])

  const filteredCities = cities.filter(city =>
    city.lokasi.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCityChange = (cityId: string) => {
    console.log('🏙️ City selected in admin:', cityId, 'Location:', cities.find(c => c.id === cityId)?.lokasi)
    setSelectedCity(cityId)
    onUpdate({ cityId })
    setTestResult(null)
    setTestError('')
  }

  const testPrayerTimes = async () => {
    setIsTesting(true)
    setTestResult(null)
    setTestError('')

    try {
      const now = new Date()
      const dateStr = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`
      const url = `https://api.myquran.com/v2/sholat/jadwal/${selectedCity}/${dateStr}`

      const response = await fetch(url)
      const data = await response.json()

      if (data.status) {
        setTestResult(data.data.jadwal)
      } else {
        setTestError('Data tidak ditemukan untuk kota ini.')
      }
    } catch (error) {
      setTestError('Gagal mengambil data waktu sholat. Pastikan koneksi internet Anda stabil.')
    } finally {
      setIsTesting(false)
    }
  }

  const currentCity = cities.find(city => city.id === selectedCity)

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Pengaturan Lokasi</h2>

      <div className="space-y-6">
        {/* Current Selection */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-800 mb-2">Lokasi Saat Ini</h3>
          {currentCity ? (
            <div>
              <p className="text-blue-700">
                <strong>{currentCity.lokasi}</strong>
              </p>
              <p className="text-sm text-blue-600 mt-1">
                ID: {currentCity.id}
              </p>
            </div>
          ) : (
            <p className="text-blue-700">Lokasi belum dipilih</p>
          )}
        </div>

        {/* City Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Pilih Kota Lokasi Masjid
          </label>
          <input
            type="text"
            placeholder="Cari kota atau provinsi..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-mosqueGreen focus:border-mosqueGreen mb-3"
          />

          <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-md">
            {isLoadingCities ? (
              <div className="p-4 text-gray-500 text-center">
                Memuat data kota...
              </div>
            ) : citiesError ? (
              <div className="p-4 text-red-500 text-center">
                {citiesError}
              </div>
            ) : filteredCities.length === 0 ? (
              <div className="p-4 text-gray-500 text-center">
                Tidak ada kota yang ditemukan
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredCities.map((city) => (
                  <div
                    key={city.id}
                    onClick={() => handleCityChange(city.id)}
                    className={`p-3 cursor-pointer hover:bg-gray-50 ${
                      selectedCity === city.id ? 'bg-mosqueGreen text-white' : ''
                    }`}
                  >
                    <div className="font-medium">{city.lokasi}</div>
                    <div className={`text-sm ${selectedCity === city.id ? 'text-mosqueGreen-light' : 'text-gray-500'}`}>
                      ID: {city.id}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Test API */}
        <div className="border-t pt-6">
          <h3 className="font-semibold text-gray-900 mb-4">Uji Waktu Sholat</h3>
          <p className="text-gray-600 mb-4">
            Uji pengambilan data waktu sholat untuk lokasi yang dipilih.
          </p>

          <button
            onClick={testPrayerTimes}
            disabled={isTesting || !selectedCity}
            className="bg-mosqueGreen text-white px-4 py-2 rounded-md hover:bg-mosqueGreen-dark disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTesting ? 'Menguji...' : 'Uji Ambil Data'}
          </button>

          {/* Test Results */}
          {testResult && (
            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-2">✅ Data Berhasil Diambil!</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Subuh:</span> {testResult.subuh}
                </div>
                <div>
                  <span className="font-medium">Dzuhur:</span> {testResult.dzuhur}
                </div>
                <div>
                  <span className="font-medium">Ashar:</span> {testResult.ashar}
                </div>
                <div>
                  <span className="font-medium">Maghrib:</span> {testResult.maghrib}
                </div>
                <div>
                  <span className="font-medium">Isya:</span> {testResult.isya}
                </div>
                <div>
                  <span className="font-medium">Terbit:</span> {testResult.terbit}
                </div>
                <div>
                  <span className="font-medium">Imsak:</span> {testResult.imsak}
                </div>
                <div>
                  <span className="font-medium">Dhuha:</span> {testResult.dhuha}
                </div>
              </div>
              <p className="text-xs text-green-700 mt-2">
                Tanggal: {testResult.tanggal}
              </p>
            </div>
          )}

          {testError && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">❌ Gagal</h4>
              <p className="text-red-700">{testError}</p>
            </div>
          )}
        </div>

        {/* Information */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="font-semibold text-amber-800 mb-2">ℹ️ Informasi Penting</h4>
          <ul className="text-sm text-amber-700 space-y-1">
            <li>• Pilih kota terdekat dengan lokasi masjid Anda</li>
            <li>• Waktu sholat diambil dari API MyQuran yang terpercaya</li>
            <li>• Ada {cities.length} kota tersedia di seluruh Indonesia</li>
            <li>• Data tersimpan dalam cache selama 24 jam untuk performa</li>
            <li>• Pergantian kota akan langsung memperbarui waktu sholat di layar</li>
            <li>• Pastikan koneksi internet stabil untuk update data otomatis</li>
          </ul>
        </div>
      </div>
    </div>
  )
}