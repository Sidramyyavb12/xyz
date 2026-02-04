import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb/connection';
import Flow from '@/models/Flow';
import { requireAuth } from '@/middleware/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Authenticate user
    const authResult = await requireAuth(request);
    
    if (!authResult.success) {
      return authResult.response;
    }

    // Get query parameters for filtering
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '100');
    const skip = parseInt(searchParams.get('skip') || '0');
    const action = searchParams.get('action'); // Filter by IN/OUT

    // Build query
    const query: any = {};
    if (action && (action === 'IN' || action === 'OUT')) {
      query.action = action;
    }

    // Get flow records
    const flows = await Flow.find(query)
      .sort({ date: -1 }) // Most recent first
      .limit(limit)
      .skip(skip)
      .select('-__v')
      .lean();

    // Get total count
    const total = await Flow.countDocuments(query);

    // Transform data to match frontend format
    const flowData = flows.map((flow: any) => ({
      _id: flow._id.toString(),
      date: flow.date.toISOString(),
      code: flow.code,
      name: flow.name,
      action: flow.action,
      qty: flow.qty,
      note: flow.note,
    }));

    return NextResponse.json(
      {
        success: true,
        data: flowData,
        total,
        limit,
        skip,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get flow error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to get flow data' },
      { status: 500 }
    );
  }
}
