export type ProgramTab = 'single-site' | 'direct-to-patient'
export type UnifiedStatusFilter = 'all' | 'approved' | 'in_progress' | 'shipped' | 'cancelled'

export interface UnifiedDashboardMetrics {
  // Global metrics
  totalOrders: number
  open: number  // in_progress count
  readyForApproval: number
  approved: number
  shipped: number
  cancelled: number
  todayOrders: number
  
  // Program breakdown
  singleSiteCount: number
  directToPatientCount: number
}
