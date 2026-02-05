'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Copy, Check, Truck, Package, ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useState, useEffect } from 'react'
import { CustomRequisition, TrackingStatus, TrackingStep } from '@/lib/types/order-detail'
import { TrackingStatusStepper } from './TrackingStatusStepper'
import { format } from 'date-fns'

interface UnifiedTrackingModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  requisitions: CustomRequisition[]
  initialIndex?: number
  carrierType?: string
  shouldShowPatientData?: boolean
}

// Generate mock tracking data for outbound shipment
const generateOutboundTrackingData = (): { currentStatus: TrackingStatus; steps: TrackingStep[] } => {
  const currentStatus: TrackingStatus = 'delivered'
  const baseDate = new Date()
  baseDate.setDate(baseDate.getDate() - 3)
  
  const steps: TrackingStep[] = [
    {
      status: 'label_created',
      timestamp: new Date(baseDate.getTime())
    },
    {
      status: 'in_transit',
      timestamp: new Date(baseDate.getTime() + 12 * 60 * 60 * 1000)
    },
    {
      status: 'out_for_delivery',
      timestamp: new Date(baseDate.getTime() + 48 * 60 * 60 * 1000)
    },
    {
      status: 'delivered',
      timestamp: new Date(baseDate.getTime() + 60 * 60 * 60 * 1000)
    }
  ]
  
  return { currentStatus, steps }
}

