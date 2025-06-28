'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">© 2025 Công ty của bạn. Mọi quyền được bảo lưu.</p>
          <div className="flex space-x-4 mt-4 md:mt-0">
            <Link href="/about" className="text-sm hover:text-blue-400 transition-colors">
              Giới thiệu
            </Link>
            <Link href="/contact" className="text-sm hover:text-blue-400 transition-colors">
              Liên hệ
            </Link>
            <Link href="/privacy" className="text-sm hover:text-blue-400 transition-colors">
              Chính sách bảo mật
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}