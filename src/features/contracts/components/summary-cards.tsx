import { Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { formatCurrency } from '@/utils/formatCurrency'
import { toast } from 'sonner'

interface ContractsSummaryCardsProps {
  isLoading: boolean
  estimatedPaymentAmount: number
  estimatedEarlyPayoffDiscount: number
}

export function ContractsSummaryCards({
  isLoading,
  estimatedPaymentAmount,
  estimatedEarlyPayoffDiscount,
}: ContractsSummaryCardsProps) {
  if (isLoading) {
    return (
      <>
        <div className='relative flex rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800'>
          <div className='flex-1'>
            <Skeleton className='h-4 w-48' />
            <Skeleton className='mt-2 h-8 w-32' />
          </div>
          <Skeleton className='h-10 w-10 rounded-full' />
        </div>
        <div className='relative flex rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800'>
          <div className='flex-1'>
            <Skeleton className='h-4 w-48' />
            <Skeleton className='mt-2 h-8 w-32' />
          </div>
          <Skeleton className='h-10 w-10 rounded-full' />
        </div>
      </>
    )
  }

  return (
    <>
      <div className='relative flex rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800'>
        <div className='flex-1'>
          <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
            Estimated Payment Amount
          </p>
          <p className='mt-2 text-2xl font-bold'>
            {formatCurrency(estimatedPaymentAmount)}
          </p>
        </div>
        <Button
          variant='ghost'
          size='icon'
          className='h-10 w-10 rounded-full'
          onClick={() =>
            toast.info(
              "Estimated Payment Amount refers to the projected total you're expected to pay, including all applicable fees or charges. It's an approximate value and may differ from the final billed amount."
            )
          }
        >
          <Info className='h-5 w-5' />
        </Button>
      </div>

      <div className='relative flex rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800'>
        <div className='flex-1'>
          <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
            Estimated Early Payoff Discount
          </p>
          <p className='mt-2 text-2xl font-bold'>
            {formatCurrency(estimatedEarlyPayoffDiscount)}
          </p>
        </div>
        <Button
          variant='ghost'
          size='icon'
          className='h-10 w-10 rounded-full'
          onClick={() =>
            toast.info(
              'Estimated Early Payoff Discount represents the potential savings you could achieve by settling your contract ahead of schedule. This amount is an estimate and may vary based on specific terms and conditions.'
            )
          }
        >
          <Info className='h-5 w-5' />
        </Button>
      </div>
    </>
  )
}

