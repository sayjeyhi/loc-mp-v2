import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearch, useNavigate } from '@tanstack/react-router'
import { useActivityStore } from '@/store/activityStore'
import dayjs from 'dayjs'
import { type DateRange } from 'react-day-picker'
import { toast } from 'sonner'
import { apiGetPaymentHistory } from '@/lib/services/PaymentHistoryService'
import { apiGetTransactionHistory } from '@/lib/services/TransactionHistoryService'
import { formatDate } from '@/lib/utils/dateFormatter'
import {
  type TTransactionHistory,
  type TPaymentHistory,
} from '@/lib/utils/types/paymentHistory'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ActivityFiltersBar } from './components/filters-bar'
import { ActivityPagination } from './components/pagination'
import { PaymentsTable } from './components/payments-table'
import { TransactionsTable } from './components/transactions-table'

export function Activity() {
  const navigate = useNavigate()
  const searchParams = useSearch({ from: '/_authenticated/activity/' }) as {
    startDate?: string
    endDate?: string
    q?: string
    sort?: string
  }

  // URL parameters
  const startDate = searchParams?.startDate
  const endDate = searchParams?.endDate
  const searchTerm = searchParams?.q
  const sortOption = searchParams?.sort

  // Store hooks
  const {
    transactionHistory,
    transactionLoading,
    transactionTableData,
    setTransactionHistory,
    setTransactionLoading,
    setTransactionError,
    paymentHistory,
    paymentLoading,
    paymentTableData,
    setPaymentHistory,
    setPaymentLoading,
    setPaymentError,
  } = useActivityStore()

  // Active tab state
  const [activeTab, setActiveTab] = useState<'transactions' | 'payments'>(
    'transactions'
  )

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(25)

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

  // Track if data has been loaded at least once
  const hasLoadedTransactionsRef = useRef(false)
  const hasLoadedPaymentsRef = useRef(false)

  // Handler to update filters in URL
  const updateFilters = useCallback(
    (updates: {
      search?: string
      sort?: string
      dateRange?: DateRange | undefined
    }) => {
      const params: Record<string, string> = {}

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
        to: '/activity',
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
      to: '/activity',
      search: {},
    })
  }

  const hasActiveFilters = Boolean(
    searchTerm || (sortOption && sortOption !== 'Date (newest)') || startDate
  )

  // Fetch transaction history
  const fetchTransactionHistory = useCallback(async () => {
    try {
      setTransactionLoading(true)
      const payload: Record<string, unknown> = {}
      payload['filter[paymentType]'] = 'Draw'

      if (searchTerm) {
        payload['filter[search][callback_filter]'] = searchTerm
      }

      if (startDate && endDate) {
        payload['filter[fromDueAt][callback_filter]'] =
          dayjs(startDate).format('YYYY-MM-DD')
        payload['filter[toDueAt][callback_filter]'] =
          dayjs(endDate).format('YYYY-MM-DD')
      }

      if (sortOption) {
        const sortMapping: { [key: string]: string } = {
          'Date (newest)': 'desc',
          'Date (oldest)': 'asc',
          'Amount (lowest)': 'asc',
          'Amount (highest)': 'desc',
          'Status (a-z)': 'asc',
          'Status (z-a)': 'desc',
        }

        if (sortMapping[sortOption]) {
          const sortDirection = sortMapping[sortOption]
          let sortField = 'filter[_sort_dueAt]'

          if (sortOption.includes('Amount')) {
            sortField = 'filter[_sort_amount]'
          } else if (sortOption.includes('Status')) {
            sortField = 'filter[_sort_status]'
          } else if (sortOption.includes('Date')) {
            sortField = 'filter[_sort_dueAt]'
          }

          payload[sortField] = sortDirection
        }
      }

      if (itemsPerPage) {
        payload.pageSize = itemsPerPage
        payload.page = currentPage
      }

      const response = await apiGetTransactionHistory<
        TTransactionHistory[],
        Record<string, unknown>
      >(payload)

      const xCount =
        response.headers?.['X-Count'] || response.headers?.['x-count']
      setTransactionHistory(
        response.data,
        xCount ? parseInt(xCount as string) : response.data.length
      )
      hasLoadedTransactionsRef.current = true
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to fetch transaction history'
      setTransactionError(errorMessage)
      toast.error(errorMessage)
      hasLoadedTransactionsRef.current = true
    }
  }, [
    searchTerm,
    startDate,
    endDate,
    sortOption,
    itemsPerPage,
    currentPage,
    setTransactionLoading,
    setTransactionHistory,
    setTransactionError,
  ])

  // Fetch payment history
  const fetchPaymentHistory = useCallback(async () => {
    try {
      setPaymentLoading(true)
      const payload: Record<string, unknown> = {}

      if (searchTerm) {
        payload['filter[search][callback_filter]'] = searchTerm
      }

      if (startDate && endDate) {
        payload['filter[fromDueAt][callback_filter]'] =
          dayjs(startDate).format('YYYY-MM-DD')
        payload['filter[toDueAt][callback_filter]'] =
          dayjs(endDate).format('YYYY-MM-DD')
      }

      if (sortOption) {
        const sortMapping: { [key: string]: string } = {
          'Date (newest)': 'desc',
          'Date (oldest)': 'asc',
          'Amount (lowest)': 'asc',
          'Amount (highest)': 'desc',
          'Status (a-z)': 'asc',
          'Status (z-a)': 'desc',
        }

        if (sortMapping[sortOption]) {
          const sortDirection = sortMapping[sortOption]
          let sortField = 'filter[_sort_dueAt]'

          if (sortOption.includes('Amount')) {
            sortField = 'filter[_sort_amount]'
          } else if (sortOption.includes('Status')) {
            sortField = 'filter[_sort_status]'
          } else if (sortOption.includes('Date')) {
            sortField = 'filter[_sort_dueAt]'
          }

          payload[sortField] = sortDirection
        }
      }

      if (itemsPerPage) {
        payload.pageSize = itemsPerPage
        payload.page = currentPage
      }

      const response = await apiGetPaymentHistory<
        TPaymentHistory[],
        Record<string, unknown>
      >(payload)

      const xCount =
        response.headers?.['X-Count'] || response.headers?.['x-count']
      setPaymentHistory(
        response.data,
        xCount ? parseInt(xCount as string) : response.data.length
      )
      hasLoadedPaymentsRef.current = true
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to fetch payment history'
      setPaymentError(errorMessage)
      toast.error(errorMessage)
      hasLoadedPaymentsRef.current = true
    }
  }, [
    searchTerm,
    startDate,
    endDate,
    sortOption,
    itemsPerPage,
    currentPage,
    setPaymentLoading,
    setPaymentHistory,
    setPaymentError,
  ])

  // Fetch data when active tab or filters change
  useEffect(() => {
    if (activeTab === 'transactions') {
      fetchTransactionHistory()
    } else {
      fetchPaymentHistory()
    }
  }, [activeTab, fetchTransactionHistory, fetchPaymentHistory])

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

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1)
  }

  // View handlers
  const handleViewTransaction = (transaction: TTransactionHistory) => {
    toast.info(
      `Transaction GUID: ${transaction.guid}\n\nDate: ${formatDate(transaction.dueAt)}\nStatus: ${transaction.status}\nType: ${transaction.paymentType}`
    )
  }

  const handleViewPayment = (payment: TPaymentHistory) => {
    toast.info(
      `Payment GUID: ${payment.guid}\n\nDate: ${formatDate(payment.dueAt)}\nStatus: ${payment.status}\nType: ${payment.paymentType}\nProcessing Mode: ${payment.processingMode}`
    )
  }

  // Pagination calculations
  const totalPages = Math.ceil(
    (activeTab === 'transactions'
      ? transactionTableData.total
      : paymentTableData.total) / itemsPerPage
  )
  const total =
    activeTab === 'transactions'
      ? transactionTableData.total
      : paymentTableData.total

  return (
    <>
      <Header />

      <Main>
        <div className='flex flex-1 flex-col gap-4 rounded-lg bg-white p-6 shadow-sm dark:bg-slate-900'>
          <div className='flex flex-wrap justify-between gap-3'>
            <div className='flex flex-wrap items-center gap-3'>
              <div className='h-6 w-1 rounded-full bg-gray-300'></div>
              <h2 className='text-2xl font-bold tracking-tight'>Activity</h2>
            </div>
          </div>

          {/* Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={(value) =>
              setActiveTab(value as 'transactions' | 'payments')
            }
            className='w-full'
          >
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='transactions'>Transactions</TabsTrigger>
              <TabsTrigger value='payments'>Payments</TabsTrigger>
            </TabsList>

            <TabsContent value='transactions' className='mt-6 space-y-4'>
              {/* Filters Bar */}
              <ActivityFiltersBar
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

              {/* Transactions Table */}
              <TransactionsTable
                transactions={transactionHistory}
                isLoading={transactionLoading}
                hasLoadedTransactions={hasLoadedTransactionsRef.current}
                itemsPerPage={itemsPerPage}
                onViewTransaction={handleViewTransaction}
              />

              {/* Pagination */}
              <ActivityPagination
                total={total}
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </TabsContent>

            <TabsContent value='payments' className='mt-6 space-y-4'>
              {/* Filters Bar */}
              <ActivityFiltersBar
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

              {/* Payments Table */}
              <PaymentsTable
                payments={paymentHistory}
                isLoading={paymentLoading}
                hasLoadedPayments={hasLoadedPaymentsRef.current}
                itemsPerPage={itemsPerPage}
                onViewPayment={handleViewPayment}
              />

              {/* Pagination */}
              <ActivityPagination
                total={total}
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={itemsPerPage}
                onPageChange={handlePageChange}
                onItemsPerPageChange={handleItemsPerPageChange}
              />
            </TabsContent>
          </Tabs>
        </div>
      </Main>

      <Footer />
    </>
  )
}
