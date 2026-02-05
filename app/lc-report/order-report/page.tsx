'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { MetricCards } from '@/components/order-report/MetricCards'
import { ProgramTabs } from '@/components/unified-dashboard/ProgramTabs'
import { OrderReportTable } from '@/components/order-report/OrderReportTable'
import { Pagination } from '@/components/order-history/Pagination'
import { EmptyState } from '@/components/order-history/EmptyState'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { format, subDays } from 'date-fns'
import { ProgramTab } from '@/lib/types/unified-dashboard'
import { MetricCardType } from '@/lib/types/order-report'
import { 
  OrderHistoryFilters, 
  SortField, 
  SortDirection
} from '@/lib/types/order-history'
import { getAllOrders } from '@/lib/data'
import { 
  calculateOrderReportMetrics,
  filterApprovedAndInProgress,
  filterApprovedToday,
  filterApprovedOnly,
  cancelOrder as cancelOrderHelper,
  refundOrder as refundOrderHelper
} from '@/lib/utils/orderReportHelpers'
import { filterOrdersByProgram } from '@/lib/utils/unifiedDashboardHelpers'
import { filterOrders, sortOrders, paginateOrders } from '@/lib/utils/orderHelpers'
import { useSessionContext } from '@/lib/hooks/useSessionContext'
import { filterOrdersByCustomer } from '@/lib/utils/dataFilters'
import { cn } from '@/lib/utils'
import { 
  PackageSearch,
  Search,
  Calendar as CalendarIcon,
  X,
  Home
} from 'lucide-react'

const PAGE_SIZE = 10

