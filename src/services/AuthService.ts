import type {
  SignInCredential,
  SignUpCredential,
  ForgotPassword,
  ResetPassword,
  SignInResponse,
  SignUpResponse,
  IsAdminUser,
} from '@/utils/types/auth'
import ApiService from './ApiService'

export async function apiSignIn(data: SignInCredential) {
  return ApiService.fetchData<SignInResponse>({
    url: '/sign-in',
    method: 'post',
    data,
  })
}

export async function apiRequestOtp(channel: 'sms' | 'email', token: string) {
  return ApiService.fetchData<any>(
    {
      url: `/api/loc-merchant-portal/v1/auth/otp-request?channel=${channel}`,
      method: 'post',
      headers: { Authorization: token },
    },
    true
  )
}

export async function loginRequest(data: any, channel: string) {
  return ApiService.fetchData<any>(
    {
      url: '/api/loc-merchant-portal/v1/auth/login?channel=' + channel,
      method: 'post',
      data,
    },
    true
  )
}

export async function apiGetSessionUsingPin(data: any, token: string) {
  return ApiService.fetchData<any>(
    {
      url: '/api/loc-merchant-portal/v1/auth/otp-verify',
      method: 'post',
      data,
      headers: {
        Authorization: token,
      },
    },
    true
  )
}

export async function apiSignUp(data: SignUpCredential) {
  return ApiService.fetchData<SignUpResponse>({
    url: '/sign-up',
    method: 'post',
    data,
  })
}

export async function apiSignOut() {
  return ApiService.fetchData({
    url: '/sign-out',
    method: 'post',
  })
}

export async function apiForgotPassword(data: ForgotPassword) {
  return ApiService.fetchData({
    url: '/v1/auth/forgot-password',
    method: 'post',
    data,
  })
}

export async function apiResetPassword(data: ResetPassword) {
  return ApiService.fetchData({
    url: '/v1/auth/set-password',
    method: 'post',
    data,
  })
}

export async function apiIsAdminUser(data: IsAdminUser) {
  return ApiService.fetchData({
    url: '/v1/users/is-admin-user',
    method: 'post',
    data,
  })
}

export async function apiAdminNotificationSignIn(params: SignInCredential) {
  return ApiService.fetchData<SignInResponse>({
    url: '/v1/admin/notification-sign-in',
    method: 'GET',
    params,
  })
}
