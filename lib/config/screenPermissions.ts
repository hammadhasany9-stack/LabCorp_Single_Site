export type ScreenPermission = {
  path: string
  adminOnly?: boolean
  customerVisible?: boolean
  requiresCustomerId?: boolean // Must have customer context
  description?: string
}

export const SCREEN_PERMISSIONS: ScreenPermission[] = [
  // Current screens (all accessible to both, customer needs context)
  { path: '/programs/single-site/sites', customerVisible: true, requiresCustomerId: true },
  { path: '/programs/single-site/sites/add', customerVisible: true, requiresCustomerId: true },
  { path: '/programs/single-site/sites/edit/[id]', customerVisible: true, requiresCustomerId: true },
  { path: '/programs/single-site/order-history', customerVisible: true, requiresCustomerId: true },
  { path: '/programs/single-site/order-history/[orderId]', customerVisible: true, requiresCustomerId: true },
  { path: '/programs/single-site/place-order', customerVisible: true, requiresCustomerId: true },
  { path: '/programs/single-site/order-confirmation', customerVisible: true, requiresCustomerId: true },
  
  // Admin-only screens
  { path: '/admin/impersonate', adminOnly: true, description: 'Customer impersonation screen' },
  
  // Future admin-only screens (examples)
  { path: '/admin/customers', adminOnly: true, description: 'Customer management' },
  { path: '/admin/analytics', adminOnly: true, description: 'System analytics' },
  { path: '/admin/audit-logs', adminOnly: true, description: 'Audit log viewer' },
  { path: '/admin/system-settings', adminOnly: true, description: 'System configuration' },
  
  // Future customer-only screens (examples)
  { path: '/customer/profile', customerVisible: true, adminOnly: false, description: 'Customer profile settings' },
]

export const canAccessScreen = (path: string, isAdmin: boolean): boolean => {
  const permission = SCREEN_PERMISSIONS.find(p => p.path === path)
  if (!permission) return true // Default: allow if not configured
  if (permission.adminOnly && !isAdmin) return false
  if (permission.customerVisible === false && !isAdmin) return false
  return true
}

// Helper to check if screen requires customer context
export const requiresCustomerContext = (path: string): boolean => {
  const permission = SCREEN_PERMISSIONS.find(p => p.path === path)
  return permission?.requiresCustomerId || false
}
