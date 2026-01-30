import { Customer, CustomerMetrics } from '@/lib/types/customer'

export const mockCustomers: Customer[] = [
  {
    id: '1',
    customerId: 'CUST-001',
    customerName: 'MedHealth Solutions Inc.',
    contactName: 'Dr. Sarah Mitchell',
    contactEmail: 'sarah.mitchell@medhealthsolutions.com',
    contactPhone: '(212) 555-0101',
    status: 'active',
    createdDate: new Date('2023-01-15'),
    lastModified: new Date('2025-01-20'),
  },
  {
    id: '2',
    customerId: 'CUST-002',
    customerName: 'WellCare Network Group',
    contactName: 'Michael Chen',
    contactEmail: 'mchen@wellcarenetwork.com',
    contactPhone: '(415) 555-0202',
    status: 'active',
    createdDate: new Date('2023-02-20'),
    lastModified: new Date('2025-01-18'),
  },
  {
    id: '3',
    customerId: 'CUST-003',
    customerName: 'Premier Health Systems',
    contactName: 'Jennifer Rodriguez',
    contactEmail: 'j.rodriguez@premierhealth.com',
    contactPhone: '(312) 555-0303',
    status: 'active',
    createdDate: new Date('2023-03-10'),
    lastModified: new Date('2025-01-22'),
  },
  {
    id: '4',
    customerId: 'CUST-004',
    customerName: 'Horizon Medical Partners',
    contactName: 'David Thompson',
    contactEmail: 'dthompson@horizonmedical.com',
    contactPhone: '(602) 555-0404',
    status: 'active',
    createdDate: new Date('2023-04-05'),
    lastModified: new Date('2025-01-15'),
  },
  {
    id: '5',
    customerId: 'CUST-005',
    customerName: 'Coastal Healthcare Alliance',
    contactName: 'Emily Washington',
    contactEmail: 'e.washington@coastalhealthcare.com',
    contactPhone: '(206) 555-0505',
    status: 'active',
    createdDate: new Date('2023-05-12'),
    lastModified: new Date('2025-01-25'),
  },
  {
    id: '6',
    customerId: 'CUST-006',
    customerName: 'Summit Care Corporation',
    contactName: 'Robert Anderson',
    contactEmail: 'r.anderson@summitcare.com',
    contactPhone: '(215) 555-0606',
    status: 'suspended',
    createdDate: new Date('2023-06-18'),
    lastModified: new Date('2024-07-22'),
  },
  {
    id: '7',
    customerId: 'CUST-007',
    customerName: 'Bay Area Health Services',
    contactName: 'Patricia Martinez',
    contactEmail: 'p.martinez@bayareahealth.com',
    contactPhone: '(619) 555-0707',
    status: 'active',
    createdDate: new Date('2023-07-22'),
    lastModified: new Date('2025-01-18'),
  },
  {
    id: '8',
    customerId: 'CUST-008',
    customerName: 'Northeast Medical Group',
    contactName: 'James Wilson',
    contactEmail: 'j.wilson@northeastmedical.com',
    contactPhone: '(702) 555-0808',
    status: 'active',
    createdDate: new Date('2023-08-30'),
    lastModified: new Date('2025-01-22'),
  },
  {
    id: '9',
    customerId: 'CUST-009',
    customerName: 'Pacific Wellness Centers',
    contactName: 'Laura Brown',
    contactEmail: 'l.brown@pacificwellness.com',
    contactPhone: '(512) 555-0909',
    status: 'active',
    createdDate: new Date('2023-09-14'),
    lastModified: new Date('2025-01-08'),
  },
  {
    id: '10',
    customerId: 'CUST-010',
    customerName: 'Heartland Health Network',
    contactName: 'Christopher Davis',
    contactEmail: 'c.davis@heartlandhealth.com',
    contactPhone: '(614) 555-1010',
    status: 'suspended',
    createdDate: new Date('2023-10-08'),
    lastModified: new Date('2024-10-20'),
  },
  {
    id: '11',
    customerId: 'CUST-011',
    customerName: 'Metro Health Associates',
    contactName: 'Amanda Garcia',
    contactEmail: 'a.garcia@metrohealth.com',
    contactPhone: '(317) 555-1111',
    status: 'active',
    createdDate: new Date('2023-11-16'),
    lastModified: new Date('2025-01-25'),
  },
  {
    id: '12',
    customerId: 'CUST-012',
    customerName: 'Regional Medical Partners',
    contactName: 'Steven Taylor',
    contactEmail: 's.taylor@regionalmedical.com',
    contactPhone: '(503) 555-1212',
    status: 'active',
    createdDate: new Date('2023-12-02'),
    lastModified: new Date('2025-01-20'),
  },
  {
    id: '13',
    customerId: 'CUST-013',
    customerName: 'Community Medical Services',
    contactName: 'Michelle Thomas',
    contactEmail: 'm.thomas@communitymedical.com',
    contactPhone: '(816) 555-1313',
    status: 'active',
    createdDate: new Date('2024-01-10'),
    lastModified: new Date('2025-01-20'),
  },
  {
    id: '14',
    customerId: 'CUST-014',
    customerName: 'Sunshine Health Providers',
    contactName: 'Daniel Moore',
    contactEmail: 'd.moore@sunshinehealth.com',
    contactPhone: '(412) 555-1414',
    status: 'pending',
    createdDate: new Date('2024-02-14'),
    lastModified: new Date('2025-01-15'),
  },
  {
    id: '15',
    customerId: 'CUST-015',
    customerName: 'United Care Solutions',
    contactName: 'Karen Jackson',
    contactEmail: 'k.jackson@unitedcare.com',
    contactPhone: '(414) 555-1515',
    status: 'pending',
    createdDate: new Date('2024-03-20'),
    lastModified: new Date('2025-01-28'),
  },
]

export function calculateCustomerMetrics(customers: Customer[]): CustomerMetrics {
  const totalCustomers = customers.length
  const pendingCustomers = customers.filter(c => c.status === 'pending').length
  const activeCustomers = customers.filter(c => c.status === 'active').length
  const suspendedCustomers = customers.filter(c => c.status === 'suspended').length

  return {
    totalCustomers,
    pendingCustomers,
    activeCustomers,
    suspendedCustomers,
  }
}

// Helper function to find customer by ID
export function findCustomerById(id: string): Customer | undefined {
  return mockCustomers.find(customer => customer.id === id || customer.customerId === id)
}

// Helper function to filter customers
export function filterCustomers(
  customers: Customer[],
  searchQuery?: string,
  statusFilter?: 'active' | 'suspended' | 'pending'
): Customer[] {
  let filtered = [...customers]

  // Apply search filter
  if (searchQuery && searchQuery.trim() !== '') {
    const query = searchQuery.toLowerCase().trim()
    filtered = filtered.filter(
      customer =>
        customer.customerName.toLowerCase().includes(query) ||
        customer.customerId.toLowerCase().includes(query) ||
        customer.contactName.toLowerCase().includes(query)
    )
  }

  // Apply status filter
  if (statusFilter) {
    filtered = filtered.filter(customer => customer.status === statusFilter)
  }

  return filtered
}
