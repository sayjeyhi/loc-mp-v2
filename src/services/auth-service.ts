import ApiService from './base-service'

export interface LoginRequestData {
  username: string
  acctId: string
  password: string
  channel: 'sms' | 'email'
  advanceId?: string
}

export interface OtpVerifyData {
  password: string
}

export async function loginRequest(data: LoginRequestData, channel: string) {
  return ApiService.fetchData<any>({
    url: '/api/loc-merchant-portal/v1/auth/login?channel=' + channel,
    method: 'post',
    data,
  })
}

export async function apiRequestOtp(channel: 'sms' | 'email', token: string) {
  return ApiService.fetchData<any>({
    url: `/api/loc-merchant-portal/v1/auth/otp-request?channel=${channel}`,
    method: 'post',
    headers: { Authorization: token },
  })
}

export async function apiGetSessionUsingPin(data: OtpVerifyData, token: string) {
  return ApiService.fetchData<any>({
    url: '/api/loc-merchant-portal/v1/auth/otp-verify',
    method: 'post',
    data,
    headers: {
      Authorization: token,
    },
  })
}

export async function apiForgotPassword(data: any) {
  return ApiService.fetchData({
    url: '/v1/auth/forgot-password',
    method: 'post',
    data,
  })
}
