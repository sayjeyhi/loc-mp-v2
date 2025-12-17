import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearch, useNavigate } from '@tanstack/react-router'
import { useContractsStore } from '@/store/contractsStore'
import dayjs from 'dayjs'
import { type DateRange } from 'react-day-picker'
import { toast } from 'sonner'
import { apiGetContractStatusOrg } from '@/lib/services/ContractStatusService'
import { calculateBusinessDays } from '@/lib/utils/businessDays'
import { DEFAULT_DRAW_LIST_STATUSES } from '@/lib/utils/constants'
import { formatDate } from '@/lib/utils/dateFormatter'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { type ContractData } from '@/lib/utils/types/contracts'
import { useCompanyLocalizations } from '@/hooks/use-company-localizations'
import { Button } from '@/components/ui/button'
import { ContractDetailsDrawer } from '@/components/contract-details-drawer'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ContractsFiltersBar } from './components/filters-bar'
import { ContractsPagination } from './components/pagination'
import { ContractsSummaryCards } from './components/summary-cards'
import { ContractsTable } from './components/table'

export function Contracts() {
  const { getLocalizedValue } = useCompanyLocalizations()
  const navigate = useNavigate()
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
  const [itemsPerPage, setItemsPerPage] = useState(10)

  // Selection state
  const [selectedContracts, setSelectedContracts] = useState<ContractData[]>([])

  // Details drawer state
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedContract, setSelectedContract] = useState<ContractData | null>(
    null
  )

  // Local filter state
  const [localSearch, setLocalSearch] = useState(searchTerm || '')
  const [localSort, setLocalSort] = useState(sortOption || 'Date (newest)')
  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    if (startDate && endDate) {
      return {
        from: new Date(startDate),
        to: new Date(endDate),
      }
    }
    return undefined
  })

  // Handler to open contract details
  const handleViewContract = (contract: ContractData) => {
    setSelectedContract(contract)
    setDetailsOpen(true)
  }

  // Handler to update filters in URL
  const updateFilters = useCallback(
    (updates: {
      search?: string
      sort?: string
      dateRange?: DateRange | undefined
    }) => {
      const params: any = {}

      if (updates.search !== undefined) {
        if (updates.search) params.q = updates.search
      } else if (searchTerm) {
        params.q = searchTerm
      }

      if (updates.sort !== undefined) {
        if (updates.sort !== 'Date (newest)') params.sort = updates.sort
      } else if (sortOption && sortOption !== 'Date (newest)') {
        params.sort = sortOption
      }

      if (updates.dateRange !== undefined) {
        if (updates.dateRange?.from) {
          params.startDate = dayjs(updates.dateRange.from).format('YYYY-MM-DD')
          if (updates.dateRange.to) {
            params.endDate = dayjs(updates.dateRange.to).format('YYYY-MM-DD')
          }
        }
      } else if (dateRange?.from) {
        params.startDate = dayjs(dateRange.from).format('YYYY-MM-DD')
        if (dateRange.to) {
          params.endDate = dayjs(dateRange.to).format('YYYY-MM-DD')
        }
      }

      navigate({
        to: '/contracts',
        search: params,
      })
    },
    [navigate, searchTerm, sortOption, dateRange]
  )

  const handleSearchChange = (value: string) => {
    setLocalSearch(value)
  }

  const handleSearchSubmit = () => {
    updateFilters({ search: localSearch })
  }

  const handleSortChange = (value: string) => {
    setLocalSort(value)
    updateFilters({ sort: value })
  }

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range)
    if (range?.from && range?.to) {
      updateFilters({ dateRange: range })
    }
  }

  const handleClearFilters = () => {
    setLocalSearch('')
    setLocalSort('Date (newest)')
    setDateRange(undefined)
    navigate({
      to: '/contracts',
      search: {},
    })
  }

  const hasActiveFilters = Boolean(
    searchTerm || (sortOption && sortOption !== 'Date (newest)') || startDate
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

  // Sync local filter state with URL parameters
  useEffect(() => {
    setLocalSearch(searchTerm || '')
    setLocalSort(sortOption || 'Date (newest)')
    if (startDate && endDate) {
      setDateRange({
        from: new Date(startDate),
        to: new Date(endDate),
      })
    } else {
      setDateRange(undefined)
    }
  }, [searchTerm, sortOption, startDate, endDate])

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
        <div className='flex flex-1 flex-col gap-4 rounded-lg bg-white p-6 shadow-sm dark:bg-slate-900'>
          <div className='flex flex-wrap justify-between gap-3'>
            <div className='flex flex-wrap items-center gap-3'>
              <div className='h-6 w-1 rounded-full bg-gray-300'></div>
              <h2 className='text-2xl font-bold tracking-tight'>
                {getLocalizedValue('CONTRACT_STATUS_PAGE_TITLE')}
              </h2>
            </div>

            <Button
              size='lg'
              disabled={selectedContracts.length === 0}
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
              {getLocalizedValue('SHARED_BTN_PREPAY')}{' '}
              {!!selectedContracts.length && `(${selectedContracts.length})`}
            </Button>
          </div>

          {/* Summary Cards */}
          <div className='grid gap-4 md:grid-cols-2'>
            <ContractsSummaryCards
              isLoading={isLoading && !hasLoadedContractsRef.current}
              estimatedPaymentAmount={getAllSelectedPaymentAmount()}
              estimatedEarlyPayoffDiscount={getSelectedSavedAmount()}
            />
          </div>

          {/* Filters Bar */}
          <ContractsFiltersBar
            localSearch={localSearch}
            localSort={localSort}
            dateRange={dateRange}
            hasActiveFilters={hasActiveFilters}
            onSearchChange={handleSearchChange}
            onSearchSubmit={handleSearchSubmit}
            onSortChange={handleSortChange}
            onDateRangeChange={handleDateRangeChange}
            onClearFilters={handleClearFilters}
          />

          {/* Table */}
          <ContractsTable
            contracts={contracts}
            isLoading={isLoading}
            hasLoadedContracts={hasLoadedContractsRef.current}
            itemsPerPage={itemsPerPage}
            isContractSelected={isContractSelected}
            isContractPerformable={isContractPerformable}
            onToggleSelection={toggleContractSelection}
            onViewContract={handleViewContract}
          />

          {/* Pagination */}
          <ContractsPagination
            total={total}
            currentPage={currentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            onPageChange={handlePageChange}
            onItemsPerPageChange={handleItemsPerPageChange}
          />
        </div>
      </Main>

      <Footer />

      {/* Contract Details Drawer */}
      <ContractDetailsDrawer
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
        contract={selectedContract}
      />
    </>
  )
}
