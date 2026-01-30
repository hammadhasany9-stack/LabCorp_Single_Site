import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { User } from "@/lib/types/user"

// Mock admin users for authentication (customers disabled for now)
const mockUsers: User[] = [
  {
    id: '1',
    email: 'admin@labcorp.com',
    name: 'Admin User',
    role: 'admin',
    customerId: null,
    status: 'active',
  },
]

export const { auth, handlers, signIn, signOut } = NextAuth({
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          return null
        }

        // Mock authentication - only admin users allowed
        const user = mockUsers.find(u => u.email === credentials.email)
        
        if (!user || user.role !== 'admin') {
          return null
        }

        // In production, verify password here
        // For now, any password works (mock authentication)
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          customerId: user.customerId,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // On sign in, add user details to token
      if (user) {
        token.id = user.id
        token.role = user.role
        token.customerId = user.customerId
      }

      // Handle impersonation updates
      if (trigger === "update" && session) {
        token.isImpersonating = session.isImpersonating
        token.impersonatedCustomerId = session.impersonatedCustomerId
        token.originalAdminId = session.originalAdminId
      }

      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as 'admin' | 'customer'
        session.user.customerId = token.customerId as string | null
        
        // Add impersonation info to session
        session.isImpersonating = token.isImpersonating as boolean || false
        session.impersonatedCustomerId = token.impersonatedCustomerId as string | undefined
        session.originalAdminId = token.originalAdminId as string | undefined
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  session: {
    strategy: "jwt",
  },
})

// Helper function to get active customer ID (either own or impersonated)
export function getActiveCustomerId(session: any): string | null {
  if (!session?.user) return null
  
  // If impersonating, use impersonated customer ID
  if (session.isImpersonating && session.impersonatedCustomerId) {
    return session.impersonatedCustomerId
  }
  
  // Otherwise use user's own customer ID
  return session.user.customerId || null
}

// Helper function to check if user is admin
export function isAdmin(session: any): boolean {
  return session?.user?.role === 'admin'
}

// Helper function to check if currently viewing as admin (not impersonating)
export function isViewingAsAdmin(session: any): boolean {
  return isAdmin(session) && !session.isImpersonating
}
