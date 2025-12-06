import { useSearch } from '@tanstack/react-router'
import { LOCALIZATION_CONSTANT_KEYS } from '@/lib/localization-constants'
import { useCompanyLocalizations } from '@/hooks/use-company-localizations'
import { useCompanySettings } from '@/hooks/use-company-settings'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { UserAuthForm } from './components/user-auth-form'
import { CustomerSupport } from '../components/customer-support'

const {
  PRIVACY_POLICY_LABEL,
  TERMS_AND_CONDITIONS_LABEL,
  SIGN_IN_LABEL,
} = LOCALIZATION_CONSTANT_KEYS.LOGIN

export function SignIn() {
  const { redirect } = useSearch({ from: '/(auth)/sign-in' })
  const company = useCompanySettings()
  const { getLocalizedValue } = useCompanyLocalizations()

  const customerSupportEmail =
    company?.settings?.find(
      (setting) => setting.setting.title === 'Current Customer Support Email'
    )?.value || 'support@example.com'

  const supportPhoneNumber =
    company?.settings?.find(
      (setting) => setting.setting.title === 'Support Phone Number'
    )?.value || ''

  const termsAndConditionsLink =
    company?.settings?.find(
      (setting) => setting.setting.title === 'Terms and Conditions link'
    )?.value || '#'

  const privacyAndPolicyLink =
    company?.settings?.find(
      (setting) => setting.setting.title === 'Privacy Policy link'
    )?.value || '#'

  const footerLinkLabel =
    company?.settings?.find(
      (setting) => setting.setting.title === 'Footer Link Label'
    )?.value || ''

  const footerLinkValue =
    company?.settings?.find(
      (setting) => setting.setting.title === 'Footer Link Value'
    )?.value || ''

  return (
    <Card className='gap-4'>
      <CardHeader>
        <CardTitle className='text-2xl font-semibold text-stone-900 dark:text-zinc-100'>
          {getLocalizedValue(SIGN_IN_LABEL)}
        </CardTitle>
        <CardDescription>
          Enter your credentials below to log into your account
        </CardDescription>      
      </CardHeader>
      <CardContent>
        <UserAuthForm redirectTo={redirect} />

        <CustomerSupport
          customerSupportEmail={customerSupportEmail}
          supportPhoneNumber={supportPhoneNumber}
        />

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
  )
}
