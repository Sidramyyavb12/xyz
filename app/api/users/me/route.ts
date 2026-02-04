import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb/connection';
import User from '@/models/User';
import { requireAuth } from '@/middleware/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Authenticate user
    const authResult = await requireAuth(request);
    
    if (!authResult.success) {
      return authResult.response;
    }

    const { user: tokenPayload } = authResult;

    // Get user from database
    const user = await User.findById(tokenPayload.userId);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Return user data
    const userData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      primaryRole: user.primaryRole,
      roles: user.roles,
      instructorRating: user.instructorRating,
      createdAt: user.createdAt,
    };

    return NextResponse.json(
      {
        success: true,
        data: userData,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get user error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to get user' },
      { status: 500 }
    );
  }
}
