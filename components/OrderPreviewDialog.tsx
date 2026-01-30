'use client'

import { OrderFormData } from '@/lib/types/order'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { 
  Package, 
  MapPin, 
  User, 
  Phone, 
  Calendar,
  FileText,
  Home
} from 'lucide-react'

interface OrderPreviewDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  data: OrderFormData
  onConfirm: () => void
}

export function OrderPreviewDialog({ 
  open, 
  onOpenChange, 
  data, 
  onConfirm 
}: OrderPreviewDialogProps) {
  const DetailItem = ({ 
    label, 
    value, 
    icon: Icon 
  }: { 
    label: string
    value: string | number
    icon?: typeof Package
  }) => (
    <div className="flex items-start gap-3">
      {Icon && (
        <div className="mt-0.5">
          <Icon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {label}
        </p>
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-50 break-words">
          {value}
        </p>
      </div>
    </div>
  )

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-gray-50">
            Review Your Order
          </DialogTitle>
          <DialogDescription>
            Please review all details before confirming your order
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Client Details */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-gray-50 flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Client Details
                </h3>
                <Separator />
                <div className="space-y-3">
                  <DetailItem label="Plan Name" value={data.planName} />
                  <DetailItem 
                    label="Address" 
                    value={`${data.clientAddress}, ${data.clientCity}, ${data.clientState} ${data.clientZip}`} 
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-gray-50 flex items-center gap-2">
                  <User className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Contact Information
                </h3>
                <Separator />
                <div className="space-y-3">
                  <DetailItem label="Contact Name" value={data.contactName} />
                  <DetailItem 
                    label="Phone" 
                    value={data.contactPhone} 
                    
                  />
                  {data.contactAddress && (
                    <DetailItem label="Contact Address" value={data.contactAddress} />
                  )}
                  {data.specialInstructions && (
                    <DetailItem 
                      label="Special Instructions" 
                      value={data.specialInstructions} 
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Order Details */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-gray-50 flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Order Details
                </h3>
                <Separator />
                <div className="space-y-3">
                  <DetailItem 
                    label="Mail Date" 
                    value={data.mailDate ? format(data.mailDate, "PPP") : 'Not set'}
                    
                  />
                  <DetailItem 
                    label="Lab Ticket Reference" 
                    value={data.labTicketRef}
                    
                  />
                  <DetailItem label="Kit Name" value={data.kitName} />
                  <DetailItem label="Volume" value={data.volume} />
                </div>
              </div>

              {/* Return Address */}
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-900 dark:text-gray-50 flex items-center gap-2">
                  <Home className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  Return Address
                </h3>
                <Separator />
                <div className="space-y-3">
                  <DetailItem 
                    label="Address" 
                    value={`${data.returnAddress}, ${data.returnCity}, ${data.returnState} ${data.returnZip}`} 
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Order Notes */}
          {data.orderNotes && (
            <div className="rounded-lg border p-4 bg-gray-50 dark:bg-gray-900">
              <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-2">
                Order Notes
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
                {data.orderNotes}
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex gap-3 sm:gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 sm:flex-none"
          >
            Edit Order
          </Button>
          <Button
            onClick={() => {
              onConfirm()
              onOpenChange(false)
            }}
            className="flex-1 sm:flex-none"
          >
            Confirm Order
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
