'use client'

import { useRouter } from 'next/navigation'
import { ArrowUpDown, ArrowUp, ArrowDown, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { OrderHistoryItem, SortField, SortDirection } from '@/lib/types/order-history'
import { formatOrderDate, formatOrderDateOnly, formatOrderTimeOnly, getStatusVariant, getStatusLabel } from '@/lib/utils/orderHelpers'
import { cn } from '@/lib/utils'
import { useSiteGroupContext } from '@/lib/hooks/useSiteGroupContext'
import { SITE_GROUPS } from '@/lib/constants/siteGroups'

interface OrderTableProps {
  orders: OrderHistoryItem[]
  sortField?: SortField
  sortDirection?: SortDirection
  onSort?: (field: SortField) => void
}

export function OrderTable({
  orders,
  sortField,
  sortDirection,
  onSort
}: OrderTableProps) {
  const router = useRouter()
  const { currentSiteGroup } = useSiteGroupContext()
  
  const handleViewOrder = (orderId: string) => {
    // Route to the correct portal based on current site group
    const portalPath = currentSiteGroup === SITE_GROUPS.DIRECT_TO_PATIENT 
      ? '/programs/direct-to-patient' 
      : '/programs/single-site'
    router.push(`${portalPath}/order-history/${orderId}`)
  }
  
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown className="ml-2 h-4 w-4" />
    }
    return sortDirection === 'asc' ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    )
  }

  const SortableHeader = ({ field, children, className }: { field: SortField; children: React.ReactNode; className?: string }) => (
    <TableHead className={className}>
      <Button
        variant="ghost"
        onClick={() => onSort && onSort(field)}
        className="h-16 p-1 mx-6 font-medium  hover:bg-transparent"
      >
        {children}
        {getSortIcon(field)}
      </Button>
    </TableHead>
  )

  return (
    <div className="bg-white dark:bg-card border border-t-0 border-gray-200 dark:border-zinc-800 rounded-b-2xl shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <div className="min-w-[1200px]">
          <Table>
            <TableHeader className="sticky top-0 bg-white dark:bg-card z-10 pl-0">
              <TableRow>
                <SortableHeader field="planName" className="pr-24 pl-0 text-left text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900"><span className="text-gray-700 dark:text-gray-400">Plan Name</span></SortableHeader>
                <TableHead className="pr-16 pl-0 text-left text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900">LabCorp Billing Account</TableHead>
                <TableHead className="pr-0 pl-0 text-center text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900">Status</TableHead>
                <SortableHeader field="orderNo" className="pr-16 pl-16 text-left text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900"><span className="text-gray-700 dark:text-gray-400 text-center">Order No.</span></SortableHeader>
                <TableHead className="pr-24 pl-6 text-left text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900">Order ID</TableHead>
                <SortableHeader field="orderDate" className="pr-8 pl-0 text-left text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900"><span className="text-gray-700 dark:text-gray-400">Order Date</span></SortableHeader>
                <SortableHeader field="shippedDate" className="pr-16 pl-0 text-left text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900"><span className="text-gray-700 dark:text-gray-400">Shipped Date</span></SortableHeader>
                <TableHead className="pr-40 pl-6 text-left text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900">Kit ID</TableHead>
                <TableHead className="pr-32 pl-0 text-left text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900">Kit Name</TableHead>
                <SortableHeader field="quantity" className="pr-16 pl-0 text-left text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900"><span className="text-gray-700 dark:text-gray-400">Quantity</span></SortableHeader>
                <TableHead className="pr-40 pl-6 text-left text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900">Tracking ID</TableHead>
                <TableHead className="pr-32 pl-0 text-left text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900">Location</TableHead>
                <TableHead className="sticky right-0 z-20 flex items-center justify-center pr-16 pl-12 py-9 text-center text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={13} className="text-left py-2 text-gray-500 dark:text-gray-400">
                    No orders found
                  </TableCell>
                </TableRow>
              ) : (
                orders.map((order) => (
                  <TableRow key={order.orderId}>
                    <TableCell className="font-medium pl-12">{order.planName}</TableCell>
                    <TableCell className="font-mono text-sm pl-10 pr-0">{order.billingAccountNo}</TableCell>
                    <TableCell className="pr-0 pl-0 text-center">
                      <Badge 
                        variant={getStatusVariant(order.status)}
                        className={cn(
                          order.status === 'shipped' && 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900',
                          order.status === 'in_progress' && 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900'
                        )}
                      >
                        {getStatusLabel(order.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-mono pr-0 pl-0 text-center text-sm">{order.orderNo}</TableCell>
                    <TableCell className="font-mono pr-0 pl-0 text-sm">{order.orderId}</TableCell>
                    <TableCell className="pl-10 pr-0">
                      <div className="flex flex-col pl-2 pr-0">
                        <span>{formatOrderDateOnly(order.orderDate)}</span>
                        <span className="text-xs text-gray-400 dark:text-gray-500">{formatOrderTimeOnly(order.orderDate)} ET</span>
                      </div>
                    </TableCell>
                    <TableCell className="pl-10 pr-0">
                      {order.shippedDate ? (
                        <div className="flex flex-col pl-4 pr-0">
                          <span>{formatOrderDateOnly(order.shippedDate)}</span>
                          <span className="text-xs text-gray-400 dark:text-gray-500">{formatOrderTimeOnly(order.shippedDate)} ET</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 pl-12 pr-0 dark:text-gray-500">N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="font-mono text-sm pl-0 pr-8">{order.kitId}</TableCell>
                    <TableCell className="pl-0 pr-16">{order.kitName}</TableCell>
                    <TableCell className="pl-16 pr-8">{order.quantity}</TableCell>
                    <TableCell className="font-mono text-sm pl-0 pr-0">
                      {order.trackingId || (
                        <span className="text-gray-400 pl-12 pr-0 dark:text-gray-500">N/A</span>
                      )}
                    </TableCell>
                    <TableCell className="pl-0 pr-16">{order.location}</TableCell>
                    <TableCell className="sticky right-0 z-10 flex items-center text-center bg-white dark:bg-card pl-10 pr-10 ">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewOrder(order.orderId)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
