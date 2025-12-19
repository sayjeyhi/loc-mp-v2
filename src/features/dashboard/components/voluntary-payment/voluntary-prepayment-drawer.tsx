import { useEffect, useMemo, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { apiPostVoluntaryPrepaymentRequestStepOne, apiPostVoluntaryPrepaymentRequestStepTwo } from '@/lib/services/PaymentService.ts'
import { idempotencyManagers, isIdempotencyError } from '@/lib/utils/idempotency.ts'
import { useCompanyLocalizations } from '@/hooks/use-company-localizations.ts'
import { useCompanySettings } from '@/hooks/use-company-settings.ts'
import { useProfileLoader } from '@/hooks/use-profile-loader.ts'
import { formatCurrency } from '@/lib/utils/formatCurrency.ts'
import { usePrepaymentStore, type PrepaymentRequestData, type PrepaymentCreateData } from '@/store/prepaymentStore.ts'
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
import { VoluntaryPrepaymentDrawerStep1 } from './voluntary-prepayment-drawer-step1.tsx'
import { VoluntaryPrepaymentDrawerStep2 } from './voluntary-prepayment-drawer-step2.tsx'
import { VoluntaryPrepaymentDrawerResult } from './voluntary-prepayment-drawer-result.tsx'
import { VoluntaryPrepaymentDisclaimerDialog } from './voluntary-prepayment-disclaimer-dialog.tsx'

type Step = 'step1' | 'step2' | 'result'

type VoluntaryPrepaymentDrawerProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function VoluntaryPrepaymentDrawer({
  open,
  onOpenChange,
}: VoluntaryPrepaymentDrawerProps) {
  const { getLocalizedValue } = useCompanyLocalizations()
  const company = useCompanySettings()
  const currencySymbol = company?.country?.symbol || '$'

  const { accountProfile, refetch } = useProfileLoader()
  const {
    prepaymentData,
    requestedAmount,
    createData,
    setPrepaymentData,
    setRequestedAmount,
    setCreateData,
    clearPrepaymentData,
  } = usePrepaymentStore()

  const [step, setStep] = useState<Step>('step1')
  const [amount, setAmount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  useEffect(() => {
    if (!open) return
    // Reset idempotency key for new flow
    idempotencyManagers.prepaymentCreate.resetKey()
    setStep('step1')
    setConfirmOpen(false)
    setIsLoading(false)
    setAmount('')
    clearPrepaymentData()
  }, [clearPrepaymentData, open])

  const accountInfo = useMemo(() => {
    const account = accountProfile?.account
    const merchant = accountProfile?.merchant

    return {
      accountNumber: account?.number || '-',
      legalName: merchant?.businessName || '-',
      transactionBalance: formatCurrency(account?.fundedOutstandingAmount || '0'),
      paybackBalance: formatCurrency(account?.paybackOutstandingAmount || '0'),
      payoffBalance: formatCurrency(account?.payoffOutstandingAmount || '0'),
      potentialSavedAmount: formatCurrency(account?.potentialDiscount || '0'),
    }
  }, [accountProfile])

  const drawerTitle = useMemo(() => {
    if (step === 'result') {
      return getLocalizedValue('VOLUNTARY_PREPAYMENTS_SUBMITTED_RESULTS_LABEL')
    }
    if (step === 'step2') {
      return getLocalizedValue('VOLUNTARY_PREPAYMENT_REQUEST_LABEL')
    }
    return getLocalizedValue('VOLUNTARY_PREPAYMENT_LABEL')
  }, [getLocalizedValue, step])

  const drawerSubtitle = useMemo(() => {
    return getLocalizedValue('VOLUNTARY_PREPAYMENT_SUBTITLE')
  }, [getLocalizedValue])

  const handleClose = () => {
    setConfirmOpen(false)
    setIsLoading(false)
    setStep('step1')
    setAmount('')
    clearPrepaymentData()
    onOpenChange(false)
  }

  const handleContinue = async () => {
    const num = Number(String(amount).replace(/,/g, ''))
    if (!Number.isFinite(num) || num <= 0) {
      toast.error('Please enter a valid amount', { duration: 5000 })
      return
    }

    setIsLoading(true)
    try {
      const response = await apiPostVoluntaryPrepaymentRequestStepOne<
        PrepaymentRequestData,
        { amount: string }
      >({
        amount: String(amount),
      })

      if (!response.data) {
        throw new Error('No response')
      }

      setPrepaymentData(response.data)
      setRequestedAmount(String(amount))
      setStep('step2')
    } catch (error) {
      toast.error('Failed to process prepayment request. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async () => {
    setIsLoading(true)
    try {
      const response = await apiPostVoluntaryPrepaymentRequestStepTwo<
        PrepaymentCreateData,
        { amount: string }
      >({
        amount: requestedAmount || amount,
      })

      if (!response.data) {
        throw new Error('No response')
      }

      setCreateData(response.data)
      setConfirmOpen(false)
      setStep('result')
      refetch()
    } catch (error) {
      if (isIdempotencyError(error)) {
        toast.error('Duplicate request, please try again later.')
        return
      }
      toast.error('Failed to submit prepayment request. Please try again.')
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
            {step === 'step1' && (
              <VoluntaryPrepaymentDrawerStep1
                currencySymbol={currencySymbol}
                accountInfo={accountInfo}
                amount={amount}
                onAmountChange={setAmount}
              />
            )}

            {step === 'step2' && prepaymentData && (
              <VoluntaryPrepaymentDrawerStep2
                prepaymentData={prepaymentData}
                accountNumber={accountInfo.accountNumber}
                legalName={accountInfo.legalName}
              />
            )}

            {step === 'result' && createData && (
              <VoluntaryPrepaymentDrawerResult
                requestData={prepaymentData}
                createData={createData}
              />
            )}
          </ScrollArea>

          <SheetFooter className='border-t p-3 shadow-[0_-8px_20px_rgba(243,244,246,0.8)]'>
            <div className='flex w-full items-center justify-end gap-2 p-4'>
              {step === 'step1' && (
                <>
                  <Button variant='outline' onClick={handleClose} disabled={isLoading}>
                    {getLocalizedValue('VOLUNTARY_PREPAYMENT_FROM_CANCEL_BTN_LABEL')}
                  </Button>
                  <Button onClick={handleContinue} disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className='h-4 w-4 animate-spin' />
                    ) : (
                      getLocalizedValue('VOLUNTARY_PREPAYMENT_FROM_OK_BTN_LABEL')
                    )}
                  </Button>
                </>
              )}

              {step === 'step2' && (
                <>
                  <Button variant='outline' onClick={handleClose} disabled={isLoading}>
                    {getLocalizedValue('VOLUNTARY_PREPAYMENT_REQUEST_CANCEL_BTN_LABEL')}
                  </Button>
                  <Button onClick={() => setConfirmOpen(true)} disabled={isLoading}>
                    {isLoading ? (
                      <Loader2 className='h-4 w-4 animate-spin' />
                    ) : (
                      getLocalizedValue('VOLUNTARY_PREPAYMENT_REQUEST_SUBMIT_BTN_LABEL')
                    )}
                  </Button>
                </>
              )}

              {step === 'result' && (
                <Button onClick={handleClose}>
                  {getLocalizedValue('VOLUNTARY_PREPAYMENTS_SUBMITTED_RESULTS_CLOSE_BTN_LABEL')}
                </Button>
              )}
            </div>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <VoluntaryPrepaymentDisclaimerDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        amount={prepaymentData?.totalAmount ?? requestedAmount ?? amount ?? '0'}
        isLoading={isLoading}
        onConfirm={handleSubmit}
      />
    </>
  )
}

