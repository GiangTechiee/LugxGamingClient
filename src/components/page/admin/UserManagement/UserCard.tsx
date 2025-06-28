import { UserResponse } from '@/types/user';
import { Pencil, Trash2 } from "lucide-react";

interface UserCardProps {
  user: UserResponse;
  onEdit: (user: UserResponse) => void;
  onDelete: (id: number) => void;
}

const UserCard = ({ user, onEdit, onDelete }: UserCardProps) => {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-md hover:shadow-lg transition flex flex-col h-full text-white">
      <div className="flex-1 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">ID:</span>
          <span className="text-white font-medium">#{user.user_id}</span>
        </div>
        <div>
          <span className="text-sm text-gray-400">Tên đăng nhập:</span>
          <span className="text-white font-medium"> {user.username}</span>
        </div>
        <div className="flex items-center justify-between">
          {/* <span className="text-sm text-gray-400">Email:</span> */}
          <span className="text-white font-medium truncate max-w-[100%]">{user.email}</span>
        </div>
        <div>
          <span className="text-sm text-gray-400">Họ tên:</span>
          <span className="text-white font-medium"> {user.full_name || 'Chưa có'}</span>
        </div>
        <div>
          <span className="text-sm text-gray-400">Số điện thoại:</span>
          <span className="text-white font-medium"> {user.phone_number || 'Chưa có'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Vai trò:</span>
          <span className={`text-sm font-medium px-3 py-1 rounded-full bg-blue-600`}>
            {user.role}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-400">Kích hoạt email:</span>
          <span className={`w-3 h-3 rounded-full ${user.is_active ? 'bg-green-500' : 'bg-red-500'}`}></span>
        </div>
      </div>
      <hr className="border-gray-600 my-4" />
      <div className="flex justify-center space-x-3">
        <button
          onClick={() => onEdit(user)}
          className="w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors flex items-center justify-center"
          title="Sửa"
        >
          <Pencil size={16} />
        </button>
        <button
          onClick={() => onDelete(user.user_id)}
          className="w-10 h-10 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors flex items-center justify-center"
          title="Xóa"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

export default UserCard;