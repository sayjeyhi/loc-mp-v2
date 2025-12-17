import { useNavigate } from '@tanstack/react-router'
import { useAuthStore } from '@/store/authStore'
import { toast } from 'sonner'
import { USER_ROLE } from '@/lib/constants'
import {
  loginRequest,
  apiRequestOtp,
  apiGetSessionUsingPin,
  apiForgotPassword,
} from '@/lib/services/AuthService'

type LoginRequestData = {
  username: string
  acctId: string
  password: string
  channel: 'sms' | 'email'
  advanceId: string
}

type OtpVerifyData = {
  password: string
}

function useAuth() {
  const navigate = useNavigate()
  const { user, setUser, setAuthToken } = useAuthStore()

  const requestOtp = async (
    values: any,
    channel: 'sms' | 'email' = 'email',
    token: string
  ) => {
    try {
      const resp = await apiRequestOtp(channel, token)

      if (resp?.data?.success) {
        setUser({
          username: values.username,
          accountNumber: values.acctId,
          authority: [USER_ROLE],
          isFromLogin: true,
          channel,
        })

        navigate({ to: '/otp' })

        return {
          status: 'success',
          dataReason: resp.data.dataReason || 'OTP sent successfully',
        }
      }

      return {
        status: 'success',
        dataReason: resp.data.dataReason || 'OTP sent successfully',
      }
    } catch (errors: any) {
      setUser({
        username: values.username,
        accountNumber: values.acctId,
        authority: [USER_ROLE],
        isFromLogin: true,
        channel,
      })
      return {
        status: 'failed',
        message:
          errors?.response?.data?.dataReason ||
          errors.toString() ||
          'Something went wrong',
      }
    }
  }

  const requestForPinOrg = async (values: any) => {
    try {
      const payload: LoginRequestData = {
        username: values.username,
        acctId: values.acctId,
        password: values.password || '',
        channel: values.channel || 'email',
        advanceId: values?.acctId?.toString(),
      }

      const resp = await loginRequest(payload, payload.channel || 'email')

      if (resp?.data?.token) {
        setUser({
          username: values.username,
          accountNumber: values.acctId,
          authority: [USER_ROLE],
          isFromLogin: true,
          id: resp?.data.id,
          tokenForOtp: resp?.data.token,
          token: null,
          tokenExpireTime: resp?.data.tokenExpireTime,
          setPassword: values.setPassword,
          channel: payload.channel,
        })

        localStorage.setItem('tokenForOtp', resp.data.token)

        setTimeout(() => {
          toast.success('OTP sent successfully')
          navigate({ to: `/otp?channel=${payload.channel || 'email'}` })
        }, 1000)

        return {
          status: 'success',
          dataReason: 'ok',
          data: resp?.data,
        }
      }

      return {
        status: 'success',
        dataReason: 'ok',
        data: resp?.data,
      }
    } catch (errors: any) {
      setUser({
        username: values.username,
        accountNumber: values.acctId,
        authority: [USER_ROLE],
        isFromLogin: true,
        channel: values.channel,
      })

      return {
        status: 'failed',
        statusCode: errors?.response?.data?.code || 500,
        message:
          errors?.response?.data?.dataReason ||
          errors.toString() ||
          'Something went wrong',
      }
    }
  }

  const getSessionUsingPin = async (values: any) => {
    try {
      const payload: OtpVerifyData = {
        password: values.password,
      }

      const token = localStorage.getItem('tokenForOtp') ?? ''

      const resp = await apiGetSessionUsingPin(payload, token)

      if (resp.status === 200) {
        setUser({
          username: user?.username || '',
          accountNumber: user?.accountNumber || '',
          authority: [USER_ROLE],
          isFromLogin: true,
          id: resp?.data.id,
          tokenForOtp: null,
          token: resp.data.token,
          tokenExpireTime: resp?.data.tokenExpireTime,
        })

        localStorage.setItem('token', resp.data.token)
        setAuthToken(resp.data.token)

        navigate({ to: '/' })

        return {
          status: 'success',
          dataReason: resp.data.dataReason,
        }
      }
    } catch (errors: any) {
      return {
        status: 'failed',
        message:
          errors?.response?.data?.errors?.password ||
          'Invalid OTP! please try again!',
      }
    }
  }

  const forgotPassword = async (values: any) => {
    try {
      const payload = {
        ...values,
      }

      if (payload.setPassword) {
        delete payload.setPassword
      }

      const resp: any = await apiForgotPassword(payload)

      if (resp?.data?.success) {
        setUser({
          username: values.username,
          accountNumber: values.acctId,
          authority: [USER_ROLE],
        })

        navigate({ to: '/otp' })

        return {
          status: 'success',
          dataReason: resp.data.dataReason,
        }
      }

      return {
        status: 'success',
        dataReason: resp.data.dataReason,
      }
    } catch (errors: any) {
      return {
        status: 'failed',
        message: errors?.response?.data?.dataReason || errors.toString(),
      }
    }
  }

  const signOut = async () => {
    try {
      // Use the auth store's logout method
      const { logout } = useAuthStore.getState()
      await logout()

      // Navigate to sign-in
      navigate({ to: '/sign-in' })
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return {
    authenticated: user?.token && !user?.setPassword ? true : false,
    requestOtp,
    requestForPinOrg,
    getSessionUsingPin,
    forgotPassword,
    signOut,
  }
}

export default useAuth
