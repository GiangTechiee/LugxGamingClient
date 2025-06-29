'use client';

import Link from 'next/link';
import styles from '../../../styles/WebsiteInfo.module.css';
import { FaGithub } from 'react-icons/fa';

export default function WebsiteInfo() {
  return (
    <div className={`${styles.container} w-64 bg-white/20 backdrop-blur-md text-white p-6 rounded-3xl shadow-lg`}>
      <h2 className="text-2xl font-semibold mb-4">Về trang web</h2>
      <p className="text-sm">
        Đây không phải là dự án thương mại nên không có mua hàng thật. Nhưng có thể trải nghiệm mua hàng như thật 😎
      </p>
      <Link
        href="https://github.com/GiangTechiee"
        target="_blank"
        rel="noopener noreferrer"
        className={`${styles.githubLink} flex items-center justify-center gap-2 px-4 py-2 mt-5 rounded-full bg-white text-black hover:bg-blue-600 hover:text-white transition-all duration-200`}
      >
        <FaGithub className="text-lg" />
        GiangTechiee
      </Link>
    </div>
  );
}