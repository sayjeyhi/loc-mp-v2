import { useState } from 'react'
import { useCompanyLocalizations } from '@/hooks/use-company-localizations.ts'
import { useCompanySettings } from '@/hooks/use-company-settings.ts'
import { Button } from '@/components/ui/button.tsx'
import { Input } from '@/components/ui/input.tsx'
import { TitleWithBorder } from '@/components/TitleWithBorder.tsx'
import { CashDrawDrawer } from './cash-draw-drawer.tsx'

export function CashDraw() {
  const company = useCompanySettings()
  const { getLocalizedValue } = useCompanyLocalizations()
  const currencySymbol = company?.country?.symbol || '$'
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [amount, setAmount] = useState('')

  return (
    <>
      <div className='rounded-lg bg-white p-6 shadow-sm dark:bg-slate-900'>
        <TitleWithBorder
          className='mb-6'
          size='medium'
          title={getLocalizedValue('CASH_DRAW_LABEL')}
        />

        <p className='mb-4 text-sm text-gray-600 dark:text-gray-400'>
          {getLocalizedValue('ENTER_AMOUNT_FOR_WITHDRAW_LABEL')}
        </p>

        <div className='mb-4 flex w-full items-center gap-3'>
          <Input
            prefix={currencySymbol}
            type='text'
            decimalCount={2}
            placeholder='0.00'
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className='flex-1 bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 outline-none dark:bg-gray-700 dark:text-white dark:placeholder-gray-500'
          />
          <Button className='w-40' onClick={() => setDrawerOpen(true)}>
            {getLocalizedValue('CASH_DRAW_LABEL')}
          </Button>
        </div>
      </div>

      <CashDrawDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        initialAmount={amount}
      />
    </>
  )
}
