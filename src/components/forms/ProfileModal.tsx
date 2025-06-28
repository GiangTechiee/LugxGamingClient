import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useState, useEffect } from 'react';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';
import { userService } from '@/services/userService';
import { UserResponse } from '@/types/user';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserResponse | null;
}

export default function ProfileModal({ isOpen, onClose, user }: ProfileModalProps) {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone_number: user?.phone_number || '',
  });
  const [initialData, setInitialData] = useState({
    username: user?.username || '',
    full_name: user?.full_name || '',
    email: user?.email || '',
    phone_number: user?.phone_number || '',
  });
  const [hasChanges, setHasChanges] = useState(false);

  // Đồng bộ formData và initialData với user khi user thay đổi
  useEffect(() => {
    if (user) {
      const newInitialData = {
        username: user.username || '',
        full_name: user.full_name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
      };
      setFormData(newInitialData);
      setInitialData(newInitialData);
      setHasChanges(false); // Reset hasChanges khi user thay đổi
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value };
      // Kiểm tra thay đổi so với initialData
      const isChanged =
        newData.username !== initialData.username ||
        newData.full_name !== initialData.full_name ||
        newData.email !== initialData.email ||
        newData.phone_number !== initialData.phone_number;
      setHasChanges(isChanged);
      return newData;
    });
  };

  const handleUpdate = async () => {
    if (!user || !hasChanges) return;

    try {
      const updateData = {
        full_name: formData.full_name || undefined,
        email: formData.email || undefined,
        phone_number: formData.phone_number || undefined,
      };

      await userService.updateByCustomer(user.user_id, updateData);
      toast.success('Cập nhật thông tin thành công!');
      // Cập nhật initialData với giá trị mới
      setInitialData({ ...formData });
      onClose();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : 'Cập nhật thông tin thất bại.',
      );
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-white/20" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-black p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-white"
                  >
                    Thông tin tài khoản
                  </Dialog.Title>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600"
                    onClick={onClose}
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                {user ? (
                  <div className="mt-4 space-y-4">
                    <div>
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium text-white"
                      >
                        Tên người dùng
                      </label>
                      <input
                        type="text"
                        name="username"
                        id="username"
                        value={formData.username}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-full bg-white text-black border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                        disabled
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="full_name"
                        className="block text-sm font-medium text-white"
                      >
                        Họ tên
                      </label>
                      <input
                        type="text"
                        name="full_name"
                        id="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-full bg-white text-black border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-white"
                      >
                        Email
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-full bg-white text-black border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone_number"
                        className="block text-sm font-medium text-white"
                      >
                        Số điện thoại
                      </label>
                      <input
                        type="text"
                        name="phone_number"
                        id="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-full bg-white text-black border-gray-300 focus:border-blue-500 focus:ring-blue-500 sm:text-sm px-4 py-2"
                      />
                    </div>
                  </div>
                ) : (
                  <p className="mt-4 text-sm text-white">
                    Không có thông tin người dùng.
                  </p>
                )}

                <div className="mt-6 flex space-x-4">
                  <button
                    type="button"
                    className={`w-full inline-flex justify-center rounded-full border border-transparent px-4 py-2 text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      hasChanges
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                    onClick={handleUpdate}
                    disabled={!hasChanges}
                  >
                    Cập nhật
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}