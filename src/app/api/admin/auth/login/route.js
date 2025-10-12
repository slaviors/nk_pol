import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    await dbConnect();
    
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ username });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_TOKEN,
      { expiresIn: '7d' }
    );

    console.log('Token created for user:', username);

    const response = NextResponse.json(
      { 
        message: 'Login successful',
        user: {
          id: user._id,
          username: user.username
        },

        token: token
      },
      { status: 200 }
    );

    const isProduction = process.env.NODE_ENV === 'production';
    const maxAge = 7 * 24 * 60 * 60;

    response.cookies.set('auth-token', token, {
      httpOnly: true,
<<<<<<< HEAD
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax', 
      maxAge: 7 * 24 * 60 * 60, 
      path: '/' 
=======
      secure: isProduction,
      sameSite: 'lax',
      maxAge: maxAge,
      path: '/'
>>>>>>> ef5bc5dbf4f425b7eae86a76c7c317759a8c41ca
    });

    const cookieString = `auth-token=${token}; HttpOnly; ${isProduction ? 'Secure;' : ''} SameSite=Lax; Max-Age=${maxAge}; Path=/`;
    response.headers.append('Set-Cookie', cookieString);

    console.log('Set-Cookie header:', cookieString);

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}