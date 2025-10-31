import axios from 'axios'

export interface IndonesianPrayerTime {
  tanggal: string
  imsak: string
  subuh: string
  terbit: string
  dhuha: string
  dzuhur: string
  ashar: string
  maghrib: string
  isya: string
}

export interface IndonesianPrayerResponse {
  status: boolean
  data: IndonesianPrayerTime[]
}

export interface IndonesianLocation {
  id: string
  lokasi: string
  provinsi: string
}

// List of major Indonesian cities with their coordinates for Islamic prayer calculations
export const INDONESIAN_CITIES: IndonesianLocation[] = [
  { id: 'jakarta', lokasi: 'Jakarta', provinsi: 'DKI Jakarta' },
  { id: 'surabaya', lokasi: 'Surabaya', provinsi: 'Jawa Timur' },
  { id: 'bandung', lokasi: 'Bandung', provinsi: 'Jawa Barat' },
  { id: 'medan', lokasi: 'Medan', provinsi: 'Sumatera Utara' },
  { id: 'semarang', lokasi: 'Semarang', provinsi: 'Jawa Tengah' },
  { id: 'makassar', lokasi: 'Makassar', provinsi: 'Sulawesi Selatan' },
  { id: 'palembang', lokasi: 'Palembang', provinsi: 'Sumatera Selatan' },
  { id: 'tangerang', lokasi: 'Tangerang', provinsi: 'Banten' },
  { id: 'depok', lokasi: 'Depok', provinsi: 'Jawa Barat' },
  { id: 'bekasi', lokasi: 'Bekasi', provinsi: 'Jawa Barat' },
  { id: 'bogor', lokasi: 'Bogor', provinsi: 'Jawa Barat' },
  { id: 'batam', lokasi: 'Batam', provinsi: 'Kepulauan Riau' },
  { id: 'pekanbaru', lokasi: 'Pekanbaru', provinsi: 'Riau' },
  { id: 'bandarlampung', lokasi: 'Bandar Lampung', provinsi: 'Lampung' },
  { id: 'malang', lokasi: 'Malang', provinsi: 'Jawa Timur' },
  { id: 'yogyakarta', lokasi: 'Yogyakarta', provinsi: 'DI Yogyakarta' },
  { id: 'solo', lokasi: 'Surakarta', provinsi: 'Jawa Tengah' },
  { id: 'denpasar', lokasi: 'Denpasar', provinsi: 'Bali' },
  { id: 'balikpapan', lokasi: 'Balikpapan', provinsi: 'Kalimantan Timur' },
  { id: 'samarinda', lokasi: 'Samarinda', provinsi: 'Kalimantan Timur' },
  { id: 'pontianak', lokasi: 'Pontianak', provinsi: 'Kalimantan Barat' },
  { id: 'manado', lokasi: 'Manado', provinsi: 'Sulawesi Utara' },
  { id: 'mataram', lokasi: 'Mataram', provinsi: 'Nusa Tenggara Barat' },
  { id: 'kupang', lokasi: 'Kupang', provinsi: 'Nusa Tenggara Timur' },
  { id: 'jayapura', lokasi: 'Jayapura', provinsi: 'Papua' },
  { id: 'ambon', lokasi: 'Ambon', provinsi: 'Maluku' },
  { id: 'ternate', lokasi: 'Ternate', provinsi: 'Maluku Utara' },
  { id: 'kendari', lokasi: 'Kendari', provinsi: 'Sulawesi Tenggara' },
  { id: 'palu', lokasi: 'Palu', provinsi: 'Sulawesi Tengah' },
  { id: 'gorontalo', lokasi: 'Gorontalo', provinsi: 'Gorontalo' }
]

class IndonesianPrayerService {
  private baseUrl = 'https://api.myquran.com/v2/sholat'

