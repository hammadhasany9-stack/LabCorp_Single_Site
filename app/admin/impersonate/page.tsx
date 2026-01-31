"use client"

import { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { ArrowLeft, Home } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/Navbar'
import { AdminFunctionBanner } from '@/components/admin/AdminFunctionBanner'
import { MetricsCards } from '@/components/admin/MetricsCards'
import { ViewAsAdminButton } from '@/components/admin/ViewAsAdminButton'
import { CustomerSearchBar } from '@/components/admin/CustomerSearchBar'
import { CustomerTable } from '@/components/admin/CustomerTable'
import { CustomerDetailsPanel } from '@/components/admin/CustomerDetailsPanel'
import { ImpersonateButton } from '@/components/admin/ImpersonateButton'
import { Pagination } from '@/components/admin/Pagination'
import { mockCustomers, calculateCustomerMetrics, filterCustomers } from '@/lib/data/mockCustomers'
import { Customer } from '@/lib/types/customer'

const PAGE_SIZE = 8

function ImpersonateContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { isAdmin, isLoading, requireAdmin } = useAuth()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  
  const destination = searchParams.get('destination') || '/programs/single-site'

  // Protect this page - only admins can access
  useEffect(() => {
    if (!isLoading && !isAdmin) {
      router.push('/auth/signin')
    }
  }, [isAdmin, isLoading, router])

  // Calculate metrics
  const metrics = useMemo(() => {
    return calculateCustomerMetrics(mockCustomers)
  }, [])

  // Filter customers based on search
  const filteredCustomers = useMemo(() => {
    return filterCustomers(mockCustomers, searchQuery)
  }, [searchQuery])

  // Paginate customers
  const paginatedCustomers = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE
    const endIndex = startIndex + PAGE_SIZE
    return filteredCustomers.slice(startIndex, endIndex)
  }, [filteredCustomers, currentPage])

  const totalPages = useMemo(() => {
    return Math.ceil(filteredCustomers.length / PAGE_SIZE)
  }, [filteredCustomers])

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery])

  const handleBack = () => {
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return null // Will redirect via useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-zinc-950">
      <Navbar title="Customer Impersonation" />
      
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-10 max-w-[1400px]">
      {/* Header */}
      <div className="mb-10 text-blue-600 dark:text-blue-400">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="hover:text-blue-700 dark:hover:text-blue-300hover:bg-gray-100 dark:hover:bg-zinc-800 mb-4"
        >
          <Home className="h-4 w-4 mr-1" />
          Back to Dashboard
        </Button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-2">
              Customer Impersonation
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Select a customer to impersonate or view all data as administrator
            </p>
          </div>
        </div>
      </div>

      {/* Admin Function Banner */}
      <AdminFunctionBanner />

      {/* Metrics */}
      <div className="mb-8">
        <MetricsCards metrics={metrics} />
      </div>

      {/* Search Bar with View as Admin button */}
      <CustomerSearchBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      >
        <ViewAsAdminButton destination={destination} />
      </CustomerSearchBar>

      {/* Main Content: Table and Details Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Customer Table */}
        <div className="lg:col-span-2">
          <CustomerTable
            customers={paginatedCustomers}
            onSelectCustomer={setSelectedCustomer}
            selectedCustomerId={selectedCustomer?.id}
          />
        </div>

        {/* Customer Details Panel */}
        <div className="lg:col-span-1">
          <CustomerDetailsPanel customer={selectedCustomer}>
            {selectedCustomer && (
              <ImpersonateButton
                customer={selectedCustomer}
                destination={destination}
              />
            )}
          </CustomerDetailsPanel>
        </div>
      </div>

      {/* Pagination */}
      {filteredCustomers.length > 0 && (
        <div className="lg:col-span-2 lg:pr-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={filteredCustomers.length}
            pageSize={PAGE_SIZE}
          />
        </div>
      )}
      </main>
    </div>
  )
}

export default function ImpersonatePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    }>
      <ImpersonateContent />
    </Suspense>
  )
}
