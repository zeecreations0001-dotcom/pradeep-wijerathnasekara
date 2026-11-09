import React, { useEffect } from 'react';
import { X, ExternalLink, Download, Maximize2 } from 'lucide-react';

interface ImageLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  title: string;
  caption?: string;
  onOpenArticle?: () => void;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  isOpen,
  onClose,
  imageUrl,
  title,
  caption,
  onOpenArticle,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !imageUrl) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightbox-title"
      className="fixed inset-0 z-[70] bg-black/90 backdrop-blur-sm flex flex-col justify-between p-4 sm:p-8 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Top Bar */}
      <div
        className="flex items-center justify-between text-white/80 z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center space-x-2">
          <span className="font-masthead font-bold text-xs uppercase tracking-widest text-white">
            PRADEEP WIJERATHNASEKARA
          </span>
          <span className="text-white/40">•</span>
          <span className="text-xs font-mono uppercase text-white/60">
            Archival Photography Wire
          </span>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href={imageUrl}
            target="_blank"
            rel="noopener noreferrer"
            title="Open raw image in new tab"
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
          </a>
          <button
            onClick={onClose}
            title="Close image viewer (Esc)"
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Image Stage */}
      <div
        className="flex-1 flex items-center justify-center p-2 my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative max-h-[75vh] max-w-[90vw] overflow-hidden rounded-xs border border-white/20 shadow-2xl">
          <img
            src={imageUrl}
            alt={title}
            className="max-h-[75vh] w-auto object-contain select-none"
          />
        </div>
      </div>

      {/* Bottom Caption & Controls */}
      <div
        className="max-w-2xl mx-auto text-center z-10 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <h4 id="lightbox-title" className="font-headline font-bold text-base sm:text-lg mb-1">
          {title}
        </h4>
        {caption && (
          <p className="font-serif italic text-xs text-white/70 mb-3">
            Photo: {caption}
          </p>
        )}
        {onOpenArticle && (
          <button
            onClick={() => {
              onClose();
              onOpenArticle();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-black hover:bg-neutral-200 text-xs font-bold font-sans uppercase tracking-wider transition-colors cursor-pointer"
          >
            <span>Read Associated Article</span>
            <span>→</span>
          </button>
        )}
      </div>
    </div>
  );
};
