import { useSettingsStore } from '@/store/settingsStore'

export const useCompanySettings = () => {
  const settings = useSettingsStore((state) => state.settings)
  return settings || undefined
}
