import { create } from "zustand";

interface useSaleModalStore {
  isOpen: boolean;
  isEditing: boolean;
  saleData?: {
    id: string;
    merchantId: string;
    productId: string;
    saleDate: Date;
    quantity: string;
  };
  onOpen: () => void;
  onClose: () => void;
  setIsEditing: (isEditing: boolean) => void;
  setSaleData: (saleData: {
    id: string;
    merchantId: string;
    productId: string;
    saleDate: Date;
    quantity: string;
  }) => void;
}

export const useSaleModal = create<useSaleModalStore>((set) => ({
  isOpen: false,
  isEditing: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  setIsEditing: (isEditing) => set({ isEditing }),
  setSaleData: (saleData) => set({ saleData }),
}));
