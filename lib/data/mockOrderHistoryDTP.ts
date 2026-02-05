import { OrderHistoryItem, OrderMetrics } from '@/lib/types/order-history'
import { SITE_GROUPS } from '@/lib/constants/siteGroups'
import { OrderDetail, CustomRequisition, TrackingStatus, TrackingStep } from '@/lib/types/order-detail'
import { addOrderItemsToOrders } from './mockOrderItems'

// SOW and Product Type mappings
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

// Helper function to generate tracking steps based on status
const generateTrackingSteps = (currentStatus: TrackingStatus, baseDate: Date): TrackingStep[] => {
  const steps: TrackingStep[] = []
  const statuses: TrackingStatus[] = ['label_created', 'in_transit', 'out_for_delivery', 'delivered']
  const currentIndex = statuses.indexOf(currentStatus)
  
  for (let i = 0; i <= currentIndex; i++) {
    // Add hours to the base date for each step
    const stepDate = new Date(baseDate)
    stepDate.setHours(stepDate.getHours() + (i * 12)) // 12 hours between each step
    
    steps.push({
      status: statuses[i],
      timestamp: stepDate
    })
  }
  
  return steps
}

// Helper function to generate random tracking status
const getRandomTrackingStatus = (): TrackingStatus => {
  const statuses: TrackingStatus[] = ['label_created', 'in_transit', 'out_for_delivery', 'delivered']
  return statuses[Math.floor(Math.random() * statuses.length)]
}

// Helper function to get random SOW
const getRandomSOW = () => {
  return SOW_OPTIONS[Math.floor(Math.random() * SOW_OPTIONS.length)]
}

// Helper function to get random Product Type
const getRandomProductType = () => {
  return PRODUCT_TYPE_OPTIONS[Math.floor(Math.random() * PRODUCT_TYPE_OPTIONS.length)]
}

// Mock patient data
const FIRST_NAMES = ['John', 'Jane', 'Michael', 'Sarah', 'David', 'Emily', 'Robert', 'Lisa', 'William', 'Mary', 'James', 'Patricia', 'Christopher', 'Jennifer', 'Daniel', 'Linda', 'Matthew', 'Elizabeth', 'Thomas', 'Barbara']
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin']
const STREETS = ['Main St', 'Oak Ave', 'Maple Dr', 'Cedar Ln', 'Pine Rd', 'Elm St', 'Washington Blvd', 'Park Ave', 'Lake Dr', 'Hill Rd']
const CITIES = [
  { name: 'San Francisco', state: 'CA', zip: '94102' },
  { name: 'Houston', state: 'TX', zip: '77002' },
  { name: 'Orlando', state: 'FL', zip: '32801' },
  { name: 'Phoenix', state: 'AZ', zip: '85001' },
  { name: 'Seattle', state: 'WA', zip: '98101' },
  { name: 'Denver', state: 'CO', zip: '80202' },
  { name: 'Portland', state: 'OR', zip: '97201' },
  { name: 'Atlanta', state: 'GA', zip: '30301' },
  { name: 'Minneapolis', state: 'MN', zip: '55401' },
  { name: 'San Diego', state: 'CA', zip: '92101' },
  { name: 'Austin', state: 'TX', zip: '78701' },
  { name: 'Tampa', state: 'FL', zip: '33602' }
]

// Helper function to generate mock patient data
const generateMockPatient = (index: number) => {
  const firstName = FIRST_NAMES[index % FIRST_NAMES.length]
  const lastName = LAST_NAMES[Math.floor(index / FIRST_NAMES.length) % LAST_NAMES.length]
  const streetNumber = 100 + (index * 7) % 900
  const street = STREETS[index % STREETS.length]
  const city = CITIES[index % CITIES.length]
  
  // Generate random DOB between 1950 and 2000
  const birthYear = 1950 + (index % 50)
  const birthMonth = (index % 12)
  const birthDay = 1 + (index % 28)
  
  return {
    patientName: `${firstName} ${lastName}`,
    patientDOB: new Date(birthYear, birthMonth, birthDay),
    patientAddress: `${streetNumber} ${street}`,
    patientCity: city.name,
    patientState: city.state,
    patientZip: city.zip
  }
}

