import { Site } from '@/lib/types/sites'
import { OrderHistoryItem } from '@/lib/types/order-history'
import { OrderDetail } from '@/lib/types/order-detail'
import { SiteGroup } from '@/lib/constants/siteGroups'

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

/**
 * Filter orders by site group
 * Returns only orders that belong to the specified site group
 */
export const filterOrdersBySiteGroup = (orders: OrderHistoryItem[], siteGroup: SiteGroup): OrderHistoryItem[] => {
  return orders.filter(order => order.siteGroup === siteGroup)
}

/**
 * Filter sites by site group
 * Returns only sites that belong to the specified site group
 */
export const filterSitesBySiteGroup = (sites: Site[], siteGroup: SiteGroup): Site[] => {
  return sites.filter(site => site.siteGroup === siteGroup)
}

/**
 * Filter orders by both customer and site group
 * Combines customer filtering (for impersonation) with site group filtering (for portal isolation)
 */
export const filterOrdersByCustomerAndSiteGroup = (
  orders: OrderHistoryItem[],
  customerId: string | null,
  siteGroup: SiteGroup
): OrderHistoryItem[] => {
  // First filter by customer (if applicable)
  const customerFiltered = filterOrdersByCustomer(orders, customerId)
  // Then filter by site group
  return filterOrdersBySiteGroup(customerFiltered, siteGroup)
}

/**
 * Filter sites by both customer and site group
 * Combines customer filtering (for impersonation) with site group filtering (for portal isolation)
 */
export const filterSitesByCustomerAndSiteGroup = (
  sites: Site[],
  customerId: string | null,
  siteGroup: SiteGroup
): Site[] => {
  // First filter by customer (if applicable)
  const customerFiltered = filterSitesByCustomer(sites, customerId)
  // Then filter by site group
  return filterSitesBySiteGroup(customerFiltered, siteGroup)
}

/**
 * Verify order belongs to correct site group
 * Returns true if order belongs to the specified site group
 */
export const verifyOrderSiteGroup = (order: OrderDetail | OrderHistoryItem, siteGroup: SiteGroup): boolean => {
  return order.siteGroup === siteGroup
}

/**
 * Verify site belongs to correct site group
 * Returns true if site belongs to the specified site group
 */
export const verifySiteSiteGroup = (site: Site, siteGroup: SiteGroup): boolean => {
  return site.siteGroup === siteGroup
}
