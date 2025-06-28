'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { adminNavigationLinks } from '../../../../../constants/Admin/adminNavigationLinks';
import SidebarNavItem from '../../game-list/Sidebar/SidebarNavItem';
import { MobileMenuButton, MobileOverlay, MobileSidebarMorphing } from '../../game-list/Sidebar/MobileMenu';

const AdminSidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const sidebarRef = useRef<HTMLElement>(null);
  const mobileSidebarRef = useRef<HTMLDivElement>(null);

  // Kích hoạt liên kết dựa trên pathname
  const isActive = (href: string) => {
    // Kích hoạt /admin/users khi vào /admin hoặc /admin/users
    if (href === '/admin/genres' && (pathname === '/admin' || pathname === '/admin/users')) {
      return true;
    }
    return pathname === href;
  };

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  // Lưu và khôi phục scroll position
  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem('admin-sidebar-scroll');
    if (savedScrollPosition && sidebarRef.current) {
      sidebarRef.current.scrollTop = parseInt(savedScrollPosition, 10);
    }
    if (savedScrollPosition && mobileSidebarRef.current) {
      mobileSidebarRef.current.scrollTop = parseInt(savedScrollPosition, 10);
    }
  }, [pathname]);

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    sessionStorage.setItem('admin-sidebar-scroll', scrollTop.toString());
  };

  const handleMobileScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const scrollTop = e.currentTarget.scrollTop;
    sessionStorage.setItem('admin-sidebar-scroll', scrollTop.toString());
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        ref={sidebarRef}
        className="hidden md:flex fixed top-20 bottom-0 left-0 w-64 bg-black text-white flex-col overflow-y-auto scrollbar-hide z-30"
        onScroll={handleScroll}
      >
        <nav className="flex-1 px-4 py-6 space-y-3">
          {adminNavigationLinks.map((link) => (
            <SidebarNavItem
              key={link.name}
              name={link.name}
              href={link.href}
              icon={link.icon}
              isActive={isActive(link.href)}
            />
          ))}
        </nav>
      </aside>

      {/* Mobile Sidebar với hiệu ứng morphing */}
      <MobileSidebarMorphing
        isOpen={isOpen}
        onScroll={handleMobileScroll}
        scrollRef={mobileSidebarRef}
      >
        <nav className="flex-1 px-4 py-6 space-y-3">
          {adminNavigationLinks.map((link) => (
            <div key={link.name} onClick={closeMenu}>
              <SidebarNavItem
                name={link.name}
                href={link.href}
                icon={link.icon}
                isActive={isActive(link.href)}
              />
            </div>
          ))}
        </nav>
      </MobileSidebarMorphing>

      <MobileMenuButton isOpen={isOpen} onClick={toggleMenu} />
      <MobileOverlay isOpen={isOpen} onClose={closeMenu} />
    </>
  );
};

export default AdminSidebar;