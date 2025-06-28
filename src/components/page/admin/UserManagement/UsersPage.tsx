'use client';

import { useState, useEffect } from 'react';
import { userService } from '@/services/userService';
import { UserResponse } from '@/types/user';
import UserCard from './UserCard';
import UserModal from './UserModal';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

const UsersPage = () => {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await userService.findAll();
      setUsers(response.data);
    } catch {
      toast.error('Lỗi khi tải danh sách người dùng');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddUser = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleEditUser = (user: UserResponse) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleDeleteUser = async (id: number) => {
    if (confirm('Bạn có chắc muốn xóa người dùng này?')) {
      try {
        await userService.delete(id);
        setUsers(users.filter((user) => user.user_id !== id));
        toast.success('Xóa người dùng thành công');
      } catch {
        toast.error('Lỗi khi xóa người dùng');
      }
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleUserSaved = () => {
    fetchUsers();
    handleModalClose();
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 bg-black">
      <Toaster position="top-right" />
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h1 className="text-xl sm:text-2xl font-bold text-white">Quản lý người dùng</h1>
        <button
          onClick={handleAddUser}
          className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Thêm người dùng
        </button>
      </div>

      {isLoading ? (
        <div className="text-center text-white">Đang tải...</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {users.map((user) => (
            <UserCard
              key={user.user_id}
              user={user}
              onEdit={handleEditUser}
              onDelete={handleDeleteUser}
            />
          ))}
        </div>
      )}

      <UserModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        user={selectedUser}
        onUserSaved={handleUserSaved}
      />
    </div>
  );
};

export default UsersPage;