import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CompanySettings } from '@/services/settings-service'

interface SettingsState {
  company: CompanySettings | null
  loading: boolean
  lastFetched: number | null
  isRevalidating: boolean
  setCompany: (company: CompanySettings | null) => void
  setLoading: (loading: boolean) => void
  setLastFetched: (timestamp: number) => void
  setRevalidating: (isRevalidating: boolean) => void
  reset: () => void
}

const initialState = {
  company: null,
  loading: false,
  lastFetched: null,
  isRevalidating: false,
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      ...initialState,
      setCompany: (company) => set({ company }),
      setLoading: (loading) => set({ loading }),
      setLastFetched: (timestamp) => set({ lastFetched: timestamp }),
      setRevalidating: (isRevalidating) => set({ isRevalidating }),
      reset: () => set(initialState),
    }),
    {
      name: 'settings-storage',
      partialize: (state) => ({
        company: state.company,
        lastFetched: state.lastFetched,
      }),
    }
  )
)
