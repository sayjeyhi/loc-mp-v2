import { useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { useCompanyLocalizations } from '@/hooks/use-company-localizations'
import { useCompanySettings } from '@/hooks/use-company-settings'
import { useProfileLoader } from '@/hooks/use-profile-loader'
import { useCashDrawStore, type CashDrawData } from '@/store/cashDrawStore'
import {
  apiPostWithdrawAccept,
  apiPostWithdrawRequest,
} from '@/lib/services/DashboardServices'
import { formatDate } from '@/lib/utils/dateFormatter'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Separator } from '@/components/ui/separator'
import { CashDrawDisclaimerDialog } from '@/components/cash-draw-disclaimer-dialog'

type CashDrawStep = 'details' | 'preview' | 'result'

type CashDrawDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialAmount?: string
}

type CashDrawApiData = Partial<
  CashDrawData & {
    status: string
  }
>

function normalizeCashDrawData(data: CashDrawApiData | null | undefined): CashDrawData {
  return {
    drawStatus: String(data?.drawStatus ?? data?.status ?? 'pending'),
    creditDecision: String(data?.creditDecision ?? ''),
    requestedAmount: String(data?.requestedAmount ?? '0'),
    establishmentFee: String(data?.establishmentFee ?? '0'),
    wireFeeAmount: (data?.wireFeeAmount ?? null) as string | null,
    fundedAmount: String(data?.fundedAmount ?? '0'),
    createdAt: String(data?.createdAt ?? new Date().toISOString()),
    paybackAmount: String(data?.paybackAmount ?? '0'),
    estimatedDailyPaymentAmount: String(data?.estimatedDailyPaymentAmount ?? '0'),
    collectionSchedule: String(data?.collectionSchedule ?? '-'),
    estimatedDisbursementDate: String(data?.estimatedDisbursementDate ?? ''),
  }
}

