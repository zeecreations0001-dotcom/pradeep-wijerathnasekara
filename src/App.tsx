/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LeftSidebar } from './components/LeftSidebar';
import { BreakingNews } from './components/BreakingNews';
import { DailyFeed } from './components/DailyFeed';
import { FeaturedStories } from './components/FeaturedStories';
import { Footer } from './components/Footer';
import { ArticleModal } from './components/ArticleModal';
import { SearchModal } from './components/SearchModal';
import { ContactModal, ShowcaseModal } from './components/InfoModals';
import { ImageLightboxModal } from './components/ImageLightboxModal';
import { FloatingControls } from './components/FloatingControls';
import { SiteScrollbar } from './components/SiteScrollbar';
import { AdminPanel } from './components/admin/AdminPanel';
import { ReaderAccountModal } from './components/ReaderAccountModal';
import { ARTICLES, Article, getLocalizedArticle } from './data/newspaperData';
import { Language, TRANSLATIONS, CATEGORY_TRANSLATIONS } from './data/translations';
import { useNewsroomData, mapAdminArticleToPublic } from './services/bridgeData';
import { NewsroomStore } from './services/adminStore';
import { ReaderUser } from './types/admin';
import { X, Filter, Flame, Home, Compass, Bookmark as BookmarkIcon, Search as SearchIcon, Zap, TrendingUp, Star, KeyRound } from 'lucide-react';

function checkIsAdminRoute(): boolean {
  if (typeof window === 'undefined') return false;
  const path = window.location.pathname.toLowerCase();
  const hash = window.location.hash.toLowerCase();
  return (
    path.startsWith('/admin') ||
    path === '/login' ||
    path === '/register' ||
    hash === '#admin' ||
    hash.startsWith('#/admin') ||
    hash.startsWith('#/login') ||
    hash.startsWith('#/register')
  );
}

