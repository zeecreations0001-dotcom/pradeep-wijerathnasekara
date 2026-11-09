/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  Sliders,
  Check,
  RotateCcw,
  Layout,
  Image as ImageIcon,
  Type,
  ListFilter,
  Bell,
  Eye,
  Radio,
  Sparkles,
} from 'lucide-react';
import { FrontPageLayout, HeroAreaCustomization, Article as AdminArticle } from '../../types/admin';
import { Language } from '../../data/translations';
import { NewsroomStore } from '../../services/adminStore';

interface HeroCustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  layout: FrontPageLayout;
  articles: AdminArticle[];
  language: Language;
  onSave: (updatedLayout: FrontPageLayout) => void;
}

export const HeroCustomizeModal: React.FC<HeroCustomizeModalProps> = ({
  isOpen,
  onClose,
  layout,
  articles,
  language,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<'lead' | 'presentation' | 'style' | 'secondary' | 'alert'>('lead');

  // Working copy of hero customization
  const initialCustomization: HeroAreaCustomization = layout.heroCustomization || {
    titleEn: 'Breaking News',
    titleSi: 'උණුසුම් පුවත්',
    badgeText: 'LIVE',
    badgeTextSi: 'සජීවී',
    badgeStyle: 'amber',
    showLiveBadge: true,
    layoutStyle: 'classic',
    imageAspect: '16/10',
    imageFilter: 'newspaper',
    headlineSize: 'large',
    showExcerpt: true,
    showMeta: true,
    showSecondaryStories: true,
    secondaryCount: 2,
    secondaryLayout: 'list',
    showZoomButton: true,
    alertBanner: {
      enabled: false,
      textEn: 'Developing story: Updates continuously verified by our Colombo editorial team.',
      textSi: 'නවතම තොරතුරු: අපගේ කොළඹ කර්තෘ මණ්ඩලය විසින් තහවුරු කරනු ලබයි.',
      style: 'urgent-red',
    },
  };

  const [heroMainId, setHeroMainId] = useState<string>(layout.heroMainId);
  const [heroSecondaryIds, setHeroSecondaryIds] = useState<string[]>(layout.heroSecondaryIds || []);
  const [config, setConfig] = useState<HeroAreaCustomization>(initialCustomization);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [searchLeadQuery, setSearchLeadQuery] = useState('');

  if (!isOpen) return null;

  const publishedArticles = articles.filter(
    (a) => a.editorialStatus === 'published' || a.editorialStatus === 'approved'
  );

  const selectedMainArticle = articles.find((a) => a.id === heroMainId) || publishedArticles[0];

  const handleUpdate = <K extends keyof HeroAreaCustomization>(key: K, val: HeroAreaCustomization[K]) => {
    setConfig((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  const handleUpdateAlert = (key: string, val: any) => {
    setConfig((prev) => ({
      ...prev,
      alertBanner: {
        enabled: prev.alertBanner?.enabled ?? false,
        textEn: prev.alertBanner?.textEn ?? '',
        textSi: prev.alertBanner?.textSi ?? '',
        style: prev.alertBanner?.style ?? 'urgent-red',
        linkArticleId: prev.alertBanner?.linkArticleId,
        [key]: val,
      },
    }));
  };

  const handleResetDefaults = () => {
    const defaultCustomization: HeroAreaCustomization = {
      titleEn: 'Breaking News',
      titleSi: 'උණුසුම් පුවත්',
      badgeText: 'LIVE',
      badgeTextSi: 'සජීවී',
      badgeStyle: 'amber',
      showLiveBadge: true,
      layoutStyle: 'classic',
      imageAspect: '16/10',
      imageFilter: 'newspaper',
      headlineSize: 'large',
      showExcerpt: true,
      showMeta: true,
      showSecondaryStories: true,
      secondaryCount: 2,
      secondaryLayout: 'list',
      showZoomButton: true,
      alertBanner: {
        enabled: false,
        textEn: 'Developing story: Updates continuously verified by our editorial team.',
        textSi: 'නවතම තොරතුරු: අපගේ කර්තෘ මණ්ඩලය විසින් තහවුරු කරනු ලබයි.',
        style: 'urgent-red',
      },
    };
    setConfig(defaultCustomization);
  };

  const handleSaveAll = () => {
    const updated: FrontPageLayout = {
      ...layout,
      heroMainId,
      heroSecondaryIds,
      heroCustomization: config,
      publishedAt: new Date().toISOString(),
    };
    NewsroomStore.saveFrontPageLayout(updated);
    onSave(updated);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 800);
  };

  const filteredLeadArticles = publishedArticles.filter((art) => {
    if (!searchLeadQuery.trim()) return true;
    const q = searchLeadQuery.toLowerCase();
    return (
      art.headline.toLowerCase().includes(q) ||
      (art.headlineSi && art.headlineSi.includes(q)) ||
      art.sectionId.toLowerCase().includes(q) ||
      art.reporterName.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 backdrop-blur-xs p-2 sm:p-4 animate-in fade-in duration-200">
      <div className="bg-[#fbf9f4] text-black w-full max-w-4xl max-h-[92vh] rounded-md shadow-2xl border border-[#dfd0ba] flex flex-col overflow-hidden font-sans">
        {/* Header */}
        <div className="px-5 py-3.5 bg-[#f5ecdc] border-b border-[#dfd0ba] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded bg-[#1f1a14] text-[#facc15] flex items-center justify-center shadow-xs">
              <Sliders className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-headline font-bold text-lg text-black leading-tight flex items-center gap-2">
                <span>{language === 'si' ? 'ප්‍රධාන පුවත් හා Hero තීරුව සැකසීම' : 'Customize Hero & Breaking News'}</span>
                <span className="text-[10px] bg-[#facc15] text-black font-mono font-black uppercase px-1.5 py-0.5 rounded-xs border border-[#eab308]">
                  Front Page
                </span>
              </h2>
              <p className="text-[11px] text-black/70 font-sans">
                {language === 'si'
                  ? 'මුල් පිටුවේ ප්‍රධාන පුවත, පිරිසැලසුම, සිරස්තල හා උණුසුම් පුවත් තීරුව ඔබ කැමති පරිදි සකසන්න'
                  : 'Tailor the lead story, visual layout, header branding, and secondary dispatches'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded hover:bg-[#dfd0ba]/80 text-black flex items-center justify-center transition-colors cursor-pointer"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#dfd0ba] bg-[#efe5d3] px-4 gap-1 overflow-x-auto text-xs shrink-0">
          <button
            onClick={() => setActiveTab('lead')}
            className={`py-2.5 px-3.5 font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'lead'
                ? 'border-black text-black bg-[#fbf9f4]'
                : 'border-transparent text-black/70 hover:text-black hover:bg-[#e7dcbf]'
            }`}
          >
            <Radio className="w-3.5 h-3.5 text-red-600" />
            <span>{language === 'si' ? '1. ප්‍රධාන පුවත තෝරන්න' : '1. Lead Story'}</span>
          </button>

          <button
            onClick={() => setActiveTab('presentation')}
            className={`py-2.5 px-3.5 font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'presentation'
                ? 'border-black text-black bg-[#fbf9f4]'
                : 'border-transparent text-black/70 hover:text-black hover:bg-[#e7dcbf]'
            }`}
          >
            <Type className="w-3.5 h-3.5" />
            <span>{language === 'si' ? '2. ශීර්ෂය හා ලාංඡනය' : '2. Header & Badges'}</span>
          </button>

          <button
            onClick={() => setActiveTab('style')}
            className={`py-2.5 px-3.5 font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'style'
                ? 'border-black text-black bg-[#fbf9f4]'
                : 'border-transparent text-black/70 hover:text-black hover:bg-[#e7dcbf]'
            }`}
          >
            <Layout className="w-3.5 h-3.5" />
            <span>{language === 'si' ? '3. පිරිසැලසුම් විලාසය' : '3. Layout & Visuals'}</span>
          </button>

          <button
            onClick={() => setActiveTab('secondary')}
            className={`py-2.5 px-3.5 font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'secondary'
                ? 'border-black text-black bg-[#fbf9f4]'
                : 'border-transparent text-black/70 hover:text-black hover:bg-[#e7dcbf]'
            }`}
          >
            <ListFilter className="w-3.5 h-3.5" />
            <span>{language === 'si' ? '4. අතිරේක පුවත්' : '4. Secondary Stories'}</span>
          </button>

          <button
            onClick={() => setActiveTab('alert')}
            className={`py-2.5 px-3.5 font-bold transition-all border-b-2 flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              activeTab === 'alert'
                ? 'border-black text-black bg-[#fbf9f4]'
                : 'border-transparent text-black/70 hover:text-black hover:bg-[#e7dcbf]'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-amber-700" />
            <span>{language === 'si' ? '5. හදිසි නිවේදන තීරුව' : '5. Alert Banner'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* TAB 1: Lead Story Picker */}
          {activeTab === 'lead' && (
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#dfd0ba] pb-3">
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider text-black">
                    {language === 'si' ? 'ප්‍රධාන පුවත (Lead Anchor Article)' : 'Hero Lead Anchor Article'}
                  </h3>
                  <p className="text-xs text-black/70">
                    {language === 'si'
                      ? 'ප්‍රධාන Hero කොටසේ විශාලතම ආකර්ෂණය සහිතව පළවන ලිපිය මෙතැනින් තෝරන්න.'
                      : 'Select the primary article that headlines the front page with primary prominence.'}
                  </p>
                </div>
                <input
                  type="text"
                  placeholder={language === 'si' ? 'ලිපි සොයන්න...' : 'Search articles...'}
                  value={searchLeadQuery}
                  onChange={(e) => setSearchLeadQuery(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-white text-black border border-[#d6c49e] rounded shadow-2xs focus:outline-none focus:ring-1 focus:ring-black"
                />
              </div>

              {/* Current Lead Story Preview Card */}
              {selectedMainArticle && (
                <div className="p-3.5 bg-[#f4ebdc] border border-[#d6c49e] rounded flex flex-col sm:flex-row gap-3.5 items-start">
                  <div className="w-full sm:w-36 h-24 shrink-0 rounded overflow-hidden bg-stone-300">
                    <img
                      src={selectedMainArticle.featuredImage}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-black text-[#facc15] px-1.5 py-0.2 rounded-xs">
                        CURRENT LEAD
                      </span>
                      <span className="text-[10px] uppercase font-bold text-red-700">
                        {selectedMainArticle.sectionId} • {selectedMainArticle.priorityTag}
                      </span>
                    </div>
                    <h4 className="font-headline font-bold text-sm text-black line-clamp-1">
                      {language === 'si' && selectedMainArticle.headlineSi
                        ? selectedMainArticle.headlineSi
                        : selectedMainArticle.headline}
                    </h4>
                    <p className="text-[11.5px] text-black/70 line-clamp-2 mt-0.5">
                      {language === 'si' && selectedMainArticle.excerptSi
                        ? selectedMainArticle.excerptSi
                        : selectedMainArticle.excerpt}
                    </p>
                  </div>
                </div>
              )}

              {/* Article Selection Grid */}
              <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                <label className="text-[11px] font-bold uppercase tracking-wider text-black/80 block">
                  {language === 'si' ? 'ප්‍රකාශිත ලිපි ලැයිස්තුවෙන් තෝරන්න' : 'Choose From Published Articles'}
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {filteredLeadArticles.map((art) => {
                    const isSelected = art.id === heroMainId;
                    return (
                      <div
                        key={art.id}
                        onClick={() => setHeroMainId(art.id)}
                        className={`p-2.5 rounded border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                          isSelected
                            ? 'bg-amber-100/90 border-amber-600 shadow-xs'
                            : 'bg-white hover:bg-[#faf6ee] border-[#dfd0ba]'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={art.featuredImage}
                            alt=""
                            className="w-14 h-10 object-cover rounded shrink-0 border border-[#dfd0ba]"
                          />
                          <div className="min-w-0">
                            <span className="text-[9.5px] font-bold uppercase text-red-700">
                              {art.sectionId.toUpperCase()} • {art.priorityTag}
                            </span>
                            <p className="text-xs font-headline font-bold text-black truncate">
                              {language === 'si' && art.headlineSi ? art.headlineSi : art.headline}
                            </p>
                            <p className="text-[10px] text-black/60 truncate">
                              {art.reporterName} • {new Date(art.publishedAt || art.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0">
                          {isSelected ? (
                            <span className="w-5 h-5 rounded-full bg-black text-[#facc15] flex items-center justify-center">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </span>
                          ) : (
                            <span className="text-[10px] font-bold text-black/60 border border-black/30 rounded px-1.5 py-0.5 hover:bg-black hover:text-white transition-colors">
                              Select
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Header & Badges */}
          {activeTab === 'presentation' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-black border-b border-[#dfd0ba] pb-2">
                  {language === 'si' ? 'තීරුවේ ශීර්ෂය හා ලාංඡන (Header & Badges)' : 'Hero Section Header & Badges'}
                </h3>
              </div>

              {/* Title Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                    Section Title (English)
                  </label>
                  <input
                    type="text"
                    value={config.titleEn || ''}
                    onChange={(e) => handleUpdate('titleEn', e.target.value)}
                    placeholder="Breaking News"
                    className="w-full px-3 py-2 text-xs bg-white text-black border border-[#d6c49e] rounded focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  <p className="text-[10.5px] text-black/60 mt-1">Default: &quot;Breaking News&quot;</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                    Section Title (Sinhala / සිංහල)
                  </label>
                  <input
                    type="text"
                    value={config.titleSi || ''}
                    onChange={(e) => handleUpdate('titleSi', e.target.value)}
                    placeholder="උණුසුම් පුවත්"
                    className="w-full px-3 py-2 text-xs bg-white text-black border border-[#d6c49e] rounded focus:outline-none focus:ring-1 focus:ring-black"
                  />
                  <p className="text-[10.5px] text-black/60 mt-1">Default: &quot;උණුසුම් පුවත්&quot;</p>
                </div>
              </div>

              {/* Badge Controls */}
              <div className="p-4 bg-[#f4ebdc] border border-[#d6c49e] rounded space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-black block">
                      {language === 'si' ? 'සජීවී ලාංඡනය පෙන්වන්න (Live Badge)' : 'Display Live Badge'}
                    </span>
                    <span className="text-[11px] text-black/70">
                      Show an eye-catching status badge next to the section title
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.showLiveBadge ?? true}
                      onChange={(e) => handleUpdate('showLiveBadge', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black"></div>
                  </label>
                </div>

                {config.showLiveBadge && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-[#dfd0ba]">
                    <div>
                      <label className="block text-[11px] font-bold text-black mb-1">
                        Badge Text (EN)
                      </label>
                      <input
                        type="text"
                        value={config.badgeText || ''}
                        onChange={(e) => handleUpdate('badgeText', e.target.value)}
                        placeholder="LIVE"
                        className="w-full px-2.5 py-1.5 text-xs bg-white text-black border border-[#d6c49e] rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-black mb-1">
                        Badge Text (SI)
                      </label>
                      <input
                        type="text"
                        value={config.badgeTextSi || ''}
                        onChange={(e) => handleUpdate('badgeTextSi', e.target.value)}
                        placeholder="සජීවී"
                        className="w-full px-2.5 py-1.5 text-xs bg-white text-black border border-[#d6c49e] rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-black mb-1">
                        Badge Visual Style
                      </label>
                      <select
                        value={config.badgeStyle || 'amber'}
                        onChange={(e) => handleUpdate('badgeStyle', e.target.value as any)}
                        className="w-full px-2.5 py-1.5 text-xs bg-white text-black border border-[#d6c49e] rounded font-medium"
                      >
                        <option value="amber">Yellow Amber (Classic Herald)</option>
                        <option value="urgent-red">Urgent Red (Pulsing)</option>
                        <option value="editorial-black">Broadsheet Black</option>
                        <option value="clean-outline">Clean Minimal Outline</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: Layout & Visuals */}
          {activeTab === 'style' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-black border-b border-[#dfd0ba] pb-2">
                  {language === 'si' ? 'පිරිසැලසුම් විලාසය හා ඡායාරූප (Layout & Visuals)' : 'Hero Layout Style & Photo Treatment'}
                </h3>
              </div>

              {/* Layout Presets */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-black mb-2">
                  Hero Article Layout Style
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    {
                      id: 'classic',
                      name: 'Classic Broadsheet',
                      desc: 'Standard newspaper lead with prominent image on top, serif headline, excerpt and byline.',
                    },
                    {
                      id: 'banner',
                      name: 'Cinematic Banner',
                      desc: 'Full-bleed dark image card with gradient overlay and high-contrast gold headlines.',
                    },
                    {
                      id: 'split',
                      name: 'Split Editorial',
                      desc: 'Side-by-side 50/50 image and editorial copy for balanced reading weight.',
                    },
                    {
                      id: 'compact',
                      name: 'Urgent Alert Box',
                      desc: 'Streamlined text-forward alert layout for fast-moving breaking news situations.',
                    },
                  ].map((style) => {
                    const isSelected = (config.layoutStyle || 'classic') === style.id;
                    return (
                      <div
                        key={style.id}
                        onClick={() => handleUpdate('layoutStyle', style.id as any)}
                        className={`p-3 rounded border text-left cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#f4ebd0] border-black ring-1 ring-black shadow-xs'
                            : 'bg-white hover:bg-[#faf6ee] border-[#dfd0ba]'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-bold text-xs text-black">{style.name}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-black" />}
                        </div>
                        <p className="text-[11px] text-black/70 leading-relaxed">{style.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Image Aspect & Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 bg-[#f4ebdc] border border-[#d6c49e] rounded">
                <div>
                  <label className="block text-xs font-bold text-black mb-1">
                    Image Aspect Ratio
                  </label>
                  <select
                    value={config.imageAspect || '16/10'}
                    onChange={(e) => handleUpdate('imageAspect', e.target.value as any)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white text-black border border-[#d6c49e] rounded font-medium"
                  >
                    <option value="16/10">16:10 (Standard Newspaper)</option>
                    <option value="16/9">16:9 (Cinematic Widescreen)</option>
                    <option value="4/3">4:3 (Classic Photojournalism)</option>
                    <option value="21/9">21:9 (Panoramic Banner)</option>
                    <option value="none">Hide Image (Text Focus)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-black mb-1">
                    Photo Color Filter
                  </label>
                  <select
                    value={config.imageFilter || 'newspaper'}
                    onChange={(e) => handleUpdate('imageFilter', e.target.value as any)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white text-black border border-[#d6c49e] rounded font-medium"
                  >
                    <option value="newspaper">Monochrome (Vintage hover reveal)</option>
                    <option value="full-color">Full Vibrant Natural Color</option>
                    <option value="sepia">Warm Archive Sepia Tone</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-black mb-1">
                    Headline Font Size
                  </label>
                  <select
                    value={config.headlineSize || 'large'}
                    onChange={(e) => handleUpdate('headlineSize', e.target.value as any)}
                    className="w-full px-2.5 py-1.5 text-xs bg-white text-black border border-[#d6c49e] rounded font-medium"
                  >
                    <option value="normal">Normal (22px)</option>
                    <option value="large">Large Broadsheet (25px)</option>
                    <option value="xlarge">Extra Large Impact (30px)</option>
                  </select>
                </div>
              </div>

              {/* Toggles */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label className="flex items-center gap-2 p-2.5 bg-white border border-[#dfd0ba] rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.showExcerpt ?? true}
                    onChange={(e) => handleUpdate('showExcerpt', e.target.checked)}
                    className="rounded text-black focus:ring-0 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-black">Show Article Excerpt</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 bg-white border border-[#dfd0ba] rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.showMeta ?? true}
                    onChange={(e) => handleUpdate('showMeta', e.target.checked)}
                    className="rounded text-black focus:ring-0 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-black">Show Author & Date Line</span>
                </label>

                <label className="flex items-center gap-2 p-2.5 bg-white border border-[#dfd0ba] rounded cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.showZoomButton ?? true}
                    onChange={(e) => handleUpdate('showZoomButton', e.target.checked)}
                    className="rounded text-black focus:ring-0 cursor-pointer"
                  />
                  <span className="text-xs font-bold text-black">Show Image Lightbox Zoom</span>
                </label>
              </div>
            </div>
          )}

          {/* TAB 4: Secondary Stories */}
          {activeTab === 'secondary' && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-black border-b border-[#dfd0ba] pb-2">
                  {language === 'si' ? 'අතිරේක උණුසුම් පුවත් (Secondary Breaking Stories)' : 'Secondary Breaking News Under Hero'}
                </h3>
                <p className="text-xs text-black/70 mt-1">
                  Configure the companion breaking news dispatches that display beneath the main lead story.
                </p>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-white border border-[#dfd0ba] rounded">
                <div>
                  <span className="text-xs font-bold text-black block">
                    Show Secondary Stories in Column
                  </span>
                  <span className="text-[11px] text-black/60">
                    If disabled, only the main lead hero story will appear.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={config.showSecondaryStories ?? true}
                  onChange={(e) => handleUpdate('showSecondaryStories', e.target.checked)}
                  className="w-4 h-4 rounded text-black cursor-pointer"
                />
              </div>

              {config.showSecondaryStories && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                      Number of Secondary Stories
                    </label>
                    <select
                      value={config.secondaryCount ?? 2}
                      onChange={(e) => handleUpdate('secondaryCount', parseInt(e.target.value))}
                      className="w-full px-3 py-2 text-xs bg-white text-black border border-[#d6c49e] rounded font-medium"
                    >
                      <option value="1">1 Story</option>
                      <option value="2">2 Stories (Recommended)</option>
                      <option value="3">3 Stories</option>
                      <option value="4">4 Stories</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-black mb-1">
                      Secondary Layout Format
                    </label>
                    <select
                      value={config.secondaryLayout || 'list'}
                      onChange={(e) => handleUpdate('secondaryLayout', e.target.value as any)}
                      className="w-full px-3 py-2 text-xs bg-white text-black border border-[#d6c49e] rounded font-medium"
                    >
                      <option value="list">Vertical List (Broadsheet rules)</option>
                      <option value="grid">2-Column Cards</option>
                      <option value="compact">Compact Bullet Headlines</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 5: Urgent Alert Banner */}
          {activeTab === 'alert' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-black border-b border-[#dfd0ba] pb-2">
                  {language === 'si' ? 'හදිසි නිවේදන තීරුව (Urgent Flash Banner)' : 'Urgent Breaking Alert Banner'}
                </h3>
                <p className="text-xs text-black/70 mt-1">
                  Display an urgent marquee or announcement banner directly anchored above the hero lead package.
                </p>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-white border border-[#dfd0ba] rounded">
                <div>
                  <span className="text-xs font-bold text-black block">
                    Enable Urgent Hero Flash Banner
                  </span>
                  <span className="text-[11px] text-black/60">
                    Pins an urgent highlight strip right at the top of the breaking news section.
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={config.alertBanner?.enabled ?? false}
                  onChange={(e) => handleUpdateAlert('enabled', e.target.checked)}
                  className="w-4 h-4 rounded text-black cursor-pointer"
                />
              </div>

              {config.alertBanner?.enabled && (
                <div className="space-y-3 p-4 bg-[#f4ebdc] border border-[#d6c49e] rounded">
                  <div>
                    <label className="block text-xs font-bold text-black mb-1">
                      Alert Text (English)
                    </label>
                    <input
                      type="text"
                      value={config.alertBanner?.textEn || ''}
                      onChange={(e) => handleUpdateAlert('textEn', e.target.value)}
                      placeholder="e.g., FLASH: Official declaration announced by Department of Examinations"
                      className="w-full px-3 py-2 text-xs bg-white text-black border border-[#d6c49e] rounded focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-black mb-1">
                      Alert Text (Sinhala / සිංහල)
                    </label>
                    <input
                      type="text"
                      value={config.alertBanner?.textSi || ''}
                      onChange={(e) => handleUpdateAlert('textSi', e.target.value)}
                      placeholder="උදා: උණුසුම් පුවත්: විභාග දෙපාර්තමේන්තුව විසින් නිල නිවේදනයක් නිකුත් කෙරේ"
                      className="w-full px-3 py-2 text-xs bg-white text-black border border-[#d6c49e] rounded focus:outline-none focus:ring-1 focus:ring-black"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-black mb-1">
                      Alert Severity Tone
                    </label>
                    <select
                      value={config.alertBanner?.style || 'urgent-red'}
                      onChange={(e) => handleUpdateAlert('style', e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-white text-black border border-[#d6c49e] rounded font-medium"
                    >
                      <option value="urgent-red">Urgent Red (Critical breaking)</option>
                      <option value="amber">Breaking Amber (High attention)</option>
                      <option value="dark">Broadsheet Black (Formal declaration)</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer with Actions */}
        <div className="px-5 py-3.5 bg-[#f5ecdc] border-t border-[#dfd0ba] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="text-xs font-bold text-black/70 hover:text-black flex items-center gap-1.5 py-1 px-2.5 rounded hover:bg-[#dfd0ba]/60 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>{language === 'si' ? 'යළි පෙරනිමි අගයන්ට' : 'Reset Defaults'}</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-black hover:bg-[#dfd0ba] rounded transition-colors cursor-pointer"
            >
              {language === 'si' ? 'අවලංගු කරන්න' : 'Cancel'}
            </button>

            <button
              type="button"
              onClick={handleSaveAll}
              className="px-5 py-2 text-xs font-bold uppercase tracking-wider bg-black hover:bg-stone-800 text-white rounded transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-[#facc15]" />
                  <span>{language === 'si' ? 'වෙනස්කම් සුරකින්න' : 'Apply to Front Page'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
