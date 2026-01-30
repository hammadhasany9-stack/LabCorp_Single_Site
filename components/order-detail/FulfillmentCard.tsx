'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Copy, Check, Package, Truck, MapPin } from 'lucide-react'
import { OutboundTrackingModal } from './OutboundTrackingModal'

interface FulfillmentCardProps {
  outboundCarrier: string
  outboundTrackingId?: string
  outboundTrackingIds?: string[]
  inboundCarrier: string
  orderStatus: 'in_progress' | 'shipped' | 'cancelled'
}

export function FulfillmentCard({
  outboundCarrier,
  outboundTrackingId,
  outboundTrackingIds,
  inboundCarrier,
  orderStatus
}: FulfillmentCardProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [trackingModalOpen, setTrackingModalOpen] = useState(false)

  // Use outboundTrackingIds if available, otherwise fallback to single outboundTrackingId
  const trackingIds = outboundTrackingIds && outboundTrackingIds.length > 0 
    ? outboundTrackingIds 
    : outboundTrackingId 
    ? [outboundTrackingId] 
    : []
  
  const isTrackingEnabled = orderStatus === 'shipped' && trackingIds.length > 0

  const handleCopyTracking = async (trackingId: string, index: number) => {
    await navigator.clipboard.writeText(trackingId)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleTrackClick = () => {
    if (isTrackingEnabled) {
      setTrackingModalOpen(true)
    }
  }

  return (
    <Card className="rounded-2xl shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-50">
          Fulfillment & Tracking
        </CardTitle>
      </CardHeader>
      <Separator className="mb-4" />
      <CardContent className="space-y-6">
        {/* Outbound Shipment */}
        <div className="p-4 bg-green-50 dark:bg-green-950 rounded-xl border-2 border-green-200 dark:border-green-900">
            <div className="flex items-center justify-between gap-2 mb-3">
            <div className="flex items-center gap-2">
              <Truck className="h-5 w-5 text-green-600 dark:text-green-400" />
              <h3 className="text-base font-semibold text-green-900 dark:text-green-100">
                Outbound Shipment
              </h3>
            </div>
            {trackingIds.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleTrackClick}
                disabled={!isTrackingEnabled}
                className="gap-1.5 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 border-green-300 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              >
                <MapPin className="h-3.5 w-3.5" />
                Track
              </Button>
            )}
          </div>
          
          <div className="space-y-3">
            <div>
              <label className="text-sm text-green-700 dark:text-green-300">Carrier Name</label>
              <p className="text-base font-medium text-green-900 dark:text-green-50 mt-1">
                {outboundCarrier}
              </p>
            </div>
            
            {trackingIds.length > 0 ? (
              <div>
                <label className="text-sm text-green-700 dark:text-green-300">
                  Tracking ID{trackingIds.length > 1 ? 's' : ''}
                </label>
                <div className="space-y-2 mt-1">
                  {trackingIds.map((trackingId, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <p className="text-base font-medium font-mono text-green-900 dark:text-green-50 mr-8">
                        {trackingId}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyTracking(trackingId, index)}
                        className="h-8 w-8 p-0 flex-shrink-0 text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:bg-green-100 dark:hover:bg-green-900"
                      >
                        {copiedIndex === index ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <label className="text-sm text-green-700 dark:text-green-300">Tracking ID</label>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  Awaiting shipment
                </p>
              </div>
            )}
          </div>
        </div>
        
        {/* Inbound Shipment */}
        <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-xl border-2 border-blue-200 dark:border-blue-900">
          <div className="flex items-center gap-2 mb-3">
            <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-base font-semibold text-blue-900 dark:text-blue-100">
              Inbound Shipment
            </h3>
          </div>
          
          <div>
            <label className="text-sm text-blue-700 dark:text-blue-300">Carrier Type</label>
            <p className="text-base font-medium text-blue-900 dark:text-blue-50 mt-1">
              {inboundCarrier}
            </p>
          </div>
          
          <p className="text-xs text-blue-600 dark:text-blue-400 mt-3">
            Individual tracking IDs available in Custom Requisition table below
          </p>
        </div>
      </CardContent>

      {/* Outbound Tracking Modal */}
      {trackingIds.length > 0 && (
        <OutboundTrackingModal
          open={trackingModalOpen}
          onOpenChange={setTrackingModalOpen}
          trackingIds={trackingIds}
          carrierType={outboundCarrier}
        />
      )}
    </Card>
  )
}
