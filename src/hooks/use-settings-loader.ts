import { useEffect } from 'react'
import { apiGetCompanySettings } from '@/services/LOC-Admin/SettingsService'
import { useSettingsStore, type CompanySettings } from '@/store/settingsStore'

export const useSettingsLoader = () => {
  const { settings, isLoading, setSettings, setLoading } = useSettingsStore()

  useEffect(() => {
    const updatePageMetadata = (companyData: CompanySettings | null) => {
      if (!companyData) return

      // Update document title
      if (companyData.name) {
        document.title = companyData.name
      }

      // Update favicon if logo exists
      if (companyData.logo_url) {
        const updateFavicon = () => {
          const img = new Image()
          img.crossOrigin = 'anonymous'
          img.onload = () => {
            // Create a square canvas
            const size = Math.max(img.width, img.height)
            const canvas = document.createElement('canvas')
            canvas.width = size
            canvas.height = size
            const ctx = canvas.getContext('2d')
            
            if (ctx) {
              // Fill with transparent background
              ctx.clearRect(0, 0, size, size)
              
              // Calculate position to center the image
              const x = (size - img.width) / 2
              const y = (size - img.height) / 2
              
              // Draw image centered without stretching
              ctx.drawImage(img, x, y, img.width, img.height)
              
              // Convert canvas to data URL and set as favicon
              const dataUrl = canvas.toDataURL('image/png')
              
              // Find or create favicon link
              let favicon = document.querySelector<HTMLLinkElement>("link[rel*='icon']")
              if (!favicon) {
                favicon = document.createElement('link')
                favicon.rel = 'icon'
                document.head.appendChild(favicon)
              }
              
              favicon.href = dataUrl
              favicon.type = 'image/png'
            }
          }
          img.onerror = () => {
            // Fallback: use original URL if image fails to load
            const favicon = document.querySelector<HTMLLinkElement>("link[rel*='icon']")
            if (favicon) {
              favicon.href = companyData.logo_url!
            }
          }
          img.src = companyData.logo_url
        }
        
        updateFavicon()
      }
    }

    const fetchSettings = async () => {
      try {
        setLoading(true)

        let domain = window.location.host
        // if (window.location.host.endsWith('.surge.sh')) {
        domain = 'stage-us.loc.orgmeter.com'
        // }
        const response = await apiGetCompanySettings<
          { data: CompanySettings },
          { domain: string }
        >({
          domain,
        })

        if (response.data) {
          setSettings(response.data.data)
          updatePageMetadata(response.data.data)
        }
      } catch (error) {
        console.error('Failed to load settings:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchSettings()
  }, [setLoading, setSettings])

  return { company: settings, loading: isLoading }
}
