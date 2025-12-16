import { type LOCALIZATION_CONSTANT_KEYS } from '@/lib/localization-constants.ts'
import { useCompanySettings } from './use-company-settings'

export const useCompanyLocalizations = () => {
  const settings = useCompanySettings()
  const localizations = settings?.localizations || []

  const getLocalizedValue = (key: LOCALIZATION_CONSTANT_KEYS): string => {
    const item = localizations?.find(
      (item: { key: string; value: null | string; defaultValue: string }) =>
        item.key === key
    )
    if (item) {
      return item.value ?? item.defaultValue
    }
    return key
  }

  return {
    getLocalizedValue,
  }
}
