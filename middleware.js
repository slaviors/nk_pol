import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (process.env.NODE_ENV === 'production') {
    console.log('Middleware - Path:', pathname);
    console.log('Middleware - Has auth-token:', !!request.cookies.get('auth-token')?.value);
  }

  if (pathname.startsWith('/nk-pol-config') && 
      !pathname.includes('/nk-pol-config/auth/login')) {
    
    const token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      console.log('No token found, redirecting to login');
      return NextResponse.redirect(new URL('/nk-pol-config/auth/login', request.url));
    }

    try {
      jwt.verify(token, process.env.JWT_TOKEN);
      console.log('Token verified successfully');
    } catch (error) {
      console.log('Token verification failed:', error.message);
      const response = NextResponse.redirect(new URL('/nk-pol-config/auth/login', request.url));

      const isProduction = process.env.NODE_ENV === 'production';
      response.cookies.set('auth-token', '', {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? 'none' : 'lax',
        maxAge: 0,
        path: '/',
        ...(isProduction && process.env.VERCEL_URL && {
          domain: `.${process.env.VERCEL_URL.replace('https://', '').replace('http://', '')}`
        })
      });
      
      return response;
    }
  }

  if (pathname.startsWith('/api/admin') && 
      !pathname.includes('/api/admin/auth/login') &&
      !pathname.includes('/api/admin/auth/register')) {
    
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
  matcher: [
    '/nk-pol-config/:path*', 
    '/api/admin/:path*'
  ]
};