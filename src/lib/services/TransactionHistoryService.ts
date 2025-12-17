import { HTTP_METHODS } from '@/lib/constants'
import ApiService from './ApiService'

const { GET } = HTTP_METHODS

export async function apiGetTransactionHistory<
  T,
  U extends Record<string, unknown>,
>(data: U) {
  return ApiService.fetchData<T>(
    {
      url: '/api/loc-merchant-portal/v1/payment/',
      method: GET,
      params: data,
    },
    true
  )
}
