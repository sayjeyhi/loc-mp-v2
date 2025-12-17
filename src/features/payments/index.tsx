import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { useSearch, useNavigate } from '@tanstack/react-router'
import dayjs from 'dayjs'
import { type DateRange } from 'react-day-picker'
import { toast } from 'sonner'
import { apiGetPaymentCalendar } from '@/lib/services/PaymentCalendarService'
import { formatDate } from '@/lib/utils/dateFormatter'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { type TPaymentCalendar } from '@/lib/utils/types/paymentCalendar'
import { Footer } from '@/components/layout/footer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { PaymentsFiltersBar } from './components/filters-bar'
import { PaymentsPagination } from './components/pagination'
import { PaymentTable } from './components/payment-table'

export function PaymentsPage() {
  const navigate = useNavigate()
  const searchParams = useSearch({ from: '/_authenticated/payments/' }) as {
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

  // State
  const [paymentCalendarData, setPaymentCalendarData] = useState<
    TPaymentCalendar[]
  >([])
  const [isLoading, setIsLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(25)
  const hasLoadedRef = useRef(false)

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
        to: '/payments',
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
      to: '/payments',
      search: {},
    })
  }

  const hasActiveFilters = Boolean(
    searchTerm || (sortOption && sortOption !== 'Date (newest)') || startDate
  )

  // Fetch payment calendar data
  const fetchPaymentCalendar = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await apiGetPaymentCalendar<TPaymentCalendar[]>()
      setPaymentCalendarData(response.data || [])
      hasLoadedRef.current = true
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Failed to fetch payment calendar'
      toast.error(errorMessage)
      setPaymentCalendarData([])
      hasLoadedRef.current = true
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch data when component mounts
  useEffect(() => {
    fetchPaymentCalendar()
  }, [fetchPaymentCalendar])

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

  // Client-side filtering
  const filteredData = useMemo(() => {
    let filtered = [...paymentCalendarData]

    // Filter by date range
    if (startDate && endDate) {
      const start = dayjs(startDate).startOf('day')
      const end = dayjs(endDate).endOf('day')
      filtered = filtered.filter((item) => {
        const itemDate = dayjs(item.dueAt)
        return (
          (itemDate.isAfter(start) || itemDate.isSame(start, 'day')) &&
          (itemDate.isBefore(end) || itemDate.isSame(end, 'day'))
        )
      })
    } else if (startDate) {
      const start = dayjs(startDate).startOf('day')
      filtered = filtered.filter((item) => {
        const itemDate = dayjs(item.dueAt)
        return itemDate.isAfter(start) || itemDate.isSame(start, 'day')
      })
    } else if (endDate) {
      const end = dayjs(endDate).endOf('day')
      filtered = filtered.filter((item) => {
        const itemDate = dayjs(item.dueAt)
        return itemDate.isBefore(end) || itemDate.isSame(end, 'day')
      })
    }

    // Filter by search term (searches in date and amounts)
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter((item) => {
        const dateStr = formatDate(item.dueAt).toLowerCase()
        const amountStr = formatCurrency(item.amount).toLowerCase()
        const paybackStr = formatCurrency(
          item.totalOutstandingAmount
        ).toLowerCase()
        const prepayStr = formatCurrency(
          item.totalOutstandingPayoffAmount
        ).toLowerCase()
        return (
          dateStr.includes(searchLower) ||
          amountStr.includes(searchLower) ||
          paybackStr.includes(searchLower) ||
          prepayStr.includes(searchLower)
        )
      })
    }

    return filtered
  }, [paymentCalendarData, startDate, endDate, searchTerm])

  // Client-side sorting
  const sortedData = useMemo(() => {
    if (!sortOption) {
      return filteredData
    }

    const sorted = [...filteredData]
    const sortMapping: {
      [key: string]: {
        field: keyof TPaymentCalendar
        direction: 'asc' | 'desc'
      }
    } = {
      'Date (newest)': { field: 'dueAt', direction: 'desc' },
      'Date (oldest)': { field: 'dueAt', direction: 'asc' },
      'Amount (lowest)': { field: 'amount', direction: 'asc' },
      'Amount (highest)': { field: 'amount', direction: 'desc' },
      'Payback Amount (lowest)': {
        field: 'totalOutstandingAmount',
        direction: 'asc',
      },
      'Payback Amount (highest)': {
        field: 'totalOutstandingAmount',
        direction: 'desc',
      },
      'Prepay Balance (lowest)': {
        field: 'totalOutstandingPayoffAmount',
        direction: 'asc',
      },
      'Prepay Balance (highest)': {
        field: 'totalOutstandingPayoffAmount',
        direction: 'desc',
      },
    }

    const sortConfig = sortMapping[sortOption]
    if (!sortConfig) {
      return sorted
    }

    sorted.sort((a, b) => {
      let aValue: string | number = a[sortConfig.field]
      let bValue: string | number = b[sortConfig.field]

      // Handle date sorting
      if (sortConfig.field === 'dueAt') {
        aValue = dayjs(aValue as string).valueOf()
        bValue = dayjs(bValue as string).valueOf()
      }

      // Handle numeric sorting
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc'
          ? aValue - bValue
          : bValue - aValue
      }

      // Fallback to string comparison
      const aStr = String(aValue || '')
      const bStr = String(bValue || '')
      if (sortConfig.direction === 'asc') {
        return aStr.localeCompare(bStr)
      } else {
        return bStr.localeCompare(aStr)
      }
    })

    return sorted
  }, [filteredData, sortOption])

  // Client-side pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return sortedData.slice(startIndex, endIndex)
  }, [sortedData, currentPage, itemsPerPage])

  // Pagination handlers
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleItemsPerPageChange = (value: string) => {
    setItemsPerPage(Number(value))
    setCurrentPage(1)
  }

  // Pagination calculations
  const totalPages = Math.ceil(sortedData.length / itemsPerPage)
  const total = sortedData.length

  return (
    <>
      <Header />

      <Main>
        <div className='flex flex-1 flex-col gap-4 rounded-lg bg-white p-6 shadow-sm dark:bg-slate-900'>
          <div className='flex flex-wrap justify-between gap-3'>
            <div className='flex flex-wrap items-center gap-3'>
              <div className='h-6 w-1 rounded-full bg-gray-300'></div>
              <h2 className='text-2xl font-bold tracking-tight'>
                Payment Calendar
              </h2>
            </div>
          </div>

          {/* Filters Bar */}
          <PaymentsFiltersBar
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

          {/* Payment Table */}
          <PaymentTable
            payments={paginatedData}
            isLoading={isLoading}
            hasLoadedPayments={hasLoadedRef.current}
            itemsPerPage={itemsPerPage}
          />

          {/* Pagination */}
          <PaymentsPagination
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
    </>
  )
}
