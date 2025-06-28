import { Genre, Platform } from '@/types/game';

// Danh sách thể loại với ID và tên
export const GENRES: Genre[] = [
  { genre_id: 1, name: 'Hành động', description: null },
  { genre_id: 2, name: 'Chiến thuật', description: null },
  { genre_id: 3, name: 'Nhập vai', description: null },
  { genre_id: 4, name: 'Bắn súng', description: null },
  { genre_id: 5, name: 'Phiêu lưu', description: null },
  { genre_id: 6, name: 'Giải đố', description: null },
  { genre_id: 7, name: 'Đua xe', description: null },
  { genre_id: 8, name: 'Thể thao', description: null },
];

// Danh sách nền tảng
export const PLATFORMS: Platform[] = [
  { platform_id: 1, name: 'PC', description: null },
  { platform_id: 2, name: 'PlayStation', description: null },
  { platform_id: 3, name: 'Xbox', description: null },
  { platform_id: 4, name: 'Nintendo Switch', description: null },
  { platform_id: 5, name: 'iOS', description: null },
  { platform_id: 6, name: 'Android', description: null },
];