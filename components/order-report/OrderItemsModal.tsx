'use client'

import { useState, useRef, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Copy, Check, FileText, RotateCcw, Download, ExternalLink } from 'lucide-react'
import { OrderHistoryItem } from '@/lib/types/order-history'
import { OrderItem } from '@/lib/types/order-item'
import { format } from 'date-fns'
import { cn } from '@/lib/utils'

interface OrderItemsModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  order: OrderHistoryItem | null
}

export function OrderItemsModal({
  open,
  onOpenChange,
  order,
}: OrderItemsModalProps) {
  const [copiedTrackingId, setCopiedTrackingId] = useState<string | null>(null)
  const tableContainerRef = useRef<HTMLDivElement>(null)
  const stickyScrollbarRef = useRef<HTMLDivElement>(null)
  const stickyScrollbarContentRef = useRef<HTMLDivElement>(null)

  // Sync sticky scrollbar with table scrollbar and update width
  useEffect(() => {
    if (!open) return

    const tableContainer = tableContainerRef.current
    const stickyScrollbar = stickyScrollbarRef.current
    const stickyScrollbarContent = stickyScrollbarContentRef.current

    if (!tableContainer || !stickyScrollbar || !stickyScrollbarContent) return

    // Update sticky scrollbar width to match table content
    const updateScrollbarWidth = () => {
      const table = tableContainer.querySelector('table')
      if (table) {
        stickyScrollbarContent.style.width = `${table.scrollWidth}px`
      }
    }

    // Delay initial update to ensure table is rendered
    const timeoutId = setTimeout(() => {
      updateScrollbarWidth()
    }, 100)

    // Update width on resize
    const resizeObserver = new ResizeObserver(updateScrollbarWidth)
    const table = tableContainer.querySelector('table')
    if (table) {
      resizeObserver.observe(table)
    }

    const handleTableScroll = () => {
      stickyScrollbar.scrollLeft = tableContainer.scrollLeft
    }

    const handleStickyScroll = () => {
      tableContainer.scrollLeft = stickyScrollbar.scrollLeft
    }

    tableContainer.addEventListener('scroll', handleTableScroll)
    stickyScrollbar.addEventListener('scroll', handleStickyScroll)

    return () => {
      clearTimeout(timeoutId)
      tableContainer.removeEventListener('scroll', handleTableScroll)
      stickyScrollbar.removeEventListener('scroll', handleStickyScroll)
      resizeObserver.disconnect()
    }
  }, [open, order])

  if (!order) return null

  const orderItems = order.orderItems || []

  const handleCopyTracking = async (trackingNo: string, itemId: string) => {
    await navigator.clipboard.writeText(trackingNo)
    setCopiedTrackingId(itemId)
    setTimeout(() => setCopiedTrackingId(null), 2000)
  }

  const handleGenerateAsset = (itemId: string) => {
    console.log('Generate asset for item:', itemId)
    // TODO: Implement asset generation logic
  }

  const handleReset = (itemId: string) => {
    console.log('Reset item:', itemId)
    // TODO: Implement reset logic
  }

  const handleGenerateAllAssets = () => {
    console.log('Generate all assets for order:', order.orderId)
    // TODO: Implement bulk asset generation logic
  }

  const renderAssetPath = (path: string | null, label: string) => {
    if (!path) {
      return <span className="text-xs text-gray-400 dark:text-gray-600">Not Generated</span>
    }
    return (
      <a
        href={path}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline inline-flex items-center gap-1"
      >
        <ExternalLink className="h-3 w-3" />
        {label}
      </a>
    )
  }

  const renderAssetPdf = (path: string | null, label: string) => {
    if (!path) {
      return <span className="text-xs text-gray-400 dark:text-gray-600">Not Generated</span>
    }
    return (
      <a
        href={path}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline inline-flex items-center gap-1"
      >
        <Download className="h-3 w-3" />
        {label}
      </a>
    )
  }

  const renderTrackingCell = (trackingNo: string, itemId: string, type: 'outbound' | 'inbound') => {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs font-mono text-gray-900 dark:text-gray-50">{trackingNo}</span>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => handleCopyTracking(trackingNo, `${itemId}-${type}`)}
          className="h-6 w-6 p-0"
        >
          {copiedTrackingId === `${itemId}-${type}` ? (
            <Check className="h-3 w-3 text-green-600" />
          ) : (
            <Copy className="h-3 w-3" />
          )}
        </Button>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] max-h-[90vh] overflow-hidden flex flex-col">
        <style>{`
          .sticky-scrollbar-custom::-webkit-scrollbar {
            height: 12px;
          }
          .sticky-scrollbar-custom::-webkit-scrollbar-track {
            background: #e5e7eb;
            border-radius: 6px;
          }
          .dark .sticky-scrollbar-custom::-webkit-scrollbar-track {
            background: #3f3f46;
          }
          .sticky-scrollbar-custom::-webkit-scrollbar-thumb {
            background: #9ca3af;
            border-radius: 6px;
          }
          .sticky-scrollbar-custom::-webkit-scrollbar-thumb:hover {
            background: #6b7280;
          }
          .dark .sticky-scrollbar-custom::-webkit-scrollbar-thumb {
            background: #71717a;
          }
          .dark .sticky-scrollbar-custom::-webkit-scrollbar-thumb:hover {
            background: #a1a1aa;
          }
        `}</style>
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            Order Items - {order.orderNo}
          </DialogTitle>
          <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
            <div>
              <span className="font-medium">Program:</span> {order.siteGroup}
            </div>
            <div>
              <span className="font-medium">Kit:</span> {order.kitName}
            </div>
            <div>
              <span className="font-medium">Total Quantity:</span> {order.quantity}
            </div>
            <div>
              <span className="font-medium">Items:</span> {orderItems.length}
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mt-3 text-sm bg-blue-50 dark:bg-blue-950/20 p-3 rounded-lg border border-blue-200 dark:border-blue-900">
            <div>
              <span className="font-medium text-blue-900 dark:text-blue-300">Parent Order Created:</span>{' '}
              <span className="text-blue-700 dark:text-blue-400">
                {order.createdAt ? format(order.createdAt, 'MMM dd, yyyy hh:mm:ss a') : 'N/A'}
              </span>
            </div>
            <div>
              <span className="font-medium text-blue-900 dark:text-blue-300">Parent Order Updated:</span>{' '}
              <span className="text-blue-700 dark:text-blue-400">
                {order.updatedAt ? format(order.updatedAt, 'MMM dd, yyyy hh:mm:ss a') : 'N/A'}
              </span>
            </div>
          </div>
        </DialogHeader>

        {/* Table Title Section with Generate All Assets Button */}
        <div className="flex items-center justify-between py-3 px-1 flex-shrink-0">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Order Items Details
          </h3>
          <Button
            onClick={handleGenerateAllAssets}
            className="bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 text-white"
            size="sm"
          >
            <FileText className="h-4 w-4 mr-2" />
            Generate All Assets
          </Button>
        </div>

        {/* Scrollable Table Container */}
        <div 
          ref={tableContainerRef}
          className="flex-1 overflow-x-auto overflow-y-auto border border-gray-200 dark:border-zinc-800 rounded-lg relative order-items-table-container"
        >
            <Table>
              <TableHeader className="sticky top-0 bg-gray-100 dark:bg-zinc-900 z-10">
              <TableRow>
                <TableHead className="bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-gray-400 min-w-[120px]">
                  Item ID
                </TableHead>
                <TableHead className="bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-gray-400 min-w-[140px]">
                  Control ID
                </TableHead>
                <TableHead className="bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-gray-400 min-w-[120px]">
                  TRF Path
                </TableHead>
                <TableHead className="bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-gray-400 min-w-[150px]">
                  Shipping Label Path
                </TableHead>
                <TableHead className="bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-gray-400 min-w-[150px]">
                  Shipping Label PDF
                </TableHead>
                <TableHead className="bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-gray-400 min-w-[150px]">
                  Return Label Path
                </TableHead>
                <TableHead className="bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-gray-400 min-w-[150px]">
                  Return Label PDF
                </TableHead>
                <TableHead className="bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-gray-400 min-w-[120px]">
                  Sticker Path
                </TableHead>
                <TableHead className="bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-gray-400 min-w-[200px]">
                  Shipment Outbound Tracking
                </TableHead>
                <TableHead className="bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-gray-400 min-w-[200px]">
                  Return Inbound Tracking
                </TableHead>
                <TableHead className="bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-gray-400 text-center min-w-[120px]">
                  Status
                </TableHead>
                <TableHead className="bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-gray-400 min-w-[180px]">
                  Created At
                </TableHead>
                <TableHead className="bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-gray-400 min-w-[180px]">
                  Updated At
                </TableHead>
                <TableHead className="bg-gray-100 dark:bg-zinc-900 text-gray-700 dark:text-gray-400 text-center min-w-[220px]">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orderItems.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={14} className="text-center py-8 text-gray-500 dark:text-gray-400">
                    No order items found
                  </TableCell>
                </TableRow>
              ) : (
                orderItems.map((item) => (
                  <TableRow key={item.itemId} className="hover:bg-gray-50 dark:hover:bg-zinc-900/50">
                    <TableCell className="font-mono text-xs">{item.itemId}</TableCell>
                    <TableCell className="font-mono text-xs">{item.controlId}</TableCell>
                    <TableCell>{renderAssetPath(item.trfPath, 'TRF Path')}</TableCell>
                    <TableCell>{renderAssetPath(item.shippingLabelPath, 'Shipping Path')}</TableCell>
                    <TableCell>{renderAssetPdf(item.shippingLabelPdf, 'Shipping PDF')}</TableCell>
                    <TableCell>{renderAssetPath(item.returnLabelPath, 'Return Path')}</TableCell>
                    <TableCell>{renderAssetPdf(item.returnLabelPdf, 'Return PDF')}</TableCell>
                    <TableCell>{renderAssetPath(item.stickerPath, 'Sticker Path')}</TableCell>
                    <TableCell>{renderTrackingCell(item.outboundTrackingNo, item.itemId, 'outbound')}</TableCell>
                    <TableCell>{renderTrackingCell(item.inboundTrackingNo, item.itemId, 'inbound')}</TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant={item.status === 'approved' ? 'default' : 'secondary'}
                        className={cn(
                          item.status === 'approved' && 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900',
                          item.status === 'inprocess' && 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400 hover:bg-yellow-200 dark:hover:bg-yellow-900'
                        )}
                      >
                        {item.status === 'approved' ? 'Approved' : 'In Process'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-gray-600 dark:text-gray-400">
                      {format(item.createdAt, 'MMM dd, yyyy hh:mm:ss a')}
                    </TableCell>
                    <TableCell className="text-xs text-gray-600 dark:text-gray-400">
                      {format(item.updatedAt, 'MMM dd, yyyy hh:mm:ss a')}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleGenerateAsset(item.itemId)}
                          className="h-8 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-950"
                        >
                          <FileText className="h-4 w-4 mr-1" />
                          Generate Asset
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReset(item.itemId)}
                          className="h-8 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-950"
                        >
                          <RotateCcw className="h-4 w-4 mr-1" />
                          Reset
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
              </TableBody>
            </Table>
        </div>

      </DialogContent>

      {/* Sticky Horizontal Scrollbar - Fixed to viewport bottom (outside modal content) */}
      {open && (
        <div 
          ref={stickyScrollbarRef}
          className="fixed bottom-0 left-0 right-0 z-[9999] overflow-x-auto overflow-y-hidden bg-gray-100 dark:bg-zinc-900 border-t-2 border-gray-300 dark:border-zinc-700 sticky-scrollbar-custom shadow-lg"
          style={{ height: '20px', minHeight: '20px' }}
        >
          <div 
            ref={stickyScrollbarContentRef}
            style={{ height: '100%', minWidth: '100%' }}
          />
        </div>
      )}
    </Dialog>
  )
}
