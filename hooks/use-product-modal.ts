import { create } from "zustand";

interface useProductModalStore {
  isOpen: boolean;
  isEditing: boolean;
  productData?: {
    id: string;
    name: string;
    description: string;
    stockThreshold: string;
    stock: string;
  };
  onOpen: () => void;
  onClose: () => void;
  setIsEditing: (isEditing: boolean) => void;
  setProductData: (productData: {
    id: string;
    name: string;
    description: string;
    stockThreshold: string;
    stock: string;
  }) => void;
}

export const useProductModal = create<useProductModalStore>((set) => ({
  isOpen: false,
  isEditing: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setIsEditing: (isEditing) => set({ isEditing }),
  setProductData: (productData) => set({ productData }),
}));