export function UnifiedTrackingModal({
  open,
  onOpenChange,
  requisitions,
  initialIndex = 0,
  carrierType = 'USPS',
  shouldShowPatientData = true
}: UnifiedTrackingModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [copiedOutbound, setCopiedOutbound] = useState(false)
  const [copiedInbound, setCopiedInbound] = useState(false)
  const [activeTab, setActiveTab] = useState<'outbound' | 'inbound'>('outbound')
  
  // Update current index when modal opens with new initial index
  useEffect(() => {
    if (open) {
      setCurrentIndex(initialIndex)
    }
  }, [open, initialIndex])

  const currentRequisition = requisitions[currentIndex]
  const outboundTrackingData = generateOutboundTrackingData()

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : requisitions.length - 1))
    setCopiedOutbound(false)
    setCopiedInbound(false)
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < requisitions.length - 1 ? prev + 1 : 0))
    setCopiedOutbound(false)
    setCopiedInbound(false)
  }

  const handleControlIdChange = (controlId: string) => {
    const index = requisitions.findIndex(req => req.controlId === controlId)
    if (index !== -1) {
      setCurrentIndex(index)
      setCopiedOutbound(false)
      setCopiedInbound(false)
    }
  }

  const handleCopyOutbound = async () => {
    if (!currentRequisition?.outboundTrackingId) return
    await navigator.clipboard.writeText(currentRequisition.outboundTrackingId)
    setCopiedOutbound(true)
    setTimeout(() => setCopiedOutbound(false), 2000)
  }

  const handleCopyInbound = async () => {
    if (!currentRequisition) return
    await navigator.clipboard.writeText(currentRequisition.inboundTrackingId)
    setCopiedInbound(true)
    setTimeout(() => setCopiedInbound(false), 2000)
  }

  // Generate carrier-specific tracking URL
  const getTrackingUrl = (trackingId: string, type: 'outbound' | 'inbound') => {
    const carrier = carrierType.toLowerCase()
    if (carrier.includes('fedex')) {
      return `https://www.fedex.com/fedextrack/?trknbr=${trackingId}`
    } else if (carrier.includes('ups')) {
      return `https://www.ups.com/track?tracknum=${trackingId}`
    } else if (carrier.includes('usps')) {
      return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${trackingId}`
    }
    return `#`
  }

  if (!currentRequisition) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 z-10 w-full py-4 mt-4 flex items-center backdrop-blur-sm dark:backdrop-blur-sm">
          <div className="flex items-center justify-between gap-4 w-80">
            {/* Navigation Chevron - Left */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              className="h-8 w-8 rounded-xl bg-gray-200 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-800 flex-shrink-0"
              disabled={requisitions.length <= 1}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>

            {/* Title - Centered */}
            <DialogTitle className="flex-1 text-center text-xl font-bold text-gray-900 dark:text-gray-50">
              Package Tracking
            </DialogTitle>

            {/* Navigation Chevron - Right */}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleNext}
              className="h-8 w-8 bg-gray-200 dark:bg-zinc-800 rounded-xl hover:bg-gray-100 dark:hover:bg-zinc-800 flex-shrink-0"
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

        {/* Control ID and Carrier Type - Below Header */}
        {requisitions.length > 1 && (
          <div className="flex justify-center pt-2 pb-4 border-b border-gray-200 dark:border-zinc-800">
            <Select value={currentRequisition.controlId} onValueChange={handleControlIdChange}>
              <SelectTrigger className="w-[300px] h-10">
                <div className="flex items-center w-full">
                  <span className="font-mono font-semibold text-sm">{currentRequisition.controlId}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-3">
                    {currentRequisition.carrierType || carrierType}
                  </span>
                </div>
              </SelectTrigger>
              <SelectContent>
                {requisitions.map((req) => (
                  <SelectItem key={req.controlId} value={req.controlId}>
                    <div className="flex items-center justify-between gap-4 w-full">
                      <span className="font-mono font-semibold">{req.controlId}</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {req.carrierType || carrierType}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
          </div>
        )}
        
        <div className="space-y-6 py-2">
          {/* Header Info Section - Control ID and Patient Info */}
          <div className="grid grid-cols-1">
            {/* Control ID */}
            <div className="flex flex-row gap-28 ">
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
              <div className="flex items-center gap-3 p-4">
                <div className="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-950 rounded-full flex items-center justify-center">
                  <Truck className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-green-700 dark:text-green-300 font-medium uppercase">
                    Carrier Type
                  </label>
                  <p className="text-sm font-semibold text-green-900 dark:text-green-50 mt-0.5">
                    {carrierType}
                  </p>
                </div>
              </div>
            
            </div>
            {/* Patient Information (if available and authorized) */}
            {currentRequisition.patientName && shouldShowPatientData && (
              <div className="p-4 bg-gray-50 dark:bg-zinc-900 rounded-xl">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                      Patient Name
                    </label>
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-50 mt-0.5">
                      {currentRequisition.patientName}
                    </p>
                  </div>
                  {currentRequisition.patientDOB && (
                    <div>
                      <label className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                        Date of Birth
                      </label>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-50 mt-0.5">
                        {format(currentRequisition.patientDOB, 'MM/dd/yyyy')}
                      </p>
                    </div>
                  )}
                  {currentRequisition.patientAddress && (
                    <div className="col-span-2">
                      <label className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                        Address
                      </label>
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-50 mt-0.5">
                        {currentRequisition.patientAddress}
                        {currentRequisition.patientCity && `, ${currentRequisition.patientCity}`}
                        {currentRequisition.patientState && `, ${currentRequisition.patientState}`}
                        {currentRequisition.patientZip && ` ${currentRequisition.patientZip}`}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Patient Information Hidden Notice (if not authorized) */}
            {currentRequisition.patientName && !shouldShowPatientData && (
              <div className="p-4 bg-amber-50 dark:bg-amber-950 rounded-xl border border-amber-200 dark:border-amber-900">
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  <strong>Patient information hidden.</strong> Please authorize access in the Custom Requisition table to view patient details.
                </p>
              </div>
            )}
          </div>

          {/* Tabs for Outbound/Inbound */}
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'outbound' | 'inbound')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="outbound">Outbound (Member)</TabsTrigger>
              <TabsTrigger value="inbound">Inbound (Lab)</TabsTrigger>
            </TabsList>

            {/* Outbound Tab Content */}
            <TabsContent value="outbound" className="space-y-6 mt-4">
              

              {/* Outbound Shipment Title & Tracking ID */}
              <div className="space-y-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50 uppercase tracking-wide">
                  Outbound Shipment to Member
                </h3>
                
                {currentRequisition.outboundTrackingId ? (
                  <>
                    <div className="flex items-center gap-2 p-3 bg-white dark:bg-card border-2 border-gray-200 dark:border-zinc-800 rounded-lg">
                      <div className="flex-1 min-w-0">
                        <label className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                          Tracking ID
                        </label>
                        <p className="text-sm font-mono font-semibold text-gray-900 dark:text-gray-50 mt-0.5 break-all">
                          {currentRequisition.outboundTrackingId}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCopyOutbound}
                        className="h-9 w-9 p-0 flex-shrink-0"
                      >
                        {copiedOutbound ? (
                          <Check className="h-4 w-4 text-green-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>

                    {/* Tracking Link */}
                    <div className="pt-1">
                      <a
                        href={getTrackingUrl(currentRequisition.outboundTrackingId, 'outbound')}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 hover:underline"
                      >
                        Track on {carrierType} Website →
                      </a>
                    </div>
                  </>
                ) : (
                  <div className="p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Tracking information not yet available
                    </p>
                  </div>
                )}
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 dark:border-zinc-800" />

              {/* Tracking Status Stepper */}
              {currentRequisition.outboundTrackingId && (
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50 uppercase tracking-wide mb-4">
                    Shipment Status
                  </h3>
                  <TrackingStatusStepper
                    steps={outboundTrackingData.steps}
                    currentStatus={outboundTrackingData.currentStatus}
                  />
                </div>
              )}

              {/* Info Box */}
              <div className="p-3 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-900">
                <p className="text-xs text-green-800 dark:text-green-200">
                  <strong>Note:</strong> Tracking information is provided by {carrierType}. 
                  This shipment is being sent from our facility to the member location.
                </p>
              </div>
            </TabsContent>

            {/* Inbound Tab Content */}
            <TabsContent value="inbound" className="space-y-6 mt-6">

              {/* Inbound Shipment Title & Tracking ID */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-50 uppercase tracking-wide">
                  Inbound Shipment to Lab
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
                    onClick={handleCopyInbound}
                    className="h-9 w-9 p-0 flex-shrink-0"
                  >
                    {copiedInbound ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>

                {/* Tracking Link */}
                <div className="pt-1">
                  <a
                    href={getTrackingUrl(currentRequisition.inboundTrackingId, 'inbound')}
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
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  )
}
