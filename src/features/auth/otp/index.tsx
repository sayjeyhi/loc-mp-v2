import { useCompanyLocalizations } from '@/hooks/use-company-localizations'
import { useCompanySettings } from '@/hooks/use-company-settings'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { CustomerSupport } from '../components/customer-support'
import { OtpForm } from './components/otp-form'

export function Otp() {
  const company = useCompanySettings()
  const { getLocalizedValue } = useCompanyLocalizations()

  const customerSupportEmail =
    company?.settings?.find(
      (setting) => setting.setting.title === 'Current Customer Support Email'
    )?.value || ''

  const supportPhoneNumber =
    company?.settings?.find(
      (setting) => setting.setting.title === 'Support Phone Number'
    )?.value || ''

  return (
    <Card className='gap-4'>
      <CardHeader>
        <CardTitle className='text-2xl font-semibold text-stone-900 dark:text-zinc-100'>
          {getLocalizedValue('VERIFY_OTP_PAGE_LABEL')}
        </CardTitle>
        <CardDescription className='text-sm font-normal text-zinc-500 dark:text-zinc-300'>
          {getLocalizedValue('VERIFY_OTP_PAGE_SUBTITLE')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <OtpForm />

        <CustomerSupport
          customerSupportEmail={customerSupportEmail}
          supportPhoneNumber={supportPhoneNumber}
        />
      </CardContent>
    </Card>
  )
}
