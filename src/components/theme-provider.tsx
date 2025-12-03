import { useEffect } from 'react'
import { useSettingsLoader } from '@/hooks/use-settings-loader'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { company } = useSettingsLoader()

  // Get panel colors from settings
  const panelColor = company?.settings?.find(
    (setting) => setting.setting.title === 'Panel Color'
  )?.value

  const panelColorDarker = company?.settings?.find(
    (setting) => setting.setting.title === 'Panel Color Darker'
  )?.value

  // Apply dynamic primary colors globally
  useEffect(() => {
    if (!panelColor || !panelColorDarker) return

    // Convert hex to HSL for CSS variables
    const hexToHSL = (hex: string) => {
      // Remove the hash if present
      const sanitizedHex = hex.replace('#', '')

      // Parse hex to RGB
      const r = parseInt(sanitizedHex.substring(0, 2), 16) / 255
      const g = parseInt(sanitizedHex.substring(2, 4), 16) / 255
      const b = parseInt(sanitizedHex.substring(4, 6), 16) / 255

      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      let h = 0
      let s = 0
      const l = (max + min) / 2

      if (max !== min) {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

        switch (max) {
          case r:
            h = ((g - b) / d + (g < b ? 6 : 0)) / 6
            break
          case g:
            h = ((b - r) / d + 2) / 6
            break
          case b:
            h = ((r - g) / d + 4) / 6
            break
        }
      }

      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
    }

    const root = document.documentElement

    console.log('Applying panel colors:', { panelColor, panelColorDarker })
    // Set CSS variables for light mode (use darker color)
    root.style.setProperty('--primary', panelColorDarker)
    root.style.setProperty('--primary-foreground', '#fff')

    // Apply dark mode primary color
    const style = document.createElement('style')
    style.id = 'dynamic-primary-color'
    style.textContent = `
      .dark {
        --primary: ${hexToHSL(panelColor)};
        --primary-foreground: 0 0% 98%;
      }
    `

    // Remove existing style if present
    const existingStyle = document.getElementById('dynamic-primary-color')
    if (existingStyle) {
      existingStyle.remove()
    }

    document.head.appendChild(style)

    return () => {
      const styleToRemove = document.getElementById('dynamic-primary-color')
      if (styleToRemove) {
        styleToRemove.remove()
      }
    }
  }, [panelColor, panelColorDarker])

  return <>{children}</>
}
