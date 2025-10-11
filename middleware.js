import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  if (process.env.NODE_ENV === 'production') {
    console.log('Middleware - Path:', pathname);
  }


  if (pathname.startsWith('/nk-pol-config') && 
      !pathname.includes('/nk-pol-config/auth/login')) {
    
    const token = request.cookies.get('auth-token')?.value;
    const authHeader = request.headers.get('authorization');

    const hasToken = token || (authHeader && authHeader.startsWith('Bearer '));
    
    if (!hasToken) {
      console.log('No token found, redirecting to login');
      return NextResponse.redirect(new URL('/nk-pol-config/auth/login', request.url));
    }

    console.log('Token found, allowing access');
  }


  if (pathname.startsWith('/api/admin') && 
      !pathname.includes('/api/admin/auth/login') &&
      !pathname.includes('/api/admin/auth/register')) {
    
    let token = request.cookies.get('auth-token')?.value;
    
    if (!token) {
      const authHeader = request.headers.get('authorization');
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }
    
    if (!token) {
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