"use client"

import { useSessionContext } from "@/lib/hooks/useSessionContext"
import { canAccessFeature } from "@/lib/config/featurePermissions"

interface FeatureGateProps {
  feature: string
  children: React.ReactNode
  fallback?: React.ReactNode
}

/**
 * Shows content based on feature permission
 * 
 * @example
 * <FeatureGate feature="sites.delete">
 *   <DeleteButton />
 * </FeatureGate>
 */
export function FeatureGate({ feature, children, fallback = null }: FeatureGateProps) {
  const { isAdmin } = useSessionContext()
  const hasAccess = canAccessFeature(feature, isAdmin)
  
  return hasAccess ? <>{children}</> : <>{fallback}</>
}
