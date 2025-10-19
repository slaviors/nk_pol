import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/mongodb';
import User from '@/models/User';
import TokenBlacklist from '@/models/TokenBlacklist';

export async function getUserFromToken(request) {

  const authHeader = request.headers.get('authorization');
  let token = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  }

  if (!token) {
    throw new Error('No token provided');
  }

  try {
    await dbConnect();


    const isBlacklisted = await TokenBlacklist.isBlacklisted(token);
    if (isBlacklisted) {
      throw new Error('Token has been revoked');
    }


    const decoded = jwt.verify(token, process.env.JWT_TOKEN, {
      issuer: 'nk-pol-api',
      audience: 'nk-pol-admin'
    });


    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      throw new Error('User not found');
    }


    if (user.isLocked) {
      throw new Error('Account is locked');
    }


    if (user.tokenVersion && decoded.tokenVersion !== user.tokenVersion) {
      throw new Error('Token version mismatch');
    }

    return {
      userId: user._id,
      username: user.username,
      tokenVersion: user.tokenVersion || 0
    };
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    throw error;
  }
}

export async function isAuthenticated(request) {
  try {
    await getUserFromToken(request);
    return true;
  } catch (error) {
    return false;
  }
}