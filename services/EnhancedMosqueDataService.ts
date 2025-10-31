import {
  DailyPrayerTime,
  UpcomingPrayerTimes,
} from "@/types/DailyPrayerTimeType"
import { JummahTimes } from "@/types/JummahTimesType"
import { MosqueMetadataType, MosqueData } from "@/types/MosqueDataType"
import { adminService } from "@/services/AdminService"
import { indonesianPrayerService } from "@/services/IndonesianPrayerService"
import { myQuranService } from "@/services/MyQuranService"
import moment from "moment"

const ORIGINAL_API_ENDPOINT = process.env.MOSQUE_API_ENDPOINT ?? ""
const DAY_FOR_UPCOMING = parseInt(process.env?.UPCOMING_PRAYER_DAY ?? "3")

export class EnhancedMosqueDataService {
  private useIndonesianAPI: boolean = false
  private useMyQuranAPI: boolean = true

  constructor() {
    // Use MyQuran API as primary
    this.useIndonesianAPI = false
    this.useMyQuranAPI = true
  }

  async getMosqueData(): Promise<MosqueData> {
    if (this.useMyQuranAPI) {
      return this.getMyQuranMosqueData()
    } else if (this.useIndonesianAPI) {
      return this.getIndonesianMosqueData()
    } else {
      return this.getOriginalMosqueData()
    }
  }

  private async getMyQuranMosqueData(): Promise<MosqueData> {
    try {
      // Get mosque configuration from admin service
      const defaultConfig = adminService.getMosqueConfig('default-mosque')

      const myQuranCityId = defaultConfig.cityId || '1301' // Use admin config cityId directly

      // Get prayer times for current month from MyQuran API
      const now = moment()
      const prayerTimes = await myQuranService.getMonthlyPrayerTimes(
        myQuranCityId,
        now.year(),
        now.month() + 1
      )

      // Create mosque metadata
      const metadata: MosqueMetadataType = {
        name: defaultConfig.name,
        logo_url: defaultConfig.logo_url || '',
        address: defaultConfig.address,
        website: defaultConfig.website || ''
      }

      // Create jummah times (example - would be configurable)
      const jummahTimes: JummahTimes = [
        { label: "Jumat 1", time: "12:45" },
        { label: "Jumat 2", time: "13:15" },
        { label: "Jumat 3", time: "13:45" }
      ]

      return {
        metadata,
        jummah_times: jummahTimes,
        prayer_times: prayerTimes
      }
    } catch (error) {
      console.error('Error fetching MyQuran mosque data:', error)
      // Fallback to Indonesian calculator
      return this.getIndonesianMosqueData()
    }
  }

  private async getIndonesianMosqueData(): Promise<MosqueData> {
    try {
      // Get mosque configuration from admin service
      const defaultConfig = adminService.getMosqueConfig('default-mosque')

      // Get prayer times for current month from Indonesian API
      const now = moment()
      const prayerTimes = await indonesianPrayerService.getMonthlyPrayerTimes(
        defaultConfig.cityId || 'jakarta',
        now.year(),
        now.month() + 1
      )

      // Convert to app format
      const convertedPrayerTimes = prayerTimes.map((prayer, index) => {
        const dayOfMonth = (index + 1).toString()
        const month = (now.month() + 1).toString()
        return indonesianPrayerService.convertToAppFormat(prayer, parseInt(month), index + 1)
      })

      // Create mosque metadata
      const metadata: MosqueMetadataType = {
        name: defaultConfig.name,
        logo_url: defaultConfig.logo_url || '',
        address: defaultConfig.address,
        website: defaultConfig.website || ''
      }

      // Create jummah times (example - would be configurable)
      const jummahTimes: JummahTimes = [
        { label: "Jumat 1", time: "12:45" },
        { label: "Jumat 2", time: "13:15" },
        { label: "Jumat 3", time: "13:45" }
      ]

      return {
        metadata,
        jummah_times: jummahTimes,
        prayer_times: convertedPrayerTimes
      }
    } catch (error) {
      console.error('Error fetching Indonesian mosque data:', error)
      // Fallback to example data
      return this.getFallbackData()
    }
  }

  private async getOriginalMosqueData(): Promise<MosqueData> {
    const response = await fetch(ORIGINAL_API_ENDPOINT, {
      next: { revalidate: 30 },
    })
    return response.json()
  }

