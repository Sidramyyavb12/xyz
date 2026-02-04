import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb/connection';
import Inventory from '@/models/Inventory';
import { requireAuth } from '@/middleware/auth';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    // Authenticate user (optional for read operations, but keeping for consistency)
    const authResult = await requireAuth(request);
    
    if (!authResult.success) {
      return authResult.response;
    }

    // Get all inventory items
    const items = await Inventory.find({})
      .sort({ name: 1 })
      .select('-__v')
      .lean();

    // Transform data to match frontend format
    const stock = items.map((item: any) => ({
      code: item.code,
      name: item.name,
      category: item.category,
      size: item.size,
      quantity: item.quantity,
      price: item.price,
    }));

    return NextResponse.json(
      {
        success: true,
        data: stock,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get stock error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to get stock' },
      { status: 500 }
    );
  }
}
