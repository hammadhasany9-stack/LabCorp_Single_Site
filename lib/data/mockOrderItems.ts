import { OrderItem } from '@/lib/types/order-item'

// SOW and Product Type options (matching the existing order system)
const SOW_OPTIONS = [
  { value: '1', label: 'IFOBT' },
  { value: '2', label: 'A1c Whatman' },
  { value: '3', label: 'Albumin Urine' },
  { value: '4', label: 'AdvanceDx Serum' },
]

const PRODUCT_TYPE_OPTIONS = [
  { value: '1', label: 'Employer' },
  { value: '2', label: 'Managed Care' },
  { value: '3', label: 'VBC' },
]

// Helper to generate tracking number (deterministic based on seed)
const generateTrackingNumber = (seed: string, type: 'outbound' | 'inbound'): string => {
  // Create hash from seed and type for determinism
  const hashInput = `${seed}-${type}`
  const hash = hashInput.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const prefix = (hash % 2 === 0) ? '1Z' : '9400'
  // Generate deterministic numbers based on hash
  const numbers = String(hash * 999999999999).substring(0, 16).padEnd(16, '0')
  return `${prefix}${numbers}`
}

// Helper to generate asset path (URL)
const generateAssetPath = (type: string, itemId: string): string => {
  return `/assets/orders/${type}/${itemId}_${type}.pdf`
}

// Helper to generate asset PDF path
const generateAssetPdf = (type: string, itemId: string): string => {
  return `/assets/orders/pdf/${type}/${itemId}_${type}.pdf`
}

// Helper to generate file number based on order ID (consistent per order)
const generateFileNumber = (orderId: string): string => {
  const hash = orderId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  return `${12000 + (hash % 100)}`
}

// Helper to get SOW and product type based on order ID (consistent per order)
const getOrderMetadata = (orderId: string) => {
  const hash = orderId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
  const sow = SOW_OPTIONS[hash % SOW_OPTIONS.length]
  const productType = PRODUCT_TYPE_OPTIONS[(hash + 1) % PRODUCT_TYPE_OPTIONS.length]
  return { sow, productType }
}

// Generate order items for an order (count should match order quantity)
export function generateMockOrderItems(
  orderId: string, 
  count: number, 
  orderStatus: 'approved' | 'in_progress' | 'shipped' | 'cancelled',
  parentCreatedAt?: Date,
  parentUpdatedAt?: Date
): OrderItem[] {
  const items: OrderItem[] = []
  
  // Generate consistent metadata for this order
  const fileNumber = generateFileNumber(orderId)
  const { sow, productType } = getOrderMetadata(orderId)
  const itemCount = count
  
  // Map order status to item status (only approved or inprocess)
  const itemStatus: 'approved' | 'inprocess' = 
    orderStatus === 'approved' ? 'approved' : 'inprocess'
  
  // Use parent timestamps or create defaults
  const createdDate = parentCreatedAt || new Date()
  const updatedDate = parentUpdatedAt || new Date()
  
  for (let i = 0; i < itemCount; i++) {
    const itemId = `ITM-${orderId.split('-')[1]}-${String(i + 1).padStart(3, '0')}`
    // Control ID format: {fileNumber}-{sowNumber}-{productType}-{sequenceNumber}
    const controlId = `${fileNumber}-${sow.value}-${productType.value}-${String(i + 1).padStart(2, '0')}`
    
    // Determine if assets are generated - deterministic based on itemId hash
    // Most items have assets (90% for approved, 60% for in_progress)
    const itemHash = itemId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const randomValue = (itemHash % 100) / 100 // Creates a value between 0 and 0.99
    const hasAllAssets = 
      itemStatus === 'approved' ? randomValue > 0.1 : randomValue > 0.4
    
    // If path exists, PDF must also exist (they go together)
    const item: OrderItem = {
      itemId,
      controlId,
      trfPath: hasAllAssets ? generateAssetPath('trf', itemId) : null,
      // Path and PDF always together
      shippingLabelPath: hasAllAssets ? generateAssetPath('shipping_label', itemId) : null,
      shippingLabelPdf: hasAllAssets ? generateAssetPdf('shipping_label', itemId) : null,
      // Path and PDF always together
      returnLabelPath: hasAllAssets ? generateAssetPath('return_label', itemId) : null,
      returnLabelPdf: hasAllAssets ? generateAssetPdf('return_label', itemId) : null,
      stickerPath: hasAllAssets ? generateAssetPath('sticker', itemId) : null,
      // ALL items always have tracking numbers (required, deterministic)
      outboundTrackingNo: generateTrackingNumber(itemId, 'outbound'),
      inboundTrackingNo: generateTrackingNumber(itemId, 'inbound'),
      // ALL items have the same status (approved or inprocess)
      status: itemStatus,
      // All order items inherit the exact same timestamps from parent order
      createdAt: createdDate,
      updatedAt: updatedDate,
    }
    
    items.push(item)
  }
  
  return items
}

// Generate order items for all orders in a list
export function addOrderItemsToOrders<T extends { 
  orderId: string; 
  quantity: number; 
  status: 'approved' | 'in_progress' | 'shipped' | 'cancelled';
  createdAt?: Date;
  updatedAt?: Date;
}>(orders: T[]): T[] {
  return orders.map(order => ({
    ...order,
    orderItems: generateMockOrderItems(
      order.orderId, 
      order.quantity, 
      order.status,
      order.createdAt,
      order.updatedAt
    )
  }))
}
