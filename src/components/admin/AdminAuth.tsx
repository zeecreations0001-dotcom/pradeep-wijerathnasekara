/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StaffMember, StaffRole } from '../../types/admin';
import { NewsroomStore } from '../../services/adminStore';
import { imageService } from '../../services/imageService';
import {
  Shield,
  Lock,
  Mail,
  ArrowRight,
  UserCheck,
  KeyRound,
  UserPlus,
  Copy,
  Check,
  Eye,
  EyeOff,
  Upload,
  Globe,
  Compass,
  FileText,
  Bookmark,
  Sparkles,
} from 'lucide-react';

interface AdminAuthProps {
  onLogin: (email: string, password?: string, role?: StaffRole) => { success: boolean; message?: string; user?: StaffMember } | boolean;
  onClose?: () => void;
  staffList: StaffMember[];
  isStandalonePage?: boolean;
}

export const AdminAuth: React.FC<AdminAuthProps> = ({
  onLogin,
  onClose,
  staffList,
  isStandalonePage = false,
}) => {
  // Tab state: 'login' | 'register_staff' | 'register_reader'
  const [activeTab, setActiveTab] = useState<'login' | 'register_staff' | 'register_reader'>('login');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('admin@herald.org');
  const [loginPassword, setLoginPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Register Staff form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<StaffRole>('reporter');
  const [regSection, setRegSection] = useState('politics');
  const [regBio, setRegBio] = useState('');
  const [regHeadshot, setRegHeadshot] = useState(
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'
  );
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Register Reader form state
  const [readerName, setReaderName] = useState('');
  const [readerEmail, setReaderEmail] = useState('');
  const [readerPassword, setReaderPassword] = useState('');

  // URL Copy state
  const [copiedUrl, setCopiedUrl] = useState(false);

  const adminUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/admin`
    : '/admin';

  const handleCopyUrl = () => {
    try {
      navigator.clipboard?.writeText(adminUrl);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const res = onLogin(loginEmail, loginPassword);
    if (typeof res === 'object') {
      if (!res.success) {
        setErrorMessage(res.message || 'Invalid email or password.');
      }
    } else if (!res) {
      setErrorMessage('Invalid credentials or incorrect password. Please try again.');
    }
  };

  const handleQuickRoleLogin = (role: StaffRole) => {
    const matched = staffList.find((s) => s.role === role);
    if (matched) {
      const pass = matched.password || (matched.role === 'super_admin' ? 'admin123' : matched.role === 'editor' ? 'editor123' : 'reporter123');
      setLoginEmail(matched.email);
      setLoginPassword(pass);
      onLogin(matched.email, pass, role);
    }
  };

  const handleRegisterStaffSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!regName.trim() || !regEmail.trim()) {
      setErrorMessage('Please provide both your full name and staff email.');
      return;
    }
    if (regPassword.length > 0 && regPassword.length < 4) {
      setErrorMessage('Password must be at least 4 characters.');
      return;
    }

    const res = NewsroomStore.registerStaff({
      name: regName.trim(),
      email: regEmail.trim(),
      password: regPassword || 'herald2025',
      role: regRole,
      sections: [regSection],
      bio: regBio.trim(),
      headshot: regHeadshot,
    });

    if (!res.success) {
      setErrorMessage(res.message || 'Failed to create staff account.');
      return;
    }

    setSuccessMessage(`Account created successfully! Welcome to the newsroom desk, ${regName}.`);
    // Immediately log in with new user
    setTimeout(() => {
      onLogin(regEmail.trim(), regRole);
    }, 400);
  };

  const handleRegisterReaderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!readerName.trim() || !readerEmail.trim()) {
      setErrorMessage('Please provide both your name and email address.');
      return;
    }

    const res = NewsroomStore.registerReader({
      name: readerName.trim(),
      email: readerEmail.trim(),
      password: readerPassword || 'reader2025',
    });

    if (!res.success) {
      setErrorMessage(res.message || 'Failed to create reader account.');
      return;
    }

    setSuccessMessage(`Reader account registered! Signed in as ${readerName}. Returning to newspaper...`);
    setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 1200);
  };

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingPhoto(true);
    try {
      const res = await imageService.uploadImage(file, 'staff_avatar');
      setRegHeadshot(res.url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const containerClasses = isStandalonePage
    ? 'min-h-screen w-full bg-[#1c1815] flex flex-col justify-between p-4 sm:p-8'
    : 'fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/85 backdrop-blur-xs overflow-y-auto';

  return (
    <div className={containerClasses}>
      <div className="relative w-full max-w-xl mx-auto my-auto bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden text-stone-900">
        
        {/* Newspaper Masthead Accent Header */}
        <div className="bg-[#1b1712] text-white p-5 sm:p-6 border-b border-stone-800 relative">
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 text-stone-400 hover:text-white text-xs sm:text-sm font-sans flex items-center gap-1 bg-stone-800/80 hover:bg-stone-700 px-2.5 py-1 rounded transition"
              title="Return to Public Newspaper"
            >
              <span>← Back to Paper</span>
            </button>
          )}

          <div className="flex items-center gap-3 mb-2">
            <img
              src="/assets/aistudio/Logo_W2.jpg_741157ec.jpeg"
              alt="Logo"
              className="w-11 h-11 object-contain rounded-full bg-white p-0.5 shrink-0"
            />
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#facc15] font-bold">
                Editorial Control Operations
              </span>
              <h2 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-white leading-tight">
                Pradeep Wijerathnasekara • CMS Desk
              </h2>
            </div>
          </div>
          <p className="text-xs text-stone-400 mt-1 max-w-md">
            Secured newsroom editorial gateway for educators, reviewers, and staff writers.
          </p>

          {/* Dedicated URL notification banner */}
          <div className="mt-4 pt-3 border-t border-stone-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] bg-stone-900/90 rounded px-3 py-2 border border-stone-700/60">
            <div className="flex items-center gap-2 overflow-hidden text-stone-300">
              <span className="text-stone-400 font-semibold shrink-0">Direct Admin URL:</span>
              <code className="text-[#facc15] font-mono text-[10px] sm:text-xs truncate bg-black/40 px-1.5 py-0.5 rounded">
                /admin <span className="text-stone-400 font-sans">(or #/admin)</span>
              </code>
            </div>
            <button
              type="button"
              onClick={handleCopyUrl}
              className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white rounded transition cursor-pointer self-start sm:self-auto shrink-0"
              title="Copy newsroom URL for direct bookmarking"
            >
              {copiedUrl ? (
                <>
                  <Check className="w-3 h-3 text-emerald-400" />
                  <span className="text-emerald-400">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3 h-3 text-[#facc15]" />
                  <span>Copy URL</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Navigation Tabs: Sign In / Create Staff Account / Create Reader Account */}
        <div className="flex border-b border-stone-200 bg-stone-100 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setActiveTab('login');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-3 px-3 text-center transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'login'
                ? 'bg-white text-red-700 border-b-2 border-red-600 font-bold shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            <Lock className="w-3.5 h-3.5" />
            <span>Staff Sign In</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('register_staff');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-3 px-3 text-center transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'register_staff'
                ? 'bg-white text-red-700 border-b-2 border-red-600 font-bold shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Create Staff Account</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('register_reader');
              setErrorMessage('');
              setSuccessMessage('');
            }}
            className={`flex-1 py-3 px-3 text-center transition flex items-center justify-center gap-1.5 cursor-pointer ${
              activeTab === 'register_reader'
                ? 'bg-white text-stone-900 border-b-2 border-stone-800 font-bold shadow-xs'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
            }`}
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-600" />
            <span>Reader Account</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {errorMessage && (
            <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded text-xs flex items-center gap-2">
              <span className="font-bold">Error:</span> {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB 1: STAFF LOGIN */}
          {activeTab === 'login' && (
            <div className="space-y-4">
              <form onSubmit={handleLoginSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Newsroom Staff Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="journalist@herald.org"
                      className="w-full pl-9 pr-3 py-2 text-xs font-mono border border-stone-300 rounded focus:ring-1 focus:ring-red-600 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                      Password
                    </label>
                    <span className="text-[10px] text-amber-700 font-mono font-bold">Demo: admin123 / editor123</span>
                  </div>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full pl-9 pr-10 py-2 text-xs border border-stone-300 rounded focus:ring-1 focus:ring-red-600 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold uppercase tracking-wider rounded flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
                >
                  Authenticate & Enter Desk <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              {/* Quick Role Switcher for instant testing */}
              <div className="pt-3 border-t border-stone-200">
                <span className="text-[10.5px] font-bold uppercase tracking-wider text-stone-500 block mb-2 text-center">
                  One-Click Demo Staff Role Switcher
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickRoleLogin('super_admin')}
                    className="p-2 text-left bg-stone-50 hover:bg-red-50 border border-stone-200 hover:border-red-300 rounded transition cursor-pointer"
                  >
                    <div className="text-[11px] font-bold text-red-700 uppercase">Super Admin</div>
                    <div className="text-[10px] text-stone-500 font-mono truncate">admin@herald.org</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickRoleLogin('editor')}
                    className="p-2 text-left bg-stone-50 hover:bg-blue-50 border border-stone-200 hover:border-blue-300 rounded transition cursor-pointer"
                  >
                    <div className="text-[11px] font-bold text-blue-700 uppercase">Managing Editor</div>
                    <div className="text-[10px] text-stone-500 font-mono truncate">editor@herald.org</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickRoleLogin('reporter')}
                    className="p-2 text-left bg-stone-50 hover:bg-emerald-50 border border-stone-200 hover:border-emerald-300 rounded transition cursor-pointer"
                  >
                    <div className="text-[11px] font-bold text-emerald-700 uppercase">Staff Reporter</div>
                    <div className="text-[10px] text-stone-500 font-mono truncate">reporter@herald.org</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleQuickRoleLogin('contributor')}
                    className="p-2 text-left bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded transition cursor-pointer"
                  >
                    <div className="text-[11px] font-bold text-stone-700 uppercase">Contributor</div>
                    <div className="text-[10px] text-stone-500 font-mono truncate">contributor@herald.org</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CREATE STAFF / CONTRIBUTOR ACCOUNT */}
          {activeTab === 'register_staff' && (
            <form onSubmit={handleRegisterStaffSubmit} className="space-y-3.5">
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded text-[11px] text-amber-900">
                Create a new newsroom editorial account with chosen reporting privileges.
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="e.g. Liam Sterling"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:ring-1 focus:ring-red-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Staff Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="e.g. liam@herald.org"
                    className="w-full px-3 py-2 text-xs font-mono border border-stone-300 rounded focus:ring-1 focus:ring-red-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Password *
                  </label>
                  <input
                    type="password"
                    required
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create a password"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:ring-1 focus:ring-red-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Editorial Role *
                  </label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as StaffRole)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:ring-1 focus:ring-red-600 focus:outline-none bg-white font-medium"
                  >
                    <option value="reporter">Staff Reporter (Full writing & live blogs)</option>
                    <option value="editor">Editor (Publish, approve, homepage management)</option>
                    <option value="contributor">Contributor (Draft articles for review)</option>
                    <option value="super_admin">Super Admin (Complete system governance)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Primary Desk / Section
                  </label>
                  <select
                    value={regSection}
                    onChange={(e) => setRegSection(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:ring-1 focus:ring-red-600 focus:outline-none bg-white font-medium capitalize"
                  >
                    <option value="politics">Politics Desk</option>
                    <option value="world">World & Foreign Affairs</option>
                    <option value="business">Business & Economics</option>
                    <option value="tech">Technology & Science</option>
                    <option value="culture">Culture & Arts</option>
                    <option value="opinion">Editorial & Opinion</option>
                    <option value="sports">Sports</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Journalist Avatar Photo
                  </label>
                  <div className="flex items-center gap-2">
                    <img
                      src={regHeadshot}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover border border-stone-300 shrink-0"
                    />
                    <label className="flex-1 py-1.5 px-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded text-[11px] font-semibold text-stone-700 flex items-center justify-center gap-1 cursor-pointer transition">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingPhoto ? 'Uploading...' : 'Upload Device Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleUploadPhoto}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Journalist Bio & Reporting Focus
                </label>
                <textarea
                  rows={2}
                  value={regBio}
                  onChange={(e) => setRegBio(e.target.value)}
                  placeholder="Specializes in investigative reports, investigative policy..."
                  className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded focus:ring-1 focus:ring-red-600 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold uppercase tracking-wider rounded flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
              >
                <UserCheck className="w-4 h-4" />
                <span>Create Staff Account & Enter Desk</span>
              </button>
            </form>
          )}

          {/* TAB 3: CREATE READER ACCOUNT */}
          {activeTab === 'register_reader' && (
            <form onSubmit={handleRegisterReaderSubmit} className="space-y-3.5">
              <div className="p-2.5 bg-blue-50 border border-blue-200 rounded text-[11px] text-blue-900">
                Join The Daily Herald as a registered reader to bookmark investigative stories, save reading lists, and leave verified comments.
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Your Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={readerName}
                  onChange={(e) => setReaderName(e.target.value)}
                  placeholder="e.g. Maya Jin"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:ring-1 focus:ring-stone-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={readerEmail}
                  onChange={(e) => setReaderEmail(e.target.value)}
                  placeholder="reader@example.com"
                  className="w-full px-3 py-2 text-xs font-mono border border-stone-300 rounded focus:ring-1 focus:ring-stone-800 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={readerPassword}
                  onChange={(e) => setReaderPassword(e.target.value)}
                  placeholder="Create reader password"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:ring-1 focus:ring-stone-800 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-stone-900 hover:bg-black text-[#facc15] text-xs font-semibold uppercase tracking-wider rounded flex items-center justify-center gap-2 shadow-sm transition cursor-pointer"
              >
                <Bookmark className="w-4 h-4" />
                <span>Create Reader Account</span>
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-stone-100 border-t border-stone-200 flex items-center justify-between text-[11px] text-stone-500">
          <span>Pradeep Wijerathnasekara • Educational Blog Newsroom</span>
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="text-stone-700 hover:text-black font-semibold hover:underline"
            >
              Public Broadsheet Edition →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