// Helper function to generate custom requisitions based on quantity
const generateCustomRequisitions = (
  orderId: string,
  quantity: number,
  orderDate: Date,
  fileNumber: string,
  sowNumber: string,
  sowLabel: string,
  productType: string,
  productTypeLabel: string
): CustomRequisition[] => {
  const requisitions: CustomRequisition[] = []
  for (let i = 1; i <= quantity; i++) {
    const currentStatus = getRandomTrackingStatus()
    const trackingDate = new Date(orderDate)
    trackingDate.setDate(trackingDate.getDate() + 1) // Start tracking 1 day after order
    
    // Format: {fileNumber}-{sowNumber}-{productType}-{sequenceNumber}
    const controlId = `${fileNumber}-${sowNumber}-${productType}-${String(i).padStart(2, '0')}`
    
    // Generate patient data (use i as seed for consistent but varied data)
    const patientData = generateMockPatient(i + parseInt(orderId.split('-')[1]))
    
    requisitions.push({
      controlId,
      inboundTrackingId: `9${Math.floor(Math.random() * 9000000000000000 + 1000000000000000)}`,
      outboundTrackingId: `9${Math.floor(Math.random() * 9000000000000000 + 1000000000000000)}`,
      carrierType: 'USPS',
      currentStatus: currentStatus,
      trackingSteps: generateTrackingSteps(currentStatus, trackingDate),
      ...patientData,
      fileNumber,
      sowNumber,
      sowLabel,
      productType,
      productTypeLabel
    })
  }
  return requisitions
}