export default function OrderReportPage() {
  const router = useRouter()
  const { activeCustomerId, shouldShowAdminFeatures } = useSessionContext()
  
  // State management
  const [allOrdersState, setAllOrdersState] = useState(getAllOrders())
  const [activeProgram, setActiveProgram] = useState<ProgramTab>('single-site')
  const [activeMetricCard, setActiveMetricCard] = useState<MetricCardType | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [sortField, setSortField] = useState<SortField>('orderDate')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [dateRangePreset, setDateRangePreset] = useState<'last_30' | 'last_60' | 'last_90' | 'custom'>()
  const [isDateDropdownOpen, setIsDateDropdownOpen] = useState(false)
  const [customDateFrom, setCustomDateFrom] = useState<Date | undefined>(dateRange?.from)
  const [customDateTo, setCustomDateTo] = useState<Date | undefined>(dateRange?.to)

  const handleBack = () => {
    router.push('/')
  }

  // Filter by customer if not admin
  const customerFilteredOrders = useMemo(() => {
    if (shouldShowAdminFeatures) return allOrdersState
    return filterOrdersByCustomer(allOrdersState, activeCustomerId)
  }, [allOrdersState, activeCustomerId, shouldShowAdminFeatures])

  // Filter by program
  const programFilteredOrders = useMemo(() => {
    return filterOrdersByProgram(customerFilteredOrders, activeProgram)
  }, [customerFilteredOrders, activeProgram])

  // Calculate metrics (includes all statuses: approved, in_progress, shipped, cancelled)
  const metrics = useMemo(() => {
    return calculateOrderReportMetrics(programFilteredOrders, activeProgram)
  }, [programFilteredOrders, activeProgram])

  // Filter to show ONLY approved and in_progress in table
  const approvedAndInProgressOrders = useMemo(() => {
    return filterApprovedAndInProgress(programFilteredOrders)
  }, [programFilteredOrders])

  // Apply metric card filter
  const metricFilteredOrders = useMemo(() => {
    if (!activeMetricCard) return approvedAndInProgressOrders
    
    switch (activeMetricCard) {
      case 'approved':
        return filterApprovedOnly(approvedAndInProgressOrders)
      case 'approved-today':
        return filterApprovedToday(approvedAndInProgressOrders)
      default:
        // For cancelled and shipped, we don't filter since they're not in the table anyway
        return approvedAndInProgressOrders
    }
  }, [approvedAndInProgressOrders, activeMetricCard])

  // Apply additional filters (search, date range, etc.)
  const advancedFilteredOrders = useMemo(() => {
    const combinedFilters: OrderHistoryFilters = {
      search: searchQuery,
      dateRange,
      dateRangePreset,
    }
    return filterOrders(metricFilteredOrders, combinedFilters)
  }, [metricFilteredOrders, searchQuery, dateRange, dateRangePreset])

  // Sort orders
  const sortedOrders = useMemo(() => {
    return sortOrders(advancedFilteredOrders, sortField, sortDirection)
  }, [advancedFilteredOrders, sortField, sortDirection])

  // Paginate orders
  const { orders: paginatedOrders, totalPages: calculatedTotalPages } = useMemo(() => {
    return paginateOrders(sortedOrders, currentPage, PAGE_SIZE)
  }, [sortedOrders, currentPage])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [activeProgram, activeMetricCard, searchQuery, dateRange])

  // Clear selection when changing program or metric card
  useEffect(() => {
    setSelectedRows([])
  }, [activeProgram, activeMetricCard])

  // Handlers
  const handleProgramChange = (program: ProgramTab) => {
    setActiveProgram(program)
  }

  const handleMetricCardClick = (cardType: MetricCardType) => {
    // Toggle metric card filter
    if (activeMetricCard === cardType) {
      setActiveMetricCard(null)
    } else {
      setActiveMetricCard(cardType)
    }
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleQuickDateFilter = (preset: 'last_30' | 'last_60' | 'last_90') => {
    const today = new Date()
    let from: Date | undefined
    let to: Date | undefined

    switch (preset) {
      case 'last_30':
        from = subDays(today, 30)
        to = today
        break
      case 'last_60':
        from = subDays(today, 60)
        to = today
        break
      case 'last_90':
        from = subDays(today, 90)
        to = today
        break
    }

    setCustomDateFrom(from)
    setCustomDateTo(to)
    setDateRange({ from, to })
    setDateRangePreset(preset)
    setIsDateDropdownOpen(false)
  }

  const handleCustomDateApply = () => {
    setDateRange({ from: customDateFrom, to: customDateTo })
    setDateRangePreset('custom')
    setIsDateDropdownOpen(false)
  }

  const handleClearDateRange = () => {
    setCustomDateFrom(undefined)
    setCustomDateTo(undefined)
    setDateRange({})
    setDateRangePreset(undefined)
  }

  const getDateRangeLabel = () => {
    if (!dateRange?.from && !dateRange?.to) return 'Select date range'
    
    if (dateRangePreset && dateRangePreset !== 'custom') {
      switch (dateRangePreset) {
        case 'last_30':
          return 'Last 30 days'
        case 'last_60':
          return 'Last 60 days'
        case 'last_90':
          return 'Last 90 days'
      }
    }
    
    if (dateRange.from && dateRange.to) {
      return `${format(dateRange.from, 'MMM dd, yyyy')} - ${format(dateRange.to, 'MMM dd, yyyy')}`
    }
    
    if (dateRange.from) {
      return `From ${format(dateRange.from, 'MMM dd, yyyy')}`
    }
    
    if (dateRange.to) {
      return `Until ${format(dateRange.to, 'MMM dd, yyyy')}`
    }
    
    return 'Select date range'
  }

  const handleCancelOrder = (orderId: string) => {
    setAllOrdersState(prevOrders => cancelOrderHelper(orderId, prevOrders))
  }

  const handleRefundOrder = (orderId: string) => {
    setAllOrdersState(prevOrders => refundOrderHelper(orderId, prevOrders))
  }

  const handleGenerateAsset = (orderId: string) => {
    // TODO: Implement asset generation logic
    console.log('Generate asset for order:', orderId)
    // This will be implemented based on your asset generation requirements
  }

  const hasActiveFilters = Boolean(
    searchQuery ||
    dateRange.from ||
    dateRange.to ||
    activeMetricCard
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      <Navbar title="Order Report" />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-[1400px]">
        {/* Back Button */}
        <div className="mb-6 text-blue-600 dark:text-blue-400">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="hover:text-blue-700 dark:hover:text-blue-300 hover:bg-gray-100 dark:hover:bg-zinc-800"
          >
            <Home className="h-4 w-4 mr-1" />
            Back to Dashboard
          </Button>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-2">
            Order Report
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            View and manage approved and in-progress orders across all programs
          </p>
        </div>

        {/* Metric Cards */}
        <div className="mb-6">
          <MetricCards 
            metrics={metrics}
            onCardClick={handleMetricCardClick}
            activeCard={activeMetricCard}
          />
        </div>

        {/* Program Tabs */}
        <ProgramTabs 
          activeProgram={activeProgram}
          onProgramChange={handleProgramChange}
        />

        {/* Search Bar and Date Range Filter */}
        <div className="mb-6 bg-white dark:bg-card rounded-2xl shadow-md border border-gray-200 dark:border-zinc-800 p-6">
          <div className="flex flex-row gap-4">
            {/* Search Bar */}
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by Order ID, Order No, Kit Name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Date Range Filter */}
            <div className="w-60">
              <Popover open={isDateDropdownOpen} onOpenChange={setIsDateDropdownOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !dateRange?.from && !dateRange?.to && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {getDateRangeLabel()}
                    {(dateRange?.from || dateRange?.to) && (
                      <X
                        className="h-3 w-3 ml-auto hover:bg-accent rounded-sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleClearDateRange()
                        }}
                      />
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <div className="p-3">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Quick Filters</Label>
                      <div className="flex flex-col gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuickDateFilter('last_30')}
                          className={cn(
                            "justify-start",
                            dateRangePreset === 'last_30' && "bg-accent font-medium"
                          )}
                        >
                          Last 30 days
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuickDateFilter('last_60')}
                          className={cn(
                            "justify-start",
                            dateRangePreset === 'last_60' && "bg-accent font-medium"
                          )}
                        >
                          Last 60 days
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuickDateFilter('last_90')}
                          className={cn(
                            "justify-start",
                            dateRangePreset === 'last_90' && "bg-accent font-medium"
                          )}
                        >
                          Last 90 days
                        </Button>
                      </div>
                    </div>

                    <Separator className="my-3" />

                    <div className="space-y-3">
                      <Label className="text-sm font-semibold">Custom Range</Label>
                      <div className="space-y-2">
                        <div>
                          <Label className="text-xs text-gray-600 dark:text-gray-400 mb-1">From</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className={cn(
                                  'w-full justify-start text-left font-normal',
                                  !customDateFrom && 'text-muted-foreground'
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {customDateFrom ? format(customDateFrom, 'MMM dd, yyyy') : 'From date'}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={customDateFrom}
                                onSelect={setCustomDateFrom}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div>
                          <Label className="text-xs text-gray-600 dark:text-gray-400 mb-1">To</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className={cn(
                                  'w-full justify-start text-left font-normal',
                                  !customDateTo && 'text-muted-foreground'
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {customDateTo ? format(customDateTo, 'MMM dd, yyyy') : 'To date'}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={customDateTo}
                                onSelect={setCustomDateTo}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                      <Button
                        onClick={handleCustomDateApply}
                        size="sm"
                        className="w-full"
                        disabled={!customDateFrom && !customDateTo}
                      >
                        Apply Custom Range
                      </Button>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>

        {/* Orders Table or Empty State */}
        {paginatedOrders.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title="No orders found"
            description={hasActiveFilters ? "Try adjusting your filters" : "No active orders available for this program"}
          />
        ) : (
          <>
            {/* Table Title Section */}
            <div className="bg-white dark:bg-card rounded-t-2xl shadow-md border border-b-0 border-gray-200 dark:border-zinc-800 px-6 py-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                Orders
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                Showing approved and in-progress orders only
              </p>
            </div>

            <div className="mb-6">
              <OrderReportTable 
                orders={paginatedOrders}
                selectedRows={selectedRows}
                onSelectionChange={setSelectedRows}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
                onCancelOrder={handleCancelOrder}
                onRefundOrder={handleRefundOrder}
                onGenerateAsset={handleGenerateAsset}
              />
            </div>

            {/* Pagination */}
            <Pagination 
              currentPage={currentPage}
              totalPages={calculatedTotalPages}
              onPageChange={setCurrentPage}
              totalItems={sortedOrders.length}
              pageSize={PAGE_SIZE}
            />
          </>
        )}
      </main>
    </div>
  )
}
