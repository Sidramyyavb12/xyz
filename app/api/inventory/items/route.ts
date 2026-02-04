import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb/connection';
import Inventory from '@/models/Inventory';
import Flow from '@/models/Flow';
import { requireAuth } from '@/middleware/auth';

// GET - Get all items or search
export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const code = searchParams.get('code');

    // Build query
    const query: any = {};
    
    if (code) {
      query.code = code.toUpperCase();
    }
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { code: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
      ];
    }

    const items = await Inventory.find(query).sort({ name: 1 }).lean();

    return NextResponse.json(
      {
        success: true,
        data: items,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Get items error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to get items' },
      { status: 500 }
    );
  }
}

// POST - Add new item or update existing
export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const body = await request.json();
    const { code, name, category, size, quantity, price } = body;

    // Validation
    if (!code || !name || !category) {
      return NextResponse.json(
        { success: false, message: 'Code, name, and category are required' },
        { status: 400 }
      );
    }

    const itemCode = code.toUpperCase();

    // Check if item already exists
    const existingItem = await Inventory.findOne({ code: itemCode });

    if (existingItem) {
      // Update existing item quantity
      const addedQty = quantity || 0;
      existingItem.quantity += addedQty;
      existingItem.updatedBy = authResult.user.userId as any;
      
      // Update other fields if provided
      if (price !== undefined) existingItem.price = price;
      if (size) existingItem.size = size;
      
      await existingItem.save();

      // Create flow entry for IN
      if (addedQty > 0) {
        await Flow.create({
          date: new Date(),
          code: itemCode,
          name: existingItem.name,
          action: 'IN',
          qty: addedQty,
          note: 'Material added - quantity updated',
          inventoryId: existingItem._id,
          userId: authResult.user.userId,
        });
      }

      return NextResponse.json(
        {
          success: true,
          message: 'Item updated successfully',
          data: existingItem,
        },
        { status: 200 }
      );
    } else {
      // Create new item
      const newItem = await Inventory.create({
        code: itemCode,
        name,
        category,
        size,
        quantity: quantity || 0,
        price,
        createdBy: authResult.user.userId,
      });

      // Create flow entry for IN
      if (quantity && quantity > 0) {
        await Flow.create({
          date: new Date(),
          code: itemCode,
          name,
          action: 'IN',
          qty: quantity,
          note: 'New material added',
          inventoryId: newItem._id,
          userId: authResult.user.userId,
        });
      }

      return NextResponse.json(
        {
          success: true,
          message: 'Item created successfully',
          data: newItem,
        },
        { status: 201 }
      );
    }
  } catch (error: any) {
    console.error('Add item error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to add item' },
      { status: 500 }
    );
  }
}

// PUT - Update item
export async function PUT(request: NextRequest) {
  try {
    await connectDB();

    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const body = await request.json();
    const { code, name, category, size, quantity, price } = body;

    if (!code) {
      return NextResponse.json(
        { success: false, message: 'Item code is required' },
        { status: 400 }
      );
    }

    const item = await Inventory.findOne({ code: code.toUpperCase() });

    if (!item) {
      return NextResponse.json(
        { success: false, message: 'Item not found' },
        { status: 404 }
      );
    }

    // Update fields
    if (name) item.name = name;
    if (category) item.category = category;
    if (size !== undefined) item.size = size;
    if (quantity !== undefined) item.quantity = quantity;
    if (price !== undefined) item.price = price;
    item.updatedBy = authResult.user.userId as any;

    await item.save();

    return NextResponse.json(
      {
        success: true,
        message: 'Item updated successfully',
        data: item,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Update item error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to update item' },
      { status: 500 }
    );
  }
}

// DELETE - Remove item or reduce quantity
export async function DELETE(request: NextRequest) {
  try {
    await connectDB();

    const authResult = await requireAuth(request);
    if (!authResult.success) {
      return authResult.response;
    }

    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const qtyStr = searchParams.get('quantity');
    const note = searchParams.get('note');

    if (!code) {
      return NextResponse.json(
        { success: false, message: 'Item code is required' },
        { status: 400 }
      );
    }

    const item = await Inventory.findOne({ code: code.toUpperCase() });

    if (!item) {
      return NextResponse.json(
        { success: false, message: 'Item not found' },
        { status: 404 }
      );
    }

    const removeQty = qtyStr ? parseInt(qtyStr) : item.quantity;

    // Create flow entry for OUT
    await Flow.create({
      date: new Date(),
      code: item.code,
      name: item.name,
      action: 'OUT',
      qty: removeQty,
      note: note || 'Material removed',
      inventoryId: item._id,
      userId: authResult.user.userId,
    });

    // Update or delete item
    if (removeQty >= item.quantity) {
      // Remove item completely
      await Inventory.deleteOne({ _id: item._id });
      return NextResponse.json(
        {
          success: true,
          message: 'Item deleted successfully',
        },
        { status: 200 }
      );
    } else {
      // Reduce quantity
      item.quantity -= removeQty;
      item.updatedBy = authResult.user.userId as any;
      await item.save();

      return NextResponse.json(
        {
          success: true,
          message: 'Item quantity reduced successfully',
          data: item,
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error('Delete item error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Failed to delete item' },
      { status: 500 }
    );
  }
}
