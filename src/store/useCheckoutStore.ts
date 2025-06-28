import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CheckoutGame {
  title: string;
  price: string;
  discount_price: string | null;
  thumbnail?: string;
  game_images?: Array<{
    image_url: string;
  }>;
}

export interface CheckoutItem {
  cart_item_id: number;
  cart_id: number;
  game_id: number;
  game: CheckoutGame;
}

interface CheckoutState {
  checkoutItems: CheckoutItem[];
  isSelectAllChecked: boolean;
  totalPrice: number;
  createdAt: string | null;
  
  // Actions
  setCheckoutData: (items: CheckoutItem[], selectAll: boolean, total: number) => void;
  clearCheckoutData: () => void;
  getCheckoutItems: () => CheckoutItem[];
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set, get) => ({
      checkoutItems: [],
      isSelectAllChecked: false,
      totalPrice: 0,
      createdAt: null,

      setCheckoutData: (items, selectAll, total) => {
        set({
          checkoutItems: items,
          isSelectAllChecked: selectAll,
          totalPrice: total,
          createdAt: new Date().toISOString(),
        });
      },

      clearCheckoutData: () => {
        set({
          checkoutItems: [],
          isSelectAllChecked: false,
          totalPrice: 0,
          createdAt: null,
        });
      },

      getCheckoutItems: () => {
        return get().checkoutItems;
      },
    }),
    {
      name: 'checkout-storage', // tên key trong localStorage
      // Có thể thêm options khác nếu cần
      partialize: (state) => ({
        checkoutItems: state.checkoutItems,
        isSelectAllChecked: state.isSelectAllChecked,
        totalPrice: state.totalPrice,
        createdAt: state.createdAt,
      }),
    }
  )
);