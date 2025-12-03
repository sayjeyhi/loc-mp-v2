import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { AppHeader } from '@/components/layout/app-header.tsx'
import { useProfileLoader } from '@/hooks/use-profile-loader'
import { useCompanyLocalizations } from '@/hooks/use-company-localizations'
import { LOCALIZATION_CONSTANT_KEYS } from '@/lib/localization-constants'
import { useCompanySettings } from '@/hooks/use-company-settings'

const {
  ACCOUNT_DETAILS_LABEL,
  DASHBOARD_AVAILABLE_BALANCE_LABEL,
  DASHBOARD_USED_BALANCE_LABEL,
  DASHBOARD_PENDING_BALANCE_LABEL,
  REPAYMENT_DETAILS_LABEL,
  REPAYMENT_SCHEDULE_LABEL,
  CURRENT_BALANCE_LABEL,
  CASH_DRAW_LABEL,
  ENTER_AMOUNT_FOR_WITHDRAW_LABEL,
  PAY_NOW_BTN_LABEL,
  COLLECTION_SUMMARY_LABEL,
  LIFETIME_FUNDING_LABEL,
  LAST_DATE_LABEL,
  TRANSACTION_COUNT_LABEL,
  LIFETIME_COLLECTIONS_LABEL,
  TOTAL_SAVED_AMOUNT_LABEL,
  MISSED_PAYMENTS_LABEL,
  MISSED_PAYMENT_BALANCE_LABEL,
  MAKE_VOLUNTARY_PREPAYMENT_TITLE,
  VOLUNTARY_PREPAYMENT_REQUEST_DISCLAIMER_THREE,
} = LOCALIZATION_CONSTANT_KEYS.DASHBOARD

const { CONTRACT_STATUS_DISCOUNTED_BALANCE_LABEL } = LOCALIZATION_CONSTANT_KEYS.CONTRACT_STATUS

