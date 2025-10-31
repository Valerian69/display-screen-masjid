import axios from 'axios'
import { DailyPrayerTime } from '@/types/DailyPrayerTimeType'
import moment from 'moment'

interface MyQuranCity {
  id: string
  lokasi: string
}

interface MyQuranPrayerResponse {
  status: boolean
  data: {
    id: string
    lokasi: string
    daerah: string
    koordinat: {
      lat: number
      lng: number
    }
    jadwal: {
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
  }
}

export class MyQuranService {
  private readonly BASE_URL = 'https://api.myquran.com/v2'
  private readonly CITY_CACHE_KEY = 'myquran_cities'
  private cityCache: MyQuranCity[] | null = null

  /**
   * Get list of Indonesian cities with their IDs
   */
  async getCities(): Promise<MyQuranCity[]> {
    // Check cache first
    if (this.cityCache) {
      return this.cityCache
    }

    // Try to load from localStorage cache
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem(this.CITY_CACHE_KEY)
      if (cached) {
        try {
          const parsed = JSON.parse(cached)
          const cacheTime = parsed.timestamp
          const now = Date.now()

          // Use cache if it's less than 24 hours old
          if (now - cacheTime < 24 * 60 * 60 * 1000) {
            this.cityCache = parsed.cities
            return this.cityCache
          }
        } catch (error) {
          console.error('Error parsing cached cities:', error)
        }
      }
    }

    // Fetch all cities from MyQuran API
    try {
      const url = `${this.BASE_URL}/sholat/kota/semua`
      console.log('Fetching all cities from MyQuran API:', url)

      const response = await axios.get<{
        status: boolean;
        data: MyQuranCity[];
      }>(url, {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mosque-Display-System/1.0'
        }
      })

