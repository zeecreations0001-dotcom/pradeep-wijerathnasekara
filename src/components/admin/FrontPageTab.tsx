/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Article as AdminArticle,
  FrontPageBlock,
  FrontPageLayout,
  FrontPageAreaConfig,
  Section,
} from '../../types/admin';
import {
  Layout,
  Sparkles,
  Save,
  Eye,
  ArrowUp,
  ArrowDown,
  Layers,
  CheckCircle,
  Clock,
  Pin,
  Move,
  Grid,
  List,
  Columns,
  Image,
  Sliders,
  Plus,
  Trash2,
  Newspaper,
  TrendingUp,
  Zap,
  Star,
  Check,
  RefreshCw,
  Search,
} from 'lucide-react';
import { HeroCustomizeModal } from './HeroCustomizeModal';
import { ARTICLES } from '../../data/newspaperData';

interface FrontPageTabProps {
  layout: FrontPageLayout;
  articles: AdminArticle[];
  sections: Section[];
  onSaveLayout: (newLayout: FrontPageLayout) => void;
  onPreviewFrontPage: () => void;
}

type AreaTab =
  | 'all'
  | 'latest'
  | 'hero'
  | 'daily-feed'
  | 'popular'
  | 'featured'
  | 'blocks'
  | 'widgets';

// Unified normalized article item for easy selection in dropdowns
interface SelectableArticle {
  id: string;
  headline: string;
  sectionId: string;
  featuredImage?: string;
  reporterName?: string;
  dateline?: string;
}

