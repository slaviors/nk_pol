import jwt from 'jsonwebtoken';

export async function getUserFromToken(request) {

  let token = request.cookies.get('auth-token')?.value;

  if (!token) {
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }
  
  if (!token) {
    throw new Error('No token provided');
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_TOKEN);
    return decoded;
  } catch (error) {
    throw new Error('Invalid token');
  }
}

/**
 * Verify if request has valid authentication
 * @param {Request} request - Next.js request object
 * @returns {boolean} True if authenticated
 */
export async function isAuthenticated(request) {
  try {
    await getUserFromToken(request);
    return true;
  } catch (error) {
    return false;
  }
}

