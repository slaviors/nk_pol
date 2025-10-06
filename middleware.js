import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request) {
  // Protect admin frontend pages
  if (request.nextUrl.pathname.startsWith('/nk-pol-config') && 
      !request.nextUrl.pathname.includes('/nk-pol-config/auth/login')) {
    
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.redirect(new URL('/nk-pol-config/auth/login', request.url));
    }

    try {
      jwt.verify(token, process.env.JWT_TOKEN);
    } catch (error) {
      // Clear invalid token
      const response = NextResponse.redirect(new URL('/nk-pol-config/auth/login', request.url));
      response.cookies.delete('auth-token');
      return response;
    }
  }

  // Protect admin API routes
  if (request.nextUrl.pathname.startsWith('/api/admin') && 
      !request.nextUrl.pathname.includes('/api/admin/auth/login') &&
      !request.nextUrl.pathname.includes('/api/admin/auth/register')) {
    
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      return NextResponse.json(
        { error: 'Access denied. No token provided.' },
        { status: 401 }
      );
    }

    try {
      jwt.verify(token, process.env.JWT_TOKEN);
      return NextResponse.next();
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid token.' },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/nk-pol-config/:path*', '/api/admin/:path*']
};