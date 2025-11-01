import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import AuthLog from '@/models/AuthLog';
import jwt from 'jsonwebtoken';
import { loginRateLimit, getClientIP } from '@/lib/ratelimit';

export async function POST(request) {
  const ip = getClientIP(request);
  const userAgent = request.headers.get('user-agent');
  let username = '';

  try {

    const rateLimitResult = await loginRateLimit.limit(ip);

    if (!rateLimitResult.success) {
      const resetTime = Math.ceil((rateLimitResult.reset - Date.now()) / 1000 / 60);


      await dbConnect();
      if (username) {
        await AuthLog.logEvent({
          username,
          action: 'rate_limited',
          ip,
          userAgent,
          success: false,
          failureReason: 'rate_limited'
        });
      }

      return NextResponse.json(
        {
          error: 'Too many login attempts. Please try again later.',
          retryAfter: resetTime
        },
        {
          status: 429,
          headers: {
            'Retry-After': resetTime.toString(),
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimitResult.reset.toString()
          }
        }
      );
    }


    await dbConnect();

    const { username: user, password } = await request.json();
    username = user;

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    const userDoc = await User.findOne({ username });
    if (!userDoc) {

      await AuthLog.logEvent({
        username,
        action: 'login_failed',
        ip,
        userAgent,
        success: false,
        failureReason: 'invalid_username'
      });

      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const isMatch = await userDoc.comparePassword(password);
    if (!isMatch) {

      await AuthLog.logEvent({
        userId: userDoc._id,
        username,
        action: 'login_failed',
        ip,
        userAgent,
        success: false,
        failureReason: 'invalid_password'
      });

      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }


    const token = jwt.sign(
      {
        userId: userDoc._id,
        username: userDoc.username,
        tokenVersion: userDoc.tokenVersion || 0
      },
      process.env.JWT_TOKEN,
      {
        expiresIn: '48h',
        issuer: 'nk-pol-api',
        audience: 'nk-pol-admin'
      }
    );


    await AuthLog.logEvent({
      userId: userDoc._id,
      username,
      action: 'login_success',
      ip,
      userAgent,
      success: true
    });


    if (process.env.NODE_ENV === 'development') {
      console.log('Login successful for user:', username);
    }

    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: userDoc._id,
          username: userDoc.username
        },
        token: token
      },
      { status: 200 }
    );

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}