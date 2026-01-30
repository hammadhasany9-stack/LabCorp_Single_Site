import { DefaultSession } from "next-auth"
import { UserRole } from "@/lib/types/user"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: UserRole
      customerId: string | null
    } & DefaultSession["user"]
    isImpersonating: boolean
    impersonatedCustomerId?: string
    originalAdminId?: string
  }

  interface User {
    id: string
    role: UserRole
    customerId: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: UserRole
    customerId: string | null
    isImpersonating?: boolean
    impersonatedCustomerId?: string
    originalAdminId?: string
  }
}
