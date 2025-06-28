'use client';

import { Edit } from 'lucide-react';
import { UserResponse } from '@/types/user';

interface UserInfoSectionProps {
  user: UserResponse;
  onEditProfile: () => void;
  hideEditButton?: boolean;
}

export default function UserInfoSection({ 
  user, 
  onEditProfile, 
  hideEditButton = false 
}: UserInfoSectionProps) {
  return (
    <div className="bg-gray-900 p-6 rounded-lg border border-gray-200 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Thông tin người dùng</h2>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Mã người dùng
          </label>
          <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded-full">
            #{user.user_id}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Tên đăng nhập
          </label>
          <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded-full">
            {user.username}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Họ và tên
          </label>
          <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded-full">
            {user.full_name || 'Chưa cập nhật'}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Email
          </label>
          <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded-full">
            {user.email}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white mb-1">
            Số điện thoại
          </label>
          <div className="text-gray-900 bg-gray-50 px-3 py-2 rounded-full">
            {user.phone_number || 'Chưa cập nhật'}
          </div>
        </div>

        {!hideEditButton && (
          <button
            onClick={onEditProfile}
            className="flex items-center gap-2 px-4 py-2 text-green-400 hover:text-blue-700 hover:bg-blue-50 rounded-full transition-colors"
          >
            <Edit className="w-4 h-4" />
            Chỉnh sửa
          </button>
        )}
      </div>
    </div>
  );
}