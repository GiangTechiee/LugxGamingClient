import { HomeIcon, StarIcon, FireIcon, SparklesIcon } from '@heroicons/react/24/outline';
import { SiPlaystation, SiApple, SiAndroid } from 'react-icons/si';
import { BsNintendoSwitch } from 'react-icons/bs';
import { AiFillAppstore } from 'react-icons/ai';
import {
  FaBolt,
  FaShieldAlt,
  FaUsers,
  FaFire,
  FaMapMarkedAlt,
  FaPuzzlePiece,
  FaCar,
  FaTrophy,
  FaXbox,
} from 'react-icons/fa';
import { ComponentType } from 'react';

// Interface cho liên kết và nhóm
interface LinkItem {
  name: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  isGroup?: never;
}

interface GroupItem {
  name: string;
  isGroup: true;
  href?: never;
  icon?: never;
}

type NavigationLink = LinkItem | GroupItem;

// Hàm gán icon theo tên
const getIcon = (name: string) => {
  const normalizedName = name.toLowerCase();
  // Nền tảng
  if (normalizedName === 'pc') return AiFillAppstore;
  if (normalizedName === 'ps') return SiPlaystation;
  if (normalizedName === 'xbox') return FaXbox;
  if (normalizedName === 'ns') return BsNintendoSwitch;
  if (normalizedName === 'ios') return SiApple;
  if (normalizedName === 'android') return SiAndroid;
  // Thể loại
  if (normalizedName === 'hành động') return FaBolt;
  if (normalizedName === 'chiến thuật') return FaShieldAlt;
  if (normalizedName === 'nhập vai') return FaUsers;
  if (normalizedName === 'bắn súng') return FaFire;
  if (normalizedName === 'phiêu lưu') return FaMapMarkedAlt;
  if (normalizedName === 'giải đố') return FaPuzzlePiece;
  if (normalizedName === 'đua xe') return FaCar;
  if (normalizedName === 'thể thao') return FaTrophy;
  // Mặc định
  return FaBolt;
};

// Danh sách navigation
export const navigationLinks: NavigationLink[] = [
  // Điều hướng chính
  { name: 'Trang chủ', href: '/', icon: HomeIcon },
  { name: 'Dành cho bạn', href: '/games/for-you', icon: SparklesIcon },
  { name: 'Mới cập nhật', href: '/games/new', icon: StarIcon },
  { name: 'Game hot', href: '/games/hot', icon: FireIcon },
  // Nền tảng
  { name: 'Nền tảng', isGroup: true },
  { name: 'PC', href: '/games/platform/pc', icon: getIcon('pc') },
  { name: 'PS', href: '/games/platform/ps', icon: getIcon('ps') },
  { name: 'Xbox', href: '/games/platform/xbox', icon: getIcon('xbox') },
  { name: 'NS', href: '/games/platform/ns', icon: getIcon('ns') },
  { name: 'iOS', href: '/games/platform/ios', icon: getIcon('ios') },
  { name: 'Android', href: '/games/platform/android', icon: getIcon('android') },
  // Thể loại
  { name: 'Thể loại', isGroup: true },
  { name: 'Hành động', href: '/games/genre/1', icon: getIcon('hành động') },
  { name: 'Chiến thuật', href: '/games/genre/2', icon: getIcon('chiến thuật') },
  { name: 'Nhập vai', href: '/games/genre/3', icon: getIcon('nhập vai') },
  { name: 'Bắn súng', href: '/games/genre/4', icon: getIcon('bắn súng') },
  { name: 'Phiêu lưu', href: '/games/genre/5', icon: getIcon('phiêu lưu') },
  { name: 'Giải đố', href: '/games/genre/6', icon: getIcon('giải đố') },
  { name: 'Đua xe', href: '/games/genre/7', icon: getIcon('đua xe') },
  { name: 'Thể thao', href: '/games/genre/8', icon: getIcon('thể thao') },
];