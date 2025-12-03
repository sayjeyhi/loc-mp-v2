import { LOCALIZATION_CONSTANT_KEYS } from '@/lib/localization-constants'
import { useCompanyLocalizations } from '@/hooks/use-company-localizations'

const {
  MAKE_VOLUNTARY_PREPAYMENT_TITLE,
  VOLUNTARY_PREPAYMENT_REQUEST_DISCLAIMER_THREE,
  PAY_NOW_BTN_LABEL,
} = LOCALIZATION_CONSTANT_KEYS.DASHBOARD

export function MakeVoluntaryPrepayment() {
  const { getLocalizedValue } = useCompanyLocalizations()
  return (
    <div className='rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800'>
      <h3 className='mb-4 flex items-center gap-3 text-lg font-bold text-gray-900 dark:text-white'>
        <div className='h-6 w-1 rounded-full bg-emerald-500'></div>
        {getLocalizedValue(MAKE_VOLUNTARY_PREPAYMENT_TITLE)}
      </h3>

      <p className='mb-6 text-sm text-gray-600 dark:text-gray-400'>
        {getLocalizedValue(VOLUNTARY_PREPAYMENT_REQUEST_DISCLAIMER_THREE)}
      </p>

      <button className='bg-primary hover:bg-primary/90 text-primary-foreground w-full rounded-lg px-4 py-2 font-semibold transition-colors'>
        {getLocalizedValue(PAY_NOW_BTN_LABEL)}
      </button>
    </div>
  )
}

