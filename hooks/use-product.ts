import { Product } from "@prisma/client";
import { create } from "zustand";

interface useProductStore {
  products: Product[];
  setProducts: (products: Product[]) => void;
}

export const useProduct = create<useProductStore>((set) => ({
  products: [],
  setProducts: (products) => set({ products }),
}));
