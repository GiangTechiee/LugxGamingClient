'use client';

import AdminSidebar from './Sidebar/AdminSidebar';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="flex flex-row min-h-screen bg-black">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main content */}
      <main className="flex-1 ml-0 md:ml-64 w-full bg-black pt-16">
        <div className="p-4">{children}</div>
      </main>
    </div>
  );
}