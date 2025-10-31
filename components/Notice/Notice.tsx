'use client'

import { useState, useEffect } from 'react'
import { adminService } from '@/services/AdminService'
import { Announcement } from '@/types/AdminTypes'

export default function Notice() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [currentAnnouncement, setCurrentAnnouncement] = useState<Announcement | null>(null)

  useEffect(() => {
    // Load announcements from admin service
    const config = adminService.getMosqueConfig('default-mosque')
    const activeAnnouncements = config.announcements.filter(a => {
      if (!a.isActive) return false

      const now = new Date()
      if (a.startTime && new Date(a.startTime) > now) return false
      if (a.endTime && new Date(a.endTime) < now) return false

      return true
    })

    setAnnouncements(activeAnnouncements)

    if (activeAnnouncements.length > 0) {
      // Show urgent announcements first, then rotate through others
      const urgentAnnouncements = activeAnnouncements.filter(a => a.type === 'urgent')
      const otherAnnouncements = activeAnnouncements.filter(a => a.type !== 'urgent')

      if (urgentAnnouncements.length > 0) {
        setCurrentAnnouncement(urgentAnnouncements[0])
      } else if (otherAnnouncements.length > 0) {
        setCurrentAnnouncement(otherAnnouncements[0])
      }
    }
  }, [])

  const getAnnouncementIcon = (type: string) => {
    switch (type) {
      case 'urgent':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            className="h-20 w-auto text-red-300"
            fill="currentColor"
          >
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        )
      case 'warning':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            className="h-20 w-auto text-yellow-300"
            fill="currentColor"
          >
            <path d="M1 21h22L12 2 1 21zm12-3h-2v-2h2v2zm0-4h-2v-4h2v4z"/>
          </svg>
        )
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={24}
            height={24}
            viewBox="0 0 24 24"
            className="h-20 w-auto text-blue-300"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        )
    }
  }

  const getAnnouncementColor = (type: string) => {
    switch (type) {
      case 'urgent': return 'text-red-300'
      case 'warning': return 'text-yellow-300'
      default: return 'text-blue-300'
    }
  }

  // If there are active announcements, show them
  if (currentAnnouncement) {
    return (
      <div className="flex text-white text-center md:text-left">
        <div className="mr-4 flex-shrink-0 self-center">
          {getAnnouncementIcon(currentAnnouncement.type)}
        </div>
        <div>
          <p className={`font-bold text-lg md:text-xl mb-1 ${getAnnouncementColor(currentAnnouncement.type)}`}>
            {currentAnnouncement.title}
          </p>
          <p className="italic text-xl md:text-2xl md:max-w-lg hidden md:block">
            {currentAnnouncement.message}
          </p>
        </div>
      </div>
    )
  }

  // Default notice if no active announcements
  return (
    <div className="flex text-white text-center md:text-left">
      <div className="mr-4 flex-shrink-0 self-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width={24}
          height={24}
          viewBox="0 0 24 24"
          className="h-20 w-auto"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7.159 3.185C7.415 3.066 7.699 3 8 3h8a2 2 0 0 1 2 2v9m0 4v1a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6m5-2h2M3 3l18 18m-9-4v.01"
          />
        </svg>
      </div>
      <div>
        <p className="italic text-xl md:text-2xl md:max-w-lg hidden md:block">
          Mohon pastikan ponsel Anda dalam mode senyap di ruang sholat.
        </p>
      </div>
    </div>
  )
}
