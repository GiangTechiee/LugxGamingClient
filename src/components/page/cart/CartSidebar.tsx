"use client";

import { X, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { useCheckoutStore } from "@/store/useCheckoutStore";
import CartItem from "./CartItem";
import CartHeader from "./CartHeader";
import CartFooter from "./CartFooter";

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  sidebarRef: React.RefObject<HTMLDivElement | null>;
}

export default function CartSidebar({
  isOpen,
  onClose,
  sidebarRef,
}: CartSidebarProps) {
  const router = useRouter();

  const {
    items,
    loading,
    error,
    selectedItems,
    selectAll,
    totalPrice,
    removeFromCart,
    clearCart,
    toggleSelectItem,
    toggleSelectAll,
  } = useCart();

  const { setCheckoutData } = useCheckoutStore();

  const handleRemoveItem = async (cartItemId: number) => {
    try {
      await removeFromCart(cartItemId);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      alert("Vui lòng chọn ít nhất một sản phẩm để đặt hàng");
      return;
    }

    // Lọc ra các items được chọn
    const selectedCartItems = items.filter(item => 
      selectedItems.includes(item.cart_item_id)
    );

    // Chuyển đổi sang format CheckoutItem
    const checkoutItems = selectedCartItems.map(item => ({
      cart_item_id: item.cart_item_id,
      cart_id: item.cart_id,
      game_id: item.game_id,
      game: {
        title: item.game.title,
        price: item.game.price,
        discount_price: item.game.discount_price,
        thumbnail: item.game.thumbnail,
        game_images: item.game.game_images,
      }
    }));

    // Lưu vào store
    setCheckoutData(checkoutItems, selectAll, totalPrice);

    console.log("Checkout data saved:", {
      items: checkoutItems,
      selectAll,
      totalPrice,
      timestamp: new Date().toISOString()
    });

    onClose();

    router.push('/checkout');
  };

  return (
    <>
      {/* Overlay - Chỉ che vùng content, không che header */}
      {isOpen && (
        <div
          className="fixed bg-white/20 z-[45]"
          onClick={onClose}
          style={{
            top: "72px", // Bắt đầu từ sau header
            left: 0,
            right: 0,
            bottom: 0,
          }}
        />
      )}

      {/* Sidebar - Z-index cao hơn overlay, thấp hơn header */}
      <div
        ref={sidebarRef}
        className={`
          fixed top-0 right-0 w-full max-w-md bg-gray-900 shadow-2xl z-[50]
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}
        `}
        style={{
          height: "100vh", // Full height từ top
        }}
      >
        <div className="flex flex-col h-full">
          {/* Header - Nền đen với text trắng */}
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-white">
              <ShoppingCart className="w-5 h-5" />
              Giỏ hàng
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-800 rounded-full transition-colors text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col">
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-gray-400">Đang tải...</div>
              </div>
            ) : error ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-red-400 text-center px-4">
                  <p>Có lỗi xảy ra</p>
                  <p className="text-sm mt-1">{error}</p>
                </div>
              </div>
            ) : items.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-gray-400 text-center">
                  <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                  <p>Giỏ hàng trống</p>
                </div>
              </div>
            ) : (
              <>
                {/* Cart Header */}
                <CartHeader
                  totalItems={items.length}
                  selectAll={selectAll}
                  onToggleSelectAll={toggleSelectAll}
                  onClearCart={handleClearCart}
                />

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto">
                  <div className="space-y-2 p-4">
                    {items.map((item) => (
                      <CartItem
                        key={item.cart_item_id}
                        item={item}
                        isSelected={selectedItems.includes(item.cart_item_id)}
                        onToggleSelect={() =>
                          toggleSelectItem(item.cart_item_id)
                        }
                        onRemove={() => handleRemoveItem(item.cart_item_id)}
                        onNavigate={onClose}
                      />
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <CartFooter
                  totalPrice={totalPrice}
                  selectedCount={selectedItems.length}
                  onCheckout={handleCheckout}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}