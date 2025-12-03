import { useCallback, useEffect, useRef } from 'react'
import { apiGetAccountProfile } from '@/services/AccountServices'
import { useProfileStore } from '@/store/profileStore'

export const useProfileLoader = () => {
  const { profile, isLoading, setProfile, setLoading } = useProfileStore()
  const isRevalidating = useRef(false)

  const fetchProfile = useCallback(
    async (isBackgroundRevalidation = false) => {
      try {
        // Only show loading state if no cached data exists
        if (!isBackgroundRevalidation && !profile) {
          setLoading(true)
        } else {
          isRevalidating.current = true
        }

        const response = await apiGetAccountProfile()

        if (response.data) {
          setProfile(response.data)
        }
      } catch (error) {
        console.error('Failed to load profile:', error)
        // Don't clear profile on error if we have cached data
        if (!profile) {
          setProfile(null)
        }
      } finally {
        setLoading(false)
        isRevalidating.current = false
      }
    },
    [profile, setLoading, setProfile]
  )

  useEffect(() => {
    // If we have cached data, show it immediately and revalidate in background
    if (profile) {
      fetchProfile(true)
    } else {
      // No cached data, fetch with loading state
      fetchProfile(false)
    }

    // Refresh profile when user returns to the tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchProfile(true) // Always revalidate in background on tab focus
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [fetchProfile, profile])

  return {
    accountProfile: profile,
    loading: isLoading && !profile, // Only show loading if no cached data
    isRevalidating: isRevalidating.current,
    refetch: () => fetchProfile(false),
  }
}
