import { useEffect } from 'react'
import { useSettingsStore } from '@/stores/settings-store'
import { apiGetCompanySettings } from '@/services/settings-service'

// Cache duration in milliseconds (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000

export const useSettingsLoader = () => {
  const {
    company,
    loading,
    lastFetched,
    isRevalidating,
    setCompany,
    setLoading,
    setLastFetched,
    setRevalidating,
  } = useSettingsStore()

  useEffect(() => {
    const updatePageMetadata = (companyData: typeof company) => {
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

    const fetchSettings = async (isBackground = false) => {
      try {
        if (!isBackground) {
          setLoading(true)
        } else {
          setRevalidating(true)
        }

        const response = await apiGetCompanySettings({
          domain: window.location.host,
        })

        if (response.data) {
          setCompany(response.data.data)
          setLastFetched(Date.now())
          updatePageMetadata(response.data.data)
        }
      } catch (error) {
        console.error('Failed to load settings:', error)
      } finally {
        setLoading(false)
        setRevalidating(false)
      }
    }

    const loadSettings = async () => {
      const now = Date.now()
      const cacheAge = lastFetched ? now - lastFetched : null
      const isCacheValid = cacheAge !== null && cacheAge < CACHE_DURATION

      // If we have cached data and it's valid, show it immediately
      if (company && isCacheValid) {
        updatePageMetadata(company)
        return
      }

      // If we have cached data but it's stale, show it and fetch in background
      if (company && !isCacheValid && !loading && !isRevalidating) {
        updatePageMetadata(company)
        fetchSettings(true)
        return
      }

      // If no cached data, fetch normally with loading state
      if (!company && !loading) {
        fetchSettings(false)
      }
    }

    loadSettings()
  }, [
    company,
    loading,
    lastFetched,
    isRevalidating,
    setCompany,
    setLoading,
    setLastFetched,
    setRevalidating,
  ])

  return { company, loading, isRevalidating }
}
