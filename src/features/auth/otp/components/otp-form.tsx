import { useState, useEffect } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useAuthStore } from '@/stores/auth-store'
import useAuth from '@/hooks/use-auth'
import { AUTH_PIN_MODE } from '@/lib/constants'
import { useCompanyLocalizations } from '@/hooks/use-company-localizations'
import { LOCALIZATION_CONSTANT_KEYS } from '@/lib/localization-constants'

const {
  ONE_TIME_PIN_LABEL,
  ONE_TIME_PIN_PLACEHOLDER,
  RESEND_PIN_BTN_LABEL,
  VERIFY_AND_SET_PASSWORD_BTN_LABEL,
  NOT_HAVE_ACCESS_TO_PHONE_LABEL,
  RECEIVE_PIN_VIA_EMAIL_BTN_LABEL,
} = LOCALIZATION_CONSTANT_KEYS.OTP
const { BACK_TO_LABEL, VERIFY_BTN_LABEL } = LOCALIZATION_CONSTANT_KEYS.GLOBAL
const { SIGN_IN_LABEL } = LOCALIZATION_CONSTANT_KEYS.LOGIN

const formSchema = z.object({
  otp: z.string().min(1, 'Please Enter One Time Pin'),
})

type OtpFormProps = React.HTMLAttributes<HTMLFormElement>

export function OtpForm({ className, ...props }: OtpFormProps) {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [disabled, setDisabled] = useState(false)
  const [isResendEnabled, setIsResendEnabled] = useState(false)
  const [countdown, setCountdown] = useState(30)
  const { user } = useAuthStore()
  const { getSessionUsingPin, requestOtp, forgotPassword } = useAuth()
  const { getLocalizedValue } = useCompanyLocalizations()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { otp: '' },
  })

  useEffect(() => {
    if (!user?.username) {
      navigate({ to: '/sign-in' })
    }
  }, [user?.username, navigate])

  useEffect(() => {
    let timer: NodeJS.Timeout
    if (!isResendEnabled && user?.channel === AUTH_PIN_MODE.MODE_MOBILE) {
      // Implementing a 30-second countdown for resending OTP via mobile
      setCountdown(30)
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setIsResendEnabled(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    } else {
      setIsResendEnabled(true)
      setCountdown(0)
    }
    return () => clearInterval(timer)
  }, [isResendEnabled, user?.channel])

  const onResendOtp =
    (forcedChannel?: 'sms' | 'email') => async () => {
      try {
        if (user) {
          setDisabled(true)
          // Reset countdown and disable resend for SMS mode
          if (
            forcedChannel === AUTH_PIN_MODE.MODE_MOBILE ||
            (!forcedChannel && user?.channel === AUTH_PIN_MODE.MODE_MOBILE)
          ) {
            setIsResendEnabled(false)
            setCountdown(30)
          }

          const { username, acctId, password, setPassword } = user
          const channel = forcedChannel || user?.channel || AUTH_PIN_MODE.MODE_MOBILE
          const data = {
            username,
            channel,
            acctId,
            password,
            setPassword,
          }

          let result
          const token = localStorage.getItem('tokenForOtp') ?? ''
          if (user?.isFromLogin) {
            result = await requestOtp(data, channel, token)
          } else {
            result = await forgotPassword(data)
          }
          if (result.status === 'failed') {
            toast.error(result.message)
          }

          if (result?.status === 'success') {
            toast.success(result.dataReason || 'OTP sent successfully')
          }

          setDisabled(false)
        }
      } catch (error: any) {
        toast.error(error?.data?.response?.message)
        setDisabled(false)
      }
    }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)

    try {
      const data = {
        username: user?.username,
        acctId: user?.acctId,
        password: values?.otp,
        setPassword: user?.setPassword,
      }

      const result: any = await getSessionUsingPin(data)

      if (result.status === 'failed') {
        toast.error(result.message)
      }
      setIsLoading(false)
    } catch (error: any) {
      toast.error(error?.data?.response?.message || 'Something went wrong')
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-2', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='otp'
          render={({ field }) => (
            <FormItem className='mb-5'>
              <FormLabel>{getLocalizedValue(ONE_TIME_PIN_LABEL)}</FormLabel>
              <FormControl>
                <Input
                  autoFocus
                  type='text'
                  placeholder={getLocalizedValue(ONE_TIME_PIN_PLACEHOLDER)}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div
          className='my-5 mt-8 flex justify-start'
          style={{
            pointerEvents: !isResendEnabled ? 'none' : 'auto',
            cursor: !isResendEnabled ? 'no-drop' : 'pointer',
          }}
        >
          {!isResendEnabled ? (
            <span className='text-sm font-normal'>
              {getLocalizedValue(RESEND_PIN_BTN_LABEL)}
              {user?.channel === AUTH_PIN_MODE.MODE_MOBILE && countdown > 0 && (
                <span className='ml-1 text-gray-500'>({countdown}s)</span>
              )}
            </span>
          ) : (
            <span
              className='cursor-pointer font-normal text-sky-600'
              onClick={onResendOtp()}
            >
              {getLocalizedValue(RESEND_PIN_BTN_LABEL)}
            </span>
          )}
        </div>

        {user?.channel === AUTH_PIN_MODE.MODE_MOBILE && (
          <div className='mb-5'>
            <div className='mb-2 text-sm text-gray-700'>
              {getLocalizedValue(NOT_HAVE_ACCESS_TO_PHONE_LABEL)}
            </div>
            <span
              className='cursor-pointer text-sm font-normal text-sky-600 underline'
              style={{
                pointerEvents: disabled ? 'none' : 'auto',
                cursor: disabled ? 'no-drop' : 'pointer',
              }}
              onClick={onResendOtp(AUTH_PIN_MODE.MODE_EMAIL)}
            >
              {getLocalizedValue(RECEIVE_PIN_VIA_EMAIL_BTN_LABEL)}
            </span>
          </div>
        )}

        <Button disabled={disabled || isLoading}>
          {isLoading
            ? 'Verifying...'
            : user?.setPassword
              ? getLocalizedValue(VERIFY_AND_SET_PASSWORD_BTN_LABEL)
              : getLocalizedValue(VERIFY_BTN_LABEL)}
        </Button>

        <div className='mt-4 text-center'>
          <span>{getLocalizedValue(BACK_TO_LABEL)} </span>
          <a href='/sign-in' className='text-sky-600 hover:underline'>
            {getLocalizedValue(SIGN_IN_LABEL)}
          </a>
        </div>
      </form>
    </Form>
  )
}
