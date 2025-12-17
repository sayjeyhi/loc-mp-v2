import { useSettingsStore } from '@/store/settingsStore'

/**
 * Formats a currency amount with the appropriate symbol and formatting
 * @param amount - The amount to format (string, number, or undefined)
 * @returns Formatted currency string (e.g., "$1,234.56")
 */
export function formatCurrency(amount: string | number | undefined): string {
  if (amount === undefined || amount === null) return '$0.00'
  
  const settings = useSettingsStore.getState().settings
  const symbol = settings?.country?.symbol || '$'
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
  
  if (isNaN(numAmount)) return `${symbol}0.00`
  
  return `${symbol}${numAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
}

