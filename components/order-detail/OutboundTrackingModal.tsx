'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Copy, Check, Truck, Package, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'
import { TrackingStatus, TrackingStep } from '@/lib/types/order-detail'
import { TrackingStatusStepper } from './TrackingStatusStepper'

interface OutboundTrackingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  trackingIds: string[]
  carrierType: string
  initialIndex?: number
}

// Generate mock tracking data for outbound shipment
const generateOutboundTrackingData = (): { currentStatus: TrackingStatus; steps: TrackingStep[] } => {
  // For outbound, we'll use more complete tracking since order is already shipped
  const currentStatus: TrackingStatus = 'delivered' // Most outbound shipments would be delivered
  const baseDate = new Date()
  baseDate.setDate(baseDate.getDate() - 3) // Started 3 days ago
  
  const steps: TrackingStep[] = [
    {
      status: 'label_created',
      timestamp: new Date(baseDate.getTime())
    },
    {
      status: 'in_transit',
      timestamp: new Date(baseDate.getTime() + 12 * 60 * 60 * 1000) // +12 hours
    },
    {
      status: 'out_for_delivery',
      timestamp: new Date(baseDate.getTime() + 48 * 60 * 60 * 1000) // +48 hours
    },
    {
      status: 'delivered',
      timestamp: new Date(baseDate.getTime() + 60 * 60 * 60 * 1000) // +60 hours
    }
  ]
  
  return { currentStatus, steps }
}

export function OutboundTrackingModal({
  open,
  onOpenChange,
  trackingIds,
  carrierType,
  initialIndex = 0
}: OutboundTrackingModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [copied, setCopied] = useState(false)
  
  // Update current index when modal opens with new initial index
  useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex)
    }
  }, [open, initialIndex])

  const currentTrackingId = trackingIds[currentIndex]
  const trackingData = generateOutboundTrackingData()

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : trackingIds.length - 1))
    setCopied(false)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < trackingIds.length - 1 ? prev + 1 : 0))
    setCopied(false)
  }

  const handleCopyTracking = async () => {
    await navigator.clipboard.writeText(currentTrackingId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Generate carrier-specific tracking URL
  const getTrackingUrl = () => {
    const carrier = carrierType.toLowerCase()
    if (carrier.includes('fedex')) {
      return `https://www.fedex.com/fedextrack/?trknbr=${currentTrackingId}`
    } else if (carrier.includes('ups')) {
      return `https://www.ups.com/track?tracknum=${currentTrackingId}`
    } else if (carrier.includes('usps')) {
      return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${currentTrackingId}`
    }
    return `#` // Default fallback
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 z-10 w-full py-4 mt-4 flex items-center backdrop-blur-sm dark:backdrop-blur-sm">
          <div className="flex items-center justify-between gap-6">
            {/* Navigation Chevron - Left */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              className="h-8 w-8 rounded-xl bg-gray-200 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-800"
              disabled={trackingIds.length <= 1}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            {/* Title */}
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-50 flex-1 text-center px-8">
              Outbound Package Tracking
            </DialogTitle>

            {/* Navigation Chevron - Right */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="h-8 w-8 bg-gray-200 dark:bg-zinc-800 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800"
              disabled={trackingIds.length <= 1}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          
          {/* Navigation Info */}
          {trackingIds.length > 1 && (
            <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-2">
              Showing {currentIndex + 1} of {trackingIds.length} tracking records
            </p>
          )}
        </DialogHeader>
        
        <div className="space-y-6 py-2">
          {/* Header Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Tracking ID */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-zinc-900 rounded-xl md:col-span-1">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center">
                <Package className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <label className="text-xs text-gray-600 dark:text-gray-400 font-medium uppercase">
                  Tracking ID
                </label>
                <p className="text-sm font-mono font-semibold text-gray-900 dark:text-gray-50 mt-0.5 truncate">
                  {currentTrackingId}
                </p>
              </div>
            </div>

            {/* Carrier Type */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-zinc-900 rounded-xl md:col-span-1">
              <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center">
                <Truck className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-600 dark:text-gray-400 font-medium uppercase">
                  Carrier Type
                </label>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-50 mt-0.5">
                  {carrierType}
                </p>
              </div>
            </div>
          </div>

          {/* Outbound Shipment Title & Tracking ID */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50 uppercase tracking-wide">
              Outbound Shipment to Client
            </h3>
            
            <div className="flex items-center gap-2 p-3 bg-white dark:bg-card border-2 border-gray-200 dark:border-zinc-800 rounded-lg">
              <div className="flex-1 min-w-0">
                <label className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  Tracking ID
                </label>
                <p className="text-sm font-mono font-semibold text-gray-900 dark:text-gray-50 mt-0.5 break-all">
                  {currentTrackingId}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopyTracking}
                className="h-9 w-9 p-0 flex-shrink-0"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Tracking Link */}
            <div className="pt-1">
              <a
                href={getTrackingUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:underline"
              >
                Track on {carrierType} Website →
              </a>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200 dark:border-zinc-800" />

          {/* Tracking Status Stepper */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50 uppercase tracking-wide mb-4">
              Shipment Status
            </h3>
            <TrackingStatusStepper
              steps={trackingData.steps}
              currentStatus={trackingData.currentStatus}
            />
          </div>

          {/* Info Box */}
          <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-900">
            <p className="text-xs text-green-800 dark:text-green-200">
              <strong>Note:</strong> Tracking information is provided by {carrierType}. 
              This shipment is being sent from our facility to the client location.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
