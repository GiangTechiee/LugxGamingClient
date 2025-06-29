'use client';

import { useEffect, useRef } from 'react';
import QuickNavigation from '../components/page/home/QuickNavigation';
import WebsiteInfo from '../components/page/home/WebsiteInfo';
import styles from '../styles/Home.module.css';
import { motion } from 'framer-motion';

export default function Home() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return;

    const handleResize = () => {
      if (!video.videoWidth || !video.videoHeight) return;

      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      const videoWidth = video.videoWidth;
      const videoHeight = video.videoHeight;
      const videoAspectRatio = videoWidth / videoHeight;
      const windowAspectRatio = windowWidth / windowHeight;

      if (windowAspectRatio > videoAspectRatio) {
        video.style.width = '100%';
        video.style.height = 'auto';
      } else {
        video.style.width = 'auto';
        video.style.height = '100%';
      }
    };

    video.addEventListener('loadedmetadata', handleResize);
    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      video.removeEventListener('loadedmetadata', handleResize);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <motion.div
      className="relative w-screen h-screen overflow-hidden max-sm:overflow-auto max-sm:min-h-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <video
        ref={videoRef}
        className={`${styles.video} object-cover w-full h-screen`}
        autoPlay
        loop
        muted
        playsInline
      >
        <source src="/videos/pyke.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <motion.div
        className="absolute top-1/4 left-0 right-0 flex flex-col sm:flex-row sm:justify-between items-center sm:items-start pt-20 sm:px-6 lg:px-8 max-w-7xl mx-auto z-20 max-sm:absolute max-sm:top-4 max-sm:z-30"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <QuickNavigation />
        <WebsiteInfo />
      </motion.div>
    </motion.div>
  );
}