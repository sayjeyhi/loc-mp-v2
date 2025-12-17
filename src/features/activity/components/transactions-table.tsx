import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { formatDate } from '@/lib/utils/dateFormatter'
import { type TTransactionHistory } from '@/lib/utils/types/paymentHistory'
import { useCompanyLocalizations } from '@/hooks/use-company-localizations'

interface TransactionsTableProps {
  transactions: TTransactionHistory[]
  isLoading: boolean
  hasLoadedTransactions: boolean
  itemsPerPage: number
  onViewTransaction: (transaction: TTransactionHistory) => void
}

export function TransactionsTable({
  transactions,
  isLoading,
  hasLoadedTransactions,
  itemsPerPage,
  onViewTransaction,
}: TransactionsTableProps) {
  const { getLocalizedValue } = useCompanyLocalizations()

  return (
    <div className='relative rounded-lg border border-gray-200 dark:border-gray-700'>
      {isLoading && hasLoadedTransactions && (
        <div className='absolute top-0 right-0 left-0 z-10 flex justify-center bg-white/50 py-2 backdrop-blur-sm dark:bg-slate-900/50'>
          <div className='flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm shadow-sm dark:bg-slate-900'>
            <Loader2 className='h-3 w-3 animate-spin' />
            <span className='text-gray-600 dark:text-gray-400'>
              Updating...
            </span>
          </div>
        </div>
      )}
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{getLocalizedValue('TRANSACTION_HISTORY_TABLE_CREATE_DATE_LABEL')}</TableHead>
              <TableHead>{getLocalizedValue('TRANSACTION_HISTORY_TABLE_STATUS_LABEL')}</TableHead>
              <TableHead>{getLocalizedValue('TRANSACTION_HISTORY_TABLE_DESCRIPTION_LABEL')}</TableHead>
              <TableHead>{getLocalizedValue('TRANSACTION_HISTORY_TABLE_AMOUNT_LABEL')}</TableHead>
              <TableHead>{getLocalizedValue('TRANSACTION_HISTORY_TABLE_MORE_BTN_LABEL')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && !hasLoadedTransactions ? (
              // Show skeleton rows during initial load
              Array.from({ length: itemsPerPage }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell>
                    <Skeleton className='h-4 w-24' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-6 w-16 rounded-full' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-32' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-20' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-8 w-16 rounded-md' />
                  </TableCell>
                </TableRow>
              ))
            ) : !isLoading &&
              hasLoadedTransactions &&
              transactions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className='h-24 text-center'>
                  {getLocalizedValue('TRANSACTION_HISTORY_TABLE_NO_TRANSACTIONS_FOUND_LABEL')}
                </TableCell>
              </TableRow>
            ) : (
              transactions.map((transaction) => (
                <TableRow key={transaction.guid}>
                  <TableCell>{formatDate(transaction.dueAt)}</TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                        transaction.status.toLowerCase() === 'paid'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400'
                      }`}
                    >
                      {transaction.status}
                    </span>
                  </TableCell>
                  <TableCell>{transaction.paymentType}</TableCell>
                  <TableCell>
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => onViewTransaction(transaction)}
                    >
                      {getLocalizedValue('TRANSACTION_HISTORY_TABLE_MORE_BTN_LABEL')}
                    </Button>
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
