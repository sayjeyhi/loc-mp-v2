import { formatCurrency } from '@/lib/utils/formatCurrency'
import { useCompanyLocalizations } from '@/hooks/use-company-localizations'
import { useProfileLoader } from '@/hooks/use-profile-loader'

export function AccountDetails() {
  const { accountProfile } = useProfileLoader()
  const { getLocalizedValue } = useCompanyLocalizations()
  const { account } = accountProfile || {}
  // Get numeric values for calculations
  const getNumericValue = (value: string | number | undefined): number => {
    if (value === undefined || value === null) return 0
    return typeof value === 'string' ? parseFloat(value) : value
  }

  // Calculate balance values
  const availableBalance = getNumericValue(account?.availableBalance)
  const usedBalance = getNumericValue(account?.fundedOutstandingAmount)
  const pendingBalance = getNumericValue(account?.pendingBalance)
  const maxFundingLimit = getNumericValue(account?.maxFundingLimit)

  // Calculate percentages
  const availablePercent =
    maxFundingLimit > 0 ? (availableBalance / maxFundingLimit) * 100 : 0
  const usedPercent =
    maxFundingLimit > 0 ? (usedBalance / maxFundingLimit) * 100 : 0

  return (
    <div className='rounded-lg bg-white p-6 shadow-sm dark:bg-slate-900'>
      <h2 className='mb-6 flex items-center gap-3 text-xl font-bold text-gray-900 dark:text-white'>
        <div className='h-6 w-1 rounded-full bg-gray-300'></div>
        {getLocalizedValue('ACCOUNT_DETAILS_LABEL')}
      </h2>

      {/* Funding Limit */}
      <div className='mb-6 border-b border-slate-200 pb-6'>
        <p className='mb-1 text-xs font-semibold tracking-wide text-slate-600 uppercase dark:text-slate-400'>
          {getLocalizedValue('LOC_FUNDING_LIMIT_LABEL')}
        </p>
        <p className='text-3xl font-bold text-slate-900 dark:text-slate-100'>
          {formatCurrency(maxFundingLimit)}
        </p>
      </div>

      <div className='space-y-4'>
        {/* Available Balance */}
        <div>
          <div className='mb-2 flex items-center justify-between'>
            <p className='text-sm font-medium text-slate-600 dark:text-slate-400'>
              {getLocalizedValue('DASHBOARD_AVAILABLE_BALANCE_LABEL')}
            </p>
            <p className='text-xl font-bold text-blue-600 dark:text-blue-400'>
              {formatCurrency(availableBalance)}
            </p>
          </div>
          <div className='h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700'>
            <div
              className='h-full rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 transition-all duration-500'
              style={{ width: `${availablePercent}%` }}
            />
          </div>
        </div>

        {/* Used Balance */}
        <div>
          <div className='mb-2 flex items-center justify-between'>
            <p className='text-sm font-medium text-slate-600 dark:text-slate-400'>
              {getLocalizedValue('DASHBOARD_USED_BALANCE_LABEL')}
            </p>
            <p className='text-xl font-bold text-red-600 dark:text-red-400'>
              {formatCurrency(usedBalance)}
            </p>
          </div>
          <div className='h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700'>
            <div
              className='h-full rounded-full bg-gradient-to-r from-red-400 to-red-500 transition-all duration-500'
              style={{ width: `${usedPercent}%` }}
            />
          </div>
        </div>

        {/* Pending Balance */}
        <div className='mt-6 border-t border-slate-200 pt-3 dark:border-slate-700'>
          <div className='flex items-center justify-between'>
            <p className='text-sm font-medium text-slate-600 dark:text-slate-400'>
              {getLocalizedValue('DASHBOARD_PENDING_BALANCE_LABEL')}
            </p>
            <p className='text-xl font-bold text-amber-600 dark:text-amber-400'>
              {formatCurrency(pendingBalance)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
