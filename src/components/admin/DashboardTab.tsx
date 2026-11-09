/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ActivityLog, Article, Section, StaffMember } from '../../types/admin';
import {
  FileText,
  Eye,
  CheckCircle,
  Clock,
  Flame,
  Layout,
  Plus,
  Settings,
  TrendingUp,
  AlertCircle,
  ArrowRight,
  ShieldAlert,
  Users,
} from 'lucide-react';

interface DashboardTabProps {
  articles: Article[];
  sections: Section[];
  staffList: StaffMember[];
  activityLogs: ActivityLog[];
  currentUser: StaffMember | null;
  onNavigateTab: (tab: string) => void;
  onNewArticle: () => void;
  onEditArticle: (article: Article) => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  articles,
  sections,
  staffList,
  activityLogs,
  currentUser,
  onNavigateTab,
  onNewArticle,
  onEditArticle,
}) => {
  // Key stats
  const totalArticles = articles.length;
  const publishedArticles = articles.filter((a) => a.editorialStatus === 'published');
  const drafts = articles.filter((a) => a.editorialStatus === 'draft');
  const inReviewArticles = articles.filter((a) => a.editorialStatus === 'in_review');
  const totalViews = articles.reduce((sum, a) => sum + (a.views || 0), 0);

  // Top 5 performing articles
  const topArticles = [...articles].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

  // Traffic by section
  const sectionTraffic = sections.map((sec) => {
    const secArticles = articles.filter((a) => a.sectionId === sec.id);
    const views = secArticles.reduce((s, a) => s + (a.views || 0), 0);
    return {
      section: sec,
      articleCount: secArticles.length,
      views,
    };
  }).sort((a, b) => b.views - a.views);

  // Mock 7-day view trends
  const trendDays = [
    { day: 'Mon', views: 8200 },
    { day: 'Tue', views: 11400 },
    { day: 'Wed', views: 9800 },
    { day: 'Thu', views: 14200 },
    { day: 'Fri', views: 18900 },
    { day: 'Sat', views: 16500 },
    { day: 'Sun', views: 21300 },
  ];
  const maxViews = Math.max(...trendDays.map((d) => d.views));

  return (
    <div className="space-y-6">
      {/* Welcome & Quick Action Bar */}
      <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-serif font-bold text-stone-900 tracking-tight">
            Newsroom Command Center
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Welcome back, <strong className="text-stone-800">{currentUser?.name}</strong> •{' '}
            <span className="capitalize">{currentUser?.role?.replace('_', ' ')}</span> • Today's live publication flow
          </p>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onNewArticle}
            className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" /> New Article
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('breaking')}
            className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded flex items-center gap-1.5 transition"
          >
            <Flame className="w-4 h-4 text-red-500" /> Breaking Ticker
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('frontpage')}
            className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded flex items-center gap-1.5 border border-stone-300 transition"
          >
            <Layout className="w-4 h-4" /> Front Page
          </button>
          <button
            type="button"
            onClick={() => onNavigateTab('settings')}
            className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded flex items-center gap-1.5 border border-stone-300 transition"
          >
            <Settings className="w-4 h-4" /> Settings
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Views */}
        <div className="p-4 bg-white rounded-lg border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Total Readership</span>
            <Eye className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-serif font-black text-stone-900">
            {totalViews.toLocaleString()}
          </div>
          <div className="text-[10px] text-emerald-600 flex items-center gap-1 mt-1 font-medium">
            <TrendingUp className="w-3 h-3" /> +14.2% readership vs last week
          </div>
        </div>

        {/* Published Stories */}
        <div className="p-4 bg-white rounded-lg border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Live Dispatches</span>
            <CheckCircle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-serif font-black text-stone-900">
            {publishedArticles.length}
          </div>
          <div className="text-[10px] text-stone-500 mt-1 font-mono">
            Across {sections.length} core news desks
          </div>
        </div>

        {/* Pending Review Queue */}
        <div
          onClick={() => onNavigateTab('articles')}
          className="p-4 bg-white rounded-lg border border-amber-300 shadow-xs cursor-pointer hover:bg-amber-50/50 transition"
        >
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Pending Review Desk</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-serif font-black text-amber-900">
            {inReviewArticles.length}
          </div>
          <div className="text-[10px] text-amber-700 mt-1 font-medium flex items-center justify-between">
            <span>Awaiting editorial review</span>
            <ArrowRight className="w-3 h-3" />
          </div>
        </div>

        {/* Drafts */}
        <div className="p-4 bg-white rounded-lg border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-400 mb-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Reporters' Drafts</span>
            <FileText className="w-4 h-4 text-stone-600" />
          </div>
          <div className="text-2xl font-serif font-black text-stone-900">
            {drafts.length}
          </div>
          <div className="text-[10px] text-stone-500 mt-1 font-mono">
            In progress across staff
          </div>
        </div>
      </div>

      {/* Middle Grid: Readership Trend + Traffic by Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 7-Day Trend Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white p-5 rounded-lg border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                7-Day Readership & Audience Velocity
              </h2>
              <p className="text-[11px] text-stone-500">Daily unique page views across desktop, tablet, and mobile readers</p>
            </div>
            <span className="text-xs font-mono font-bold text-red-700 bg-red-50 px-2.5 py-1 rounded border border-red-200">
              Live Feed
            </span>
          </div>

          {/* Bar Chart Visualization */}
          <div className="h-44 flex items-end justify-between gap-3 pt-6 pb-2 border-b border-stone-100">
            {trendDays.map((d, i) => {
              const heightPercent = Math.round((d.views / maxViews) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                  <span className="text-[10px] font-mono font-semibold text-stone-500 opacity-0 group-hover:opacity-100 transition">
                    {d.views.toLocaleString()}
                  </span>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className="w-full max-w-[40px] bg-stone-800 group-hover:bg-red-600 rounded-t transition-all duration-300"
                  />
                  <span className="text-[11px] font-serif font-bold text-stone-700">{d.day}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Desk Traffic Breakdown (1 col) */}
        <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-800">
            Desk Traffic Distribution
          </h2>
          <div className="space-y-2.5 pt-2">
            {sectionTraffic.slice(0, 5).map(({ section, articleCount, views }) => {
              const pct = totalViews > 0 ? Math.round((views / totalViews) * 100) : 0;
              return (
                <div key={section.id} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-serif font-bold text-stone-800 flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: section.color }} />
                      {section.name}
                    </span>
                    <span className="font-mono text-stone-600">{views.toLocaleString()} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: section.color }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Top Stories + Newsroom Audit Trail */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top 5 Performing Articles */}
        <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-800">
              Top 5 Performing Stories
            </h2>
            <button
              type="button"
              onClick={() => onNavigateTab('articles')}
              className="text-xs font-semibold text-red-700 hover:text-red-900 flex items-center gap-1"
            >
              All Articles <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="divide-y divide-stone-100">
            {topArticles.map((art, idx) => (
              <div
                key={art.id}
                onClick={() => onEditArticle(art)}
                className="py-2.5 flex items-center justify-between gap-3 cursor-pointer hover:bg-stone-50 rounded px-2 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="font-serif font-black text-lg text-stone-400 w-5 text-center">
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="text-xs font-serif font-bold text-stone-900 line-clamp-1 hover:text-red-700">
                      {art.headline}
                    </h3>
                    <p className="text-[10px] text-stone-400 font-mono">
                      By {art.reporterName} • {art.sectionId.toUpperCase()}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold text-stone-700 whitespace-nowrap">
                  {(art.views || 0).toLocaleString()} views
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Newsroom Activity Audit Log */}
        <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs space-y-3">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-800">
            Editorial Desk Activity Log
          </h2>

          <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto">
            {activityLogs.slice(0, 6).map((log) => (
              <div key={log.id} className="py-2.5 text-xs flex items-start gap-2.5">
                <span className="p-1 rounded bg-stone-100 text-stone-700 mt-0.5">
                  <Clock className="w-3.5 h-3.5" />
                </span>
                <div className="flex-1">
                  <p className="text-stone-800">
                    <strong className="font-semibold text-stone-900">{log.userName}</strong> ({log.userRole.replace('_', ' ')}){' '}
                    <span className="font-medium text-stone-600">{log.action}d</span>{' '}
                    <span className="italic font-serif text-stone-900">{log.targetTitle}</span>
                  </p>
                  {log.details && (
                    <p className="text-[11px] text-stone-500 mt-0.5">{log.details}</p>
                  )}
                  <span className="text-[10px] text-stone-400 font-mono">
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
