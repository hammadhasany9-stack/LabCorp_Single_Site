"use client"

import { useSessionContext } from "@/lib/hooks/useSessionContext"

interface CustomerOnlyProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Wrapper component that only shows content to customers
 * Hides content from admins
 * 
 * @example
 * <CustomerOnly>
 *   <ProfileSettingsLink />
 * </CustomerOnly>
 */
export function CustomerOnly({ children, fallback = null }: CustomerOnlyProps) {
  const { isCustomer } = useSessionContext()
  return isCustomer ? <>{children}</> : <>{fallback}</>
}
