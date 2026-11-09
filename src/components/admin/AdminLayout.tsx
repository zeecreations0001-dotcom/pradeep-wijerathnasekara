/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { StaffMember, StaffRole } from '../../types/admin';
import {
  LayoutDashboard,
  FileText,
  Flame,
  Layout,
  BookOpen,
  FolderTree,
  Image,
  Users,
  MessageSquare,
  Mail,
  Settings,
  Database,
  LogOut,
  ExternalLink,
  ChevronDown,
  Menu,
  X,
  Newspaper,
  Shield,
  Eye,
  Bell,
  Search,
  Copy,
  Check,
} from 'lucide-react';

interface AdminLayoutProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  currentUser: StaffMember | null;
  staffList: StaffMember[];
  onSwitchUser: (member: StaffMember) => void;
  onLogout: () => void;
  onViewPublicSite: () => void;
  pendingReviewsCount: number;
  breakingActiveCount: number;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onSelectTab,
  currentUser,
  staffList,
  onSwitchUser,
  onLogout,
  onViewPublicSite,
  pendingReviewsCount,
  breakingActiveCount,
  children,
}) => {
  const [isSidebarOpenMobile, setIsSidebarOpenMobile] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState(false);

  const role = currentUser?.role || 'reporter';

  const navItems = [
    { id: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
    {
      id: 'articles',
      label: 'News Articles',
      icon: FileText,
      badge: pendingReviewsCount > 0 ? `${pendingReviewsCount} review` : undefined,
      badgeColor: 'bg-amber-600',
    },
    {
      id: 'breaking',
      label: 'Breaking News Ticker',
      icon: Flame,
      badge: breakingActiveCount > 0 ? `${breakingActiveCount} live` : undefined,
      badgeColor: 'bg-red-600 animate-pulse',
    },
    { id: 'frontpage', label: 'Front Page Editor', icon: Layout },
    { id: 'editions', label: 'Editions & Archive', icon: BookOpen },
    { id: 'sections', label: 'Desks & Tags', icon: FolderTree },
    { id: 'media', label: 'Media Library', icon: Image },
    { id: 'staff', label: 'Staff & Roles', icon: Users },
    { id: 'comments', label: 'Comments Moderation', icon: MessageSquare },
    { id: 'newsletter', label: 'Newsletters', icon: Mail },
    { id: 'settings', label: 'Site Settings', icon: Settings },
    { id: 'system', label: 'System & Backup', icon: Database },
  ];

  const getRoleBadge = (r: StaffRole) => {
    switch (r) {
      case 'super_admin':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-800">Super Admin</span>;
      case 'editor':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-blue-100 text-blue-800">Editor</span>;
      case 'reporter':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">Reporter</span>;
      case 'contributor':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-100 text-stone-700">Contributor</span>;
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans text-stone-900 antialiased">
      {/* Top Newsroom Masthead Header */}
      <header className="bg-stone-900 text-white border-b border-stone-800 sticky top-0 z-40 px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Mobile hamburger */}
          <button
            type="button"
            onClick={() => setIsSidebarOpenMobile(!isSidebarOpenMobile)}
            className="md:hidden p-1.5 text-stone-400 hover:text-white rounded"
          >
            {isSidebarOpenMobile ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Brand Logo & CMS Badge */}
          <div className="flex items-center gap-2.5">
            <img
              src="/assets/aistudio/Logo_W2.jpg_741157ec.jpeg"
              alt="Logo"
              className="w-8 h-8 object-contain rounded-full bg-white p-0.5 shrink-0"
            />
            <div>
              <div className="font-serif font-bold text-sm sm:text-base tracking-wide text-white flex items-center gap-2">
                Pradeep Wijerathnasekara <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 bg-stone-800 text-amber-400 rounded">CMS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-3">
          {/* Quick Copy Admin URL Button */}
          <button
            type="button"
            onClick={() => {
              const url = typeof window !== 'undefined' ? `${window.location.origin}/admin` : '/admin';
              navigator.clipboard?.writeText(url);
              setCopiedUrl(true);
              setTimeout(() => setCopiedUrl(false), 2000);
            }}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white rounded text-xs font-mono border border-stone-700 transition cursor-pointer"
            title="Copy dedicated newsroom URL (/admin)"
          >
            {copiedUrl ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-sans font-semibold">Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#facc15]" />
                <span className="font-semibold text-stone-300">URL: /admin</span>
              </>
            )}
          </button>

          {/* Jump to Public Site View */}
          <button
            type="button"
            onClick={onViewPublicSite}
            className="px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 hover:text-white rounded text-xs font-semibold flex items-center gap-1.5 border border-stone-700 transition cursor-pointer"
            title="View public reader website"
          >
            <Eye className="w-3.5 h-3.5 text-red-500" />
            <span className="hidden sm:inline">View Public Site</span>
          </button>

          {/* User Profile & Role Switcher */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className="flex items-center gap-2 p-1.5 rounded hover:bg-stone-800 text-xs text-left transition"
            >
              <img
                src={currentUser?.headshot || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100'}
                alt=""
                className="w-7 h-7 rounded-full object-cover border border-stone-700"
              />
              <div className="hidden md:block">
                <div className="font-semibold text-white leading-tight">{currentUser?.name}</div>
                <div className="text-[10px] text-stone-400 font-mono capitalize">{currentUser?.role?.replace('_', ' ')}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
            </button>

            {/* Dropdown Menu */}
            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-2xl border border-stone-200 py-2 z-50 text-stone-800 text-xs">
                <div className="px-3 py-2 border-b border-stone-100">
                  <div className="font-serif font-bold text-sm text-stone-900">{currentUser?.name}</div>
                  <div className="text-[11px] text-stone-500 font-mono">{currentUser?.email}</div>
                  <div className="mt-1">{getRoleBadge(currentUser?.role || 'reporter')}</div>
                </div>

                <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  Switch Active Role (Demo)
                </div>

                {staffList.map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => {
                      onSwitchUser(st);
                      setIsUserMenuOpen(false);
                    }}
                    className={`w-full px-3 py-1.5 text-left flex items-center justify-between hover:bg-stone-50 transition ${
                      st.id === currentUser?.id ? 'bg-red-50 font-bold text-red-700' : 'text-stone-700'
                    }`}
                  >
                    <span>{st.name}</span>
                    <span className="text-[10px] uppercase font-mono text-stone-400">
                      {st.role.replace('_', ' ')}
                    </span>
                  </button>
                ))}

                <div className="border-t border-stone-100 mt-1 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      onLogout();
                    }}
                    className="w-full px-3 py-2 text-left text-red-600 hover:bg-red-50 flex items-center gap-1.5 font-semibold"
                  >
                    <LogOut className="w-3.5 h-3.5" /> Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar */}
      <div className="flex-1 flex overflow-hidden">
        {/* Newsroom Sidebar */}
        <aside
          className={`fixed md:static inset-y-0 left-0 z-30 w-64 bg-stone-900 text-stone-300 border-r border-stone-800 flex flex-col justify-between transform transition-transform duration-200 ease-in-out md:translate-x-0 ${
            isSidebarOpenMobile ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          {/* Nav Items */}
          <div className="p-3 space-y-1 overflow-y-auto">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-stone-500">
              Editorial Workspaces
            </div>

            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onSelectTab(item.id);
                    setIsSidebarOpenMobile(false);
                  }}
                  className={`w-full px-3 py-2 rounded-md text-xs font-medium flex items-center justify-between transition ${
                    isActive
                      ? 'bg-red-600 text-white font-bold shadow-xs'
                      : 'text-stone-300 hover:bg-stone-800 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-stone-400'}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.2 rounded text-[10px] text-white font-mono uppercase font-bold ${
                        item.badgeColor || 'bg-stone-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Sidebar Footer with system stats */}
          <div className="p-3 border-t border-stone-800 text-[11px] text-stone-500 space-y-1">
            <div className="flex justify-between items-center text-stone-400">
              <span>Newsroom Edition:</span>
              <span className="font-mono text-stone-300">Daily Final</span>
            </div>
            <div className="flex justify-between items-center text-stone-400">
              <span>Sync Status:</span>
              <span className="text-emerald-500 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live
              </span>
            </div>
          </div>
        </aside>

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-stone-100 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};
