import { useEffect } from 'react'
import { useProfileStore } from '@/store/profileStore'
import { apiGetAccountProfile } from '@/services/AccountServices'

export const useProfileLoader = () => {
  const { profile, isLoading, setProfile, setLoading } = useProfileStore()

  const fetchProfile = async () => {
    try {
      setLoading(true)
      const response = await apiGetAccountProfile()

      if (response.data) {
        setProfile(response.data.data)
      }
    } catch (error) {
      console.error('Failed to load profile:', error)
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Fetch profile on mount
    fetchProfile()

    // Refresh profile when user returns to the tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchProfile()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [])

  return { accountProfile: profile, loading: isLoading, refetch: fetchProfile }
}
