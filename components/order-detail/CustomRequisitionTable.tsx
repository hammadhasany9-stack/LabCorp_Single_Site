'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
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
import { CustomRequisition } from '@/lib/types/order-detail'
import { TrackingModal } from './TrackingModal'
import { UnifiedTrackingModal } from './UnifiedTrackingModal'
import { PatientAccessVerificationModal } from './PatientAccessVerificationModal'
import { useSessionContext } from '@/lib/hooks/useSessionContext'
import { PatientAccessReason } from '@/lib/types/auditLog'
import { MapPin, Eye, EyeOff } from 'lucide-react'
import { SiteGroup, SITE_GROUPS } from '@/lib/constants/siteGroups'
import { format } from 'date-fns'

interface CustomRequisitionTableProps {
  requisitions: CustomRequisition[]
  orderStatus: 'in_progress' | 'shipped' | 'cancelled' | 'approved'
  siteGroup?: SiteGroup
  orderId?: string
}

const ACCESS_REASON_LABELS: Record<PatientAccessReason, string> = {
  to_verify_order: 'To verify order',
  to_update_records: 'To update records',
  authorized_user_request: 'Authorized user request',
  other_purpose: 'Other purpose',
}

export function CustomRequisitionTable({ requisitions, orderStatus, siteGroup, orderId }: CustomRequisitionTableProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [isPatientDataVisible, setIsPatientDataVisible] = useState(false)
  const [showVerificationModal, setShowVerificationModal] = useState(false)
  const [accessReason, setAccessReason] = useState<PatientAccessReason | null>(null)
  
  const { isAdmin } = useSessionContext()
  const isTrackingEnabled = orderStatus === 'shipped'
  const isDirectToPatient = siteGroup === SITE_GROUPS.DIRECT_TO_PATIENT
  const shouldShowPatientData = isDirectToPatient && isAdmin ? isPatientDataVisible : true
  
  const handleTrackClick = (index: number) => {
    if (!isTrackingEnabled) return
    setSelectedIndex(index)
    setModalOpen(true)
  }

  const handleTogglePatientDetails = () => {
    if (isPatientDataVisible) {
      // Hide patient details
      setIsPatientDataVisible(false)
      setAccessReason(null)
    } else {
      // Show verification modal to reveal patient details
      setShowVerificationModal(true)
    }
  }

  const handleVerified = (reason: PatientAccessReason): void => {
    setIsPatientDataVisible(true)
    setAccessReason(reason)
  }
  
  return (
    <>
      <Card className="rounded-2xl shadow-md">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                Custom Requisition
              </CardTitle>
              {isDirectToPatient && isAdmin && accessReason && isPatientDataVisible && (
                <Badge variant="secondary" className="text-xs">
                  {ACCESS_REASON_LABELS[accessReason]}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3">
              {isDirectToPatient && isAdmin && (
                <Button
                  onClick={handleTogglePatientDetails}
                  variant={isPatientDataVisible ? "outline" : "default"}
                  className="gap-2"
                  size="sm"
                >
                  {isPatientDataVisible ? (
                    <>
                      <EyeOff className="h-4 w-4" />
                      Hide Patient Details
                    </>
                  ) : (
                    <>
                      <Eye className="h-4 w-4" />
                      Show Patient Details
                    </>
                  )}
                </Button>
              )}
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Total: {requisitions.length} records
              </span>
            </div>
          </div>
        </CardHeader>
        <Separator className="mb-0" />
        <CardContent className="p-0">
          <div className="overflow-hidden">
            <div className="max-h-[550px] overflow-y-auto overflow-x-auto">
              <Table>
                <TableHeader className="sticky top-0 bg-white dark:bg-card z-10">
                  <TableRow>
                    <TableHead className="text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900">
                      Control ID
                    </TableHead>
                    {isDirectToPatient ? (
                      <>
                        {shouldShowPatientData ? (
                          <>
                            <TableHead className="text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900">
                              Patient Name
                            </TableHead>
                            <TableHead className="text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900">
                              Patient DOB
                            </TableHead>
                            <TableHead className="text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900">
                              Patient Address
                            </TableHead>
                            <TableHead className="text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900">
                              City
                            </TableHead>
                            <TableHead className="text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900">
                              State
                            </TableHead>
                            <TableHead className="text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900">
                              Zip Code
                            </TableHead>
                          </>
                        ) : (
                          <TableHead 
                            colSpan={6} 
                            className="text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900 text-center"
                          >
                            Patient Data
                          </TableHead>
                        )}
                        <TableHead className="text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900">
                          Outbound (Member)
                        </TableHead>
                        <TableHead className="text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900">
                          Inbound (Lab)
                        </TableHead>
                      </>
                    ) : (
                      <TableHead className="text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900">
                        Inbound Tracking ID (USPS)
                      </TableHead>
                    )}
                    <TableHead className="text-gray-700 dark:text-gray-400 bg-gray-100 dark:bg-zinc-900 text-center">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requisitions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={isDirectToPatient ? (shouldShowPatientData ? 11 : 10) : 3} className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No custom requisitions found
                      </TableCell>
                    </TableRow>
                  ) : (
                    requisitions.map((req, index) => (
                      <TableRow key={`${req.controlId}-${index}`}>
                        <TableCell className="font-mono text-sm">
                          {req.controlId}
                        </TableCell>
                        {isDirectToPatient ? (
                          <>
                            {shouldShowPatientData ? (
                              <>
                                <TableCell className="text-sm">
                                  {req.patientName || '-'}
                                </TableCell>
                                <TableCell className="text-sm">
                                  {req.patientDOB ? format(req.patientDOB, 'MM/dd/yyyy') : '-'}
                                </TableCell>
                                <TableCell className="text-sm">
                                  {req.patientAddress || '-'}
                                </TableCell>
                                <TableCell className="text-sm">
                                  {req.patientCity || '-'}
                                </TableCell>
                                <TableCell className="text-sm">
                                  {req.patientState || '-'}
                                </TableCell>
                                <TableCell className="text-sm">
                                  {req.patientZip || '-'}
                                </TableCell>
                              </>
                            ) : (
                              <TableCell className="text-sm text-center" colSpan={6}>
                                <div className="flex items-center justify-center gap-2 text-gray-500 dark:text-gray-400">
                                  <EyeOff className="h-4 w-4" />
                                  <span>Patient data hidden - Click "Show Patient Details" to view</span>
                                </div>
                              </TableCell>
                            )}
                            <TableCell className="font-mono text-sm">
                              {req.outboundTrackingId || '-'}
                            </TableCell>
                            <TableCell className="font-mono text-sm">
                              {req.inboundTrackingId}
                            </TableCell>
                          </>
                        ) : (
                          <TableCell className="font-mono text-sm">
                            {req.inboundTrackingId}
                          </TableCell>
                        )}
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

      {/* Patient Access Verification Modal */}
      {isDirectToPatient && isAdmin && orderId && (
        <PatientAccessVerificationModal
          open={showVerificationModal}
          onOpenChange={setShowVerificationModal}
          onVerified={handleVerified}
          orderId={orderId}
        />
      )}

      {/* Tracking Modal - Use UnifiedTrackingModal for Direct to Patient */}
      {isDirectToPatient ? (
        <UnifiedTrackingModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          requisitions={requisitions}
          initialIndex={selectedIndex}
          carrierType="USPS"
          shouldShowPatientData={shouldShowPatientData}
        />
      ) : (
        <TrackingModal
          open={modalOpen}
          onOpenChange={setModalOpen}
          requisitions={requisitions}
          initialIndex={selectedIndex}
          carrierType="USPS"
        />
      )}
    </>
  )
}
