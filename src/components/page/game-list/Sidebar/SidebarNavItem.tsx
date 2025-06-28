'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ComponentType } from 'react';

interface SidebarNavItemProps {
  name: string;
  href: string;
  icon: ComponentType<{ className?: string }>;
  isActive: boolean;
}

const SidebarNavItem = ({ name, href, icon: IconComponent, isActive }: SidebarNavItemProps) => {
  return (
    <Link href={href} className="flex items-center space-x-3">
      <motion.div
        className={`w-10 h-10 border rounded-full flex items-center justify-center group ${
          isActive 
            ? 'bg-white border-white' 
            : 'bg-black border-gray-600'
        }`}
        whileHover={{ backgroundColor: '#ffffff', scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.2 }}
      >
        <IconComponent 
          className={`w-5 h-5 transition-colors duration-200 ${
            isActive 
              ? 'text-black' 
              : 'text-white group-hover:text-black'
          }`}
        />
      </motion.div>
      <span className="text-white font-medium">{name}</span>
    </Link>
  );
};

export default SidebarNavItem;