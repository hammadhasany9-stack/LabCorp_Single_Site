'use client'

import { useState, useEffect, useMemo } from 'react'
import { 
  Package, 
  TrendingUp, 
  XCircle, 
  Clock, 
  SearchX,
  Layers,
  CalendarCheck
} from 'lucide-react'
import { MetricsCards } from '@/components/order-history/MetricsCards'
import { StatusFilter } from '@/components/order-history/StatusTabs'
import { SearchFilterBar } from '@/components/order-history/SearchFilterBar'
import { ExpandableFilters } from '@/components/order-history/ExpandableFilters'
import { TableHeader } from '@/components/order-history/TableHeader'
import { OrderTable } from '@/components/order-history/OrderTable'
import { EmptyState } from '@/components/order-history/EmptyState'
import { Pagination } from '@/components/order-history/Pagination'
import { getOrdersBySiteGroup } from '@/lib/data'
import { calculateMetrics } from '@/lib/data/mockOrderHistory'
import { OrderHistoryFilters, SortField, SortDirection, DateRangePreset, getUniquePlanNames } from '@/lib/types/order-history'
import { filterOrders, sortOrders, paginateOrders, exportToCSV } from '@/lib/utils/orderHelpers'
import { useSessionContext } from '@/lib/hooks/useSessionContext'
import { filterOrdersByCustomer } from '@/lib/utils/dataFilters'
import { useSiteGroupContext } from '@/lib/hooks/useSiteGroupContext'

const PAGE_SIZE = 15

