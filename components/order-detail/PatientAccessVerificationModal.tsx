'use client'

import { useState } from 'react'
import { useSessionContext } from '@/lib/hooks/useSessionContext'
import { logPatientDataAccess } from '@/lib/utils/auditLog'
import { PatientAccessReason } from '@/lib/types/auditLog'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
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
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Shield, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'

interface PatientAccessVerificationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onVerified: (reason: PatientAccessReason) => void
  orderId: string
}

const ACCESS_REASONS = [
  { value: 'to_verify_order' as PatientAccessReason, label: 'To verify order' },
  { value: 'to_update_records' as PatientAccessReason, label: 'To update records' },
  { value: 'authorized_user_request' as PatientAccessReason, label: 'Authorized user request' },
  { value: 'other_purpose' as PatientAccessReason, label: 'Other purpose' },
]

export function PatientAccessVerificationModal({
  open,
  onOpenChange,
  onVerified,
  orderId,
}: PatientAccessVerificationModalProps) {
  const { user } = useSessionContext()
  const [selectedReason, setSelectedReason] = useState<PatientAccessReason | ''>('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleConfirm = () => {
    if (!selectedReason || !user) return

    setIsSubmitting(true)

    // Log the patient data access
    logPatientDataAccess(
      user.id,
      user.email,
      user.name,
      orderId,
      selectedReason
    )

    // Call the verified callback with the reason
    onVerified(selectedReason)

    // Reset and close
    setIsSubmitting(false)
    setSelectedReason('')
    onOpenChange(false)
  }

  const handleCancel = () => {
    setSelectedReason('')
    onOpenChange(false)
  }

  const currentDate = new Date()

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-2 bg-blue-100 dark:bg-blue-950 rounded-lg">
              <Shield className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <DialogTitle className="text-xl">Patient Data Access Verification</DialogTitle>
          </div>
          <DialogDescription>
            This action requires verification for security and compliance purposes. Please confirm your identity and reason for accessing patient information.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Security Notice */}
          <div className="p-3 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-800 dark:text-amber-200">
              All access to patient data is logged and audited for compliance with privacy regulations.
            </p>
          </div>

          {/* User Information */}
          <div className="space-y-3 p-4 bg-gray-50 dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800">
            <div>
              <Label className="text-xs text-gray-600 dark:text-gray-400">User ID</Label>
              <p className="text-sm font-mono text-gray-900 dark:text-gray-100 mt-1">
                {user?.id || 'N/A'}
              </p>
            </div>
            <div>
              <Label className="text-xs text-gray-600 dark:text-gray-400">Email</Label>
              <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
                {user?.email || 'N/A'}
              </p>
            </div>
            <div>
              <Label className="text-xs text-gray-600 dark:text-gray-400">Access Date & Time</Label>
              <p className="text-sm text-gray-900 dark:text-gray-100 mt-1">
                {format(currentDate, 'MMM dd, yyyy hh:mm:ss a')}
              </p>
            </div>
          </div>

          {/* Access Reason Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="access-reason" className="text-sm font-medium">
              Reason for accessing patient information <span className="text-red-500">*</span>
            </Label>
            <Select
              value={selectedReason}
              onValueChange={(value) => setSelectedReason(value as PatientAccessReason)}
            >
              <SelectTrigger id="access-reason" className="w-full">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {ACCESS_REASONS.map((reason) => (
                  <SelectItem key={reason.value} value={reason.value}>
                    {reason.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!selectedReason || isSubmitting}
            className="gap-2"
          >
            <Shield className="h-4 w-4" />
            Confirm & View Patient Details
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
