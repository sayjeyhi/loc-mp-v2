import axios from 'axios'

export interface AccountProfile {
  account: {
    number: string
    maxFundingLimit: number
    availableBalance: number
    pendingBalance: number
    state: string
    isInTrailingRepayment: boolean
    usedBalance?: number
    discountedBalance?: number
    currentBalance?: number
  }
  merchant: {
    businessName: string
  }
  accountSummary: {
    trxnLockFlg: boolean
  }
  repaymentSchedule?: {
    frequency: string
  }
  collectionSummary?: {
    lifetimeFunding: {
      lastPaymentDate?: string
      transactionCount: number
    }
    lifetimeCollections: {
      totalSavedAmount: number
    }
    missedPayments: {
      arrears: number
    }
  }
}

// Create a separate axios instance for profile that requires authentication
const profileAxios = axios.create({
  timeout: 60000,
  baseURL: import.meta.env.VITE_ORG_BASE_URL || '',
})

profileAxios.interceptors.request.use(
  async (config) => {
    config.headers.Accept = 'application/json'

    // Get token from auth store
    const authStore = localStorage.getItem('auth-storage')
    if (authStore) {
      try {
        const { state } = JSON.parse(authStore)
        if (state?.session?.token) {
          config.headers.Authorization = `Bearer ${state.session.token}`
        }
      } catch (error) {
        console.error('Failed to parse auth token:', error)
      }
    }

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

profileAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 unauthorized
    if (error.response?.status === 401) {
      // Clear auth and redirect to sign in
      localStorage.removeItem('auth-storage')
      window.location.href = '/sign-in'
    }
    return Promise.reject(error)
  }
)

export async function apiGetAccountProfile() {
  const response = await profileAxios.get<{ data: AccountProfile }>(
    '/api/loc-merchant-portal/v1/profile'
  )
  return response
}
