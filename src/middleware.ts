import { NextRequest } from 'next/server'
import { AuthMiddleware } from './lib/middleware/auth-middleware'

export default async function middleware(request: NextRequest) {
  return AuthMiddleware.handle(request)
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|manifest.json|robots.txt|public/).*)',
    '/api/((?!auth).*)',
    '/dashboard/:path*',
    '/admin/:path*',
  ],
}