import { useMemo } from 'react'
import type { PrepaymentRequestData } from '@/store/prepaymentStore.ts'
import { formatCurrency } from '@/lib/utils/formatCurrency.ts'
import { useCompanyLocalizations } from '@/hooks/use-company-localizations.ts'
import { Separator } from '@/components/ui/separator.tsx'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table.tsx'

type VoluntaryPrepaymentDrawerStep2Props = {
  prepaymentData: PrepaymentRequestData
  accountNumber: string
  legalName: string
}

export function VoluntaryPrepaymentDrawerStep2({
  prepaymentData,
  accountNumber,
  legalName,
}: VoluntaryPrepaymentDrawerStep2Props) {
  const { getLocalizedValue } = useCompanyLocalizations()

  const tableRows = useMemo(() => {
    const toPercent = (v: string) => {
      const n = Number(v)
      if (!Number.isFinite(n)) return '-'
      return `${n.toFixed(2)}%`
    }

    return [
      {
        descr: 'Before Prepayment',
        ...prepaymentData.before,
      },
      {
        descr: 'After Prepayment',
        ...prepaymentData.after,
      },
      {
        descr: 'Difference',
        ...prepaymentData.difference,
      },
    ].map((row) => ({
      descr: row.descr,
      fundedOutstanding: formatCurrency(row.fundedOutstanding),
      paybackOutstanding: formatCurrency(row.paybackOutstanding),
      payoffOutstanding: formatCurrency(row.payoffOutstanding),
      dailyPayment: formatCurrency(row.dailyPayment),
      totalPrepayAmount: formatCurrency(row.totalPrepayAmount),
      totalSavedAmount: formatCurrency(row.totalSavedAmount),
      totalPaidBackAmount: formatCurrency(row.totalPaidBackAmount),
      totalPaidBackPercent: toPercent(row.totalPaidBackPercent),
    }))
  }, [prepaymentData])

  return (
    <div className='mt-6 space-y-6'>
      {prepaymentData.overlimitAch && (
        <div className='rounded-lg border border-amber-900/50 bg-amber-400 p-4 text-black'>
          <p className='text-sm font-bold'>
            {getLocalizedValue(
              'VOLUNTARY_PREPAYMENT_REQUEST_DIRECT_DEBIT_LIMIT_WARNING'
            )}
          </p>
        </div>
      )}

      <div className='space-y-3'>
        <div className='text-foreground text-lg font-semibold'>
          {getLocalizedValue('VOLUNTARY_PREPAYMENT_REQUEST_LABEL')}
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <div className='mb-2 text-sm font-medium opacity-80'>
              {getLocalizedValue('VOLUNTARY_PREPAYMENT_FROM_ACCOUNT_LABEL')}
            </div>
            <div className='border-input bg-background rounded-lg border px-3 py-2.5'>
              <p className='text-sm font-semibold'>{accountNumber || '-'}</p>
            </div>
          </div>
          <div>
            <div className='mb-2 text-sm font-medium opacity-80'>
              {getLocalizedValue('VOLUNTARY_PREPAYMENT_FROM_LEGAL_NAME_LABEL')}
            </div>
            <div className='border-input bg-background rounded-lg border px-3 py-2.5'>
              <p className='text-sm font-semibold'>{legalName || '-'}</p>
            </div>
          </div>
        </div>
      </div>

      <div className='space-y-3'>
        <div className='text-foreground text-lg font-semibold'>
          {getLocalizedValue('VOLUNTARY_PREPAYMENT_REQUEST_OPEN_TRANSACTIONS')}
        </div>
        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div>
            <div className='mb-2 text-sm font-medium opacity-80'>
              {getLocalizedValue(
                'VOLUNTARY_PREPAYMENT_FROM_TRANSACTION_BALANCE_LABEL'
              )}
            </div>
            <div className='border-input bg-background rounded-lg border px-3 py-2.5'>
              <p className='text-sm font-semibold'>
                {formatCurrency(prepaymentData.before.fundedOutstanding)}
              </p>
            </div>
          </div>
          <div>
            <div className='mb-2 text-sm font-medium opacity-80'>
              {getLocalizedValue(
                'VOLUNTARY_PREPAYMENT_REQUEST_OPEN_TRANSACTIONS_PAYBACK_AMOUNT_LABEL'
              )}
            </div>
            <div className='border-input bg-background rounded-lg border px-3 py-2.5'>
              <p className='text-sm font-semibold'>
                {formatCurrency(prepaymentData.before.paybackOutstanding)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className='space-y-3'>
        <div className='text-foreground text-lg font-semibold'>
          {getLocalizedValue(
            'VOLUNTARY_PREPAYMENT_REQUEST_DISTRIBUTION_AMOUNT'
          )}
        </div>

        <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
          <div>
            <div className='mb-2 text-sm font-medium opacity-80'>
              {getLocalizedValue(
                'VOLUNTARY_PREPAYMENT_REQUEST_PREPAYMENT_LABEL'
              )}
            </div>
            <div className='border-input bg-background rounded-lg border px-3 py-2.5'>
              <p className='text-sm font-semibold'>
                {formatCurrency(prepaymentData.prepaymentAmount)}
              </p>
            </div>
          </div>
          <div>
            <div className='mb-2 text-sm font-medium opacity-80'>
              {getLocalizedValue(
                'VOLUNTARY_PREPAYMENT_REQUEST_SERVICE_CHARGE_LABEL'
              )}
            </div>
            <div className='border-input bg-background rounded-lg border px-3 py-2.5'>
              <p className='text-sm font-semibold'>
                {formatCurrency(prepaymentData.serviceCharge)}
              </p>
            </div>
          </div>
          <div>
            <div className='mb-2 text-sm font-medium opacity-80'>
              {getLocalizedValue(
                'VOLUNTARY_PREPAYMENT_REQUEST_FEE_BALANCE_LABEL'
              )}
            </div>
            <div className='border-input bg-background rounded-lg border px-3 py-2.5'>
              <p className='text-sm font-semibold'>
                {prepaymentData.outstandingFees || '0'}
              </p>
            </div>
          </div>
          <div>
            <div className='mb-2 text-sm font-medium opacity-80'>
              {getLocalizedValue(
                'VOLUNTARY_PREPAYMENT_REQUEST_MISSED_PAYMENT_BALANCE_LABEL'
              )}
            </div>
            <div className='border-input bg-background rounded-lg border px-3 py-2.5'>
              <p className='text-sm font-semibold'>
                {prepaymentData.arrears || '0'}
              </p>
            </div>
          </div>
        </div>

        <div className='mt-2 flex items-start justify-between gap-4 rounded-lg border p-3'>
          <div>
            <div className='text-sm font-semibold opacity-80'>
              {getLocalizedValue(
                'VOLUNTARY_PREPAYMENT_REQUEST_TOTAL_AMOUNT_LABEL'
              )}
            </div>
            <div className='text-muted-foreground text-xs'>
              {getLocalizedValue(
                'VOLUNTARY_PREPAYMENT_REQUEST_TOTAL_AMOUNT_HELP_TEXT'
              )}
            </div>
          </div>
          <div className='text-sm font-semibold'>
            {formatCurrency(prepaymentData.totalAmount)}
          </div>
        </div>

        <div className='text-xs font-medium text-red-500'>
          {getLocalizedValue('VOLUNTARY_PREPAYMENT_REQUEST_RED_NOTE')}
        </div>
      </div>

      <div className='rounded-lg border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Funded Outstanding</TableHead>
              <TableHead>Payback Outstanding</TableHead>
              <TableHead>Payoff Outstanding</TableHead>
              <TableHead>Daily Payment</TableHead>
              <TableHead>Total Prepay Amount</TableHead>
              <TableHead>Total Saved Amount</TableHead>
              <TableHead>Total Paid Back</TableHead>
              <TableHead>Total Paid Back %</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tableRows.map((row) => (
              <TableRow key={row.descr}>
                <TableCell className='font-medium'>{row.descr}</TableCell>
                <TableCell>{row.fundedOutstanding}</TableCell>
                <TableCell>{row.paybackOutstanding}</TableCell>
                <TableCell>{row.payoffOutstanding}</TableCell>
                <TableCell>{row.dailyPayment}</TableCell>
                <TableCell>{row.totalPrepayAmount}</TableCell>
                <TableCell>{row.totalSavedAmount}</TableCell>
                <TableCell>{row.totalPaidBackAmount}</TableCell>
                <TableCell>{row.totalPaidBackPercent}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className='text-muted-foreground space-y-4 text-sm whitespace-pre-wrap'>
        <div>
          <span className='font-semibold'>
            {getLocalizedValue('VOLUNTARY_PREPAYMENT_REQUEST_DISCLAIMER_LABEL')}
            :{' '}
          </span>
          {getLocalizedValue('VOLUNTARY_PREPAYMENT_REQUEST_DISCLAIMER_TEXT')}
        </div>
        <Separator />
        <div>
          {getLocalizedValue('VOLUNTARY_PREPAYMENT_REQUEST_DISCLAIMER_TWO')}
        </div>
        <div>
          {getLocalizedValue('VOLUNTARY_PREPAYMENT_REQUEST_DISCLAIMER_THREE')}
        </div>
      </div>
    </div>
  )
}
