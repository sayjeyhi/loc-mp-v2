import axios from 'axios'

export interface SettingType {
  id: number
  value: string
  setting: {
    id: number
    title: string
    default_value: string
  }
}

export interface LocalizationType {
  id: number
  key: string
  value: string | null
  defaultValue: string
}

export interface CompanySettings {
  id: number
  name: string
  description: string
  domain: string
  settings: SettingType[]
  logo_url: string
  mobile_logo_url: string
  auth_bg_url: string
  localizations?: LocalizationType[]
  country: {
    id: number
    name: string
    symbol: string
  }
}

export interface GetSettingsRequest {
  domain: string
}

// Create a separate axios instance for settings that doesn't require authentication
const settingsAxios = axios.create({
  timeout: 60000,
  baseURL: import.meta.env.VITE_APP_API_BASE_URL || '',
})

settingsAxios.interceptors.request.use(
  async (config) => {
    config.headers.Accept = 'application/json'
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

export async function apiGetCompanySettings(body: GetSettingsRequest) {
  const response = await settingsAxios.post<{ data: CompanySettings }>(
    '/v1/get-settings',
    body
  )
  return response
}
