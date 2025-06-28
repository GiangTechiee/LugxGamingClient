export interface PageConfig {
  title: string;
  subtitle?: string;
  fetchFunction: 'getGames' | 'getLatestGames' | 'getHotGames' | 'getGamesByPlatform' | 'getGamesByGenre';
  emptyMessage?: string;
  platformName?: string;
  genreId?: number;
}

// Mapping platform slugs to names
const platformNames: Record<string, string> = {
  'pc': 'PC',
  'ps': 'PlayStation',
  'xbox': 'Xbox',
  'ns': 'Nintendo Switch',
  'ios': 'iOS',
  'android': 'Android',
};

// Mapping genre IDs to names
const genreNames: Record<string, string> = {
  '1': 'Hành động',
  '2': 'Chiến thuật',
  '3': 'Nhập vai',
  '4': 'Bắn súng',
  '5': 'Phiêu lưu',
  '6': 'Giải đố',
  '7': 'Đua xe',
  '8': 'Thể thao',
};

export const pageConfigs: Record<string, PageConfig> = {
  '/games': {
    title: 'Danh sách game',
    fetchFunction: 'getGames',
  },
  '/games/new': {
    title: 'Game mới cập nhật',
    subtitle: 'Khám phá những game mới nhất được cập nhật gần đây',
    fetchFunction: 'getLatestGames',
    emptyMessage: 'Không có game mới nào được tìm thấy'
  },
  '/games/hot': {
    title: 'Game hot',
    subtitle: 'Những game đang được quan tâm và chơi nhiều nhất',
    fetchFunction: 'getHotGames',
    emptyMessage: 'Không có game hot nào được tìm thấy'
  },
  '/games/for-you': {
    title: 'Dành cho bạn',
    subtitle: 'Game được đề xuất dựa trên sở thích của bạn',
    fetchFunction: 'getGames', // Tạm thời dùng getGames, sau có thể thay bằng getRecommendedGames
    emptyMessage: 'Không có game đề xuất nào'
  },
  // Platform configs with string slugs
  '/games/platform/pc': {
    title: `Game ${platformNames['pc']}`,
    subtitle: `Danh sách game dành cho ${platformNames['pc']}`,
    fetchFunction: 'getGamesByPlatform',
    platformName: 'pc',
    emptyMessage: `Không có game ${platformNames['pc']} nào được tìm thấy`
  },
  '/games/platform/ps': {
    title: `Game ${platformNames['ps']}`,
    subtitle: `Danh sách game dành cho ${platformNames['ps']}`,
    fetchFunction: 'getGamesByPlatform',
    platformName: 'ps',
    emptyMessage: `Không có game ${platformNames['ps']} nào được tìm thấy`
  },
  '/games/platform/xbox': {
    title: `Game ${platformNames['xbox']}`,
    subtitle: `Danh sách game dành cho ${platformNames['xbox']}`,
    fetchFunction: 'getGamesByPlatform',
    platformName: 'xbox',
    emptyMessage: `Không có game ${platformNames['xbox']} nào được tìm thấy`
  },
  '/games/platform/ns': {
    title: `Game ${platformNames['ns']}`,
    subtitle: `Danh sách game dành cho ${platformNames['ns']}`,
    fetchFunction: 'getGamesByPlatform',
    platformName: 'ns',
    emptyMessage: `Không có game ${platformNames['ns']} nào được tìm thấy`
  },
  '/games/platform/ios': {
    title: `Game ${platformNames['ios']}`,
    subtitle: `Danh sách game dành cho ${platformNames['ios']}`,
    fetchFunction: 'getGamesByPlatform',
    platformName: 'ios',
    emptyMessage: `Không có game ${platformNames['ios']} nào được tìm thấy`
  },
  '/games/platform/android': {
    title: `Game ${platformNames['android']}`,
    subtitle: `Danh sách game dành cho ${platformNames['android']}`,
    fetchFunction: 'getGamesByPlatform',
    platformName: 'android',
    emptyMessage: `Không có game ${platformNames['android']} nào được tìm thấy`
  },
  // Genre configs (giữ nguyên với ID)
  '/games/genre/1': {
    title: `Game ${genreNames['1']}`,
    subtitle: `Danh sách game thể loại ${genreNames['1']}`,
    fetchFunction: 'getGamesByGenre',
    genreId: 1,
    emptyMessage: `Không có game ${genreNames['1']} nào được tìm thấy`
  },
  '/games/genre/2': {
    title: `Game ${genreNames['2']}`,
    subtitle: `Danh sách game thể loại ${genreNames['2']}`,
    fetchFunction: 'getGamesByGenre',
    genreId: 2,
    emptyMessage: `Không có game ${genreNames['2']} nào được tìm thấy`
  },
  '/games/genre/3': {
    title: `Game ${genreNames['3']}`,
    subtitle: `Danh sách game thể loại ${genreNames['3']}`,
    fetchFunction: 'getGamesByGenre',
    genreId: 3,
    emptyMessage: `Không có game ${genreNames['3']} nào được tìm thấy`
  },
  '/games/genre/4': {
    title: `Game ${genreNames['4']}`,
    subtitle: `Danh sách game thể loại ${genreNames['4']}`,
    fetchFunction: 'getGamesByGenre',
    genreId: 4,
    emptyMessage: `Không có game ${genreNames['4']} nào được tìm thấy`
  },
  '/games/genre/5': {
    title: `Game ${genreNames['5']}`,
    subtitle: `Danh sách game thể loại ${genreNames['5']}`,
    fetchFunction: 'getGamesByGenre',
    genreId: 5,
    emptyMessage: `Không có game ${genreNames['5']} nào được tìm thấy`
  },
  '/games/genre/6': {
    title: `Game ${genreNames['6']}`,
    subtitle: `Danh sách game thể loại ${genreNames['6']}`,
    fetchFunction: 'getGamesByGenre',
    genreId: 6,
    emptyMessage: `Không có game ${genreNames['6']} nào được tìm thấy`
  },
  '/games/genre/7': {
    title: `Game ${genreNames['7']}`,
    subtitle: `Danh sách game thể loại ${genreNames['7']}`,
    fetchFunction: 'getGamesByGenre',
    genreId: 7,
    emptyMessage: `Không có game ${genreNames['7']} nào được tìm thấy`
  },
  '/games/genre/8': {
    title: `Game ${genreNames['8']}`,
    subtitle: `Danh sách game thể loại ${genreNames['8']}`,
    fetchFunction: 'getGamesByGenre',
    genreId: 8,
    emptyMessage: `Không có game ${genreNames['8']} nào được tìm thấy`
  },
};