  /**
   * Get daily prayer times for an Indonesian city
   */
  async getDailyPrayerTimes(cityId: string, date?: string): Promise<IndonesianPrayerTime> {
    try {
      const today = date || new Date().toISOString().split('T')[0].replace(/-/g, '/')
      const url = `${this.baseUrl}/jadwal/${cityId}/${today}`

      const response = await axios.get<IndonesianPrayerResponse>(url)

      if (!response.data.status) {
        throw new Error('Failed to fetch prayer times')
      }

      return response.data.data[0] // Return first day's data
    } catch (error) {
      console.error('Error fetching Indonesian prayer times:', error)
      // Return fallback prayer times instead of throwing
      return this.getFallbackPrayerTimes()
    }
  }

  /**
   * Get monthly prayer times for an Indonesian city
   */
  async getMonthlyPrayerTimes(cityId: string, year: number, month: number): Promise<IndonesianPrayerTime[]> {
    try {
      const url = `${this.baseUrl}/jadwal/${cityId}/${year}/${month.toString().padStart(2, '0')}`

      const response = await axios.get<IndonesianPrayerResponse>(url)

      if (!response.data.status) {
        throw new Error('Failed to fetch monthly prayer times')
      }

      return response.data.data
    } catch (error) {
      console.error('Error fetching monthly prayer times:', error)
      throw error
    }
  }

  /**
   * Convert Indonesian API format to the app's prayer time format
   */
  convertToAppFormat(indonesianData: IndonesianPrayerTime, month: number, day: number) {
    return {
      month: month.toString(),
      month_label: this.getMonthName(month),
      day_of_month: day.toString(),
      sunrise_start: indonesianData.terbit,
      fajr: {
        start: indonesianData.subuh,
        congregation_start: this.calculateCongregationTime(indonesianData.subuh, 15)
      },
      zuhr: {
        start: indonesianData.dzuhur,
        congregation_start: this.calculateCongregationTime(indonesianData.dzuhur, 15)
      },
      asr: {
        start: indonesianData.ashar,
        congregation_start: this.calculateCongregationTime(indonesianData.ashar, 15)
      },
      maghrib: {
        start: indonesianData.maghrib,
        congregation_start: this.calculateCongregationTime(indonesianData.maghrib, 5)
      },
      isha: {
        start: indonesianData.isya,
        congregation_start: this.calculateCongregationTime(indonesianData.isya, 15)
      }
    }
  }

  /**
   * Calculate congregation time (add minutes to prayer time)
   */
  private calculateCongregationTime(prayerTime: string, addMinutes: number): string {
    const [hours, minutes] = prayerTime.split(':').map(Number)
    const totalMinutes = hours * 60 + minutes + addMinutes

    const newHours = Math.floor(totalMinutes / 60) % 24
    const newMinutes = totalMinutes % 60

    return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`
  }

  /**
   * Get month name in Bahasa Indonesia
   */
  private getMonthName(month: number): string {
    const months = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ]
    return months[month - 1]
  }

  /**
   * Search for cities by name
   */
  searchCities(query: string): IndonesianLocation[] {
    const lowercaseQuery = query.toLowerCase()
    return INDONESIAN_CITIES.filter(city =>
      city.lokasi.toLowerCase().includes(lowercaseQuery) ||
      city.provinsi.toLowerCase().includes(lowercaseQuery)
    )
  }

  /**
   * Get city by ID
   */
  getCityById(id: string): IndonesianLocation | undefined {
    return INDONESIAN_CITIES.find(city => city.id === id)
  }

  /**
   * Get fallback prayer times when API fails
   */
  private getFallbackPrayerTimes(): IndonesianPrayerTime {
    const now = new Date()
    return {
      tanggal: now.toLocaleDateString('id-ID'),
      imsak: '04:30',
      subuh: '04:45',
      terbit: '06:00',
      dhuha: '07:15',
      dzuhur: '12:00',
      ashar: '15:30',
      maghrib: '18:00',
      isya: '19:15'
    }
  }
}

export const indonesianPrayerService = new IndonesianPrayerService()