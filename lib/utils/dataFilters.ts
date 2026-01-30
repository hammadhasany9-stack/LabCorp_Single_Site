import { Site } from '@/lib/types/sites'
import { OrderHistoryItem } from '@/lib/types/order-history'
import { OrderDetail } from '@/lib/types/order-detail'

/**
 * Filter sites by customer ID
 * If customerId is null (admin viewing as admin), return all sites
 * Otherwise, filter to only sites belonging to that customer
 */
export const filterSitesByCustomer = (sites: Site[], customerId: string | null): Site[] => {
  if (!customerId) return sites // Admin sees all
  return sites.filter(site => site.customerId === customerId)
}

/**
 * Filter orders by customer ID
 * If customerId is null (admin viewing as admin), return all orders
 * Otherwise, filter to only orders belonging to that customer
 */
export const filterOrdersByCustomer = (orders: OrderHistoryItem[], customerId: string | null): OrderHistoryItem[] => {
  if (!customerId) return orders // Admin sees all
  return orders.filter(order => order.customerId === customerId)
}

/**
 * Verify site ownership
 * Returns true if user can access this site
 * Admins can access all sites, customers can only access their own
 */
export const verifySiteOwnership = (site: Site, customerId: string | null): boolean => {
  if (!customerId) return true // Admin can access all
  return site.customerId === customerId
}

/**
 * Verify order ownership
 * Returns true if user can access this order
 * Admins can access all orders, customers can only access their own
 */
export const verifyOrderOwnership = (order: OrderDetail, customerId: string | null): boolean => {
  if (!customerId) return true // Admin can access all
  return order.customerId === customerId
}

/**
 * Get customer context for new entities
 * Returns the customer ID to associate with new sites/orders
 * Throws error if no customer context available
 */
export const getCustomerContextForNewEntity = (customerId: string | null): string => {
  if (!customerId) {
    throw new Error('Customer context required to create new entities')
  }
  return customerId
}
