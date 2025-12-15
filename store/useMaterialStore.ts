import {create} from "zustand";

interface MaterialState {
  materials: any[];
  setMaterials: (m: any[]) => void;
}

export const useMaterialStore = create<MaterialState>((set) => ({
  materials: [],
  setMaterials: (m) => set({ materials: m }),
}));
