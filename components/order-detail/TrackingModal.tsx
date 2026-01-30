'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Copy, Check, Package, ChevronLeft, ChevronRight, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { CustomRequisition } from '@/lib/types/order-detail'
import { TrackingStatusStepper } from './TrackingStatusStepper'
import { cn } from '@/lib/utils'

interface TrackingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  requisitions: CustomRequisition[]
  initialIndex: number
  carrierType?: string
}

export function TrackingModal({
  open,
  onOpenChange,
  requisitions,
  initialIndex,
  carrierType = 'USPS'
}: TrackingModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [copied, setCopied] = useState(false)

  // Update current index when modal opens with new initial index
  useState(() => {
    if (open) {
      setCurrentIndex(initialIndex)
    }
  })

  const currentRequisition = requisitions[currentIndex]
  
  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : requisitions.length - 1))
    setCopied(false)
  }
  
  const handleNext = () => {
    setCurrentIndex((prev) => (prev < requisitions.length - 1 ? prev + 1 : 0))
    setCopied(false)
  }

  const handleCopyTracking = async () => {
    if (!currentRequisition) return
    await navigator.clipboard.writeText(currentRequisition.inboundTrackingId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!currentRequisition) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 z-10 w-full py-4 mt-4 flex items-center backdrop-blur-sm dark: backdrop-blur-sm">
          <div className="flex items-center justify-between gap-6">
            {/* Navigation Chevron - Left */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              className="h-8 w-8 rounded-xl bg-gray-200 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-800"
              disabled={requisitions.length <= 1}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            {/* Title */}
            <DialogTitle className="text-xl font-bold text-gray-900 dark:text-gray-50 flex-1 text-center px-8">
              Package Tracking
            </DialogTitle>

            {/* Navigation Chevron - Right */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="h-8 w-8 bg-gray-200 dark:bg-zinc-800 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800"
              disabled={requisitions.length <= 1}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
            </div>
          {/* Navigation Info */}
          {requisitions.length > 1 && (
            <p className="text-xs text-gray-500 dark:text-gray-500 text-center mt-2">
              Showing {currentIndex + 1} of {requisitions.length} tracking records
            </p>
          )}
          
        </DialogHeader>
        
        <div className="space-y-6 py-2">
          {/* Header Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Control ID */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-zinc-900 rounded-xl">
              <div className="flex-shrink-0 w-10 h-10 bg-blue-100 dark:bg-blue-950 rounded-full flex items-center justify-center">
                <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <label className="text-xs text-gray-600 dark:text-gray-400 font-medium uppercase">
                  Control ID
                </label>
                <p className="text-sm font-mono font-semibold text-gray-900 dark:text-gray-50 mt-0.5 truncate">
                  {currentRequisition.controlId}
                </p>
              </div>
            </div>

            {/* Carrier Type */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-zinc-900 rounded-xl">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-100 dark:bg-purple-950 rounded-full flex items-center justify-center">
                <Truck className="h-5 w-5 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <label className="text-xs text-gray-600 dark:text-gray-400 font-medium uppercase">
                  Carrier Type
                </label>
                <p className="text-sm font-semibold text-gray-900 dark:text-gray-50 mt-0.5">
                  {currentRequisition.carrierType || carrierType}
                </p>
              </div>
            </div>
          </div>

          {/* Inbound Shipment Title & Tracking ID */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50 uppercase tracking-wide">
              Inbound Shipment
            </h3>
            
            <div className="flex items-center gap-2 p-3 bg-white dark:bg-card border-2 border-gray-200 dark:border-zinc-800 rounded-lg">
              <div className="flex-1 min-w-0">
                <label className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  Tracking ID
                </label>
                <p className="text-sm font-mono font-semibold text-gray-900 dark:text-gray-50 mt-0.5 break-all">
                  {currentRequisition.inboundTrackingId}
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
                href={`https://tools.usps.com/go/TrackConfirmAction?tLabels=${currentRequisition.inboundTrackingId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline"
              >
                Track on {currentRequisition.carrierType || carrierType} Website →
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
              steps={currentRequisition.trackingSteps || []}
              currentStatus={currentRequisition.currentStatus}
            />
          </div>

          {/* Info Box */}
          <div className="p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-900">
            <p className="text-xs text-blue-800 dark:text-blue-200">
              <strong>Note:</strong> Tracking information is provided by {currentRequisition.carrierType || carrierType}. 
              Delivery times may vary based on location and service type.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
