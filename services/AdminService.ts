import { AdminUser, LoginCredentials, AuthSession, MosqueConfig, Announcement } from '@/types/AdminTypes'

// In production, this would be a proper database with bcrypt/hashing
// For now, we'll use localStorage with simple encoding
const ADMIN_STORAGE_KEY = 'mosque_admin_data'
const AUTH_SESSION_KEY = 'mosque_auth_session'

class AdminService {
  // Default admin account (in production, this would be in a secure database)
  private defaultAdmin = {
    username: 'admin',
    password: 'admin123', // Change this in production!
    mosqueId: 'default-mosque'
  }

  /**
   * Authenticate admin user
   */
  async login(credentials: LoginCredentials): Promise<AuthSession> {
    // Simple authentication (in production, use proper password hashing)
    if (credentials.username === this.defaultAdmin.username &&
        credentials.password === this.defaultAdmin.password) {

      const user: AdminUser = {
        id: '1',
        username: credentials.username,
        mosqueId: this.defaultAdmin.mosqueId,
        role: 'admin',
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      }

      const session: AuthSession = {
        user,
        token: this.generateToken(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
      }

      // Store session in localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session))
      }

      return session
    }

    throw new Error('Username atau password salah')
  }

  /**
   * Logout admin user
   */
  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_SESSION_KEY)
    }
  }

  /**
   * Get current authenticated session
   */
  getCurrentSession(): AuthSession | null {
    try {
      if (typeof window === 'undefined') {
        return null
      }
      const sessionData = localStorage.getItem(AUTH_SESSION_KEY)
      if (!sessionData) return null

      const session: AuthSession = JSON.parse(sessionData)

      // Check if session has expired
      if (new Date(session.expiresAt) < new Date()) {
        this.logout()
        return null
      }

      return session
    } catch (error) {
      console.error('Error parsing session:', error)
      this.logout()
      return null
    }
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.getCurrentSession() !== null
  }

  /**
   * Get mosque configuration
   */
  getMosqueConfig(mosqueId: string): MosqueConfig {
    try {
      const configs = this.getAllMosqueConfigs()
      const config = configs[mosqueId]

      if (!config) {
        // Return default config if not found
        return this.getDefaultMosqueConfig(mosqueId)
      }

      return config
    } catch (error) {
      console.error('Error getting mosque config:', error)
      return this.getDefaultMosqueConfig(mosqueId)
    }
  }

  /**
   * Update mosque configuration
   */
  async updateMosqueConfig(mosqueId: string, updates: Partial<MosqueConfig>): Promise<void> {
    try {
      const configs = this.getAllMosqueConfigs()
      const currentConfig = configs[mosqueId] || this.getDefaultMosqueConfig(mosqueId)

      const updatedConfig: MosqueConfig = {
        ...currentConfig,
        ...updates,
        updatedAt: new Date().toISOString(),
        updatedBy: this.getCurrentSession()?.user?.id || 'unknown'
      }

      configs[mosqueId] = updatedConfig
      if (typeof window !== 'undefined') {
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(configs))
      }

      // Trigger a custom event to notify listeners
      this.notifyDataUpdate()

      // Attempt to revalidate the cache (completely optional and non-blocking)
      // Don't await or catch - let it run in background without affecting user experience
      this.revalidateCache()
    } catch (error) {
      console.error('Error updating mosque config:', error)
      throw error
    }
  }

  /**
   * Add or update announcement
   */
  saveAnnouncement(mosqueId: string, announcement: Omit<Announcement, 'id' | 'createdAt' | 'createdBy'> & { id?: string }): Announcement {
    try {
      const configs = this.getAllMosqueConfigs()
      const config = configs[mosqueId] || this.getDefaultMosqueConfig(mosqueId)

      let updatedAnnouncement: Announcement

      if (announcement.id) {
        // Update existing announcement
        const existingIndex = config.announcements.findIndex(a => a.id === announcement.id)
        if (existingIndex >= 0) {
          updatedAnnouncement = {
            ...config.announcements[existingIndex],
            ...announcement,
            updatedAt: new Date().toISOString(),
            updatedBy: this.getCurrentSession()?.user?.id || 'unknown'
          }
          config.announcements[existingIndex] = updatedAnnouncement
        } else {
          // ID provided but not found, create new
          updatedAnnouncement = {
            ...announcement,
            id: announcement.id,
            createdAt: new Date().toISOString(),
            createdBy: this.getCurrentSession()?.user?.id || 'unknown'
          }
          config.announcements.push(updatedAnnouncement)
        }
      } else {
        // Create new announcement
        updatedAnnouncement = {
          ...announcement,
          id: this.generateId(),
          createdAt: new Date().toISOString(),
          createdBy: this.getCurrentSession()?.user?.id || 'unknown'
        }
        config.announcements.push(updatedAnnouncement)
      }

      config.updatedAt = new Date().toISOString()
      config.updatedBy = this.getCurrentSession()?.user?.id || 'unknown'

      configs[mosqueId] = config
      if (typeof window !== 'undefined') {
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(configs))
      }

      return updatedAnnouncement
    } catch (error) {
      console.error('Error saving announcement:', error)
      throw error
    }
  }

  /**
   * Delete announcement
   */
  deleteAnnouncement(mosqueId: string, announcementId: string): void {
    try {
      const configs = this.getAllMosqueConfigs()
      const config = configs[mosqueId]

      if (!config) return

      config.announcements = config.announcements.filter(a => a.id !== announcementId)
      config.updatedAt = new Date().toISOString()
      config.updatedBy = this.getCurrentSession()?.user?.id || 'unknown'

      configs[mosqueId] = config
      if (typeof window !== 'undefined') {
        localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(configs))
      }
    } catch (error) {
      console.error('Error deleting announcement:', error)
      throw error
    }
  }

  /**
   * Get all mosque configs from storage
   */
  private getAllMosqueConfigs(): Record<string, MosqueConfig> {
    try {
      if (typeof window === 'undefined') {
        // Server-side rendering - return empty object
        return {}
      }
      const data = localStorage.getItem(ADMIN_STORAGE_KEY)
      return data ? JSON.parse(data) : {}
    } catch (error) {
      console.error('Error parsing admin data:', error)
      return {}
    }
  }

  /**
   * Get default mosque configuration
   */
  private getDefaultMosqueConfig(mosqueId: string): MosqueConfig {
    return {
      id: mosqueId,
      name: 'Masjid Islam',
      address: 'Alamat Masjid, Indonesia',
      website: '',
      logo_url: '',
      cityId: '1301', // Jakarta city ID for MyQuran API
      announcements: [],
      settings: {
        blackoutPeriod: 13,
        slideTransitionTime: 7,
        upcomingPrayerDays: 3,
        autoRefreshInterval: 60,
        displayMode: 'tv',
        language: 'id',
        marqueeAnimation: {
          animationDuration: 60,
          fontSize: 'medium',
          backgroundColor: 'bg-blue-900',
          textColor: 'text-white',
          pauseOnHover: true
        }
      },
      updatedAt: new Date().toISOString(),
      updatedBy: 'system'
    }
  }

  /**
   * Generate simple token (in production, use JWT)
   */
  private generateToken(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }

  /**
   * Notify components of data updates using custom events
   */
  private notifyDataUpdate(): void {
    if (typeof window !== 'undefined') {
      // Create a custom event to notify listeners
      const event = new CustomEvent('mosqueDataUpdated', {
        detail: { timestamp: Date.now() }
      })
      window.dispatchEvent(event)
    }
  }

  /**
   * Revalidate the page cache (completely optional)
   */
  private async revalidateCache(): Promise<void> {
    // Skip revalidation in development or if fetch is not available
    if (typeof window === 'undefined' || process.env.NODE_ENV === 'development') {
      return
    }

    // Use a timeout to prevent hanging
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 3000) // 3 second timeout

    try {
      const response = await fetch('/api/revalidate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: '/' }),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        console.warn('Revalidation API returned:', response.status, response.statusText)
      }
    } catch (error) {
      clearTimeout(timeoutId)
      // Silently ignore all revalidation errors - it's completely optional
      console.debug('Cache revalidation skipped (non-critical):', error instanceof Error ? error.message : 'Unknown error')
    }
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36)
  }
}

export const adminService = new AdminService()