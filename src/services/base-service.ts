import axios, { type AxiosRequestConfig } from 'axios'
import { useAuthStore } from '@/stores/auth-store'

const unauthorizedCode = [401]

const BaseOrgService = axios.create({
  timeout: 60000,
  baseURL: import.meta.env.VITE_ORG_BASE_URL || '',
})

BaseOrgService.interceptors.request.use(
  async (config) => {
    const accessToken = localStorage.getItem('token')

    if (accessToken) {
      config.headers.Authorization = JSON.parse(accessToken)
    }

    config.headers.Accept = 'application/json'

    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

BaseOrgService.interceptors.response.use(
  (response) => response,
  (error) => {
    const { response } = error

    if (response && unauthorizedCode.includes(response.status)) {
      // Clear auth store
      useAuthStore.getState().reset()

      // Clear storage
      localStorage.clear()
      sessionStorage.clear()

      // Redirect to sign-in
      window.location.replace('/sign-in')
    }

    return Promise.reject(error)
  }
)

const ApiService = {
  fetchData<Response = unknown, Request = Record<string, unknown>>(
    param: AxiosRequestConfig<Request>
  ) {
    return BaseOrgService(param) as Promise<{
      data: Response
      status: number
      statusText: string
    }>
  },
}

export default ApiService
