import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { OtpForm } from './components/otp-form'
import { useCompanySettings } from '@/hooks/use-company-settings'
import { useCompanyLocalizations } from '@/hooks/use-company-localizations'
import { LOCALIZATION_CONSTANT_KEYS } from '@/lib/localization-constants'

const { VERIFY_OTP_PAGE_LABEL, VERIFY_OTP_PAGE_SUBTITLE } =
  LOCALIZATION_CONSTANT_KEYS.OTP
const { CUSTOMER_SUPPORT_LABEL } = LOCALIZATION_CONSTANT_KEYS.LOGIN

export function Otp() {
  const company = useCompanySettings()
  const { getLocalizedValue } = useCompanyLocalizations()

  const customerSupportEmail = company?.settings?.find(
    (setting) => setting.setting.title === 'Current Customer Support Email'
  )?.value || ''

  const supportPhoneNumber = company?.settings?.find(
    (setting) => setting.setting.title === 'Support Phone Number'
  )?.value || ''

  return (
    <Card className='gap-4'>
      <CardHeader>
        <CardTitle className='text-2xl font-semibold text-stone-900 dark:text-zinc-100'>
          {getLocalizedValue(VERIFY_OTP_PAGE_LABEL)}
        </CardTitle>
        <CardDescription className='text-sm font-normal text-zinc-500 dark:text-zinc-300'>
          {getLocalizedValue(VERIFY_OTP_PAGE_SUBTITLE)}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <OtpForm />

        {/* Customer Support */}
        {(customerSupportEmail || supportPhoneNumber) && (
          <div className='mt-10 rounded-md bg-zinc-100 px-2 py-6 dark:bg-stone-800'>
            <div className='flex justify-center'>
              <span className='text-lg font-bold text-stone-900 dark:text-zinc-100'>
                {getLocalizedValue(CUSTOMER_SUPPORT_LABEL)}
              </span>
            </div>
            <div className='mt-4 flex flex-col items-center justify-center gap-2 xl:flex-row'>
              {supportPhoneNumber && (
                <>
                  <div className='flex items-center justify-center gap-2 xl:justify-start'>
                    <span className='text-base font-medium text-zinc-500 underline dark:text-zinc-100'>
                      {supportPhoneNumber}
                    </span>
                    <span className='hidden text-base font-medium text-zinc-500 xl:block'>
                      |
                    </span>
                  </div>
                </>
              )}
              {customerSupportEmail && (
                <span className='text-base font-medium text-zinc-500 underline dark:text-zinc-100'>
                  {customerSupportEmail}
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