const mockOrderHistoryDTPBase: OrderHistoryItem[] = [
  {
    orderId: 'DTP-20240201-001',
    orderNo: 'DTP-ORD-2024-001',
    planName: 'DTP Health Plan',
    billingAccountNo: 'DTP-BA-200001',
    siteGroup: SITE_GROUPS.DIRECT_TO_PATIENT,
    status: 'shipped',
    customerId: 'DTP-CUST-001',
    orderDate: new Date('2024-02-01T10:00:00'),
    shippedDate: new Date('2024-02-02T11:30:00'),
    kitId: 'KIT-DTP-IFOBT-001',
    kitName: 'DTP IFOBT Home Kit',
    quantity: 30,
    trackingId: '9400110200830123456789',
    location: 'San Francisco, CA',
    fulfillmentDestination: 'Ditek-Windsor',
  },
  {
    orderId: 'DTP-20240203-002',
    orderNo: 'DTP-ORD-2024-002',
    planName: 'Patient Direct Plan',
    billingAccountNo: 'DTP-BA-200002',
    siteGroup: SITE_GROUPS.DIRECT_TO_PATIENT,
    status: 'in_progress',
    customerId: 'DTP-CUST-001',
    orderDate: new Date('2024-02-03T09:15:00'),
    kitId: 'KIT-DTP-A1C-002',
    kitName: 'Home A1c Test Kit',
    quantity: 45,
    location: 'Houston, TX',
    fulfillmentDestination: 'DYAD-King of Prussia',
  },
  {
    orderId: 'DTP-20240205-003',
    orderNo: 'DTP-ORD-2024-003',
    planName: 'Home Testing Program',
    billingAccountNo: 'DTP-BA-200003',
    siteGroup: SITE_GROUPS.DIRECT_TO_PATIENT,
    status: 'shipped',
    customerId: 'DTP-CUST-002',
    orderDate: new Date('2024-02-05T14:20:00'),
    shippedDate: new Date('2024-02-06T16:45:00'),
    kitId: 'KIT-DTP-ALB-003',
    kitName: 'Direct Albumin Urine Kit',
    quantity: 25,
    trackingId: '9400110200830123456790',
    location: 'Orlando, FL',
    fulfillmentDestination: 'Ditek-Windsor',
  },
  {
    orderId: 'DTP-20240207-004',
    orderNo: 'DTP-ORD-2024-004',
    planName: 'Patient Care Direct',
    billingAccountNo: 'DTP-BA-200004',
    siteGroup: SITE_GROUPS.DIRECT_TO_PATIENT,
    status: 'cancelled',
    customerId: 'DTP-CUST-002',
    orderDate: new Date('2024-02-07T08:30:00'),
    kitId: 'KIT-DTP-ADV-004',
    kitName: 'AdvanceDx Home Serum Kit',
    quantity: 15,
    location: 'Phoenix, AZ',
    fulfillmentDestination: 'DYAD-King of Prussia',
  },
  {
    orderId: 'DTP-20240210-005',
    orderNo: 'DTP-ORD-2024-005',
    planName: 'Direct Patient Care Program',
    billingAccountNo: 'DTP-BA-200005',
    siteGroup: SITE_GROUPS.DIRECT_TO_PATIENT,
    status: 'shipped',
    customerId: 'DTP-CUST-003',
    orderDate: new Date('2024-02-10T11:00:00'),
    shippedDate: new Date('2024-02-11T13:20:00'),
    kitId: 'KIT-DTP-IFOBT-005',
    kitName: 'Patient IFOBT Collection Kit',
    quantity: 40,
    trackingId: '9400110200830123456791',
    location: 'Seattle, WA',
    fulfillmentDestination: 'Ditek-Windsor',
  },
  {
    orderId: 'DTP-20240212-006',
    orderNo: 'DTP-ORD-2024-006',
    planName: 'Home Health Testing',
    billingAccountNo: 'DTP-BA-200006',
    siteGroup: SITE_GROUPS.DIRECT_TO_PATIENT,
    status: 'in_progress',
    customerId: 'DTP-CUST-003',
    orderDate: new Date('2024-02-12T15:45:00'),
    kitId: 'KIT-DTP-A1C-006',
    kitName: 'DTP A1c Whatman Kit',
    quantity: 35,
    location: 'Denver, CO',
    fulfillmentDestination: 'DYAD-King of Prussia',
  },
  {
    orderId: 'DTP-20240215-007',
    orderNo: 'DTP-ORD-2024-007',
    planName: 'Patient Wellness Direct',
    billingAccountNo: 'DTP-BA-200007',
    siteGroup: SITE_GROUPS.DIRECT_TO_PATIENT,
    status: 'shipped',
    customerId: 'DTP-CUST-004',
    orderDate: new Date('2024-02-15T10:30:00'),
    shippedDate: new Date('2024-02-16T12:00:00'),
    kitId: 'KIT-DTP-ALB-007',
    kitName: 'Home Albumin Test',
    quantity: 50,
    trackingId: '9400110200830123456792',
    location: 'Portland, OR',
    fulfillmentDestination: 'Ditek-Windsor',
  },
  {
    orderId: 'DTP-20240218-008',
    orderNo: 'DTP-ORD-2024-008',
    planName: 'Direct Care Health Plan',
    billingAccountNo: 'DTP-BA-200008',
    siteGroup: SITE_GROUPS.DIRECT_TO_PATIENT,
    status: 'in_progress',
    customerId: 'DTP-CUST-004',
    orderDate: new Date('2024-02-18T09:00:00'),
    kitId: 'KIT-DTP-ADV-008',
    kitName: 'Patient AdvanceDx Kit',
    quantity: 20,
    location: 'Atlanta, GA',
    fulfillmentDestination: 'DYAD-King of Prussia',
  },
  {
    orderId: 'DTP-20240220-009',
    orderNo: 'DTP-ORD-2024-009',
    planName: 'Home Testing Solutions',
    billingAccountNo: 'DTP-BA-200009',
    siteGroup: SITE_GROUPS.DIRECT_TO_PATIENT,
    status: 'shipped',
    customerId: 'DTP-CUST-005',
    orderDate: new Date('2024-02-20T13:15:00'),
    shippedDate: new Date('2024-02-21T15:30:00'),
    kitId: 'KIT-DTP-IFOBT-009',
    kitName: 'DTP Home IFOBT Kit',
    quantity: 60,
    trackingId: '9400110200830123456793',
    location: 'Minneapolis, MN',
    fulfillmentDestination: 'Ditek-Windsor',
  },
  {
    orderId: 'DTP-20240222-010',
    orderNo: 'DTP-ORD-2024-010',
    planName: 'Patient Direct Health Services',
    billingAccountNo: 'DTP-BA-200010',
    siteGroup: SITE_GROUPS.DIRECT_TO_PATIENT,
    status: 'shipped',
    customerId: 'DTP-CUST-005',
    orderDate: new Date('2024-02-22T08:45:00'),
    shippedDate: new Date('2024-02-23T10:15:00'),
    kitId: 'KIT-DTP-A1C-010',
    kitName: 'Home A1c Collection Kit',
    quantity: 45,
    trackingId: '9400110200830123456794',
    location: 'San Diego, CA',
    fulfillmentDestination: 'DYAD-King of Prussia',
  },
  {
    orderId: 'DTP-20240225-011',
    orderNo: 'DTP-ORD-2024-011',
    planName: 'Direct Testing Program',
    billingAccountNo: 'DTP-BA-200011',
    siteGroup: SITE_GROUPS.DIRECT_TO_PATIENT,
    status: 'cancelled',
    customerId: 'DTP-CUST-006',
    orderDate: new Date('2024-02-25T12:00:00'),
    kitId: 'KIT-DTP-ALB-011',
    kitName: 'Patient Albumin Urine Test',
    quantity: 25,
    location: 'Austin, TX',
    fulfillmentDestination: 'Ditek-Windsor',
  },
  {
    orderId: 'DTP-20240227-012',
    orderNo: 'DTP-ORD-2024-012',
    planName: 'Home Care Testing Plan',
    billingAccountNo: 'DTP-BA-200012',
    siteGroup: SITE_GROUPS.DIRECT_TO_PATIENT,
    status: 'in_progress',
    customerId: 'DTP-CUST-006',
    orderDate: new Date('2024-02-27T14:30:00'),
    kitId: 'KIT-DTP-ADV-012',
    kitName: 'DTP AdvanceDx Serum',
    quantity: 30,
    location: 'Tampa, FL',
    fulfillmentDestination: 'DYAD-King of Prussia',
  },
  {
    orderId: 'DTP-20240301-013',
    orderNo: 'DTP-ORD-2024-013',
    planName: 'Patient Wellness Plan',
    billingAccountNo: 'DTP-BA-200013',
    siteGroup: SITE_GROUPS.DIRECT_TO_PATIENT,
    status: 'shipped',
    customerId: 'DTP-CUST-001',
    orderDate: new Date('2024-03-01T10:20:00'),
    shippedDate: new Date('2024-03-02T11:45:00'),
    kitId: 'KIT-DTP-IFOBT-013',
    kitName: 'Home IFOBT Test Kit',
    quantity: 55,
    trackingId: '9400110200830123456795',
    location: 'San Francisco, CA',
    fulfillmentDestination: 'Ditek-Windsor',
  },
  {
    orderId: 'DTP-20240305-014',
    orderNo: 'DTP-ORD-2024-014',
    planName: 'Direct Health Access',
    billingAccountNo: 'DTP-BA-200014',
    siteGroup: SITE_GROUPS.DIRECT_TO_PATIENT,
    status: 'shipped',
    customerId: 'DTP-CUST-002',
    orderDate: new Date('2024-03-05T09:30:00'),
    shippedDate: new Date('2024-03-06T10:50:00'),
    kitId: 'KIT-DTP-A1C-014',
    kitName: 'Patient A1c Whatman Kit',
    quantity: 40,
    trackingId: '9400110200830123456796',
    location: 'Phoenix, AZ',
    fulfillmentDestination: 'DYAD-King of Prussia',
  },
  {
    orderId: 'DTP-20240308-015',
    orderNo: 'DTP-ORD-2024-015',
    planName: 'Home Patient Services',
    billingAccountNo: 'DTP-BA-200015',
    siteGroup: SITE_GROUPS.DIRECT_TO_PATIENT,
    status: 'in_progress',
    customerId: 'DTP-CUST-003',
    orderDate: new Date('2024-03-08T11:15:00'),
    kitId: 'KIT-DTP-ALB-015',
    kitName: 'DTP Albumin Test Kit',
    quantity: 35,
    location: 'Seattle, WA',
    fulfillmentDestination: 'Ditek-Windsor',
  },
  {
    orderId: 'DTP-20240312-016',
    orderNo: 'DTP-ORD-2024-016',
    planName: 'Patient Care Direct Plan',
    billingAccountNo: 'DTP-BA-200016',
    siteGroup: SITE_GROUPS.DIRECT_TO_PATIENT,
    status: 'shipped',
    customerId: 'DTP-CUST-004',
    orderDate: new Date('2024-03-12T13:45:00'),
    shippedDate: new Date('2024-03-13T15:20:00'),
    kitId: 'KIT-DTP-ADV-016',
    kitName: 'Home AdvanceDx Kit',
    quantity: 28,
    trackingId: '9400110200830123456797',
    location: 'Portland, OR',
    fulfillmentDestination: 'DYAD-King of Prussia',
  },
  {
    orderId: 'DTP-20240315-017',
    orderNo: 'DTP-ORD-2024-017',
    planName: 'Direct to Patient Testing',
    billingAccountNo: 'DTP-BA-200017',
    siteGroup: SITE_GROUPS.DIRECT_TO_PATIENT,
    status: 'shipped',
    customerId: 'DTP-CUST-005',
    orderDate: new Date('2024-03-15T08:00:00'),
    shippedDate: new Date('2024-03-16T09:30:00'),
    kitId: 'KIT-DTP-IFOBT-017',
    kitName: 'Patient IFOBT Home Kit',
    quantity: 50,
    trackingId: '9400110200830123456798',
    location: 'Minneapolis, MN',
    fulfillmentDestination: 'Ditek-Windsor',
  },
  {
    orderId: 'DTP-20240318-018',
    orderNo: 'DTP-ORD-2024-018',
    planName: 'Home Health Direct',
    billingAccountNo: 'DTP-BA-200018',
    siteGroup: SITE_GROUPS.DIRECT_TO_PATIENT,
    status: 'in_progress',
    customerId: 'DTP-CUST-006',
    orderDate: new Date('2024-03-18T10:45:00'),
    kitId: 'KIT-DTP-A1C-018',
    kitName: 'DTP A1c Home Test',
    quantity: 32,
    location: 'Austin, TX',
    fulfillmentDestination: 'DYAD-King of Prussia',
  },
  {
    orderId: 'DTP-20240322-019',
    orderNo: 'DTP-ORD-2024-019',
    planName: 'Patient Direct Wellness',
    billingAccountNo: 'DTP-BA-200019',
    siteGroup: SITE_GROUPS.DIRECT_TO_PATIENT,
    status: 'shipped',
    customerId: 'DTP-CUST-001',
    orderDate: new Date('2024-03-22T12:30:00'),
    shippedDate: new Date('2024-03-23T14:00:00'),
    kitId: 'KIT-DTP-ALB-019',
    kitName: 'Home Albumin Collection Kit',
    quantity: 42,
    trackingId: '9400110200830123456799',
    location: 'San Francisco, CA',
    fulfillmentDestination: 'Ditek-Windsor',
  },
  {
    orderId: 'DTP-20240325-020',
    orderNo: 'DTP-ORD-2024-020',
    planName: 'Direct Patient Health Plan',
    billingAccountNo: 'DTP-BA-200020',
    siteGroup: SITE_GROUPS.DIRECT_TO_PATIENT,
    status: 'shipped',
    customerId: 'DTP-CUST-003',
    orderDate: new Date('2024-03-25T09:15:00'),
    shippedDate: new Date('2024-03-26T10:45:00'),
    kitId: 'KIT-DTP-ADV-020',
    kitName: 'Patient AdvanceDx Serum Kit',
    quantity: 38,
    trackingId: '9400110200830123456800',
    location: 'Seattle, WA',
    fulfillmentDestination: 'DYAD-King of Prussia',
  },
  {
    orderId: 'DTP-20240328-021',
    orderNo: 'DTP-ORD-2024-021',
    planName: 'Home Care Advantage',
    billingAccountNo: 'DTP-BA-200021',
    siteGroup: SITE_GROUPS.DIRECT_TO_PATIENT,
    status: 'approved',
    customerId: 'DTP-CUST-001',
    orderDate: new Date('2026-01-28T10:00:00'),
    kitId: 'KIT-DTP-IFOBT-021',
    kitName: 'DTP IFOBT Home Kit',
    quantity: 60,
    location: 'Los Angeles, CA',
    fulfillmentDestination: 'Ditek-Windsor',
  },
  {
    orderId: 'DTP-20240330-022',
    orderNo: 'DTP-ORD-2024-022',
    planName: 'Patient Wellness Direct',
    billingAccountNo: 'DTP-BA-200022',
    siteGroup: SITE_GROUPS.DIRECT_TO_PATIENT,
    status: 'approved',
    customerId: 'DTP-CUST-002',
    orderDate: new Date('2026-01-30T14:20:00'),
    kitId: 'KIT-DTP-A1C-022',
    kitName: 'Patient A1c Whatman Kit',
    quantity: 48,
    location: 'Chicago, IL',
    fulfillmentDestination: 'DYAD-King of Prussia',
  },
  {
    orderId: 'DTP-20240401-023',
    orderNo: 'DTP-ORD-2024-023',
    planName: 'Direct Patient Care Plus',
    billingAccountNo: 'DTP-BA-200023',
    siteGroup: SITE_GROUPS.DIRECT_TO_PATIENT,
    status: 'approved',
    customerId: 'DTP-CUST-004',
    orderDate: new Date('2026-02-01T09:30:00'),
    kitId: 'KIT-DTP-ALB-023',
    kitName: 'DTP Albumin Test Kit',
    quantity: 36,
    location: 'Denver, CO',
    fulfillmentDestination: 'Ditek-Windsor',
  },
  {
    orderId: 'DTP-20240403-024',
    orderNo: 'DTP-ORD-2024-024',
    planName: 'Home Health Solutions',
    billingAccountNo: 'DTP-BA-200024',
    siteGroup: SITE_GROUPS.DIRECT_TO_PATIENT,
    status: 'approved',
    customerId: 'DTP-CUST-005',
    orderDate: new Date('2026-02-03T11:45:00'),
    kitId: 'KIT-DTP-ADV-024',
    kitName: 'Home AdvanceDx Kit',
    quantity: 52,
    location: 'Miami, FL',
    fulfillmentDestination: 'DYAD-King of Prussia',
  },
  {
    orderId: 'DTP-20260204-025',
    orderNo: 'DTP-ORD-2026-025',
    planName: 'Patient Direct Care',
    billingAccountNo: 'DTP-BA-200025',
    siteGroup: SITE_GROUPS.DIRECT_TO_PATIENT,
    status: 'approved',
    customerId: 'DTP-CUST-001',
    orderDate: new Date('2026-02-04T09:30:00'),
    kitId: 'KIT-DTP-IFOBT-025',
    kitName: 'Home IFOBT Collection Kit',
    quantity: 65,
    location: 'San Diego, CA',
    fulfillmentDestination: 'Ditek-Windsor',
  },
  {
    orderId: 'DTP-20260204-026',
    orderNo: 'DTP-ORD-2026-026',
    planName: 'Home Testing Program',
    billingAccountNo: 'DTP-BA-200026',
    siteGroup: SITE_GROUPS.DIRECT_TO_PATIENT,
    status: 'approved',
    customerId: 'DTP-CUST-002',
    orderDate: new Date('2026-02-04T13:15:00'),
    kitId: 'KIT-DTP-A1C-026',
    kitName: 'DTP A1c Whatman Kit',
    quantity: 48,
    location: 'Portland, OR',
    fulfillmentDestination: 'DYAD-King of Prussia',
  },
  {
    orderId: 'DTP-20260203-027',
    orderNo: 'DTP-ORD-2026-027',
    planName: 'Direct Patient Services',
    billingAccountNo: 'DTP-BA-200027',
    siteGroup: SITE_GROUPS.DIRECT_TO_PATIENT,
    status: 'approved',
    customerId: 'DTP-CUST-003',
    orderDate: new Date('2026-02-03T10:00:00'),
    kitId: 'KIT-DTP-ALB-027',
    kitName: 'Direct Albumin Urine Kit',
    quantity: 38,
    location: 'Las Vegas, NV',
    fulfillmentDestination: 'Ditek-Windsor',
  },
  {
    orderId: 'DTP-20260202-028',
    orderNo: 'DTP-ORD-2026-028',
    planName: 'Home Health Direct',
    billingAccountNo: 'DTP-BA-200028',
    siteGroup: SITE_GROUPS.DIRECT_TO_PATIENT,
    status: 'approved',
    customerId: 'DTP-CUST-004',
    orderDate: new Date('2026-02-02T15:20:00'),
    kitId: 'KIT-DTP-ADV-028',
    kitName: 'Home AdvanceDx Kit',
    quantity: 72,
    location: 'Austin, TX',
    fulfillmentDestination: 'DYAD-King of Prussia',
  },
]

