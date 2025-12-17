import { HTTP_METHODS } from '@/lib/constants'
import { idempotencyManagers } from '@/lib/utils/idempotency'
import ApiService from './ApiService'

const { POST } = HTTP_METHODS

export async function apiPostVoluntaryPrepaymentRequestStepOne<
  T,
  U extends Record<string, unknown>,
>(data: U) {
  return ApiService.fetchData<T>(
    {
      url: '/api/loc-merchant-portal/v1/payment/prepayment/request',
      method: POST,
      data,
    },
    true
  )
}

export async function apiPostVoluntaryPrepaymentRequestStepTwo<
  T,
  U extends Record<string, unknown>,
>(data: U) {
  return ApiService.fetchData<T>(
    {
      url: '/api/loc-merchant-portal/v1/payment/prepayment/create',
      method: POST,
      data,
      headers: {
        'Idempotence-Key': idempotencyManagers.prepaymentCreate.getKey(),
      },
    },
    true
  )
}

export async function apiPostVoluntaryPrepaymentSelectionStepOne<
  T,
  U extends Record<string, unknown>,
>(data: U) {
  return ApiService.fetchData<T>(
    {
      url: '/api/loc-merchant-portal/v1/payment/payoff/request',
      method: POST,
      data,
    },
    true
  )
}

export async function apiPostVoluntaryPrepaymentSelectionStepTwo<
  T,
  U extends Record<string, unknown>,
>(data: U) {
  return ApiService.fetchData<T>(
    {
      url: '/api/loc-merchant-portal/v1/payment/payoff/create',
      method: POST,
      data,
      headers: {
        'Idempotence-Key': idempotencyManagers.payoffCreate.getKey(),
      },
    },
    true
  )
}
