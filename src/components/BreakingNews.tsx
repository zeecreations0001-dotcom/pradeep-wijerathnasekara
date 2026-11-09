/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { MessageSquare, AlertCircle, ArrowRight } from 'lucide-react';
import { Article, getLocalizedArticle } from '../data/newspaperData';
import { Language, TRANSLATIONS } from '../data/translations';
import { HeroAreaCustomization } from '../types/admin';
import { SocialShareButtons } from './SocialShareButtons';

interface BreakingNewsProps {
  articles: Article[];
  language: Language;
  customization?: HeroAreaCustomization;
  secondaryArticleIds?: string[];
  onSelectArticle: (article: Article) => void;
  onOpenLightbox?: (imageUrl: string, title: string, caption?: string) => void;
}

export const BreakingNews: React.FC<BreakingNewsProps> = ({
  articles,
  language,
  customization,
  secondaryArticleIds,
  onSelectArticle,
  onOpenLightbox,
}) => {
  const t = TRANSLATIONS[language];

  // Resolve customization defaults
  const c: HeroAreaCustomization = {
    titleEn: customization?.titleEn || t.breakingNewsTitle,
    titleSi: customization?.titleSi || 'උණුසුම් පුවත්',
    badgeText: customization?.badgeText || 'LIVE',
    badgeTextSi: customization?.badgeTextSi || 'සජීවී',
    badgeStyle: customization?.badgeStyle || 'amber',
    showLiveBadge: customization?.showLiveBadge ?? true,
    layoutStyle: customization?.layoutStyle || 'classic',
    imageAspect: customization?.imageAspect || '16/10',
    imageFilter: customization?.imageFilter || 'newspaper',
    headlineSize: customization?.headlineSize || 'large',
    showExcerpt: customization?.showExcerpt ?? true,
    showMeta: customization?.showMeta ?? true,
    showSecondaryStories: customization?.showSecondaryStories ?? true,
    secondaryCount: customization?.secondaryCount ?? 2,
    secondaryLayout: customization?.secondaryLayout || 'list',
    showZoomButton: customization?.showZoomButton ?? true,
    alertBanner: customization?.alertBanner,
  };

  const rawHero = articles.find((a) => a.isHero) || articles[0];
  const heroArticle = rawHero ? getLocalizedArticle(rawHero, language) : null;

  // Secondary breaking stories
  let rawOtherBreaking: Article[] = [];
  if (secondaryArticleIds && secondaryArticleIds.length > 0) {
    const picked = secondaryArticleIds
      .map((id) => articles.find((a) => a.id === id))
      .filter((a): a is Article => Boolean(a && a.id !== rawHero?.id));
    rawOtherBreaking = picked;
  }

  // Fill remaining slots if needed
  if (rawOtherBreaking.length < (c.secondaryCount || 2)) {
    const remaining = articles.filter(
      (a) =>
        a.id !== rawHero?.id &&
        !rawOtherBreaking.some((p) => p.id === a.id) &&
        (a.isBreaking || a.isLatest)
    );
    rawOtherBreaking = [...rawOtherBreaking, ...remaining].slice(0, c.secondaryCount || 2);
  } else {
    rawOtherBreaking = rawOtherBreaking.slice(0, c.secondaryCount || 2);
  }

  // Section title in current language
  const sectionTitle =
    language === 'si'
      ? c.titleSi || t.breakingNewsTitle
      : c.titleEn || t.breakingNewsTitle;

  // Live badge text in current language
  const badgeLabel =
    language === 'si'
      ? c.badgeTextSi || t.liveBadge
      : c.badgeText || t.liveBadge;

  // Badge styles
  const getBadgeClasses = () => {
    switch (c.badgeStyle) {
      case 'urgent-red':
        return 'bg-red-600 text-white font-black text-[10px] tracking-widest px-2.5 py-0.5 rounded-xs uppercase shadow-xs border border-red-700 animate-pulse';
      case 'editorial-black':
        return 'bg-black text-white font-black text-[10px] tracking-widest px-2 py-0.5 rounded-xs uppercase shadow-xs border border-black';
      case 'clean-outline':
        return 'border-2 border-black text-black font-black text-[9.5px] tracking-widest px-2 py-0.2 rounded-xs uppercase bg-transparent';
      case 'amber':
      default:
        return 'bg-[#facc15] text-black font-black text-[10px] tracking-widest px-2 py-0.5 rounded-xs uppercase shadow-xs border border-[#eab308]';
    }
  };

  // Image Aspect Ratio Classes
  const getAspectClass = () => {
    switch (c.imageAspect) {
      case '16/9':
        return 'aspect-video';
      case '4/3':
        return 'aspect-[4/3]';
      case '21/9':
        return 'aspect-[21/9]';
      case 'none':
        return 'hidden';
      case '16/10':
      default:
        return 'aspect-[16/10]';
    }
  };

  // Image Filter Classes
  const getImageFilterClass = () => {
    switch (c.imageFilter) {
      case 'full-color':
        return 'filter-none';
      case 'sepia':
        return 'filter sepia-40 contrast-105';
      case 'newspaper':
      default:
        return 'filter grayscale contrast-110 sepia-20 group-hover:filter-none';
    }
  };

  // Headline Font Size Classes
  const getHeadlineSizeClass = () => {
    switch (c.headlineSize) {
      case 'normal':
        return 'text-[20px] sm:text-[22px]';
      case 'xlarge':
        return 'text-[26px] sm:text-[32px]';
      case 'large':
      default:
        return 'text-[22px] sm:text-[26px]';
    }
  };

  return (
    <div className="w-full pb-6 lg:px-6 border-b lg:border-b-0 lg:border-r border-[#e5d8c3]">
      {/* Column Header */}
      <div className="border-b border-[#dfd0ba] pb-2 mb-4 flex items-center justify-between">
        <h2 className="font-headline italic text-2xl sm:text-[26px] font-bold text-black leading-none flex items-center gap-2.5">
          <span>{sectionTitle}</span>
          {c.showLiveBadge && (
            <span className={getBadgeClasses()}>
              {badgeLabel}
            </span>
          )}
        </h2>
      </div>

      {/* Optional Urgent Flash Alert Banner */}
      {c.alertBanner?.enabled && (c.alertBanner.textEn || c.alertBanner.textSi) && (
        <div
          className={`mb-4 p-3 rounded-xs flex items-center justify-between gap-3 text-xs font-semibold shadow-xs border ${
            c.alertBanner.style === 'amber'
              ? 'bg-[#fef3c7] text-[#78350f] border-[#f59e0b]'
              : c.alertBanner.style === 'dark'
              ? 'bg-[#1c1917] text-white border-black'
              : 'bg-red-700 text-white border-red-800'
          }`}
        >
          <div className="flex items-center gap-2 min-w-0">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span className="truncate font-sans font-bold uppercase tracking-wider text-[11.5px]">
              {language === 'si' && c.alertBanner.textSi
                ? c.alertBanner.textSi
                : c.alertBanner.textEn}
            </span>
          </div>
          <span className="shrink-0 text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded-xs bg-black/20 text-white">
            URGENT
          </span>
        </div>
      )}

      {/* Main Hero Article */}
      {heroArticle && (
        <>
          {/* LAYOUT 1: Classic Broadsheet */}
          {c.layoutStyle === 'classic' && (
            <article className="mb-7 group">
              {c.imageAspect !== 'none' && heroArticle.imageUrl && (
                <div
                  className={`relative overflow-hidden block bg-[#f4ebdc] ${getAspectClass()} mb-3.5 border border-[#dfd0ba] hover:border-[#eab308] transition-all group/img`}
                >
                  <a
                    href={`#article-${heroArticle.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      onSelectArticle(heroArticle);
                    }}
                    title={heroArticle.title}
                    className="block w-full h-full cursor-pointer"
                  >
                    <img
                      src={heroArticle.imageUrl}
                      alt={heroArticle.title}
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80';
                      }}
                      className={`w-full h-full object-cover transition-all duration-300 group-hover/img:scale-102 ${getImageFilterClass()}`}
                    />
                  </a>

                  {/* Direct Action Badges */}
                  <div className="absolute top-2.5 right-2.5 flex items-center space-x-1.5">
                    {c.showZoomButton && onOpenLightbox && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onOpenLightbox(
                            heroArticle.imageUrl!,
                            heroArticle.title,
                            heroArticle.imageCaption
                          );
                        }}
                        title={t.zoomImage}
                        className="bg-[#241c13]/85 hover:bg-black text-white text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-xs transition-colors opacity-90 group-hover/img:opacity-100 cursor-pointer shadow-xs"
                      >
                        {t.zoomImage}
                      </button>
                    )}
                    <span
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onSelectArticle(heroArticle);
                      }}
                      className="bg-[#facc15] hover:bg-[#ffd200] text-[#1b1712] text-[9.5px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-xs transition-all opacity-95 group-hover/img:opacity-100 flex items-center gap-1 cursor-pointer shadow-xs border border-[#eab308]"
                    >
                      {t.viewStory}
                    </span>
                  </div>
                </div>
              )}

              {/* Meta line */}
              {c.showMeta && (
                <div className="flex flex-wrap items-center gap-x-2 text-[10.5px] uppercase tracking-wider text-black font-sans mb-2 font-medium">
                  <span>{heroArticle.date}</span>
                  <span className="text-black/40">/</span>
                  <span className="text-black font-bold bg-[#fef08a] px-1 rounded-xs border border-[#fde047]">
                    {heroArticle.category}
                    {heroArticle.categorySecondary ? `, ${heroArticle.categorySecondary}` : ''}
                  </span>
                  <span className="text-black/40">/</span>
                  <span className="text-black font-semibold">
                    {t.byAuthor} {heroArticle.author}
                  </span>
                  <span className="text-black/40">/</span>
                  <span className="inline-flex items-center gap-1 text-black font-semibold">
                    <MessageSquare className="w-2.5 h-2.5 text-black" />
                    {heroArticle.commentsCount}
                  </span>
                </div>
              )}

              {/* Headline */}
              <h3
                onClick={() => onSelectArticle(heroArticle)}
                className={`font-headline font-bold ${getHeadlineSizeClass()} leading-[1.22] text-black mb-2.5 cursor-pointer hover:underline transition-colors`}
              >
                {heroArticle.title}
              </h3>

              {/* Excerpt */}
              {c.showExcerpt && (
                <p className="font-serif text-[13.5px] leading-relaxed text-black mb-3.5">
                  {heroArticle.excerpt}
                </p>
              )}

              {/* Read more button */}
              <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
                <button
                  onClick={() => onSelectArticle(heroArticle)}
                  className="text-[11px] font-bold tracking-[0.08em] uppercase text-black border-b-2 border-black pb-0.5 hover:opacity-70 transition-opacity cursor-pointer inline-flex items-center gap-1 min-h-[36px]"
                >
                  <span>{t.readMore}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Direct Social Media Share Bar on Front Page Hero Article */}
              <div className="pt-3 border-t border-[#dfd0ba]">
                <SocialShareButtons
                  url={typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}?article=${encodeURIComponent(heroArticle.id)}` : ''}
                  title={heroArticle.title}
                  summary={heroArticle.excerpt}
                  imageUrl={heroArticle.imageUrl}
                  language={language}
                  variant="bar"
                  onOpenDesigner={() => onSelectArticle(heroArticle)}
                />
              </div>
            </article>
          )}

          {/* LAYOUT 2: Cinematic Banner */}
          {c.layoutStyle === 'banner' && (
            <article
              onClick={() => onSelectArticle(heroArticle)}
              className="mb-7 rounded-sm overflow-hidden bg-[#181512] text-[#f7f4ed] border border-[#38332c] relative cursor-pointer group shadow-md"
            >
              {heroArticle.imageUrl && (
                <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] overflow-hidden">
                  <img
                    src={heroArticle.imageUrl}
                    alt={heroArticle.title}
                    className="w-full h-full object-cover opacity-85 group-hover:scale-103 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#181512] via-[#181512]/50 to-transparent"></div>
                </div>
              )}

              <div className="p-5 sm:p-6 -mt-16 sm:-mt-20 relative z-10">
                <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-widest text-[#facc15] font-mono font-bold mb-2">
                  <span className="bg-[#facc15] text-black px-1.5 py-0.5 rounded-xs font-black">
                    {heroArticle.category}
                  </span>
                  <span>•</span>
                  <span>{heroArticle.date}</span>
                  <span>•</span>
                  <span>{heroArticle.author}</span>
                </div>

                <h3 className={`font-headline font-bold ${getHeadlineSizeClass()} text-[#f7f4ed] leading-tight mb-2.5 group-hover:text-[#facc15] transition-colors`}>
                  {heroArticle.title}
                </h3>

                {c.showExcerpt && (
                  <p className="font-serif text-[13px] text-[#d4cbba] line-clamp-2 mb-4 leading-relaxed">
                    {heroArticle.excerpt}
                  </p>
                )}

                <div className="flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-[#facc15]">
                  <span>{t.viewStory}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </article>
          )}

          {/* LAYOUT 3: Split Editorial */}
          {c.layoutStyle === 'split' && (
            <article className="mb-7 p-4 bg-[#f6eddd] border border-[#dfd0ba] rounded-xs group">
              <div className="flex flex-col sm:flex-row gap-4 items-start">
                {c.imageAspect !== 'none' && heroArticle.imageUrl && (
                  <div className="w-full sm:w-1/2 aspect-[4/3] rounded-xs overflow-hidden shrink-0 border border-[#dfd0ba]">
                    <img
                      src={heroArticle.imageUrl}
                      alt={heroArticle.title}
                      onClick={() => onSelectArticle(heroArticle)}
                      className={`w-full h-full object-cover cursor-pointer group-hover:scale-103 transition-transform duration-300 ${getImageFilterClass()}`}
                    />
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  {c.showMeta && (
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px] uppercase font-bold tracking-wider text-black/70 mb-1.5">
                      <span className="text-red-700">{heroArticle.category}</span>
                      <span>•</span>
                      <span>{heroArticle.date}</span>
                    </div>
                  )}

                  <h3
                    onClick={() => onSelectArticle(heroArticle)}
                    className="font-headline font-bold text-[19px] sm:text-[22px] leading-snug text-black mb-2 cursor-pointer hover:underline"
                  >
                    {heroArticle.title}
                  </h3>

                  {c.showExcerpt && (
                    <p className="font-serif text-[12.5px] leading-relaxed text-black/85 line-clamp-3 mb-3">
                      {heroArticle.excerpt}
                    </p>
                  )}

                  <button
                    onClick={() => onSelectArticle(heroArticle)}
                    className="text-[10.5px] font-bold uppercase tracking-wider text-black border-b border-black pb-0.5 hover:opacity-70 transition-opacity cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>{t.readMore}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </article>
          )}

          {/* LAYOUT 4: Compact Urgent Newsflash */}
          {c.layoutStyle === 'compact' && (
            <article className="mb-6 p-4 bg-white border-2 border-black rounded-xs shadow-xs group">
              <div className="flex items-center gap-2 mb-2">
                <span className="bg-red-700 text-white text-[9.5px] font-black uppercase tracking-widest px-2 py-0.5 rounded-xs">
                  DISPATCH LEAD
                </span>
                <span className="text-[10px] uppercase font-bold text-black/60">
                  {heroArticle.category} • {heroArticle.date}
                </span>
              </div>

              <h3
                onClick={() => onSelectArticle(heroArticle)}
                className={`font-headline font-bold ${getHeadlineSizeClass()} leading-tight text-black mb-2.5 cursor-pointer hover:underline`}
              >
                {heroArticle.title}
              </h3>

              {c.showExcerpt && (
                <p className="font-serif text-[13px] text-black leading-relaxed mb-3">
                  {heroArticle.excerpt}
                </p>
              )}

              <button
                onClick={() => onSelectArticle(heroArticle)}
                className="text-[10.5px] font-black uppercase tracking-wider text-black bg-[#facc15] hover:bg-[#ffd200] px-3 py-1.5 rounded-xs transition-colors cursor-pointer inline-flex items-center gap-1 border border-[#eab308]"
              >
                <span>{t.viewStory}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </article>
          )}
        </>
      )}

      {/* Secondary Breaking News Articles */}
      {c.showSecondaryStories && rawOtherBreaking.length > 0 && (
        <div className="pt-2">
          {/* Format: Standard List */}
          {c.secondaryLayout === 'list' && (
            <div className="space-y-6">
              {rawOtherBreaking.map((rawArticle) => {
                const article = getLocalizedArticle(rawArticle, language);
                return (
                  <article
                    key={article.id}
                    className="pt-6 border-t border-[#e5d8c3] group"
                  >
                    {/* Meta line */}
                    {c.showMeta && (
                      <div className="flex flex-wrap items-center gap-x-2 text-[10.5px] uppercase tracking-wider text-black font-sans mb-1.5 font-medium">
                        <span>{article.date}</span>
                        <span className="text-black/40">/</span>
                        <span className="text-black font-bold bg-[#fef08a] px-1 rounded-xs border border-[#fde047]">
                          {article.category}
                          {article.categorySecondary ? `, ${article.categorySecondary}` : ''}
                        </span>
                        <span className="text-black/40">/</span>
                        <span className="text-black font-semibold">
                          {t.byAuthor} {article.author}
                        </span>
                        <span className="text-black/40">/</span>
                        <span className="inline-flex items-center gap-1 text-black font-semibold">
                          <MessageSquare className="w-2.5 h-2.5 text-black" />
                          {article.commentsCount}
                        </span>
                      </div>
                    )}

                    {/* Headline */}
                    <h3
                      onClick={() => onSelectArticle(article)}
                      className="font-headline font-bold text-[18px] sm:text-[20px] leading-[1.25] text-black mb-2 cursor-pointer hover:underline transition-colors"
                    >
                      {article.title}
                    </h3>

                    {/* Excerpt */}
                    {c.showExcerpt && (
                      <p className="font-serif text-[13px] leading-relaxed text-black mb-3">
                        {article.excerpt}
                      </p>
                    )}

                    {/* Read more */}
                    <button
                      onClick={() => onSelectArticle(article)}
                      className="text-[11px] font-bold tracking-[0.08em] uppercase text-black border-b border-black pb-0.5 hover:opacity-70 transition-opacity cursor-pointer inline-flex items-center min-h-[36px]"
                    >
                      {t.readMore} →
                    </button>
                  </article>
                );
              })}
            </div>
          )}

          {/* Format: 2-Column Grid */}
          {c.secondaryLayout === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#e5d8c3]">
              {rawOtherBreaking.map((rawArticle) => {
                const article = getLocalizedArticle(rawArticle, language);
                return (
                  <article
                    key={article.id}
                    className="p-3.5 bg-white border border-[#dfd0ba] rounded-xs flex flex-col justify-between group hover:border-black transition-colors"
                  >
                    <div>
                      <span className="text-[10px] font-bold uppercase text-red-700 tracking-wider block mb-1">
                        {article.category} • {article.date}
                      </span>
                      <h4
                        onClick={() => onSelectArticle(article)}
                        className="font-headline font-bold text-[15px] text-black leading-snug mb-2 cursor-pointer hover:underline line-clamp-2"
                      >
                        {article.title}
                      </h4>
                      {c.showExcerpt && (
                        <p className="font-serif text-[12px] text-black/80 line-clamp-2 mb-3">
                          {article.excerpt}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => onSelectArticle(article)}
                      className="text-[10px] font-bold uppercase text-black border-b border-black pb-0.5 inline-flex items-center gap-1 self-start cursor-pointer"
                    >
                      <span>{t.readMore}</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </article>
                );
              })}
            </div>
          )}

          {/* Format: Compact Bullet Headlines */}
          {c.secondaryLayout === 'compact' && (
            <div className="pt-4 border-t border-[#e5d8c3] space-y-2.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-black/70 block">
                {language === 'si' ? 'අතිරේක සිරස්තල' : 'MORE BREAKING DISPATCHES'}
              </span>
              {rawOtherBreaking.map((rawArticle) => {
                const article = getLocalizedArticle(rawArticle, language);
                return (
                  <div
                    key={article.id}
                    onClick={() => onSelectArticle(article)}
                    className="p-2.5 bg-[#f5edde] hover:bg-[#ebdcb9] border-l-3 border-black transition-colors cursor-pointer flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <span className="text-[9.5px] uppercase font-bold text-red-700 block">
                        {article.category}
                      </span>
                      <p className="font-headline font-bold text-xs sm:text-sm text-black truncate">
                        {article.title}
                      </p>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-black shrink-0" />
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
