"use client"

import { useAuth } from "./useAuth"
import { findCustomerById } from "@/lib/data/mockCustomers"
import { Customer } from "@/lib/types/customer"
import { canAccessFeature, getFeatureViewLevel } from "@/lib/config/featurePermissions"
import { canAccessScreen } from "@/lib/config/screenPermissions"

export interface SessionContext {
  // Identity
  user: any
  customerId: string | null
  customer: Customer | null

  // Role & Status
  isAdmin: boolean
  isCustomer: boolean
  isImpersonating: boolean

  // Permissions & Capabilities
  canAccessFeature: (feature: string) => boolean
  getFeatureViewLevel: (feature: string) => 'full' | 'enhanced' | 'standard' | 'limited'
  canAccessScreen: (path: string) => boolean

  // UI Helpers
  shouldShowAdminFeatures: boolean // True if viewing as admin (not impersonating)
  shouldFilterByCustomer: boolean // True if should filter data (customer or impersonating)

  // Data context
  activeCustomerId: string | null // Customer ID to use for filtering (impersonated or own)

  // Loading state
  isLoading: boolean
}

export function useSessionContext(): SessionContext {
  const auth = useAuth()

  // Get customer object if available
  const customer = auth.activeCustomerId
    ? findCustomerById(auth.activeCustomerId) || null
    : null

  // Determine UI behavior
  const shouldShowAdminFeatures = auth.isViewingAsAdmin
  const shouldFilterByCustomer = auth.isCustomer || auth.isImpersonating

  // Permission helpers
  const checkFeatureAccess = (feature: string) => canAccessFeature(feature, auth.isAdmin)
  const checkFeatureViewLevel = (feature: string) => getFeatureViewLevel(feature, auth.isAdmin) as 'full' | 'enhanced' | 'standard' | 'limited'
  const checkScreenAccess = (path: string) => canAccessScreen(path, auth.isAdmin)

  return {
    // Identity
    user: auth.user,
    customerId: auth.customerId,
    customer,

    // Role & Status
    isAdmin: auth.isAdmin,
    isCustomer: auth.isCustomer,
    isImpersonating: auth.isImpersonating,

    // Permissions & Capabilities
    canAccessFeature: checkFeatureAccess,
    getFeatureViewLevel: checkFeatureViewLevel,
    canAccessScreen: checkScreenAccess,

    // UI Helpers
    shouldShowAdminFeatures,
    shouldFilterByCustomer,

    // Data context
    activeCustomerId: auth.activeCustomerId,

    // Loading state
    isLoading: auth.isLoading,
  }
}
