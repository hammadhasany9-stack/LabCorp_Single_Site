"use client"

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ShieldCheck } from 'lucide-react'

interface ViewAsAdminButtonProps {
  destination?: string
}

export function ViewAsAdminButton({ destination = '/programs/single-site' }: ViewAsAdminButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    // No impersonation context needed, just navigate
    // Admin will see all data
    router.push(destination)
  }

  return (
    <Button
      onClick={handleClick}
      size="lg"
      className="flex items-center gap-2"
    >
      <ShieldCheck className="h-5 w-5" />
      View as Admin
    </Button>
  )
}
