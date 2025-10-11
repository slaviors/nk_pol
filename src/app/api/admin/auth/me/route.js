import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    await dbConnect();

    console.log('All cookies:', request.cookies.getAll());
    
    const token = request.cookies.get('auth-token')?.value;
    
    console.log('Auth token from cookie:', token ? token.substring(0, 20) + '...' : 'NOT FOUND');
    
    if (!token) {
      return NextResponse.json(
        { error: 'Access denied. No token provided.' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    console.log('Token decoded successfully for user:', decoded.username);

    const user = await User.findById(decoded.userId).select('-password');
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        user: {
          id: user._id,
          username: user.username,
          createdAt: user.createdAt,
          updatedAt: user.updatedAt
        }
      },
      { status: 200 }
    );

  } catch (error) {
    console.error('Me route error:', error);
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
}