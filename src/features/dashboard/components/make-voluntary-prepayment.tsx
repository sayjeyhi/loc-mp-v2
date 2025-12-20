import { useState } from 'react'
import { useCompanyLocalizations } from '@/hooks/use-company-localizations'
import { Button } from '@/components/ui/button'
import { TitleWithBorder } from '@/components/TitleWithBorder.tsx'
import { VoluntaryPrepaymentDrawer } from '@/features/dashboard/components/voluntary-payment/voluntary-prepayment-drawer'

export function MakeVoluntaryPrepayment() {
  const { getLocalizedValue } = useCompanyLocalizations()
  const [open, setOpen] = useState(false)
  return (
    <>
      <div className='rounded-lg bg-white p-6 shadow-sm dark:bg-slate-900'>
        <TitleWithBorder
          className='mb-6'
          size='medium'
          title={getLocalizedValue('MAKE_VOLUNTARY_PREPAYMENT_TITLE')}
        />

        <p className='mb-6 text-sm text-gray-600 dark:text-gray-400'>
          {getLocalizedValue('VOLUNTARY_PREPAYMENT_REQUEST_DISCLAIMER_THREE')}
        </p>

        <Button className='w-full' onClick={() => setOpen(true)}>
          {getLocalizedValue('PAY_NOW_BTN_LABEL')}
        </Button>
      </div>

      <VoluntaryPrepaymentDrawer open={open} onOpenChange={setOpen} />
    </>
  )
}
