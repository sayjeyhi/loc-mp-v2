import { useCallback, useEffect, useRef } from 'react'
import { useProfileStore, type Profile } from '@/store/profileStore'
import { apiGetAccountProfile } from '@/lib/services/AccountServices'

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

        const response = await apiGetAccountProfile<Profile>()

        if (response.data) {
          setProfile(response.data)
        }
      } catch (error) {
        console.error('Failed to load profile:', error)
        // // Don't clear profile on error if we have cached data
        // if (!profile) {
        //   clearProfile()
        // }
      } finally {
        setLoading(false)
        isRevalidating.current = false
      }
    },
    [profile, setLoading, setProfile]
  )

  useEffect(() => {
    fetchProfile(true)

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
  }, [])

  return {
    accountProfile: profile,
    loading: isLoading && !profile, // Only show loading if no cached data
    isRevalidating: isRevalidating.current,
    refetch: () => fetchProfile(false),
  }
}
