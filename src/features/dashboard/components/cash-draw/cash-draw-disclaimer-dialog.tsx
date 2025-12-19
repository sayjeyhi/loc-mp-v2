import { Loader2 } from 'lucide-react'
import { formatCurrency } from '@/lib/utils/formatCurrency.ts'
import { Button } from '@/components/ui/button.tsx'
import { useCompanyLocalizations } from '@/hooks/use-company-localizations.ts'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog.tsx'

type CashDrawDisclaimerDialogProps = {
  open: boolean
  onClose: () => void
  amount: string | number
  isLoading?: boolean
  onConfirm: () => void
}

export function CashDrawDisclaimerDialog({
  open,
  onClose,
  amount,
  isLoading,
  onConfirm,
}: CashDrawDisclaimerDialogProps) {
  const { getLocalizedValue } = useCompanyLocalizations()
  const amountFormatted = formatCurrency(amount)

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
        {/* Header (similar to OLD_SOURCE disclaimer dialog) */}
        <div className='bg-primary/10 px-6 py-4'>
          <DialogHeader className='text-center sm:text-center'>
            <DialogTitle className='text-xl font-bold'>
              {getLocalizedValue('CASH_DRAW_DISCLAIMER_TITLE')}
            </DialogTitle>
          </DialogHeader>
        </div>

        <div className='p-6'>
          {/* Amount display */}
          <div className='mb-6 text-center'>
            <div className='text-3xl font-bold tracking-tight'>
              {amountFormatted}
            </div>
            <div className='text-muted-foreground mt-1 text-sm font-medium'>
              {getLocalizedValue('CASH_DRAW_DISCLAIMER_CREDITED')}
            </div>
          </div>

          {/* Message */}
          <div className='rounded-lg border border-amber-200 bg-amber-50 p-4'>
            <DialogDescription className='text-sm leading-relaxed whitespace-pre-wrap text-gray-700'>
              {getLocalizedValue('CASH_DRAW_DISCLAIMER_MESSAGE')}
            </DialogDescription>
          </div>

          {/* Actions */}
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
