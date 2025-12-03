import { LOCALIZATION_CONSTANT_KEYS } from '@/lib/localization-constants'
import { useCompanyLocalizations } from '@/hooks/use-company-localizations'
import { useCompanySettings } from '@/hooks/use-company-settings'
import { useProfileLoader } from '@/hooks/use-profile-loader'
import { Footer } from '@/components/layout/footer.tsx'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'

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

const { CONTRACT_STATUS_DISCOUNTED_BALANCE_LABEL } =
  LOCALIZATION_CONSTANT_KEYS.CONTRACT_STATUS

export function Dashboard() {
  const { accountProfile } = useProfileLoader()
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
  const availablePercent =
    maxFundingLimit > 0 ? (availableBalance / maxFundingLimit) * 100 : 0
  const usedPercent =
    maxFundingLimit > 0 ? (usedBalance / maxFundingLimit) * 100 : 0

  return (
    <>
      <Header />

      {/* ===== Main ===== */}
      <Main>
        <div className='mb-8 grid grid-cols-2 gap-6'>
          <div className='rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800'>
            <h2 className='mb-6 flex items-center gap-3 text-xl font-bold text-gray-900 dark:text-white'>
              <div className='h-6 w-1 rounded-full bg-blue-600'></div>
              {getLocalizedValue(ACCOUNT_DETAILS_LABEL)}
            </h2>

            {/* Funding Limit */}
            <div className='mb-6 border-b border-slate-200 pb-6'>
              <p className='mb-1 text-xs font-semibold tracking-wide text-slate-600 uppercase'>
                Funding Limit
              </p>
              <p className='text-3xl font-bold text-slate-900'>
                {formatCurrency(maxFundingLimit)}
              </p>
            </div>

            <div className='space-y-4'>
              {/* Available Balance */}
              <div>
                <div className='mb-2 flex items-center justify-between'>
                  <p className='text-sm font-medium text-slate-600 dark:text-slate-400'>
                    {getLocalizedValue(DASHBOARD_AVAILABLE_BALANCE_LABEL)}
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
                    {getLocalizedValue(DASHBOARD_USED_BALANCE_LABEL)}
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
                    {getLocalizedValue(DASHBOARD_PENDING_BALANCE_LABEL)}
                  </p>
                  <p className='text-xl font-bold text-amber-600 dark:text-amber-400'>
                    {formatCurrency(pendingBalance)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className='rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800'>
            <h2 className='mb-8 flex items-center gap-3 text-xl font-bold text-gray-900 dark:text-white'>
              <div className='h-6 w-1 rounded-full bg-emerald-500'></div>

              {getLocalizedValue(REPAYMENT_DETAILS_LABEL)}
            </h2>

            <div className='space-y-6'>
              <div>
                <p className='mb-1 text-sm text-gray-600 dark:text-gray-400'>
                  {getLocalizedValue(REPAYMENT_SCHEDULE_LABEL)}
                </p>
                <p className='text-primary dark:text-primary text-2xl font-semibold'>
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
        </div>

        <div className='mb-8 grid grid-cols-2 gap-6'>
          <div className='rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800'>
            <h3 className='mb-8 flex items-center gap-3 text-lg font-bold text-gray-900 dark:text-white'>
              <div className='h-6 w-1 rounded-full bg-blue-600'></div>
              {getLocalizedValue(CASH_DRAW_LABEL)}
            </h3>

            <p className='mb-4 text-sm text-gray-600 dark:text-gray-400'>
              {getLocalizedValue(ENTER_AMOUNT_FOR_WITHDRAW_LABEL)}
            </p>

            <div className='mb-4 flex items-center gap-3'>
              <div className='flex items-center rounded-lg border border-gray-300 bg-gray-50 dark:border-gray-600 dark:bg-gray-700'>
                <span className='px-3 py-2 text-gray-600 dark:text-gray-400'>
                  {company?.country?.symbol || '$'}
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
        </div>

        <div className='rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800'>
          <h2 className='mb-8 flex flex-col items-center gap-3 text-xl font-bold text-gray-900 md:flex-row dark:text-white'>
            <div className='h-6 w-1 rounded-full bg-emerald-500'></div>
            {getLocalizedValue(COLLECTION_SUMMARY_LABEL)}
          </h2>

          <div className='grid grid-cols-3 gap-6'>
            <div className='rounded-lg p-6'>
              <h3 className='mb-6 text-lg font-semibold text-gray-900 dark:text-white'>
                {getLocalizedValue(LIFETIME_FUNDING_LABEL)}
              </h3>

              <div className='flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700'>
                <p className='text-sm text-gray-600 dark:text-gray-400'>
                  {getLocalizedValue(LAST_DATE_LABEL)}
                </p>
                <p className='mt-1 text-base font-medium text-gray-900 dark:text-white'>
                  {account?.lastPaidPaymentDate || 'N/A'}
                </p>
              </div>

              <div className='flex items-center justify-between pt-4'>
                <p className='mb-2 text-sm text-gray-600 dark:text-gray-400'>
                  {getLocalizedValue(TRANSACTION_COUNT_LABEL)}
                </p>
                <p className='text-xl font-semibold text-gray-900 dark:text-white'>
                  {account?.paymentCount || 0}
                </p>
              </div>
            </div>

            <div className='rounded-lg p-6'>
              <h3 className='mb-6 text-lg font-semibold text-gray-900 dark:text-white'>
                {getLocalizedValue(LIFETIME_COLLECTIONS_LABEL)}
              </h3>

              <div className='border-t border-gray-200 pt-4 dark:border-gray-700'>
                <p className='mb-2 text-sm text-gray-600 dark:text-gray-400'>
                  {getLocalizedValue(TOTAL_SAVED_AMOUNT_LABEL)}
                </p>
                <p className='text-xl font-semibold text-gray-900 dark:text-white'>
                  {formatCurrency(account?.totalSavedAmount)}
                </p>
              </div>
            </div>

            <div className='rounded-lg p-6'>
              <h3 className='mb-6 text-lg font-semibold text-gray-900 dark:text-white'>
                {getLocalizedValue(MISSED_PAYMENTS_LABEL)}
              </h3>

              <div className='border-t border-gray-200 pt-4 dark:border-gray-700'>
                <p className='mb-2 text-sm text-gray-600 dark:text-gray-400'>
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
      <Footer />
    </>
  )
}
