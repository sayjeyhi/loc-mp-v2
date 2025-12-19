import { useCallback } from 'react'
import { Input } from '@/components/ui/input.tsx'
import { useCompanyLocalizations } from '@/hooks/use-company-localizations.ts'

type AccountSummaryInfo = {
  accountNumber: string
  legalName: string
  transactionBalance: string
  paybackBalance: string
  payoffBalance: string
  potentialSavedAmount: string
}

type VoluntaryPrepaymentDrawerStep1Props = {
  currencySymbol: string
  accountInfo: AccountSummaryInfo
  amount: string
  onAmountChange: (nextAmount: string) => void
  disableAmount?: boolean
}

export function VoluntaryPrepaymentDrawerStep1({
  currencySymbol,
  accountInfo,
  amount,
  onAmountChange,
  disableAmount,
}: VoluntaryPrepaymentDrawerStep1Props) {
  const { getLocalizedValue } = useCompanyLocalizations()

  const handleAmountFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      const el = e.target
      const len = el.value.length
      requestAnimationFrame(() => {
        try {
          el.setSelectionRange(len, len)
        } catch {
          // noop
        }
      })
    },
    []
  )

  return (
    <div className='mt-4 space-y-6'>
      <div className='text-foreground text-lg font-semibold'>
        {getLocalizedValue('VOLUNTARY_PREPAYMENT_LABEL')}
      </div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div>
          <div className='mb-2 text-sm font-medium opacity-80'>
            {getLocalizedValue('VOLUNTARY_PREPAYMENT_FROM_ACCOUNT_LABEL')}
          </div>
          <div className='border-input bg-background rounded-lg border px-3 py-2.5'>
            <p className='text-sm font-semibold'>{accountInfo.accountNumber}</p>
          </div>
        </div>

        <div>
          <div className='mb-2 text-sm font-medium opacity-80'>
            {getLocalizedValue('VOLUNTARY_PREPAYMENT_FROM_LEGAL_NAME_LABEL')}
          </div>
          <div className='border-input bg-background rounded-lg border px-3 py-2.5'>
            <p className='text-sm font-semibold'>{accountInfo.legalName}</p>
          </div>
        </div>

        <div>
          <div className='mb-2 text-sm font-medium opacity-80'>
            {getLocalizedValue(
              'VOLUNTARY_PREPAYMENT_FROM_TRANSACTION_BALANCE_LABEL'
            )}
          </div>
          <div className='border-input bg-background rounded-lg border px-3 py-2.5'>
            <p className='text-sm font-semibold'>
              {accountInfo.transactionBalance}
            </p>
          </div>
        </div>

        <div>
          <div className='mb-2 text-sm font-medium opacity-80'>
            {getLocalizedValue('VOLUNTARY_PREPAYMENT_FROM_PAYBACK_BALANCE_LABEL')}
          </div>
          <div className='border-input bg-background rounded-lg border px-3 py-2.5'>
            <p className='text-sm font-semibold'>{accountInfo.paybackBalance}</p>
          </div>
        </div>

        <div>
          <div className='mb-2 text-sm font-medium opacity-80'>
            {getLocalizedValue('VOLUNTARY_PREPAYMENT_FROM_PAYOFF_BALANCE_LABEL')}
          </div>
          <div className='border-input bg-background rounded-lg border px-3 py-2.5'>
            <p className='text-sm font-semibold'>{accountInfo.payoffBalance}</p>
          </div>
        </div>

        <div>
          <div className='mb-2 text-sm font-medium opacity-80'>
            {getLocalizedValue(
              'VOLUNTARY_PREPAYMENT_FROM_POTENTIAL_SAVED_AMOUNT_LABEL'
            )}
          </div>
          <div className='border-input bg-background rounded-lg border px-3 py-2.5'>
            <p className='text-sm font-semibold'>
              {accountInfo.potentialSavedAmount}
            </p>
          </div>
        </div>
      </div>

      <div className='text-muted-foreground text-sm whitespace-pre-wrap'>
        <span className='font-semibold'>
          {getLocalizedValue('VOLUNTARY_PREPAYMENT_FROM_STEP_ONE_LABEL')}:{' '}
        </span>
        {getLocalizedValue('VOLUNTARY_PREPAYMENT_FROM_STEP_ONE_TEXT')}
      </div>

      <div>
        <div className='mb-2 text-sm font-medium opacity-80'>
          {getLocalizedValue(
            'VOLUNTARY_PREPAYMENT_FROM_VOLUNTARY_PREPAYMENT_AMOUNT_LABEL'
          )}
        </div>
        <Input
          prefix={currencySymbol}
          type='text'
          decimalCount={2}
          placeholder='0.00'
          value={amount}
          disabled={!!disableAmount}
          onChange={(e) => onAmountChange(e.target.value)}
          onFocus={handleAmountFocus}
          className='bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 outline-none dark:bg-gray-700 dark:text-white dark:placeholder-gray-500'
        />
      </div>

      <div className='text-muted-foreground text-sm whitespace-pre-wrap'>
        <span className='font-semibold'>
          {getLocalizedValue('VOLUNTARY_PREPAYMENT_FROM_DISCLAIMER_LABEL')}:{' '}
        </span>
        {getLocalizedValue('VOLUNTARY_PREPAYMENT_FROM_DISCLAIMER_TEXT')}
      </div>
    </div>
  )
}

