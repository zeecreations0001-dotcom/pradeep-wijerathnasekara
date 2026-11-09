/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { NewsroomStore } from '../services/adminStore';
import { ReaderUser, StaffMember, StaffRole } from '../types/admin';
import { Article as PublicArticle } from '../data/newspaperData';
import { mapAdminArticleToPublic } from '../services/bridgeData';
import { Language, TRANSLATIONS } from '../data/translations';
import {
  Bookmark,
  User,
  LogOut,
  Mail,
  Lock,
  ArrowRight,
  Check,
  Shield,
  Trash2,
  Eye,
  EyeOff,
  KeyRound,
  UserCheck,
  Sparkles,
  BookOpen,
  LogIn,
  UserPlus,
} from 'lucide-react';

interface ReaderAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenArticle: (article: PublicArticle) => void;
  onOpenAdmin: () => void;
  language: Language;
  initialMode?: 'reader' | 'staff';
  initialTab?: 'login' | 'register' | 'profile';
}

export const ReaderAccountModal: React.FC<ReaderAccountModalProps> = ({
  isOpen,
  onClose,
  onOpenArticle,
  onOpenAdmin,
  language,
  initialMode = 'reader',
  initialTab = 'login',
}) => {
  const [userType, setUserType] = useState<'reader' | 'staff'>(initialMode);
  const [currentReader, setCurrentReader] = useState<ReaderUser | null>(NewsroomStore.getCurrentReader());
  const [currentUser, setCurrentUser] = useState<StaffMember | null>(NewsroomStore.getCurrentUser());
  
  // Reader Tab: 'profile' | 'login' | 'register'
  const [readerTab, setReaderTab] = useState<'profile' | 'login' | 'register'>('login');
  
  // Reader form
  const [readerEmail, setReaderEmail] = useState('reader@herald.org');
  const [readerPassword, setReaderPassword] = useState('reader123');
  const [showReaderPassword, setShowReaderPassword] = useState(false);
  
  // Reader registration form
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Staff form
  const [staffEmail, setStaffEmail] = useState('admin@herald.org');
  const [staffPassword, setStaffPassword] = useState('admin123');
  const [showStaffPassword, setShowStaffPassword] = useState(false);

  // Notifications
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Bookmarks
  const [bookmarkedArticles, setBookmarkedArticles] = useState<PublicArticle[]>([]);

  const loadBookmarks = () => {
    const adminArts = NewsroomStore.getBookmarkedArticles();
    const publicArts = adminArts.map((a) => mapAdminArticleToPublic(a, language === 'si'));
    setBookmarkedArticles(publicArts);
  };

  useEffect(() => {
    const unsubscribe = NewsroomStore.subscribe(() => {
      const r = NewsroomStore.getCurrentReader();
      const s = NewsroomStore.getCurrentUser();
      setCurrentReader(r);
      setCurrentUser(s);
      if (r) {
        loadBookmarks();
      }
    });
    return unsubscribe;
  }, [language]);

  useEffect(() => {
    if (isOpen) {
      setUserType(initialMode);
      setErrorMessage('');
      setSuccessMessage('');
      const r = NewsroomStore.getCurrentReader();
      const s = NewsroomStore.getCurrentUser();
      setCurrentReader(r);
      setCurrentUser(s);

      if (initialTab === 'register') {
        setUserType('reader');
        setReaderTab('register');
      } else if (initialTab === 'login') {
        setReaderTab('login');
      } else if (r) {
        setReaderTab('profile');
        loadBookmarks();
      } else {
        setReaderTab('login');
      }
    }
  }, [isOpen, initialMode, initialTab, language]);

  if (!isOpen) return null;

  // READER AUTH HANDLERS
  const handleReaderLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!readerEmail.trim()) {
      setErrorMessage(language === 'si' ? 'කරුණාකර ඔබගේ ඊමේල් ලිපිනය ඇතුළත් කරන්න.' : 'Please enter your reader email.');
      return;
    }
    if (!readerPassword) {
      setErrorMessage(language === 'si' ? 'කරුණාකර ඔබගේ මුරපදය ඇතුළත් කරන්න.' : 'Please enter your password.');
      return;
    }

    const res = NewsroomStore.loginReader(readerEmail, readerPassword);
    if (!res.success) {
      setErrorMessage(res.message || (language === 'si' ? 'ඊමේල් ලිපිනය හෝ මුරපදය වැරදියි.' : 'Incorrect email or password.'));
      return;
    }

    setCurrentReader(res.user || null);
    setReaderTab('profile');
    setSuccessMessage(language === 'si' ? `නැවත සාදරයෙන් පිළිගනිමු, ${res.user?.name}!` : `Welcome back, ${res.user?.name}!`);
  };

  const handleReaderRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regName.trim() || !regEmail.trim()) {
      setErrorMessage(language === 'si' ? 'නම සහ ඊමේල් ලිපිනය අත්‍යවශ්‍යයි.' : 'Name and email are required.');
      return;
    }
    if (!regPassword || regPassword.length < 4) {
      setErrorMessage(language === 'si' ? 'මුරපදය අවම වශයෙන් අකුරු 4ක් විය යුතුය.' : 'Password must be at least 4 characters long.');
      return;
    }

    const res = NewsroomStore.registerReader({
      name: regName.trim(),
      email: regEmail.trim(),
      password: regPassword.trim(),
    });

    if (!res.success) {
      setErrorMessage(res.message || (language === 'si' ? 'ලියාපදිංචිය අසාර්ථක විය.' : 'Registration failed.'));
      return;
    }

    setCurrentReader(res.user || null);
    setReaderTab('profile');
    setSuccessMessage(language === 'si' ? `ගිණුම සාර්ථකව සාදන ලදී! සාදරයෙන් පිළිගනිමු, ${regName}.` : `Reader account created successfully! Welcome, ${regName}.`);
  };

  const handleReaderLogout = () => {
    NewsroomStore.logoutReader();
    setCurrentReader(null);
    setReaderTab('login');
    setSuccessMessage(language === 'si' ? 'සාර්ථකව ඉවත් විය.' : 'You have been logged out of your reader account.');
  };

  const handleRemoveBookmark = (artId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    NewsroomStore.toggleBookmark(artId);
    loadBookmarks();
  };

  // STAFF AUTH HANDLERS
  const handleStaffLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!staffEmail.trim()) {
      setErrorMessage('Please enter your staff email.');
      return;
    }
    if (!staffPassword) {
      setErrorMessage('Please enter your staff password.');
      return;
    }

    const res = NewsroomStore.login(staffEmail, staffPassword);
    if (!res.success) {
      setErrorMessage(res.message || 'Invalid staff credentials or incorrect password.');
      return;
    }

    setCurrentUser(res.user || null);
    setSuccessMessage(`Authenticated as ${res.user?.name} (${res.user?.role.toUpperCase()})`);
  };

  const handleStaffLogout = () => {
    NewsroomStore.logout();
    setCurrentUser(null);
    setSuccessMessage('Logged out of editorial staff desk.');
  };

  // Quick Demo Auto-fills
  const fillDemoReader = (demoEmail: string, demoPass: string) => {
    setReaderEmail(demoEmail);
    setReaderPassword(demoPass);
    setErrorMessage('');
  };

  const fillDemoStaff = (demoEmail: string, demoPass: string) => {
    setStaffEmail(demoEmail);
    setStaffPassword(demoPass);
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-[#120d08]/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#faf6ee] rounded-xs shadow-2xl border-2 border-[#332b20] overflow-hidden text-black flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-[#1b1712] text-white px-5 py-4 border-b-2 border-[#facc15] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="p-1.5 bg-[#facc15] text-black rounded-xs font-bold shadow-xs">
              {userType === 'reader' ? <User className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
            </span>
            <div>
              <span className="text-[10px] uppercase font-mono text-[#facc15] font-black tracking-widest">
                Pradeep Wijerathnasekara • Education Blog
              </span>
              <h2 className="text-base sm:text-lg font-serif font-black text-white">
                {userType === 'reader'
                  ? currentReader
                    ? `${language === 'si' ? 'පාඨක ගිණුම' : 'Reader Account'}: ${currentReader.name}`
                    : readerTab === 'register'
                    ? (language === 'si' ? 'පාඨක ලියාපදිංචිය (Register Reader)' : 'Register Reader Account')
                    : (language === 'si' ? 'පාඨක ඇතුල්වීම (Reader Log In)' : 'Reader Log In')
                  : currentUser
                  ? `Web System Backend: ${currentUser.name}`
                  : (language === 'si' ? 'වෙබ් පද්ධති Backend CMS (Log In)' : 'Web System Backend (Log In)')}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-stone-400 hover:text-white hover:bg-stone-800 text-xs px-2.5 py-1.5 rounded-xs transition-colors cursor-pointer border border-stone-700"
            title="Close"
          >
            ✕ {language === 'si' ? 'වසන්න' : 'Close'}
          </button>
        </div>

        {/* Primary Role Switcher: Reader Log In / Register vs Web System Backend */}
        <div className="flex border-b border-[#dfcead] bg-[#f4ebdc] text-xs font-sans font-bold">
          <button
            type="button"
            onClick={() => {
              setUserType('reader');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-2.5 text-center transition flex items-center justify-center gap-1.5 cursor-pointer ${
              userType === 'reader'
                ? 'bg-[#faf6ee] text-black border-b-2 border-[#facc15] font-black shadow-xs'
                : 'text-black/70 hover:text-black hover:bg-[#ebdcc7]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#d97706]" />
            <span>{language === 'si' ? '📖 පාඨක පිවිසුම (Reader Log In & Register)' : '📖 Reader Log In & Register'}</span>
            {currentReader && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-1" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setUserType('staff');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-2.5 text-center transition flex items-center justify-center gap-1.5 cursor-pointer ${
              userType === 'staff'
                ? 'bg-[#faf6ee] text-black border-b-2 border-[#facc15] font-black shadow-xs'
                : 'text-black/70 hover:text-black hover:bg-[#ebdcc7]'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-[#b45309]" />
            <span>{language === 'si' ? '🛡️ වෙබ් පද්ධති Backend CMS (Log In)' : '🛡️ Web System Backend (Log In)'}</span>
            {currentUser && (
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-1" />
            )}
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {/* Error Message Alert */}
          {errorMessage && (
            <div className="p-3 bg-red-100/90 text-red-900 border-l-4 border-red-600 rounded-xs text-xs font-sans font-medium flex items-center gap-2 animate-in fade-in">
              <span className="font-bold text-red-700">Notice:</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Message Alert */}
          {successMessage && (
            <div className="p-3 bg-emerald-100/90 text-emerald-950 border-l-4 border-emerald-600 rounded-xs text-xs font-sans font-medium flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* ============================================================== */}
          {/* TAB 1: READER DESK                                              */}
          {/* ============================================================== */}
          {userType === 'reader' && (
            <>
              {/* If reader is logged in -> show Profile & Saved Bookmarks */}
              {currentReader ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3.5 p-3.5 bg-[#f4ebdc] rounded-xs border border-[#dfcead]">
                    <img
                      src={currentReader.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#facc15] shadow-xs shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-serif font-black text-black text-base truncate">
                          {currentReader.name}
                        </h3>
                        <span className="px-2 py-0.5 bg-[#facc15] text-black rounded-2xs font-bold text-[9px] uppercase font-mono tracking-wider border border-[#eab308]">
                          Active Reader
                        </span>
                      </div>
                      <div className="text-xs text-black/70 font-mono truncate">{currentReader.email}</div>
                      <p className="text-[11px] text-black/80 font-sans mt-0.5 truncate">
                        {currentReader.bio || 'Educational blog daily reader.'}
                      </p>
                    </div>
                  </div>

                  {/* Saved Stories List */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-xs font-bold uppercase tracking-wider font-sans text-black flex items-center gap-1.5">
                        <Bookmark className="w-4 h-4 text-[#d97706]" />
                        <span>{language === 'si' ? 'සුරැකි ලිපි' : 'My Saved Articles'} ({bookmarkedArticles.length})</span>
                      </h4>
                      <span className="text-[10px] text-black/60 font-sans">
                        {language === 'si' ? 'කියවීමට ලිපිය ඔබන්න' : 'Click article to read'}
                      </span>
                    </div>

                    {bookmarkedArticles.length > 0 ? (
                      <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                        {bookmarkedArticles.map((art) => (
                          <div
                            key={art.id}
                            onClick={() => {
                              onOpenArticle(art);
                              onClose();
                            }}
                            className="p-2.5 bg-[#fbf8f2] hover:bg-[#fff9e6] border border-[#dfcead] rounded-xs flex items-center justify-between gap-3 cursor-pointer transition group"
                          >
                            <div className="flex-1 truncate">
                              <span className="text-[9.5px] uppercase font-mono text-[#b45309] font-black mr-2">
                                {art.category}
                              </span>
                              <span className="text-xs font-serif font-bold text-black group-hover:text-[#b45309] transition">
                                {art.title}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => handleRemoveBookmark(art.id, e)}
                              className="text-black/40 hover:text-red-700 p-1 cursor-pointer transition-colors"
                              title="Remove from saved articles"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="p-6 bg-[#f4ebdc]/50 rounded-xs border border-dashed border-[#dfcead] text-center text-xs text-black/70">
                        <Bookmark className="w-6 h-6 text-black/30 mx-auto mb-1.5" />
                        <p className="font-bold">{language === 'si' ? 'තවම සුරැකි ලිපි නොමැත.' : 'No saved articles yet.'}</p>
                        <p className="text-[11px] text-black/60 mt-0.5">
                          {language === 'si'
                            ? 'ඕනෑම ලිපියක ඇති Bookmark සලකුණ ඔබා එය සුරකින්න.'
                            : 'Click the Bookmark icon on any article to save it for reading later.'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="pt-3 border-t border-[#dfcead] flex items-center justify-between">
                    <button
                      type="button"
                      onClick={handleReaderLogout}
                      className="text-xs text-red-700 hover:text-red-900 font-bold flex items-center gap-1.5 cursor-pointer py-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{language === 'si' ? 'ගිණුමෙන් ඉවත් වන්න' : 'Log Out of Reader'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setUserType('staff');
                        setErrorMessage('');
                      }}
                      className="text-xs text-black hover:underline font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <Shield className="w-3.5 h-3.5 text-[#b45309]" />
                      <span>{language === 'si' ? 'සංස්කාරක ඇතුල්වීම →' : 'Switch to Staff Login →'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Reader Not Logged In -> Sign In / Register Tabs */
                <div className="space-y-4">
                  {/* Log In vs Register Reader sub-tabs */}
                  <div className="flex border-b border-[#dfcead] text-xs font-sans font-bold">
                    <button
                      type="button"
                      onClick={() => {
                        setReaderTab('login');
                        setErrorMessage('');
                      }}
                      className={`flex-1 py-2.5 text-center transition cursor-pointer flex items-center justify-center gap-1.5 ${
                        readerTab === 'login'
                          ? 'text-black border-b-2 border-[#facc15] font-black bg-[#faf6ee]'
                          : 'text-black/60 hover:text-black'
                      }`}
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>{language === 'si' ? 'පාඨක ඇතුල්වීම (Log In)' : 'Reader Log In'}</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setReaderTab('register');
                        setErrorMessage('');
                      }}
                      className={`flex-1 py-2.5 text-center transition cursor-pointer flex items-center justify-center gap-1.5 ${
                        readerTab === 'register'
                          ? 'text-black border-b-2 border-[#facc15] font-black bg-[#faf6ee]'
                          : 'text-black/60 hover:text-black'
                      }`}
                    >
                      <UserPlus className="w-3.5 h-3.5" />
                      <span>{language === 'si' ? 'පාඨක ලියාපදිංචිය (Register)' : 'Register Reader (Sign Up)'}</span>
                    </button>
                  </div>

                  {/* Sub-view: Reader Sign In Form */}
                  {readerTab === 'login' && (
                    <form onSubmit={handleReaderLogin} className="space-y-3.5">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider font-sans text-black mb-1">
                          {language === 'si' ? 'ඊමේල් ලිපිනය (Email)' : 'Reader Email'}
                        </label>
                        <div className="relative">
                          <Mail className="w-4 h-4 text-black/50 absolute left-3 top-2.5" />
                          <input
                            type="email"
                            required
                            value={readerEmail}
                            onChange={(e) => setReaderEmail(e.target.value)}
                            placeholder="reader@herald.org"
                            className="w-full pl-9 pr-3 py-2 text-xs font-sans border border-[#dfcead] rounded-xs bg-white text-black focus:ring-1 focus:ring-black focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="block text-xs font-bold uppercase tracking-wider font-sans text-black">
                            {language === 'si' ? 'මුරපදය (Password)' : 'Password'}
                          </label>
                          <span className="text-[10px] text-amber-800 font-mono font-bold">
                            Demo: reader123
                          </span>
                        </div>
                        <div className="relative">
                          <Lock className="w-4 h-4 text-black/50 absolute left-3 top-2.5" />
                          <input
                            type={showReaderPassword ? 'text' : 'password'}
                            required
                            value={readerPassword}
                            onChange={(e) => setReaderPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full pl-9 pr-10 py-2 text-xs font-sans border border-[#dfcead] rounded-xs bg-white text-black focus:ring-1 focus:ring-black focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowReaderPassword(!showReaderPassword)}
                            className="absolute right-2.5 top-2.5 text-black/50 hover:text-black cursor-pointer"
                            title={showReaderPassword ? 'Hide password' : 'Show password'}
                          >
                            {showReaderPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-[#facc15] hover:bg-[#ffd700] text-black text-xs font-black uppercase tracking-wider font-sans rounded-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer border border-[#eab308]"
                      >
                        <span>{language === 'si' ? 'ඇතුල් වන්න' : 'Sign In as Reader'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      {/* Quick 1-Click Demo Reader Fill */}
                      <div className="pt-2 border-t border-[#dfcead]/70">
                        <span className="text-[10.5px] uppercase font-bold text-black/60 block mb-1.5 font-sans">
                          {language === 'si' ? 'පරීක්ෂණ ගිණුම (Demo Reader):' : 'One-Click Demo Fill:'}
                        </span>
                        <button
                          type="button"
                          onClick={() => fillDemoReader('reader@herald.org', 'reader123')}
                          className="w-full text-left p-2 bg-[#f4ebdc] hover:bg-[#ebdcc7] border border-[#dfcead] rounded-xs text-xs font-sans transition flex items-center justify-between cursor-pointer"
                        >
                          <div>
                            <span className="font-bold text-black">Maya Jin (Daily Reader)</span>
                            <div className="text-[10px] text-black/70 font-mono">reader@herald.org • pw: reader123</div>
                          </div>
                          <span className="text-[10px] uppercase font-bold text-[#b45309] bg-[#facc15]/80 px-2 py-0.5 rounded-2xs border border-[#eab308]">
                            Auto-Fill
                          </span>
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Sub-view: Reader Register Form */}
                  {readerTab === 'register' && (
                    <form onSubmit={handleReaderRegister} className="space-y-3.5">
                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider font-sans text-black mb-1">
                          {language === 'si' ? 'සම්පූර්ණ නම *' : 'Full Name *'}
                        </label>
                        <input
                          type="text"
                          required
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="e.g. Maya Jin"
                          className="w-full px-3 py-2 text-xs font-sans border border-[#dfcead] rounded-xs bg-white text-black focus:ring-1 focus:ring-black focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider font-sans text-black mb-1">
                          {language === 'si' ? 'ඊමේල් ලිපිනය *' : 'Email Address *'}
                        </label>
                        <input
                          type="email"
                          required
                          value={regEmail}
                          onChange={(e) => setRegEmail(e.target.value)}
                          placeholder="your.email@example.com"
                          className="w-full px-3 py-2 text-xs font-mono border border-[#dfcead] rounded-xs bg-white text-black focus:ring-1 focus:ring-black focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider font-sans text-black mb-1">
                          {language === 'si' ? 'මුරපදය (අවම අකුරු 4) *' : 'Create Password (min 4 chars) *'}
                        </label>
                        <div className="relative">
                          <input
                            type={showRegPassword ? 'text' : 'password'}
                            required
                            minLength={4}
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            placeholder="Choose your password"
                            className="w-full pl-3 pr-10 py-2 text-xs font-sans border border-[#dfcead] rounded-xs bg-white text-black focus:ring-1 focus:ring-black focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setShowRegPassword(!showRegPassword)}
                            className="absolute right-2.5 top-2.5 text-black/50 hover:text-black cursor-pointer"
                          >
                            {showRegPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-[#facc15] hover:bg-[#ffd700] text-black text-xs font-black uppercase tracking-wider font-sans rounded-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer border border-[#eab308]"
                      >
                        <span>{language === 'si' ? 'ගිණුම සාදන්න' : 'Register & Start Reading'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </form>
                  )}
                </div>
              )}
            </>
          )}

          {/* ============================================================== */}
          {/* TAB 2: EDITORIAL STAFF DESK                                     */}
          {/* ============================================================== */}
          {userType === 'staff' && (
            <>
              {currentUser ? (
                /* Already Logged In as Staff */
                <div className="space-y-4">
                  <div className="flex items-center gap-3.5 p-3.5 bg-[#1b1712] text-white rounded-xs border border-stone-800">
                    <img
                      src={currentUser.headshot || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400'}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover border-2 border-[#facc15] shadow-xs shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-serif font-black text-white text-base truncate">
                          {currentUser.name}
                        </h3>
                        <span className="px-2 py-0.5 bg-[#facc15] text-black rounded-2xs font-bold text-[9px] uppercase font-mono tracking-wider">
                          {currentUser.role.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-xs text-[#facc15]/80 font-mono truncate">{currentUser.email}</div>
                      <p className="text-[11px] text-stone-300 font-sans mt-0.5 line-clamp-1">
                        {currentUser.bio}
                      </p>
                    </div>
                  </div>

                  <div className="p-4 bg-[#f4ebdc] border border-[#dfcead] rounded-xs space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-black uppercase font-sans">
                      <Shield className="w-4 h-4 text-[#b45309]" />
                      <span>Editorial Publishing Privileges</span>
                    </div>
                    <p className="text-xs text-black/80 font-sans">
                      You are authenticated as an active editorial newsroom member. You can publish articles, manage front-page layouts, and edit breaking news bulletins.
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onClose();
                        onOpenAdmin();
                      }}
                      className="flex-1 py-2.5 bg-[#1b1712] hover:bg-black text-[#facc15] text-xs font-black uppercase tracking-wider font-sans rounded-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer border border-[#facc15]/40"
                    >
                      <Shield className="w-4 h-4" />
                      <span>{language === 'si' ? 'වෙබ් පද්ධති Backend විවෘත කරන්න (/admin)' : 'Open Web System Backend CMS (/admin)'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleStaffLogout}
                      className="px-4 py-2.5 bg-[#faf6ee] hover:bg-red-50 text-red-700 hover:text-red-900 border border-[#dfcead] text-xs font-bold font-sans rounded-xs cursor-pointer transition-colors"
                    >
                      <LogOut className="w-4 h-4 inline mr-1" />
                      <span>{language === 'si' ? 'ඉවත් වන්න' : 'Log Out'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                /* Not Logged in as Staff -> Staff Login Form */
                <form onSubmit={handleStaffLogin} className="space-y-3.5">
                  <div className="p-3 bg-[#fef08a]/40 border border-[#eab308]/40 rounded-xs text-xs font-sans text-black">
                    <span className="font-bold">{language === 'si' ? 'වෙබ් පද්ධති Backend CMS පිවිසුම:' : 'Web System Backend CMS Access:'}</span> {language === 'si' ? 'ලිපි පළ කිරීමට, සංස්කරණයට සහ පද්ධති සැකසුම් කළමනාකරණය සඳහා ඔබගේ පරිපාලක ගිණුමෙන් ඇතුල් වන්න.' : 'Sign in with administrator or journalist credentials to access the website backend CMS, publish and edit articles, and manage editions.'}
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider font-sans text-black mb-1">
                      {language === 'si' ? 'පද්ධති ඊමේල් ලිපිනය (Backend Email)' : 'Backend Staff Email'}
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-black/50 absolute left-3 top-2.5" />
                      <input
                        type="email"
                        required
                        value={staffEmail}
                        onChange={(e) => setStaffEmail(e.target.value)}
                        placeholder="admin@herald.org"
                        className="w-full pl-9 pr-3 py-2 text-xs font-sans border border-[#dfcead] rounded-xs bg-white text-black focus:ring-1 focus:ring-black focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="block text-xs font-bold uppercase tracking-wider font-sans text-black">
                        {language === 'si' ? 'මුරපදය (Backend Password)' : 'Backend Password'}
                      </label>
                      <span className="text-[10px] text-amber-800 font-mono font-bold">
                        PW: admin123
                      </span>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-black/50 absolute left-3 top-2.5" />
                      <input
                        type={showStaffPassword ? 'text' : 'password'}
                        required
                        value={staffPassword}
                        onChange={(e) => setStaffPassword(e.target.value)}
                        placeholder="••••••••"
                        className="w-full pl-9 pr-10 py-2 text-xs font-sans border border-[#dfcead] rounded-xs bg-white text-black focus:ring-1 focus:ring-black focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowStaffPassword(!showStaffPassword)}
                        className="absolute right-2.5 top-2.5 text-black/50 hover:text-black cursor-pointer"
                        title={showStaffPassword ? 'Hide password' : 'Show password'}
                      >
                        {showStaffPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-2.5 bg-[#1b1712] hover:bg-black text-[#facc15] text-xs font-black uppercase tracking-wider font-sans rounded-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer border border-[#facc15]/40"
                  >
                    <Shield className="w-4 h-4" />
                    <span>{language === 'si' ? 'වෙබ් පද්ධති Backend වෙත ඇතුල් වන්න (Log In)' : 'Log In to Web System Backend (/admin)'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  {/* One-Click Demo Staff Quick-Fills */}
                  <div className="pt-2 border-t border-[#dfcead]/70 space-y-1.5">
                    <span className="text-[10.5px] uppercase font-bold text-black/60 block font-sans">
                      Quick Demo Staff Accounts:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => fillDemoStaff('admin@herald.org', 'admin123')}
                        className="text-left p-2 bg-[#f4ebdc] hover:bg-[#ebdcc7] border border-[#dfcead] rounded-xs text-xs font-sans transition cursor-pointer"
                      >
                        <div className="font-bold text-black text-[11px]">Eleanor Vance (Chief Editor)</div>
                        <div className="text-[10px] text-black/70 font-mono">admin@herald.org • pw: admin123</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => fillDemoStaff('editor@herald.org', 'editor123')}
                        className="text-left p-2 bg-[#f4ebdc] hover:bg-[#ebdcc7] border border-[#dfcead] rounded-xs text-xs font-sans transition cursor-pointer"
                      >
                        <div className="font-bold text-black text-[11px]">Marcus Holloway (Editor)</div>
                        <div className="text-[10px] text-black/70 font-mono">editor@herald.org • pw: editor123</div>
                      </button>
                    </div>
                  </div>
                </form>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-2.5 bg-[#f4ebdc] border-t border-[#dfcead] text-center text-[10.5px] text-black/70 font-sans flex items-center justify-between">
          <span>Pradeep Wijerathnasekara • Education Blog</span>
          <span className="font-mono text-[10px] text-black/50">SECURE LOGIN PORTAL</span>
        </div>
      </div>
    </div>
  );
};
