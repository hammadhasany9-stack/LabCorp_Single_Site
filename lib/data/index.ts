import { OrderHistoryItem } from '@/lib/types/order-history'
import { Site } from '@/lib/types/sites'
import { OrderDetail } from '@/lib/types/order-detail'
import { SITE_GROUPS } from '@/lib/constants/siteGroups'

// Import Single Site data
import { mockOrderHistory, mockOrderDetails } from './mockOrderHistory'
import { mockSites } from './mockSites'

// Import Direct to Patient data
import { mockOrderHistoryDTP, mockOrderDetailsDTP } from './mockOrderHistoryDTP'
import { mockSitesDTP } from './mockSitesDTP'

/**
 * Get all orders from both portals (Single Site and Direct to Patient)
 */
export const getAllOrders = (): OrderHistoryItem[] => {
  return [...mockOrderHistory, ...mockOrderHistoryDTP]
}

/**
 * Get all sites from both portals (Single Site and Direct to Patient)
 */
export const getAllSites = (): Site[] => {
  return [...mockSites, ...mockSitesDTP]
}

/**
 * Get all order details from both portals
 */
export const getAllOrderDetails = (): OrderDetail[] => {
  return [...mockOrderDetails, ...mockOrderDetailsDTP]
}

/**
 * Get orders filtered by site group
 * @param siteGroup - The site group to filter by ('Single Site' or 'Direct to Patient')
 */
export const getOrdersBySiteGroup = (siteGroup: string): OrderHistoryItem[] => {
  if (siteGroup === SITE_GROUPS.DIRECT_TO_PATIENT) {
    return mockOrderHistoryDTP
  }
  return mockOrderHistory
}

/**
 * Get sites filtered by site group
 * @param siteGroup - The site group to filter by ('Single Site' or 'Direct to Patient')
 */
export const getSitesBySiteGroup = (siteGroup: string): Site[] => {
  if (siteGroup === SITE_GROUPS.DIRECT_TO_PATIENT) {
    return mockSitesDTP
  }
  return mockSites
}

/**
 * Get order details by site group
 * @param siteGroup - The site group to filter by ('Single Site' or 'Direct to Patient')
 */
export const getOrderDetailsBySiteGroup = (siteGroup: string): OrderDetail[] => {
  if (siteGroup === SITE_GROUPS.DIRECT_TO_PATIENT) {
    return mockOrderDetailsDTP
  }
  return mockOrderDetails
}

/**
 * Get a specific order detail by order ID (searches across all portals)
 * @param orderId - The order ID to search for
 * If full order details don't exist, generates basic details from order history
 */
export const getOrderDetailById = (orderId: string): OrderDetail | undefined => {
  // First, try to get the full order details
  const allDetails = getAllOrderDetails()
  const foundDetail = allDetails.find(order => order.orderId === orderId)
  
  if (foundDetail) {
    return foundDetail
  }
  
  // If not found, generate basic order detail from order history
  const allOrders = getAllOrders()
  const orderHistory = allOrders.find(order => order.orderId === orderId)
  
  if (!orderHistory) {
    return undefined
  }
  
  // Generate basic order detail from order history item
  const basicOrderDetail: OrderDetail = {
    orderId: orderHistory.orderId,
    orderNo: orderHistory.orderNo,
    status: orderHistory.status,
    siteGroup: orderHistory.siteGroup,
    customerId: orderHistory.customerId,
    orderDate: orderHistory.orderDate,
    dateApproved: orderHistory.status === 'approved' || orderHistory.status === 'shipped' ? orderHistory.orderDate : undefined,
    shippedDate: orderHistory.shippedDate,
    
    // Client Details
    planName: orderHistory.planName,
    planAddress: '123 Healthcare Ave',
    planCity: orderHistory.location.split(', ')[0],
    planState: orderHistory.location.split(', ')[1] || '',
    planZip: '00000',
    billingAccountNo: orderHistory.billingAccountNo,
    
    // Contact Info
    contactName: 'Contact Person',
    contactPhone: '(000) 000-0000',
    contactAddress: orderHistory.streetAddress || '123 Healthcare Ave',
    specialInstructions: undefined,
    
    // Kit Details
    kitId: orderHistory.kitId,
    kitName: orderHistory.kitName,
    kitSku: `SKU-${orderHistory.kitId}`,
    kitPackaging: 'Standard Box',
    quantity: orderHistory.quantity,
    kitInstructions: undefined,
    trfTemplate: undefined,
    letterPrint: true,
    
    // Order Details
    kitNumber: `KN-${orderHistory.orderId}`,
    labTicket: `LT-${orderHistory.orderId}`,
    orderNotes: undefined,
    
    // Lab Address
    labAddress: '1447 York Court',
    labCity: 'Burlington',
    labState: 'NC',
    labZip: '27215',
    
    // Return Address
    returnAttn: 'LabCorp Receiving Department',
    returnAddress: '531 South Spring Street',
    returnCity: 'Burlington',
    returnState: 'NC',
    returnZip: '27215',
    
    // Fulfillment & Tracking
    outboundCarrier: 'FedEx',
    outboundTrackingId: orderHistory.shippedDate ? '1Z999AA10123456784' : undefined,
    outboundTrackingIds: orderHistory.shippedDate ? ['1Z999AA10123456784'] : undefined,
    inboundCarrier: 'USPS',
    
    // Custom Requisitions - generate basic ones
    customRequisitions: Array.from({ length: orderHistory.quantity }, (_, i) => ({
      controlId: `${orderHistory.orderId}-${String(i + 1).padStart(3, '0')}`,
      inboundTrackingId: `9${Math.floor(Math.random() * 9000000000000000 + 1000000000000000)}`,
      carrierType: 'USPS',
      currentStatus: 'label_created' as const,
      trackingSteps: [
        {
          status: 'label_created' as const,
          timestamp: orderHistory.orderDate
        }
      ]
    })),
    
    // Location
    location: orderHistory.location,
    fulfillmentDestination: orderHistory.fulfillmentDestination
  }
  
  return basicOrderDetail
}

/**
 * Get orders filtered by customer ID and optionally by site group
 * @param customerId - The customer ID to filter by
 * @param siteGroup - Optional site group to filter by
 */
export const getOrdersByCustomerId = (
  customerId: string,
  siteGroup?: string
): OrderHistoryItem[] => {
  let orders = getAllOrders()
  
  // Filter by customer ID
  orders = orders.filter(order => order.customerId === customerId)
  
  // Optionally filter by site group
  if (siteGroup) {
    orders = orders.filter(order => order.siteGroup === siteGroup)
  }
  
  return orders
}

/**
 * Get sites filtered by customer ID and optionally by site group
 * @param customerId - The customer ID to filter by
 * @param siteGroup - Optional site group to filter by
 */
export const getSitesByCustomerId = (
  customerId: string,
  siteGroup?: string
): Site[] => {
  let sites = getAllSites()
  
  // Filter by customer ID
  sites = sites.filter(site => site.customerId === customerId)
  
  // Optionally filter by site group
  if (siteGroup) {
    sites = sites.filter(site => site.siteGroup === siteGroup)
  }
  
  return sites
}

// Re-export individual data sources for backward compatibility
export { mockOrderHistory, mockOrderDetails } from './mockOrderHistory'
export { mockSites } from './mockSites'
export { mockOrderHistoryDTP, mockOrderDetailsDTP } from './mockOrderHistoryDTP'
export { mockSitesDTP } from './mockSitesDTP'
