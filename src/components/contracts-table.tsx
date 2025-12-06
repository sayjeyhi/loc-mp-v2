import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip.tsx'
import { formatCurrency } from '@/utils/formatCurrency'
import { type ContractData } from '@/utils/types/contracts'

interface ContractsTableProps {
  contracts: ContractData[]
  isLoading: boolean
  hasLoadedContracts: boolean
  itemsPerPage: number
  isContractSelected: (contractId: number) => boolean
  isContractPerformable: (contract: ContractData) => boolean
  onToggleSelection: (contract: ContractData) => void
  onViewContract: (contract: ContractData) => void
}

export function ContractsTable({
  contracts,
  isLoading,
  hasLoadedContracts,
  itemsPerPage,
  isContractSelected,
  isContractPerformable,
  onToggleSelection,
  onViewContract,
}: ContractsTableProps) {
  return (
    <div className='relative rounded-lg border border-gray-200 dark:border-gray-700'>
      {isLoading && hasLoadedContracts && (
        <div className='absolute top-0 right-0 left-0 z-10 flex justify-center bg-white/50 py-2 backdrop-blur-sm dark:bg-gray-800/50'>
          <div className='flex items-center gap-2 rounded-full bg-white px-3 py-1 text-sm shadow-sm dark:bg-gray-800'>
            <Loader2 className='h-3 w-3 animate-spin' />
            <span className='text-gray-600 dark:text-gray-400'>
              Updating...
            </span>
          </div>
        </div>
      )}
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
            {isLoading && !hasLoadedContracts ? (
              // Show skeleton rows during initial load
              Array.from({ length: itemsPerPage }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell>
                    <Skeleton className='h-4 w-4' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-16' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-20' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-6 w-20 rounded-full' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-20' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-20' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-20' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-12' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-20' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-20' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-20' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-12' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-20' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-20' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-4 w-20' />
                  </TableCell>
                  <TableCell>
                    <Skeleton className='h-8 w-16 rounded-md' />
                  </TableCell>
                </TableRow>
              ))
            ) : !isLoading && hasLoadedContracts && contracts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={16} className='h-24 text-center'>
                  No contracts found.
                </TableCell>
              </TableRow>
            ) : (
              contracts.map((contract) => {
                const isPerformable = isContractPerformable(contract)
                const isSelected = isContractSelected(contract.id)
                return (
                  <TableRow key={contract.id}>
                    <TableCell>
                      <Tooltip disableHoverableContent={isPerformable}>
                        <TooltipTrigger>
                          <Checkbox
                            checked={isSelected}
                            disabled={!isPerformable}
                            onCheckedChange={() => onToggleSelection(contract)}
                            aria-label={`Select contract ${contract.number}`}
                          />
                        </TooltipTrigger>
                        <TooltipContent>
                          {!isPerformable && <p>This contract is paid off</p>}
                        </TooltipContent>
                      </Tooltip>
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
                        onClick={() => onViewContract(contract)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

