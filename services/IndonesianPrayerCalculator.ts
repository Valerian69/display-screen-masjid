import moment from 'moment-hijri'

export interface PrayerTimes {
  subuh: string
  terbit: string
  dzuhur: string
  asr: string
  maghrib: string
  isya: string
}

export interface CityCoordinates {
  latitude: number
  longitude: number
  elevation: number
  timezone: number
}

// Major Indonesian cities with coordinates
export const INDONESIAN_CITIES_COORDS: Record<string, CityCoordinates> = {
  jakarta: { latitude: -6.2088, longitude: 106.8456, elevation: 8, timezone: 7 },
  surabaya: { latitude: -7.2575, longitude: 112.7521, elevation: 5, timezone: 7 },
  bandung: { latitude: -6.9175, longitude: 107.6191, elevation: 715, timezone: 7 },
  medan: { latitude: 3.5952, longitude: 98.6722, elevation: 25, timezone: 7 },
  semarang: { latitude: -6.9667, longitude: 110.4167, elevation: 10, timezone: 7 },
  makassar: { latitude: -5.1477, longitude: 119.4327, elevation: 14, timezone: 8 },
  palembang: { latitude: -2.9761, longitude: 104.7754, elevation: 10, timezone: 7 },
  tangerang: { latitude: -6.1783, longitude: 106.6318, elevation: 32, timezone: 7 },
  depok: { latitude: -6.4025, longitude: 106.7942, elevation: 95, timezone: 7 },
  bekasi: { latitude: -6.2383, longitude: 106.9756, elevation: 18, timezone: 7 },
  bogor: { latitude: -6.6014, longitude: 106.7950, elevation: 250, timezone: 7 },
  batam: { latitude: 1.1316, longitude: 104.0475, elevation: 30, timezone: 7 },
  pekanbaru: { latitude: 0.5071, longitude: 101.4478, elevation: 10, timezone: 7 },
  bandarlampung: { latitude: -5.4283, longitude: 105.2611, elevation: 50, timezone: 7 },
  malang: { latitude: -7.9797, longitude: 112.6304, elevation: 471, timezone: 7 },
  yogyakarta: { latitude: -7.7956, longitude: 110.3695, elevation: 108, timezone: 7 },
  solo: { latitude: -7.5556, longitude: 110.8289, elevation: 105, timezone: 7 },
  denpasar: { latitude: -8.6705, longitude: 115.2126, elevation: 8, timezone: 8 },
  balikpapan: { latitude: -1.2654, longitude: 116.8313, elevation: 16, timezone: 8 },
  samarinda: { latitude: -0.5021, longitude: 117.1537, elevation: 7, timezone: 8 },
  pontianak: { latitude: -0.0272, longitude: 109.3428, elevation: 1, timezone: 7 },
  manado: { latitude: 1.4748, longitude: 124.8422, elevation: 19, timezone: 8 },
  mataram: { latitude: -8.6500, longitude: 116.4013, elevation: 15, timezone: 8 },
  kupang: { latitude: -10.1705, longitude: 123.6091, elevation: 23, timezone: 8 },
  jayapura: { latitude: -2.5489, longitude: 140.7035, elevation: 100, timezone: 9 },
  ambon: { latitude: -3.6953, longitude: 128.1816, elevation: 10, timezone: 9 },
  ternate: { latitude: 0.7893, longitude: 127.3464, elevation: 30, timezone: 8 },
  kendari: { latitude: -3.9767, longitude: 122.5148, elevation: 24, timezone: 8 },
  palu: { latitude: -0.8937, longitude: 119.8707, elevation: 14, timezone: 8 },
  gorontalo: { latitude: 0.5434, longitude: 123.0589, elevation: 27, timezone: 8 }
}

