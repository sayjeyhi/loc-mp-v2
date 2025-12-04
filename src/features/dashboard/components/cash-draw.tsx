import { LOCALIZATION_CONSTANT_KEYS } from '@/lib/localization-constants'
import { useCompanyLocalizations } from '@/hooks/use-company-localizations'
import { useCompanySettings } from '@/hooks/use-company-settings'

const { CASH_DRAW_LABEL, ENTER_AMOUNT_FOR_WITHDRAW_LABEL } =
  LOCALIZATION_CONSTANT_KEYS.DASHBOARD

export function CashDraw() {
  const company = useCompanySettings()
  const { getLocalizedValue } = useCompanyLocalizations()
  const currencySymbol = company?.country?.symbol || '$'
  return (
    <div className='rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800'>
      <h3 className='mb-8 flex items-center gap-3 text-lg font-bold text-gray-900 dark:text-white'>
        <div className='h-6 w-1 rounded-full bg-gray-300'></div>
        {getLocalizedValue(CASH_DRAW_LABEL)}
      </h3>

      <p className='mb-4 text-sm text-gray-600 dark:text-gray-400'>
        {getLocalizedValue(ENTER_AMOUNT_FOR_WITHDRAW_LABEL)}
      </p>

      <div className='mb-4 flex w-full items-center gap-3'>
        <div className='flex w-full items-center overflow-hidden rounded-lg border border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700'>
          <span className='px-3 py-2 text-gray-600 dark:text-gray-400'>
            {currencySymbol}
          </span>
          <input
            type='number'
            placeholder='0.00'
            className='flex-1 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 outline-none dark:bg-gray-700 dark:text-white dark:placeholder-gray-500'
          />
        </div>

        <button className='bg-primary hover:bg-primary/90 text-primary-foreground w-40 rounded-lg px-4 py-2 font-semibold transition-colors'>
          {getLocalizedValue(CASH_DRAW_LABEL)}
        </button>
      </div>
    </div>
  )
}
