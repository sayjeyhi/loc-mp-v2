import type { AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios'
import { useAuthStore } from '@/store/authStore'
import { HTTP_METHODS } from '@/lib/constants'
import { debugLog } from '@/lib/utils/debug'
import { BaseOrgService, BaseLocAdminService } from './BaseService'

const redirectToErrorPage = () => {
  // showToast({
  //   text: "Session Expired. Please log in again.",
  //   type: "error",
  //   duration: 4000,
  // });
  console.log('Session Expired. Redirecting to login page.')
  // router.replace("login");
  debugLog('danger', 'Session Expired')
}

const notifyError = (message: string) => {
  console.log('Error:', message)
  // showToast({
  //   text: message,
  //   type: "error",
  // });
}

const convertObjectToQueryParams = (
  data: Record<string, unknown>
): URLSearchParams => {
  const params = new URLSearchParams()
  Object.keys(data).forEach((key) => {
    const value = data[key]
    if (value === null || value === undefined) {
      return
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        params.append(`${key}[]`, item.toString())
      })
    } else {
      params.append(key, value.toString())
    }
  })

  return params
}

const ApiService = {
  async fetchData<Response = unknown, Request = Record<string, unknown>>(
    param: AxiosRequestConfig<Request>,
    orgApi: boolean = false
  ) {
    return new Promise<AxiosResponse<Response>>((resolve, reject) => {
      const updatedParams: AxiosRequestConfig<Request> = { ...param }
      const url = updatedParams.url
      const method = updatedParams.method

      const { GET } = HTTP_METHODS
      if (method === GET && updatedParams.data) {
        const queryParams = convertObjectToQueryParams(
          updatedParams.data as Record<string, unknown>
        )
        const queryString = queryParams.toString()

        if (queryString) {
          updatedParams.url = `${url}${url?.includes('?') ? '&' : '?'}${queryString}`
        }
        debugLog(`[REQ][GET]:`, updatedParams.url)
        delete updatedParams.data
      }

      // add application/json
      updatedParams.headers = {
        ...updatedParams.headers,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      }

      const service = orgApi ? BaseOrgService : BaseLocAdminService
      const urlPrefix = orgApi
        ? import.meta.env.VITE_ORG_BASE_URL
        : import.meta.env.VITE_APP_LOC_STAGE_ADMIN_API_URL
      service(updatedParams)
        .then((response: AxiosResponse<Response>) => {
          const updatedResponse: AxiosResponse<Response> = { ...response }

          console.log('success', `Request Successful [${url}]`)
          resolve(updatedResponse)
        })
        .catch((errors: AxiosError | unknown) => {
          console.log('error', 'Request Failed', urlPrefix + url, errors)

          const updatedError = errors as AxiosError

          const errorMessage: string =
            (
              updatedError?.response?.data as {
                data?: { dataReason?: string }
                dataReason?: string
              }
            )?.data?.dataReason ||
            (updatedError?.response?.data as { dataReason?: string })
              ?.dataReason ||
            ''

          if (!url?.startsWith('/api/loc-merchant-portal/v1/auth/login')) {
            if ((errors as AxiosError).status === 401) {
              // remov token from async storage and zustand store
              localStorage.removeItem('token')
              useAuthStore.getState().logout()
              useAuthStore.getState().clearAuth()
              redirectToErrorPage()
            } else {
              if (errorMessage) notifyError(errorMessage)
              reject(updatedError)
            }
          } else {
            reject(updatedError)
          }
        })
    })
  },
}

export default ApiService
