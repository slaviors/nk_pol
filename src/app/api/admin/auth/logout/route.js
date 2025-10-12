import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const response = NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );

    const isProduction = process.env.NODE_ENV === 'production';
    response.cookies.set('auth-token', '', {
      httpOnly: true,
<<<<<<< HEAD
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0,
      path: '/'
=======
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 0,
      path: '/'

>>>>>>> ef5bc5dbf4f425b7eae86a76c7c317759a8c41ca
    });

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}