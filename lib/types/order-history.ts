import { Timestamp } from "next/dist/server/lib/cache-handlers/types"
import { SiteGroup } from '@/lib/constants/siteGroups'
import { OrderItem } from './order-item'

export interface OrderHistoryItem {
  orderId: string
  orderNo: string
  planName: string
  billingAccountNo: string
  status: 'in_progress' | 'shipped' | 'cancelled' | 'approved'
  siteGroup: SiteGroup // Portal identifier (Single Site or Direct to Patient)
  customerId: string // Associated customer ID
  orderDate: Date
  orderTime?: Timestamp
  shippedDate?: Date
  shippedTime?: Timestamp
  kitId: string
  kitName: string
  quantity: number
  trackingId?: string
  location: string
  streetAddress?: string // Street address for Single Site orders
  fulfillmentDestination?: string // Fulfillment destination (Ditek-Windsor or DYAD-King of Prussia)
  orderItems?: OrderItem[] // Order items with asset information
  createdAt?: Date // Created timestamp
  updatedAt?: Date // Updated timestamp
}

export interface KitTypeOption {
  id: string
  name: string
}

export const KIT_TYPE_OPTIONS: KitTypeOption[] = [
  { id: 'KIT-ADX-001', name: 'Adx Kit' },
  { id: 'KIT-COLOFIT-001', name: 'Colofit Kit' },
  { id: 'KIT-UACR-001', name: 'uACR Kit' },
  { id: 'KIT-KIDNEY-001', name: 'Kidney health kit' }
]

// Helper function to get unique plan names from orders
export const getUniquePlanNames = (orders: OrderHistoryItem[]): string[] => {
  const uniqueNames = new Set(orders.map(order => order.planName))
  return Array.from(uniqueNames).sort()
}

export type DateRangePreset = 'last_30' | 'last_60' | 'last_90' | 'custom'

export interface OrderHistoryFilters {
  search?: string
  status?: 'all' | 'in_progress' | 'shipped' | 'cancelled' | 'approved'
  dateRange?: {
    from?: Date
    to?: Date
  }
  dateRangePreset?: DateRangePreset
  trackingId?: string
  kitType?: string
  orderNo?: string
  planName?: string
}

export interface OrderMetrics {
  totalOrders: number
  ordersShipped: number
  ordersCancelled: number
  ordersInProgress: number
  totalPlans: number
  ordersPlacedToday: number
}

export type SortField = 'orderDate' | 'shippedDate' | 'quantity' | 'orderNo' | 'planName'
export type SortDirection = 'asc' | 'desc'
