'use client';

import Link from 'next/link';
import styles from '../../../styles/WebsiteInfo.module.css';

export default function WebsiteInfo() {
  return (
    <div className={`${styles.container} w-64 bg-white/20 backdrop-blur-md text-white p-6 rounded-3xl shadow-lg`}>
      <h2 className="text-2xl font-semibold mb-4">Về trang web</h2>
      <p className="text-sm">
        Chào mừng đến với trang web của chúng tôi! Đây là nơi bạn có thể khám phá các dịch vụ, sản phẩm và thông tin hữu ích. Chúng tôi cam kết mang lại trải nghiệm tuyệt vời nhất cho người dùng.
      </p>
      <Link
        href="https://github.com"
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.githubLink} block px-4 py-2 mt-5 rounded-full bg-white text-black hover:bg-blue-600 hover:text-white transition-all duration-200 text-center`}
      >
        Xem trên GitHub
      </Link>
    </div>
  );
}