  private getFallbackData(): MosqueData {
    // Fallback example data
    return {
      metadata: {
        name: "Masjid Islam",
        logo_url: "",
        address: "Alamat Masjid, Indonesia",
        website: ""
      },
      jummah_times: [
        { label: "Jumat 1", time: "12:45" },
        { label: "Jumat 2", time: "13:15" }
      ],
      prayer_times: this.generateFallbackPrayerTimes()
    }
  }

  private generateFallbackPrayerTimes(): DailyPrayerTime[] {
    const times: DailyPrayerTime[] = []
    const currentMonth = moment().month() + 1
    const daysInMonth = moment().daysInMonth()

    for (let day = 1; day <= Math.min(daysInMonth, 31); day++) {
      times.push({
        month: currentMonth.toString(),
        month_label: moment().format('MMMM'),
        day_of_month: day.toString(),
        sunrise_start: "06:00",
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
          congregation_start: "18:05"
        },
        isha: {
          start: "19:15",
          congregation_start: "19:30"
        }
      })
    }

    return times
  }

  private calculateCongregationTime(prayerTime: string, addMinutes: number): string {
    const [hours, minutes] = prayerTime.split(':').map(Number)
    const totalMinutes = hours * 60 + minutes + addMinutes

    const newHours = Math.floor(totalMinutes / 60) % 24
    const newMinutes = totalMinutes % 60

    return `${newHours.toString().padStart(2, '0')}:${newMinutes.toString().padStart(2, '0')}`
  }

  async getPrayerTimeForDayMonth(
    day_of_month: string,
    month: string,
  ): Promise<DailyPrayerTime> {
    if (this.useMyQuranAPI) {
      return this.getMyQuranPrayerTimeForDayMonth(parseInt(day_of_month), parseInt(month))
    } else if (this.useIndonesianAPI) {
      return this.getIndonesianPrayerTimeForDayMonth(parseInt(day_of_month), parseInt(month))
    } else {
      return this.getOriginalPrayerTimeForDayMonth(day_of_month, month)
    }
  }

  private async getMyQuranPrayerTimeForDayMonth(day: number, month: number): Promise<DailyPrayerTime> {
    try {
      const config = adminService.getMosqueConfig('default-mosque')

      // Use the city ID directly from admin config (should be MyQuran ID format)
      const myQuranCityId = config.cityId || '1301' // Default to Jakarta
      console.log('🏙️ City ID being used for prayer times:', myQuranCityId, 'from config:', config.cityId)
      const now = moment()

      const prayerTime = await myQuranService.getPrayerTimes(
        myQuranCityId,
        now.year(),
        month,
        day
      )

      return prayerTime
    } catch (error) {
      console.error('Error fetching MyQuran prayer time:', error)
      // Fallback to Indonesian calculator
      return this.getIndonesianPrayerTimeForDayMonth(day, month)
    }
  }

  private async getIndonesianPrayerTimeForDayMonth(day: number, month: number): Promise<DailyPrayerTime> {
    try {
      const config = adminService.getMosqueConfig('default-mosque')
      const prayerTime = await indonesianPrayerService.getDailyPrayerTimes(config.cityId || 'jakarta')
      return indonesianPrayerService.convertToAppFormat(prayerTime, month, day)
    } catch (error) {
      console.error('Error fetching Indonesian prayer time:', error)
      return this.generateFallbackPrayerTimes()[day - 1] || this.generateFallbackPrayerTimes()[0]
    }
  }

  private async getOriginalPrayerTimeForDayMonth(
    day_of_month: string,
    month: string,
  ): Promise<DailyPrayerTime> {
    const { prayer_times } = await this.getOriginalMosqueData()
    const found = prayer_times.find(pt =>
      pt.day_of_month === day_of_month && pt.month === month
    )
    return found || prayer_times[0]
  }

  async getPrayerTimesForToday(): Promise<DailyPrayerTime> {
    const date = moment()
    return this.getPrayerTimeForDayMonth(date.format("D"), date.format("M"))
  }

  async getPrayerTimesForTomorrow(): Promise<DailyPrayerTime> {
    const date = moment().add(1, "day")
    return this.getPrayerTimeForDayMonth(date.format("D"), date.format("M"))
  }

  async getPrayerTimesForUpcomingDays(
    days: number = DAY_FOR_UPCOMING,
  ): Promise<UpcomingPrayerTimes[]> {
    let data: UpcomingPrayerTimes[] = []
    const today = moment()

    for (let i = 1; i <= days; i++) {
      const date = today.add(i, "day")
      const prayerTime = await this.getPrayerTimeForDayMonth(
        date.format("D"),
        date.format("M")
      )

      data.push({
        ...prayerTime,
        display_date: date.format("ddd D MMM"),
        display_day_label: date.format("ddd")
      })
    }

    return data
  }

  async getAllPrayerTimes(): Promise<DailyPrayerTime[]> {
    if (this.useMyQuranAPI) {
      try {
        const config = adminService.getMosqueConfig('default-mosque')

  
        const myQuranCityId = config.cityId || '1221' // Use admin config or default to Bekasi
        const now = moment()

        const prayerTimes = await myQuranService.getMonthlyPrayerTimes(
          myQuranCityId,
          now.year(),
          now.month() + 1
        )

        return prayerTimes
      } catch (error) {
        console.error('Error getting prayer times from MyQuran API:', error)
        // Fallback to Indonesian calculator
        return await this.getIndonesianPrayerTimes()
      }
    } else if (this.useIndonesianAPI) {
      return await this.getIndonesianPrayerTimes()
    } else {
      try {
        const { prayer_times } = await this.getOriginalMosqueData()
        return prayer_times
      } catch (error) {
        console.error('Error getting original mosque data:', error)
        return this.generateFallbackPrayerTimes()
      }
    }
  }

  private async getIndonesianPrayerTimes(): Promise<DailyPrayerTime[]> {
    try {
      const config = adminService.getMosqueConfig('default-mosque')
      const now = moment()
      const prayerTimes = await indonesianPrayerService.getMonthlyPrayerTimes(
        config.cityId || 'jakarta',
        now.year(),
        now.month() + 1
      )

      return prayerTimes.map((prayer, index) => {
        const month = (now.month() + 1).toString()
        return indonesianPrayerService.convertToAppFormat(prayer, parseInt(month), index + 1)
      })
    } catch (error) {
      console.error('Error getting prayer times from Indonesian API:', error)
      return this.generateFallbackPrayerTimes()
    }
  }

  async getMetaData(): Promise<MosqueMetadataType> {
    if (this.useMyQuranAPI || this.useIndonesianAPI) {
      const config = adminService.getMosqueConfig('default-mosque')
      return {
        name: config.name,
        logo_url: config.logo_url || '',
        address: config.address,
        website: config.website || ''
      }
    } else {
      const { metadata } = await this.getOriginalMosqueData()
      return metadata
    }
  }

  async getJummahTimes(): Promise<JummahTimes> {
    if (this.useMyQuranAPI || this.useIndonesianAPI) {
      // Could be made configurable in the future
      return [
        { label: "Jumat 1", time: "12:45" },
        { label: "Jumat 2", time: "13:15" },
        { label: "Jumat 3", time: "13:45" }
      ]
    } else {
      const { jummah_times } = await this.getOriginalMosqueData()
      return jummah_times
    }
  }
}

// Create singleton instance
export const enhancedMosqueDataService = new EnhancedMosqueDataService()

// Export individual functions for backward compatibility
export const getMosqueData = () => enhancedMosqueDataService.getMosqueData()
export const getPrayerTimeForDayMonth = (day_of_month: string, month: string) =>
  enhancedMosqueDataService.getPrayerTimeForDayMonth(day_of_month, month)
export const getPrayerTimesForToday = () => enhancedMosqueDataService.getPrayerTimesForToday()
export const getPrayerTimesForTomorrow = () => enhancedMosqueDataService.getPrayerTimesForTomorrow()
export const getPrayerTimesForUpcomingDays = (days?: number) =>
  enhancedMosqueDataService.getPrayerTimesForUpcomingDays(days)
export const getAllPrayerTimes = () => enhancedMosqueDataService.getAllPrayerTimes()
export const getMetaData = () => enhancedMosqueDataService.getMetaData()
export const getJummahTimes = () => enhancedMosqueDataService.getJummahTimes()