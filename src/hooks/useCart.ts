import { useState, useEffect } from 'react';
import { cartService } from '@/services/cartService';
import { CartItem } from '@/types/cart';

export interface UseCartReturn {
  items: CartItem[];
  loading: boolean;
  error: string | null;
  selectedItems: number[];
  selectAll: boolean;
  totalPrice: number;
  fetchCartItems: () => Promise<void>;
  addToCart: (gameId: number) => Promise<void>;
  removeFromCart: (cartItemId: number) => Promise<void>;
  clearCart: () => Promise<void>;
  toggleSelectItem: (cartItemId: number) => void;
  toggleSelectAll: () => void;
  setSelectedItems: (items: number[]) => void;
}

export function useCart(): UseCartReturn {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  const selectAll = selectedItems.length === items.length && items.length > 0;
  
  const totalPrice = items
    .filter(item => selectedItems.includes(item.cart_item_id))
    .reduce((total, item) => {
      const price = item.game.discount_price 
        ? parseFloat(item.game.discount_price) 
        : parseFloat(item.game.price);
      return total + price;
    }, 0);

  const fetchCartItems = async () => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('access_token');
    if (!token) {
      setItems([]);
      setSelectedItems([]);
      setError(null);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await cartService.getCartItems();
      setItems(response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (gameId: number) => {
    try {
      setError(null);
      await cartService.addToCart({ game_id: gameId });
      // Không cần gọi fetchCartItems ở đây nữa vì sẽ được gọi từ event listener
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      throw err;
    }
  };

  const removeFromCart = async (cartItemId: number) => {
    try {
      setError(null);
      await cartService.removeFromCart(cartItemId);
      setItems(prev => prev.filter(item => item.cart_item_id !== cartItemId));
      setSelectedItems(prev => prev.filter(id => id !== cartItemId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      throw err;
    }
  };

  const clearCart = async () => {
    try {
      setError(null);
      await cartService.clearCart();
      setItems([]);
      setSelectedItems([]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra');
      throw err;
    }
  };

  const toggleSelectItem = (cartItemId: number) => {
    setSelectedItems(prev => 
      prev.includes(cartItemId)
        ? prev.filter(id => id !== cartItemId)
        : [...prev, cartItemId]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([]);
    } else {
      setSelectedItems(items.map(item => item.cart_item_id));
    }
  };

  // Lắng nghe sự kiện đăng nhập, đăng xuất và thay đổi localStorage
  useEffect(() => {
    const handleAuthChange = () => {
      fetchCartItems();
    };

    const handleCartUpdate = () => {
      fetchCartItems();
    };

    // Các event listeners
    window.addEventListener('login-success', handleAuthChange);
    window.addEventListener('auth-change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('cart-updated', handleCartUpdate);

    // Kiểm tra ngay lập tức khi mount
    fetchCartItems();

    return () => {
      window.removeEventListener('login-success', handleAuthChange);
      window.removeEventListener('auth-change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('cart-updated', handleCartUpdate);
    };
  }, []);

  return {
    items,
    loading,
    error,
    selectedItems,
    selectAll,
    totalPrice,
    fetchCartItems,
    addToCart,
    removeFromCart,
    clearCart,
    toggleSelectItem,
    toggleSelectAll,
    setSelectedItems,
  };
}