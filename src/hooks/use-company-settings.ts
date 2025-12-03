import { useSettingsStore } from '@/stores/settings-store'

export const useCompanySettings = () => {
  const company = useSettingsStore((state) => state.company)
  return company || undefined
}
