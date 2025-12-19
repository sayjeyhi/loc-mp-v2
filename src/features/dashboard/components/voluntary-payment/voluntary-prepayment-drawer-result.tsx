import { useCompanyLocalizations } from '@/hooks/use-company-localizations.ts'
import { formatCurrency } from '@/lib/utils/formatCurrency.ts'
import { Separator } from '@/components/ui/separator.tsx'
import type { PrepaymentCreateData, PrepaymentRequestData } from '@/store/prepaymentStore.ts'

type VoluntaryPrepaymentDrawerResultProps = {
  requestData: PrepaymentRequestData | null
  createData: PrepaymentCreateData
}

export function VoluntaryPrepaymentDrawerResult({
  requestData,
  createData,
}: VoluntaryPrepaymentDrawerResultProps) {
  const { getLocalizedValue } = useCompanyLocalizations()

  return (
    <div className='mt-8 space-y-6'>
      {createData.overlimitAch && (
        <div className='rounded-lg border border-amber-900/50 bg-amber-400 p-4 text-black'>
          <p className='text-sm font-bold'>
            {getLocalizedValue(
              'VOLUNTARY_PREPAYMENTS_SUBMITTED_RESULTS_DIRECT_DEBIT_LIMIT_WARNING'
            )}
          </p>
        </div>
      )}

      <div className='rounded-lg border'>
        {[
          {
            label: getLocalizedValue(
              'VOLUNTARY_PREPAYMENTS_SUBMITTED_RESULTS_ACCT_TOKEN_LABEL'
            ),
            value: String(createData.accountId ?? ''),
          },
          {
            label: getLocalizedValue(
              'VOLUNTARY_PREPAYMENTS_SUBMITTED_RESULTS_LEGAL_NAME_LABEL'
            ),
            value: createData.merchantName ?? '-',
          },
          {
            label: getLocalizedValue(
              'VOLUNTARY_PREPAYMENTS_SUBMITTED_RESULTS_AMOUNT_LABEL'
            ),
            value: formatCurrency(createData.totalAmount ?? requestData?.totalAmount ?? '0'),
          },
          {
            label: getLocalizedValue(
              'VOLUNTARY_PREPAYMENTS_SUBMITTED_RESULTS_RESULTS_LABEL'
            ),
            value: createData.result ?? '-',
          },
        ].map((row, index, arr) => (
          <div key={row.label}>
            <div className='flex items-start justify-between gap-4 px-4 py-3'>
              <div className='text-sm font-medium opacity-80'>{row.label}</div>
              <div className='text-right text-sm font-semibold whitespace-pre-wrap'>
                {row.value}
              </div>
            </div>
            {index < arr.length - 1 && <Separator />}
          </div>
        ))}
      </div>

      <div className='text-muted-foreground text-sm whitespace-pre-wrap'>
        <span className='font-semibold'>
          {getLocalizedValue(
            'VOLUNTARY_PREPAYMENTS_SUBMITTED_RESULTS_DISCLAIMER_LABEL'
          )}
          :{' '}
        </span>
        {getLocalizedValue('VOLUNTARY_PREPAYMENTS_SUBMITTED_RESULTS_DISCLAIMER_TEXT')}
      </div>
    </div>
  )
}

