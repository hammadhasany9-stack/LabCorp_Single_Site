'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { CustomRequisition } from '@/lib/types/order-detail'
import { TrackingModal } from './TrackingModal'
import { MapPin } from 'lucide-react'

interface CustomRequisitionTableProps {
  requisitions: CustomRequisition[]
  orderStatus: 'in_progress' | 'shipped' | 'cancelled'
}

export function CustomRequisitionTable({ requisitions, orderStatus }: CustomRequisitionTableProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  
  const isTrackingEnabled = orderStatus === 'shipped'
  
  const handleTrackClick = (index: number) => {
    if (!isTrackingEnabled) return
    setSelectedIndex(index)
    setModalOpen(true)
  }
  
  return (
    <>
      <Card className="rounded-2xl shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              Custom Requisition
            </CardTitle>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Total: {requisitions.length} records
            </span>
          </div>
        </CardHeader>
        <Separator className="mb-0" />
        <CardContent className="p-0">
          <div className="overflow-hidden">
            <div className="max-h-[550px] overflow-y-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white dark:bg-card z-10">
                  <TableRow>
                    <TableHead className="text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900">
                      Control ID
                    </TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900">
                      Inbound Tracking ID (USPS)
                    </TableHead>
                    <TableHead className="text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900 text-center">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requisitions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No custom requisitions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    requisitions.map((req, index) => (
                      <TableRow key={`${req.controlId}-${index}`}>
                        <TableCell className="font-mono text-sm">
                          {req.controlId}
                        </TableCell>
                        <TableCell className="font-mono text-sm">
                          {req.inboundTrackingId}
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTrackClick(index)}
                            disabled={!isTrackingEnabled}
                            className="gap-1.5 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 border-blue-200 dark:border-blue-900 hover:bg-blue-50 dark:hover:bg-blue-950 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                          >
                            <MapPin className="h-3.5 w-3.5" />
                            Track
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          
          <div className="px-6 py-4 border-t border-gray-200 dark:border-zinc-800">
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Showing all {requisitions.length} records
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-1">
              Scroll within the table to view all records
            </p>
            {!isTrackingEnabled && (
              <p className="text-xs text-amber-600 dark:text-amber-400 text-center mt-2 font-medium">
                Tracking is only available for shipped orders
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tracking Modal */}
      <TrackingModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        requisitions={requisitions}
        initialIndex={selectedIndex}
        carrierType="USPS"
      />
    </>
  )
}