export default function OrderHistoryPage() {
  const { activeCustomerId, isLoading, shouldShowAdminFeatures } = useSessionContext()
  const { currentSiteGroup } = useSiteGroupContext()
  
  // Filter orders by site group and customer context
  const customerFilteredOrders = useMemo(() => {
    // First get orders for current site group
    const siteGroupOrders = getOrdersBySiteGroup(currentSiteGroup)
    // Then filter by customer
    const customerOrders = filterOrdersByCustomer(siteGroupOrders, activeCustomerId)
    return customerOrders
  }, [activeCustomerId, currentSiteGroup])
  
  // State management
  const [searchQuery, setSearchQuery] = useState('')
  const [activeStatus, setActiveStatus] = useState<StatusFilter>('all')
  const [filters, setFilters] = useState<OrderHistoryFilters>({})
  const [isFilterExpanded, setIsFilterExpanded] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<SortField>('orderDate')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [dateRangePreset, setDateRangePreset] = useState<DateRangePreset | undefined>()
  const [kitType, setKitType] = useState<string | undefined>()
  const [planName, setPlanName] = useState<string | undefined>()

  // Get unique plan names from customer-filtered orders
  const uniquePlanNames = useMemo(() => {
    return getUniquePlanNames(customerFilteredOrders)
  }, [customerFilteredOrders])

  // Combine filters with search, status, date range, kit type, and plan name
  const combinedFilters = useMemo(() => ({
    ...filters,
    search: searchQuery,
    status: activeStatus,
    dateRange: dateRange,
    dateRangePreset: dateRangePreset,
    kitType: kitType,
    planName: planName
  }), [filters, searchQuery, activeStatus, dateRange, dateRangePreset, kitType, planName])

  // Filter, sort, and paginate orders
  const filteredOrders = useMemo(() => {
    return filterOrders(customerFilteredOrders, combinedFilters)
  }, [customerFilteredOrders, combinedFilters])

  const sortedOrders = useMemo(() => {
    return sortOrders(filteredOrders, sortField, sortDirection)
  }, [filteredOrders, sortField, sortDirection])

  const { orders: paginatedOrders, totalPages } = useMemo(() => {
    return paginateOrders(sortedOrders, currentPage, PAGE_SIZE)
  }, [sortedOrders, currentPage])

  // Calculate metrics
  const metrics = useMemo(() => {
    return calculateMetrics(customerFilteredOrders)
  }, [customerFilteredOrders])

  // Calculate status counts for tabs (based on customer-filtered orders)
  const statusCounts = useMemo(() => {
    const filtered = filterOrders(customerFilteredOrders, { search: searchQuery })
    return {
      all: filtered.length,
      in_progress: filtered.filter(o => o.status === 'in_progress').length,
      shipped: filtered.filter(o => o.status === 'shipped').length,
      cancelled: filtered.filter(o => o.status === 'cancelled').length
    }
  }, [customerFilteredOrders, searchQuery])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [combinedFilters, sortField, sortDirection])

  // Handlers
  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  const handleStatusChange = (status: StatusFilter) => {
    setActiveStatus(status)
  }

  const handleFiltersChange = (newFilters: OrderHistoryFilters) => {
    setFilters(newFilters)
  }

  const handleClearFilters = () => {
    setFilters({})
    setSearchQuery('')
    setActiveStatus('all')
    setDateRange({})
    setDateRangePreset(undefined)
    setKitType(undefined)
    setPlanName(undefined)
    setIsFilterExpanded(false)
  }

  const handleDateRangeChange = (range: { from?: Date; to?: Date }, preset?: DateRangePreset) => {
    setDateRange(range)
    setDateRangePreset(preset)
  }

  const handleKitTypeChange = (kit?: string) => {
    setKitType(kit)
  }

  const handlePlanNameChange = (plan?: string) => {
    setPlanName(plan)
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // Toggle direction
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      // New field, default to ascending
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleExportCSV = () => {
    exportToCSV(sortedOrders)
  }

  const hasActiveFilters = !!(
    dateRange?.from ||
    dateRange?.to ||
    kitType ||
    planName ||
    filters.trackingId ||
    filters.orderNo
  )

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-10 max-w-[1400px]">
      {/* Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-2">
          Order History
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          View and manage your past orders
        </p>
      </div>

      {/* KPI Metrics */}
      <div className="mb-8">
        <MetricsCards
          metrics={metrics}
          icons={{
            total: Package,
            shipped: TrendingUp,
            cancelled: XCircle,
            inProgress: Clock,
            ordersToday: CalendarCheck
          }}
          showAdminFeatures={shouldShowAdminFeatures}
        />
      </div>

      {/* Search Bar and Expandable Filters */}
      <div className="mb-6">
        <SearchFilterBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          onFilterToggle={() => setIsFilterExpanded(!isFilterExpanded)}
          onExportCSV={handleExportCSV}
          hasActiveFilters={hasActiveFilters}
          isFilterExpanded={isFilterExpanded}
        />
        <ExpandableFilters
          isExpanded={isFilterExpanded}
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClear={handleClearFilters}
          dateRange={dateRange}
          dateRangePreset={dateRangePreset}
          onDateRangeChange={handleDateRangeChange}
          kitType={kitType}
          onKitTypeChange={handleKitTypeChange}
          planName={planName}
          onPlanNameChange={handlePlanNameChange}
          planNameOptions={uniquePlanNames}
          showAdminFilters={shouldShowAdminFeatures}
        />
      </div>

      {/* Order Table or Empty State */}
      {paginatedOrders.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No orders found"
          description={
            hasActiveFilters || searchQuery || activeStatus !== 'all'
              ? "No orders match your current filters. Try adjusting your search criteria."
              : "You don't have any orders yet. Orders will appear here once they are placed."
          }
          actionLabel={hasActiveFilters || searchQuery || activeStatus !== 'all' ? "Clear Filters" : undefined}
          onAction={hasActiveFilters || searchQuery || activeStatus !== 'all' ? handleClearFilters : undefined}
        />
      ) : (
        <>
          {/* Table Header with Title and Status Tabs */}
          <TableHeader
            activeStatus={activeStatus}
            onStatusChange={handleStatusChange}
            statusCounts={statusCounts}
          />
          
          {/* Order Table */}
          <div className="mb-6">
            <OrderTable
              orders={paginatedOrders}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
          </div>
          
          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={sortedOrders.length}
            pageSize={PAGE_SIZE}
          />
        </>
      )}
    </main>
  )
}
