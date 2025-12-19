import { Loader2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/formatCurrency.ts'
import { useCompanyLocalizations } from '@/hooks/use-company-localizations.ts'
import { Button } from '@/components/ui/button.tsx'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.tsx'

type VoluntaryPrepaymentDisclaimerDialogProps = {
  open: boolean
  onClose: () => void
  amount: string | number
  isLoading?: boolean
  onConfirm: () => void
}

export function VoluntaryPrepaymentDisclaimerDialog({
  open,
  onClose,
  amount,
  isLoading,
  onConfirm,
}: VoluntaryPrepaymentDisclaimerDialogProps) {
  const { getLocalizedValue } = useCompanyLocalizations()

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) onClose()
      }}
    >
      <DialogContent
        showCloseButton={false}
        className='overflow-hidden p-0 sm:max-w-lg'
      >
        <div className='bg-primary/10 px-6 py-4'>
          <DialogHeader className='text-center sm:text-center'>
            <DialogTitle className='text-xl font-bold'>
              {getLocalizedValue('VOLUNTARY_PREPAYMENT_DISCLAIMER_TITLE')}
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className='p-6'>
          <div className='mb-6 text-center'>
            <div className='text-3xl font-bold tracking-tight'>
              {formatCurrency(amount)}
            </div>
            <div className='text-muted-foreground mt-1 text-sm font-medium'>
              {getLocalizedValue('CASH_DRAW_DISCLAIMER_DEBITED')}
            </div>
          </div>

          <div className='rounded-lg border border-amber-200 bg-amber-50 p-4'>
            <DialogDescription className='text-sm leading-relaxed whitespace-pre-wrap text-gray-700'>
              {getLocalizedValue('VOLUNTARY_PREPAYMENT_DISCLAIMER_MESSAGE')}
            </DialogDescription>
          </div>

          <DialogFooter className='mt-6 grid grid-cols-2 gap-3'>
            <Button
              type='button'
              variant='outline'
              className='w-full'
              disabled={isLoading}
              onClick={onClose}
            >
              {getLocalizedValue('CASH_DRAW_DISCLAIMER_CANCEL')}
            </Button>
            <Button
              type='button'
              className='w-full'
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  {getLocalizedValue('CASH_DRAW_DISCLAIMER_CONFIRM')}
                </>
              ) : (
                getLocalizedValue('CASH_DRAW_DISCLAIMER_CONFIRM')
              )}
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  )
}

