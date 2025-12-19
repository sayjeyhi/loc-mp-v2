import { useCallback } from 'react'
import type { LOCALIZATION_CONSTANT_KEYS } from '@/lib/localization-constants.ts'
import { Input } from '@/components/ui/input.tsx'

type Step1AccountInfo = {
  accountNumber: string
  legalName: string
  transactionBalance: string
  pendingBalance: string
  availableBalance: string
}

type CashDrawDrawerStep1Props = {
  title: string
  currencySymbol: string
  accountInfo: Step1AccountInfo
  amount: string
  onAmountChange: (nextAmount: string) => void
  disclaimerLabel: string
  disclaimerText: string
  getLocalizedValue: (key: LOCALIZATION_CONSTANT_KEYS) => string
}

export function CashDrawDrawerStep1({
  title,
  currencySymbol,
  accountInfo,
  amount,
  onAmountChange,
  disclaimerLabel,
  disclaimerText,
  getLocalizedValue,
}: CashDrawDrawerStep1Props) {
  const handleAmountFocus = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      // Radix will auto-focus the first input on open; ensure it doesn't "select all".
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
      <div className='text-foreground text-lg font-semibold'>{title}</div>

      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div>
          <div className='mb-2 text-sm font-medium opacity-80'>
            {getLocalizedValue('CASH_DRAW_FORM_ACCOUNT_LABEL')}
          </div>
          <div className='border-input bg-background rounded-lg border px-3 py-2.5'>
            <p className='text-sm font-semibold'>{accountInfo.accountNumber}</p>
          </div>
        </div>

        <div>
          <div className='mb-2 text-sm font-medium opacity-80'>
            {getLocalizedValue('CASH_DRAW_FORM_LEGAL_NAME_LABEL')}
          </div>
          <div className='border-input bg-background rounded-lg border px-3 py-2.5'>
            <p className='text-sm font-semibold'>{accountInfo.legalName}</p>
          </div>
        </div>

        <div>
          <div className='mb-2 text-sm font-medium opacity-80'>
            {getLocalizedValue('CASH_DRAW_FORM_TRANSACTION_BALANCE_LABEL')}
          </div>
          <div className='border-input bg-background rounded-lg border px-3 py-2.5'>
            <p className='text-sm font-semibold'>
              {accountInfo.transactionBalance}
            </p>
          </div>
        </div>

        <div>
          <div className='mb-2 text-sm font-medium opacity-80'>
            {getLocalizedValue('CASH_DRAW_FORM_PENDING_BALANCE_LABEL')}
          </div>
          <div className='border-input bg-background rounded-lg border px-3 py-2.5'>
            <p className='text-sm font-semibold'>
              {accountInfo.pendingBalance}
            </p>
          </div>
        </div>

        <div>
          <div className='mb-2 text-sm font-medium opacity-80'>
            {getLocalizedValue('CASH_DRAW_FORM_AVAILABLE_BALANCE_LABEL')}
          </div>
          <div className='border-input bg-background rounded-lg border px-3 py-2.5'>
            <p className='text-sm font-semibold'>
              {accountInfo.availableBalance}
            </p>
          </div>
        </div>

        <div>
          <div className='mb-2 text-sm font-medium opacity-80'>
            {getLocalizedValue('CASH_DRAW_FORM_REQUEST_CASH_DRAW_AMOUNT')}
          </div>
          <Input
            prefix={currencySymbol}
            type='text'
            decimalCount={2}
            placeholder='0.00'
            value={amount}
            onChange={(e) => onAmountChange(e.target.value)}
            onFocus={handleAmountFocus}
            className='bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 outline-none dark:bg-gray-700 dark:text-white dark:placeholder-gray-500'
          />
        </div>
      </div>

      <div className='text-muted-foreground text-sm'>
        <span className='font-semibold'>{disclaimerLabel}: </span>
        {disclaimerText}
      </div>
    </div>
  )
}
