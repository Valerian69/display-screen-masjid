export const translations = {
  // Prayer names
  prayers: {
    fajr: "Subuh",
    zuhr: "Dzuhur",
    asr: "Ashar",
    maghrib: "Maghrib",
    isha: "Isya",
    sunrise: "Terbit",
    jummah: "Jumat"
  },

  // Table headers
  table: {
    prayerTime: "Waktu Sholat",
    begins: "Mulai",
    jamaah: "Jama'ah",
    tomorrow: "Besok"
  },

  // Labels
  labels: {
    jamaahTimesFor: "Waktu Jama'ah untuk",
    mosque: "Masjid",
    address: "Alamat",
    website: "Website",
    calendar: "Kalender",
    notice: "Pengumuman",
    prayerTimes: "Waktu Sholat"
  },

  // Day labels
  days: {
    today: "Hari Ini",
    tomorrow: "Besok",
    friday: "Jumat"
  },

  // Meta descriptions
  meta: {
    title: "Waktu Sholat | Proyek Layar Masjid oleh MosqueOS",
    description: "Layar digital untuk menampilkan waktu sholat masjid"
  }
}

// Helper function to get prayer name in Bahasa
export function getPrayerName(prayerKey: string): string {
  const prayerKeyLower = prayerKey.toLowerCase()
  return translations.prayers[prayerKeyLower as keyof typeof translations.prayers] || prayerKey
}