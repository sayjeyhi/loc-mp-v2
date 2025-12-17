import { HTTP_METHODS } from '@/lib/constants'
import ApiService from '../ApiService'

export async function apiGetCompanySettings<
  T,
  U extends Record<string, unknown>,
>(body: U) {
  return ApiService.fetchData<T>({
    url: '/v1/get-settings',
    method: HTTP_METHODS.POST,
    data: body,
  })
}
