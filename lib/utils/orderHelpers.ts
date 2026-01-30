import { format } from 'date-fns'
import { TZDate } from '@date-fns/tz'
import { OrderHistoryItem, OrderHistoryFilters, SortField, SortDirection } from '@/lib/types/order-history'

export const formatOrderDate = (date: Date): string => {
  return format(date, 'MMM dd, yyyy HH:mm')
}

export const formatOrderDateOnly = (date: Date): string => {
  const etDate = new TZDate(date, 'America/New_York')
  return format(etDate, 'MMM dd, yyyy')
}

export const formatOrderTimeOnly = (date: Date): string => {
  const etDate = new TZDate(date, 'America/New_York')
  return format(etDate, 'hh:mm a')
}

export const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' => {
  switch (status) {
    case 'shipped':
      return 'default'
    case 'in_progress':
      return 'secondary'
    case 'cancelled':
      return 'destructive'
    default:
      return 'secondary'
  }
}

export const getStatusLabel = (status: string): string => {
  switch (status) {
    case 'in_progress':
      return 'In Progress'
    case 'shipped':
      return 'Shipped'
    case 'cancelled':
      return 'Cancelled'
    default:
      return status
  }
}

export const filterOrders = (
  orders: OrderHistoryItem[],
  filters: OrderHistoryFilters
): OrderHistoryItem[] => {
  let filtered = [...orders]

  // Filter by status
  if (filters.status && filters.status !== 'all') {
    filtered = filtered.filter(order => order.status === filters.status)
  }

  // Filter by search query (searches across multiple fields)
  if (filters.search) {
    const searchLower = filters.search.toLowerCase()
    filtered = filtered.filter(order =>
      order.orderNo.toLowerCase().includes(searchLower) ||
      order.orderId.toLowerCase().includes(searchLower) ||
      order.planName.toLowerCase().includes(searchLower) ||
      order.kitName.toLowerCase().includes(searchLower) ||
      order.kitId.toLowerCase().includes(searchLower) ||
      order.billingAccountNo.toLowerCase().includes(searchLower) ||
      order.location.toLowerCase().includes(searchLower) ||
      (order.trackingId && order.trackingId.toLowerCase().includes(searchLower))
    )
  }

  // Filter by tracking ID
  if (filters.trackingId) {
    const trackingLower = filters.trackingId.toLowerCase()
    filtered = filtered.filter(order =>
      order.trackingId && order.trackingId.toLowerCase().includes(trackingLower)
    )
  }

  // Filter by kit type
  if (filters.kitType) {
    filtered = filtered.filter(order =>
      order.kitName === filters.kitType
    )
  }

  // Filter by order number
  if (filters.orderNo) {
    const orderNoLower = filters.orderNo.toLowerCase()
    filtered = filtered.filter(order =>
      order.orderNo.toLowerCase().includes(orderNoLower) ||
      order.orderId.toLowerCase().includes(orderNoLower)
    )
  }

  // Filter by date range
  if (filters.dateRange) {
    const { from, to } = filters.dateRange
    if (from) {
      filtered = filtered.filter(order => 
        order.orderDate >= from
      )
    }
    if (to) {
      filtered = filtered.filter(order => 
        order.orderDate <= to
      )
    }
  }

  return filtered
}

export const sortOrders = (
  orders: OrderHistoryItem[],
  field: SortField,
  direction: SortDirection
): OrderHistoryItem[] => {
  const sorted = [...orders]

  sorted.sort((a, b) => {
    let aValue: any
    let bValue: any

    switch (field) {
      case 'orderDate':
        aValue = a.orderDate.getTime()
        bValue = b.orderDate.getTime()
        break
      case 'shippedDate':
        aValue = a.shippedDate?.getTime() || 0
        bValue = b.shippedDate?.getTime() || 0
        break
      case 'quantity':
        aValue = a.quantity
        bValue = b.quantity
        break
      case 'orderNo':
        aValue = a.orderNo
        bValue = b.orderNo
        break
      case 'planName':
        aValue = a.planName
        bValue = b.planName
        break
      default:
        return 0
    }

    if (aValue < bValue) return direction === 'asc' ? -1 : 1
    if (aValue > bValue) return direction === 'asc' ? 1 : -1
    return 0
  })

  return sorted
}

export const exportToCSV = (orders: OrderHistoryItem[]): void => {
  // Create CSV header
  const headers = [
    'Order ID',
    'Order No',
    'Plan Name',
    'Billing Account No',
    'Status',
    'Order Date',
    'Shipped Date',
    'Kit ID',
    'Kit Name',
    'Quantity',
    'Tracking ID',
    'Location'
  ]

  // Create CSV rows
  const rows = orders.map(order => [
    order.orderId,
    order.orderNo,
    order.planName,
    order.billingAccountNo,
    getStatusLabel(order.status),
    formatOrderDate(order.orderDate),
    order.shippedDate ? formatOrderDate(order.shippedDate) : 'N/A',
    order.kitId,
    order.kitName,
    order.quantity.toString(),
    order.trackingId || 'N/A',
    order.location
  ])

  // Combine header and rows
  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  // Create blob and download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `order-history-${format(new Date(), 'yyyy-MM-dd')}.csv`)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export const paginateOrders = (
  orders: OrderHistoryItem[],
  page: number,
  pageSize: number
): { orders: OrderHistoryItem[], totalPages: number } => {
  const startIndex = (page - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedOrders = orders.slice(startIndex, endIndex)
  const totalPages = Math.ceil(orders.length / pageSize)

  return {
    orders: paginatedOrders,
    totalPages
  }
}