export function Dashboard() {
  const { accountProfile, loading } = useProfileLoader()
  const { getLocalizedValue } = useCompanyLocalizations()
  const company = useCompanySettings()

  const { account } = accountProfile || {}

  // Format currency
  const formatCurrency = (amount: string | number | undefined) => {
    if (amount === undefined || amount === null) return '$0.00'
    const symbol = company?.country?.symbol || '$'
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    return `${symbol}${numAmount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`
  }

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
  const totalBalance = availableBalance + usedBalance + pendingBalance

  // Calculate percentages
  const availablePercent = maxFundingLimit > 0 ? (availableBalance / maxFundingLimit) * 100 : 0
  const usedPercent = maxFundingLimit > 0 ? (usedBalance / maxFundingLimit) * 100 : 0

  if (loading) {
    return (
      <>
        <Header>
          <AppHeader />
          <div className='ms-auto flex items-center space-x-4'>
            <ThemeSwitch />
            <ProfileDropdown />
          </div>
        </Header>
        <Main>
          <div className='flex items-center justify-center min-h-[400px]'>
            <div className='text-center'>
              <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]'></div>
              <p className='mt-4 text-muted-foreground'>Loading profile...</p>
            </div>
          </div>
        </Main>
      </>
    )
  }

  return (
    <>
      {/* ===== Top Heading ===== */}
      <Header>
        <AppHeader />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ProfileDropdown />
        </div>
      </Header>

      {/* ===== Main ===== */}
      <Main>

        <div className='grid grid-cols-2 gap-6 mb-8'>
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6'>
            <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3'>
              <div className="w-1 h-6 bg-blue-600 rounded-full"></div>
              {getLocalizedValue(ACCOUNT_DETAILS_LABEL)}
            </h2>

            {/* Funding Limit */}
            <div className="mb-6 pb-6 border-b border-slate-200">
              <p className="text-slate-600 text-xs uppercase tracking-wide font-semibold mb-1">Funding Limit</p>
              <p className="text-3xl font-bold text-slate-900">$1,000.00</p>
            </div>


            <div className='space-y-4'>
              {/* Available Balance */}
              <div>
                <div className='flex items-center justify-between mb-2'>
                  <p className='text-slate-600 dark:text-slate-400 text-sm font-medium'>
                    {getLocalizedValue(DASHBOARD_AVAILABLE_BALANCE_LABEL)}
                  </p>
                  <p className='text-xl font-bold text-blue-600 dark:text-blue-400'>
                    {formatCurrency(availableBalance)}
                  </p>
                </div>
                <div className='h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500'
                    style={{ width: `${availablePercent}%` }}
                  />
                </div>
              </div>

              {/* Used Balance */}
              <div>
                <div className='flex items-center justify-between mb-2'>
                  <p className='text-slate-600 dark:text-slate-400 text-sm font-medium'>
                    {getLocalizedValue(DASHBOARD_USED_BALANCE_LABEL)}
                  </p>
                  <p className='text-xl font-bold text-red-600 dark:text-red-400'>
                    {formatCurrency(usedBalance)}
                  </p>
                </div>
                <div className='h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden'>
                  <div
                    className='h-full bg-gradient-to-r from-red-400 to-red-500 rounded-full transition-all duration-500'
                    style={{ width: `${usedPercent}%` }}
                  />
                </div>
              </div>

              {/* Pending Balance */}
              <div className='pt-2 border-t border-slate-200 dark:border-slate-700'>
                <div className='flex items-center justify-between'>
                  <p className='text-slate-600 dark:text-slate-400 text-sm font-medium'>
                    {getLocalizedValue(DASHBOARD_PENDING_BALANCE_LABEL)}
                  </p>
                  <p className='text-xl font-bold text-amber-600 dark:text-amber-400'>
                    {formatCurrency(pendingBalance)}
                  </p>
                </div>
              </div>

              {/* Summary Grid */}
              <div className='grid grid-cols-3 gap-2 pt-2 border-t border-slate-200 dark:border-slate-700'>
                <div className='text-center py-2'>
                  <p className='text-slate-500 dark:text-slate-400 text-xs mb-1'>Total</p>
                  <p className='font-bold text-slate-900 dark:text-white'>
                    {formatCurrency(totalBalance)}
                  </p>
                </div>
                <div className='text-center py-2 border-l border-r border-slate-200 dark:border-slate-700'>
                  <p className='text-slate-500 dark:text-slate-400 text-xs mb-1'>Used</p>
                  <p className='font-bold text-red-600 dark:text-red-400'>
                    {usedPercent.toFixed(0)}%
                  </p>
                </div>
                <div className='text-center py-2'>
                  <p className='text-slate-500 dark:text-slate-400 text-xs mb-1'>Pending</p>
                  <p className='font-bold text-amber-600 dark:text-amber-400'>
                    {formatCurrency(pendingBalance)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6'>
            <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3'>
              <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>

              {getLocalizedValue(REPAYMENT_DETAILS_LABEL)}
            </h2>

            <div className='space-y-6'>
              <div>
                <h3 className='text-primary dark:text-primary font-semibold mb-2'>
                  {getLocalizedValue(REPAYMENT_SCHEDULE_LABEL)}:
                </h3>
                <p className='text-lg text-gray-900 dark:text-white'>
                  {account?.collectionFrequencyTypeDescription || 'N/A'}
                </p>
              </div>

              <div>
                <p className='text-sm mb-1 text-gray-600 dark:text-gray-400'>
                  {getLocalizedValue(CONTRACT_STATUS_DISCOUNTED_BALANCE_LABEL)}
                </p>
                <p className='text-primary dark:text-primary text-2xl font-semibold'>
                  {formatCurrency(account?.potentialDiscount)}
                </p>
              </div>

              <div className='border-t border-gray-200 dark:border-gray-700 pt-6'>
                <p className='text-sm mb-2 text-gray-600 dark:text-gray-400'>
                  {getLocalizedValue(CURRENT_BALANCE_LABEL)}
                </p>
                <p className='text-primary dark:text-primary text-2xl font-semibold'>
                  {formatCurrency(account?.payoffOutstandingAmount)}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className='grid grid-cols-2 gap-6 mb-8'>
          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6'>
            <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3'>
              <div className="w-1 h-6 bg-blue-600 rounded-full"></div>

              {getLocalizedValue(CASH_DRAW_LABEL)}
            </h3>

            <p className='text-sm mb-4 text-gray-600 dark:text-gray-400'>
              {getLocalizedValue(ENTER_AMOUNT_FOR_WITHDRAW_LABEL)}
            </p>

            <div className='flex gap-3 items-center mb-4'>
              <div className='flex items-center border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700'>
                <span className='px-3 py-2 text-gray-600 dark:text-gray-400'>
                  {company?.country?.symbol || '$'}
                </span>
                <input
                  type='number'
                  placeholder='0.00'
                  className='flex-1 px-3 py-2 outline-none bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500'
                />
              </div>
            </div>

            <button className='w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-lg transition-colors'>
              {getLocalizedValue(CASH_DRAW_LABEL)}
            </button>
          </div>

          <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6'>
            <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3'>
              <div className="w-1 h-6 bg-emerald-500 rounded-full"></div>

              {getLocalizedValue(MAKE_VOLUNTARY_PREPAYMENT_TITLE)}
            </h3>

            <p className='text-sm mb-6 text-gray-600 dark:text-gray-400'>
              {getLocalizedValue(VOLUNTARY_PREPAYMENT_REQUEST_DISCLAIMER_THREE)}
            </p>

            <button className='w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2 px-4 rounded-lg transition-colors'>
              {getLocalizedValue(PAY_NOW_BTN_LABEL)}
            </button>
          </div>
        </div>

        <div>
          <h2 className='text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3'>

            {getLocalizedValue(COLLECTION_SUMMARY_LABEL)}
          </h2>

          <div className='grid grid-cols-3 gap-6'>
            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-6'>
                {getLocalizedValue(LIFETIME_FUNDING_LABEL)}
              </h3>

              <div className='border-t border-gray-200 dark:border-gray-700 pt-4'>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  {getLocalizedValue(LAST_DATE_LABEL)}
                </p>
                <p className='text-base font-medium text-gray-900 dark:text-white mt-1'>
                  {account?.lastPaidPaymentDate || 'N/A'}
                </p>
              </div>

              <div className='border-t border-gray-200 dark:border-gray-700 mt-4 pt-4'>
                <p className='text-sm mb-2 text-gray-600 dark:text-gray-400'>
                  {getLocalizedValue(TRANSACTION_COUNT_LABEL)}
                </p>
                <p className='text-xl font-semibold text-gray-900 dark:text-white'>
                  {account?.paymentCount || 0}
                </p>
              </div>
            </div>

            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-6'>
                {getLocalizedValue(LIFETIME_COLLECTIONS_LABEL)}
              </h3>

              <div className='border-t border-gray-200 dark:border-gray-700 pt-4'>
                <p className='text-sm mb-2 text-gray-600 dark:text-gray-400'>
                  {getLocalizedValue(TOTAL_SAVED_AMOUNT_LABEL)}
                </p>
                <p className='text-xl font-semibold text-gray-900 dark:text-white'>
                  {formatCurrency(account?.totalSavedAmount)}
                </p>
              </div>
            </div>

            <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6'>
              <h3 className='text-lg font-semibold text-gray-900 dark:text-white mb-6'>
                {getLocalizedValue(MISSED_PAYMENTS_LABEL)}
              </h3>

              <div className='border-t border-gray-200 dark:border-gray-700 pt-4'>
                <p className='text-sm mb-2 text-gray-600 dark:text-gray-400'>
                  {getLocalizedValue(MISSED_PAYMENT_BALANCE_LABEL)}
                </p>
                <p className='text-xl font-semibold text-gray-900 dark:text-white'>
                  {formatCurrency(account?.arrears)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Main>

      <footer className='p-4 text-center text-sm text-gray-500 dark:text-gray-400'>
        &copy; {new Date().getFullYear()} Bizcap. All rights reserved.
      </footer>
    </>
  )
}

