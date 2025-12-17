import { type ContractData } from '@/lib/utils/types/contracts'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

interface ContractDetailsDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contract: ContractData | null
}

export function ContractDetailsDrawer({
  open,
  onOpenChange,
  contract,
}: ContractDetailsDrawerProps) {
  if (!contract) return null

  const contractDetails = [
    { label: 'Transaction ID', value: contract.number.toString() },
    { label: 'Payment Count', value: contract.paymentCount.toString() },
    {
      label: 'Discount Available Term',
      value: contract.firstDiscountTermDays?.toString() || '-',
    },
    {
      label: 'Drawdown Amount',
      value: formatCurrency(contract.drawdownAmount),
    },
    {
      label: 'Drawdown Fee',
      value: contract.drawdownFee ? formatCurrency(contract.drawdownFee) : '-',
    },
    {
      label: 'Estimated Early Payoff Discount',
      value: formatCurrency(contract.savedAmount),
    },
  ]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='w-full sm:max-w-md'>
        <SheetHeader>
          <SheetTitle>Cash Draw Confirmation</SheetTitle>
        </SheetHeader>

        <ScrollArea className='mt-6 h-[calc(100vh-12rem)]'>
          <div className='space-y-0 px-1'>
            {contractDetails.map((detail, index) => (
              <div key={index}>
                <div className='flex items-center justify-between py-4'>
                  <span className='text-base font-medium'>
                    {detail.label}
                  </span>
                  <span className='text-base font-semibold'>
                    {detail.value}
                  </span>
                </div>
                {index < contractDetails.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className='mt-6 border-t pt-4'>
          <Button
            variant='outline'
            className='w-full'
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
