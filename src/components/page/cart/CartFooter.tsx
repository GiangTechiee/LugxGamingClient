'use client';

interface CartFooterProps {
  totalPrice: number;
  selectedCount: number;
  onCheckout: () => void;
}

export default function CartFooter({ 
  totalPrice, 
  selectedCount, 
  onCheckout 
}: CartFooterProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  return (
    <div className="border-t border-gray-700 bg-gray-900 p-4 space-y-3">
      {/* Total price */}
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-400">
          Tổng cộng ({selectedCount} sản phẩm):
        </span>
        <span className="text-lg font-bold text-white">
          {formatPrice(totalPrice)}
        </span>
      </div>

      {/* Checkout button */}
      <button
        onClick={onCheckout}
        disabled={selectedCount === 0}
        className={`
          w-full py-3 px-4 rounded-lg font-medium text-white transition-colors
          ${selectedCount === 0
            ? 'bg-gray-600 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'
          }
        `}
      >
        Đặt hàng ({selectedCount})
      </button>
    </div>
  );
}