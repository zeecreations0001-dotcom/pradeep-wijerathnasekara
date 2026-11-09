import React, { useState, useEffect } from 'react';
import { ChevronUp, KeyRound, Shield } from 'lucide-react';

interface FloatingControlsProps {
  onScrollToTop: () => void;
  onOpenLogin?: () => void;
  onOpenAdmin?: () => void;
  adminUser?: { name: string; role: string } | null;
}

export const FloatingControls: React.FC<FloatingControlsProps> = ({
  onScrollToTop,
  onOpenLogin,
  onOpenAdmin,
  adminUser,
}) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setVisible(true);
      } else {
        setVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed right-3 bottom-18 sm:bottom-6 z-40 flex flex-col items-end space-y-2">
      {/* If staff user is logged in -> Quick Editorial Desk launcher */}
      {adminUser && onOpenAdmin && (
        <button
          onClick={onOpenAdmin}
          aria-label="Open Editorial CMS Desk"
          title="Open Newspaper Editorial Desk"
          className="bg-[#1b1712] hover:bg-black text-[#facc15] border border-[#facc15]/40 shadow-lg px-2.5 py-1.5 rounded-xs flex items-center gap-1.5 text-[10px] font-sans font-bold uppercase tracking-wider transition-all cursor-pointer"
        >
          <Shield className="w-3.5 h-3.5 text-[#facc15]" />
          <span>Editorial Desk</span>
        </button>
      )}

      {/* If no staff is logged in -> Quick Login Button */}
      {!adminUser && onOpenLogin && (
        <button
          onClick={onOpenLogin}
          aria-label="Open Login Portal"
          title="Reader & Staff Login"
          className="bg-[#facc15] hover:bg-[#ffd700] text-black border border-[#eab308] shadow-lg px-2.5 py-1.5 rounded-xs flex items-center gap-1.5 text-[10.5px] font-sans font-black uppercase tracking-wider transition-all cursor-pointer active:scale-95"
        >
          <KeyRound className="w-3.5 h-3.5 text-black" />
          <span>Login</span>
        </button>
      )}

      {/* Back to top button */}
      <button
        onClick={onScrollToTop}
        aria-label="Scroll back to top"
        title="Back to Top"
        className={`w-8 h-8 sm:w-9 sm:h-9 bg-[#f4ebdc] hover:bg-[#facc15] text-[#5e4b34] hover:text-[#1b1712] border border-[#dfcead] hover:border-[#eab308] shadow-sm flex items-center justify-center transition-all cursor-pointer rounded-xs ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
        }`}
      >
        <ChevronUp className="w-4 h-4 font-bold" />
      </button>
    </div>
  );
};
