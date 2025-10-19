import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import TokenBlacklist from '@/models/TokenBlacklist';
import AuthLog from '@/models/AuthLog';
import { getUserFromToken } from '@/lib/auth';
import { getClientIP } from '@/lib/ratelimit';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    await dbConnect();

    const ip = getClientIP(request);
    const userAgent = request.headers.get('user-agent');


    const authHeader = request.headers.get('authorization');
    let token = null;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }

    if (token) {
      try {

        const user = await getUserFromToken(request);


        const decoded = jwt.decode(token);


        await TokenBlacklist.revokeToken(
          token,
          user.userId,
          new Date(decoded.exp * 1000),
          'logout',
          { ip, userAgent }
        );


        await AuthLog.logEvent({
          userId: user.userId,
          username: user.username,
          action: 'logout',
          ip,
          userAgent,
          success: true
        });


        if (process.env.NODE_ENV === 'development') {
          console.log('Logout successful for user:', user.username);
        }

      } catch (error) {

        console.error('Error during token revocation:', error);
      }
    }

    return NextResponse.json(
      { message: 'Logged out successfully' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}