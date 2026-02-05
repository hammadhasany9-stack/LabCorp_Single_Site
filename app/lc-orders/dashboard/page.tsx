'use client'

import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/Navbar'
import { ProgramTabs } from '@/components/unified-dashboard/ProgramTabs'
import { StatusTabs, StatusFilter } from '@/components/order-history/StatusTabs'
import { ProgramBreakdownCards } from '@/components/unified-dashboard/ProgramBreakdownCards'
import { UnifiedOrdersTable } from '@/components/unified-dashboard/UnifiedOrdersTable'
import { ExpandableFilters } from '@/components/order-history/ExpandableFilters'
import { Pagination } from '@/components/order-history/Pagination'
import { EmptyState } from '@/components/order-history/EmptyState'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { 
  ProgramTab
} from '@/lib/types/unified-dashboard'
import { 
  OrderHistoryFilters, 
  SortField, 
  SortDirection,
  getUniquePlanNames 
} from '@/lib/types/order-history'
import { getAllOrders } from '@/lib/data'
import { 
  calculateUnifiedMetrics, 
  filterOrdersByProgram, 
  filterOrdersByUnifiedStatus,
  calculateStatusCounts,
  exportSelectedOrders
} from '@/lib/utils/unifiedDashboardHelpers'
import { filterOrders, sortOrders, paginateOrders } from '@/lib/utils/orderHelpers'
import { useSessionContext } from '@/lib/hooks/useSessionContext'
import { filterOrdersByCustomer } from '@/lib/utils/dataFilters'
import { 
  Package, 
  TruckIcon, 
  XCircle, 
  Clock, 
  CheckCircle2,
  PackageSearch,
  Search,
  Filter,
  Download,
  ChevronUp,
  ChevronDown,
  Home
} from 'lucide-react'

const PAGE_SIZE = 10

