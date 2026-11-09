/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Language } from '../data/translations';

interface SiteScrollbarProps {
  language: Language;
}

export const SiteScrollbar: React.FC<SiteScrollbarProps> = ({ language }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ticking = false;

    const updateScroll = () => {
      const doc = document.documentElement;
      const totalScroll = doc.scrollHeight - window.innerHeight;
      if (totalScroll > 80) {
        setIsVisible(true);
        const current = window.scrollY;
        const progress = Math.min(100, Math.max(0, (current / totalScroll) * 100));
        setScrollProgress(progress);
      } else {
        setIsVisible(false);
      }
      ticking = false;
    };

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScroll);
        ticking = true;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', updateScroll);
    updateScroll();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', updateScroll);
    };
  }, []);

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const ratio = Math.max(0, Math.min(1, clickY / rect.height));
    const doc = document.documentElement;
    const totalScroll = doc.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: ratio * totalScroll,
      behavior: 'smooth',
    });
  };

  const handleThumbPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsDragging(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handleThumbPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging || !trackRef.current) return;
    const rect = trackRef.current.getBoundingClientRect();
    const currentY = e.clientY - rect.top;
    const ratio = Math.max(0, Math.min(1, currentY / rect.height));
    const doc = document.documentElement;
    const totalScroll = doc.scrollHeight - window.innerHeight;
    window.scrollTo({
      top: ratio * totalScroll,
      behavior: 'auto',
    });
  };

  const handleThumbPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }
  };

  if (!isVisible) return null;

  // Thumb travels from 0% to (100% - thumbHeight%)
  const thumbHeightPercent = 22;
  const maxTopPercent = 100 - thumbHeightPercent;
  const currentTopPercent = (scrollProgress / 100) * maxTopPercent;

  return (
    <>
      {/* Sitewide Top Slim Scroll Progress Line */}
      <div 
        className="fixed top-0 left-0 right-0 h-1 z-50 pointer-events-none bg-black/10 overflow-hidden"
        aria-hidden="true"
      >
        <div
          className="h-full bg-[#facc15] transition-[width] duration-75 ease-out shadow-xs"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Sitewide Dedicated Visual Scrollbar Track & Thumb (Guaranteed 100% visible on all devices) */}
      <aside
        ref={trackRef}
        onClick={handleTrackClick}
        aria-label="Website Scrollbar Track"
        title={`Website Scrollbar: ${Math.round(scrollProgress)}%`}
        className="fixed right-1 sm:right-2 top-24 bottom-28 sm:bottom-24 w-3 sm:w-3.5 z-30 bg-[#1b1712]/85 hover:bg-[#1b1712] backdrop-blur-md rounded-full border border-[#facc15]/50 shadow-2xl relative cursor-pointer touch-none select-none transition-all group"
      >
        {/* Scrollbar thumb */}
        <div
          onPointerDown={handleThumbPointerDown}
          onPointerMove={handleThumbPointerMove}
          onPointerUp={handleThumbPointerUp}
          onPointerCancel={handleThumbPointerUp}
          style={{
            top: `${currentTopPercent}%`,
            height: `${thumbHeightPercent}%`,
            minHeight: '38px',
          }}
          className={`absolute left-0.5 right-0.5 rounded-full transition-colors cursor-grab active:cursor-grabbing border border-[#1b1712] shadow-md ${
            isDragging ? 'bg-[#ffd700] ring-2 ring-[#facc15]' : 'bg-[#facc15] hover:bg-[#ffd700]'
          }`}
        >
          {/* Tactile Grip Lines */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 pointer-events-none opacity-80">
            <span className="w-1.5 h-0.5 bg-black/70 rounded-full" />
            <span className="w-1.5 h-0.5 bg-black/70 rounded-full" />
            <span className="w-1.5 h-0.5 bg-black/70 rounded-full" />
          </div>

          {/* Reading Progress Percentage Tooltip */}
          <div className="absolute right-5 top-1/2 -translate-y-1/2 bg-[#1b1712] text-[#facc15] font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-xs border border-[#facc15]/40 shadow-xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            {Math.round(scrollProgress)}%
          </div>
        </div>
      </aside>
    </>
  );
};
