import React, { useState, useEffect } from 'react';
import { Search, Globe, User, Bookmark, Shield, Menu, X, ChevronRight, Newspaper, Mail, FileText, LayoutGrid, LogIn, KeyRound, UserPlus } from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';

interface HeaderProps {
  currentCategory: string;
  language: Language;
  onToggleLanguage: (lang: Language) => void;
  onSelectCategory: (cat: string) => void;
  onOpenSearch: () => void;
  onOpenContact: () => void;
  onOpenShortcodes: () => void;
  onOpenPostTypes: () => void;
  onOpenAdmin?: () => void;
  onOpenReaderAccount?: () => void;
  onOpenRegister?: () => void;
  adminUser?: { name: string; role: string } | null;
  readerUser?: { name: string; email: string; bookmarksCount: number } | null;
  logoUrl?: string;
  isMobileMenuOpen?: boolean;
  onToggleMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentCategory,
  language,
  onToggleLanguage,
  onSelectCategory,
  onOpenSearch,
  onOpenContact,
  onOpenShortcodes,
  onOpenPostTypes,
  onOpenAdmin,
  onOpenReaderAccount,
  onOpenRegister,
  adminUser,
  readerUser,
  logoUrl = '/assets/aistudio/Logo_W2.jpg_741157ec.jpeg',
  isMobileMenuOpen: externalIsMobileMenuOpen,
  onToggleMobileMenu,
}) => {
  const [internalMenuOpen, setInternalMenuOpen] = useState(false);
  const isMenuOpen = externalIsMobileMenuOpen !== undefined ? externalIsMobileMenuOpen : internalMenuOpen;
  
  const toggleMenu = () => {
    if (onToggleMobileMenu) {
      onToggleMobileMenu();
    } else {
      setInternalMenuOpen((prev) => !prev);
    }
  };

  const closeMenu = () => {
    if (onToggleMobileMenu && externalIsMobileMenuOpen) {
      onToggleMobileMenu();
    } else {
      setInternalMenuOpen(false);
    }
  };

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMenuOpen) {
        closeMenu();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isMenuOpen]);

  const t = TRANSLATIONS[language];

  // Live formatted current date based on selected language
  const todayFormatted = new Intl.DateTimeFormat(
    language === 'si' ? 'si-LK' : 'en-US',
    {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }
  ).format(new Date());

  const navItems = [
    { label: t.navHome, category: 'ALL' },
    { label: t.navCultural, category: 'CULTURAL' },
    { label: t.navInspirational, category: 'INSPIRATIONAL' },
    { label: t.navPolitics, category: 'POLITICS' },
    { label: t.navTechnology, category: 'TECHNOLOGY' },
    { label: t.navSports, category: 'SPORTS' },
    { label: t.navFashion, category: 'FASHION' },
    { label: t.navFood, category: 'FOOD' },
    { label: t.navShortcodes, action: onOpenShortcodes },
    { label: t.navPostTypes, action: onOpenPostTypes },
    { label: t.navContacts, action: onOpenContact },
  ];

  return (
    <header className="w-full bg-[#faf6ee] select-none border-b border-[#e2d4be]">
      {/* Top Utility Bar with responsive layout */}
      <div className="w-full bg-[#f4ebdc] border-b border-[#e5d8c3]">
        <div className="max-w-[1180px] mx-auto px-3 sm:px-6 h-9 flex items-center justify-between text-[11px] text-black font-sans font-medium">
          {/* Current Date & Live Tag */}
          <div className="flex items-center gap-1.5 sm:gap-2 truncate">
            <span className="bg-[#facc15] text-black font-black text-[9px] tracking-wider px-1.5 sm:px-2 py-0.5 rounded-xs shadow-2xs uppercase shrink-0 border border-[#eab308]">
              {t.dailyEdition}
            </span>
            <span className="text-black tracking-tight font-semibold flex items-center gap-1.5 truncate text-[10px] sm:text-[11px]">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse shrink-0" title="Live update" />
              <span className="truncate">{todayFormatted}</span>
            </span>
          </div>

          {/* Right utility items: Quick Links + Language Switcher + Reader Account */}
          <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
            {/* Desktop Top Quick Links */}
            <nav className="hidden md:flex items-center space-x-2 text-[11px] tracking-wider text-black font-semibold uppercase">
              <button
                onClick={() => onSelectCategory('ALL')}
                className="hover:underline transition-colors cursor-pointer text-black"
              >
                {t.navHome}
              </button>
              <span className="text-black/30">|</span>
              <button
                onClick={() => onSelectCategory('POLITICS')}
                className="hover:underline transition-colors cursor-pointer text-black"
              >
                {t.navPolitics}
              </button>
              <span className="text-black/30">|</span>
              <button
                onClick={() => onSelectCategory('OPINION')}
                className="hover:underline transition-colors cursor-pointer text-black"
              >
                {t.navOpinion}
              </button>
              <span className="text-black/30">|</span>
              <button
                onClick={onOpenContact}
                className="hover:underline transition-colors cursor-pointer text-black"
              >
                {t.navContacts}
              </button>
            </nav>

            {/* One Log In Button to log in to backend and reader + Sign In / Register Button to register reader */}
            {!readerUser && !adminUser && onOpenReaderAccount && (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={onOpenReaderAccount}
                  className="flex items-center gap-1.5 bg-[#facc15] hover:bg-[#ffd700] text-black font-sans font-black text-[11px] uppercase tracking-wider px-3 py-1 rounded-xs shadow-xs transition-all cursor-pointer border border-[#eab308] min-h-[28px] active:scale-95"
                  title={language === 'si' ? 'පාඨක ගිණුමට හෝ පද්ධති Backend එකට ඇතුල් වන්න (Log In)' : 'Log in to Reader Account or System Backend'}
                >
                  <LogIn className="w-3.5 h-3.5 text-black" />
                  <span>{language === 'si' ? 'ඇතුල් වන්න' : 'Log In'}</span>
                </button>

                <button
                  type="button"
                  onClick={onOpenRegister || onOpenReaderAccount}
                  className="flex items-center gap-1.5 bg-[#faf6ee] hover:bg-[#ebdcc7] text-black font-sans font-bold text-[10.5px] uppercase tracking-wider px-2.5 py-1 rounded-xs border border-[#dfcead] transition-all cursor-pointer min-h-[28px] active:scale-95"
                  title={language === 'si' ? 'නව පාඨකයෙකු ලෙස ලියාපදිංචි වන්න (Register Reader)' : 'Sign In to Register Reader Account'}
                >
                  <UserPlus className="w-3.5 h-3.5 text-black" />
                  <span className="hidden xs:inline">{language === 'si' ? 'පාඨක ලියාපදිංචිය' : 'Register Reader'}</span>
                  <span className="xs:hidden">{language === 'si' ? 'ලියාපදිංචිය' : 'Register'}</span>
                </button>
              </div>
            )}

            {/* Logged in as Reader */}
            {readerUser && onOpenReaderAccount && (
              <button
                type="button"
                onClick={onOpenReaderAccount}
                className="flex items-center gap-1.5 bg-[#faf6ee] hover:bg-[#ebdcc7] text-black font-sans font-bold text-[10.5px] uppercase tracking-wider px-2.5 py-1 rounded-xs border border-[#dfcead] transition-colors cursor-pointer min-h-[28px]"
                title="Reader Account & Saved Stories"
              >
                <User className="w-3.5 h-3.5 text-black" />
                <span className="hidden sm:inline">{readerUser.name.split(' ')[0]}</span>
                {readerUser.bookmarksCount > 0 && (
                  <span className="bg-[#facc15] text-black px-1.5 py-0.2 rounded-2xs text-[9px] font-black border border-[#eab308]">
                    {readerUser.bookmarksCount} {language === 'si' ? 'සුරැකි' : 'Saved'}
                  </span>
                )}
              </button>
            )}

            {/* Logged in as Editorial Staff */}
            {adminUser && onOpenAdmin && (
              <button
                type="button"
                onClick={onOpenAdmin}
                className="hidden sm:flex items-center gap-1.5 bg-[#1b1712] hover:bg-black text-[#facc15] font-sans font-bold text-[10.5px] uppercase tracking-wider px-2.5 py-1 rounded-xs shadow-xs transition-colors cursor-pointer border border-[#facc15]/40 min-h-[28px]"
                title="Open Newspaper Editorial Admin Panel (/admin)"
              >
                <Shield className="w-3.5 h-3.5 text-[#facc15]" />
                <span>{adminUser.name.split(' ')[0]} (CMS Desk)</span>
              </button>
            )}

            {/* Language Switcher Button Group */}
            <div className="flex items-center gap-0.5 bg-[#faf6ee] border border-[#dfcead] rounded-xs px-1 py-0.5 shadow-2xs">
              <Globe className="w-3 h-3 text-black mr-0.5 shrink-0" />
              <button
                onClick={() => onToggleLanguage('en')}
                title="Switch to English"
                className={`px-1.5 py-0.5 text-[9.5px] sm:text-[10px] font-sans font-bold uppercase transition-all rounded-2xs cursor-pointer ${
                  language === 'en'
                    ? 'bg-[#facc15] text-black shadow-2xs font-black'
                    : 'text-black/70 hover:text-black'
                }`}
              >
                EN
              </button>
              <span className="text-black/30 text-[10px]">/</span>
              <button
                onClick={() => onToggleLanguage('si')}
                title="සිංහල භාෂාවට මාරු වන්න"
                className={`px-1.5 py-0.5 text-[9.5px] sm:text-[10px] font-sans font-bold transition-all rounded-2xs cursor-pointer ${
                  language === 'si'
                    ? 'bg-[#facc15] text-black shadow-2xs font-black'
                    : 'text-black/70 hover:text-black'
                }`}
              >
                සිංහල
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Masthead Banner with mobile-optimized proportional scale */}
      <div className="py-3 sm:py-5 text-center border-b border-[#e8ddcb] bg-[#faf6ee] relative">
        <div className="max-w-[1180px] mx-auto px-4 flex flex-col items-center">
          <button
            onClick={() => onSelectCategory('ALL')}
            className="group flex flex-col items-center justify-center text-center cursor-pointer focus:outline-none transition-transform hover:scale-[1.01]"
          >
            {/* Source Brand Logo Emblem */}
            <div className="relative mb-0 flex items-center justify-center">
              <img
                src={logoUrl || '/assets/aistudio/Logo_W2.jpg_741157ec.jpeg'}
                alt="Pradeep Wijerathnasekara Educational Blog Logo"
                className="w-16 h-16 sm:w-22 sm:h-22 md:w-28 md:h-28 object-contain mix-blend-multiply drop-shadow-xs transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Brand Name */}
            <h1 className="font-masthead text-lg sm:text-2xl md:text-3xl lg:text-[38px] font-black leading-tight text-black uppercase group-hover:text-black transition-colors inline-flex items-center justify-center flex-wrap gap-x-2 sm:gap-x-4">
              <span>{t.siteTitle.split(' ')[0]}</span>
              <span>{t.siteTitle.substring(t.siteTitle.indexOf(' ') + 1)}</span>
            </h1>
          </button>
          <div className="mt-1 flex items-center justify-center gap-2">
            <div className="h-[1.5px] w-6 sm:w-16 bg-gradient-to-r from-transparent via-[#facc15] to-black" />
            <span className="text-[9.5px] sm:text-[11.5px] font-sans uppercase tracking-[0.16em] sm:tracking-[0.2em] text-black font-black">
              {t.siteSubtitle}
            </span>
            <div className="h-[1.5px] w-6 sm:w-16 bg-gradient-to-l from-transparent via-[#facc15] to-black" />
          </div>
        </div>
      </div>

      {/* Main Navigation Bar with Mobile Drawer Trigger & Smooth Horizontal Category Swiping */}
      <div className="w-full border-b border-[#dfcead] bg-[#faf6ee]/95 sticky top-0 z-20 shadow-[0_2px_8px_rgba(70,45,15,0.04)] backdrop-blur-xs">
        <div className="max-w-[1180px] mx-auto px-2 sm:px-6 flex items-center justify-between h-11 sm:h-12">
          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={toggleMenu}
            aria-label="Toggle navigation drawer"
            className="lg:hidden flex items-center gap-1.5 px-2.5 py-1.5 bg-[#f4ebdc] hover:bg-[#ebdcc7] text-black rounded-xs font-bold text-[11px] uppercase tracking-wider border border-[#dfcead] shrink-0 mr-2 min-h-[36px] cursor-pointer"
          >
            <Menu className="w-4 h-4 text-black" />
            <span className="font-extrabold">{language === 'si' ? 'මෙනුව' : 'Menu'}</span>
          </button>

          {/* Horizontally scrollable Category Nav Bar with smooth touch swiping */}
          <div className="relative flex-1 overflow-hidden flex items-center">
            <nav className="flex-1 flex items-center space-x-2 sm:space-x-5 md:space-x-7 overflow-x-auto scrollbar-none py-1 px-1 -mx-1" style={{ WebkitOverflowScrolling: 'touch' }}>
              {navItems.map((item) => {
                const isActive = item.category && item.category === currentCategory;

                return (
                  <button
                    key={item.label}
                    onClick={() => {
                      if (item.action) {
                        item.action();
                      } else if (item.category) {
                        onSelectCategory(item.category);
                      }
                    }}
                    className={`text-[12px] sm:text-[13px] font-bold tracking-[0.05em] uppercase transition-all whitespace-nowrap relative py-1 px-1 text-black shrink-0 cursor-pointer min-h-[36px] flex items-center ${
                      isActive
                        ? 'font-black after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[3px] after:bg-black'
                        : 'hover:opacity-75'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
            {/* Subtle right fade hint on mobile */}
            <div className="lg:hidden pointer-events-none absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[#faf6ee] to-transparent" />
          </div>

          {/* Search Trigger Button with comfortable 40px tap target */}
          <div className="pl-2 sm:pl-4 flex items-center shrink-0">
            <button
              onClick={onOpenSearch}
              aria-label={t.searchButton}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center text-black hover:bg-[#facc15]/30 rounded-xs transition-colors cursor-pointer border border-transparent hover:border-[#dfcead]"
              title={t.searchButton}
            >
              <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-black" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Slide-out Navigation Drawer) */}
      {isMenuOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation Menu"
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex animate-in fade-in duration-200"
          onClick={closeMenu}
        >
          <div
            className="w-[85%] max-w-[340px] bg-[#faf6ee] h-full shadow-2xl flex flex-col border-r border-[#dfcead] overflow-y-auto animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-4 bg-[#f4ebdc] border-b border-[#dfcead] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={logoUrl || '/assets/aistudio/Logo_W2.jpg_741157ec.jpeg'}
                  alt="Logo"
                  className="w-10 h-10 object-contain mix-blend-multiply drop-shadow-2xs"
                />
                <div className="flex flex-col">
                  <span className="font-masthead font-extrabold text-sm text-black uppercase leading-tight">
                    {t.siteTitle}
                  </span>
                  <span className="font-sans text-[9px] font-black tracking-widest text-black uppercase">
                    {t.siteSubtitle}
                  </span>
                </div>
              </div>

              <button
                onClick={closeMenu}
                aria-label="Close menu"
                className="w-9 h-9 flex items-center justify-center rounded-xs text-black hover:bg-[#e2d4be] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-black" />
              </button>
            </div>

            {/* Quick Search in Drawer */}
            <div className="p-3 bg-[#faf6ee] border-b border-[#dfcead]">
              <button
                onClick={() => {
                  closeMenu();
                  onOpenSearch();
                }}
                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-[#f4ebdc] hover:bg-[#ebdcc7] text-black border border-[#dfcead] rounded-xs text-xs font-sans transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2 text-black/70 font-medium">
                  <Search className="w-3.5 h-3.5 text-black" />
                  <span>{t.searchPlaceholder}</span>
                </span>
                <span className="text-[10px] uppercase font-bold text-black bg-[#facc15] px-1.5 py-0.5 rounded-2xs border border-[#eab308]">
                  GO
                </span>
              </button>
            </div>

            {/* Drawer Categories */}
            <div className="flex-1 py-3 overflow-y-auto">
              <div className="px-4 py-1.5 text-[10px] font-sans font-black uppercase tracking-widest text-black/60">
                {language === 'si' ? 'ප්‍රවර්ග සහ විශේෂාංග' : 'Sections & Categories'}
              </div>

              <div className="mt-1 space-y-0.5 px-2">
                {navItems.map((item) => {
                  const isActive = item.category && item.category === currentCategory;

                  return (
                    <button
                      key={item.label}
                      onClick={() => {
                        closeMenu();
                        if (item.action) {
                          item.action();
                        } else if (item.category) {
                          onSelectCategory(item.category);
                        }
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xs text-xs font-bold uppercase tracking-wider text-black transition-colors cursor-pointer min-h-[42px] ${
                        isActive
                          ? 'bg-[#fef08a] border-l-4 border-black text-black font-black'
                          : 'hover:bg-[#f4ebdc]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-black' : 'bg-[#eab308]'}`} />
                        <span>{item.label}</span>
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 text-black/40" />
                    </button>
                  );
                })}
              </div>

              {/* Quick Services Section */}
              <div className="mt-4 pt-3 border-t border-[#dfcead] px-2">
                <div className="px-2 py-1 text-[10px] font-sans font-black uppercase tracking-widest text-black/60">
                  {language === 'si' ? 'සේවා සහ සම්බන්ධතා' : 'Services & Tools'}
                </div>

                {onOpenReaderAccount && (
                  <button
                    onClick={() => {
                      closeMenu();
                      onOpenReaderAccount();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xs text-xs font-bold text-black hover:bg-[#f4ebdc] transition-colors cursor-pointer min-h-[40px]"
                  >
                    <span className="flex items-center gap-2">
                      <Bookmark className="w-3.5 h-3.5 text-black" />
                      <span>{language === 'si' ? 'සුරැකි ලිපි සහ ගිණුම' : 'Saved Stories & Account'}</span>
                    </span>
                    {readerUser && readerUser.bookmarksCount > 0 && (
                      <span className="bg-[#facc15] text-black px-1.5 py-0.5 rounded-2xs text-[10px] font-black border border-[#eab308]">
                        {readerUser.bookmarksCount}
                      </span>
                    )}
                  </button>
                )}

                <button
                  onClick={() => {
                    closeMenu();
                    onOpenContact();
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-xs text-xs font-bold text-black hover:bg-[#f4ebdc] transition-colors cursor-pointer min-h-[40px]"
                >
                  <span className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-black" />
                    <span>{t.navContacts}</span>
                  </span>
                </button>

                {/* Mobile Drawer Auth Actions */}
                {!readerUser && !adminUser && (
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        closeMenu();
                        if (onOpenReaderAccount) onOpenReaderAccount();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xs text-xs font-black text-black bg-[#facc15] hover:bg-[#ffd700] transition-colors cursor-pointer border border-[#eab308] min-h-[40px]"
                    >
                      <span className="flex items-center gap-2">
                        <LogIn className="w-4 h-4 text-black" />
                        <span>{language === 'si' ? 'ඇතුල් වන්න (Reader & Backend Log In)' : 'Log In (Reader & Backend CMS)'}</span>
                      </span>
                      <span className="text-[10px] uppercase font-mono font-bold text-black">Log In →</span>
                    </button>

                    <button
                      onClick={() => {
                        closeMenu();
                        if (onOpenRegister) onOpenRegister();
                        else if (onOpenReaderAccount) onOpenReaderAccount();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2.5 rounded-xs text-xs font-bold text-black bg-[#faf6ee] hover:bg-[#ebdcc7] transition-colors cursor-pointer border border-[#dfcead] min-h-[40px]"
                    >
                      <span className="flex items-center gap-2">
                        <UserPlus className="w-4 h-4 text-black" />
                        <span>{language === 'si' ? 'පාඨක ලියාපදිංචිය (Register Reader)' : 'Register Reader (Sign Up)'}</span>
                      </span>
                      <span className="text-[10px] uppercase font-mono font-bold text-amber-900">Sign Up →</span>
                    </button>
                  </div>
                )}

                {/* Logged in as Reader */}
                {readerUser && onOpenReaderAccount && (
                  <button
                    onClick={() => {
                      closeMenu();
                      onOpenReaderAccount();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2.5 rounded-xs text-xs font-black text-black bg-[#fef08a] hover:bg-[#facc15] transition-colors cursor-pointer border border-[#eab308] min-h-[40px]"
                  >
                    <span className="flex items-center gap-2">
                      <User className="w-4 h-4 text-black" />
                      <span>{language === 'si' ? 'පාඨක ගිණුම' : 'Reader Desk'}: {readerUser.name}</span>
                    </span>
                    <span className="text-[10px] uppercase font-mono font-bold text-amber-950">
                      {readerUser.bookmarksCount} {language === 'si' ? 'සුරැකි' : 'Saved'} →
                    </span>
                  </button>
                )}

                {/* If staff is logged in, show CMS desk access button */}
                {adminUser && onOpenAdmin && (
                  <button
                    onClick={() => {
                      closeMenu();
                      onOpenAdmin();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xs text-xs font-bold bg-[#1b1712] text-[#facc15] hover:bg-black transition-colors cursor-pointer min-h-[40px]"
                  >
                    <span className="flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5 text-[#facc15]" />
                      <span>Open Editorial CMS Desk (/admin)</span>
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  </button>
                )}
              </div>
            </div>

            {/* Drawer Footer with Language Switcher */}
            <div className="p-4 bg-[#f4ebdc] border-t border-[#dfcead] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-black uppercase font-sans">
                  {language === 'si' ? 'භාෂාව' : 'Language'}
                </span>
                <div className="flex items-center gap-1 bg-[#faf6ee] border border-[#dfcead] rounded-xs p-1">
                  <button
                    onClick={() => onToggleLanguage('en')}
                    className={`px-3 py-1 text-xs font-sans font-bold uppercase rounded-2xs transition-all cursor-pointer ${
                      language === 'en'
                        ? 'bg-[#facc15] text-black font-black border border-[#eab308]'
                        : 'text-black/70 hover:text-black'
                    }`}
                  >
                    English
                  </button>
                  <button
                    onClick={() => onToggleLanguage('si')}
                    className={`px-3 py-1 text-xs font-sans font-bold rounded-2xs transition-all cursor-pointer ${
                      language === 'si'
                        ? 'bg-[#facc15] text-black font-black border border-[#eab308]'
                        : 'text-black/70 hover:text-black'
                    }`}
                  >
                    සිංහල
                  </button>
                </div>
              </div>

              <div className="text-[10px] text-black/60 font-serif text-center pt-1 border-t border-[#dfcead]">
                {t.footerRights}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
