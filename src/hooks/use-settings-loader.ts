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
        const favicon =
          document.querySelector<HTMLLinkElement>("link[rel*='icon']")
        if (favicon) {
          favicon.href = companyData.logo_url
        }
      }
    }

    const fetchSettings = async () => {
      try {
        setLoading(true)

        let domain = window.location.host
        if (window.location.host.endsWith('.surge.sh')) {
          domain = 'stage-aus.loc.orgmeter.com'
        }
        const response = await apiGetCompanySettings<CompanySettings, { domain: string }>({
          domain,
        })

        if (response.data) {
          setSettings(response.data)
          updatePageMetadata(response.data)
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
