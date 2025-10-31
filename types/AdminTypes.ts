export interface AdminUser {
  id: string
  username: string
  mosqueId: string
  role: 'admin' | 'superadmin'
  createdAt: string
  lastLogin?: string
}

export interface MosqueConfig {
  id: string
  name: string
  address: string
  website?: string
  logo_url?: string
  cityId: string
  announcements: Announcement[]
  settings: MosqueSettings
  updatedAt: string
  updatedBy: string
}

export interface Announcement {
  id: string
  title: string
  message: string
  type: 'info' | 'warning' | 'urgent'
  startTime?: string
  endTime?: string
  isActive: boolean
  createdAt: string
  createdBy: string
  updatedAt?: string
  updatedBy?: string
}

export interface MosqueSettings {
  blackoutPeriod: number // minutes
  slideTransitionTime: number // seconds
  upcomingPrayerDays: number
  autoRefreshInterval: number // minutes
  displayMode: 'tv' | 'mobile'
  language: 'id' | 'en'
  marqueeAnimation: MarqueeSettings
}

export interface MarqueeSettings {
  animationDuration: number // seconds for full scroll
  fontSize: 'small' | 'medium' | 'large'
  backgroundColor: string // Tailwind class name
  textColor: string // Tailwind class name
  pauseOnHover: boolean
}

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthSession {
  user: AdminUser
  token: string
  expiresAt: string
}