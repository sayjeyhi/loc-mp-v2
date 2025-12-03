import { useSearch } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { AuthLayout } from '../auth-layout'
import { UserAuthForm } from './components/user-auth-form'
import { useCompanySettings } from '@/hooks/use-company-settings'
import { useCompanyLocalizations } from '@/hooks/use-company-localizations'
import { LOCALIZATION_CONSTANT_KEYS } from '@/lib/localization-constants'
import { cn } from '@/lib/utils.ts'

const { SIGN_IN_LABEL, CUSTOMER_SUPPORT_LABEL, PRIVACY_POLICY_LABEL, TERMS_AND_CONDITIONS_LABEL } =
  LOCALIZATION_CONSTANT_KEYS.LOGIN

export function SignIn() {
  const { redirect } = useSearch({ from: '/(auth)/sign-in' })
  const company = useCompanySettings()
  const { getLocalizedValue } = useCompanyLocalizations()

  const customerSupportEmail = company?.settings?.find(
    (setting) => setting.setting.title === 'Current Customer Support Email'
  )?.value || 'support@example.com'

  const supportPhoneNumber = company?.settings?.find(
    (setting) => setting.setting.title === 'Support Phone Number'
  )?.value || ''

  const termsAndConditionsLink = company?.settings?.find(
    (setting) => setting.setting.title === 'Terms and Conditions link'
  )?.value || '#'

  const privacyAndPolicyLink = company?.settings?.find(
    (setting) => setting.setting.title === 'Privacy Policy link'
  )?.value || '#'

  const footerLinkLabel = company?.settings?.find(
    (setting) => setting.setting.title === 'Footer Link Label'
  )?.value || ''

  const footerLinkValue = company?.settings?.find(
    (setting) => setting.setting.title === 'Footer Link Value'
  )?.value || ''

  return (
    <div className='relative container grid h-svh flex-col items-center justify-center lg:max-w-none lg:grid-cols-2 lg:px-0'>
      <AuthLayout>
        <Card className='gap-4'>
          <CardHeader>
            <CardTitle className='text-lg tracking-tight'>
              {getLocalizedValue(SIGN_IN_LABEL)} {company?.name || ''}
            </CardTitle>
            <CardDescription>
              Enter your credentials below to log into your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserAuthForm redirectTo={redirect} />

            {/* Customer Support */}
            {(customerSupportEmail || supportPhoneNumber) && (
              <div className='mt-10 rounded-md bg-zinc-100 px-2 py-6'>
                <div className='flex justify-center'>
                  <span className='text-lg font-bold text-stone-900'>
                    {getLocalizedValue(CUSTOMER_SUPPORT_LABEL)}
                  </span>
                </div>
                <div className='mt-4 flex flex-col items-center justify-center gap-2 xl:flex-row'>
                  {supportPhoneNumber && (
                    <>
                      <div className='flex items-center justify-center gap-2 xl:justify-start'>
                        <span className='text-base font-medium text-zinc-500 underline'>
                          {supportPhoneNumber}
                        </span>
                        <span className='hidden text-base font-medium text-zinc-500 xl:block'>
                          |
                        </span>
                      </div>
                    </>
                  )}
                  {customerSupportEmail && (
                    <span className='text-base font-medium text-zinc-500 underline'>
                      {customerSupportEmail}
                    </span>
                  )}
                </div>
              </div>
            )}

            {/* Policy and Terms Links */}
            <div className='mt-6 flex items-center justify-center gap-2'>
              <a href={privacyAndPolicyLink} target='_blank' rel='noreferrer'>
                <span className='text-base font-medium text-zinc-500'>
                  {getLocalizedValue(PRIVACY_POLICY_LABEL)}
                </span>
              </a>
              <span className='text-base font-medium text-zinc-500'>|</span>
              <a href={termsAndConditionsLink} target='_blank' rel='noreferrer'>
                <span className='text-base font-medium text-zinc-500'>
                  {getLocalizedValue(TERMS_AND_CONDITIONS_LABEL)}
                </span>
              </a>
              {footerLinkLabel && footerLinkValue && (
                <>
                  <span className='text-base font-medium text-zinc-500'>|</span>
                  <a href={footerLinkValue} target='_blank' rel='noreferrer'>
                    <span className='text-base font-medium text-zinc-500'>
                      {footerLinkLabel}
                    </span>
                  </a>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </AuthLayout>
      <div
        className={cn(
          'bg-muted relative h-full overflow-hidden max-lg:hidden',
          '[&>img]:absolute [&>img]:top-[15%] [&>img]:left-20 [&>img]:h-full [&>img]:w-full [&>img]:object-cover [&>img]:object-top-left [&>img]:select-none'
        )}
      >
        <img
          src={company?.auth_bg_url}
          width={1024}
          height={1138}
          alt='Shadcn-Admin'
        />
      </div>
    </div>
  )
}
