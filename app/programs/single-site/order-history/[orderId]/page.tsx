'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { OrderDetailHeader } from '@/components/order-detail/OrderDetailHeader'
import { ClientDetailsCard } from '@/components/order-detail/ClientDetailsCard'
import { OrderSummaryCard } from '@/components/order-detail/OrderSummaryCard'
import { ContactInfoCard } from '@/components/order-detail/ContactInfoCard'
import { OrderDetailsCard } from '@/components/order-detail/OrderDetailsCard'
import { ReturnAddressCard } from '@/components/order-detail/ReturnAddressCard'
import { FulfillmentCard } from '@/components/order-detail/FulfillmentCard'
import { CustomRequisitionTable } from '@/components/order-detail/CustomRequisitionTable'
import { getOrderDetailById } from '@/lib/data/mockOrderHistory'
import { OrderDetail } from '@/lib/types/order-detail'
import { exportOrderDetailToCSV, exportOrderDetailToXLS } from '@/lib/utils/orderDetailHelpers'
import { useSessionContext } from '@/lib/hooks/useSessionContext'
import { verifyOrderOwnership } from '@/lib/utils/dataFilters'
import { AlertCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function OrderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const orderId = params.orderId as string
  const { activeCustomerId, isLoading: sessionLoading } = useSessionContext()
  
  const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Wait for session to load
    if (sessionLoading) return
    
    // Simulate loading and fetch order details
    setIsLoading(true)
    setError(null)
    
    // Simulate API delay
    const timer = setTimeout(() => {
      const order = getOrderDetailById(orderId)
      
      if (!order) {
        setError('Order not found')
        setIsLoading(false)
        return
      }
      
      // Verify ownership
      const hasAccess = verifyOrderOwnership(order, activeCustomerId)
      if (!hasAccess) {
        setError('Access denied: You do not have permission to view this order')
        setIsLoading(false)
        return
      }
      
      setOrderDetail(order)
      setIsLoading(false)
    }, 300)
    
    return () => clearTimeout(timer)
  }, [orderId, activeCustomerId, sessionLoading])

  const handleExportCSV = () => {
    if (!orderDetail) return
    exportOrderDetailToCSV(orderDetail)
  }

  const handleExportXLS = () => {
    if (!orderDetail) return
    exportOrderDetailToXLS(orderDetail)
  }

  // Loading state
  if (isLoading) {
    return (
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-[1400px]">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 dark:text-gray-400">Loading order details...</p>
          </div>
        </div>
      </main>
    )
  }

  // Error state
  if (error || !orderDetail) {
    return (
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-[1400px]">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center max-w-md">
            <div className="bg-red-50 dark:bg-red-950 rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-2">
              Order Not Found
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              The order with ID "{orderId}" could not be found. It may have been removed or the ID may be incorrect.
            </p>
            <Button
              onClick={() => router.push('/programs/single-site/order-history')}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Order History
            </Button>
          </div>
        </div>
      </main>
    )
  }

  // Main content
  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 max-w-[1400px]">
      {/* Header */}
      <OrderDetailHeader
        orderId={orderDetail.orderId}
        status={orderDetail.status}
        onExportCSV={handleExportCSV}
        onExportXLS={handleExportXLS}
      />

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT COLUMN */}
        <div className="space-y-6">
          {/* Client Details */}
          <ClientDetailsCard
            planName={orderDetail.planName}
            planAddress={orderDetail.planAddress}
            planCity={orderDetail.planCity}
            planState={orderDetail.planState}
            planZip={orderDetail.planZip}
            billingAccountNo={orderDetail.billingAccountNo}
            status={orderDetail.status}
          />

          {/* Order Summary */}
          <OrderSummaryCard
            kitName={orderDetail.kitName}
            kitSku={orderDetail.kitSku}
            quantity={orderDetail.quantity}
            orderNotes={orderDetail.orderNotes}
          />

          {/* ATTN (Contact Info) */}
          <ContactInfoCard
            contactName={orderDetail.contactName}
            contactPhone={orderDetail.contactPhone}
            contactAddress={orderDetail.contactAddress}
            specialInstructions={orderDetail.specialInstructions}
          />

          {/* Order Details */}
          <OrderDetailsCard
            orderDate={orderDetail.orderDate}
            dateApproved={orderDetail.dateApproved}
            shippedDate={orderDetail.shippedDate}
            kitNumber={orderDetail.kitNumber}
            labTicket={orderDetail.labTicket}
            kitName={orderDetail.kitName}
            kitPackaging={orderDetail.kitPackaging}
            quantity={orderDetail.quantity}
            letterPrint={orderDetail.letterPrint}
            trfTemplate={orderDetail.trfTemplate}
            kitInstructions={orderDetail.kitInstructions}
            labAddress={orderDetail.labAddress}
            labCity={orderDetail.labCity}
            labState={orderDetail.labState}
            labZip={orderDetail.labZip}
          />

          {/* Return Address */}
          <ReturnAddressCard
            returnAttn={orderDetail.returnAttn}
            returnAddress={orderDetail.returnAddress}
            returnCity={orderDetail.returnCity}
            returnState={orderDetail.returnState}
            returnZip={orderDetail.returnZip}
          />
        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">
          {/* Fulfillment & Tracking */}
          <FulfillmentCard
            outboundCarrier={orderDetail.outboundCarrier}
            outboundTrackingId={orderDetail.outboundTrackingId}
            outboundTrackingIds={orderDetail.outboundTrackingIds}
            inboundCarrier={orderDetail.inboundCarrier}
            orderStatus={orderDetail.status}
          />

          {/* Custom Requisition Table */}
          <CustomRequisitionTable
            requisitions={orderDetail.customRequisitions}
            orderStatus={orderDetail.status}
          />
        </div>
      </div>
    </main>
  )
}
