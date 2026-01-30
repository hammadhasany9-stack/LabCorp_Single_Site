import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const session = await auth()
  const { pathname, searchParams } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ['/auth/signin', '/api/auth']
  const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

  // If accessing a public route, allow
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // If not authenticated, redirect to sign-in
  if (!session?.user) {
    const signInUrl = new URL('/auth/signin', request.url)
    signInUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(signInUrl)
  }

  // Check if accessing /admin routes
  if (pathname.startsWith('/admin')) {
    // Only admins can access /admin routes
    if (session.user.role !== 'admin') {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
    return NextResponse.next()
  }

  // Check if accessing /programs routes
  if (pathname.startsWith('/programs')) {
    // For now, only admins can access (customer auth disabled)
    if (session.user.role !== 'admin') {
      return NextResponse.redirect(new URL('/auth/signin', request.url))
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!_next/static|_next/image|favicon.ico|logo.svg|.*\\.png$).*)',
  ],
}
