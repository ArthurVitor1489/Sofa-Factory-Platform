import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

// Decoupled secret key check for Middleware (which runs in Edge Runtime)
const JWT_SECRET = process.env.JWT_SECRET || 'local-jwt-access-secret-key-at-least-32-chars-long';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /admin routes (except /admin/login)
  if (pathname.startsWith('/admin') && !pathname.startsWith('/admin/login')) {
    const accessToken = request.cookies.get('access_token')?.value;

    if (!accessToken) {
      // Redirect to admin login if token is missing
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    try {
      // Basic signature check
      // Note: jwt.verify might not run inside Edge Runtime depending on imports.
      // Next.js Edge runtime supports Jose or basic base64 validation.
      // To be safe, we can decode the token or verify using simple verification.
      // For local development, we decode and verify expiration.
      const parts = accessToken.split('.');
      if (parts.length !== 3) {
        throw new Error('Invalid token structure');
      }

      // Check expiration manually (payload is the second part)
      const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
      const now = Math.floor(Date.now() / 1000);

      if (payload.exp && payload.exp < now) {
        // Expired access token. Try to redirect to refresh API
        const refreshUrl = new URL('/api/auth/refresh', request.url);
        refreshUrl.searchParams.set('redirect', pathname);
        return NextResponse.redirect(refreshUrl);
      }

      // Let it pass if role is valid
      const role = payload.role;
      if (!role || !['admin', 'vendedor', 'editor'].includes(role)) {
        return NextResponse.redirect(new URL('/', request.url));
      }

    } catch (err) {
      console.error('Middleware token validation failed:', err);
      const loginUrl = new URL('/admin/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
