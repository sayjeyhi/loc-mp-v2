import { formatCurrency } from '@/lib/utils/formatCurrency'
import { useCompanyLocalizations } from '@/hooks/use-company-localizations'
import { useProfileLoader } from '@/hooks/use-profile-loader'

export function CollectionSummary() {
  const { accountProfile } = useProfileLoader()
  const { getLocalizedValue } = useCompanyLocalizations()
  const { account } = accountProfile || {}
  return (
    <div className='rounded-lg bg-white p-6 shadow-sm dark:bg-slate-900'>
      <h2 className='mb-8 flex flex-col items-center gap-3 text-xl font-bold text-gray-900 md:flex-row dark:text-white'>
        <div className='h-6 w-1 rounded-full bg-gray-300'></div>
        {getLocalizedValue('COLLECTION_SUMMARY_LABEL')}
      </h2>

      <div className='grid grid-cols-3 gap-6'>
        <div className='rounded-lg border p-6'>
          <h3 className='mb-6 text-lg font-semibold text-gray-900 dark:text-white'>
            {getLocalizedValue('LIFETIME_FUNDING_LABEL')}
          </h3>

          <div className='flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700'>
            <p className='text-sm text-gray-600 dark:text-gray-400'>
              {getLocalizedValue('LAST_DATE_LABEL')}
            </p>
            <p className='mt-1 text-base font-medium text-gray-900 dark:text-white'>
              {account?.lastPaidPaymentDate || 'N/A'}
            </p>
          </div>

          <div className='flex items-center justify-between pt-4'>
            <p className='mb-2 text-sm text-gray-600 dark:text-gray-400'>
              {getLocalizedValue('TRANSACTION_COUNT_LABEL')}
            </p>
            <p className='text-xl font-semibold text-gray-900 dark:text-white'>
              {account?.paymentCount || 0}
            </p>
          </div>
        </div>

        <div className='rounded-lg border p-6'>
          <h3 className='mb-6 text-lg font-semibold text-gray-900 dark:text-white'>
            {getLocalizedValue('LIFETIME_COLLECTIONS_LABEL')}
          </h3>

          <div className='border-t border-gray-200 pt-4 dark:border-gray-700'>
            <p className='mb-2 text-sm text-gray-600 dark:text-gray-400'>
              {getLocalizedValue('TOTAL_SAVED_AMOUNT_LABEL')}
            </p>
            <p className='text-xl font-semibold text-gray-900 dark:text-white'>
              {formatCurrency(account?.totalSavedAmount)}
            </p>
          </div>
        </div>

        <div className='rounded-lg border p-6'>
          <h3 className='mb-6 text-lg font-semibold text-gray-900 dark:text-white'>
            {getLocalizedValue('MISSED_PAYMENTS_LABEL')}
          </h3>

          <div className='border-t border-gray-200 pt-4 dark:border-gray-700'>
            <p className='mb-2 text-sm text-gray-600 dark:text-gray-400'>
              {getLocalizedValue('MISSED_PAYMENT_BALANCE_LABEL')}
            </p>
            <p className='text-xl font-semibold text-gray-900 dark:text-white'>
              {formatCurrency(account?.arrears)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
