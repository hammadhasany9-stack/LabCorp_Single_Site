"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Eye, Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/hooks/useAuth'
import { Customer } from '@/lib/types/customer'
import { logImpersonationStart } from '@/lib/utils/auditLog'

interface ImpersonateButtonProps {
  customer: Customer
  destination?: string
}

export function ImpersonateButton({ customer, destination = '/programs/single-site' }: ImpersonateButtonProps) {
  const router = useRouter()
  const { startImpersonation, user } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleImpersonate = async () => {
    setIsLoading(true)
    
    try {
      // Start impersonation session
      await startImpersonation(customer.customerId)
      
      // Log impersonation start for audit
      if (user) {
        logImpersonationStart(
          user.id,
          user.name || user.email || 'Unknown Admin',
          customer.customerId,
          customer.customerName
        )
      }
      
      // Show success toast (you can add a toast library later)
      console.log(`Now viewing as ${customer.customerName}`)
      
      // Navigate to destination portal
      router.push(destination)
    } catch (error) {
      console.error('Failed to start impersonation:', error)
      setIsLoading(false)
    }
  }

  return (
    <Button
      onClick={handleImpersonate}
      disabled={isLoading || customer.status !== 'active'}
      className="w-full"
      size="lg"
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Starting Impersonation...
        </>
      ) : (
        <>
          <Eye className="mr-2 h-5 w-5" />
          Impersonate Customer
        </>
      )}
    </Button>
  )
}
