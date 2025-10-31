'use client'

import { useState, useEffect } from 'react'
import { adminService } from '@/services/AdminService'
import { Announcement, MosqueConfig } from '@/types/AdminTypes'

export default function AnnouncementMarquee() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [displayText, setDisplayText] = useState('')
  const [mosqueConfig, setMosqueConfig] = useState<MosqueConfig | null>(null)

  useEffect(() => {
    // Load and update announcements and config
    const loadData = () => {
      const config = adminService.getMosqueConfig('default-mosque')
      setMosqueConfig(config)

      const activeAnnouncements = config.announcements.filter(a => {
        if (!a.isActive) return false

        const now = new Date()
        if (a.startTime && new Date(a.startTime) > now) return false
        if (a.endTime && new Date(a.endTime) < now) return false

        return true
      })

      setAnnouncements(activeAnnouncements)

      // Build marquee text
      if (activeAnnouncements.length > 0) {
        const announcementTexts = activeAnnouncements.map(a => {
          // Remove image URLs and clean up the message
          const cleanMessage = a.message
            .replace(/\[Image #\d+\]/g, '') // Remove [Image #1], [Image #2], etc.
            .replace(/https?:\/\/[^\s]+\.(jpg|jpeg|png|gif|webp)/gi, '') // Remove image URLs
            .replace(/\s+/g, ' ') // Replace multiple spaces with single space
            .trim() // Remove leading/trailing whitespace

          return `${a.title}: ${cleanMessage}`
        }).filter(text => text.replace(/^[^:]+:\s*$/, '').trim() !== '') // Remove entries with empty messages

        if (announcementTexts.length > 0) {
          setDisplayText(announcementTexts.join(' • '))
        } else {
          // Default message when all announcements are just images
          setDisplayText('Mohon pastikan ponsel Anda dalam mode senyap di ruang sholat.')
        }
      } else {
        // Default message when no announcements
        setDisplayText('Mohon pastikan ponsel Anda dalam mode senyap di ruang sholat.')
      }
    }

    loadData()

    // Listen for admin updates
    const handleDataUpdate = () => {
      loadData()
    }
    window.addEventListener('mosqueDataUpdated', handleDataUpdate)

    return () => {
      window.removeEventListener('mosqueDataUpdated', handleDataUpdate)
    }
  }, [])

  // If no config or text, don't show the marquee
  if (!displayText || !mosqueConfig) {
    return null
  }

  // Provide default values for backward compatibility
  const marqueeSettings = mosqueConfig.settings.marqueeAnimation || {
    animationDuration: 60,
    fontSize: 'medium' as 'small' | 'medium' | 'large',
    backgroundColor: 'bg-blue-900',
    textColor: 'text-white',
    pauseOnHover: true
  }

  const fontSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  }

  return (
    <div className={`${marqueeSettings.backgroundColor} ${marqueeSettings.textColor} py-3 overflow-hidden`}>
      <div className="relative">
        <div
          className={`flex whitespace-nowrap animate-marquee ${fontSizeClasses[marqueeSettings.fontSize]} ${marqueeSettings.pauseOnHover ? 'hover:pause' : ''}`}
        >
          <span className="inline-block px-4">{displayText}</span>
          <span className="inline-block px-4">{displayText}</span>
          <span className="inline-block px-4">{displayText}</span>
          <span className="inline-block px-4">{displayText}</span>
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee ${marqueeSettings.animationDuration}s linear infinite;
        }

        .hover\\:pause:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  )
}