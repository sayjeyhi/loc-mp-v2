import { useEffect } from 'react'
import { useSettingsStore } from '@/store/settingsStore'
import { apiGetCompanySettings } from '@/services/LOC-Admin/SettingsService'

export const useSettingsLoader = () => {
  const { settings, isLoading, setSettings, setLoading } = useSettingsStore()

  useEffect(() => {
    const updatePageMetadata = (companyData: typeof settings) => {
      if (!companyData) return

      // Update document title
      if (companyData.name) {
        document.title = companyData.name
      }

      // Update favicon if logo exists
      if (companyData.logo_url) {
        const favicon = document.querySelector<HTMLLinkElement>(
          "link[rel*='icon']"
        )
        if (favicon) {
          favicon.href = companyData.logo_url
        }
      }
    }

    const fetchSettings = async () => {
      // // If already loaded from cache, just update metadata
      // if (settings) {
      //   updatePageMetadata(settings)
      //   return
      // }

      try {
        setLoading(true)

        const response = await apiGetCompanySettings({
          domain: window.location.host,
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
  }, [])

  return { company: settings, loading: isLoading }
}
