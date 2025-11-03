import { NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request) {
  try {
    await dbConnect();


    const userData = await getUserFromToken(request);


    const user = await User.findById(userData.userId).select('-password');

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }


    if (process.env.NODE_ENV === 'development') {
      console.log('Auth check successful for user:', user.username);
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

    if (process.env.NODE_ENV === 'development') {
      console.error('Me route error:', error.message);
    }

    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }
}