export default function UnifiedOrdersDashboard() {
  const router = useRouter()
  const { activeCustomerId, shouldShowAdminFeatures } = useSessionContext()
  
  // State management
  const [activeProgram, setActiveProgram] = useState<ProgramTab>('single-site')
  const [activeStatus, setActiveStatus] = useState<StatusFilter>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [isFilterExpanded, setIsFilterExpanded] = useState(false)
  const [filters, setFilters] = useState<OrderHistoryFilters>({})
  const [selectedRows, setSelectedRows] = useState<string[]>([])
  const [sortField, setSortField] = useState<SortField>('orderDate')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [currentPage, setCurrentPage] = useState(1)
  const [dateRange, setDateRange] = useState<{ from?: Date; to?: Date }>({})
  const [dateRangePreset, setDateRangePreset] = useState<'last_30' | 'last_60' | 'last_90' | 'custom'>()
  const [kitType, setKitType] = useState<string>()
  const [planName, setPlanName] = useState<string>()

  const handleBack = () => {
    router.push('/')
  }

  // Get all orders
  const allOrders = useMemo(() => getAllOrders(), [])

  // Filter by customer if not admin
  const customerFilteredOrders = useMemo(() => {
    if (shouldShowAdminFeatures) return allOrders
    return filterOrdersByCustomer(allOrders, activeCustomerId)
  }, [allOrders, activeCustomerId, shouldShowAdminFeatures])

  // Filter by program
  const programFilteredOrders = useMemo(() => {
    return filterOrdersByProgram(customerFilteredOrders, activeProgram)
  }, [customerFilteredOrders, activeProgram])

  // Filter by status
  const statusFilteredOrders = useMemo(() => {
    return filterOrdersByUnifiedStatus(programFilteredOrders, activeStatus)
  }, [programFilteredOrders, activeStatus])

  // Apply additional filters (search, date range, etc.)
  const advancedFilteredOrders = useMemo(() => {
    const combinedFilters: OrderHistoryFilters = {
      search: searchQuery,
      dateRange,
      dateRangePreset,
      trackingId: filters.trackingId,
      kitType,
      orderNo: filters.orderNo,
      planName,
    }
    return filterOrders(statusFilteredOrders, combinedFilters)
  }, [statusFilteredOrders, searchQuery, dateRange, dateRangePreset, filters.trackingId, filters.orderNo, kitType, planName])

  // Sort orders
  const sortedOrders = useMemo(() => {
    return sortOrders(advancedFilteredOrders, sortField, sortDirection)
  }, [advancedFilteredOrders, sortField, sortDirection])

  // Paginate orders
  const { orders: paginatedOrders, totalPages: calculatedTotalPages } = useMemo(() => {
    return paginateOrders(sortedOrders, currentPage, PAGE_SIZE)
  }, [sortedOrders, currentPage])

  // Calculate metrics for global view (all orders, not filtered by program/status)
  const globalMetrics = useMemo(() => {
    const customerOrders = shouldShowAdminFeatures ? allOrders : filterOrdersByCustomer(allOrders, activeCustomerId)
    return calculateUnifiedMetrics(customerOrders)
  }, [allOrders, activeCustomerId, shouldShowAdminFeatures])

  // Calculate status counts for current program
  const statusCounts = useMemo(() => {
    return calculateStatusCounts(programFilteredOrders)
  }, [programFilteredOrders])

  // Get unique plan names for filter
  const planNameOptions = useMemo(() => {
    return getUniquePlanNames(programFilteredOrders)
  }, [programFilteredOrders])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [activeProgram, activeStatus, searchQuery, filters, dateRange, kitType, planName])

  // Clear selection when changing program or status
  useEffect(() => {
    setSelectedRows([])
  }, [activeProgram, activeStatus])

  // Handlers
  const handleProgramChange = (program: ProgramTab) => {
    setActiveProgram(program)
  }

  const handleStatusChange = (status: StatusFilter) => {
    setActiveStatus(status)
  }

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleExportCSV = () => {
    exportSelectedOrders(sortedOrders, selectedRows)
    setSelectedRows([])
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setFilters({})
    setDateRange({})
    setDateRangePreset(undefined)
    setKitType(undefined)
    setPlanName(undefined)
  }

  const hasActiveFilters = Boolean(
    searchQuery ||
    dateRange.from ||
    dateRange.to ||
    filters.trackingId ||
    filters.orderNo ||
    kitType ||
    planName
  )

  // totalPages is now calculated by paginateOrders

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      <Navbar title="Order's Dashboard" />
      
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
            LC Orders Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Centralized order management across all programs
          </p>
        </div>

        {/* Global Metrics */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
            Overview
          </h3>
          <div className="grid gap-6 grid-cols-5">
            <div className="bg-white dark:bg-card rounded-2xl shadow-md border border-gray-200 dark:border-zinc-800 p-5">
              <div className="flex items-center gap-3 mb-4">
                <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <p className="text-sm font-medium uppercase text-gray-600 dark:text-gray-200">
                  Total Orders
                </p>
              </div>
              <p className="text-4xl font-bold text-gray-900 dark:text-gray-50">
                {globalMetrics.totalOrders}
              </p>
            </div>
            <div className="bg-white dark:bg-card rounded-2xl shadow-md border border-gray-200 dark:border-zinc-800 p-5">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <p className="text-sm font-medium uppercase text-gray-600 dark:text-gray-200">
                  Approved
                </p>
              </div>
              <p className="text-4xl font-bold text-gray-900 dark:text-gray-50">
                {globalMetrics.approved}
              </p>
            </div>
            <div className="bg-white dark:bg-card rounded-2xl shadow-md border border-gray-200 dark:border-zinc-800 p-5">
              <div className="flex items-center gap-3 mb-4">
                <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <p className="text-sm font-medium uppercase text-gray-600 dark:text-gray-200">
                  In Progress
                </p>
              </div>
              <p className="text-4xl font-bold text-gray-900 dark:text-gray-50">
                {globalMetrics.open}
              </p>
            </div>
            <div className="bg-white dark:bg-card rounded-2xl shadow-md border border-gray-200 dark:border-zinc-800 p-5">
              <div className="flex items-center gap-3 mb-4">
                <TruckIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <p className="text-sm font-medium uppercase text-gray-600 dark:text-gray-200">
                  Shipped
                </p>
              </div>
              <p className="text-4xl font-bold text-gray-900 dark:text-gray-50">
                {globalMetrics.shipped}
              </p>
            </div>
            <div className="bg-white dark:bg-card rounded-2xl shadow-md border border-gray-200 dark:border-zinc-800 p-5">
              <div className="flex items-center gap-3 mb-4">
                <XCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <p className="text-sm font-medium uppercase text-gray-600 dark:text-gray-200">
                  Cancelled
                </p>
              </div>
              <p className="text-4xl font-bold text-gray-900 dark:text-gray-50">
                {globalMetrics.cancelled}
              </p>
            </div>
          </div>
        </div>

        {/* Program Breakdown Cards (without title) */}
        <ProgramBreakdownCards 
          singleSiteCount={globalMetrics.singleSiteCount}
          directToPatientCount={globalMetrics.directToPatientCount}
          showTitle={false}
        />

        {/* Program Tabs */}
        <ProgramTabs 
          activeProgram={activeProgram}
          onProgramChange={handleProgramChange}
        />

        {/* Search Bar and Filters Section */}
        <div className="mb-6 bg-white dark:bg-card rounded-2xl shadow-md border border-gray-200 dark:border-zinc-800 p-6">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
            <div className="relative w-full sm:flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search orders, kits, tracking IDs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setIsFilterExpanded(!isFilterExpanded)}
                size="default"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {hasActiveFilters && (
                  <span className="ml-2 h-2 w-2 rounded-full bg-blue-600 dark:bg-blue-400" />
                )}
                {isFilterExpanded ? (
                  <ChevronUp className="h-4 w-4 ml-2" />
                ) : (
                  <ChevronDown className="h-4 w-4 ml-2" />
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleExportCSV}
                size="default"
              >
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>

        <ExpandableFilters 
          isExpanded={isFilterExpanded}
          filters={filters}
          onFiltersChange={setFilters}
          onClear={handleClearFilters}
          dateRange={dateRange}
          dateRangePreset={dateRangePreset}
          onDateRangeChange={setDateRange}
          kitType={kitType}
          onKitTypeChange={setKitType}
          planName={planName}
          onPlanNameChange={setPlanName}
          planNameOptions={planNameOptions}
          showAdminFilters={shouldShowAdminFeatures}
        />

        {/* Orders Table or Empty State */}
        {paginatedOrders.length === 0 ? (
          <EmptyState
            icon={PackageSearch}
            title="No orders found"
            description={hasActiveFilters ? "Try adjusting your filters" : "No orders available for this program and status"}
          />
        ) : (
          <>
            {/* Table Title Section with Status Tabs */}
            <div className="bg-white dark:bg-card rounded-t-2xl shadow-md border border-b-0 border-gray-200 dark:border-zinc-800 px-6 py-4">
              <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50">
                  Orders
                </h2>
                <StatusTabs 
                  activeStatus={activeStatus}
                  onStatusChange={handleStatusChange}
                  counts={statusCounts}
                  includeApproved={true}
                />
              </div>
            </div>

            <div className="mb-6">
              <UnifiedOrdersTable 
                orders={paginatedOrders}
                activeProgram={activeProgram}
                selectedRows={selectedRows}
                onSelectionChange={setSelectedRows}
                sortField={sortField}
                sortDirection={sortDirection}
                onSort={handleSort}
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
