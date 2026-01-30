export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'customer'
  customerId: string | null // null for admins, customerId for customer users
  status: 'active' | 'inactive'
  avatar?: string
  createdDate?: Date
  lastLoginDate?: Date
}

export type UserRole = 'admin' | 'customer'

export interface AuthSession {
  user: User
  isImpersonating: boolean
  impersonatedCustomerId?: string
  originalAdminId?: string
  expiresAt: Date
}
