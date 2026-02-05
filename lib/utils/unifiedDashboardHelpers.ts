import { OrderHistoryItem } from '@/lib/types/order-history'
import { ProgramTab, UnifiedDashboardMetrics } from '@/lib/types/unified-dashboard'
import { StatusFilter } from '@/components/order-history/StatusTabs'
import { SITE_GROUPS } from '@/lib/constants/siteGroups'
import { exportToCSV } from './orderHelpers'

/**
 * Calculate unified dashboard metrics from orders
 */
export const calculateUnifiedMetrics = (
  orders: OrderHistoryItem[],
  programFilter?: ProgramTab,
  statusFilter?: StatusFilter
): UnifiedDashboardMetrics => {
  // Apply program filter if provided
  let filteredOrders = orders
  if (programFilter) {
    filteredOrders = filterOrdersByProgram(orders, programFilter)
  }
  
  // Apply status filter if provided
  if (statusFilter && statusFilter !== 'all') {
    filteredOrders = filterOrdersByUnifiedStatus(filteredOrders, statusFilter)
  }
  
  const totalOrders = filteredOrders.length
  const inProgress = filteredOrders.filter(order => order.status === 'in_progress').length
  const approved = filteredOrders.filter(order => order.status === 'approved').length
  const shipped = filteredOrders.filter(order => order.status === 'shipped').length
  const cancelled = filteredOrders.filter(order => order.status === 'cancelled').length
  
  // "Open" includes in_progress orders
  const open = inProgress
  
  // "Ready for Approval" - for now, we'll use 0 as it's not a distinct status in our system
  const readyForApproval = 0
  
  // Orders placed today
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayOrders = filteredOrders.filter(order => {
    const orderDate = new Date(order.orderDate)
    orderDate.setHours(0, 0, 0, 0)
    return orderDate.getTime() === today.getTime()
  }).length
  
  // Program breakdown (always calculated from all orders, not filtered)
  const singleSiteCount = orders.filter(order => order.siteGroup === SITE_GROUPS.SINGLE_SITE).length
  const directToPatientCount = orders.filter(order => order.siteGroup === SITE_GROUPS.DIRECT_TO_PATIENT).length
  
  return {
    totalOrders,
    open,
    readyForApproval,
    approved,
    shipped,
    cancelled,
    todayOrders,
    singleSiteCount,
    directToPatientCount
  }
}

/**
 * Filter orders by program tab
 */
export const filterOrdersByProgram = (
  orders: OrderHistoryItem[],
  program: ProgramTab
): OrderHistoryItem[] => {
  const siteGroup = program === 'single-site' 
    ? SITE_GROUPS.SINGLE_SITE 
    : SITE_GROUPS.DIRECT_TO_PATIENT
  return orders.filter(order => order.siteGroup === siteGroup)
}

/**
 * Filter orders by unified status
 */
export const filterOrdersByUnifiedStatus = (
  orders: OrderHistoryItem[],
  status: StatusFilter
): OrderHistoryItem[] => {
  if (status === 'all') return orders
  return orders.filter(order => order.status === status)
}

/**
 * Export selected or all orders to CSV
 */
export const exportSelectedOrders = (
  orders: OrderHistoryItem[],
  selectedIds: string[]
): void => {
  const ordersToExport = selectedIds.length > 0 
    ? orders.filter(o => selectedIds.includes(o.orderId))
    : orders
  exportToCSV(ordersToExport)
}

/**
 * Calculate status counts for the status tabs
 */
export const calculateStatusCounts = (orders: OrderHistoryItem[]) => {
  return {
    all: orders.length,
    approved: orders.filter(order => order.status === 'approved').length,
    in_progress: orders.filter(order => order.status === 'in_progress').length,
    shipped: orders.filter(order => order.status === 'shipped').length,
    cancelled: orders.filter(order => order.status === 'cancelled').length,
  }
}