// Helper function to add timestamps to orders
function addTimestampsToOrders<T extends { orderDate: Date; orderId: string }>(orders: T[]): T[] {
  return orders.map(order => {
    const createdAt = order.orderDate
    // Mock updatedAt as 1-5 hours after creation (deterministic based on orderId)
    const updatedAt = new Date(createdAt)
    // Use orderId hash to generate deterministic offset (1-5 hours)
    const hash = order.orderId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)
    const hoursOffset = (hash % 5) + 1
    updatedAt.setHours(updatedAt.getHours() + hoursOffset)
    
    return {
      ...order,
      createdAt,
      updatedAt
    }
  })
}

// Export with timestamps added first, then order items (so items inherit parent timestamps)
export const mockOrderHistoryDTP: OrderHistoryItem[] = addOrderItemsToOrders(addTimestampsToOrders(mockOrderHistoryDTPBase))

// Order details for each order (for the detail page)
export const mockOrderDetailsDTP: OrderDetail[] = mockOrderHistoryDTPBase.map((order) => {
  const sow = getRandomSOW()
  const productType = getRandomProductType()
  const fileNumber = `F-DTP-${order.orderId.split('-')[1]}`
  
  return {
    orderId: order.orderId,
    orderNo: order.orderNo,
    orderDate: order.orderDate,
    dateApproved: order.status !== 'cancelled' ? new Date(order.orderDate.getTime() + 86400000) : undefined,
    shippedDate: order.shippedDate,
    status: order.status,
    siteGroup: SITE_GROUPS.DIRECT_TO_PATIENT,
    customerId: order.customerId,
    
    // Client Details (Plan)
    planName: order.planName,
    planAddress: '500 Patient Care Avenue',
    planCity: order.location.split(', ')[0],
    planState: order.location.split(', ')[1] || 'CA',
    planZip: '94000',
    billingAccountNo: order.billingAccountNo,
    
    // Contact Information (ATTN)
    contactName: 'Patient Services Coordinator',
    contactPhone: '(555) 123-4567',
    contactAddress: '500 Patient Care Avenue',
    specialInstructions: 'Handle with care - medical supplies',
    
    // Kit Details
    kitId: order.kitId,
    kitName: order.kitName,
    kitSku: `SKU-${order.kitId}`,
    kitPackaging: 'Standard Box',
    quantity: order.quantity,
    kitInstructions: 'Follow kit instructions carefully',
    trfTemplate: 'Standard TRF Template',
    letterPrint: true,
    
    // Order Details
    kitNumber: `KIT-${order.orderNo.split('-')[2]}`,
    labTicket: `LAB-${order.orderNo.split('-')[2]}`,
    orderNotes: 'Direct to Patient order',
    
    // Lab Address
    labAddress: '1447 York Court',
    labCity: 'Burlington',
    labState: 'NC',
    labZip: '27215',
    
    // Return Address
    returnAttn: 'LabCorp Direct Patient Returns',
    returnAddress: '1234 Testing Boulevard, Returns Department',
    returnCity: 'Burlington',
    returnState: 'NC',
    returnZip: '27215',
    
    // Fulfillment & Tracking
    outboundCarrier: 'USPS',
    outboundTrackingId: order.trackingId,
    outboundTrackingIds: order.trackingId ? [order.trackingId] : undefined,
    inboundCarrier: 'USPS',
    
    // Custom Requisition Settings (from place order form)
    fileNumber,
    sowNumber: sow.value,
    sowLabel: sow.label,
    productType: productType.value,
    productTypeLabel: productType.label,
    
    // Custom Requisitions
    customRequisitions: generateCustomRequisitions(
      order.orderId,
      order.quantity,
      order.orderDate,
      fileNumber,
      sow.value,
      sow.label,
      productType.value,
      productType.label
    ),
    
    // Site location
    location: order.location
  }
})

export function calculateOrderMetricsDTP(orders: OrderHistoryItem[]): OrderMetrics {
  const totalOrders = orders.length
  const ordersInProgress = orders.filter(order => order.status === 'in_progress').length
  const ordersShipped = orders.filter(order => order.status === 'shipped').length
  const ordersCancelled = orders.filter(order => order.status === 'cancelled').length
  const totalPlans = new Set(orders.map(order => order.planName)).size
  const ordersPlacedToday = orders.filter(order => {
    const today = new Date()
    const orderDate = new Date(order.orderDate)
    return orderDate.toDateString() === today.toDateString()
  }).length

  return {
    totalOrders,
    ordersInProgress,
    ordersShipped,
    ordersCancelled,
    totalPlans,
    ordersPlacedToday,
  }
}