export const FrontPageTab: React.FC<FrontPageTabProps> = ({
  layout,
  articles,
  sections,
  onSaveLayout,
  onPreviewFrontPage,
}) => {
  // Local working copy of the layout with initialized area configs
  const [currentLayout, setCurrentLayout] = useState<FrontPageLayout>(() => ({
    ...layout,
    latestArticlesArea: layout.latestArticlesArea || {
      mode: 'custom',
      articleIds: ['art-1', 'art-2', 'art-3', 'art-4', 'catering-summer-wedding', 'college-football-team'],
      count: 6,
      titleEn: 'Latest Articles',
      titleSi: 'නවතම ලිපි',
      visible: true,
    },
    mostPopularArea: layout.mostPopularArea || {
      mode: 'custom',
      articleIds: ['art-2', 'art-1', 'college-football-team', 'art-3', 'catering-summer-wedding'],
      count: 5,
      titleEn: 'Most Popular',
      titleSi: 'වඩාත් ජනප්‍රිය',
      visible: true,
    },
    dailyFeedArea: layout.dailyFeedArea || {
      mode: 'custom',
      articleIds: ['art-1', 'art-2', 'art-3', 'art-4', 'catering-summer-wedding', 'college-football-team', 'vintage-camera', 'fashion-week'],
      count: 8,
      titleEn: 'Daily Feed',
      titleSi: 'දවසේ තොරතුරු',
      visible: true,
    },
    featuredStoriesArea: layout.featuredStoriesArea || {
      mode: 'custom',
      articleIds: ['art-3', 'catering-summer-wedding', 'college-football-team', 'art-1', 'art-4', 'art-2'],
      count: 6,
      titleEn: 'Featured Stories',
      titleSi: 'විශේෂාංග ලිපි',
      visible: true,
    },
  }));

  const [activeAreaTab, setActiveAreaTab] = useState<AreaTab>('all');
  const [scheduledDate, setScheduledDate] = useState(layout.scheduledFor || '');
  const [isSavedFeedback, setIsSavedFeedback] = useState(false);
  const [isHeroModalOpen, setIsHeroModalOpen] = useState(false);

  // Combine Admin articles with default public articles to give admin full library access
  const allSelectableArticles: SelectableArticle[] = [
    ...articles.map((a) => ({
      id: a.id,
      headline: a.headline,
      sectionId: a.sectionId || 'news',
      featuredImage: a.featuredImage,
      reporterName: a.reporterName,
      dateline: a.dateline,
    })),
    ...ARTICLES.filter((a) => !articles.some((art) => art.id === a.id)).map((a) => ({
      id: a.id,
      headline: a.title,
      sectionId: a.category.toLowerCase(),
      featuredImage: a.imageUrl,
      reporterName: a.author,
      dateline: a.date,
    })),
  ];

  // Helper to find article by id
  const findArticle = (id: string) => allSelectableArticles.find((a) => a.id === id);

  // Update hero lead story
  const handleSelectHeroMain = (artId: string) => {
    setCurrentLayout((prev) => ({
      ...prev,
      heroMainId: artId,
    }));
  };

  // Reorder Secondary Stories (Move Up / Down)
  const moveSecondarySlot = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentLayout.heroSecondaryIds.length) return;
    const updated = [...currentLayout.heroSecondaryIds];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setCurrentLayout((prev) => ({
      ...prev,
      heroSecondaryIds: updated,
    }));
  };

  // Update secondary story slot
  const handleSelectSecondary = (index: number, artId: string) => {
    const updated = [...currentLayout.heroSecondaryIds];
    updated[index] = artId;
    setCurrentLayout((prev) => ({
      ...prev,
      heroSecondaryIds: updated,
    }));
  };

  // Add secondary slot
  const handleAddSecondarySlot = () => {
    if (currentLayout.heroSecondaryIds.length >= 6) return;
    const available = allSelectableArticles.find(
      (a) => a.id !== currentLayout.heroMainId && !currentLayout.heroSecondaryIds.includes(a.id)
    );
    if (available) {
      setCurrentLayout((prev) => ({
        ...prev,
        heroSecondaryIds: [...prev.heroSecondaryIds, available.id],
      }));
    }
  };

  // Remove secondary slot
  const handleRemoveSecondarySlot = (index: number) => {
    const updated = currentLayout.heroSecondaryIds.filter((_, i) => i !== index);
    setCurrentLayout((prev) => ({
      ...prev,
      heroSecondaryIds: updated,
    }));
  };

  // -------------------------------------------------------------
  // GENERIC AREA CONTROLLER METHODS (Move, Reorder, Add, Remove)
  // -------------------------------------------------------------
  const updateAreaConfig = (
    areaKey: 'latestArticlesArea' | 'mostPopularArea' | 'dailyFeedArea' | 'featuredStoriesArea',
    updater: (prev: FrontPageAreaConfig) => FrontPageAreaConfig
  ) => {
    setCurrentLayout((prev) => {
      const current = prev[areaKey] || {
        mode: 'custom',
        articleIds: [],
        count: 6,
        visible: true,
      };
      return {
        ...prev,
        [areaKey]: updater(current),
      };
    });
  };

  const moveAreaArticle = (
    areaKey: 'latestArticlesArea' | 'mostPopularArea' | 'dailyFeedArea' | 'featuredStoriesArea',
    index: number,
    direction: 'up' | 'down'
  ) => {
    updateAreaConfig(areaKey, (cfg) => {
      const targetIndex = direction === 'up' ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= cfg.articleIds.length) return cfg;
      const ids = [...cfg.articleIds];
      const temp = ids[index];
      ids[index] = ids[targetIndex];
      ids[targetIndex] = temp;
      return { ...cfg, articleIds: ids, mode: 'custom' };
    });
  };

  const changeAreaArticleId = (
    areaKey: 'latestArticlesArea' | 'mostPopularArea' | 'dailyFeedArea' | 'featuredStoriesArea',
    index: number,
    newId: string
  ) => {
    updateAreaConfig(areaKey, (cfg) => {
      const ids = [...cfg.articleIds];
      ids[index] = newId;
      return { ...cfg, articleIds: ids, mode: 'custom' };
    });
  };

  const removeAreaArticle = (
    areaKey: 'latestArticlesArea' | 'mostPopularArea' | 'dailyFeedArea' | 'featuredStoriesArea',
    index: number
  ) => {
    updateAreaConfig(areaKey, (cfg) => {
      const ids = cfg.articleIds.filter((_, i) => i !== index);
      return { ...cfg, articleIds: ids, mode: 'custom' };
    });
  };

  const addAreaArticleSlot = (
    areaKey: 'latestArticlesArea' | 'mostPopularArea' | 'dailyFeedArea' | 'featuredStoriesArea',
    chosenId?: string
  ) => {
    updateAreaConfig(areaKey, (cfg) => {
      const artIdToAdd =
        chosenId ||
        allSelectableArticles.find((a) => !cfg.articleIds.includes(a.id))?.id ||
        allSelectableArticles[0]?.id;
      if (!artIdToAdd) return cfg;
      return {
        ...cfg,
        articleIds: [...cfg.articleIds, artIdToAdd],
        mode: 'custom',
      };
    });
  };

  const autofillAreaWithRecent = (
    areaKey: 'latestArticlesArea' | 'mostPopularArea' | 'dailyFeedArea' | 'featuredStoriesArea',
    count: number = 6
  ) => {
    updateAreaConfig(areaKey, (cfg) => {
      const recentIds = allSelectableArticles.slice(0, count).map((a) => a.id);
      return {
        ...cfg,
        articleIds: recentIds,
        mode: 'custom',
      };
    });
  };

  // Section Blocks move & toggle
  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const blocks = [...currentLayout.blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;

    const temp = blocks[index];
    blocks[index] = blocks[targetIndex];
    blocks[targetIndex] = temp;

    const reordered = blocks.map((b, i) => ({ ...b, order: i + 1 }));
    setCurrentLayout((prev) => ({
      ...prev,
      blocks: reordered,
    }));
  };

  const toggleBlockVisibility = (blockId: string) => {
    const blocks = currentLayout.blocks.map((b) =>
      b.id === blockId ? { ...b, visible: !b.visible } : b
    );
    setCurrentLayout((prev) => ({ ...prev, blocks }));
  };

  const updateBlockStyle = (blockId: string, style: FrontPageBlock['style']) => {
    const blocks = currentLayout.blocks.map((b) =>
      b.id === blockId ? { ...b, style } : b
    );
    setCurrentLayout((prev) => ({ ...prev, blocks }));
  };

  const toggleWidget = (widgetId: string) => {
    const widgets = currentLayout.sidebarWidgets.map((w) =>
      w.id === widgetId ? { ...w, visible: !w.visible } : w
    );
    setCurrentLayout((prev) => ({ ...prev, sidebarWidgets: widgets }));
  };

  // Save & publish
  const handlePublishLayout = () => {
    const newObj: FrontPageLayout = {
      ...currentLayout,
      publishedAt: new Date().toISOString(),
      scheduledFor: scheduledDate || undefined,
    };
    onSaveLayout(newObj);
    setIsSavedFeedback(true);
    setTimeout(() => setIsSavedFeedback(false), 3500);
  };

  const heroMainArticle = findArticle(currentLayout.heroMainId);

  // -------------------------------------------------------------
  // REUSABLE AREA ARTICLES CONTROLLER CARD COMPONENT
  // -------------------------------------------------------------
  const renderAreaArranger = (
    areaKey: 'latestArticlesArea' | 'mostPopularArea' | 'dailyFeedArea' | 'featuredStoriesArea',
    meta: {
      title: string;
      locationBadge: string;
      description: string;
      icon: React.ReactNode;
      accentBg: string;
      defaultCount: number;
      slotBadgeLabel?: (idx: number) => string;
    }
  ) => {
    const cfg = currentLayout[areaKey] || {
      mode: 'custom',
      articleIds: [],
      count: meta.defaultCount,
      visible: true,
    };

    return (
      <div className="bg-white rounded-lg border border-stone-200 shadow-xs overflow-hidden">
        {/* Card Header */}
        <div className="px-5 py-3.5 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className={`p-1.5 rounded text-white ${meta.accentBg}`}>
              {meta.icon}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  {meta.title}
                </h2>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-xs bg-stone-200 text-stone-700">
                  {meta.locationBadge}
                </span>
                <span
                  className={`text-[10px] font-sans font-bold uppercase px-2 py-0.5 rounded-xs ${
                    cfg.mode === 'custom'
                      ? 'bg-amber-100 text-amber-900 border border-amber-300'
                      : 'bg-blue-100 text-blue-900 border border-blue-300'
                  }`}
                >
                  {cfg.mode === 'custom' ? `Manual Order (${cfg.articleIds.length} slots)` : 'Auto Database'}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                {meta.description}
              </p>
            </div>
          </div>

          {/* Mode Switcher & Presets */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center bg-stone-200 p-0.5 rounded text-xs font-sans font-semibold">
              <button
                type="button"
                onClick={() =>
                  updateAreaConfig(areaKey, (c) => ({ ...c, mode: 'custom' }))
                }
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  cfg.mode === 'custom'
                    ? 'bg-white text-black shadow-xs font-bold'
                    : 'text-stone-600 hover:text-black'
                }`}
              >
                Manual Arrange
              </button>
              <button
                type="button"
                onClick={() =>
                  updateAreaConfig(areaKey, (c) => ({ ...c, mode: 'auto' }))
                }
                className={`px-2.5 py-1 rounded transition-colors cursor-pointer ${
                  cfg.mode === 'auto'
                    ? 'bg-white text-black shadow-xs font-bold'
                    : 'text-stone-600 hover:text-black'
                }`}
              >
                Auto-Populate
              </button>
            </div>

            <button
              type="button"
              onClick={() => autofillAreaWithRecent(areaKey, meta.defaultCount)}
              className="px-2.5 py-1 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded flex items-center gap-1 border border-stone-300 transition-colors cursor-pointer"
              title="Populate slots with latest articles from the newsroom"
            >
              <RefreshCw className="w-3 h-3 text-stone-500" />
              <span>Fill Recent</span>
            </button>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-5 space-y-4">
          {/* Header Title Editor & Count Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-stone-50 rounded border border-stone-200 text-xs font-sans">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 block mb-1">
                Area Heading (English)
              </label>
              <input
                type="text"
                value={cfg.titleEn || ''}
                placeholder={meta.title}
                onChange={(e) =>
                  updateAreaConfig(areaKey, (c) => ({ ...c, titleEn: e.target.value }))
                }
                className="w-full px-2.5 py-1 bg-white border border-stone-300 rounded text-stone-900 focus:outline-none focus:border-stone-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 block mb-1">
                Area Heading (Sinhala සිංහල)
              </label>
              <input
                type="text"
                value={cfg.titleSi || ''}
                placeholder="නවතම ලිපි"
                onChange={(e) =>
                  updateAreaConfig(areaKey, (c) => ({ ...c, titleSi: e.target.value }))
                }
                className="w-full px-2.5 py-1 bg-white border border-stone-300 rounded text-stone-900 focus:outline-none focus:border-stone-500"
              />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-stone-600 block mb-1">
                Front-End Display Limit
              </label>
              <select
                value={cfg.count || meta.defaultCount}
                onChange={(e) =>
                  updateAreaConfig(areaKey, (c) => ({ ...c, count: Number(e.target.value) }))
                }
                className="w-full px-2.5 py-1 bg-white border border-stone-300 rounded text-stone-900 focus:outline-none"
              >
                {[3, 4, 5, 6, 8, 10, 12, 16].map((cnt) => (
                  <option key={cnt} value={cnt}>
                    Show {cnt} articles
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* List of Arranged Slots */}
          {cfg.mode === 'auto' ? (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded text-xs text-blue-900 flex items-center justify-between">
              <div>
                <strong>Auto-Populate Mode Active:</strong> Front-end dynamically displays the latest articles directly from the database ordered by publication date.
              </div>
              <button
                type="button"
                onClick={() =>
                  updateAreaConfig(areaKey, (c) => ({ ...c, mode: 'custom' }))
                }
                className="px-3 py-1 bg-blue-600 text-white font-bold rounded hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Switch to Manual Arrange
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-stone-700 uppercase tracking-wider pb-1 border-b border-stone-200">
                <span>Article Arrangement Sequence ({cfg.articleIds.length} slots)</span>
                <span className="text-[11px] text-stone-400 font-normal lowercase">
                  Use ▲ ▼ buttons to move articles up or down
                </span>
              </div>

              {cfg.articleIds.length === 0 ? (
                <div className="p-6 text-center text-xs text-stone-500 bg-stone-50 border border-dashed border-stone-300 rounded">
                  No articles currently assigned. Click "+ Add Article Slot" or "Fill Recent" to begin curating.
                </div>
              ) : (
                <div className="space-y-2">
                  {cfg.articleIds.map((artId, idx) => {
                    const art = findArticle(artId);
                    const slotLabel = meta.slotBadgeLabel
                      ? meta.slotBadgeLabel(idx)
                      : idx === 0
                      ? '#1 Top Priority'
                      : `#${idx + 1}`;

                    return (
                      <div
                        key={`${artId}-${idx}`}
                        className={`p-3 rounded border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          idx === 0
                            ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-200'
                            : 'bg-stone-50 border-stone-200 hover:border-stone-400'
                        }`}
                      >
                        {/* Slot Position & Move Buttons */}
                        <div className="flex items-center gap-3">
                          <div className="flex flex-col gap-0.5">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => moveAreaArticle(areaKey, idx, 'up')}
                              className="p-1 hover:bg-stone-200 rounded text-stone-700 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                              title="Move this article UP (higher priority)"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === cfg.articleIds.length - 1}
                              onClick={() => moveAreaArticle(areaKey, idx, 'down')}
                              className="p-1 hover:bg-stone-200 rounded text-stone-700 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed"
                              title="Move this article DOWN (lower priority)"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`text-xs font-mono font-bold px-2 py-1 rounded-xs uppercase ${
                                idx === 0
                                  ? 'bg-[#1c1712] text-[#facc15]'
                                  : 'bg-stone-200 text-stone-800'
                              }`}
                            >
                              {slotLabel}
                            </span>
                            {art?.featuredImage && (
                              <img
                                src={art.featuredImage}
                                alt=""
                                className="w-10 h-10 object-cover rounded shadow-2xs shrink-0"
                              />
                            )}
                          </div>

                          {/* Article Selection Dropdown */}
                          <div className="flex-1 min-w-[220px]">
                            <select
                              value={artId}
                              onChange={(e) =>
                                changeAreaArticleId(areaKey, idx, e.target.value)
                              }
                              className="w-full px-2.5 py-1.5 text-xs font-serif font-bold text-stone-900 bg-white border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-amber-500"
                            >
                              {allSelectableArticles.map((a) => (
                                <option key={a.id} value={a.id}>
                                  [{a.sectionId.toUpperCase()}] {a.headline}
                                </option>
                              ))}
                            </select>
                            {art && (
                              <div className="text-[11px] text-stone-500 font-sans mt-0.5 truncate max-w-md">
                                By {art.reporterName || 'Staff'} • {art.dateline || 'Recent'}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Remove Slot */}
                        <button
                          type="button"
                          onClick={() => removeAreaArticle(areaKey, idx)}
                          className="self-end sm:self-center p-1.5 text-stone-400 hover:text-red-600 rounded hover:bg-stone-200 transition-colors cursor-pointer"
                          title="Remove this slot"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add New Article Slot Button */}
              <div className="pt-2 flex items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => addAreaArticleSlot(areaKey)}
                  className="px-3.5 py-1.5 bg-[#1c1712] hover:bg-black text-[#facc15] text-xs font-bold font-sans rounded flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5 text-[#facc15]" />
                  <span>Add Article Slot to {meta.title}</span>
                </button>

                <span className="text-[11px] text-stone-500 font-sans">
                  Total Slots: <strong>{cfg.articleIds.length}</strong> (Showing up to {cfg.count || meta.defaultCount} on front end)
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Save Actions */}
      <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#1c1712] rounded text-[#facc15]">
              <Layout className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-serif font-bold text-stone-900 tracking-tight">
              Front-End Layout & Area Article Controller
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Control which articles appear in every area of the front-end site (Latest Articles, Breaking News, Daily Feed, Popular, and Featured Grid) and arrange their exact reading order.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Scheduling */}
          <div className="flex items-center gap-1.5 bg-stone-100 px-3 py-1.5 rounded border border-stone-300 text-xs">
            <Clock className="w-3.5 h-3.5 text-stone-500" />
            <input
              type="datetime-local"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="bg-transparent text-xs text-stone-800 focus:outline-none"
              title="Schedule layout change"
            />
          </div>

          <button
            type="button"
            onClick={onPreviewFrontPage}
            className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded flex items-center gap-1.5 border border-stone-300 transition cursor-pointer"
          >
            <Eye className="w-4 h-4" /> Live Front Page
          </button>

          <button
            type="button"
            onClick={handlePublishLayout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-sm transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {scheduledDate ? 'Schedule Edition Layout' : 'Publish Layout Now'}
          </button>
        </div>
      </div>

      {isSavedFeedback && (
        <div className="p-3.5 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded flex items-center gap-2 text-xs font-bold shadow-xs">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          Front page layout published successfully! All front-end article lists (Latest Articles, Daily Feed, Popular, Hero) updated in real-time.
        </div>
      )}

      {/* AREA NAVIGATION TABS */}
      <div className="bg-white p-2 rounded-lg border border-stone-200 shadow-xs flex items-center gap-1.5 overflow-x-auto scrollbar-none text-xs font-sans font-bold">
        {[
          { id: 'all', label: '⭐ All Front-End Areas', icon: <Layers className="w-3.5 h-3.5" /> },
          { id: 'latest', label: '📰 Latest Articles List', icon: <Newspaper className="w-3.5 h-3.5 text-amber-600" />, badge: 'Left Sidebar' },
          { id: 'hero', label: '⚡ Hero & Breaking News', icon: <Zap className="w-3.5 h-3.5 text-red-600" />, badge: 'Center Column' },
          { id: 'daily-feed', label: '⏱️ Daily Feed Timeline', icon: <Clock className="w-3.5 h-3.5 text-blue-600" />, badge: 'Right Column' },
          { id: 'popular', label: '📈 Most Popular #1 - #5', icon: <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />, badge: 'Rankings' },
          { id: 'featured', label: '🌟 Featured Stories Grid', icon: <Star className="w-3.5 h-3.5 text-purple-600" />, badge: '6-Card Grid' },
          { id: 'blocks', label: '📦 Section Blocks', icon: <Grid className="w-3.5 h-3.5" /> },
          { id: 'widgets', label: '⚙️ Rail Widgets', icon: <Sliders className="w-3.5 h-3.5" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveAreaTab(tab.id as AreaTab)}
            className={`px-3 py-2 rounded flex items-center gap-1.5 whitespace-nowrap transition-all cursor-pointer ${
              activeAreaTab === tab.id
                ? 'bg-[#1c1712] text-[#facc15] shadow-xs'
                : 'bg-stone-50 text-stone-700 hover:bg-stone-100 border border-stone-200'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.badge && (
              <span className={`text-[9px] px-1.5 py-0.2 rounded-xs uppercase font-mono ${
                activeAreaTab === tab.id ? 'bg-[#facc15] text-black font-extrabold' : 'bg-stone-200 text-stone-600'
              }`}>
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* -----------------------------------------------------------
       * 1. LATEST ARTICLES AREA CONTROLLER (Left Sidebar Top)
       * ----------------------------------------------------------- */}
      {(activeAreaTab === 'all' || activeAreaTab === 'latest') &&
        renderAreaArranger('latestArticlesArea', {
          title: 'Latest Articles Area Controller',
          locationBadge: 'Left Sidebar (Top)',
          description:
            'Manage and arrange the exact bullet list of articles shown in the Latest Articles area on the left rail of the homepage.',
          icon: <Newspaper className="w-4 h-4" />,
          accentBg: 'bg-amber-600',
          defaultCount: 6,
          slotBadgeLabel: (idx) => (idx === 0 ? '#1 Top Bullet' : `#${idx + 1}`),
        })}

      {/* -----------------------------------------------------------
       * 2. ABOVE-THE-FOLD HERO & BREAKING NEWS AREA
       * ----------------------------------------------------------- */}
      {(activeAreaTab === 'all' || activeAreaTab === 'hero') && (
        <div className="bg-white rounded-lg border border-stone-200 shadow-xs overflow-hidden">
          <div className="px-5 py-3.5 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span>
              <h2 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                Above The Fold — Hero Area & Breaking News
              </h2>
              <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-xs bg-stone-200 text-stone-700">
                Center Column
              </span>
              {currentLayout.heroCustomization && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-stone-500 bg-stone-200 px-2 py-0.5 rounded-xs uppercase">
                  Style: {currentLayout.heroCustomization.layoutStyle || 'classic'}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setIsHeroModalOpen(true)}
                className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-[#1f1a14] hover:bg-black text-[#facc15] rounded flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer"
              >
                <Sliders className="w-3.5 h-3.5" />
                <span>Customize Hero Area</span>
              </button>
            </div>
          </div>

          <div className="p-5 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Lead Story (2 cols) */}
            <div className="lg:col-span-2 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Primary Lead Story (Largest prominence + full width image)
                </label>
                <span className="text-[10px] text-red-600 font-bold uppercase tracking-widest">
                  Main Anchor
                </span>
              </div>

              <select
                value={currentLayout.heroMainId}
                onChange={(e) => handleSelectHeroMain(e.target.value)}
                className="w-full px-3 py-2 text-sm font-serif font-bold text-stone-900 bg-stone-50 border border-stone-300 rounded focus:bg-white focus:outline-none"
              >
                {allSelectableArticles.map((art) => (
                  <option key={art.id} value={art.id}>
                    [{art.sectionId.toUpperCase()}] {art.headline}
                  </option>
                ))}
              </select>

              {/* Visual preview of chosen main story */}
              {heroMainArticle && (
                <div className="border border-stone-200 rounded p-4 bg-stone-50 flex flex-col sm:flex-row gap-4 items-start">
                  {heroMainArticle.featuredImage && (
                    <img
                      src={heroMainArticle.featuredImage}
                      alt=""
                      className="w-full sm:w-48 h-32 object-cover rounded shadow-xs"
                    />
                  )}
                  <div className="space-y-1 flex-1">
                    <span className="text-[10px] uppercase font-bold text-red-700 tracking-wider">
                      {heroMainArticle.sectionId}
                    </span>
                    <h3 className="text-base font-serif font-bold text-stone-900 leading-snug">
                      {heroMainArticle.headline}
                    </h3>
                    <p className="text-[10px] text-stone-400 font-mono">
                      By {heroMainArticle.reporterName || 'Staff'} • {heroMainArticle.dateline || 'Recent'}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Secondary Stories Slots (1 col) with Move Up / Down */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                  Secondary Stories ({currentLayout.heroSecondaryIds.length} slots)
                </label>
                {currentLayout.heroSecondaryIds.length < 6 && (
                  <button
                    type="button"
                    onClick={handleAddSecondarySlot}
                    className="text-xs font-semibold text-red-600 hover:text-red-800 cursor-pointer"
                  >
                    + Add Slot
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                {currentLayout.heroSecondaryIds.map((secId, idx) => {
                  const art = findArticle(secId);
                  return (
                    <div
                      key={idx}
                      className="p-2.5 bg-stone-50 rounded border border-stone-200 space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[11px] font-bold text-stone-600">
                        <div className="flex items-center gap-1.5">
                          <span className="bg-stone-200 px-1.5 py-0.5 rounded text-[10px] font-mono">
                            Secondary #{idx + 1}
                          </span>
                          <div className="flex items-center gap-0.5">
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => moveSecondarySlot(idx, 'up')}
                              className="p-0.5 hover:bg-stone-200 rounded disabled:opacity-20 cursor-pointer"
                              title="Move secondary story up"
                            >
                              <ArrowUp className="w-3 h-3" />
                            </button>
                            <button
                              type="button"
                              disabled={idx === currentLayout.heroSecondaryIds.length - 1}
                              onClick={() => moveSecondarySlot(idx, 'down')}
                              className="p-0.5 hover:bg-stone-200 rounded disabled:opacity-20 cursor-pointer"
                              title="Move secondary story down"
                            >
                              <ArrowDown className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveSecondarySlot(idx)}
                          className="text-stone-400 hover:text-red-600 text-xs cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>

                      <select
                        value={secId}
                        onChange={(e) => handleSelectSecondary(idx, e.target.value)}
                        className="w-full px-2 py-1 text-xs bg-white border border-stone-300 rounded focus:outline-none"
                      >
                        {allSelectableArticles.map((a) => (
                          <option key={a.id} value={a.id}>
                            [{a.sectionId}] {a.headline}
                          </option>
                        ))}
                      </select>
                      {art && (
                        <p className="text-[11px] font-serif text-stone-800 font-semibold truncate">
                          {art.headline}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* -----------------------------------------------------------
       * 3. DAILY FEED TIMELINE AREA CONTROLLER (Right Rail Column)
       * ----------------------------------------------------------- */}
      {(activeAreaTab === 'all' || activeAreaTab === 'daily-feed') &&
        renderAreaArranger('dailyFeedArea', {
          title: 'Daily Feed Timeline Area Controller',
          locationBadge: 'Right Column Timeline',
          description:
            'Arrange the sequential list of timeline articles displayed in the Daily Feed on the right column of the homepage.',
          icon: <Clock className="w-4 h-4" />,
          accentBg: 'bg-blue-600',
          defaultCount: 8,
          slotBadgeLabel: (idx) => `#${idx + 1} Feed Item`,
        })}

      {/* -----------------------------------------------------------
       * 4. MOST POPULAR RANKINGS CONTROLLER (Left Sidebar Middle)
       * ----------------------------------------------------------- */}
      {(activeAreaTab === 'all' || activeAreaTab === 'popular') &&
        renderAreaArranger('mostPopularArea', {
          title: 'Most Popular Rankings (#1 - #5) Controller',
          locationBadge: 'Left Sidebar (Middle)',
          description:
            'Arrange which articles appear with prominent serif rank numbers (1, 2, 3, 4, 5) in the Most Popular section of the sidebar.',
          icon: <TrendingUp className="w-4 h-4" />,
          accentBg: 'bg-emerald-600',
          defaultCount: 5,
          slotBadgeLabel: (idx) => `Rank #${idx + 1}`,
        })}

      {/* -----------------------------------------------------------
       * 5. FEATURED STORIES GRID CONTROLLER (Below Fold 6-Card Grid)
       * ----------------------------------------------------------- */}
      {(activeAreaTab === 'all' || activeAreaTab === 'featured') &&
        renderAreaArranger('featuredStoriesArea', {
          title: 'Featured Stories 6-Card Grid Controller',
          locationBadge: 'Below-The-Fold Magazine Grid',
          description:
            'Arrange the 6 articles in the large bottom featured stories section. Slot #1 commands the primary top card, followed by slots #2 through #6.',
          icon: <Star className="w-4 h-4" />,
          accentBg: 'bg-purple-600',
          defaultCount: 6,
          slotBadgeLabel: (idx) =>
            idx === 0 ? 'Card #1 (Large Lead Card)' : `Card #${idx + 1}`,
        })}

      {/* -----------------------------------------------------------
       * 6. SECTION BLOCKS ORGANIZER
       * ----------------------------------------------------------- */}
      {(activeAreaTab === 'all' || activeAreaTab === 'blocks') && (
        <div className="bg-white rounded-lg border border-stone-200 shadow-xs overflow-hidden">
          <div className="px-5 py-3.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                Homepage Section Blocks & Content Flows
              </h2>
              <p className="text-[11px] text-stone-500">
                Use arrows to adjust section block display sequence; select layout style for each section.
              </p>
            </div>
          </div>

          <div className="divide-y divide-stone-200">
            {currentLayout.blocks.map((block, index) => {
              const section = sections.find((s) => s.id === block.sectionId);

              return (
                <div
                  key={block.id}
                  className={`p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition ${
                    !block.visible ? 'bg-stone-50/70 opacity-60' : 'hover:bg-stone-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex flex-col gap-0.5">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveBlock(index, 'up')}
                        className="p-1 hover:bg-stone-200 rounded text-stone-500 disabled:opacity-20 cursor-pointer"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={index === currentLayout.blocks.length - 1}
                        onClick={() => moveBlock(index, 'down')}
                        className="p-1 hover:bg-stone-200 rounded text-stone-500 disabled:opacity-20 cursor-pointer"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: section?.color || '#333' }}
                        />
                        <span className="text-sm font-serif font-bold text-stone-900">
                          {block.title || section?.name}
                        </span>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-stone-100 rounded text-stone-600">
                          {block.sectionId}
                        </span>
                      </div>
                      <div className="text-xs text-stone-500 mt-0.5 flex items-center gap-3">
                        <span>
                          Article count: <strong>{block.articleCount}</strong>
                        </span>
                        <span>
                          Mode:{' '}
                          <strong>
                            {block.autoPopulateLatest ? 'Auto-populate latest' : 'Manual curated'}
                          </strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 self-end sm:self-center">
                    <div className="flex items-center gap-1 bg-stone-100 p-1 rounded border border-stone-200 text-xs">
                      <button
                        type="button"
                        onClick={() => updateBlockStyle(block.id, 'card')}
                        className={`px-2 py-1 rounded flex items-center gap-1 cursor-pointer ${
                          block.style === 'card'
                            ? 'bg-white shadow-xs font-bold text-stone-900'
                            : 'text-stone-500'
                        }`}
                        title="Card Layout"
                      >
                        <Columns className="w-3.5 h-3.5" /> Cards
                      </button>
                      <button
                        type="button"
                        onClick={() => updateBlockStyle(block.id, 'image-first')}
                        className={`px-2 py-1 rounded flex items-center gap-1 cursor-pointer ${
                          block.style === 'image-first'
                            ? 'bg-white shadow-xs font-bold text-stone-900'
                            : 'text-stone-500'
                        }`}
                        title="Image First"
                      >
                        <Image className="w-3.5 h-3.5" /> Image-First
                      </button>
                      <button
                        type="button"
                        onClick={() => updateBlockStyle(block.id, 'grid')}
                        className={`px-2 py-1 rounded flex items-center gap-1 cursor-pointer ${
                          block.style === 'grid'
                            ? 'bg-white shadow-xs font-bold text-stone-900'
                            : 'text-stone-500'
                        }`}
                        title="Grid"
                      >
                        <Grid className="w-3.5 h-3.5" /> Grid
                      </button>
                      <button
                        type="button"
                        onClick={() => updateBlockStyle(block.id, 'list')}
                        className={`px-2 py-1 rounded flex items-center gap-1 cursor-pointer ${
                          block.style === 'list'
                            ? 'bg-white shadow-xs font-bold text-stone-900'
                            : 'text-stone-500'
                        }`}
                        title="List"
                      >
                        <List className="w-3.5 h-3.5" /> Compact
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => toggleBlockVisibility(block.id)}
                      className={`px-3 py-1.5 rounded text-xs font-semibold border transition cursor-pointer ${
                        block.visible
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : 'bg-stone-100 text-stone-500 border-stone-300'
                      }`}
                    >
                      {block.visible ? 'Visible' : 'Hidden'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* -----------------------------------------------------------
       * 7. SIDEBAR WIDGETS ORGANIZER
       * ----------------------------------------------------------- */}
      {(activeAreaTab === 'all' || activeAreaTab === 'widgets') && (
        <div className="bg-white rounded-lg border border-stone-200 shadow-xs overflow-hidden">
          <div className="px-5 py-3.5 bg-stone-50 border-b border-stone-200">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-800">
              Right Rail / Sidebar Editorial Widgets
            </h2>
            <p className="text-[11px] text-stone-500">
              Enable or disable contextual widgets on the front page desktop sidebar.
            </p>
          </div>

          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {currentLayout.sidebarWidgets.map((widget) => (
              <div
                key={widget.id}
                onClick={() => toggleWidget(widget.id)}
                className={`p-3 rounded-lg border cursor-pointer transition flex items-center justify-between ${
                  widget.visible
                    ? 'bg-stone-50 border-stone-300 hover:border-red-600'
                    : 'bg-stone-100/50 border-dashed border-stone-300 opacity-60'
                }`}
              >
                <div>
                  <div className="text-xs font-bold text-stone-800">{widget.label}</div>
                  <div className="text-[10px] text-stone-400 font-mono capitalize">
                    {widget.type.replace('_', ' ')}
                  </div>
                </div>
                <div
                  className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] ${
                    widget.visible
                      ? 'bg-red-600 border-red-600 text-white font-bold'
                      : 'border-stone-400'
                  }`}
                >
                  {widget.visible ? '✓' : ''}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hero Customizer Modal */}
      <HeroCustomizeModal
        isOpen={isHeroModalOpen}
        onClose={() => setIsHeroModalOpen(false)}
        layout={currentLayout}
        articles={articles}
        language="en"
        onSave={(updated) => {
          setCurrentLayout(updated);
          onSaveLayout(updated);
          setIsHeroModalOpen(false);
        }}
      />
    </div>
  );
};
