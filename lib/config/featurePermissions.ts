export type FeaturePermission = {
  feature: string
  adminOnly?: boolean // Feature completely hidden from customers
  adminView?: 'full' | 'enhanced' // Admins see more data/options
  customerView?: 'limited' | 'standard'
  description?: string
}

export const FEATURE_PERMISSIONS: FeaturePermission[] = [
  // Future examples (all currently 'standard' for both):
  { feature: 'sites.view', adminView: 'full', customerView: 'standard' },
  { feature: 'sites.create', adminView: 'enhanced', customerView: 'standard' },
  { feature: 'sites.edit', adminView: 'enhanced', customerView: 'limited' },
  { feature: 'sites.delete', adminOnly: true, description: 'Only admins can delete sites' },
  { feature: 'orders.view', adminView: 'full', customerView: 'standard' },
  { feature: 'orders.create', adminView: 'enhanced', customerView: 'standard' },
  { feature: 'orders.cancel', adminView: 'full', customerView: 'limited', description: 'Customers can only cancel within 24hrs' },
  { feature: 'orders.export', adminOnly: false, description: 'Both can export' },
  { feature: 'reports.analytics', adminOnly: true, description: 'Admin-only analytics' },
  { feature: 'users.manage', adminOnly: true, description: 'Admin manages customer users' },
  { feature: 'billing.view', adminView: 'full', customerView: 'standard' },
]

// Helper to check feature access
export const canAccessFeature = (feature: string, isAdmin: boolean): boolean => {
  const permission = FEATURE_PERMISSIONS.find(p => p.feature === feature)
  if (!permission) return true // Default: allow if not configured
  if (permission.adminOnly && !isAdmin) return false
  return true
}

// Helper to get view level for feature
export const getFeatureViewLevel = (feature: string, isAdmin: boolean): string => {
  const permission = FEATURE_PERMISSIONS.find(p => p.feature === feature)
  if (!permission) return 'standard'
  return isAdmin ? (permission.adminView || 'full') : (permission.customerView || 'standard')
}
