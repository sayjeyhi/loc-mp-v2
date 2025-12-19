import type { CashDrawData } from '@/store/cashDrawStore.ts'
import { type CashDrawApiData } from '@/features/dashboard/components/cash-draw/cash-draw-drawer.tsx'

export function normalizeCashDrawData(
  data: CashDrawApiData | null | undefined
): CashDrawData {
  return {
    drawStatus: String(data?.drawStatus ?? data?.status ?? 'pending'),
    creditDecision: String(data?.creditDecision ?? ''),
    requestedAmount: String(data?.requestedAmount ?? '0'),
    establishmentFee: String(data?.establishmentFee ?? '0'),
    wireFeeAmount: (data?.wireFeeAmount ?? null) as string | null,
    fundedAmount: String(data?.fundedAmount ?? '0'),
    createdAt: String(data?.createdAt ?? new Date().toISOString()),
    paybackAmount: String(data?.paybackAmount ?? '0'),
    estimatedDailyPaymentAmount: String(
      data?.estimatedDailyPaymentAmount ?? '0'
    ),
    collectionSchedule: String(data?.collectionSchedule ?? '-'),
    estimatedDisbursementDate: String(data?.estimatedDisbursementDate ?? ''),
  }
}

export function getCreditDecisionFallback(status: string) {
  const s = status?.toLowerCase?.() ?? ''
  if (s === 'pending') return 'Transaction requires review and approval'
  if (s === 'approved') return 'Transaction is within draw limit'
  return ''
}