export class IndonesianPrayerCalculator {
  /**
   * Calculate prayer times using Islamic prayer calculation methods
   * This implementation uses a simplified version of common prayer calculation methods
   */
  calculatePrayerTimes(date: Date, coords: CityCoordinates): PrayerTimes {
    const prayerTimes = this.calculateIslamicPrayerTimes(date, coords)
    return {
      subuh: this.formatTime(prayerTimes.fajr),
      terbit: this.formatTime(prayerTimes.sunrise),
      dzuhur: this.formatTime(prayerTimes.dhuhr),
      asr: this.formatTime(prayerTimes.asr),
      maghrib: this.formatTime(prayerTimes.maghrib),
      isya: this.formatTime(prayerTimes.isha)
    }
  }

  /**
   * Islamic prayer calculation method (simplified)
   */
  private calculateIslamicPrayerTimes(date: Date, coords: CityCoordinates) {
    const momentDate = moment(date)

    // Calculate Julian Day
    const jd = this.getJulianDay(momentDate)

    // Calculate equation of time
    const T = (jd - 2451545.0) / 36525

    // Calculate solar declination
    const delta = this.getSolarDeclination(jd)

    // Calculate prayer times
    const prayerTimes = {
      fajr: this.calculateFajr(momentDate, coords),
      sunrise: this.calculateSunrise(momentDate, coords, delta),
      dhuhr: this.calculateDhuhr(momentDate, coords),
      asr: this.calculateAsr(momentDate, coords, delta),
      maghrib: this.calculateMaghrib(momentDate, coords, delta),
      isha: this.calculateIsha(momentDate, coords, delta)
    }

    return prayerTimes
  }

  private getJulianDay(date: moment.Moment): number {
    const a = Math.floor((14 - date.month()) / 12)
    const y = date.year() + 4800 - a
    const m = date.month() + 12 * a - 3
    return date.date() + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - Math.floor(y / 100) + Math.floor(y / 400) - 32045
  }

  private getSolarDeclination(jd: number): number {
    // Simplified solar declination calculation
    const n = jd - 2451545.0
    const L = 280.466 + 0.9856474 * n
    const g = 357.528 + 0.9856003 * n
    const lambda = (g + 1.915 * Math.sin(this.degToRad(g))) % 360
    const epsilon = 23.439 - 0.0000004 * n

    return epsilon * Math.sin(this.degToRad(lambda))
  }

  private degToRad(degrees: number): number {
    return degrees * (Math.PI / 180)
  }

  private radToDeg(radians: number): number {
    return radians * (180 / Math.PI)
  }

  private calculateFajr(date: moment.Moment, coords: CityCoordinates): Date {
    // Fajr calculation (simplified)
    const angle = 18 // degrees below horizon
    const declination = this.getSolarDeclination(this.getJulianDay(date))
    const hourAngle = this.calculateHourAngleForAngle(angle, coords.latitude, declination)

    return this.adjustTimezone(date, hourAngle, coords.timezone)
  }

  private calculateSunrise(date: moment.Moment, coords: CityCoordinates, declination: number): Date {
    const angle = -0.833 // degrees (center of sun)
    const hourAngle = this.calculateHourAngleForAngle(angle, coords.latitude, declination)

    return this.adjustTimezone(date, hourAngle, coords.timezone)
  }

  private calculateDhuhr(date: moment.Moment, coords: CityCoordinates): Date {
    // Dhuhr is when sun is at its highest point
    const solarNoon = new Date(date.toDate().getTime() + (12 - coords.longitude / 15) * 60 * 60 * 1000)
    return solarNoon
  }

  private calculateAsr(date: moment.Moment, coords: CityCoordinates, declination: number): Date {
    // Asr calculation (Shafi'i school)
    const shadowLength = 1 // shadow length factor
    const asrAngle = this.radToDeg(Math.atan(1 + Math.tan(this.degToRad(Math.abs(90 - coords.latitude - declination)))))

    const hourAngleForAsr = this.calculateHourAngleForAngle(asrAngle, coords.latitude, declination)
    return this.adjustTimezone(date, hourAngleForAsr, coords.timezone)
  }