      if (response.data.status && response.data.data) {
        // Sort cities by location name for better user experience
        const sortedCities = response.data.data.sort((a, b) =>
          a.lokasi.localeCompare(b.lokasi)
        )

        this.cityCache = sortedCities

        // Cache in localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem(this.CITY_CACHE_KEY, JSON.stringify({
            cities: sortedCities,
            timestamp: Date.now()
          }))
        }

        console.log(`Loaded ${sortedCities.length} cities from MyQuran API`)
        return sortedCities
      } else {
        throw new Error('API returned false status or no data')
      }
    } catch (error) {
      console.error('Error fetching cities from MyQuran API:', error)

      // Fallback to major cities list
      const fallbackCities: MyQuranCity[] = [
        { id: '1301', lokasi: 'KOTA JAKARTA' },
        { id: '1302', lokasi: 'KOTA BOGOR' },
        { id: '1303', lokasi: 'KOTA DEPOK' },
        { id: '1304', lokasi: 'KOTA TANGERANG' },
        { id: '1305', lokasi: 'KOTA BEKASI' },
        { id: '1601', lokasi: 'KOTA BANDUNG' },
        { id: '1501', lokasi: 'KOTA SEMARANG' },
        { id: '1401', lokasi: 'KOTA SURABAYA' },
        { id: '1701', lokasi: 'KOTA DENPASAR' },
        { id: '1201', lokasi: 'KOTA MEDAN' },
        { id: '8201', lokasi: 'KOTA PALEMBANG' },
        { id: '1801', lokasi: 'KOTA MATARAM' },
        { id: '1901', lokasi: 'KOTA PONTIANAK' },
        { id: '7101', lokasi: 'KOTA MANADO' }
      ]

      this.cityCache = fallbackCities
      return fallbackCities
    }
  }

  /**
   * Search for cities by keyword
   */
  async searchCities(keyword: string): Promise<MyQuranCity[]> {
    const cities = await this.getCities()
    return cities.filter(city =>
      city.lokasi.toLowerCase().includes(keyword.toLowerCase())
    )
  }

  /**
   * Get prayer times for a specific city and date
   */
  async getPrayerTimes(cityId: string, year: number, month: number, day: number): Promise<DailyPrayerTime> {
    try {
      // Add debugging
      console.log(`MyQuran API Request: cityId=${cityId}, year=${year}, month=${month}`)

      // Use the confirmed working URL format with full date
      const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`
      const url = `${this.BASE_URL}/sholat/jadwal/${cityId}/${dateStr}`

      try {
        console.log(`Trying MyQuran URL: ${url}`)
        const response = await axios.get<MyQuranPrayerResponse>(url, {
          timeout: 10000,
          headers: {
            'User-Agent': 'Mosque-Display-System/1.0'
          }
        })

        if (response.data.status) {
          console.log('MyQuran API Success:', response.data)
          const jadwal = response.data.data.jadwal
          return this.convertToAppFormat(jadwal, cityId, month, day)
        } else {
          throw new Error('API returned false status')
        }
      } catch (error) {
        console.error('MyQuran API Error:', error)
        throw error
      }
    } catch (error) {
      console.error('Error fetching prayer times from MyQuran API:', error)

      if (axios.isAxiosError(error)) {
        if (error.code === 'ECONNABORTED') {
          throw new Error('Request timeout - please check your internet connection')
        } else if (error.response?.status === 404) {
          throw new Error(`City ID ${cityId} not found or prayer times not available`)
        } else if (error.response?.status === 429) {
          throw new Error('API rate limit exceeded - please try again later')
        } else if (error.response?.status === 400) {
          console.error('400 Error Details:', error.response?.data)
          throw new Error(`Invalid request format - URL: ${error.config?.url}`)
        }
      }

      throw new Error('Failed to fetch prayer times from MyQuran API')
    }
  }

  /**
   * Get prayer times for a month
   */
  async getMonthlyPrayerTimes(cityId: string, year: number, month: number): Promise<DailyPrayerTime[]> {
    try {
      console.log(`MyQuran Monthly Request: cityId=${cityId}, year=${year}, month=${month}`)

      // Get prayer times from MyQuran API for the specified city
      const now = moment()
      const currentPrayerTime = await this.getPrayerTimes(cityId, now.year(), now.month() + 1, now.date())

      // Create prayer times for each day using the same schedule
      const prayerTimes: DailyPrayerTime[] = []
      const daysInMonth = moment(`${year}-${month.toString().padStart(2, '0')}`, 'YYYY-MM').daysInMonth()

      for (let day = 1; day <= daysInMonth; day++) {
        prayerTimes.push({
          ...currentPrayerTime,
          day_of_month: day.toString(),
          month: month.toString(),
          month_label: moment(`${year}-${month.toString().padStart(2, '0')}-01`).format('MMMM')
        })
      }

      return prayerTimes
    } catch (error) {
      console.error('Error fetching monthly prayer times from MyQuran API:', error)
      // Fallback to generating fallback prayer times
      const prayerTimes: DailyPrayerTime[] = []
      const daysInMonth = moment(`${year}-${month.toString().padStart(2, '0')}`, 'YYYY-MM').daysInMonth()

      for (let day = 1; day <= daysInMonth; day++) {
        prayerTimes.push(this.createFallbackPrayerTime(month, day))
      }

      return prayerTimes
    }
  }

  /**
   * Convert MyQuran API response to app format
   */
  private convertToAppFormat(jadwal: any, cityId: string, month: number, day: number): DailyPrayerTime {
    console.log('Converting jadwal:', jadwal)

    const monthLabel = moment(`${2024}-${month.toString().padStart(2, '0')}-01`).format('MMMM')

    // Handle missing or undefined prayer times with fallbacks
    const safeGetTime = (timeField: string, fallback: string): string => {
      const time = jadwal?.[timeField]
      if (!time || typeof time !== 'string') {
        console.warn(`Missing or invalid ${timeField}:`, time, `Using fallback: ${fallback}`)
        return fallback
      }
      return time
    }

    return {
      month: month.toString(),
      month_label: monthLabel,
      day_of_month: day.toString(),
      sunrise_start: safeGetTime('terbit', '05:30'),
      fajr: {
        start: safeGetTime('subuh', '04:30'),
        congregation_start: this.calculateCongregationTime(safeGetTime('subuh', '04:30'), 15)
      },
      zuhr: {
        start: safeGetTime('dzuhur', '12:00'),
        congregation_start: this.calculateCongregationTime(safeGetTime('dzuhur', '12:00'), 15)
      },
      asr: {
        start: safeGetTime('ashar', '15:30'),
        congregation_start: this.calculateCongregationTime(safeGetTime('ashar', '15:30'), 15)
      },
      maghrib: {
        start: safeGetTime('maghrib', '18:00'),
        congregation_start: safeGetTime('maghrib', '18:00') // Maghrib congregation is immediately at sunset
      },
      isha: {
        start: safeGetTime('isya', '19:15'),
        congregation_start: this.calculateCongregationTime(safeGetTime('isya', '19:15'), 15)
      }
    }
  }

  /**
   * Calculate congregation time by adding minutes to prayer time
   */
  private calculateCongregationTime(prayerTime: string | undefined, addMinutes: number): string {
    if (!prayerTime || typeof prayerTime !== 'string') {
      console.warn('Invalid prayer time for congregation calculation:', prayerTime)
      return '00:00' // Return default time if prayer time is invalid
    }

    try {
      const [hours, minutes] = prayerTime.split(':').map(Number)

      if (isNaN(hours) || isNaN(minutes)) {
        console.warn('Invalid time format:', prayerTime)
        return '00:00'
      }

      const totalMinutes = hours * 60 + minutes + addMinutes
      const newHours = Math.floor(totalMinutes / 60) % 24
      const newMinutes = totalMinutes % 60

      return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`
    } catch (error) {
      console.error('Error calculating congregation time:', error)
      return '00:00'
    }
  }

  /**
   * Create fallback prayer time when API fails
   */
  private createFallbackPrayerTime(month: number, day: number): DailyPrayerTime {
    const monthLabel = moment(`${2024}-${month.toString().padStart(2, '0')}-01`).format('MMMM')

    return {
      month: month.toString(),
      month_label: monthLabel,
      day_of_month: day.toString(),
      sunrise_start: "05:30",
      fajr: {
        start: "04:30",
        congregation_start: "04:45"
      },
      zuhr: {
        start: "12:00",
        congregation_start: "12:15"
      },
      asr: {
        start: "15:30",
        congregation_start: "15:45"
      },
      maghrib: {
        start: "18:00",
        congregation_start: "18:00"
      },
      isha: {
        start: "19:15",
        congregation_start: "19:30"
      }
    }
  }

  /**
   * Get today's prayer times for a city
   */
  async getTodayPrayerTimes(cityId: string): Promise<DailyPrayerTime> {
    const now = moment()
    return this.getPrayerTimes(cityId, now.year(), now.month() + 1, now.date())
  }

  /**
   * Get tomorrow's prayer times for a city
   */
  async getTomorrowPrayerTimes(cityId: string): Promise<DailyPrayerTime> {
    const tomorrow = moment().add(1, 'day')
    return this.getPrayerTimes(cityId, tomorrow.year(), tomorrow.month() + 1, tomorrow.date())
  }

  /**
   * Clear city cache
   */
  clearCache(): void {
    this.cityCache = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.CITY_CACHE_KEY)
    }
  }
}

// Create singleton instance
export const myQuranService = new MyQuranService()