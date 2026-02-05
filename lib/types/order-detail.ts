export type TrackingStatus = 'label_created' | 'in_transit' | 'out_for_delivery' | 'delivered'

export interface TrackingStep {
  status: TrackingStatus
  timestamp?: Date
}

export interface CustomRequisition {
  controlId: string
  inboundTrackingId: string
  outboundTrackingId?: string  // Individual outbound tracking per patient
  carrierType?: string
  currentStatus?: TrackingStatus
  trackingSteps?: TrackingStep[]
  // Patient information (Direct to Patient)
  patientName?: string
  patientDOB?: Date
  patientAddress?: string
  patientCity?: string
  patientState?: string
  patientZip?: string
  // Custom requisition fields from place order form
  fileNumber?: string
  sowNumber?: string
  sowLabel?: string
  productType?: string
  productTypeLabel?: string
}

import { SiteGroup } from '@/lib/constants/siteGroups'

export interface OrderDetail {
  // Basic Order Info
  orderId: string
  orderNo: string
  status: 'in_progress' | 'shipped' | 'cancelled' | 'approved'
  siteGroup: SiteGroup // Portal identifier (Single Site or Direct to Patient)
  customerId: string // Associated customer ID
  orderDate: Date
  dateApproved?: Date
  shippedDate?: Date
  
  // Client Details
  planName: string
  planAddress: string
  planCity: string
  planState: string
  planZip: string
  billingAccountNo: string
  
  // ATTN / Contact Info
  contactName: string
  contactPhone: string
  contactAddress?: string
  specialInstructions?: string
  
  // Kit Details
  kitId: string
  kitName: string
  kitSku: string
  kitPackaging: string
  quantity: number
  kitInstructions?: string
  trfTemplate?: string
  letterPrint: boolean
  
  // Order Details
  kitNumber: string
  labTicket: string
  orderNotes?: string
  
  // Lab Address
  labAddress: string
  labCity: string
  labState: string
  labZip: string
  
  // Return Address
  returnAttn: string
  returnAddress: string
  returnCity: string
  returnState: string
  returnZip: string
  
  // Fulfillment & Tracking
  outboundCarrier: string
  outboundTrackingId?: string
  outboundTrackingIds?: string[] // Multiple tracking numbers for outbound shipment
  inboundCarrier: string
  
  // Custom Requisitions
  customRequisitions: CustomRequisition[]
  
  // Custom Requisition Settings (from place order form)
  fileNumber?: string
  sowNumber?: string
  sowLabel?: string
  productType?: string
  productTypeLabel?: string
  
  // Location
  location: string
}

export function getOrderDetailById(orderId: string): OrderDetail | undefined {
  // This will be imported from mockOrderHistory after we create the mock data
  return undefined
}
