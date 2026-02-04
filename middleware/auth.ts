import { NextRequest, NextResponse } from 'next/server';
import { verifyAccessToken, TokenPayload } from '@/lib/jwt';

export interface AuthenticatedRequest extends NextRequest {
  user?: TokenPayload;
}

/**
 * Middleware to verify JWT token and attach user to request
 */
export async function authenticate(request: NextRequest): Promise<{
  authenticated: boolean;
  user?: TokenPayload;
  error?: string;
}> {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        authenticated: false,
        error: 'No token provided',
      };
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    const decoded = verifyAccessToken(token);

    if (!decoded) {
      return {
        authenticated: false,
        error: 'Invalid or expired token',
      };
    }

    return {
      authenticated: true,
      user: decoded,
    };
  } catch (error) {
    return {
      authenticated: false,
      error: 'Authentication failed',
    };
  }
}

/**
 * Helper function to create unauthorized response
 */
export function unauthorizedResponse(message: string = 'Unauthorized') {
  return NextResponse.json(
    { success: false, message },
    { status: 401 }
  );
}

/**
 * Helper function to extract user from request or return error response
 */
export async function requireAuth(request: NextRequest): Promise<
  { success: true; user: TokenPayload } | { success: false; response: NextResponse }
> {
  const authResult = await authenticate(request);

  if (!authResult.authenticated || !authResult.user) {
    return {
      success: false,
      response: unauthorizedResponse(authResult.error),
    };
  }

  return {
    success: true,
    user: authResult.user,
  };
}
