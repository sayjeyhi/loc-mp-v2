import { useMemo } from 'react'
import { cn } from '@/lib/utils.ts'
import { useCompanyLocalizations } from '@/hooks/use-company-localizations.ts'
import { Separator } from '@/components/ui/separator.tsx'

type PreviewData = {
  creditDecision: string
  requestedAmount: string
  drawdownFee: string
  drawAmount: string
  date: string
  purchasedAmount: string
  dailyRemittance: string
  collectionSchedule: string
  estimatedDisbursementDate: string
}

type CashDrawDrawerStep2Props = {
  title: string
  disclaimerLabel: string
  disclaimerTextOne: string
  disclaimerTextTwo: string
  disclaimerTextThree: string
  previewData: PreviewData
}

export function CashDrawDrawerStep2({
  title,
  disclaimerLabel,
  disclaimerTextOne,
  disclaimerTextTwo,
  disclaimerTextThree,
  previewData,
}: CashDrawDrawerStep2Props) {
  const { getLocalizedValue } = useCompanyLocalizations()

  const rows = useMemo(() => {
    if (!previewData) return []
    return [
      {
        label: getLocalizedValue('CASH_DRAW_CREDIT_DECISION_LABEL'),
        value: previewData.creditDecision,
      },
      {
        label: getLocalizedValue('CASH_DRAW_FORM_REQUESTED_AMOUNT_LABEL'),
        value: previewData.requestedAmount,
      },
      {
        label: getLocalizedValue('CASH_DRAW_FORM_ESTABLISHMENT_FEE_LABEL'),
        value: previewData.drawdownFee,
      },
      {
        label: getLocalizedValue('CASH_DRAW_FORM_DRAW_AMOUNT_LABEL'),
        value: previewData.drawAmount,
      },
      {
        label: getLocalizedValue('CASH_DRAW_FORM_DATE_LABEL'),
        value: previewData.date,
      },
      {
        label: getLocalizedValue('CASH_DRAW_FORM_PURCHASED_AMOUNT_LABEL'),
        value: previewData.purchasedAmount,
      },
      {
        label: getLocalizedValue('CASH_DRAW_FORM_DAILY_REMITTANCE_LABEL'),
        value: previewData.dailyRemittance,
      },
      {
        label: getLocalizedValue('CASH_DRAW_FORM_COLLECTION_SCHEDULE_LABEL'),
        value: previewData.collectionSchedule,
        multiline: true,
      },
      {
        label: getLocalizedValue(
          'CASH_DRAW_FORM_ESTIMATED_DISBURSEMENT_DATE_LABEL'
        ),
        value: previewData.estimatedDisbursementDate,
      },
    ]
  }, [getLocalizedValue, previewData])

  return (
    <div className='mt-4 space-y-4'>
      <div className='text-foreground text-lg font-semibold'>{title}</div>

      <div className='rounded-lg border'>
        {rows.map((row, index) => (
          <div key={row.label}>
            <div
              className={cn(
                'flex items-start justify-between gap-4 px-4 py-3',
                row.multiline && 'items-start'
              )}
            >
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
        <div className='font-semibold'>{disclaimerLabel}:</div>
        <div className='mt-1'>{disclaimerTextOne}</div>
        <div className='mt-4'>{disclaimerTextTwo}</div>
        <div className='mt-4'>{disclaimerTextThree}</div>
      </div>
    </div>
  )
}
