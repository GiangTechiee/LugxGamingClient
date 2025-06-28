'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  ShoppingCart,
  User,
  Key,
  Shield,
  LogOut,
  ChevronDown,
  Heart,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import CartSidebar from '../page/cart/CartSidebar';
import { useCartSidebar } from '@/hooks/useCartSidebar';
import { useProfileModal } from '@/hooks/useProfileModal';
import { useWishlistModal } from '@/hooks/useWishlistModal';
import ProfileModal from '../forms/ProfileModal';
import WishlistModal from '../page/wishlist/WishlistModal';
import { UserResponse } from '@/types/user';
import { userService } from '@/services/userService';
import toast from 'react-hot-toast';

export default function Navigation() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [user, setUser] = useState<UserResponse | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { logout } = useAuth();
  const { fetchCartItems } = useCart();
  const router = useRouter();
  const { isOpen: isCartOpen, toggleSidebar, closeSidebar, sidebarRef, buttonRef: cartButtonRef } = useCartSidebar();
  const { isOpen: isModalOpen, openModal, closeModal } = useProfileModal();
  const { isOpen: isWishlistOpen, openModal: openWishlistModal, closeModal: closeWishlistModal } = useWishlistModal();

  // Kiểm tra thông tin user từ localStorage
  const checkUserAuth = () => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      try {
        const parsedUser: UserResponse = JSON.parse(userData);
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data:', error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  };

  // Lắng nghe thay đổi trong localStorage và sự kiện auth
  useEffect(() => {
    checkUserAuth();

    const handleAuthChange = () => {
      checkUserAuth();
    };

    window.addEventListener('login-success', handleAuthChange);
    window.addEventListener('auth-change', handleAuthChange);
    window.addEventListener('storage', handleAuthChange);

    return () => {
      window.removeEventListener('login-success', handleAuthChange);
      window.removeEventListener('auth-change', handleAuthChange);
      window.removeEventListener('storage', handleAuthChange);
    };
  }, []);

  // Đóng dropdown khi click bên ngoài
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await logout();
    window.dispatchEvent(new Event('auth-change'));
  };

  const navigateToChangePassword = () => {
    setIsDropdownOpen(false);
    router.push('/auth/reset-password');
  };

  const navigateToAdmin = () => {
    setIsDropdownOpen(false);
    router.push('/admin');
  };

  const getInitials = (username: string): string => {
    return username.charAt(0).toUpperCase();
  };

  const handleCartClick = () => {
    toggleSidebar();
    if (user) {
      fetchCartItems();
    }
  };

  const handleOpenProfile = async () => {
    if (!user) return;

    try {
      const response = await userService.findOne(user.user_id);
      setUser(response.data);
      localStorage.setItem('user', JSON.stringify(response.data));
      openModal();
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Không thể tải thông tin người dùng.');
    }
    setIsDropdownOpen(false);
  };

  const handleOpenWishlist = () => {
    openWishlistModal();
    setIsDropdownOpen(false);
  };

  return (
    <>
      <nav className="flex items-center gap-4 sm:gap-6 flex-shrink-0">
        <button
          ref={cartButtonRef}
          onClick={handleCartClick}
          className="text-white hover:text-blue-400 transition-colors"
        >
          <ShoppingCart className="h-6 w-6" />
        </button>

        {user ? (
          <div className="relative">
            <button
              ref={buttonRef}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-2 p-1 rounded-full hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                {getInitials(user.username)}
              </div>
              <ChevronDown
                className={`w-4 h-4 text-white transition-transform duration-200 hidden sm:block ${
                  isDropdownOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isDropdownOpen && (
              <div
                ref={dropdownRef}
                className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50"
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {user.username}
                  </p>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-1">
                    {user.role}
                  </span>
                </div>

                <div className="py-1">
                  <button
                    onClick={handleOpenProfile}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <User className="w-4 h-4 mr-3" />
                    Tài khoản của tôi
                  </button>

                  <button
                    onClick={handleOpenWishlist}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Heart className="w-4 h-4 mr-3" />
                    Danh sách yêu thích
                  </button>

                  <button
                    onClick={navigateToChangePassword}
                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                  >
                    <Key className="w-4 h-4 mr-3" />
                    Đổi mật khẩu
                  </button>

                  {user.role === 'ADMIN' && (
                    <button
                      onClick={navigateToAdmin}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <Shield className="w-4 h-4 mr-3" />
                      Admin Dashboard
                    </button>
                  )}
                </div>

                <div className="border-t border-gray-100 py-1">
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    Đăng xuất
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/auth/login"
            className="text-white hover:text-blue-400 transition-colors"
          >
            <User className="h-6 w-6" />
          </Link>
        )}
      </nav>

      <CartSidebar
        isOpen={isCartOpen}
        onClose={closeSidebar}
        sidebarRef={sidebarRef}
      />

      <ProfileModal isOpen={isModalOpen} onClose={closeModal} user={user} />
      
      <WishlistModal isOpen={isWishlistOpen} onClose={closeWishlistModal} user={user} />
    </>
  );
}