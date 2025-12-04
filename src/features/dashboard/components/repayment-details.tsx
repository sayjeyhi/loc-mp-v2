import { LOCALIZATION_CONSTANT_KEYS } from '@/lib/localization-constants'
import { formatCurrency } from '@/utils/formatCurrency'
import { useCompanyLocalizations } from '@/hooks/use-company-localizations'
import { useProfileLoader } from '@/hooks/use-profile-loader'

const {
  REPAYMENT_DETAILS_LABEL,
  REPAYMENT_SCHEDULE_LABEL,
  CURRENT_BALANCE_LABEL,
} = LOCALIZATION_CONSTANT_KEYS.DASHBOARD

const { CONTRACT_STATUS_DISCOUNTED_BALANCE_LABEL } =
  LOCALIZATION_CONSTANT_KEYS.CONTRACT_STATUS

export function RepaymentDetails() {
  const { accountProfile } = useProfileLoader()
  const { getLocalizedValue } = useCompanyLocalizations()
  const { account } = accountProfile || {}
  return (
    <div className='rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800'>
      <h2 className='mb-8 flex items-center gap-3 text-xl font-bold text-gray-900 dark:text-white'>
        <div className='h-6 w-1 rounded-full bg-gray-300'></div>
        {getLocalizedValue(REPAYMENT_DETAILS_LABEL)}
      </h2>

      <div className='space-y-6'>
        <div>
          <p className='mb-1 text-sm text-gray-600 dark:text-gray-400'>
            {getLocalizedValue(REPAYMENT_SCHEDULE_LABEL)}
          </p>
          <p className='text-primary dark:text-primary text-xl font-semibold'>
            {account?.collectionFrequencyTypeDescription || 'N/A'}
          </p>
        </div>

        <div className='border-t border-gray-200 pt-6 dark:border-gray-700'>
          <p className='mb-1 text-sm text-gray-600 dark:text-gray-400'>
            {getLocalizedValue(CONTRACT_STATUS_DISCOUNTED_BALANCE_LABEL)}
          </p>
          <p className='text-primary dark:text-primary text-2xl font-semibold'>
            {formatCurrency(account?.potentialDiscount)}
          </p>
        </div>

        <div className='border-t border-gray-200 pt-6 dark:border-gray-700'>
          <p className='mb-2 text-sm text-gray-600 dark:text-gray-400'>
            {getLocalizedValue(CURRENT_BALANCE_LABEL)}
          </p>
          <p className='text-primary dark:text-primary text-2xl font-semibold'>
            {formatCurrency(account?.payoffOutstandingAmount)}
          </p>
        </div>
      </div>
    </div>
  )
}
