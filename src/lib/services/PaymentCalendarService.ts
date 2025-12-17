import { HTTP_METHODS } from '@/lib/constants'
import ApiService from './ApiService'

const { GET } = HTTP_METHODS

export async function apiGetPaymentCalendar<T>() {
  return ApiService.fetchData<T>(
    {
      url: '/api/loc-merchant-portal/v1/payment/expected-payback-payment',
      method: GET,
    },
    true
  )
}
