import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (process.env.NODE_ENV === 'development') {
    console.log('Middleware - Path:', pathname);
  }


  if (pathname.startsWith('/nk-pol-config') &&
    !pathname.includes('/nk-pol-config/auth/login')) {


    const authHeader = request.headers.get('authorization');
    const hasToken = authHeader && authHeader.startsWith('Bearer ');

    if (!hasToken) {
      if (process.env.NODE_ENV === 'development') {
        console.log('No token found, redirecting to login');
      }
      return NextResponse.redirect(new URL('/nk-pol-config/auth/login', request.url));
    }

    if (process.env.NODE_ENV === 'development') {
      console.log('Token found, allowing access');
    }
  }


  if (pathname.startsWith('/api/admin') &&
    !pathname.includes('/api/admin/auth/login') &&
    !pathname.includes('/api/admin/auth/register')) {

    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Access denied. No token provided.' },
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