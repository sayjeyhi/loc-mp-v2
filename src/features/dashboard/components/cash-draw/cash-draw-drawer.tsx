import { useEffect, useMemo, useState } from 'react'
import { useCashDrawStore, type CashDrawData } from '@/store/cashDrawStore.ts'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import {
  apiPostWithdrawAccept,
  apiPostWithdrawRequest,
} from '@/lib/services/DashboardServices.ts'
import { formatDate } from '@/lib/utils/dateFormatter.ts'
import { formatCurrency } from '@/lib/utils/formatCurrency.ts'
import { useCompanyLocalizations } from '@/hooks/use-company-localizations.ts'
import { useCompanySettings } from '@/hooks/use-company-settings.ts'
import { useProfileLoader } from '@/hooks/use-profile-loader.ts'
import { Button } from '@/components/ui/button.tsx'
import { ScrollArea } from '@/components/ui/scroll-area.tsx'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet.tsx'
import {
  getCreditDecisionFallback,
  normalizeCashDrawData,
} from '@/features/dashboard/components/cash-draw/utils.ts'
import { CashDrawDisclaimerDialog } from './cash-draw-disclaimer-dialog.tsx'
import { CashDrawDrawerResult } from './cash-draw-drawer-result.tsx'
import { CashDrawDrawerStep1 } from './cash-draw-drawer-step1.tsx'
import { CashDrawDrawerStep2 } from './cash-draw-drawer-step2.tsx'

type CashDrawStep = 'details' | 'preview' | 'result'

type CashDrawDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialAmount?: string
}

export type CashDrawApiData = Partial<
  CashDrawData & {
    status: string
  }
>

