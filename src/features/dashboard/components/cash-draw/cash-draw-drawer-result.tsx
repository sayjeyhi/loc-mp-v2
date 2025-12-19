import { useMemo } from 'react'
import { cn } from '@/lib/utils.ts'
import { formatDate } from '@/lib/utils/dateFormatter.ts'
import { formatCurrency } from '@/lib/utils/formatCurrency.ts'
import { useCompanyLocalizations } from '@/hooks/use-company-localizations.ts'
import { Separator } from '@/components/ui/separator.tsx'
import { type CashDrawApiData } from '@/features/dashboard/components/cash-draw/cash-draw-drawer.tsx'
import { normalizeCashDrawData } from '@/features/dashboard/components/cash-draw/utils.ts'

type CashDrawDrawerResultProps = {
  cashDrawData: CashDrawApiData | null | undefined
}

export function CashDrawDrawerResult({
  cashDrawData,
}: CashDrawDrawerResultProps) {
  const { getLocalizedValue } = useCompanyLocalizations()

  const rows = useMemo(() => {
    if (!cashDrawData) return []
    const normalized = normalizeCashDrawData(cashDrawData)
    const drawStatus =
      normalized.drawStatus.charAt(0).toUpperCase() +
      normalized.drawStatus.slice(1)

    return [
      {
        label: getLocalizedValue('CASH_DRAW_FORM_DRAW_STATUS_LABEL'),
        value: drawStatus,
      },
      {
        label: getLocalizedValue('CASH_DRAW_CREDIT_DECISION_LABEL'),
        value: normalized.creditDecision,
      },
      {
        label: getLocalizedValue('CASH_DRAW_FORM_REQUESTED_AMOUNT_LABEL'),
        value: formatCurrency(normalized.requestedAmount),
      },
      {
        label: getLocalizedValue('CASH_DRAW_FORM_ESTABLISHMENT_FEE_LABEL'),
        value: formatCurrency(normalized.establishmentFee),
      },
      {
        label: getLocalizedValue('CASH_DRAW_FORM_DRAW_AMOUNT_LABEL'),
        value: formatCurrency(normalized.fundedAmount),
      },
      {
        label: getLocalizedValue('CASH_DRAW_FORM_DATE_LABEL'),
        value: normalized.createdAt ? formatDate(normalized.createdAt) : '-',
      },
      {
        label: getLocalizedValue('CASH_DRAW_FORM_PURCHASED_AMOUNT_LABEL'),
        value: formatCurrency(normalized.paybackAmount),
      },
      {
        label: getLocalizedValue('CASH_DRAW_FORM_DAILY_REMITTANCE_LABEL'),
        value: formatCurrency(normalized.estimatedDailyPaymentAmount),
      },
      {
        label: getLocalizedValue('CASH_DRAW_FORM_COLLECTION_SCHEDULE_LABEL'),
        value: normalized.collectionSchedule,
        multiline: true,
      },
      {
        label: getLocalizedValue(
          'CASH_DRAW_FORM_ESTIMATED_DISBURSEMENT_DATE_LABEL'
        ),
        value: normalized.estimatedDisbursementDate
          ? formatDate(normalized.estimatedDisbursementDate)
          : '-',
      },
    ]
  }, [cashDrawData, getLocalizedValue])

  return (
    <div className='mt-8 space-y-4'>
      <div className='rounded-lg border'>
        {rows.map((row, index) => (
          <div key={row.label}>
            <div className='flex items-start justify-between gap-4 px-4 py-3'>
              <div className='text-sm font-medium opacity-80'>{row.label}</div>
              <div
                className={cn(
                  'text-right text-sm font-semibold',
                  row.multiline && 'max-w-[60%] whitespace-pre-wrap'
                )}
              >
                {row.value || '-'}
              </div>
            </div>
            {index < rows.length - 1 && <Separator />}
          </div>
        ))}
      </div>

      <div className='text-muted-foreground text-sm whitespace-pre-wrap'>
        <div>
          <span className='font-semibold'>
            {getLocalizedValue('CASH_DRAW_FORM_RESULT_DISCLAIMER_LABEL')}:{' '}
          </span>
          {getLocalizedValue('CASH_DRAW_FORM_FINAL_DISCLAIMER_TEXT_ONE')}
        </div>
        <div className='mt-4'>
          {getLocalizedValue('CASH_DRAW_FORM_FINAL_DISCLAIMER_TEXT_TWO')}
        </div>
      </div>
    </div>
  )
}
