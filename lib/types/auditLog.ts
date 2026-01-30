export interface AuditLog {
  logId: string
  timestamp: Date
  adminId: string
  adminName: string
  action: 'impersonate_start' | 'impersonate_end' | 'impersonated_action'
  customerId: string | null
  customerName: string | null
  resource: string // page/action accessed
  details: Record<string, any> // additional context
}

export type AuditAction = 'impersonate_start' | 'impersonate_end' | 'impersonated_action'

export interface ImpersonationLog extends AuditLog {
  action: 'impersonate_start' | 'impersonate_end'
  duration?: number // milliseconds (for impersonate_end)
}

export interface ActionLog extends AuditLog {
  action: 'impersonated_action'
  actionType: 'create' | 'update' | 'delete' | 'view'
  resourceId?: string
}
