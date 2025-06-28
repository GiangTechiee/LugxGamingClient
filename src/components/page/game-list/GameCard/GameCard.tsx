"use client";

import { Game } from "@/types/game";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCartIcon, CheckIcon } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import { HeartIcon as HeartOutlineIcon } from "@heroicons/react/24/outline";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { getPlatformIcon } from "./platformIcons";
import { useState } from "react";
import toast from "react-hot-toast";

const GameCard = ({ game }: { game: Game }) => {
  const { addToCart } = useCart();
  const {
    toggleWishlist,
    isAddingToWishlist,
    isInWishlist,
    isCheckingWishlist,
  } = useWishlist(game.game_id);
  const [isAdding, setIsAdding] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const formatPrice = (price: number) => {
    return (price / 1000).toLocaleString("vi-VN") + " VNĐ";
  };

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const token = localStorage.getItem("access_token");
    if (!token) {
      toast.error("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng", {
        duration: 3000,
        position: "bottom-center",
      });
      return;
    }

    if (isAdding || justAdded) return;

    const loadingToast = toast.loading("Đang thêm vào giỏ hàng...", {
      position: "bottom-center",
    });

    try {
      setIsAdding(true);
      await addToCart(game.game_id);

      toast.dismiss(loadingToast);
      toast.success(`Đã thêm "${game.title}" vào giỏ hàng!`, {
        duration: 3000,
        position: "bottom-center",
      });

      setJustAdded(true);
      window.dispatchEvent(new CustomEvent("cart-updated"));

      setTimeout(() => {
        setJustAdded(false);
      }, 2000);
    } catch {
      toast.dismiss(loadingToast);

      const errorMessage = "Có lỗi xảy ra khi thêm sản phẩm vào giỏ hàng";

      toast.error(errorMessage, {
        duration: 3000,
        position: "bottom-center",
      });
    } finally {
      setIsAdding(false);
    }
  };

  const handleToggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    await toggleWishlist();
  };

  const getCartButtonState = () => {
    if (isAdding) {
      return {
        className: "bg-gray-600 cursor-not-allowed",
        title: "Đang thêm...",
        icon: (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ),
      };
    }

    if (justAdded) {
      return {
        className: "bg-green-600",
        title: "Đã thêm vào giỏ hàng",
        icon: <CheckIcon className="w-4 h-4 text-white" />,
      };
    }

    return {
      className: "bg-blue-600 hover:bg-blue-700",
      title: "Thêm vào giỏ hàng",
      icon: <ShoppingCartIcon className="w-4 h-4 text-white" />,
    };
  };

  const getWishlistButtonState = () => {
    if (isAddingToWishlist || isCheckingWishlist) {
      return {
        className: "bg-gray-600 cursor-not-allowed",
        title: "Đang xử lý...",
        icon: (
          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
        ),
      };
    }

    return {
      className: isInWishlist
        ? "bg-red-600 hover:bg-red-700"
        : "bg-red-600 hover:bg-red-700",
      title: isInWishlist ? "Xóa khỏi wishlist" : "Thêm vào wishlist",
      icon: isInWishlist ? (
        <HeartSolidIcon className="w-4 h-4 text-white" />
      ) : (
        <HeartOutlineIcon className="w-4 h-4 text-white" />
      ),
    };
  };

  const cartButtonState = getCartButtonState();
  const wishlistButtonState = getWishlistButtonState();

  return (
    <motion.div
      className="bg-gray-800 rounded-lg overflow-hidden flex flex-col h-full w-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
    >
      <Link
        href={`/games/${game.game_id}`}
        className="relative w-full flex-shrink-0 aspect-video"
      >
        <Image
          src={game.thumbnail}
          alt={game.title}
          fill
          style={{ objectFit: "cover" }}
          sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
          priority
        />
      </Link>

      <div className="p-3 flex flex-col flex-1">
        <Link href={`/games/${game.game_id}`}>
          <h3
            className="text-white font-semibold text-sm mb-2 flex-shrink-0 h-10 overflow-hidden hover:text-blue-400 transition-colors"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              lineHeight: "1.25rem",
            }}
          >
            {game.title}
          </h3>
        </Link>

        <div className="flex justify-end mb-2 flex-shrink-0">
          <div className="flex gap-1">
            {game.platforms && game.platforms.length > 0 ? (
              game.platforms.map((platform, index) => {
                const icon = getPlatformIcon(platform);
                return icon ? (
                  <div key={index} className="text-gray-400">
                    {icon}
                  </div>
                ) : null;
              })
            ) : (
              <div className="text-gray-500 text-xs">No platforms</div>
            )}
          </div>
        </div>

        <hr className="border-gray-600 mb-2 flex-shrink-0" />

        <div className="flex items-center justify-between mt-auto">
          <div className="flex-1">
            {game.discount_price ? (
              <div className="space-y-1">
                <div className="text-green-400 font-semibold text-sm">
                  {formatPrice(game.discount_price)}
                </div>
                <div className="text-gray-400 text-xs line-through">
                  {formatPrice(game.price)}
                </div>
              </div>
            ) : (
              <div className="text-white font-semibold text-sm">
                {formatPrice(game.price)}
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <motion.button
              onClick={handleToggleWishlist}
              disabled={isAddingToWishlist || isCheckingWishlist}
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${wishlistButtonState.className}`}
              whileHover={
                !(isAddingToWishlist || isCheckingWishlist)
                  ? { backgroundColor: "#b91c1c" }
                  : {}
              }
              whileTap={
                !(isAddingToWishlist || isCheckingWishlist)
                  ? { scale: 0.95 }
                  : {}
              }
              transition={{ duration: 0.2 }}
              title={wishlistButtonState.title}
            >
              {wishlistButtonState.icon}
            </motion.button>

            <motion.button
              onClick={handleAddToCart}
              disabled={isAdding || justAdded}
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 ${cartButtonState.className}`}
              whileHover={
                !isAdding && !justAdded ? { backgroundColor: "#1d4ed8" } : {}
              }
              whileTap={!isAdding && !justAdded ? { scale: 0.95 } : {}}
              transition={{ duration: 0.2 }}
              title={cartButtonState.title}
            >
              {cartButtonState.icon}
            </motion.button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default GameCard;
