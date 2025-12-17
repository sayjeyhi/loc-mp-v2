import { Loader2 } from 'lucide-react'
import { formatDate } from '@/lib/utils/dateFormatter'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { type TPaymentCalendar } from '@/lib/utils/types/paymentCalendar'
import { useCompanyLocalizations } from '@/hooks/use-company-localizations'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface PaymentTableProps {
  payments: TPaymentCalendar[]
  isLoading: boolean
  hasLoadedPayments: boolean
  itemsPerPage: number
}

export function PaymentTable({
  payments,
  isLoading,
  hasLoadedPayments,
  itemsPerPage,
}: PaymentTableProps) {
  const { getLocalizedValue } = useCompanyLocalizations()
  return (
    <div className='relative overflow-hidden rounded-md border border-gray-200 dark:border-gray-700'>
      {isLoading && hasLoadedPayments && (
        <div className='absolute top-0 right-0 left-0 z-10 flex justify-center bg-white/50 py-2 backdrop-blur-sm dark:bg-slate-900/50'>
          <div className='flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm shadow-sm dark:bg-slate-900'>
            <Loader2 className='h-3 w-3 animate-spin' />
            <span className='text-gray-600 dark:text-gray-400'>
              {getLocalizedValue('PAYMENT_CALENDAR_TABLE_UPDATING_LABEL')}
            </span>
          </div>
        </div>
      )}
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                {getLocalizedValue(
                  'PAYMENT_CALENDAR_TABLE_SCHEDULED_DATE_LABEL'
                )}
              </TableHead>
              <TableHead>
                {getLocalizedValue(
                  'PAYMENT_CALENDAR_TABLE_PAYMENT_AMOUNT_LABEL'
                )}
              </TableHead>
              <TableHead>
                {getLocalizedValue(
                  'PAYMENT_CALENDAR_TABLE_PAYBACK_AMOUNT_LABEL'
                )}
              </TableHead>
              <TableHead>
                {getLocalizedValue(
                  'PAYMENT_CALENDAR_TABLE_PREPAY_BALANCE_LABEL'
                )}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && !hasLoadedPayments ? (
              // Show skeleton rows during initial load
              Array.from({ length: itemsPerPage }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell>
                    <Skeleton className='h-4 w-24' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-20' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-20' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-20' />
                  </TableCell>
                </TableRow>
              ))
            ) : !isLoading && hasLoadedPayments && payments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className='h-24 text-center'>
                  {getLocalizedValue(
                    'PAYMENT_CALENDAR_TABLE_NO_PAYMENTS_FOUND_LABEL'
                  )}
                </TableCell>
              </TableRow>
            ) : (
              payments.map((payment, index) => (
                <TableRow key={`${payment.acctId}-${payment.dueAt}-${index}`}>
                  <TableCell>{formatDate(payment.dueAt)}</TableCell>
                  <TableCell>
                    <span
                      className={
                        payment.amount < 0
                          ? 'text-red-600 dark:text-red-400'
                          : ''
                      }
                    >
                      {formatCurrency(payment.amount)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        payment.totalOutstandingAmount < 0
                          ? 'text-red-600 dark:text-red-400'
                          : ''
                      }
                    >
                      {formatCurrency(payment.totalOutstandingAmount || 0)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={
                        payment.totalOutstandingPayoffAmount < 0
                          ? 'text-red-600 dark:text-red-400'
                          : ''
                      }
                    >
                      {formatCurrency(
                        payment.totalOutstandingPayoffAmount || 0
                      )}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
