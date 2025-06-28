'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { userService } from '@/services/userService';
import { UserResponse, CreateUser, UpdateUserByAdmin } from '@/types/user';
import { toast } from 'react-hot-toast';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserResponse | null;
  onUserSaved: () => void;
}

const UserModal = ({ isOpen, onClose, user, onUserSaved }: UserModalProps) => {
  const [formData, setFormData] = useState<CreateUser | UpdateUserByAdmin>({
    username: '',
    email: '',
    password: '',
    full_name: '',
    phone_number: '',
    role: 'CUSTOMER',
  });
  const [isActive, setIsActive] = useState<boolean>(true);

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        full_name: user.full_name || '',
        phone_number: user.phone_number || '',
        role: user.role,
      });
      setIsActive(user.is_active);
    } else {
      setFormData({
        username: '',
        email: '',
        password: '',
        full_name: '',
        phone_number: '',
        role: 'CUSTOMER',
      });
      setIsActive(true);
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setIsActive((e.target as HTMLInputElement).checked);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (user) {
        const updateData: UpdateUserByAdmin = {
          ...formData,
          is_active: isActive,
        };
        await userService.updateByAdmin(user.user_id, updateData);
        toast.success('Cập nhật người dùng thành công');
      } else {
        await userService.create(formData as CreateUser);
        toast.success('Tạo người dùng thành công');
      }
      onUserSaved();
    } catch {
      toast.error('Lỗi khi lưu người dùng');
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 px-4 sm:px-0">
      <div className="bg-gray-800 rounded-lg p-4 sm:p-6 w-11/12 sm:w-full max-w-md mx-auto flex flex-col max-h-[80vh]">
        <h2 className="text-xl font-bold mb-4 text-white">
          {user ? 'Sửa người dùng' : 'Thêm người dùng'}
        </h2>
        <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-white">Tên đăng nhập</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
                required={!user}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
                required
              />
            </div>
            {!user && (
              <div>
                <label className="block text-sm font-medium text-white">Mật khẩu</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password || ''}
                  onChange={handleChange}
                  className="mt-1 w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
                  required
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-white">Họ tên</label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white">Số điện thoại</label>
              <input
                type="text"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-white">Vai trò</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="mt-1 w-full px-3 py-2 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-700 text-white"
              >
                <option value="ADMIN">ADMIN</option>
                <option value="CUSTOMER">CUSTOMER</option>
              </select>
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-white">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={isActive}
                  onChange={handleChange}
                  className="mr-2 rounded bg-gray-700 border-gray-600 focus:ring-blue-500 text-blue-500"
                />
                Kích hoạt
              </label>
            </div>
          </form>
        </div>
        <div className="flex justify-center space-x-3 mt-4">
          <button
            onClick={onClose}
            className="w-10 h-10 bg-gray-600 text-white rounded-full hover:bg-gray-700 transition-colors flex items-center justify-center"
            title="Hủy"
          >
            <span className="text-lg">✕</span>
          </button>
          <button
            onClick={handleSubmit}
            className="w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center"
            title="Lưu"
          >
            <span className="text-lg">✔</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default UserModal;