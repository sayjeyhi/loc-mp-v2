import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

type CashDrawDisclaimerDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  message: string
  confirmText: string
  cancelText: string
  creditPaymentText: string
  debitPaymentText: string
  currencySymbol: string
  amount: string | number
  debitAmount?: string | number
  isLoading?: boolean
  onConfirm: () => void
}

function formatMoney(value: string | number | undefined, currencySymbol: string) {
  if (value === undefined) return `${currencySymbol}0.00`
  const num =
    typeof value === 'number' ? value : Number(String(value).replace(/,/g, ''))
  if (!Number.isFinite(num)) return `${currencySymbol}0.00`
  return `${currencySymbol}${num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

export function CashDrawDisclaimerDialog({
  open,
  onOpenChange,
  title,
  message,
  confirmText,
  cancelText,
  creditPaymentText,
  debitPaymentText,
  currencySymbol,
  amount,
  debitAmount,
  isLoading,
  onConfirm,
}: CashDrawDisclaimerDialogProps) {
  const amountFormatted = formatMoney(amount, currencySymbol)
  const debitAmountFormatted = formatMoney(debitAmount, currencySymbol)

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className='p-0 overflow-hidden sm:max-w-lg'>
        {/* Header (similar to OLD_SOURCE disclaimer dialog) */}
        <div className='bg-primary/10 px-6 py-4'>
          <AlertDialogHeader className='text-center sm:text-center'>
            <AlertDialogTitle className='text-xl font-bold'>
              {title}
            </AlertDialogTitle>
          </AlertDialogHeader>
        </div>

        <div className='p-6'>
          {/* Amount display */}
          <div className='mb-6 text-center'>
            <div className='text-3xl font-bold tracking-tight'>
              {amountFormatted}
            </div>
            <div className='text-muted-foreground mt-1 text-sm font-medium'>
              {creditPaymentText}
            </div>
          </div>

          {/* Credit/Debit summary (improves clarity vs old single line) */}
          <div className='mb-6 rounded-lg border p-4'>
            <div className='flex items-center justify-between gap-4'>
              <div className='text-muted-foreground text-sm font-medium'>
                {creditPaymentText}
              </div>
              <div className='text-sm font-semibold'>{amountFormatted}</div>
            </div>
            <div className='mt-2 flex items-center justify-between gap-4'>
              <div className='text-muted-foreground text-sm font-medium'>
                {debitPaymentText}
              </div>
              <div
                className={cn(
                  'text-sm font-semibold',
                  debitAmount === undefined && 'text-muted-foreground'
                )}
              >
                {debitAmount === undefined ? '-' : debitAmountFormatted}
              </div>
            </div>
          </div>

          {/* Message */}
          <div className='bg-amber-50 border border-amber-200 rounded-lg p-4'>
            <AlertDialogDescription className='text-sm leading-relaxed text-gray-700 whitespace-pre-wrap'>
              {message}
            </AlertDialogDescription>
          </div>

          {/* Actions */}
          <AlertDialogFooter className='mt-6 grid grid-cols-2 gap-3 sm:flex sm:justify-end'>
            <AlertDialogCancel asChild>
              <Button
                type='button'
                variant='outline'
                className='w-full'
                disabled={isLoading}
              >
                {cancelText}
              </Button>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                type='button'
                className='w-full'
                onClick={onConfirm}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                    {confirmText}
                  </>
                ) : (
                  confirmText
                )}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  )
}

