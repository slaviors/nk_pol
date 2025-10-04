import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function middleware(request) {
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
  matcher: ['/api/admin/:path*']
};