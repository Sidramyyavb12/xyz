import {create} from "zustand";
import { getStock, getFlow } from "@/app/api/inventory";

type Item = { code: string; name: string; category: string; size?: string; quantity?: number; price?: number; };
type Flow = { _id: string; date: string; code: string; name: string; action: "IN"|"OUT"; qty: number; note?: string; };

interface State {
  stock: Item[];
  flow: Flow[];
  fetchStock: () => Promise<void>;
  fetchFlow: () => Promise<void>;
}

export const useInventoryStore = create<State>((set) => ({
  stock: [],
  flow: [],
  fetchStock: async () => {
    const res = await getStock();
    set({ stock: res?.data ?? [] });
  },
  fetchFlow: async () => {
    const res = await getFlow();
    set({ flow: res?.data ?? [] });
  }
}));
