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
      state.stock.push(action.payload);
    },
    updateItem: (state, action: PayloadAction<Item>) => {
      const index = state.stock.findIndex(item => item.code === action.payload.code);
      if (index !== -1) {
        state.stock[index] = action.payload;
      }
    },
    deleteItem: (state, action: PayloadAction<string>) => {
      state.stock = state.stock.filter(item => item.code !== action.payload);
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
  deleteItem,
} = inventorySlice.actions;

export default inventorySlice.reducer;