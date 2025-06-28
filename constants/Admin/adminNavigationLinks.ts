import { HomeIcon } from '@heroicons/react/24/outline';
import { FaUsers, FaGamepad, FaTags, FaFileInvoiceDollar } from 'react-icons/fa';
import { BsGrid3X3GapFill } from 'react-icons/bs';
import { MdOutlineCategory } from 'react-icons/md';
import { ComponentType } from 'react';

interface LinkItem {
  name: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
}

export const adminNavigationLinks: LinkItem[] = [
  { name: 'Quản lý người dùng', href: '/admin/users', icon: FaUsers },
  { name: 'Quản lý thể loại', href: '/admin/genres', icon: MdOutlineCategory },
  { name: 'Quản lý nền tảng', href: '/admin/platforms', icon: BsGrid3X3GapFill },
  { name: 'Quản lý game', href: '/admin/games', icon: FaGamepad },
  { name: 'Mã giảm giá', href: '/admin/promotions', icon: FaTags },
  { name: 'Quản lý hóa đơn', href: '/admin/invoices', icon: FaFileInvoiceDollar },
  { name: 'Trở về trang chủ', href: '/', icon: HomeIcon },
];