import { useCompanyLocalizations } from '@/hooks/use-company-localizations'
import { LOCALIZATION_CONSTANT_KEYS } from '@/lib/localization-constants'

const { CUSTOMER_SUPPORT_LABEL } = LOCALIZATION_CONSTANT_KEYS.LOGIN

type CustomerSupportProps = {
  customerSupportEmail?: string
  supportPhoneNumber?: string
}

export function CustomerSupport({
  customerSupportEmail,
  supportPhoneNumber,
}: CustomerSupportProps) {
  const { getLocalizedValue } = useCompanyLocalizations()

  if (!customerSupportEmail && !supportPhoneNumber) {
    return null
  }

  return (
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
  )
}
