"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

export function useAuth() {
  const { data: session, status, update } = useSession()
  const router = useRouter()

  const isLoading = status === "loading"
  const isAuthenticated = status === "authenticated"
  const user = session?.user || null

  const isAdmin = user?.role === 'admin'
  const isCustomer = user?.role === 'customer'
  const customerId = user?.customerId || null

  // Check if currently impersonating
  const isImpersonating = session?.isImpersonating || false
  const impersonatedCustomerId = session?.impersonatedCustomerId
  const originalAdminId = session?.originalAdminId

  // Get active customer ID (either own or impersonated)
  const activeCustomerId = isImpersonating && impersonatedCustomerId
    ? impersonatedCustomerId
    : customerId

  // Check if viewing as admin (admin not impersonating)
  const isViewingAsAdmin = isAdmin && !isImpersonating

  // Start impersonation
  const startImpersonation = async (targetCustomerId: string) => {
    if (!isAdmin) {
      throw new Error("Only admins can impersonate")
    }

    await update({
      isImpersonating: true,
      impersonatedCustomerId: targetCustomerId,
      originalAdminId: user?.id,
    })
  }

  // End impersonation
  const endImpersonation = async () => {
    if (!isImpersonating) {
      return
    }

    await update({
      isImpersonating: false,
      impersonatedCustomerId: undefined,
      originalAdminId: undefined,
    })
  }

  // Redirect to sign-in if not authenticated
  const requireAuth = () => {
    if (!isAuthenticated && !isLoading) {
      router.push('/auth/signin')
    }
  }

  // Redirect to sign-in if not admin
  const requireAdmin = () => {
    if (!isLoading && (!isAuthenticated || !isAdmin)) {
      router.push('/auth/signin')
    }
  }

  return {
    // User & Session
    user,
    session,
    isLoading,
    isAuthenticated,

    // Roles
    isAdmin,
    isCustomer,
    customerId,

    // Impersonation
    isImpersonating,
    impersonatedCustomerId,
    originalAdminId,
    activeCustomerId,
    isViewingAsAdmin,
    startImpersonation,
    endImpersonation,

    // Utilities
    requireAuth,
    requireAdmin,
  }
}
