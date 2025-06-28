'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
}

export const MobileMenuButton = ({ isOpen, onClick }: MobileMenuButtonProps) => {
  return (
    <motion.button
      className="md:hidden fixed bottom-4 right-4 w-12 h-12 bg-black text-white border border-gray-600 rounded-full flex items-center justify-center z-50"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      layout
    >
      <motion.svg 
        className="w-6 h-6" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
        animate={{ rotate: isOpen ? 180 : 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <motion.path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          animate={{
            d: isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"
          }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
      </motion.svg>
    </motion.button>
  );
};

interface MobileOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MobileOverlay = ({ isOpen, onClose }: MobileOverlayProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          onClick={onClose}
        />
      )}
    </AnimatePresence>
  );
};

// Component mới cho hiệu ứng morphing nâng cao
interface MobileSidebarMorphingProps {
  isOpen: boolean;
  children: React.ReactNode;
  onScroll?: (e: React.UIEvent<HTMLDivElement>) => void;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
}

export const MobileSidebarMorphing = ({ isOpen, children, onScroll, scrollRef }: MobileSidebarMorphingProps) => {
  // Tính toán vị trí nút (bottom: 1rem, right: 1rem)
  const buttonPosition = {
    x: typeof window !== 'undefined' ? window.innerWidth - 64 - 16 : 300, // width - button width - right margin
    y: typeof window !== 'undefined' ? window.innerHeight - 80 - 48 - 16 : 600, // height - top offset - button height - bottom margin
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Background morphing shape */}
          <motion.div
            className="md:hidden fixed z-35"
            initial={{
              x: buttonPosition.x + 24, // center of button
              y: buttonPosition.y + 24, // center of button
              width: 0,
              height: 0,
              borderRadius: "50%",
            }}
            animate={{
              x: 0,
              y: 80, // top-20
              width: 256, // w-64
              height: `calc(100vh - 80px)`,
              borderRadius: "0%",
            }}
            exit={{
              x: buttonPosition.x + 24,
              y: buttonPosition.y + 24,
              width: 0,
              height: 0,
              borderRadius: "50%",
            }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 35,
              mass: 1,
            }}
            style={{
              backgroundColor: '#000000',
              transformOrigin: 'center',
            }}
          />
          
          {/* Content sidebar */}
          <motion.aside
            className="md:hidden fixed top-20 bottom-0 left-0 w-64 text-white flex-col overflow-hidden z-40"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ 
              delay: 0.2, 
              duration: 0.3,
              ease: "easeOut"
            }}
          >
            <motion.div
              ref={scrollRef}
              className="h-full overflow-y-auto scrollbar-hide"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              transition={{ 
                delay: 0.3, 
                duration: 0.4,
                ease: "easeOut"
              }}
              onScroll={onScroll}
            >
              {children}
            </motion.div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};