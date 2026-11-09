/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Article, BreakingNewsItem, SiteSettings } from '../../types/admin';
import {
  Flame,
  Plus,
  Trash2,
  Edit3,
  Clock,
  ExternalLink,
  ArrowUp,
  ArrowDown,
  Eye,
  Sliders,
  CheckCircle,
  AlertTriangle,
  Radio,
  Languages,
  Sparkles,
} from 'lucide-react';
import { HeroCustomizeModal } from './HeroCustomizeModal';
import { NewsroomStore } from '../../services/adminStore';

interface BreakingNewsTabProps {
  breakingItems: BreakingNewsItem[];
  articles: Article[];
  settings: SiteSettings;
  onSaveItem: (item: BreakingNewsItem) => void;
  onDeleteItem: (id: string) => void;
  onReorderItems: (items: BreakingNewsItem[]) => void;
  onUpdateSettings: (settings: SiteSettings) => void;
}

export const BreakingNewsTab: React.FC<BreakingNewsTabProps> = ({
  breakingItems,
  articles,
  settings,
  onSaveItem,
  onDeleteItem,
  onReorderItems,
  onUpdateSettings,
}) => {
  // Modal / Form state for Add/Edit
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<BreakingNewsItem | null>(null);
  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);
  const [currentLayout, setCurrentLayout] = useState(() => NewsroomStore.getFrontPageLayout());

  const [headline, setHeadline] = useState('');
  const [headlineSi, setHeadlineSi] = useState('');
  const [articleId, setArticleId] = useState('');
  const [expiryHours, setExpiryHours] = useState('12');
  const [priority, setPriority] = useState<'high' | 'urgent' | 'flash'>('urgent');
  const [active, setActive] = useState(true);

  // Open modal for new item
  const handleOpenNew = () => {
    setEditingItem(null);
    setHeadline('');
    setHeadlineSi('');
    setArticleId('');
    setExpiryHours('12');
    setPriority('urgent');
    setActive(true);
    setIsModalOpen(true);
  };

  // Open modal for editing
  const handleOpenEdit = (item: BreakingNewsItem) => {
    setEditingItem(item);
    setHeadline(item.headline);
    setHeadlineSi(item.headlineSi || '');
    setArticleId(item.articleId || '');
    const diffHours = Math.max(1, Math.round((new Date(item.expiresAt).getTime() - Date.now()) / (3600 * 1000)));
    setExpiryHours(diffHours.toString());
    setPriority(item.priority || 'urgent');
    setActive(item.active);
    setIsModalOpen(true);
  };

  // Save item
  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!headline.trim()) return;

    const hours = parseInt(expiryHours, 10) || 12;
    const expiresAt = new Date(Date.now() + hours * 3600 * 1000).toISOString();

    const finalItem: BreakingNewsItem = {
      id: editingItem?.id || 'bn-' + Date.now(),
      headline: headline.trim(),
      headlineSi: headlineSi.trim() || undefined,
      articleId: articleId || undefined,
      expiresAt,
      order: editingItem?.order || breakingItems.length + 1,
      active,
      priority,
    };

    onSaveItem(finalItem);
    setIsModalOpen(false);
  };

  // Move up/down order
  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...breakingItems];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIndex];
    newItems[targetIndex] = temp;
    onReorderItems(newItems);
  };

  // Ticker style change
  const handleStyleChange = (style: 'marquee' | 'static_red' | 'minimal') => {
    onUpdateSettings({
      ...settings,
      layout: {
        ...settings.layout,
        tickerStyle: style,
      },
    });
  };

  // Toggle sitewide ticker bar
  const handleToggleTickerSitewide = (enabled: boolean) => {
    onUpdateSettings({
      ...settings,
      layout: {
        ...settings.layout,
        showBreakingTicker: enabled,
      },
    });
  };

  const getPriorityStyle = (p: BreakingNewsItem['priority']) => {
    switch (p) {
      case 'flash':
        return 'bg-red-700 text-white font-extrabold animate-pulse';
      case 'urgent':
        return 'bg-red-600 text-white font-bold';
      default:
        return 'bg-amber-600 text-white font-medium';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Global Ticker Configuration Bar */}
      <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-red-600 rounded text-white">
              <Flame className="w-5 h-5 animate-pulse" />
            </span>
            <h1 className="text-xl font-serif font-bold text-stone-900 tracking-tight">
              Breaking News & Ticker Desk
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Publish real-time flash bulletins and manage the live sitewide ticker bar seen by readers.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Sitewide Ticker Toggle */}
          <div className="flex items-center gap-2 bg-stone-100 px-3 py-2 rounded border border-stone-300">
            <span className="text-xs font-semibold text-stone-800">Sitewide Ticker:</span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.layout.showBreakingTicker}
                onChange={(e) => handleToggleTickerSitewide(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>

          <button
            type="button"
            onClick={() => {
              setCurrentLayout(NewsroomStore.getFrontPageLayout());
              setIsHeroModalOpen(true);
            }}
            className="px-3.5 py-2 bg-stone-900 hover:bg-black text-[#facc15] text-xs font-bold rounded flex items-center gap-1.5 shadow-sm transition border border-stone-800 cursor-pointer"
          >
            <Sliders className="w-3.5 h-3.5 text-[#facc15]" />
            <span>Customize Hero Area</span>
          </button>

          <button
            type="button"
            onClick={handleOpenNew}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Add Breaking Item
          </button>
        </div>
      </div>

      {/* Ticker Presentation & Style Selector */}
      <div className="bg-stone-900 text-stone-100 p-4 rounded-lg shadow-sm border border-stone-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-300">
            <Sliders className="w-4 h-4 text-red-500" />
            Ticker Display Format on Front Page
          </div>
          <div className="flex items-center gap-1 bg-stone-800 p-1 rounded border border-stone-700 text-xs">
            <button
              type="button"
              onClick={() => handleStyleChange('marquee')}
              className={`px-3 py-1 rounded transition ${
                settings.layout.tickerStyle === 'marquee' ? 'bg-red-600 text-white font-bold' : 'text-stone-400 hover:text-white'
              }`}
            >
              Continuous Marquee
            </button>
            <button
              type="button"
              onClick={() => handleStyleChange('static_red')}
              className={`px-3 py-1 rounded transition ${
                settings.layout.tickerStyle === 'static_red' ? 'bg-red-600 text-white font-bold' : 'text-stone-400 hover:text-white'
              }`}
            >
              Static Red Banner
            </button>
            <button
              type="button"
              onClick={() => handleStyleChange('minimal')}
              className={`px-3 py-1 rounded transition ${
                settings.layout.tickerStyle === 'minimal' ? 'bg-red-600 text-white font-bold' : 'text-stone-400 hover:text-white'
              }`}
            >
              Minimal Newsprint
            </button>
          </div>
        </div>

        {/* Live Ticker Preview */}
        <div className="p-3 bg-stone-950 rounded border border-stone-800 overflow-hidden">
          <div className="text-[10px] uppercase tracking-wider text-stone-500 mb-1 flex items-center gap-1">
            <Eye className="w-3 h-3 text-stone-400" /> Live Sitewide Header Preview:
          </div>
          {settings.layout.showBreakingTicker ? (
            <div className="flex items-center gap-3 bg-red-700 text-white px-3 py-1.5 rounded text-xs font-medium overflow-hidden">
              <span className="font-mono uppercase font-black tracking-widest text-[10px] bg-black/30 px-2 py-0.5 rounded">
                BREAKING NEWS
              </span>
              <div className="truncate flex-1">
                {breakingItems.filter((b) => b.active)[0]?.headline || 'No active breaking news currently published.'}
              </div>
            </div>
          ) : (
            <div className="text-stone-500 text-xs italic py-1">
              [Ticker Bar is currently switched off sitewide in Site Settings]
            </div>
          )}
        </div>
      </div>

      {/* Breaking News Items Table */}
      <div className="bg-white rounded-lg border border-stone-200 shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <h2 className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Active Ticker Queue ({breakingItems.length} items)
          </h2>
          <span className="text-[11px] text-stone-500">
            Drag or use arrows to adjust sequence order
          </span>
        </div>

        <div className="divide-y divide-stone-200">
          {breakingItems.length === 0 ? (
            <div className="py-12 text-center text-stone-400 text-xs font-serif">
              No breaking news items in queue. Click "Add Breaking Item" to publish.
            </div>
          ) : (
            breakingItems.map((item, index) => {
              const isExpired = new Date(item.expiresAt).getTime() < Date.now();
              const linkedArticle = articles.find((a) => a.id === item.articleId);

              return (
                <div
                  key={item.id}
                  className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition hover:bg-stone-50 ${
                    !item.active || isExpired ? 'opacity-60 bg-stone-50/60' : ''
                  }`}
                >
                  <div className="flex items-start gap-3 flex-1">
                    {/* Order buttons */}
                    <div className="flex flex-col gap-0.5 pt-0.5">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveItem(index, 'up')}
                        className="p-1 hover:bg-stone-200 rounded text-stone-500 disabled:opacity-20"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={index === breakingItems.length - 1}
                        onClick={() => moveItem(index, 'down')}
                        className="p-1 hover:bg-stone-200 rounded text-stone-500 disabled:opacity-20"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase ${getPriorityStyle(item.priority)}`}>
                          {item.priority}
                        </span>

                        {item.active && !isExpired ? (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800">
                            Active
                          </span>
                        ) : (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-stone-200 text-stone-600">
                            {isExpired ? 'Expired' : 'Disabled'}
                          </span>
                        )}

                        <span className="text-[11px] text-stone-400 flex items-center gap-1 font-mono">
                          <Clock className="w-3 h-3" />
                          Expires: {new Date(item.expiresAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                      </div>

                      <div className="text-sm font-serif font-bold text-stone-900">
                        {item.headline}
                      </div>

                      {item.headlineSi && (
                        <div className="text-xs text-stone-500 font-serif flex items-center gap-1">
                          <Languages className="w-3 h-3 text-stone-400" />
                          සිංහල: {item.headlineSi}
                        </div>
                      )}

                      {linkedArticle && (
                        <div className="text-[11px] text-red-700 flex items-center gap-1">
                          <ExternalLink className="w-3 h-3" />
                          Linked Article: <span className="font-semibold underline">{linkedArticle.headline}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(item)}
                      className="px-3 py-1.5 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 rounded flex items-center gap-1 transition"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Delete breaking news alert?')) {
                          onDeleteItem(item.id);
                        }
                      }}
                      className="p-1.5 text-stone-400 hover:text-red-600 rounded hover:bg-red-50 transition"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal: Add / Edit Breaking News */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-xl border border-stone-300 w-full max-w-lg overflow-hidden">
            <div className="px-5 py-4 bg-red-700 text-white flex items-center justify-between">
              <div className="flex items-center gap-2 font-serif font-bold text-base">
                <Flame className="w-5 h-5" />
                {editingItem ? 'Edit Breaking News Alert' : 'New Breaking News Alert'}
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  1-Line Breaking Headline <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="e.g. Major port expansion treaty finalized in Geneva..."
                  className="w-full px-3 py-2 text-sm font-serif font-bold text-stone-900 border border-stone-300 rounded focus:ring-1 focus:ring-red-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1 flex items-center gap-1">
                  <Languages className="w-3.5 h-3.5 text-stone-500" />
                  Sinhala Translation (සිංහල සිරස්තලය)
                </label>
                <input
                  type="text"
                  value={headlineSi}
                  onChange={(e) => setHeadlineSi(e.target.value)}
                  placeholder="සිංහල සිරස්තලය..."
                  className="w-full px-3 py-2 text-xs font-serif text-stone-900 border border-stone-300 rounded focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Link to Full Story (Optional)
                </label>
                <select
                  value={articleId}
                  onChange={(e) => setArticleId(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded focus:outline-none"
                >
                  <option value="">None (Standalone 1-line flash)</option>
                  {articles.map((art) => (
                    <option key={art.id} value={art.id}>
                      [{art.sectionId.toUpperCase()}] {art.headline}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Auto-Expiry (Hours)
                  </label>
                  <select
                    value={expiryHours}
                    onChange={(e) => setExpiryHours(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded focus:outline-none"
                  >
                    <option value="2">2 Hours</option>
                    <option value="6">6 Hours</option>
                    <option value="12">12 Hours (Half Day)</option>
                    <option value="24">24 Hours (Full Day)</option>
                    <option value="48">48 Hours</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Urgency Priority
                  </label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded focus:outline-none"
                  >
                    <option value="flash">Flash (Pulsing Red)</option>
                    <option value="urgent">Urgent</option>
                    <option value="high">High Priority</option>
                  </select>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-200">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-800">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="rounded text-red-600 focus:ring-red-500"
                  />
                  Broadcast immediately on public site ticker
                </label>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded shadow-sm"
                >
                  Save & Broadcast
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Hero Customizer Modal for Breaking News Desk */}
      <HeroCustomizeModal
        isOpen={isHeroModalOpen}
        onClose={() => setIsHeroModalOpen(false)}
        layout={currentLayout}
        articles={articles}
        language="en"
        onSave={(updated) => {
          setCurrentLayout(updated);
          NewsroomStore.saveFrontPageLayout(updated);
          setIsHeroModalOpen(false);
        }}
      />
    </div>
  );
};
