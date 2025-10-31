'use client'

import { useState, useEffect } from 'react'
import Blackout from "@/components/Blackout/Blackout"
import Clock from "@/components/Clock/Clock"
import Date from "@/components/Date/Date"
import MosqueMetadata from "@/components/MosqueMetadata/MosqueMetadata"
import NextPrayerDaysTiles from "@/components/UpcomingPrayerDayTiles/UpcomingPrayerDayTiles"
import Notice from "@/components/Notice/Notice"
import SunriseJummahTiles from "@/components/SunriseJummahTiles/SunriseJummahTiles"
import PrayerTimes from "@/components/PrayerTimes/PrayerTimes"
import ServiceWorker from "@/components/ServiceWorker/ServiceWorker"
import SlidingBanner from "@/components/SlidingBanner/SlidingBanner"
import {
  getJummahTimes,
  getMetaData,
  getPrayerTimesForUpcomingDays,
  getPrayerTimesForToday,
  getPrayerTimesForTomorrow,
} from "@/services/EnhancedMosqueDataService"
import type {
  DailyPrayerTime,
  UpcomingPrayerTimes,
} from "@/types/DailyPrayerTimeType"
import type { JummahTimes } from "@/types/JummahTimesType"
import type { MosqueMetadataType } from "@/types/MosqueDataType"
import UpcomingPrayerDayTiles from "@/components/UpcomingPrayerDayTiles/UpcomingPrayerDayTiles"
import { adminService } from "@/services/AdminService"
import { translations } from "@/constants/translations"
import AnnouncementMarquee from "@/components/AnnouncementMarquee/AnnouncementMarquee"

export default function Home() {
  const [today, setToday] = useState<DailyPrayerTime | null>(null)
  const [tomorrow, setTomorrow] = useState<DailyPrayerTime | null>(null)
  const [jummahTimes, setJummahTimes] = useState<JummahTimes | null>(null)
  const [mosqueMetadata, setMosqueMetadata] = useState<MosqueMetadataType | null>(null)
  const [upcomingPrayerDays, setUpcomingPrayerDays] = useState<UpcomingPrayerTimes[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Initial data fetch
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          todayData,
          tomorrowData,
          jummahData,
          metadataData,
          upcomingData
        ] = await Promise.all([
          getPrayerTimesForToday(),
          getPrayerTimesForTomorrow(),
          getJummahTimes(),
          getMetaData(),
          getPrayerTimesForUpcomingDays()
        ])

        setToday(todayData)
        setTomorrow(tomorrowData)
        setJummahTimes(jummahData)
        setMosqueMetadata(metadataData)
        setUpcomingPrayerDays(upcomingData)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()

      // Set up polling for updates every 10 seconds
    const interval = setInterval(() => {
      getMetaData().then(setMosqueMetadata).catch(console.error)
    }, 10000)

    // Listen for admin updates via custom events
    const handleDataUpdate = async () => {
      try {
        // Refresh all data when admin updates occur
        const [
          metadataData,
          todayData,
          tomorrowData,
          jummahData,
          upcomingData
        ] = await Promise.all([
          getMetaData(),
          getPrayerTimesForToday(),
          getPrayerTimesForTomorrow(),
          getJummahTimes(),
          getPrayerTimesForUpcomingDays()
        ])

        setMosqueMetadata(metadataData)
        setToday(todayData)
        setTomorrow(tomorrowData)
        setJummahTimes(jummahData)
        setUpcomingPrayerDays(upcomingData)
      } catch (error) {
        console.error('Error refreshing data after admin update:', error)
      }
    }

    window.addEventListener('mosqueDataUpdated', handleDataUpdate)

    return () => {
      clearInterval(interval)
      window.removeEventListener('mosqueDataUpdated', handleDataUpdate)
    }
  }, [])

  if (isLoading || !today || !tomorrow || !jummahTimes || !mosqueMetadata) {
    return (
      <div className="min-h-screen bg-mosqueGreen flex items-center justify-center">
        <div className="text-white text-xl">Memuat...</div>
      </div>
    )
  }

  let slides = [
    <SunriseJummahTiles
      sunrise={today.sunrise_start}
      jummahTimes={jummahTimes}
      key={"sunrise_jummah_times"}
    />,
    ...upcomingPrayerDays.map((times, index) => (
      <UpcomingPrayerDayTiles times={times} key={`upcoming_${index}`} />
    )),
  ]

  return (
    <>
      <main className="md:p-5">
        <div className="md:grid md:grid-cols-8">
          <div className="md:col-span-3">
            <div className="p-4 md:p-6">
              <Clock />
            </div>
            <div className="p-4 md:p-6">
              <Date />
            </div>
            <div className="p-4 md:p-6">
              <MosqueMetadata metadata={mosqueMetadata} />
            </div>
          </div>
          <div className="p-4 md:p-6 md:col-span-5">
            <PrayerTimes today={today} tomorrow={tomorrow} />
          </div>
        </div>
        <div className="p-4 md:p-6">
          <SlidingBanner slides={slides} />
        </div>
        <ServiceWorker />
      </main>
      <AnnouncementMarquee />
      <Blackout prayerTimeToday={today} />

      {/* Admin Access Link */}
      <div className="fixed bottom-4 right-4 z-50">
        <a
          href="/login"
          className="bg-mosqueGreen-dark hover:bg-mosqueGreen-darker text-white px-3 py-2 rounded-lg shadow-lg text-sm opacity-75 hover:opacity-100 transition-opacity"
          title="Admin Panel"
        >
          ⚙️ Admin
        </a>
      </div>
    </>
  )
}