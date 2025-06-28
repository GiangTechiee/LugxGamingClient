interface OverlayProps {
  isVisible: boolean;
}

export default function Overlay({ isVisible }: OverlayProps) {
  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 z-40"
      aria-hidden="true"
    />
  );
}