export function CashDrawDrawer({
  open,
  onOpenChange,
  initialAmount,
}: CashDrawDrawerProps) {
  const { getLocalizedValue } = useCompanyLocalizations()
  const company = useCompanySettings()
  const currencySymbol = company?.country?.symbol || '$'

  const { accountProfile, refetch } = useProfileLoader()
  const { cashDrawData, setCashDrawData, clearCashDrawData } =
    useCashDrawStore()

  const [step, setStep] = useState<CashDrawStep>('details')
  const [amount, setAmount] = useState(initialAmount ?? '')
  const [isLoading, setIsLoading] = useState(false)
  const [disclaimerOpen, setDisclaimerOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    setAmount(initialAmount ?? '')
    setStep('details')
    setDisclaimerOpen(false)
  }, [initialAmount, open])

  const accountInfo = useMemo(() => {
    const account = accountProfile?.account
    const merchant = accountProfile?.merchant

    return {
      accountNumber: account?.number || '-',
      legalName: merchant?.businessName || '-',
      transactionBalance: formatCurrency(
        account?.fundedOutstandingAmount || '0'
      ),
      pendingBalance: formatCurrency(account?.pendingBalance || '0'),
      availableBalance: formatCurrency(account?.availableBalance || '0'),
    }
  }, [accountProfile])

  const previewData = useMemo(() => {
    if (!cashDrawData) return null
    const normalized = normalizeCashDrawData(cashDrawData)
    const drawStatus = normalized.drawStatus
    return {
      creditDecision:
        normalized.creditDecision || getCreditDecisionFallback(drawStatus),
      requestedAmount: formatCurrency(normalized.requestedAmount),
      drawdownFee: formatCurrency(normalized.establishmentFee),
      drawAmount: formatCurrency(normalized.fundedAmount),
      date: normalized.createdAt ? formatDate(normalized.createdAt) : '',
      purchasedAmount: formatCurrency(normalized.paybackAmount),
      dailyRemittance: formatCurrency(normalized.estimatedDailyPaymentAmount),
      collectionSchedule: normalized.collectionSchedule || '-',
      estimatedDisbursementDate: normalized.estimatedDisbursementDate
        ? formatDate(normalized.estimatedDisbursementDate)
        : '-',
    }
  }, [cashDrawData])

  const drawerTitle = useMemo(() => {
    if (step === 'result')
      return getLocalizedValue('SUBMIT_CASH_DRAW_RESULT_LABEL')
    return getLocalizedValue('REQUEST_A_CASH_DRAW_LABEL')
  }, [getLocalizedValue, step])

  const drawerSubtitle = useMemo(() => {
    if (step === 'result')
      return getLocalizedValue('SUBMIT_A_CASH_DRAW_RESULT_SUBTITLE')
    return getLocalizedValue('REQUEST_A_CASH_DRAW_SUBTITLE')
  }, [getLocalizedValue, step])

  const handleClose = () => {
    setDisclaimerOpen(false)
    setStep('details')
    setIsLoading(false)
    clearCashDrawData()
    onOpenChange(false)
  }

  const handleWithdrawPreview = async () => {
    const requestedAmount = Number(String(amount).replace(/,/g, ''))
    if (!Number.isFinite(requestedAmount) || requestedAmount <= 0) {
      toast.error('Please enter a valid amount')
      return
    }

    setIsLoading(true)
    try {
      const response = await apiPostWithdrawRequest<
        CashDrawApiData,
        { requestedAmount: number }
      >({
        requestedAmount,
      })
      const normalized = normalizeCashDrawData(response.data ?? {})
      setCashDrawData(normalized)
      setStep('preview')
    } catch {
      toast.error('Error requesting cash draw')
    } finally {
      setIsLoading(false)
    }
  }

  const handleConfirmSubmit = async () => {
    const requestedAmount = Number(
      String(cashDrawData?.requestedAmount ?? amount).replace(/,/g, '')
    )
    if (!Number.isFinite(requestedAmount) || requestedAmount <= 0) {
      toast.error('Please enter a valid amount', {
        duration: 5000,
        position: 'top-center',
      })
      return
    }

    setIsLoading(true)
    try {
      const response = await apiPostWithdrawAccept<
        CashDrawApiData,
        { requestedAmount: number }
      >({
        requestedAmount,
      })
      const normalized = normalizeCashDrawData(response.data ?? {})
      setCashDrawData(normalized)
      setDisclaimerOpen(false)
      setStep('result')
      refetch()
    } catch {
      toast.error('Error submitting cash draw request')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <Sheet
        open={open}
        onOpenChange={(next) => {
          if (!next) {
            handleClose()
            return
          }
          onOpenChange(next)
        }}
      >
        <SheetContent className='flex min-h-0 w-full flex-col sm:max-w-[700px]'>
          <SheetHeader className='border-b px-6 py-4 shadow-xl shadow-gray-100'>
            <SheetTitle className='text-[22px]'>{drawerTitle}</SheetTitle>
            <SheetDescription className='font-semibold'>
              {drawerSubtitle}
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className='min-h-0 flex-1 px-4 [&>div]:pb-6'>
            {step === 'details' && (
              <CashDrawDrawerStep1
                currencySymbol={currencySymbol}
                accountInfo={accountInfo}
                amount={amount}
                onAmountChange={setAmount}
              />
            )}

            {step === 'preview' && previewData && (
              <CashDrawDrawerStep2
                previewData={previewData}
              />
            )}

            {step === 'result' && cashDrawData && (
              <CashDrawDrawerResult
                cashDrawData={cashDrawData}
              />
            )}
          </ScrollArea>

          <SheetFooter className='border-t p-3 shadow-[0_-8px_20px_rgba(243,244,246,0.8)]'>
            <div className='flex w-full items-center justify-end gap-2 p-4'>
              {step === 'details' && (
                <>
                  <Button
                    variant='outline'
                    onClick={handleClose}
                    disabled={isLoading}
                  >
                    {getLocalizedValue('CASH_DRAW_FORM_CANCEL_BUTTON_LABEL')}
                  </Button>
                  <Button onClick={handleWithdrawPreview} disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className='h-4 w-4 animate-spin' />
                    ) : (
                      getLocalizedValue('CASH_DRAW_FORM_WITHDRAW_BUTTON_LABEL')
                    )}
                  </Button>
                </>
              )}

              {step === 'preview' && (
                <>
                  <Button
                    variant='outline'
                    onClick={handleClose}
                    disabled={isLoading}
                  >
                    {getLocalizedValue('CASH_DRAW_FORM_CANCEL_BUTTON_LABEL')}
                  </Button>
                  <Button
                    onClick={() => setDisclaimerOpen(true)}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <Loader2 className='h-4 w-4 animate-spin' />
                    ) : (
                      getLocalizedValue(
                        'CASH_DRAW_FORM_RESULT_SUBMIT_BTN_LABEL'
                      )
                    )}
                  </Button>
                </>
              )}

              {step === 'result' && (
                <Button onClick={handleClose}>
                  {getLocalizedValue('CASH_DRAW_FORM_FINAL_CLOSE_BTN')}
                </Button>
              )}
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <CashDrawDisclaimerDialog
        open={disclaimerOpen}
        onClose={() => setDisclaimerOpen(false)}
        amount={cashDrawData?.requestedAmount ?? 0}
        isLoading={isLoading}
        onConfirm={handleConfirmSubmit}
      />
    </>
  )
}
