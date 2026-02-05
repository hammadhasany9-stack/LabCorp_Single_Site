'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { Eye, TruckIcon, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { OrderHistoryItem, SortField, SortDirection } from '@/lib/types/order-history'
import { ProgramTab } from '@/lib/types/unified-dashboard'
import { formatOrderDateOnly, formatOrderTimeOnly, getStatusVariant, getStatusLabel } from '@/lib/utils/orderHelpers'
import { getOrderDetailById } from '@/lib/data'
import { UnifiedTrackingModal } from '@/components/order-detail/UnifiedTrackingModal'
import { SingleSiteUnifiedTrackingModal } from '@/components/order-detail/SingleSiteUnifiedTrackingModal'
import { SITE_GROUPS } from '@/lib/constants/siteGroups'
import { cn } from '@/lib/utils'

interface UnifiedOrdersTableProps {
  orders: OrderHistoryItem[]
  activeProgram: ProgramTab
  selectedRows: string[]
  onSelectionChange: (selectedIds: string[]) => void
  sortField?: SortField
  sortDirection?: SortDirection
  onSort?: (field: SortField) => void
}

export function UnifiedOrdersTable({
  orders,
  activeProgram,
  selectedRows,
  onSelectionChange,
  sortField,
  sortDirection,
  onSort
}: UnifiedOrdersTableProps) {
  const router = useRouter()
  const [trackingModalOpen, setTrackingModalOpen] = useState(false)
  const [selectedOrderForTracking, setSelectedOrderForTracking] = useState<string | null>(null)

  const allSelected = orders.length > 0 && selectedRows.length === orders.length
  const someSelected = selectedRows.length > 0 && selectedRows.length < orders.length

  const handleMasterCheckbox = () => {
    if (allSelected) {
      onSelectionChange([])
    } else {
      onSelectionChange(orders.map(order => order.orderId))
    }
  }

  const handleRowCheckbox = (orderId: string) => {
    if (selectedRows.includes(orderId)) {
      onSelectionChange(selectedRows.filter(id => id !== orderId))
    } else {
      onSelectionChange([...selectedRows, orderId])
    }
  }

  const handleViewOrder = (orderId: string) => {
    // Route to LC-specific order detail page
    router.push(`/lc-orders/order-detail/${orderId}`)
  }

  const handleTrackOrder = (orderId: string) => {
    setSelectedOrderForTracking(orderId)
    setTrackingModalOpen(true)
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="ml-2 h-4 w-4" />
      : <ArrowDown className="ml-2 h-4 w-4" />
  }

  const selectedOrderDetail = selectedOrderForTracking 
    ? getOrderDetailById(selectedOrderForTracking)
    : null

  // Column definitions based on program
  const isSingleSite = activeProgram === 'single-site'
  
  // Check if selected order is Single Site
  const isSelectedOrderSingleSite = selectedOrderDetail?.siteGroup === SITE_GROUPS.SINGLE_SITE

  // Safety check
  if (!orders || !Array.isArray(orders) || orders.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500 dark:text-gray-400">
        No orders found
      </div>
    )
  }

  return (
    <>
      <div className="bg-white dark:bg-card border border-t-0 border-gray-200 dark:border-zinc-800 rounded-b-2xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-gray-100 dark:bg-zinc-900 z-10">
              <TableRow>
                <TableHead className="w-12 bg-gray-100 dark:bg-zinc-900 px-4">
                  <Checkbox
                    checked={allSelected}
                    onCheckedChange={handleMasterCheckbox}
                    aria-label="Select all"
                    className={someSelected ? 'data-[state=checked]:bg-gray-400' : ''}
                  />
                </TableHead>
                <TableHead className="text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900 px-6">Order ID</TableHead>
                <TableHead className="bg-gray-100 dark:bg-zinc-900 px-6">
                  <Button 
                    variant="ghost" 
                    onClick={() => onSort?.('planName')}
                    className="flex items-center p-0 hover:bg-transparent text-gray-700 dark:text-gray-400"
                  >
                    Plan Name
                    {getSortIcon('planName')}
                  </Button>
                </TableHead>
                <TableHead className="text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900 px-6">Kit Name</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900 px-6">Kit ID</TableHead>
                <TableHead className="bg-gray-100 dark:bg-zinc-900 px-6">
                  <Button 
                    variant="ghost" 
                    onClick={() => onSort?.('quantity')}
                    className="flex items-center p-0 hover:bg-transparent text-gray-700 dark:text-gray-400"
                  >
                    Quantity
                    {getSortIcon('quantity')}
                  </Button>
                </TableHead>
                <TableHead className="bg-gray-100 dark:bg-zinc-900 px-6">
                  <Button 
                    variant="ghost" 
                    onClick={() => onSort?.('orderDate')}
                    className="flex items-center p-0 hover:bg-transparent text-gray-700 dark:text-gray-400"
                  >
                    Date
                    {getSortIcon('orderDate')}
                  </Button>
                </TableHead>
                {isSingleSite && <TableHead className="text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900 px-6">Street Address</TableHead>}
                <TableHead className="text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900 px-6">City</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900 px-6">State</TableHead>
                <TableHead className="bg-gray-100 dark:bg-zinc-900 px-6">
                  <Button 
                    variant="ghost" 
                    onClick={() => onSort?.('shippedDate')}
                    className="flex items-center p-0 hover:bg-transparent text-gray-700 dark:text-gray-400"
                  >
                    Shipped Date
                    {getSortIcon('shippedDate')}
                  </Button>
                </TableHead>
                <TableHead className="text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900 px-6 text-center">Status</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900 px-6 text-center">LC User</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900 px-6">Fulfillment Destination</TableHead>
                <TableHead className="text-right sticky right-0 bg-gray-100 dark:bg-zinc-900 text-center text-gray-700 dark:text-gray-400 px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
          <TableBody>
            {orders.map((order) => {
              const [city, state] = order.location.split(', ')
              return (
                <TableRow key={order.orderId}>
                  <TableCell className="px-4">
                    <Checkbox
                      checked={selectedRows.includes(order.orderId)}
                      onCheckedChange={() => handleRowCheckbox(order.orderId)}
                      aria-label={`Select order ${order.orderId}`}
                    />
                  </TableCell>
                  <TableCell className="font-mono text-sm px-6">{order.orderId}</TableCell>
                  <TableCell className="font-medium px-6">{order.planName}</TableCell>
                  <TableCell className="px-6">{order.kitName}</TableCell>
                  <TableCell className="font-mono text-sm px-6">{order.kitId}</TableCell>
                  <TableCell className="px-6 text-center">{order.quantity}</TableCell>
                  <TableCell className="px-6">
                    <div className="flex flex-col">
                      <span className="text-sm">{formatOrderDateOnly(order.orderDate)}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatOrderTimeOnly(order.orderDate)} ET
                      </span>
                    </div>
                  </TableCell>
                  {isSingleSite && (
                    <TableCell className="text-sm px-6 pr-12">
                      {order.streetAddress || 'N/A'}
                    </TableCell>
                  )}
                  <TableCell className="px-6">{city}</TableCell>
                  <TableCell className="px-6 text-center">{state}</TableCell>
                  <TableCell className="px-6 text-center">
                    {order.shippedDate ? (
                      <div className="flex flex-col">
                        <span className="text-sm">{formatOrderDateOnly(order.shippedDate)}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {formatOrderTimeOnly(order.shippedDate)} ET
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-500 dark:text-gray-400">N/A</span>
                    )}
                  </TableCell>
                  <TableCell className="px-6">
                    <Badge 
                      variant={getStatusVariant(order.status)}
                      className={cn(
                        order.status === 'shipped' && 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900',
                        order.status === 'in_progress' && 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900',
                        order.status === 'approved' && 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400 hover:bg-purple-200 dark:hover:bg-purple-900',
                        order.status === 'cancelled' && 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900'
                      )}
                    >
                      {getStatusLabel(order.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="font-mono text-sm px-6">{order.billingAccountNo}</TableCell>
                  <TableCell className="px-6 pr-24">{order.fulfillmentDestination || order.location}</TableCell>
                  <TableCell className="text-right sticky right-0 bg-white dark:bg-card px-6">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewOrder(order.orderId)}
                        className="h-8"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleTrackOrder(order.orderId)}
                        className="h-8"
                        disabled={!order.shippedDate}
                      >
                        <TruckIcon className="h-4 w-4 mr-1" />
                        Track
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        </div>
      </div>

      {/* Tracking Modals - Different for Single Site vs Direct to Patient */}
      {selectedOrderDetail && (
        <>
          {isSelectedOrderSingleSite ? (
            <SingleSiteUnifiedTrackingModal
              open={trackingModalOpen}
              onOpenChange={setTrackingModalOpen}
              outboundTrackingIds={selectedOrderDetail.outboundTrackingIds || []}
              outboundCarrier={selectedOrderDetail.outboundCarrier}
              requisitions={selectedOrderDetail.customRequisitions}
              inboundCarrier={selectedOrderDetail.inboundCarrier}
              initialTab="outbound"
            />
          ) : (
            <UnifiedTrackingModal
              open={trackingModalOpen}
              onOpenChange={setTrackingModalOpen}
              requisitions={selectedOrderDetail.customRequisitions}
              initialIndex={0}
              carrierType={selectedOrderDetail.inboundCarrier}
              shouldShowPatientData={false}
            />
          )}
        </>
      )}
    </>
  )
}
