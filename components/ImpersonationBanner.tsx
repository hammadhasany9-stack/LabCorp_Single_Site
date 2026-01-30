"use client"

import { useAuth } from '@/lib/hooks/useAuth'
import { useSessionContext } from '@/lib/hooks/useSessionContext'
import { Button } from '@/components/ui/button'
import { Eye, ShieldCheck, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { logImpersonationEnd } from '@/lib/utils/auditLog'

export function ImpersonationBanner() {
  const { isImpersonating, endImpersonation, isViewingAsAdmin, user } = useAuth()
  const { customer } = useSessionContext()
  const router = useRouter()
  const [isExiting, setIsExiting] = useState(false)

  // Don't show banner if not impersonating and not viewing as admin
  if (!isImpersonating && !isViewingAsAdmin) {
    return null
  }

  const handleExitImpersonation = async () => {
    setIsExiting(true)
    try {
      // Log impersonation end for audit
      if (user && customer) {
        logImpersonationEnd(
          user.id,
          user.name,
          customer.customerId,
          customer.customerName
        )
      }
      
      await endImpersonation()
      router.push('/admin/impersonate')
    } catch (error) {
      console.error('Failed to exit impersonation:', error)
      setIsExiting(false)
    }
  }

  const handleSwitchView = () => {
    router.push('/admin/impersonate')
  }

  if (isImpersonating && customer) {
    // Impersonating a customer
    return (
      <div className="bg-amber-100 dark:bg-amber-950 border-b border-amber-200 dark:border-amber-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Eye className="h-5 w-5 text-amber-700 dark:text-amber-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                  Viewing as{' '}
                  <span className="font-bold">{customer.customerName}</span>
                  {' '}(ID: {customer.customerId})
                </p>
                <p className="text-xs text-amber-700 dark:text-amber-300">
                  All actions are being logged for audit purposes
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleExitImpersonation}
              disabled={isExiting}
              className="flex-shrink-0 text-amber-900 dark:text-amber-100 hover:bg-amber-200 dark:hover:bg-amber-900"
            >
              <X className="h-4 w-4 mr-1" />
              Exit Impersonation
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (isViewingAsAdmin) {
    // Viewing as admin (not impersonating)
    return (
      <div className="bg-blue-100 dark:bg-blue-950 border-b border-blue-200 dark:border-blue-800">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <ShieldCheck className="h-5 w-5 text-blue-700 dark:text-blue-400 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Viewing as Administrator
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-300">
                  You can see all customer data across the portal
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSwitchView}
              className="flex-shrink-0 text-blue-900 dark:text-blue-100 hover:bg-blue-200 dark:hover:bg-blue-900"
            >
              Switch to Customer View
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return null
}
