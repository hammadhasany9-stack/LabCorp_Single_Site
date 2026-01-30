"use client"

import { useSessionContext } from "@/lib/hooks/useSessionContext"

interface AdminOnlyProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Wrapper component that only shows content to admins (when not impersonating)
 * Hides content from customers
 * 
 * @example
 * <AdminOnly>
 *   <Button variant="destructive">Delete All Sites</Button>
 * </AdminOnly>
 */
export function AdminOnly({ children, fallback = null }: AdminOnlyProps) {
  const { shouldShowAdminFeatures } = useSessionContext()
  return shouldShowAdminFeatures ? <>{children}</> : <>{fallback}</>
}
