export interface Customer {
  id: string
  customerId: string // e.g., "CUST-001"
  customerName: string
  contactName: string
  contactEmail: string
  contactPhone: string
  status: 'active' | 'suspended' | 'pending'
  createdDate: Date
  lastModified: Date
}

export interface CustomerMetrics {
  totalCustomers: number
  pendingCustomers: number
  activeCustomers: number
  suspendedCustomers: number
}

export interface CustomerFilters {
  search?: string
  status?: 'active' | 'suspended' | 'pending'
}

export type CustomerSortField = 'customerName' | 'customerId' | 'contactName' | 'status'
export type CustomerSortDirection = 'asc' | 'desc'
