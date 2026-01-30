'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Building2, 
  CheckCircle2, 
  XCircle, 
  SearchX,
  Plus,
  CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MetricsCards } from '@/components/sites/MetricsCards'
import { StatusFilter } from '@/components/sites/StatusTabs'
import { SearchBar } from '@/components/sites/SearchBar'
import { TableHeader } from '@/components/sites/TableHeader'
import { SitesTable } from '@/components/sites/SitesTable'
import { EmptyState } from '@/components/sites/EmptyState'
import { Pagination } from '@/components/sites/Pagination'
import { ViewSiteDialog } from '@/components/sites/ViewSiteDialog'
import { mockSites, calculateSiteMetrics } from '@/lib/data/mockSites'
import { Site, SiteFilters, SortField, SortDirection, StatusCounts } from '@/lib/types/sites'
import { filterSites, sortSites, paginateSites } from '@/lib/utils/siteHelpers'
import { useSessionContext } from '@/lib/hooks/useSessionContext'
import { filterSitesByCustomer } from '@/lib/utils/dataFilters'
import { mockCustomers } from '@/lib/data/mockCustomers'

const PAGE_SIZE = 15

export default function SitesPage() {
  const router = useRouter()
  const { activeCustomerId, isLoading, shouldShowAdminFeatures } = useSessionContext()
  
  // Filter sites by customer context
  const customerFilteredSites = useMemo(() => {
    return filterSitesByCustomer(mockSites, activeCustomerId)
  }, [activeCustomerId])
  
  // State management
  const [sites, setSites] = useState<Site[]>(customerFilteredSites)
  
  // Update sites when customer context changes
  useEffect(() => {
    setSites(customerFilteredSites)
  }, [customerFilteredSites])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeStatus, setActiveStatus] = useState<StatusFilter>('active')
  const [currentPage, setCurrentPage] = useState(1)
  const [sortField, setSortField] = useState<SortField>('siteNumber')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)
  const [showUpdateSuccessMessage, setShowUpdateSuccessMessage] = useState(false)
  const [viewingSite, setViewingSite] = useState<Site | null>(null)
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('all')

  // Get unique customers for the dropdown
  const availableCustomers = useMemo(() => {
    // Get unique customer IDs from all sites
    const uniqueCustomerIds = Array.from(new Set(mockSites.map(site => site.customerId)))
    
    // Map to customer names
    return uniqueCustomerIds.map(customerId => {
      const customer = mockCustomers.find(c => c.customerId === customerId)
      return {
        id: customerId,
        name: customer?.customerName || customerId
      }
    }).sort((a, b) => a.name.localeCompare(b.name))
  }, [])

  // Combine filters with search and status (customers see all sites)
  const combinedFilters = useMemo((): SiteFilters => ({
    search: searchQuery,
    status: shouldShowAdminFeatures ? activeStatus : undefined,
  }), [searchQuery, activeStatus, shouldShowAdminFeatures])

  // Filter, sort, and paginate sites
  const filteredSites = useMemo(() => {
    let filtered = filterSites(sites, combinedFilters)
    
    // Apply customer filter for admin users
    if (shouldShowAdminFeatures && selectedCustomerId !== 'all') {
      filtered = filtered.filter(site => site.customerId === selectedCustomerId)
    }
    
    return filtered
  }, [sites, combinedFilters, shouldShowAdminFeatures, selectedCustomerId])

  const sortedSites = useMemo(() => {
    return sortSites(filteredSites, sortField, sortDirection)
  }, [filteredSites, sortField, sortDirection])

  const { sites: paginatedSites, totalPages } = useMemo(() => {
    return paginateSites(sortedSites, currentPage, PAGE_SIZE)
  }, [sortedSites, currentPage])

  // Calculate metrics
  const metrics = useMemo(() => {
    return calculateSiteMetrics(sites)
  }, [sites])

  // Calculate status counts for tabs
  const statusCounts = useMemo((): StatusCounts => {
    const filtered = filterSites(sites, { search: searchQuery })
    return {
      active: filtered.filter(s => s.status === 'active').length,
      inactive: filtered.filter(s => s.status === 'inactive').length,
    }
  }, [sites, searchQuery])

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [combinedFilters, sortField, sortDirection, selectedCustomerId])

  // Check for new site from sessionStorage (after redirect from add page)
  useEffect(() => {
    const newSiteData = sessionStorage.getItem('newSite')
    const showSuccess = sessionStorage.getItem('showSuccessMessage')
    
    if (newSiteData && showSuccess) {
      const newSite: Site = JSON.parse(newSiteData)
      setSites(prevSites => [newSite, ...prevSites])
      setShowSuccessMessage(true)
      
      // Clear sessionStorage
      sessionStorage.removeItem('newSite')
      sessionStorage.removeItem('showSuccessMessage')
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false)
      }, 5000)
    }

    // Check for updated site from sessionStorage (after redirect from edit page)
    const updatedSiteData = sessionStorage.getItem('updatedSite')
    const showUpdateSuccess = sessionStorage.getItem('showUpdateSuccessMessage')
    
    if (updatedSiteData && showUpdateSuccess) {
      const updatedSite: Site = JSON.parse(updatedSiteData)
      setSites(prevSites => 
        prevSites.map(site => 
          site.id === updatedSite.id ? updatedSite : site
        )
      )
      setShowUpdateSuccessMessage(true)
      
      // Clear sessionStorage
      sessionStorage.removeItem('updatedSite')
      sessionStorage.removeItem('showUpdateSuccessMessage')
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowUpdateSuccessMessage(false)
      }, 5000)
    }
  }, [])

  // Handlers
  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
  }

  const handleStatusChange = (status: StatusFilter) => {
    setActiveStatus(status)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setActiveStatus('active')
    setSelectedCustomerId('all')
  }

  const handleCustomerChange = (customerId: string) => {
    setSelectedCustomerId(customerId)
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

  const handleToggle = (siteId: string, newStatus: 'active' | 'inactive') => {
    // Update the site status in the mock data
    setSites(prevSites => 
      prevSites.map(site => 
        site.id === siteId 
          ? { ...site, status: newStatus, lastModified: new Date() }
          : site
      )
    )
  }

  const handleAddNewSite = () => {
    router.push('/programs/single-site/sites/add')
  }

  const handleViewSite = (site: Site) => {
    setViewingSite(site)
  }

  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-10 max-w-[1400px]">
      {/* Success Message for New Site */}
      {showSuccessMessage && (
        <div className="mb-6 bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-green-900 dark:text-green-100">
              Site created successfully!
            </p>
            <p className="text-sm text-green-700 dark:text-green-300">
              The new site has been added to your sites list.
            </p>
          </div>
          <button
            onClick={() => setShowSuccessMessage(false)}
            className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Success Message for Updated Site */}
      {showUpdateSuccessMessage && (
        <div className="mb-6 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-center gap-3">
          <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
              Site updated successfully!
            </p>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              The site information has been updated.
            </p>
          </div>
          <button
            onClick={() => setShowUpdateSuccessMessage(false)}
            className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            <XCircle className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="mb-10 flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-2">
            Sites
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Manage and monitor site locations
          </p>
        </div>
        <Button onClick={handleAddNewSite} className="flex-shrink-0">
          <Plus className="h-4 w-4 mr-2" />
          Add New Site
        </Button>
      </div>

      {/* KPI Metrics */}
      <div className="mb-8">
        <MetricsCards
          metrics={metrics}
          icons={{
            total: Building2,
            active: CheckCircle2,
            inactive: XCircle,
          }}
          showAdminFeatures={shouldShowAdminFeatures}
        />
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <SearchBar
          searchQuery={searchQuery}
          onSearchChange={handleSearchChange}
          showCustomerFilter={shouldShowAdminFeatures}
          selectedCustomerId={selectedCustomerId}
          onCustomerChange={handleCustomerChange}
          customers={availableCustomers}
        />
      </div>

      {/* Sites Table or Empty State */}
      {paginatedSites.length === 0 ? (
        <EmptyState
          icon={SearchX}
          title="No sites found"
          description={
            searchQuery || activeStatus === 'inactive' || (shouldShowAdminFeatures && selectedCustomerId !== 'all')
              ? "No sites match your current filters. Try adjusting your search criteria."
              : "You don't have any sites yet. Sites will appear here once they are added."
          }
          actionLabel={searchQuery || activeStatus === 'inactive' || (shouldShowAdminFeatures && selectedCustomerId !== 'all') ? "Clear Filters" : "Add New Site"}
          onAction={searchQuery || activeStatus === 'inactive' || (shouldShowAdminFeatures && selectedCustomerId !== 'all') ? handleClearFilters : handleAddNewSite}
        />
      ) : (
        <>
          {/* Table Header with Title and Status Tabs - Admin Only */}
          {shouldShowAdminFeatures && (
            <TableHeader
              activeStatus={activeStatus}
              onStatusChange={handleStatusChange}
              statusCounts={statusCounts}
            />
          )}
          
          {/* Sites Table */}
          <div className="mb-6">
            <SitesTable
              sites={paginatedSites}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              onToggle={handleToggle}
              onView={handleViewSite}
              showAdminFeatures={shouldShowAdminFeatures}
            />
          </div>
          
          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={sortedSites.length}
            pageSize={PAGE_SIZE}
          />
        </>
      )}

      {/* View Site Dialog */}
      <ViewSiteDialog
        site={viewingSite}
        open={!!viewingSite}
        onOpenChange={(open) => !open && setViewingSite(null)}
      />
    </main>
  )
}
