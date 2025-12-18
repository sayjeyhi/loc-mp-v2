import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Loader2, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import {
  apiGetBankStatement,
  apiReconnectBankStatement,
} from '@/lib/services/BankStatementService'
import { useCompanyLocalizations } from '@/hooks/use-company-localizations'
import { useCompanySettings } from '@/hooks/use-company-settings'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'

type BankAccount = {
  bankName: string
  accountNumber: string
  status: string
}

type BankStatement = {
  id: string
  bankStatementGroupId: string
  bankStatementProviderId: string
  bankAccounts: BankAccount[]
}

function getErrorMessage(error: unknown): string {
  const maybe = error as {
    response?: {
      data?: { data?: { dataReason?: string }; dataReason?: string }
    }
    message?: string
  }

  return (
    maybe?.response?.data?.data?.dataReason ||
    maybe?.response?.data?.dataReason ||
    maybe?.message ||
    'An error occurred. Please try again.'
  )
}

export function ReconnectBanks() {
  const company = useCompanySettings()
  const { getLocalizedValue } = useCompanyLocalizations()

  const showReconnectBankButton =
    company?.settings?.find(
      (setting) => setting.setting.title === 'Show Reconnect Banks Button'
    )?.value === '1'

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [bankStatements, setBankStatements] = useState<BankStatement[] | null>(
    null
  )
  const [reconnectingId, setReconnectingId] = useState<string>('')

  const hasAutoOpenedRef = useRef(false)
  const authWindowRef = useRef<Window | null>(null)
  const authCheckIntervalRef = useRef<number | null>(null)

  const disconnectedStatements = useMemo(() => {
    const statements = bankStatements ?? []
    return statements.filter((statement) =>
      statement.bankAccounts?.some((acc) => acc.status === 'disconnected')
    )
  }, [bankStatements])

  const hasDisconnectedAccounts = disconnectedStatements.length > 0

  const fetchBankStatements = useCallback(async () => {
    setLoading(true)
    try {
      const response = await apiGetBankStatement<BankStatement[]>()
      setBankStatements(response.data ?? [])
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }, [])

  // Load bank statements (only when feature is enabled)
  useEffect(() => {
    if (!showReconnectBankButton) return
    fetchBankStatements()
  }, [fetchBankStatements, showReconnectBankButton])

  // Auto-open the drawer once if there are disconnected accounts
  useEffect(() => {
    if (!showReconnectBankButton) return
    if (!hasDisconnectedAccounts) return
    if (open) return
    if (loading) return
    if (hasAutoOpenedRef.current) return

    hasAutoOpenedRef.current = true
    setOpen(true)
  }, [hasDisconnectedAccounts, loading, open, showReconnectBankButton])

  // Cleanup popup + polling
  useEffect(() => {
    return () => {
      if (authCheckIntervalRef.current) {
        window.clearInterval(authCheckIntervalRef.current)
        authCheckIntervalRef.current = null
      }
      if (authWindowRef.current && !authWindowRef.current.closed) {
        authWindowRef.current.close()
      }
      authWindowRef.current = null
    }
  }, [])

  const handleReconnect = async (bankStatementId: string) => {
    try {
      setReconnectingId(bankStatementId)
      const response = await apiReconnectBankStatement<{
        restoreAccessUrl: string
      }>(bankStatementId)
      const restoreAccessUrl = response.data?.restoreAccessUrl
      if (!restoreAccessUrl) {
        throw new Error(
          'Reconnect link is missing. Please contact your account manager.'
        )
      }

      const width = 600
      const height = 900
      const left = window.screen.width / 2 - width / 2
      const top = window.screen.height / 2 - height / 2

      const authWindow = window.open(
        restoreAccessUrl,
        '_blank',
        `width=${width},height=${height},left=${left},top=${top}`
      )

      if (!authWindow) {
        toast.error(
          'Popup blocked. Please allow popups for this site and try again.'
        )
        return
      }

      authWindowRef.current = authWindow

      if (authCheckIntervalRef.current) {
        window.clearInterval(authCheckIntervalRef.current)
      }

      authCheckIntervalRef.current = window.setInterval(() => {
        if (authWindow.closed) {
          if (authCheckIntervalRef.current) {
            window.clearInterval(authCheckIntervalRef.current)
            authCheckIntervalRef.current = null
          }
          authWindowRef.current = null
          setReconnectingId('')
          fetchBankStatements()
        }
      }, 1000)
    } catch (error) {
      toast.error(
        `An error occurred while getting reconnect link. Please contact your account manager. ${getErrorMessage(
          error
        )}`
      )
    } finally {
      // If we opened a popup, reconnectingId will be cleared when it closes.
      if (!authWindowRef.current) {
        setReconnectingId('')
      }
    }
  }

  if (!showReconnectBankButton) return null
  if (!hasDisconnectedAccounts) return null

  return (
    <>
      <Button
        size='sm'
        variant='default'
        className='hidden sm:inline-flex'
        onClick={() => {
          fetchBankStatements()
          setOpen(true)
        }}
      >
        <RefreshCw className='mr-2 h-4 w-4' />
        {getLocalizedValue('RECONNECT_BANK_BUTTON')}
      </Button>

      <Sheet
        open={open}
        onOpenChange={(nextOpen) => {
          setOpen(nextOpen)
          if (nextOpen) fetchBankStatements()
        }}
      >
        <SheetContent className='flex w-full flex-col sm:max-w-[700px]'>
          <SheetHeader>
            <SheetTitle className='text-[22px]'>
              {getLocalizedValue('RECONNECT_BANK_DRAWER_TITLE')}
            </SheetTitle>
            <SheetDescription className='font-semibold'>
              {getLocalizedValue('RECONNECT_BANK_DRAWER_SUBTITLE')}
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className='flex-1 px-4 pb-4'>
            {loading ? (
              <>
                <div className='flex flex-col gap-2 mb-4'>
                  <Skeleton className='h-6 w-full' />
                  <Skeleton className='h-6 w-full' />
                  <Skeleton className='h-6 w-full rounded-full' />
                  <Skeleton className='h-6 w-1/2 rounded-full' />
                </div>
                <div className='rounded-md border overflow-hidden'>

                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          {getLocalizedValue(
                            'RECONNECT_BANK_DRAWER_TABLE_BANK'
                          )}
                        </TableHead>
                        <TableHead>
                          {getLocalizedValue(
                            'RECONNECT_BANK_DRAWER_TABLE_ACCOUNTS'
                          )}
                        </TableHead>
                        <TableHead>
                          {getLocalizedValue(
                            'RECONNECT_BANK_DRAWER_TABLE_STATUS'
                          )}
                        </TableHead>
                        <TableHead className='w-24' />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Array.from({ length: 4 }).map((_, index) => (
                        <TableRow key={`skeleton-${index}`}>
                          <TableCell>
                            <Skeleton className='h-4 w-32' />
                          </TableCell>
                          <TableCell>
                            <Skeleton className='h-4 w-40' />
                          </TableCell>
                          <TableCell>
                            <Skeleton className='h-6 w-28 rounded-full' />
                          </TableCell>
                          <TableCell className='text-right'>
                            <Skeleton className='h-8 w-24 rounded-md' />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            ) : disconnectedStatements.length === 0 ? (
              <div className='mt-24 flex flex-col gap-8 p-6 text-center text-gray-700'>
                <p className='text-base'>
                  {getLocalizedValue('RECONNECT_BANK_CONNECTED_ALL_MESSAGE')}
                </p>
              </div>
            ) : (
              <>
                <div className='my-4 mb-8'>
                  <p className='text-sm whitespace-pre-wrap'>
                    {getLocalizedValue('RECONNECT_BANK_DRAWER_INFO')}
                  </p>
                </div>

                <div className='rounded-md border overflow-hidden'>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          {getLocalizedValue(
                            'RECONNECT_BANK_DRAWER_TABLE_BANK'
                          )}
                        </TableHead>
                        <TableHead>
                          {getLocalizedValue(
                            'RECONNECT_BANK_DRAWER_TABLE_ACCOUNTS'
                          )}
                        </TableHead>
                        <TableHead>
                          {getLocalizedValue(
                            'RECONNECT_BANK_DRAWER_TABLE_STATUS'
                          )}
                        </TableHead>
                        <TableHead className='w-24' />
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {disconnectedStatements.map((statement) => {
                        const disconnectedAccounts = (
                          statement.bankAccounts || []
                        )
                          .filter((a) => a.status === 'disconnected')
                          .map((a) => a.accountNumber)
                          .join(', ')

                        const bankName =
                          statement.bankAccounts?.[0]?.bankName ?? 'Bank'

                        return (
                          <TableRow key={statement.id}>
                            <TableCell className='font-medium'>
                              {bankName}
                            </TableCell>
                            <TableCell className='text-muted-foreground'>
                              {disconnectedAccounts}
                            </TableCell>
                            <TableCell>
                              <Badge
                                variant='secondary'
                                className='bg-red-100 text-red-600'
                              >
                                {getLocalizedValue(
                                  'RECONNECT_BANK_DRAWER_TABLE_DISCONNECTED'
                                )}
                              </Badge>
                            </TableCell>
                            <TableCell className='text-right'>
                              <Button
                                size='sm'
                                onClick={() => handleReconnect(statement.id)}
                                disabled={!!reconnectingId}
                              >
                                {reconnectingId === statement.id ? (
                                  <Loader2 className='h-4 w-4 animate-spin' />
                                ) : (
                                  getLocalizedValue(
                                    'RECONNECT_BANK_DRAWER_TABLE_RECONNECT'
                                  )
                                )}
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
          </ScrollArea>

          <SheetFooter className='border-t'>
            <Button
              variant='default'
              className='w-full'
              onClick={() => setOpen(false)}
            >
              {getLocalizedValue('RECONNECT_BANK_DRAWER_CLOSE')}
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}