  private calculateMaghrib(date: moment.Moment, coords: CityCoordinates, declination: number): Date {
    // Maghrib is at sunset
    const angle = -0.833 // degrees
    const hourAngle = this.calculateHourAngleForAngle(angle, coords.latitude, declination)

    return this.adjustTimezone(date, hourAngle, coords.timezone)
  }

  private calculateIsha(date: moment.Moment, coords: CityCoordinates, declination: number): Date {
    // Isha calculation (18 degrees below horizon)
    const angle = 18
    const hourAngle = this.calculateHourAngleForAngle(angle, coords.latitude, declination)

    return this.adjustTimezone(date, hourAngle, coords.timezone)
  }

  private calculateHourAngleForAngle(angle: number, latitude: number, declination: number): number {
    return this.radToDeg(Math.acos((Math.sin(this.degToRad(-angle)) - Math.sin(this.degToRad(latitude)) * Math.sin(this.degToRad(declination))) /
           (Math.cos(this.degToRad(latitude)) * Math.cos(this.degToRad(declination)))))
  }

  private adjustTimezone(date: moment.Moment, hourAngle: number, timezone: number): Date {
    const timeOffset = (12 + hourAngle / 15 - timezone) * 60 * 60 * 1000
    return new Date(date.toDate().getTime() + timeOffset)
  }

  private formatTime(date: Date): string {
    return moment(date).format('HH:mm')
  }

  /**
   * Get prayer times for a specific Indonesian city
   */
  getPrayerTimesForCity(cityId: string, date: Date = new Date()): PrayerTimes {
    const coords = INDONESIAN_CITIES_COORDS[cityId] || INDONESIAN_CITIES_COORDS.jakarta
    return this.calculatePrayerTimes(date, coords)
  }

  /**
   * Get city coordinates by ID
   */
  getCityCoordinates(cityId: string): CityCoordinates | undefined {
    return INDONESIAN_CITIES_COORDS[cityId]
  }

  /**
   * Search cities by name
   */
  searchCities(query: string): Array<{ id: string; name: string; province: string; coordinates: CityCoordinates }> {
    const lowercaseQuery = query.toLowerCase()

    return Object.entries(INDONESIAN_CITIES_COORDS)
      .filter(([id]) => {
        const cityName = id.charAt(0).toUpperCase() + id.slice(1)
        return cityName.toLowerCase().includes(lowercaseQuery)
      })
      .map(([id, coords]) => ({
        id,
        name: id.charAt(0).toUpperCase() + id.slice(1),
        province: this.getProvinceName(id),
        coordinates: coords
      }))
  }

  private getProvinceName(cityId: string): string {
    // Simple province mapping
    const provinces: Record<string, string> = {
      jakarta: 'DKI Jakarta',
      surabaya: 'Jawa Timur',
      bandung: 'Jawa Barat',
      medan: 'Sumatera Utara',
      semarang: 'Jawa Tengah',
      makassar: 'Sulawesi Selatan',
      palembang: 'Sumatera Selatan',
      tangerang: 'Banten',
      depok: 'Jawa Barat',
      bekasi: 'Jawa Barat',
      bogor: 'Jawa Barat',
      batam: 'Kepulauan Riau',
      pekanbaru: 'Riau',
      bandarlampung: 'Lampung',
      malang: 'Jawa Timur',
      yogyakarta: 'DI Yogyakarta',
      solo: 'Jawa Tengah',
      denpasar: 'Bali',
      balikpapan: 'Kalimantan Timur',
      samarinda: 'Kalimantan Timur',
      pontianak: 'Kalimantan Barat',
      manado: 'Sulawesi Utara',
      mataram: 'Nusa Tenggara Barat',
      kupang: 'Nusa Tenggara Timur',
      jayapura: 'Papua',
      ambon: 'Maluku',
      ternate: 'Maluku Utara',
      kendari: 'Sulawesi Tenggara',
      palu: 'Sulawesi Tengah',
      gorontalo: 'Gorontalo'
    }

    return provinces[cityId] || ''
  }
}

// Create singleton instance
export const indonesianPrayerCalculator = new IndonesianPrayerCalculator()