export default function App() {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('newspaper_lang');
      return saved === 'si' ? 'si' : 'en';
    } catch {
      return 'en';
    }
  });

  // Newsroom Live Dynamic Store Data
  const { publicArticles, frontPage, breakingNews, settings, currentUser } = useNewsroomData();

  // Admin CMS Open State (checks both pathname /admin and #admin in URL)
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(() => {
    return checkIsAdminRoute();
  });

  // Reader account modal state and subscribed reader
  const [isReaderAccountOpen, setIsReaderAccountOpen] = useState(false);
  const [readerModalInitialMode, setReaderModalInitialMode] = useState<'reader' | 'staff'>('reader');
  const [readerModalInitialTab, setReaderModalInitialTab] = useState<'login' | 'register' | 'profile'>('login');
  const [currentReader, setCurrentReader] = useState<ReaderUser | null>(() => NewsroomStore.getCurrentReader());

  const handleOpenLogin = (mode: 'reader' | 'staff' = 'reader') => {
    setReaderModalInitialMode(mode);
    setReaderModalInitialTab('login');
    setIsReaderAccountOpen(true);
  };

  const handleOpenRegister = () => {
    setReaderModalInitialMode('reader');
    setReaderModalInitialTab('register');
    setIsReaderAccountOpen(true);
  };

  // Public Reader UI states
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [mobileSectionTab, setMobileSectionTab] = useState<'all' | 'breaking' | 'feed' | 'popular' | 'featured'>('all');
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [activeTag, setActiveTag] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [lightboxInfo, setLightboxInfo] = useState<{
    isOpen: boolean;
    imageUrl: string;
    title: string;
    caption?: string;
  }>({
    isOpen: false,
    imageUrl: '',
    title: '',
  });
  const [showcaseInfo, setShowcaseInfo] = useState<{
    isOpen: boolean;
    title: string;
    type: 'shortcodes' | 'post_types';
  }>({
    isOpen: false,
    title: '',
    type: 'shortcodes',
  });

  const t = TRANSLATIONS[language];

  const openAdmin = () => {
    setIsAdminOpen(true);
    try {
      if (window.location.pathname !== '/admin') {
        window.history.pushState(null, '', '/admin');
      }
    } catch {
      // fallback
    }
    if (!window.location.hash.startsWith('#/admin')) {
      window.location.hash = '#/admin';
    }
  };

  const closeAdmin = () => {
    setIsAdminOpen(false);
    try {
      if (window.location.pathname.startsWith('/admin')) {
        window.history.pushState(null, '', '/');
      }
    } catch {
      // fallback
    }
    if (window.location.hash.startsWith('#/admin') || window.location.hash === '#admin') {
      window.location.hash = '';
    }
  };

  // Sync reader store updates
  useEffect(() => {
    const unsubscribe = NewsroomStore.subscribe(() => {
      setCurrentReader(NewsroomStore.getCurrentReader());
    });
    return unsubscribe;
  }, []);

  // Sync URL changes (popstate & hashchange)
  useEffect(() => {
    const handleRouteChange = () => {
      setIsAdminOpen(checkIsAdminRoute());
    };
    window.addEventListener('popstate', handleRouteChange);
    window.addEventListener('hashchange', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      window.removeEventListener('hashchange', handleRouteChange);
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('newspaper_lang', language);
    } catch {
      // ignore
    }
    document.documentElement.lang = language;
  }, [language]);

  // Merge dynamic newsroom store articles with default mock articles
  const combinedArticles: Article[] = [
    ...publicArticles,
    ...ARTICLES.filter((a) => !publicArticles.some((p) => p.id === a.id)),
  ];

  // Filter articles based on active category / tag
  const filteredArticles = combinedArticles.filter((article) => {
    if (activeCategory !== 'ALL') {
      const catUpper = activeCategory.toUpperCase();
      const matchCat =
        article.category.toUpperCase() === catUpper ||
        (article.categorySecondary &&
          article.categorySecondary.toUpperCase() === catUpper) ||
        (catUpper === 'CULTURAL' && (
          article.category.toUpperCase() === 'CULTURE' ||
          article.category.toUpperCase() === 'ARTS' ||
          article.tags?.some((t) => t.toLowerCase().includes('cultur') || t.toLowerCase().includes('art'))
        )) ||
        (catUpper === 'INSPIRATIONAL' && (
          article.category.toUpperCase() === 'EDUCATION' ||
          article.category.toUpperCase() === 'LIFESTYLE' ||
          article.tags?.some((t) => t.toLowerCase().includes('inspir') || t.toLowerCase().includes('educat') || t.toLowerCase().includes('mindset'))
        ));
      if (!matchCat) return false;
    }
    if (activeTag) {
      const matchTag =
        article.tags?.some(
          (tg) => tg.toLowerCase() === activeTag.toLowerCase()
        ) ||
        article.tagsSi?.some(
          (tg) => tg.toLowerCase() === activeTag.toLowerCase()
        );
      if (!matchTag) return false;
    }
    return true;
  });

  // Article selection helper supporting English & Sinhala title matching
  const handleSelectArticleByTitle = (title: string) => {
    const found = combinedArticles.find((a) =>
      a.title.toLowerCase().includes(title.toLowerCase()) ||
      (a.titleSi && a.titleSi.toLowerCase().includes(title.toLowerCase()))
    );
    if (found) {
      handleOpenArticleModal(found);
    } else {
      const tempArticle: Article = {
        id: 'latest-' + encodeURIComponent(title.slice(0, 15)),
        title: title,
        titleSi: title,
        category: 'EDITORIAL',
        categorySi: 'කතුවැකිය',
        date: 'SEPTEMBER 25, 2017',
        dateSi: '2017 සැප්තැම්බර් 25',
        author: 'CMSMASTERS',
        authorSi: 'සී.එම්.එස් මාස්ටර්ස්',
        commentsCount: 2,
        excerpt:
          language === 'si'
            ? 'මෙම කාලීන තේමාව පිළිබඳව අපගේ විශේෂාංග ලේඛක මඬුල්ල විසින් සම්පාදිත ගැඹුරු විග්‍රහයක්.'
            : 'Etiam eu molestie eros, commodo nec turpis hendrerit sapien. Maecenas tempus leo ac nisi iaculis porta. Sed sapien tempus.',
        content:
          language === 'si'
            ? [
                `නවතම සංස්කෘතික සහ සමාජයීය වර්ධනයන් පිළිබඳ විමර්ශනය: "${title}". අපගේ සංස්කාරක මණ්ඩලය විසින් නිරීක්ෂණය කරන ලද කරුණු රැසක් මෙහි අන්තර්ගත වේ.`,
                'සමාජයේ විවිධ ක්ෂේත්‍රයන්හි සිදුවන ශීඝ්‍ර පරිවර්තනයන් ජනජීවිතය කෙරෙහි ඍජු බලපෑමක් ඇති කර තිබේ.',
              ]
            : [
                `Exploring the latest culinary and cultural developments: "${title}". Curabitur vel feugiat massa, sed facilisis ligula. Duis eleifend nunc sit amet mi dapibus ornare.`,
                'Suspendisse non tempus vel libero sem pellentesque ornare amet. In hac habitasse platea dictumst.',
              ],
        readTime: language === 'si' ? 'මිනිත්තු 3 ක කියවීමක්' : '3 min read',
      };
      handleOpenArticleModal(tempArticle);
    }
  };

  const handleOpenArticleModal = (article: Article) => {
    setSelectedArticle(article);
    NewsroomStore.incrementArticleViews(article.id);
    try {
      const url = new URL(window.location.href);
      url.searchParams.set('article', article.id);
      window.history.pushState({ articleId: article.id }, '', url.toString());
    } catch {
      // ignore
    }
  };

  const handleCloseArticleModal = () => {
    setSelectedArticle(null);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('article');
      window.history.pushState({}, '', url.pathname + (url.search ? url.search : '') + (url.hash ? url.hash : ''));
    } catch {
      // ignore
    }
  };

  // Deep linking: Open article from ?article=ID query parameter on load & popstate
  useEffect(() => {
    const handlePopStateArticle = () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const artId = params.get('article');
        if (artId) {
          const found = combinedArticles.find((a) => a.id === artId);
          if (found) {
            setSelectedArticle(found);
          }
        }
      } catch {
        // ignore
      }
    };

    handlePopStateArticle();
    window.addEventListener('popstate', handlePopStateArticle);
    return () => window.removeEventListener('popstate', handlePopStateArticle);
  }, [combinedArticles]);

  // Sync dynamic OpenGraph and Twitter social share metadata when an article is opened
  useEffect(() => {
    if (selectedArticle) {
      document.title = `${selectedArticle.title} — The Daily Herald`;

      const updateMetaTag = (selector: string, attr: string, value: string) => {
        let el = document.querySelector(selector);
        if (!el) {
          el = document.createElement('meta');
          const [key, val] = selector.replace(/[\[\]']/g, '').split('=');
          el.setAttribute(key, val);
          document.head.appendChild(el);
        }
        el.setAttribute(attr, value);
      };

      const heroImg = selectedArticle.imageUrl || '/assets/aistudio/Logo_W2.jpg_741157ec.jpeg';
      const origin = typeof window !== 'undefined' ? window.location.origin : 'https://herald-news.edu';
      const permalink = `${origin}${window.location.pathname}?article=${encodeURIComponent(selectedArticle.id)}`;

      updateMetaTag("meta[property='og:title']", 'content', selectedArticle.title);
      updateMetaTag("meta[property='og:description']", 'content', selectedArticle.excerpt || '');
      updateMetaTag("meta[property='og:image']", 'content', heroImg);
      updateMetaTag("meta[property='og:url']", 'content', permalink);
      updateMetaTag("meta[name='twitter:title']", 'content', selectedArticle.title);
      updateMetaTag("meta[name='twitter:description']", 'content', selectedArticle.excerpt || '');
      updateMetaTag("meta[name='twitter:image']", 'content', heroImg);
      updateMetaTag("meta[name='twitter:card']", 'content', 'summary_large_image');
    } else {
      document.title = 'Pradeep Wijerathnasekara — Educational Blog';
    }
  }, [selectedArticle]);

  const handleSelectTag = (tag: string) => {
    setActiveTag(tag);
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const handleCategorySelect = (cat: string) => {
    setActiveCategory(cat);
    setActiveTag(null);
    window.scrollTo({ top: 180, behavior: 'smooth' });
  };

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Helper to resolve articles for configured front-page areas (Latest, Popular, Daily Feed, Featured)
  const resolveAreaArticles = (
    areaConfig: typeof frontPage.latestArticlesArea,
    fallbackList: Article[],
    defaultCount: number = 6
  ): Article[] => {
    if (areaConfig && areaConfig.mode === 'custom' && areaConfig.articleIds && areaConfig.articleIds.length > 0) {
      const list = areaConfig.articleIds
        .map((id) => combinedArticles.find((a) => a.id === id))
        .filter((a): a is Article => Boolean(a));
      if (list.length > 0) {
        return areaConfig.count ? list.slice(0, areaConfig.count) : list;
      }
    }
    const count = areaConfig?.count || defaultCount;
    return fallbackList.slice(0, count);
  };

  // 1. Latest Articles Area (Left Sidebar)
  const curatedLatestArticles = resolveAreaArticles(
    frontPage?.latestArticlesArea,
    combinedArticles.filter((a) => !a.isHero),
    frontPage?.latestArticlesArea?.count || 6
  );

  // 2. Most Popular Area (Left Sidebar)
  const curatedPopularArticles = resolveAreaArticles(
    frontPage?.mostPopularArea,
    [...combinedArticles].sort((a, b) => (a.popularRank || 99) - (b.popularRank || 99)),
    frontPage?.mostPopularArea?.count || 5
  );

  // 3. Daily Feed Area (Right Rail)
  const curatedDailyFeedArticles = resolveAreaArticles(
    frontPage?.dailyFeedArea,
    filteredArticles.length > 0
      ? filteredArticles
      : combinedArticles.filter((a) => a.isDailyFeed || !a.isHero),
    frontPage?.dailyFeedArea?.count || 8
  );

  // 4. Featured Stories Area (Below the fold 6-card grid)
  const curatedFeaturedArticles = resolveAreaArticles(
    frontPage?.featuredStoriesArea,
    combinedArticles.filter((a) => a.isFeatured),
    frontPage?.featuredStoriesArea?.count || 6
  );

  const displayCategoryName =
    language === 'si' && CATEGORY_TRANSLATIONS[activeCategory.toUpperCase()]
      ? CATEGORY_TRANSLATIONS[activeCategory.toUpperCase()]
      : activeCategory;

  // IF ADMIN PANEL IS OPEN, RENDER CMS BACKEND VIEW
  if (isAdminOpen) {
    return (
      <AdminPanel
        onReturnToPublic={closeAdmin}
        onPreviewArticleInPublic={(adminArt) => {
          closeAdmin();
          const mapped = mapAdminArticleToPublic(adminArt, true);
          handleOpenArticleModal(mapped);
        }}
      />
    );
  }

  // PUBLIC NEWSPAPER READER VIEW
  return (
    <div className="min-h-screen flex flex-col bg-[#faf6ee] text-black pb-16 lg:pb-0">
      {/* Header with utility bar, masthead, main navigation, Language Switcher, Reader Account & Newsroom CMS Button */}
      <Header
        currentCategory={activeCategory}
        language={language}
        onToggleLanguage={(lang) => setLanguage(lang)}
        onSelectCategory={handleCategorySelect}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenContact={() => setIsContactOpen(true)}
        onOpenShortcodes={() =>
          setShowcaseInfo({
            isOpen: true,
            title: language === 'si' ? 'කෙටි කේත සංග්‍රහය' : 'Editorial Shortcodes Showcase',
            type: 'shortcodes',
          })
        }
        onOpenPostTypes={() =>
          setShowcaseInfo({
            isOpen: true,
            title: language === 'si' ? 'පුවත් ආකෘති සංග්‍රහය' : 'Post Types & Formats Showcase',
            type: 'post_types',
          })
        }
        onOpenAdmin={openAdmin}
        onOpenReaderAccount={() => handleOpenLogin('reader')}
        onOpenRegister={handleOpenRegister}
        adminUser={currentUser ? { name: currentUser.name, role: currentUser.role } : null}
        readerUser={
          currentReader
            ? {
                name: currentReader.name,
                email: currentReader.email,
                bookmarksCount: currentReader.bookmarks?.length || 0,
              }
            : null
        }
        logoUrl={settings.general?.mastheadLogoUrl || '/assets/aistudio/Logo_W2.jpg_741157ec.jpeg'}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
      />

      {/* Dynamic Sitewide Breaking News Ticker Bar (configured from Admin) */}
      {settings.layout.showBreakingTicker && breakingNews.length > 0 && (
        <div className="w-full bg-[#b91c1c] text-white border-b border-[#991b1b] shadow-xs select-none">
          <div className="max-w-[1180px] mx-auto px-4 sm:px-6 h-8 flex items-center gap-3 overflow-hidden text-xs">
            <span className="flex items-center gap-1.5 font-mono uppercase font-black tracking-widest text-[10px] bg-black/40 px-2 py-0.5 rounded-xs shrink-0">
              <Flame className="w-3.5 h-3.5 text-yellow-300 animate-pulse" />
              {t.breakingNewsTitle}
            </span>
            <div className="truncate flex-1 font-serif text-[11px] sm:text-xs">
              {breakingNews.map((item, idx) => (
                <span key={item.id} className="mr-6">
                  {idx > 0 && <span className="opacity-40 mr-6">✦</span>}
                  {language === 'si' && item.headlineSi ? item.headlineSi : item.headline}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-[1180px] w-full mx-auto px-3 sm:px-6 pt-5 sm:pt-7">
        {/* Active Filter Badge Bar */}
        {(activeCategory !== 'ALL' || activeTag) && (
          <div className="mb-5 p-3 bg-[#f4ebdc] border border-[#dfcead] flex items-center justify-between text-xs font-sans rounded-xs shadow-xs relative overflow-hidden">
            <div className="absolute top-0 left-0 bottom-0 w-1 bg-[#facc15]" />
            <div className="flex items-center space-x-2 pl-2">
              <Filter className="w-3.5 h-3.5 text-black" />
              <span className="text-black font-medium">{t.filteredView}</span>
              {activeCategory !== 'ALL' && (
                <span className="font-extrabold bg-[#fef08a] text-black px-2 py-0.5 border border-[#fde047] rounded-xs">
                  {t.categoryLabel}: {displayCategoryName}
                </span>
              )}
              {activeTag && (
                <span className="font-extrabold bg-[#fef08a] text-black px-2 py-0.5 border border-[#fde047] rounded-xs">
                  {t.tagLabel}: #{activeTag}
                </span>
              )}
            </div>
            <button
              onClick={() => {
                setActiveCategory('ALL');
                setActiveTag(null);
              }}
              className="text-black hover:text-black font-bold hover:underline flex items-center space-x-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
              <span>{t.clearFilter}</span>
            </button>
          </div>
        )}

        {/* Mobile Section View Selector Tabs (Quick-switch between news sections on mobile) */}
        <div className="block lg:hidden mb-5">
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1 -mx-1 px-1" style={{ WebkitOverflowScrolling: 'touch' }}>
            <button
              onClick={() => setMobileSectionTab('all')}
              className={`px-3 py-1.5 text-xs font-bold uppercase rounded-xs tracking-wider shrink-0 transition-all min-h-[34px] flex items-center gap-1 cursor-pointer ${
                mobileSectionTab === 'all'
                  ? 'bg-black text-[#facc15] shadow-xs'
                  : 'bg-[#f4ebdc] text-black border border-[#dfcead] hover:bg-[#ebdcc7]'
              }`}
            >
              <span>{language === 'si' ? 'සියල්ල' : 'All Sections'}</span>
            </button>
            <button
              onClick={() => setMobileSectionTab('breaking')}
              className={`px-3 py-1.5 text-xs font-bold uppercase rounded-xs tracking-wider shrink-0 transition-all min-h-[34px] flex items-center gap-1 cursor-pointer ${
                mobileSectionTab === 'breaking'
                  ? 'bg-black text-[#facc15] shadow-xs'
                  : 'bg-[#f4ebdc] text-black border border-[#dfcead] hover:bg-[#ebdcc7]'
              }`}
            >
              <span>🔥</span>
              <span>{language === 'si' ? 'ප්‍රධාන පුවත්' : 'Top Stories'}</span>
            </button>
            <button
              onClick={() => setMobileSectionTab('feed')}
              className={`px-3 py-1.5 text-xs font-bold uppercase rounded-xs tracking-wider shrink-0 transition-all min-h-[34px] flex items-center gap-1 cursor-pointer ${
                mobileSectionTab === 'feed'
                  ? 'bg-black text-[#facc15] shadow-xs'
                  : 'bg-[#f4ebdc] text-black border border-[#dfcead] hover:bg-[#ebdcc7]'
              }`}
            >
              <span>⚡</span>
              <span>{language === 'si' ? 'දෛනික පුවත්' : 'Daily Feed'}</span>
            </button>
            <button
              onClick={() => setMobileSectionTab('popular')}
              className={`px-3 py-1.5 text-xs font-bold uppercase rounded-xs tracking-wider shrink-0 transition-all min-h-[34px] flex items-center gap-1 cursor-pointer ${
                mobileSectionTab === 'popular'
                  ? 'bg-black text-[#facc15] shadow-xs'
                  : 'bg-[#f4ebdc] text-black border border-[#dfcead] hover:bg-[#ebdcc7]'
              }`}
            >
              <span>📈</span>
              <span>{language === 'si' ? 'ජනප්‍රිය' : 'Popular'}</span>
            </button>
            <button
              onClick={() => setMobileSectionTab('featured')}
              className={`px-3 py-1.5 text-xs font-bold uppercase rounded-xs tracking-wider shrink-0 transition-all min-h-[34px] flex items-center gap-1 cursor-pointer ${
                mobileSectionTab === 'featured'
                  ? 'bg-black text-[#facc15] shadow-xs'
                  : 'bg-[#f4ebdc] text-black border border-[#dfcead] hover:bg-[#ebdcc7]'
              }`}
            >
              <span>⭐</span>
              <span>{language === 'si' ? 'විශේෂාංග' : 'Featured'}</span>
            </button>
          </div>
        </div>

        {/* 3-Column Newspaper Top Section: Breaking News (Hero lead story), Left column (Side dispatches), Daily feed (Timeline) */}
        <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-0">
          {/* Middle Column / Hero: Order 1 on mobile, Order 2 on desktop */}
          <div
            className={`order-1 lg:order-2 lg:col-span-6 ${
              mobileSectionTab !== 'all' && mobileSectionTab !== 'breaking'
                ? 'hidden lg:block'
                : 'block'
            }`}
          >
            <BreakingNews
              articles={
                filteredArticles.length > 0
                  ? filteredArticles
                  : combinedArticles.filter((a) => a.isBreaking)
              }
              language={language}
              customization={frontPage?.heroCustomization}
              secondaryArticleIds={frontPage?.heroSecondaryIds}
              onSelectArticle={handleOpenArticleModal}
              onOpenLightbox={(imageUrl, title, caption) =>
                setLightboxInfo({ isOpen: true, imageUrl, title, caption })
              }
            />
          </div>

          {/* Left Column: Order 2 on mobile, Order 1 on desktop */}
          <div
            className={`order-2 lg:order-1 lg:col-span-3 ${
              mobileSectionTab !== 'all' && mobileSectionTab !== 'popular'
                ? 'hidden lg:block'
                : 'block'
            }`}
          >
            <LeftSidebar
              popularArticles={curatedPopularArticles}
              latestArticles={curatedLatestArticles}
              latestAreaTitle={
                language === 'si'
                  ? frontPage?.latestArticlesArea?.titleSi
                  : frontPage?.latestArticlesArea?.titleEn
              }
              popularAreaTitle={
                language === 'si'
                  ? frontPage?.mostPopularArea?.titleSi
                  : frontPage?.mostPopularArea?.titleEn
              }
              language={language}
              onSelectArticle={handleOpenArticleModal}
              onSelectTitle={handleSelectArticleByTitle}
              onSelectTag={handleSelectTag}
              onOpenImage={(imageUrl, title, caption) =>
                setLightboxInfo({ isOpen: true, imageUrl, title, caption })
              }
            />
          </div>

          {/* Right Column (Daily Feed): Order 3 on mobile and desktop */}
          <div
            className={`order-3 lg:order-3 lg:col-span-3 lg:pl-6 ${
              mobileSectionTab !== 'all' && mobileSectionTab !== 'feed'
                ? 'hidden lg:block'
                : 'block'
            }`}
          >
            <DailyFeed
              articles={curatedDailyFeedArticles}
              areaTitle={
                language === 'si'
                  ? frontPage?.dailyFeedArea?.titleSi
                  : frontPage?.dailyFeedArea?.titleEn
              }
              itemsPerPage={4}
              language={language}
              onSelectArticle={handleOpenArticleModal}
              onViewMore={() => {
                window.scrollTo({ top: 800, behavior: 'smooth' });
              }}
            />
          </div>
        </div>

        {/* Featured Stories 6-Card Grid & Newsletter */}
        <div
          className={`${
            mobileSectionTab !== 'all' && mobileSectionTab !== 'featured'
              ? 'hidden lg:block'
              : 'block'
          }`}
        >
          <FeaturedStories
            articles={combinedArticles}
            curatedArticles={curatedFeaturedArticles}
            areaTitle={
              language === 'si'
                ? frontPage?.featuredStoriesArea?.titleSi
                : frontPage?.featuredStoriesArea?.titleEn
            }
            language={language}
            onSelectArticle={handleOpenArticleModal}
            onViewMore={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenLightbox={(imageUrl, title, caption) =>
              setLightboxInfo({ isOpen: true, imageUrl, title, caption })
            }
          />
        </div>
      </main>

      {/* Footer */}
      <Footer
        language={language}
        onSelectCategory={handleCategorySelect}
        onSelectTag={handleSelectTag}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* Sitewide Visible Scrollbar and Progress Tracker */}
      {!selectedArticle && !isAdminOpen && (
        <SiteScrollbar language={language} />
      )}

      {/* Floating Controls with quick Login trigger */}
      <FloatingControls
        onScrollToTop={handleScrollToTop}
        onOpenLogin={() => handleOpenLogin('reader')}
        onOpenAdmin={openAdmin}
        adminUser={currentUser ? { name: currentUser.name, role: currentUser.role } : null}
      />

      {/* Mobile Bottom Navigation Bar (Thumb Dock for Smartphone Users) */}
      <nav
        aria-label="Mobile quick actions"
        className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-[#faf6ee]/95 backdrop-blur-md border-t border-[#dfcead] h-14 px-1 flex items-center justify-around shadow-[0_-2px_10px_rgba(0,0,0,0.06)]"
      >
        <button
          onClick={() => {
            setActiveCategory('ALL');
            setActiveTag(null);
            setMobileSectionTab('all');
            handleScrollToTop();
          }}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-black cursor-pointer transition-colors ${
            activeCategory === 'ALL' && mobileSectionTab === 'all'
              ? 'text-black font-extrabold'
              : 'text-black/70'
          }`}
        >
          <Home className="w-4 h-4 mb-0.5 text-black" />
          <span className="text-[10px] font-sans font-bold uppercase tracking-wider">
            {t.navHome}
          </span>
        </button>

        <button
          onClick={() => {
            setMobileSectionTab('feed');
            window.scrollTo({ top: 180, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-black cursor-pointer transition-colors ${
            mobileSectionTab === 'feed' ? 'text-black font-extrabold' : 'text-black/70'
          }`}
        >
          <Zap className="w-4 h-4 mb-0.5 text-black" />
          <span className="text-[10px] font-sans font-bold uppercase tracking-wider">
            {language === 'si' ? 'පුවත්' : 'Feed'}
          </span>
        </button>

        <button
          onClick={() => setIsMobileMenuOpen(true)}
          className="flex flex-col items-center justify-center flex-1 h-full py-1 text-black cursor-pointer hover:text-black transition-colors"
        >
          <div className="w-7 h-7 rounded-full bg-[#facc15] border border-[#eab308] flex items-center justify-center shadow-xs -mt-2">
            <Compass className="w-4 h-4 text-black" />
          </div>
          <span className="text-[10px] font-sans font-bold uppercase tracking-wider text-black mt-0.5">
            {language === 'si' ? 'මෙනුව' : 'Sections'}
          </span>
        </button>

        <button
          onClick={() => setIsSearchOpen(true)}
          className="flex flex-col items-center justify-center flex-1 h-full py-1 text-black cursor-pointer hover:text-black transition-colors"
        >
          <SearchIcon className="w-4 h-4 mb-0.5 text-black" />
          <span className="text-[10px] font-sans font-bold uppercase tracking-wider">
            {language === 'si' ? 'සොයන්න' : 'Search'}
          </span>
        </button>

        <button
          onClick={() => {
            if (currentReader) {
              setReaderModalInitialMode('reader');
              setReaderModalInitialTab('profile');
              setIsReaderAccountOpen(true);
            } else {
              handleOpenLogin('reader');
            }
          }}
          className="flex flex-col items-center justify-center flex-1 h-full py-1 text-black cursor-pointer hover:text-black transition-colors relative"
          aria-label={currentReader ? 'Saved Articles' : 'Login'}
        >
          <div className="relative">
            {currentReader ? (
              <BookmarkIcon className="w-4 h-4 mb-0.5 text-black" />
            ) : (
              <KeyRound className="w-4 h-4 mb-0.5 text-black" />
            )}
            {currentReader && currentReader.bookmarks && currentReader.bookmarks.length > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#facc15] text-black text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center border border-[#eab308]">
                {currentReader.bookmarks.length}
              </span>
            )}
          </div>
          <span className="text-[10px] font-sans font-bold uppercase tracking-wider">
            {currentReader ? (language === 'si' ? 'සුරැකි' : 'Saved') : (language === 'si' ? 'ඇතුල්වීම' : 'Login')}
          </span>
        </button>
      </nav>

      {/* Reader Profile, Log In & Web System Backend Modal */}
      <ReaderAccountModal
        isOpen={isReaderAccountOpen}
        onClose={() => setIsReaderAccountOpen(false)}
        onOpenArticle={handleOpenArticleModal}
        onOpenAdmin={openAdmin}
        language={language}
        initialMode={readerModalInitialMode}
        initialTab={readerModalInitialTab}
      />

      {/* Article Reader Modal */}
      <ArticleModal
        article={selectedArticle}
        language={language}
        onClose={handleCloseArticleModal}
        onSelectTag={handleSelectTag}
        onOpenImageLightbox={(imageUrl, title, caption) =>
          setLightboxInfo({ isOpen: true, imageUrl, title, caption })
        }
      />

      {/* Image Lightbox Viewer Modal */}
      <ImageLightboxModal
        isOpen={lightboxInfo.isOpen}
        onClose={() =>
          setLightboxInfo((prev) => ({ ...prev, isOpen: false }))
        }
        imageUrl={lightboxInfo.imageUrl}
        title={lightboxInfo.title}
        caption={lightboxInfo.caption}
        onOpenArticle={
          selectedArticle
            ? undefined
            : () => {
                const found = combinedArticles.find(
                  (a) => a.imageUrl === lightboxInfo.imageUrl
                );
                if (found) handleOpenArticleModal(found);
              }
        }
      />

      {/* Live Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        language={language}
        onClose={() => setIsSearchOpen(false)}
        articles={combinedArticles}
        onSelectArticle={handleOpenArticleModal}
      />

      {/* Contact Modal */}
      <ContactModal
        isOpen={isContactOpen}
        language={language}
        onClose={() => setIsContactOpen(false)}
      />

      {/* Shortcodes & Post Types Showcase Modal */}
      <ShowcaseModal
        isOpen={showcaseInfo.isOpen}
        onClose={() =>
          setShowcaseInfo((prev) => ({ ...prev, isOpen: false }))
        }
        title={showcaseInfo.title}
        type={showcaseInfo.type}
      />
    </div>
  );
}
