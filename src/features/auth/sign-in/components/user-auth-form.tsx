import { useState, useRef } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from '@tanstack/react-router'
import { Loader2, LogIn } from 'lucide-react'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
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
import { PasswordInput } from '@/components/password-input'
import useAuth from '@/hooks/use-auth'
import { AUTH_PIN_MODE } from '@/lib/constants'
import { useCompanyLocalizations } from '@/hooks/use-company-localizations'
import { LOCALIZATION_CONSTANT_KEYS } from '@/lib/localization-constants'

const { USERNAME_LABEL, ACCOUNT_NUMBER_LABEL, PASSWORD_LABEL, SIGN_IN_LABEL, FORGOT_PASSWORD_LABEL } =
  LOCALIZATION_CONSTANT_KEYS.LOGIN

const formSchema = z.object({
  username: z.string().min(1, 'Please enter your user name'),
  acctId: z.string().min(1, 'Please enter account number'),
  password: z.string().optional(),
})

interface UserAuthFormProps extends React.HTMLAttributes<HTMLFormElement> {
  redirectTo?: string
}

export function UserAuthForm({
  className,
  ...props
}: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const { user } = useAuthStore()
  const { requestForPinOrg } = useAuth()
  const { getLocalizedValue } = useCompanyLocalizations()
  const channelRef = useRef<'sms' | 'email'>(AUTH_PIN_MODE.MODE_MOBILE)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: user?.username || '',
      acctId: user?.acctId || '',
      password: '',
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true)
    sessionStorage.removeItem('IDLE')

    try {
      const data: any = {
        ...values,
        channel: channelRef.current,
        advanceId: values?.acctId?.toString(),
        setPassword: false,
      }

      const result: any = await requestForPinOrg(data)

      if (result?.status === 'failed' && result?.statusCode === 400) {
        toast.error(
          "We couldn't send the SMS OTP code. We'll send it to your email instead."
        )
        channelRef.current = AUTH_PIN_MODE.MODE_EMAIL
        data.channel = AUTH_PIN_MODE.MODE_EMAIL
        await requestForPinOrg(data)
        setIsLoading(false)
        return
      }

      if (result?.status === 'failed') {
        let errorMessage = 'Something went wrong. Please try again later.'
        if (result?.statusCode === 400) {
          errorMessage = 'Was not able to send SMS OTP. Trying to send OTP via email'
          toast.error(errorMessage)
          channelRef.current = AUTH_PIN_MODE.MODE_EMAIL
          data.channel = AUTH_PIN_MODE.MODE_EMAIL
          await requestForPinOrg(data)
          setIsLoading(false)
          return
        } else if (result?.statusCode === 401) {
          errorMessage = 'Invalid credentials. Please check your credentials and try again.'
        }
        toast.error(errorMessage)
        setIsLoading(false)
        return
      }

      setIsLoading(false)
    } catch (error: any) {
      toast.error('Something went wrong. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('grid gap-3', className)}
        {...props}
      >
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{getLocalizedValue(USERNAME_LABEL)}</FormLabel>
              <FormControl>
                <Input
                  autoFocus
                  placeholder={getLocalizedValue(USERNAME_LABEL)}
                  {...field}
                  onChange={(e) => {
                    field.onChange(e.target.value)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='acctId'
          render={({ field }) => (
            <FormItem>
              <FormLabel>{getLocalizedValue(ACCOUNT_NUMBER_LABEL)}</FormLabel>
              <FormControl>
                <Input
                  placeholder={getLocalizedValue(ACCOUNT_NUMBER_LABEL)}
                  {...field}
                  onChange={(e) => {
                    // Replace non-alphanumeric characters with an empty string
                    const unformattedValue = e.target.value.replace(
                      /[^a-zA-Z0-9]/g,
                      ''
                    )
                    field.onChange(unformattedValue)
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem className='relative'>
              <FormLabel>{getLocalizedValue(PASSWORD_LABEL)}</FormLabel>
              <FormControl>
                <PasswordInput
                  autoComplete='off'
                  placeholder={getLocalizedValue(PASSWORD_LABEL)}
                  {...field}
                />
              </FormControl>
              <FormMessage />
              <Link
                to='/forgot-password'
                className='text-muted-foreground absolute end-0 -top-0.5 text-sm font-medium hover:opacity-75'
              >
                {getLocalizedValue(FORGOT_PASSWORD_LABEL)}
              </Link>
            </FormItem>
          )}
        />
        <Button className='mt-2' disabled={isLoading}>
          {isLoading ? <Loader2 className='animate-spin' /> : <LogIn />}
          {getLocalizedValue(SIGN_IN_LABEL)}
        </Button>
      </form>
    </Form>
  )
}
