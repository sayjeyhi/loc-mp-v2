import { Search, X } from 'lucide-react'
import { type DateRange } from 'react-day-picker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DateRangePicker } from '@/components/date-range-picker'

interface PaymentsFiltersBarProps {
  localSearch: string
  localSort: string
  dateRange: DateRange | undefined
  hasActiveFilters: boolean
  onSearchChange: (value: string) => void
  onSearchSubmit: () => void
  onSortChange: (value: string) => void
  onDateRangeChange: (range: DateRange | undefined) => void
  onClearFilters: () => void
}

export function PaymentsFiltersBar({
  localSearch,
  localSort,
  dateRange,
  hasActiveFilters,
  onSearchChange,
  onSearchSubmit,
  onSortChange,
  onDateRangeChange,
  onClearFilters,
}: PaymentsFiltersBarProps) {
  return (
    <div className='relative'>
      <div className='flex flex-col gap-4 sm:flex-row sm:items-center'>
        {/* Search Input */}
        <div className='relative flex-1'>
          <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400' />
          <Input
            placeholder='Search payments'
            value={localSearch}
            onChange={(e) => onSearchChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSearchSubmit()
              }
            }}
            className='pl-10'
          />
        </div>

        {/* Sort Dropdown */}
        <Select value={localSort} onValueChange={onSortChange}>
          <SelectTrigger className='w-full sm:w-[220px]'>
            <SelectValue placeholder='Sort by' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='Date (newest)'>Date (newest)</SelectItem>
            <SelectItem value='Date (oldest)'>Date (oldest)</SelectItem>
            <SelectItem value='Amount (lowest)'>Amount (lowest)</SelectItem>
            <SelectItem value='Amount (highest)'>Amount (highest)</SelectItem>
            <SelectItem value='Payback Amount (lowest)'>
              Payback Amount (lowest)
            </SelectItem>
            <SelectItem value='Payback Amount (highest)'>
              Payback Amount (highest)
            </SelectItem>
            <SelectItem value='Prepay Balance (lowest)'>
              Prepay Balance (lowest)
            </SelectItem>
            <SelectItem value='Prepay Balance (highest)'>
              Prepay Balance (highest)
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Date Range Picker */}
        <DateRangePicker
          selected={dateRange}
          onSelect={onDateRangeChange}
          placeholder='Select date range'
          className='w-full sm:w-auto'
        />

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant='ghost'
            size='sm'
            onClick={onClearFilters}
            className='w-full sm:w-auto'
          >
            <X className='mr-2 h-4 w-4' />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  )
}
