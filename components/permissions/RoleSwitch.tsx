"use client"

import { useSessionContext } from "@/lib/hooks/useSessionContext"

interface RoleSwitchProps {
  adminView: React.ReactNode
  customerView: React.ReactNode
}

/**
 * Renders different content for admin vs customer
 * 
 * @example
 * <RoleSwitch
 *   adminView={<EnhancedTable showExtraColumns />}
 *   customerView={<StandardTable />}
 * />
 */
export function RoleSwitch({ adminView, customerView }: RoleSwitchProps) {
  const { shouldShowAdminFeatures } = useSessionContext()
  return shouldShowAdminFeatures ? <>{adminView}</> : <>{customerView}</>
}
