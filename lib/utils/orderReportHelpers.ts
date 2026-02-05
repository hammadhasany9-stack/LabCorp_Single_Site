import { OrderHistoryItem } from '@/lib/types/order-history'
import { OrderReportMetrics } from '@/lib/types/order-report'
import { ProgramTab } from '@/lib/types/unified-dashboard'
import { filterOrdersByProgram } from './unifiedDashboardHelpers'

/**
 * Calculate order report metrics from orders
 * Includes all orders (shipped, cancelled, etc.) for metrics
 */
export const calculateOrderReportMetrics = (
  orders: OrderHistoryItem[],
  programFilter?: ProgramTab
): OrderReportMetrics => {
  // Apply program filter if provided
  let filteredOrders = orders
  if (programFilter) {
    filteredOrders = filterOrdersByProgram(orders, programFilter)
  }

  // Calculate approved total (includes all approved orders regardless of shipped status)
  const approvedTotal = filteredOrders.filter(order => order.status === 'approved').length

  // Calculate orders approved today
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const approvedToday = filteredOrders.filter(order => {
    if (order.status !== 'approved') return false
    const orderDate = new Date(order.orderDate)
    orderDate.setHours(0, 0, 0, 0)
    return orderDate.getTime() === today.getTime()
  }).length

  // Calculate cancelled total
  const cancelledTotal = filteredOrders.filter(order => order.status === 'cancelled').length

  // Calculate shipped total
  const shippedTotal = filteredOrders.filter(order => order.status === 'shipped').length

  return {
    approvedTotal,
    approvedToday,
    cancelledTotal,
    shippedTotal
  }
}

/**
 * Filter orders to show only approved and in_progress
 * This is used for the table display (excludes shipped and cancelled)
 */
export const filterApprovedAndInProgress = (orders: OrderHistoryItem[]): OrderHistoryItem[] => {
  return orders.filter(order => 
    order.status === 'approved' || order.status === 'in_progress'
  )
}

/**
 * Filter orders approved today
 */
export const filterApprovedToday = (orders: OrderHistoryItem[]): OrderHistoryItem[] => {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  
  return orders.filter(order => {
    if (order.status !== 'approved') return false
    const orderDate = new Date(order.orderDate)
    orderDate.setHours(0, 0, 0, 0)
    return orderDate.getTime() === today.getTime()
  })
}

/**
 * Filter orders by approved status only
 */
export const filterApprovedOnly = (orders: OrderHistoryItem[]): OrderHistoryItem[] => {
  return orders.filter(order => order.status === 'approved')
}

/**
 * Cancel an order (updates status to 'cancelled')
 * In a real app, this would be an API call
 */
export const cancelOrder = (orderId: string, orders: OrderHistoryItem[]): OrderHistoryItem[] => {
  return orders.map(order => 
    order.orderId === orderId 
      ? { ...order, status: 'cancelled' as const }
      : order
  )
}

/**
 * Refund an order (same as cancel - updates status to 'cancelled')
 * In a real app, this would be an API call
 */
export const refundOrder = (orderId: string, orders: OrderHistoryItem[]): OrderHistoryItem[] => {
  return orders.map(order => 
    order.orderId === orderId 
      ? { ...order, status: 'cancelled' as const }
      : order
  )
}
