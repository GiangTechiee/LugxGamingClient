'use client';

import { useProfileModal } from '@/hooks/useProfileModal';
import Overlay from './Overlay';

export default function OverlayWrapper() {
  const { isOpen: isModalOpen } = useProfileModal();

  return <Overlay isVisible={isModalOpen} />;
}