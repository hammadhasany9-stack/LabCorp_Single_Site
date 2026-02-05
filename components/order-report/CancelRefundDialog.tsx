'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ActionType, CancelRefundDialogData } from "@/lib/types/order-report"
import { AlertTriangle } from "lucide-react"

interface CancelRefundDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  actionType: ActionType
  order: CancelRefundDialogData | null
  onConfirm: () => void
}

export function CancelRefundDialog({
  open,
  onOpenChange,
  actionType,
  order,
  onConfirm,
}: CancelRefundDialogProps) {
  if (!order) return null

  const isCancel = actionType === 'cancel'
  const title = isCancel ? 'Cancel Order' : 'Refund Order'
  const actionText = isCancel ? 'Cancel' : 'Refund'

  const handleConfirm = () => {
    onConfirm()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <AlertTriangle className="h-5 w-5 text-red-600 dark:text-red-400" />
            {title}
          </DialogTitle>
          <DialogDescription className="text-base pt-2">
            Are you sure you want to {actionText.toLowerCase()} this order?
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="rounded-lg bg-gray-50 dark:bg-zinc-900 p-4 space-y-3">
            <div className="grid grid-cols-3 gap-2">
              <span className="font-semibold text-gray-700 dark:text-gray-300">Order ID:</span>
              <span className="col-span-2 text-gray-900 dark:text-gray-100">{order.orderId}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-semibold text-gray-700 dark:text-gray-300">Order No:</span>
              <span className="col-span-2 text-gray-900 dark:text-gray-100">{order.orderNo}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-semibold text-gray-700 dark:text-gray-300">Program:</span>
              <span className="col-span-2 text-gray-900 dark:text-gray-100">{order.programName}</span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <span className="font-semibold text-gray-700 dark:text-gray-300">Kit:</span>
              <span className="col-span-2 text-gray-900 dark:text-gray-100">{order.kitName}</span>
            </div>
          </div>

          <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg">
            <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-800 dark:text-red-300">
              <strong>Warning:</strong> This action cannot be undone. The order will be marked as cancelled and removed from the active orders table.
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Go Back
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
          >
            Confirm {actionText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
