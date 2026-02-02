export interface AuditLog {
  logId: string
  timestamp: Date
  adminId: string
  adminName: string
  action: 'impersonate_start' | 'impersonate_end' | 'impersonated_action' | 'patient_data_access'
  customerId: string | null
  customerName: string | null
  resource: string // page/action accessed
  details: Record<string, any> // additional context
}

export type AuditAction = 'impersonate_start' | 'impersonate_end' | 'impersonated_action' | 'patient_data_access'

export type PatientAccessReason = 
  | 'to_verify_order'
  | 'to_update_records'
  | 'authorized_user_request'
  | 'other_purpose'

export interface ImpersonationLog extends AuditLog {
  action: 'impersonate_start' | 'impersonate_end'
  duration?: number // milliseconds (for impersonate_end)
}

export interface ActionLog extends AuditLog {
  action: 'impersonated_action'
  actionType: 'create' | 'update' | 'delete' | 'view'
  resourceId?: string
}

export interface PatientDataAccessLog extends AuditLog {
  action: 'patient_data_access'
  orderId: string
  accessReason: PatientAccessReason
  userId: string
  userEmail: string
}
