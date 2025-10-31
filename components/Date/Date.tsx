"use client"

import moment from "moment-hijri"
import "moment/locale/id" // Import Indonesian locale

export default function Date() {
  // Indonesian date format
  const indonesianDate = moment().locale("id").format("dddd D MMMM YYYY")
  // Hijri date in Indonesian format (using custom mapping for Islamic months)
  const hijriDate = getHijriDateIndonesian()

  return (
    <div className="text-white text-center md:text-left">
      <p className="font-bold text-2xl md:text-5xl">{hijriDate}</p>
      <p className="mt-3 md:mt-5 text-2xl md:text-4xl">{indonesianDate}</p>
    </div>
  )
}

// Function to convert Hijri date to Indonesian format
function getHijriDateIndonesian(): string {
  const hijriMonths = [
    "Muharram",
    "Shafar",
    "Rabi'ul Awal",
    "Rabi'ul Akhir",
    "Jumadil Awwal",
    "Jumadil Akhir",
    "Rajab",
    "Sya'ban",
    "Ramadhan",
    "Syawal",
    "Dzulqo'dah",
    "Dzulhijjah"
  ]

  const momentHijri = moment().locale("en")
  const day = momentHijri.format("iD")
  const monthIndex = parseInt(momentHijri.format("iM")) - 1
  const year = momentHijri.format("iYYYY")
  const monthName = hijriMonths[monthIndex]

  return `${day} ${monthName} ${year} H`
}
