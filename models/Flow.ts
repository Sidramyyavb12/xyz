import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IFlow extends Document {
  date: Date;
  code: string;
  name: string;
  action: 'IN' | 'OUT';
  qty: number;
  note?: string;
  inventoryId?: mongoose.Types.ObjectId;
  userId?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const FlowSchema = new Schema<IFlow>(
  {
    date: {
      type: Date,
      required: [true, 'Date is required'],
      default: Date.now,
    },
    code: {
      type: String,
      required: [true, 'Item code is required'],
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true,
    },
    action: {
      type: String,
      required: [true, 'Action is required'],
      enum: {
        values: ['IN', 'OUT'],
        message: 'Action must be either IN or OUT',
      },
    },
    qty: {
      type: Number,
      required: [true, 'Quantity is required'],
      min: [1, 'Quantity must be at least 1'],
    },
    note: {
      type: String,
      trim: true,
    },
    inventoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Inventory',
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
FlowSchema.index({ date: -1 }); // Sort by date descending
FlowSchema.index({ code: 1 });
FlowSchema.index({ action: 1 });
FlowSchema.index({ inventoryId: 1 });

// Prevent model overwrite during hot-reload in development
const Flow: Model<IFlow> = 
  mongoose.models.Flow || mongoose.model<IFlow>('Flow', FlowSchema);

export default Flow;
