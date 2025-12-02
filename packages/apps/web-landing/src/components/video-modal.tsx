'use client';

import { X } from 'lucide-react';

interface VideoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function VideoModal({ isOpen, onClose }: VideoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div className="bg-card relative aspect-video w-full max-w-3xl overflow-hidden rounded-2xl">
        <button
          onClick={onClose}
          className="hover:bg-card absolute top-4 right-4 z-10 rounded-lg p-2 transition-colors"
          aria-label="Close video"
        >
          <X size={24} />
        </button>
        <iframe
          className="h-full w-full"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
          title="ContractSpec 3-minute demo"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
