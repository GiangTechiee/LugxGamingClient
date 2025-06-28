'use client';

import { motion } from 'framer-motion';

const LoadMoreButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <motion.button
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium transition-colors duration-200"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
    >
      Xem thêm
    </motion.button>
  );
};

export default LoadMoreButton;