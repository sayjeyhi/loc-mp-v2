import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearch } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { Info, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useContractsStore } from '@/store/contractsStore'
import { type ContractData } from '@/utils/types/contracts'
import { apiGetContractStatusOrg } from '@/services/ContractStatusService'
import { formatDate } from '@/utils/dateFormatter'
import { formatCurrency } from '@/utils/formatCurrency'
import { calculateBusinessDays } from '@/utils/businessDays'
import { DEFAULT_DRAW_LIST_STATUSES } from '@/utils/constants'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { Footer } from '@/components/layout/footer'

export function Contracts() {
  const searchParams = useSearch({ from: '/_authenticated/contracts/' }) as any

  // URL parameters
  const startDate = searchParams?.startDate as string | undefined
  const endDate = searchParams?.endDate as string | undefined
  const searchTerm = searchParams?.q as string | undefined
  const sortOption = searchParams?.sort as string | undefined

  // Store hooks
  const { contracts, isLoading, total, setContracts, setLoading, setError } =
    useContractsStore()

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(25)

  // Selection state
  const [selectedContracts, setSelectedContracts] = useState<ContractData[]>(
    []
  )

  // Track if data has been loaded at least once
  const hasLoadedContractsRef = useRef(false)

  // Fetch data from API
  const fetchDataForContracts = useCallback(async () => {
    setLoading(true)

    try {
      const payload: {
        itemsPerPage: number
        page?: number
        status?: string | string[]
        'fundedDate[after]'?: string
        'fundedDate[before]'?: string
        'order[fundedDate]'?: string
        'order[requestedAmount]'?: string
        'order[fundedAmount]'?: string
        'order[paybackAmount]'?: string
        'order[paymentAmount]'?: string
      } = {
        itemsPerPage: itemsPerPage,
        page: currentPage,
      }

      // Only add status if there's a search term
      if (searchTerm) {
        payload.status = [searchTerm]
      } else {
        payload.status = DEFAULT_DRAW_LIST_STATUSES
      }

      if (startDate) {
        payload['fundedDate[after]'] = dayjs(startDate).format('YYYY-MM-DD')
      }

      if (endDate) {
        payload['fundedDate[before]'] = dayjs(endDate).format('YYYY-MM-DD')
      }

      // Handle sort
      if (sortOption) {
        const sortMapping: {
          [key: string]: { field: string; direction: string }
        } = {
          'Date (newest)': {
            field: 'order[fundedDate]',
            direction: 'desc',
          },
          'Date (oldest)': {
            field: 'order[fundedDate]',
            direction: 'asc',
          },
          'Request Amount (lowest)': {
            field: 'order[requestedAmount]',
            direction: 'asc',
          },
          'Request Amount (highest)': {
            field: 'order[requestedAmount]',
            direction: 'desc',
          },
          'Funded Amount (lowest)': {
            field: 'order[fundedAmount]',
            direction: 'asc',
          },
          'Funded Amount (highest)': {
            field: 'order[fundedAmount]',
            direction: 'desc',
          },
        }

        const sortConfig = sortMapping[sortOption]
        if (sortConfig) {
          ;(payload as any)[sortConfig.field] = sortConfig.direction
        }
      }

      const response = await apiGetContractStatusOrg<any, typeof payload>(
        payload
      )

      if (response && response.data) {
        const transformedData: ContractData[] = response.data.member.map(
          (item: any) => {
            // Calculate daysOpen from fundedDate if available
            const fundedDate = item.fundedDate
              ? dayjs(item.fundedDate, 'YYYY-MM-DD')
              : undefined
            const daysOpen = fundedDate
              ? (calculateBusinessDays(fundedDate) ?? item.daysOpen ?? 0)
              : (item.daysOpen ?? 0)

            return {
              id: item.id,
              number: item.number,
              date: item.fundedDate
                ? formatDate(item.fundedDate)
                : formatDate(item.fundDate) || '-',
              status: item.status || item.effStatus || 'processing',
              requestedAmount: item.requestedAmount || item.notionalAmt || 0,
              paybackAmount: item.paybackAmount || 0,
              paymentAmount: item.paymentAmount || item.collDailyAmt || 0,
              daysOpen: daysOpen,
              collectedAmount: parseFloat(
                item.paidBackPaybackAmount ||
                  item.stats?.paidBackPaybackAmount ||
                  '0'
              ),
              discountedBalance: parseFloat(
                item.outstandingPayoffAmount ||
                  item.stats?.outstandingPayoffAmount ||
                  '0'
              ),
              outstandingBalance: parseFloat(
                item.outstandingPaybackAmount ||
                  item.stats?.outstandingPaybackAmount ||
                  '0'
              ),
              firstDiscountTermDays: item.firstDiscountTermDays,
              paymentCount: item.paymentCount,
              drawdownAmount: item.fundedAmount || item.amountSent || 0,
              drawdownFee:
                parseFloat(item.merchantFunderEstablishmentFeeAmount || '0') ||
                item.estimateFee ||
                0,
              savedAmount: parseFloat(
                item.totalSavedAmount || item.stats?.totalSavedAmount || '0'
              ),
              outstandingPaybackAmount:
                item.outstandingPaybackAmount ||
                item.stats?.outstandingPaybackAmount ||
                '0',
              outstandingPayoffAmount:
                item.outstandingPayoffAmount ||
                item.stats?.outstandingPayoffAmount ||
                '0',
            }
          }
        )

        setContracts(
          transformedData,
          response.data.totalItems ?? transformedData.length,
          response.data.aggregations
        )
        hasLoadedContractsRef.current = true
      } else {
        setContracts([], 0)
        hasLoadedContractsRef.current = true
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Failed to fetch contracts'
      setError(errorMessage)
      toast.error(errorMessage)
      hasLoadedContractsRef.current = true
    } finally {
      setLoading(false)
    }
  }, [
    startDate,
    endDate,
    searchTerm,
    sortOption,
    currentPage,
    itemsPerPage,
    setLoading,
    setError,
    setContracts,
  ])

  // Fetch contracts when component mounts or filters change
  useEffect(() => {
    fetchDataForContracts()
  }, [fetchDataForContracts])

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [startDate, endDate, searchTerm, sortOption])

  // Selection handlers
  const toggleContractSelection = (contract: ContractData) => {
    // Only allow selection of Performing contracts
    if (contract.status !== 'performing') {
      toast.info('Only performing contracts can be selected for prepayment')
      return
    }
    setSelectedContracts((prev) => {
      const isSelected = prev.some((selected) => selected.id === contract.id)
      if (isSelected) {
        return prev.filter((selected) => selected.id !== contract.id)
      } else {
        return [...prev, contract]
      }
    })
  }

  const isContractSelected = (contractId: number) => {
    return selectedContracts.some((contract) => contract.id === contractId)
  }

  const isContractPerformable = (contract: ContractData) => {
    return contract.status === 'performing'
  }

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1)
  }

  // Calculate summary values
  const getAllSelectedPaymentAmount = () => {
    const totalSelectedPaymentAmt = selectedContracts.reduce(
      (sum, obj) => sum + parseFloat(obj.outstandingPaybackAmount),
      0
    )
    return Number(totalSelectedPaymentAmt?.toFixed(2))
  }

  const getSelectedSavedAmount = () => {
    const totalSelectedPaymentAmt = selectedContracts.reduce(
      (sum, obj) =>
        sum +
        (parseFloat(obj.outstandingPayoffAmount) -
          parseFloat(obj.outstandingPaybackAmount)),
      0
    )

    return Math.abs(Number(totalSelectedPaymentAmt?.toFixed(2)))
  }

  // Pagination calculations
  const totalPages = Math.ceil(total / itemsPerPage)

  return (
    <>
      <Header />

      <Main>
        <div className='flex flex-1 flex-col gap-4 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800'>
          <div className='flex flex-wrap items-end justify-between gap-2'>
            <div>
              <h2 className='text-2xl font-bold tracking-tight'>Contracts</h2>
            </div>
          </div>

          {/* Summary Cards */}
          <div className='grid gap-4 md:grid-cols-2'>
            <Card>
              <CardContent className='flex items-center justify-between p-6'>
                <div className='flex-1'>
                  <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                    Estimated Payment Amount
                  </p>
                  <p className='mt-2 text-2xl font-bold'>
                    {formatCurrency(getAllSelectedPaymentAmount())}
                  </p>
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-10 w-10 rounded-full'
                  onClick={() =>
                    toast.info(
                      'Estimated Payment Amount refers to the projected total you\'re expected to pay, including all applicable fees or charges. It\'s an approximate value and may differ from the final billed amount.'
                    )
                  }
                >
                  <Info className='h-5 w-5' />
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className='flex items-center justify-between p-6'>
                <div className='flex-1'>
                  <p className='text-sm font-medium text-gray-600 dark:text-gray-400'>
                    Estimated Early Payoff Discount
                  </p>
                  <p className='mt-2 text-2xl font-bold'>
                    {formatCurrency(getSelectedSavedAmount())}
                  </p>
                </div>
                <Button
                  variant='ghost'
                  size='icon'
                  className='h-10 w-10 rounded-full'
                  onClick={() =>
                    toast.info(
                      'Estimated Early Payoff Discount represents the potential savings you could achieve by settling your contract ahead of schedule. This amount is an estimate and may vary based on specific terms and conditions.'
                    )
                  }
                >
                  <Info className='h-5 w-5' />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Table */}
          <Card className='relative'>
            {isLoading && (
              <div className='absolute left-0 right-0 top-0 z-10 flex justify-center'>
                <Loader2 className='h-4 w-4 animate-spin' />
              </div>
            )}
            <CardContent className='p-0'>
              <div className='overflow-x-auto'>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className='w-12'></TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Requested Amount</TableHead>
                      <TableHead>Payback Amount</TableHead>
                      <TableHead>Payment Amount</TableHead>
                      <TableHead>Days Open</TableHead>
                      <TableHead>Collected Amount</TableHead>
                      <TableHead>Discounted Balance</TableHead>
                      <TableHead>Outstanding Balance</TableHead>
                      <TableHead>Payment Count</TableHead>
                      <TableHead>Drawdown Amount</TableHead>
                      <TableHead>Drawdown Fee</TableHead>
                      <TableHead>Saved Amount</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!isLoading &&
                      !hasLoadedContractsRef.current &&
                      contracts.length === 0 && (
                        <TableRow>
                          <TableCell
                            colSpan={16}
                            className='h-24 text-center'
                          >
                            Loading contracts...
                          </TableCell>
                        </TableRow>
                      )}
                    {!isLoading && contracts.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={16} className='h-24 text-center'>
                          No contracts found.
                        </TableCell>
                      </TableRow>
                    )}
                    {contracts.map((contract) => {
                      const isPerformable = isContractPerformable(contract)
                      const isSelected = isContractSelected(contract.id)
                      return (
                        <TableRow key={contract.id}>
                          <TableCell>
                            <Checkbox
                              checked={isSelected}
                              disabled={!isPerformable}
                              onCheckedChange={() =>
                                toggleContractSelection(contract)
                              }
                              aria-label={`Select contract ${contract.number}`}
                            />
                          </TableCell>
                          <TableCell className='font-medium'>
                            {contract.number}
                          </TableCell>
                          <TableCell>{contract.date}</TableCell>
                          <TableCell>
                            <span
                              className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                contract.status === 'performing'
                                  ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                  : contract.status === 'processing'
                                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                                    : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400'
                              }`}
                            >
                              {contract.status}
                            </span>
                          </TableCell>
                          <TableCell>
                            {formatCurrency(contract.requestedAmount)}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(contract.paybackAmount)}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(contract.paymentAmount)}
                          </TableCell>
                          <TableCell>{contract.daysOpen}</TableCell>
                          <TableCell>
                            {formatCurrency(contract.collectedAmount)}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(contract.discountedBalance)}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(contract.outstandingBalance)}
                          </TableCell>
                          <TableCell>{contract.paymentCount}</TableCell>
                          <TableCell>
                            {formatCurrency(contract.drawdownAmount)}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(contract.drawdownFee)}
                          </TableCell>
                          <TableCell>
                            {formatCurrency(contract.savedAmount)}
                          </TableCell>
                          <TableCell>
                            <Button
                              variant='outline'
                              size='sm'
                              onClick={() =>
                                toast.info('Contract details coming soon')
                              }
                            >
                              View
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {total > 0 && (
                <div className='flex items-center justify-between border-t px-4 py-4'>
                  <div className='flex items-center gap-2'>
                    <span className='text-sm text-gray-600 dark:text-gray-400'>
                      Rows per page:
                    </span>
                    <Select
                      value={itemsPerPage.toString()}
                      onValueChange={handleItemsPerPageChange}
                    >
                      <SelectTrigger className='h-8 w-[70px]'>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='25'>25</SelectItem>
                        <SelectItem value='50'>50</SelectItem>
                        <SelectItem value='100'>100</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className='flex items-center gap-2'>
                    <span className='text-sm text-gray-600 dark:text-gray-400'>
                      Page {currentPage} of {totalPages} ({total} total)
                    </span>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    <Button
                      variant='outline'
                      size='sm'
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage >= totalPages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sticky Prepay Contract Button */}
        {selectedContracts.length > 0 && (
          <div className='fixed bottom-24 left-0 right-0 z-50 flex justify-center px-4'>
            <Button
              size='lg'
              className='min-w-[200px] shadow-lg'
              onClick={() => {
                const amountRequested = selectedContracts.reduce(
                  (sum, obj) => sum + parseFloat(obj.outstandingPaybackAmount),
                  0
                )
                toast.info(
                  `Prepay Contract feature coming soon. Selected ${selectedContracts.length} contract(s) for ${formatCurrency(amountRequested)}`
                )
              }}
            >
              Prepay Contract ({selectedContracts.length})
            </Button>
          </div>
        )}
      </Main>

      <Footer />
    </>
  )
}
