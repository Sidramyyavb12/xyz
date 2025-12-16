import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Item = {
  code: string;
  name: string;
  category: string;
  size?: string;
  quantity?: number;
  price?: number;
};

export type Flow = {
  _id: string;
  date: string;
  code: string;
  name: string;
  action: "IN" | "OUT";
  qty: number;
  note?: string;
};

interface InventoryState {
  stock: Item[];
  flow: Flow[];
  loading: boolean;
  error: string | null;
}

const initialState: InventoryState = {
  stock: [],
  flow: [],
  loading: false,
  error: null,
};

const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    setStock: (state, action: PayloadAction<Item[]>) => {
      state.stock = action.payload;
      state.loading = false;
      state.error = null;
    },
    setFlow: (state, action: PayloadAction<Flow[]>) => {
      state.flow = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
    addItem: (state, action: PayloadAction<Item>) => {
      // Check if item already exists
      const existingIndex = state.stock.findIndex(item => item.code === action.payload.code);
      
      if (existingIndex !== -1) {
        // Update existing item quantity
        state.stock[existingIndex].quantity = (state.stock[existingIndex].quantity || 0) + (action.payload.quantity || 0);
      } else {
        // Add new item
        state.stock.push(action.payload);
      }
      
      // Add to material flow as IN
      const flowEntry: Flow = {
        _id: `flow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        date: new Date().toISOString(),
        code: action.payload.code,
        name: action.payload.name,
        action: "IN",
        qty: action.payload.quantity || 0,
        note: "Material added",
      };
      state.flow.unshift(flowEntry); // Add to beginning of array
    },
    updateItem: (state, action: PayloadAction<Item>) => {
      const index = state.stock.findIndex(item => item.code === action.payload.code);
      if (index !== -1) {
        state.stock[index] = action.payload;
      }
    },
    removeItem: (state, action: PayloadAction<{ code: string; quantity: number; note?: string }>) => {
      const index = state.stock.findIndex(item => item.code === action.payload.code);
      
      if (index !== -1) {
        const item = state.stock[index];
        const removedQty = action.payload.quantity;
        
        // Add to material flow as OUT
        const flowEntry: Flow = {
          _id: `flow_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          date: new Date().toISOString(),
          code: item.code,
          name: item.name,
          action: "OUT",
          qty: removedQty,
          note: action.payload.note || "Material removed",
        };
        state.flow.unshift(flowEntry); // Add to beginning of array
        
        // Update or remove item from stock
        const newQuantity = (item.quantity || 0) - removedQty;
        
        if (newQuantity <= 0) {
          // Remove item if quantity is 0 or less
          state.stock.splice(index, 1);
        } else {
          // Update quantity
          state.stock[index].quantity = newQuantity;
        }
      }
    },
    deleteItem: (state, action: PayloadAction<string>) => {
      state.stock = state.stock.filter(item => item.code !== action.payload);
    },
    addFlowEntry: (state, action: PayloadAction<Flow>) => {
      state.flow.unshift(action.payload);
    },
  },
});

export const {
  setStock,
  setFlow,
  setLoading,
  setError,
  addItem,
  updateItem,
  removeItem,
  deleteItem,
  addFlowEntry,
} = inventorySlice.actions;

export default inventorySlice.reducer;
