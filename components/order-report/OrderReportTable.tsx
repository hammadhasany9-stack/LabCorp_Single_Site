'use client'

import { useState } from 'react'
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
import { Eye, XCircle, DollarSign, FileText, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { OrderHistoryItem, SortField, SortDirection } from '@/lib/types/order-history'
import { formatOrderDateOnly, formatOrderTimeOnly, getStatusVariant, getStatusLabel } from '@/lib/utils/orderHelpers'
import { CancelRefundDialog } from './CancelRefundDialog'
import { OrderItemsModal } from './OrderItemsModal'
import { ActionType, CancelRefundDialogData } from '@/lib/types/order-report'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

interface OrderReportTableProps {
  orders: OrderHistoryItem[]
  selectedRows: string[]
  onSelectionChange: (selectedIds: string[]) => void
  sortField?: SortField
  sortDirection?: SortDirection
  onSort?: (field: SortField) => void
  onCancelOrder: (orderId: string) => void
  onRefundOrder: (orderId: string) => void
  onGenerateAsset?: (orderId: string) => void
}

export function OrderReportTable({
  orders,
  selectedRows,
  onSelectionChange,
  sortField,
  sortDirection,
  onSort,
  onCancelOrder,
  onRefundOrder,
  onGenerateAsset
}: OrderReportTableProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [dialogAction, setDialogAction] = useState<ActionType>('cancel')
  const [selectedOrderForAction, setSelectedOrderForAction] = useState<CancelRefundDialogData | null>(null)
  const [orderItemsModalOpen, setOrderItemsModalOpen] = useState(false)
  const [selectedOrderForItems, setSelectedOrderForItems] = useState<OrderHistoryItem | null>(null)

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

  const handleViewOrder = (order: OrderHistoryItem) => {
    setSelectedOrderForItems(order)
    setOrderItemsModalOpen(true)
  }

  const handleCancelClick = (order: OrderHistoryItem) => {
    setSelectedOrderForAction({
      orderId: order.orderId,
      orderNo: order.orderNo,
      programName: order.siteGroup,
      kitName: order.kitName,
    })
    setDialogAction('cancel')
    setDialogOpen(true)
  }

  const handleRefundClick = (order: OrderHistoryItem) => {
    setSelectedOrderForAction({
      orderId: order.orderId,
      orderNo: order.orderNo,
      programName: order.siteGroup,
      kitName: order.kitName,
    })
    setDialogAction('refund')
    setDialogOpen(true)
  }

  const handleGenerateAsset = (orderId: string) => {
    if (onGenerateAsset) {
      onGenerateAsset(orderId)
    }
  }

  const handleConfirmAction = () => {
    if (!selectedOrderForAction) return
    
    if (dialogAction === 'cancel') {
      onCancelOrder(selectedOrderForAction.orderId)
    } else {
      onRefundOrder(selectedOrderForAction.orderId)
    }
    
    setSelectedOrderForAction(null)
  }

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />
    }
    return sortDirection === 'asc' 
      ? <ArrowUp className="ml-2 h-4 w-4" />
      : <ArrowDown className="ml-2 h-4 w-4" />
  }

  const getProgramId = (siteGroup: string): number => {
    return siteGroup === 'Single Site' ? 68 : 69
  }

  const getOrderAssetsCount = (order: OrderHistoryItem): number => {
    // Each order item has 4 assets: TRF, shipping label PDF, return label PDF, stickers
    const itemCount = order.orderItems?.length || 0
    return itemCount * 4
  }

  const formatDateTime = (date?: Date): string => {
    if (!date) return 'N/A'
    return format(new Date(date), 'MMM dd, yyyy hh:mm a')
  }

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
                <TableHead className="text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900 px-6">ID</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900 px-6">Program Name</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900 px-6">Program ID</TableHead>
                <TableHead className="bg-gray-100 dark:bg-zinc-900 px-6">
                  <Button 
                    variant="ghost" 
                    onClick={() => onSort?.('orderNo')}
                    className="flex items-center p-0 hover:bg-transparent text-gray-700 dark:text-gray-400"
                  >
                    Order ID
                    {getSortIcon('orderNo')}
                  </Button>
                </TableHead>
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
                <TableHead className="text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900 px-6">Kit Name</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900 px-6">Kit ID</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900 px-6 text-center">Order Assets</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900 px-6 text-center">Fulfillment Status</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900 px-6">Created At</TableHead>
                <TableHead className="text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900 px-6">Updated At</TableHead>
                <TableHead className="text-right sticky right-0 bg-gray-100 dark:bg-zinc-900 text-center text-gray-700 dark:text-gray-400 px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((order, index) => (
                <TableRow key={order.orderId}>
                  <TableCell className="px-4">
                    <Checkbox
                      checked={selectedRows.includes(order.orderId)}
                      onCheckedChange={() => handleRowCheckbox(order.orderId)}
                      aria-label={`Select order ${order.orderId}`}
                    />
                  </TableCell>
                  <TableCell className="px-6 text-sm">{index + 1}</TableCell>
                  <TableCell className="px-6 font-medium">{order.siteGroup}</TableCell>
                  <TableCell className="px-6 text-sm">{getProgramId(order.siteGroup)}</TableCell>
                  <TableCell className="font-mono text-sm px-6">{order.orderNo}</TableCell>
                  <TableCell className="px-6 text-center">{order.quantity}</TableCell>
                  <TableCell className="px-6">{order.kitName}</TableCell>
                  <TableCell className="px-6 text-sm font-mono">{order.kitId}</TableCell>
                  <TableCell className="px-6 text-center">
                    <Badge variant="outline" className="font-semibold">
                      {getOrderAssetsCount(order)}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6">
                    <Badge 
                      variant={getStatusVariant(order.status)}
                      className={cn(
                        order.status === 'approved' && 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900',
                        order.status === 'in_progress' && 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900'
                      )}
                    >
                      {getStatusLabel(order.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 text-sm">
                    {formatDateTime(order.createdAt || order.orderDate)}
                  </TableCell>
                  <TableCell className="px-6 text-sm">
                    {formatDateTime(order.updatedAt || order.orderDate)}
                  </TableCell>
                  <TableCell className="text-right sticky right-0 bg-white dark:bg-card px-6">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewOrder(order)}
                        disabled={order.status === 'shipped' || order.status === 'cancelled'}
                        className="h-8"
                        title={order.status === 'shipped' || order.status === 'cancelled' ? 'View not available for shipped/cancelled orders' : 'View order items'}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleGenerateAsset(order.orderId)}
                        className="h-8 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-950"
                      >
                        <FileText className="h-4 w-4 mr-1" />
                        Generate Asset
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCancelClick(order)}
                        className="h-8 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Cancel
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRefundClick(order)}
                        className="h-8 text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 hover:bg-orange-50 dark:hover:bg-orange-950"
                      >
                        <DollarSign className="h-4 w-4 mr-1" />
                        Refund
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <CancelRefundDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        actionType={dialogAction}
        order={selectedOrderForAction}
        onConfirm={handleConfirmAction}
      />

      <OrderItemsModal
        open={orderItemsModalOpen}
        onOpenChange={setOrderItemsModalOpen}
        order={selectedOrderForItems}
      />
    </>
  )
}