function formatMoney(value: string | number, currencySymbol: string) {
  const num = typeof value === 'number' ? value : Number(String(value).replace(/,/g, ''))
  if (!Number.isFinite(num)) return `${currencySymbol}0.00`
  return `${currencySymbol}${num.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

function getCreditDecisionFallback(status: string) {
  const s = status?.toLowerCase?.() ?? ''
  if (s === 'pending') return 'Transaction requires review and approval'
  if (s === 'approved') return 'Transaction is within draw limit'
  return ''
}

export function CashDrawDrawer({
  open,
  onOpenChange,
  initialAmount,
}: CashDrawDrawerProps) {
  const { getLocalizedValue } = useCompanyLocalizations()
  const company = useCompanySettings()
  const currencySymbol = company?.country?.symbol || '$'

  const { accountProfile, refetch } = useProfileLoader()
  const { cashDrawData, setCashDrawData, clearCashDrawData } = useCashDrawStore()

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
      transactionBalance: account?.fundedOutstandingAmount || '0',
      pendingBalance: account?.pendingBalance || '0',
      availableBalance: account?.availableBalance || '0',
    }
  }, [accountProfile])

  const previewData = useMemo(() => {
    if (!cashDrawData) return null
    const normalized = normalizeCashDrawData(cashDrawData)
    const drawStatus = normalized.drawStatus
    return {
      creditDecision:
        normalized.creditDecision || getCreditDecisionFallback(drawStatus),
      requestedAmount: formatMoney(normalized.requestedAmount, currencySymbol),
      drawdownFee: formatMoney(normalized.establishmentFee, currencySymbol),
      drawAmount: formatMoney(normalized.fundedAmount, currencySymbol),
      date: normalized.createdAt ? formatDate(normalized.createdAt) : '',
      purchasedAmount: formatMoney(normalized.paybackAmount, currencySymbol),
      dailyRemittance: formatMoney(
        normalized.estimatedDailyPaymentAmount,
        currencySymbol
      ),
      collectionSchedule: normalized.collectionSchedule || '-',
      estimatedDisbursementDate: normalized.estimatedDisbursementDate
        ? formatDate(normalized.estimatedDisbursementDate)
        : '-',
    }
  }, [cashDrawData, currencySymbol])

  const drawerTitle = useMemo(() => {
    if (step === 'result') return getLocalizedValue('SUBMIT_CASH_DRAW_RESULT_LABEL')
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
      const response = await apiPostWithdrawRequest<CashDrawApiData, { requestedAmount: number }>({
        requestedAmount,
      })
      const normalized = normalizeCashDrawData(response.data ?? {})
      setCashDrawData(normalized)
      setStep('preview')
    } catch (error) {
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
      toast.error('Please enter a valid amount')
      return
    }

    setIsLoading(true)
    try {
      const response = await apiPostWithdrawAccept<CashDrawApiData, { requestedAmount: number }>({
        requestedAmount,
      })
      const normalized = normalizeCashDrawData(response.data ?? {})
      setCashDrawData(normalized)
      setDisclaimerOpen(false)
      setStep('result')
      refetch()
    } catch (error) {
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
        <SheetContent className='flex w-full flex-col sm:max-w-[700px]'>
          <SheetHeader>
            <SheetTitle className='text-[22px]'>{drawerTitle}</SheetTitle>
            <SheetDescription className='font-semibold'>
              {drawerSubtitle}
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className='flex-1 px-4 pb-4'>
            {step === 'details' && (
              <div className='mt-4 space-y-6'>
                <div className='text-foreground text-lg font-semibold'>
                  {getLocalizedValue('CASH_DRAW_LABEL')}
                </div>

                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                  <div>
                    <div className='mb-2 text-sm font-medium opacity-80'>
                      {getLocalizedValue('CASH_DRAW_FORM_ACCOUNT_LABEL')}
                    </div>
                    <div className='border-input bg-background min-h-[48px] rounded-lg border px-4 py-3'>
                      <p className='text-sm font-semibold'>
                        {accountInfo.accountNumber}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className='mb-2 text-sm font-medium opacity-80'>
                      {getLocalizedValue('CASH_DRAW_FORM_LEGAL_NAME_LABEL')}
                    </div>
                    <div className='border-input bg-background min-h-[48px] rounded-lg border px-4 py-3'>
                      <p className='text-sm font-semibold'>
                        {accountInfo.legalName}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className='mb-2 text-sm font-medium opacity-80'>
                      {getLocalizedValue(
                        'CASH_DRAW_FORM_TRANSACTION_BALANCE_LABEL'
                      )}
                    </div>
                    <div className='border-input bg-background min-h-[48px] rounded-lg border px-4 py-3'>
                      <p className='text-sm font-semibold'>
                        {formatMoney(accountInfo.transactionBalance, currencySymbol)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className='mb-2 text-sm font-medium opacity-80'>
                      {getLocalizedValue('CASH_DRAW_FORM_PENDING_BALANCE_LABEL')}
                    </div>
                    <div className='border-input bg-background min-h-[48px] rounded-lg border px-4 py-3'>
                      <p className='text-sm font-semibold'>
                        {formatMoney(accountInfo.pendingBalance, currencySymbol)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className='mb-2 text-sm font-medium opacity-80'>
                      {getLocalizedValue(
                        'CASH_DRAW_FORM_AVAILABLE_BALANCE_LABEL'
                      )}
                    </div>
                    <div className='border-input bg-background min-h-[48px] rounded-lg border px-4 py-3'>
                      <p className='text-sm font-semibold'>
                        {formatMoney(accountInfo.availableBalance, currencySymbol)}
                      </p>
                    </div>
                  </div>

                  <div>
                    <div className='mb-2 text-sm font-medium opacity-80'>
                      {getLocalizedValue('CASH_DRAW_FORM_REQUEST_CASH_DRAW_AMOUNT')}
                    </div>
                    <Input
                      prefix={currencySymbol}
                      type='text'
                      decimalCount={2}
                      placeholder='0.00'
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className='bg-gray-50 px-3 py-2 text-gray-900 placeholder-gray-400 outline-none dark:bg-gray-700 dark:text-white dark:placeholder-gray-500'
                    />
                  </div>
                </div>

                <div className='text-muted-foreground text-sm'>
                  <span className='font-semibold'>
                    {getLocalizedValue('CASH_DRAW_FORM_DISCLAIMER_LABEL')}:{' '}
                  </span>
                  {getLocalizedValue('CASH_DRAW_FORM_DISCLAIMER_TEXT')}
                </div>
              </div>
            )}

            {step === 'preview' && previewData && (
              <div className='mt-4 space-y-4'>
                <div className='text-foreground text-lg font-semibold'>
                  {getLocalizedValue('CASH_DRAW_LABEL')}
                </div>

                <div className='rounded-lg border'>
                  {[
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
                  ].map((row, index, arr) => (
                    <div key={row.label}>
                      <div
                        className={cn(
                          'flex items-start justify-between gap-4 px-4 py-3',
                          row.multiline && 'items-start'
                        )}
                      >
                        <div className='text-sm font-medium opacity-80'>
                          {row.label}
                        </div>
                        <div
                          className={cn(
                            'text-right text-sm font-semibold',
                            row.multiline && 'max-w-[60%] whitespace-pre-wrap'
                          )}
                        >
                          {row.value || '-'}
                        </div>
                      </div>
                      {index < arr.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>

                <div className='text-muted-foreground text-sm whitespace-pre-wrap'>
                  <div className='font-semibold'>
                    {getLocalizedValue('CASH_DRAW_FORM_RESULT_DISCLAIMER_LABEL')}:
                  </div>
                  <div className='mt-1'>
                    {getLocalizedValue('CASH_DRAW_FORM_RESULT_DISCLAIMER_TEXT_ONE')}
                  </div>
                  <div className='mt-4'>
                    {getLocalizedValue('CASH_DRAW_FORM_RESULT_DISCLAIMER_TEXT_TWO')}
                  </div>
                  <div className='mt-4'>
                    {getLocalizedValue(
                      'CASH_DRAW_FORM_RESULT_DISCLAIMER_TEXT_THREE'
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 'result' && cashDrawData && (
              <div className='mt-4 space-y-4'>
                <div className='rounded-lg border'>
                  {(() => {
                    const normalized = normalizeCashDrawData(cashDrawData)
                    const drawStatus =
                      normalized.drawStatus.charAt(0).toUpperCase() +
                      normalized.drawStatus.slice(1)
                    const rows = [
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
                        value: formatMoney(normalized.requestedAmount, currencySymbol),
                      },
                      {
                        label: getLocalizedValue('CASH_DRAW_FORM_ESTABLISHMENT_FEE_LABEL'),
                        value: formatMoney(normalized.establishmentFee, currencySymbol),
                      },
                      {
                        label: getLocalizedValue('CASH_DRAW_FORM_DRAW_AMOUNT_LABEL'),
                        value: formatMoney(normalized.fundedAmount, currencySymbol),
                      },
                      {
                        label: getLocalizedValue('CASH_DRAW_FORM_DATE_LABEL'),
                        value: normalized.createdAt ? formatDate(normalized.createdAt) : '-',
                      },
                      {
                        label: getLocalizedValue('CASH_DRAW_FORM_PURCHASED_AMOUNT_LABEL'),
                        value: formatMoney(normalized.paybackAmount, currencySymbol),
                      },
                      {
                        label: getLocalizedValue('CASH_DRAW_FORM_DAILY_REMITTANCE_LABEL'),
                        value: formatMoney(
                          normalized.estimatedDailyPaymentAmount,
                          currencySymbol
                        ),
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

                    return rows.map((row, index) => (
                      <div key={row.label}>
                        <div className='flex items-start justify-between gap-4 px-4 py-3'>
                          <div className='text-sm font-medium opacity-80'>
                            {row.label}
                          </div>
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
                    ))
                  })()}
                </div>

                <div className='text-muted-foreground text-sm whitespace-pre-wrap'>
                  <div>
                    <span className='font-semibold'>Disclaimer: </span>
                    {getLocalizedValue('CASH_DRAW_FORM_FINAL_DISCLAIMER_TEXT_ONE')}
                  </div>
                  <div className='mt-4'>
                    {getLocalizedValue('CASH_DRAW_FORM_FINAL_DISCLAIMER_TEXT_TWO')}
                  </div>
                </div>
              </div>
            )}
          </ScrollArea>

          <SheetFooter className='border-t'>
            <div className='flex w-full items-center justify-end gap-2 p-4'>
              {step === 'details' && (
                <>
                  <Button variant='outline' onClick={handleClose} disabled={isLoading}>
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
                  <Button variant='outline' onClick={handleClose} disabled={isLoading}>
                    {getLocalizedValue('CASH_DRAW_FORM_CANCEL_BUTTON_LABEL')}
                  </Button>
                  <Button onClick={() => setDisclaimerOpen(true)} disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className='h-4 w-4 animate-spin' />
                    ) : (
                      getLocalizedValue('CASH_DRAW_FORM_RESULT_SUBMIT_BTN_LABEL')
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
        onOpenChange={setDisclaimerOpen}
        title={getLocalizedValue('CASH_DRAW_DISCLAIMER_TITLE')}
        message={getLocalizedValue('CASH_DRAW_DISCLAIMER_MESSAGE')}
        cancelText={getLocalizedValue('CASH_DRAW_DISCLAIMER_CANCEL')}
        confirmText={getLocalizedValue('CASH_DRAW_DISCLAIMER_CONFIRM')}
        creditPaymentText={getLocalizedValue('CASH_DRAW_DISCLAIMER_CREDITED')}
        debitPaymentText={getLocalizedValue('CASH_DRAW_DISCLAIMER_DEBITED')}
        currencySymbol={currencySymbol}
        amount={cashDrawData?.requestedAmount ?? 0}
        debitAmount={cashDrawData?.estimatedDailyPaymentAmount}
        isLoading={isLoading}
        onConfirm={handleConfirmSubmit}
      />
    </>
  )
}

