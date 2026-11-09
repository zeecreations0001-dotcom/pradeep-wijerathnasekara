import React, { useState, useEffect, useRef } from 'react';
import { X, Share2, Printer, Check, Bookmark, ThumbsUp, Maximize2, ChevronUp, Languages, Loader2, Sparkles } from 'lucide-react';
import { Article, getLocalizedArticle } from '../data/newspaperData';
import { Language, TRANSLATIONS } from '../data/translations';
import { NewsroomStore } from '../services/adminStore';
import { translateArticle } from '../services/translationService';
import { SocialShareButtons } from './SocialShareButtons';
import { SocialPostDesignerModal } from './SocialPostDesignerModal';

interface ArticleModalProps {
  article: Article | null;
  language: Language;
  onClose: () => void;
  onSelectTag?: (tag: string) => void;
  onOpenImageLightbox?: (imageUrl: string, title: string, caption?: string) => void;
}

interface CommentItem {
  id: string;
  author: string;
  date: string;
  text: string;
}

type ReadingBackground = 'parchment' | 'sepia' | 'clean' | 'night';

const BG_CONFIG: Record<ReadingBackground, {
  name: string;
  nameSi: string;
  icon: string;
  containerClass: string;
  headerClass: string;
  textColor: string;
  subtextColor: string;
  borderClass: string;
  cardBg: string;
  inputBg: string;
  bylineBadge: string;
  watermarkOpacity: string;
}> = {
  parchment: {
    name: 'Parchment',
    nameSi: 'පැරණි පත්‍රය',
    icon: '📜',
    containerClass: 'paper-reading-parchment text-black border-[#d6c4a5]',
    headerClass: 'bg-[#f4ebdc]/95 border-[#dfcead]',
    textColor: 'text-black',
    subtextColor: 'text-black/70',
    borderClass: 'border-[#dfcead]',
    cardBg: 'bg-[#f4ebd9] border-[#dfcead]',
    inputBg: 'bg-[#fdfbf7] text-black border-[#d8c7a8]',
    bylineBadge: 'bg-black text-white',
    watermarkOpacity: 'opacity-[0.04]',
  },
  sepia: {
    name: 'Warm Sepia',
    nameSi: 'සීපියා',
    icon: '🌾',
    containerClass: 'bg-[#f4ecd8] text-black border-[#d1be95]',
    headerClass: 'bg-[#ebdcb9]/95 border-[#d6c49e]',
    textColor: 'text-black',
    subtextColor: 'text-black/75',
    borderClass: 'border-[#d6c49e]',
    cardBg: 'bg-[#ecdcb7] border-[#d6c49e]',
    inputBg: 'bg-[#faf3e3] text-black border-[#d1be95]',
    bylineBadge: 'bg-[#3d2c16] text-[#faf5ea]',
    watermarkOpacity: 'opacity-[0.05]',
  },
  clean: {
    name: 'Clean White',
    nameSi: 'සුදු කඩදාසි',
    icon: '⚪',
    containerClass: 'bg-white text-black border-[#e5ded0]',
    headerClass: 'bg-[#f8f6f0]/95 border-[#e5ded0]',
    textColor: 'text-black',
    subtextColor: 'text-black/70',
    borderClass: 'border-[#e5ded0]',
    cardBg: 'bg-[#f8f6f0] border-[#e5ded0]',
    inputBg: 'bg-white text-black border-[#d8d0c0]',
    bylineBadge: 'bg-black text-white',
    watermarkOpacity: 'opacity-[0.025]',
  },
  night: {
    name: 'Night Slate',
    nameSi: 'රාත්‍රී මාදිලිය',
    icon: '🌙',
    containerClass: 'bg-[#181512] text-[#f2eee6] border-[#38332c]',
    headerClass: 'bg-[#221e1a]/95 border-[#38332c]',
    textColor: 'text-[#f2eee6]',
    subtextColor: 'text-[#b8afa0]',
    borderClass: 'border-[#38332c]',
    cardBg: 'bg-[#231f1a] border-[#38332c]',
    inputBg: 'bg-[#25201b] text-[#f2eee6] border-[#443c33]',
    bylineBadge: 'bg-[#facc15] text-black font-black',
    watermarkOpacity: 'opacity-[0.02]',
  },
};

export const ArticleModal: React.FC<ArticleModalProps> = ({
  article: rawArticle,
  language,
  onClose,
  onSelectTag,
  onOpenImageLightbox,
}) => {
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'xlarge'>('normal');
  const [readingBg, setReadingBg] = useState<ReadingBackground>('parchment');
  const [copied, setCopied] = useState(false);
  const [isShareMenuOpen, setIsShareMenuOpen] = useState(false);
  const [isPostDesignerOpen, setIsPostDesignerOpen] = useState(false);
  const [saved, setSaved] = useState(() => rawArticle ? NewsroomStore.isBookmarked(rawArticle.id) : false);
  const [likes, setLikes] = useState(14);
  const [hasLiked, setHasLiked] = useState(false);
  const t = TRANSLATIONS[language];

  const cfg = BG_CONFIG[readingBg];
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Lock body scroll when modal is open to ensure smooth scrolling inside modal on mobile
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    const originalTouchAction = document.body.style.touchAction;

    document.body.style.overflow = 'hidden';
    document.body.style.touchAction = 'pan-y';

    return () => {
      document.body.style.overflow = originalOverflow;
      document.body.style.touchAction = originalTouchAction;
    };
  }, []);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const maxScroll = target.scrollHeight - target.clientHeight;
    if (maxScroll > 0) {
      const progress = Math.min(100, Math.max(0, Math.round((target.scrollTop / maxScroll) * 100)));
      setScrollProgress(progress);
    }
  };

  const scrollToTop = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // High-visibility interactive scrollbar track & thumb
  const scrollTrackRef = useRef<HTMLDivElement>(null);
  const [isDraggingThumb, setIsDraggingThumb] = useState(false);

  const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!scrollTrackRef.current || !scrollContainerRef.current) return;
    const rect = scrollTrackRef.current.getBoundingClientRect();
    const clickY = e.clientY - rect.top;
    const ratio = Math.max(0, Math.min(1, clickY / rect.height));
    const container = scrollContainerRef.current;
    const targetScroll = ratio * (container.scrollHeight - container.clientHeight);
    container.scrollTo({ top: targetScroll, behavior: 'smooth' });
  };

  const handleThumbPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setIsDraggingThumb(true);
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
  };

  const handleThumbPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDraggingThumb || !scrollTrackRef.current || !scrollContainerRef.current) return;
    const rect = scrollTrackRef.current.getBoundingClientRect();
    const currentY = e.clientY - rect.top;
    const ratio = Math.max(0, Math.min(1, currentY / rect.height));
    const container = scrollContainerRef.current;
    const targetScroll = ratio * (container.scrollHeight - container.clientHeight);
    container.scrollTop = targetScroll;
  };

  const handleThumbPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDraggingThumb(false);
    try {
      (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);
    } catch {
      // ignore
    }
  };

  const [currentArticleLang, setCurrentArticleLang] = useState<Language>(language);
  const [dynamicArticle, setDynamicArticle] = useState<Article | null>(rawArticle);
  const [isArticleTranslating, setIsArticleTranslating] = useState(false);
  const [translationToast, setTranslationToast] = useState<string | null>(null);

  useEffect(() => {
    setCurrentArticleLang(language);
  }, [language]);

  useEffect(() => {
    setDynamicArticle(rawArticle);
    if (rawArticle) {
      setSaved(NewsroomStore.isBookmarked(rawArticle.id));
    }
  }, [rawArticle]);

  // Sinhala unicode detector helper
  const isSinhalaText = (str?: string) => !!str && /[\u0D80-\u0DFF]/.test(str);

  const handleTranslateArticle = async (targetLang: 'si' | 'en', forceRefresh = false) => {
    if (!dynamicArticle || isArticleTranslating) return;

    // Check if target translation already exists and is valid
    if (!forceRefresh) {
      if (targetLang === 'si') {
        const hasSinhala =
          (!!dynamicArticle.titleSi && dynamicArticle.titleSi.trim().length > 0) ||
          (Array.isArray(dynamicArticle.contentSi) && dynamicArticle.contentSi.length > 0);
        if (hasSinhala) {
          setCurrentArticleLang('si');
          return;
        }
      } else {
        // Target is English: check if non-Sinhala English text exists
        const hasEnglish =
          (!!dynamicArticle.title && !isSinhalaText(dynamicArticle.title)) ||
          (Array.isArray(dynamicArticle.content) && dynamicArticle.content.some((c) => !isSinhalaText(c)));
        if (hasEnglish && dynamicArticle.title !== dynamicArticle.titleSi) {
          setCurrentArticleLang('en');
          return;
        }
      }
    }

    setIsArticleTranslating(true);
    setTranslationToast(
      targetLang === 'en'
        ? '✨ Auto-translating article to English with Gemini AI (ඉංග්‍රීසි භාෂාවට පරිවර්තනය වෙමින් පවතී)...'
        : '✨ Auto-translating article to Sinhala with Gemini AI (සිංහල භාෂාවට පරිවර්තනය වෙමින් පවතී)...'
    );

    try {
      if (targetLang === 'en') {
        // Translating from Sinhala to English
        const sourceTitle =
          dynamicArticle.titleSi || (isSinhalaText(dynamicArticle.title) ? dynamicArticle.title : '');
        const sourceExcerpt =
          dynamicArticle.excerptSi || (isSinhalaText(dynamicArticle.excerpt) ? dynamicArticle.excerpt || '' : '');

        let sourceContent = '';
        if (dynamicArticle.contentSi && dynamicArticle.contentSi.length > 0) {
          sourceContent = Array.isArray(dynamicArticle.contentSi)
            ? dynamicArticle.contentSi.join('\n\n')
            : dynamicArticle.contentSi;
        } else if (Array.isArray(dynamicArticle.content)) {
          sourceContent = dynamicArticle.content.join('\n\n');
        } else {
          sourceContent = dynamicArticle.content || '';
        }

        // Fallbacks
        const finalTitle = sourceTitle || dynamicArticle.title || '';
        const finalContent = sourceContent || (Array.isArray(dynamicArticle.content) ? dynamicArticle.content.join('\n\n') : dynamicArticle.content || '');

        const res = await translateArticle({
          title: finalTitle,
          excerpt: sourceExcerpt,
          content: finalContent,
          targetLanguage: 'en',
          sourceLanguage: 'si',
        });

        if (res.success) {
          // Preserve the original Sinhala text in titleSi/contentSi so reader can seamlessly toggle back
          const preservedTitleSi =
            dynamicArticle.titleSi || (isSinhalaText(dynamicArticle.title) ? dynamicArticle.title : undefined);
          const preservedContentSi =
            dynamicArticle.contentSi && dynamicArticle.contentSi.length > 0
              ? dynamicArticle.contentSi
              : (Array.isArray(dynamicArticle.content) && dynamicArticle.content.some((c) => isSinhalaText(c))
                  ? dynamicArticle.content
                  : undefined);

          const updated: Article = {
            ...dynamicArticle,
            title: res.translatedTitle || dynamicArticle.title,
            excerpt: res.translatedExcerpt || dynamicArticle.excerpt,
            content: res.translatedContent
              ? res.translatedContent.split('\n\n').filter((p) => p.trim().length > 0)
              : dynamicArticle.content,
            titleSi: preservedTitleSi,
            contentSi: preservedContentSi,
          };
          setDynamicArticle(updated);
          setCurrentArticleLang('en');
          setTranslationToast('✓ Article successfully translated to English (ඉංග්‍රීසි භාෂාවට සාර්ථකව පරිවර්තනය විය)!');
          setTimeout(() => setTranslationToast(null), 3500);
        } else {
          setTranslationToast(res.error || 'Translation to English failed. Please try again.');
          setTimeout(() => setTranslationToast(null), 3500);
        }
      } else {
        // Translating from English to Sinhala
        const sourceTitle = !isSinhalaText(dynamicArticle.title)
          ? dynamicArticle.title
          : dynamicArticle.titleSi || '';
        const sourceExcerpt = dynamicArticle.excerpt || '';
        const sourceContent = Array.isArray(dynamicArticle.content)
          ? dynamicArticle.content.join('\n\n')
          : dynamicArticle.content || '';

        const res = await translateArticle({
          title: sourceTitle,
          excerpt: sourceExcerpt,
          content: sourceContent,
          targetLanguage: 'si',
          sourceLanguage: 'en',
        });

        if (res.success) {
          const updated: Article = {
            ...dynamicArticle,
            titleSi: res.translatedTitle || dynamicArticle.title,
            excerptSi: res.translatedExcerpt || dynamicArticle.excerpt,
            contentSi: res.translatedContent
              ? res.translatedContent.split('\n\n').filter((p) => p.trim().length > 0)
              : dynamicArticle.contentSi || dynamicArticle.content,
          };
          setDynamicArticle(updated);
          setCurrentArticleLang('si');
          setTranslationToast('✓ Article successfully translated into Sinhala (සිංහල භාෂාවට සාර්ථකව පරිවර්තනය විය)!');
          setTimeout(() => setTranslationToast(null), 3500);
        } else {
          setTranslationToast(res.error || 'Translation to Sinhala failed. Please try again.');
          setTimeout(() => setTranslationToast(null), 3500);
        }
      }
    } catch (e: any) {
      setTranslationToast('Translation failed: ' + (e.message || 'Error'));
      setTimeout(() => setTranslationToast(null), 3500);
    } finally {
      setIsArticleTranslating(false);
    }
  };

  const handleToggleArticleLanguage = () => {
    const nextLang = currentArticleLang === 'en' ? 'si' : 'en';
    handleTranslateArticle(nextLang, false);
  };

  const article = dynamicArticle ? getLocalizedArticle(dynamicArticle, currentArticleLang) : null;

  const [comments, setComments] = useState<CommentItem[]>([
    {
      id: 'c1',
      author: language === 'si' ? 'මාකස් වැන්ස්' : 'Marcus Vance',
      date: language === 'si' ? '2017 මැයි 14 පෙ.ව. 10:24' : 'MAY 14, 2017 AT 10:24 AM',
      text:
        language === 'si'
          ? 'ඉතාමත් ගැඹුරු හා විමර්ශනාත්මක ලිපියක්. නූතන මාධ්‍ය කලාව තුළ මෙවන් සමබර කතිකාවන් දැකීම සතුටක්.'
          : 'An exceptionally thorough breakdown. The editorial balance here is exemplary and rare in digital media today.',
    },
    {
      id: 'c2',
      author: language === 'si' ? 'ක්ලෙයාර් ඩෙලක්‍රෝයි' : 'Claire Delacroix',
      date: language === 'si' ? '2017 මැයි 14 ප.ව. 2:15' : 'MAY 14, 2017 AT 2:15 PM',
      text:
        language === 'si'
          ? 'ඡායාරූප පෙළගැස්ම අතිශයින් විශිෂ්ටයි. මෙහි සංස්කෘතික පසුබිම පිළිබඳ තවත් විශේෂාංගයක් බලාපොරොත්තු වෙමි.'
          : 'Remarkable photography as well. Would love to read a follow-up feature examining the regional cultural impacts.',
    },
  ]);
  const [newCommentName, setNewCommentName] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!article) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleLike = () => {
    if (!hasLiked) {
      setLikes((prev) => prev + 1);
      setHasLiked(true);
    } else {
      setLikes((prev) => prev - 1);
      setHasLiked(false);
    }
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentName.trim() || !newCommentText.trim()) return;

    const newComment: CommentItem = {
      id: Date.now().toString(),
      author: newCommentName.trim(),
      date: t.justNow,
      text: newCommentText.trim(),
    };

    setComments((prev) => [newComment, ...prev]);
    setNewCommentName('');
    setNewCommentText('');
  };

  const fontSizeClasses = {
    normal: 'text-[16px] leading-[1.8]',
    large: 'text-[18px] leading-[1.85]',
    xlarge: 'text-[20px] leading-[1.9]',
  };

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      role="dialog"
      aria-modal="true"
      aria-labelledby="article-title"
      className="fixed inset-0 z-50 modal-scroll-container bg-[#120d08]/85 backdrop-blur-sm p-0 sm:py-6 sm:px-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        className={`relative w-full max-w-[840px] mx-auto min-h-full sm:min-h-0 sm:rounded-xs shadow-[0_25px_60px_-15px_rgba(0,0,0,0.5)] border-0 sm:border flex flex-col transition-colors duration-200 ${cfg.containerClass}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle Archival Watermark Emblem Background */}
        <div
          className={`pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden transition-opacity duration-300 ${cfg.watermarkOpacity}`}
        >
          <img
            src="/assets/aistudio/Logo_W2.jpg_741157ec.jpeg"
            alt=""
            aria-hidden="true"
            className="w-[420px] max-w-[85%] object-contain select-none mix-blend-multiply filter contrast-125"
          />
        </div>

        {/* Sticky top control header with background switcher & controls */}
        <div
          className={`sticky top-0 z-20 backdrop-blur-md border-b transition-colors duration-200 ${cfg.headerClass}`}
        >
          <div className="px-3 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-xs font-sans truncate max-w-[42%] sm:max-w-none">
              <img
                src="/assets/aistudio/Logo_W2.jpg_741157ec.jpeg"
                alt="Logo"
                className="w-5 h-5 object-contain mix-blend-multiply rounded-full shrink-0"
              />
              <span className="font-masthead font-extrabold tracking-wider truncate hidden xs:inline">
                {t.siteTitle}
              </span>
              <span className="text-black/40 hidden xs:inline">•</span>
              <span className="uppercase tracking-wider font-black text-black bg-[#facc15] px-2 py-0.5 rounded-xs border border-[#eab308] text-[10px] shrink-0">
                {article.category}
              </span>
            </div>

            <div className="flex items-center space-x-1 sm:space-x-2 shrink-0">
              {/* Reading Background Theme Selector */}
              <div
                className={`flex items-center border rounded-xs p-0.5 gap-0.5 bg-[#faf6ee]/80 ${cfg.borderClass}`}
                title="Reading background texture"
              >
                {(['parchment', 'sepia', 'clean', 'night'] as ReadingBackground[]).map((themeKey) => {
                  const item = BG_CONFIG[themeKey];
                  const isActive = readingBg === themeKey;
                  return (
                    <button
                      key={themeKey}
                      onClick={() => setReadingBg(themeKey)}
                      title={`${item.name} (${language === 'si' ? item.nameSi : 'Reading paper'})`}
                      className={`px-1.5 py-0.5 text-xs rounded-2xs transition-all cursor-pointer flex items-center gap-1 ${
                        isActive
                          ? 'bg-[#facc15] text-black font-black shadow-2xs border border-[#eab308]'
                          : 'hover:bg-black/10 text-black/70'
                      }`}
                    >
                      <span>{item.icon}</span>
                      <span className="text-[10px] font-sans font-bold uppercase hidden md:inline">
                        {item.name.split(' ')[0]}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Font size toggle */}
              <div className={`flex items-center border rounded-xs text-xs overflow-hidden mr-1 bg-[#faf6ee] ${cfg.borderClass}`}>
                <button
                  onClick={() => setFontSize('normal')}
                  className={`px-2 py-1 min-h-[28px] font-bold ${
                    fontSize === 'normal'
                      ? 'bg-[#facc15] text-black font-extrabold'
                      : 'text-black hover:bg-[#efe4cf]'
                  }`}
                  title="Normal font size"
                >
                  A
                </button>
                <button
                  onClick={() => setFontSize('large')}
                  className={`px-2 py-1 text-sm min-h-[28px] font-bold ${
                    fontSize === 'large'
                      ? 'bg-[#facc15] text-black font-extrabold'
                      : 'text-black hover:bg-[#efe4cf]'
                  }`}
                  title="Large font size"
                >
                  A+
                </button>
              </div>

              {/* Share Menu */}
              <div className="relative">
                <button
                  onClick={() => setIsShareMenuOpen((prev) => !prev)}
                  className={`w-8 h-8 flex items-center justify-center rounded-xs transition-colors cursor-pointer ${
                    isShareMenuOpen ? 'bg-black/15 text-black' : 'hover:bg-black/10 text-black'
                  }`}
                  title={t.shareThisStory || t.shareArticle}
                >
                  <Share2 className="w-4 h-4" />
                </button>

                {isShareMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsShareMenuOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 z-50 p-3 bg-white text-black rounded-xs shadow-xl border border-stone-300 w-72 sm:w-80">
                      <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-200">
                        <span className="text-xs font-bold font-sans uppercase tracking-wider text-black">
                          {t.shareThisStory}
                        </span>
                        <button
                          onClick={() => setIsShareMenuOpen(false)}
                          className="text-stone-400 hover:text-stone-700 text-xs font-bold p-1 cursor-pointer"
                        >
                          ✕
                        </button>
                      </div>
                      <SocialShareButtons
                        url={typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}?article=${encodeURIComponent(article.id)}` : ''}
                        title={article.title}
                        summary={article.excerpt}
                        imageUrl={article.imageUrl}
                        language={currentArticleLang}
                        variant="compact"
                        onOpenDesigner={() => {
                          setIsShareMenuOpen(false);
                          setIsPostDesignerOpen(true);
                        }}
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Bookmark */}
              <button
                onClick={() => {
                  if (rawArticle) {
                    const newState = NewsroomStore.toggleBookmark(rawArticle.id);
                    setSaved(newState);
                  }
                }}
                className="w-8 h-8 flex items-center justify-center hover:bg-black/10 rounded-xs transition-colors cursor-pointer"
                title={saved ? 'Remove from Saved Articles' : t.bookmarkArticle}
              >
                <Bookmark
                  className={`w-4 h-4 ${
                    saved ? 'fill-[#facc15] text-[#d97706]' : ''
                  }`}
                />
              </button>

              {/* Print */}
              <button
                onClick={() => window.print()}
                className="w-8 h-8 items-center justify-center hover:bg-black/10 rounded-xs transition-colors hidden sm:flex cursor-pointer"
                title={t.printArticle}
              >
                <Printer className="w-4 h-4" />
              </button>

              {/* Language Switcher & Gemini AI Auto-Translate */}
              <div className="flex items-center gap-1.5">
                <div className="flex items-center border border-[#dfcead] rounded-xs overflow-hidden bg-[#faf6ee] text-[10px] font-sans font-bold shadow-2xs">
                  <button
                    type="button"
                    onClick={() => handleTranslateArticle('en')}
                    disabled={isArticleTranslating}
                    className={`px-2 py-1 transition-colors cursor-pointer ${
                      currentArticleLang === 'en'
                        ? 'bg-black text-white font-black'
                        : 'text-black/75 hover:bg-[#fef08a] hover:text-black'
                    }`}
                    title="Read article in English (Auto-translate if only Sinhala is available)"
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    onClick={() => handleTranslateArticle('si')}
                    disabled={isArticleTranslating}
                    className={`px-2 py-1 transition-colors cursor-pointer ${
                      currentArticleLang === 'si'
                        ? 'bg-[#991b1b] text-white font-black'
                        : 'text-black/75 hover:bg-[#fef08a] hover:text-black'
                    }`}
                    title="ලිපිය සිංහලෙන් කියවන්න (අවශ්‍ය නම් ඉංග්‍රීසියෙන් පරිවර්තනය කරයි)"
                  >
                    සිංහල
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => handleTranslateArticle(currentArticleLang === 'en' ? 'si' : 'en', true)}
                  disabled={isArticleTranslating}
                  className="flex items-center gap-1 bg-[#fef08a] hover:bg-[#fde047] text-stone-950 text-[10px] font-sans font-black uppercase px-2 py-1 rounded-xs border border-[#ca8a04] shadow-2xs transition-all cursor-pointer min-h-[26px] active:scale-95 disabled:opacity-60"
                  title={
                    currentArticleLang === 'en'
                      ? '✨ Gemini AI: Auto-translate this article to Sinhala (සිංහලට පරිවර්තනය කරන්න)'
                      : '✨ Gemini AI: Auto-translate this article to English (ඉංග්‍රීසි භාෂාවට පරිවර්තනය කරන්න)'
                  }
                >
                  {isArticleTranslating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-900" />
                      <span className="text-[10px]">AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-900" />
                      <span className="hidden sm:inline">
                        {currentArticleLang === 'en' ? 'Translate to SI' : 'Translate to EN'}
                      </span>
                      <span className="sm:hidden">
                        {currentArticleLang === 'en' ? 'SI' : 'EN'}
                      </span>
                    </>
                  )}
                </button>
              </div>

              {/* Close */}
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center hover:bg-black hover:text-white rounded-xs transition-colors ml-1 cursor-pointer"
                title={`${t.closeModal} (Esc)`}
                aria-label={t.closeModal}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Translation toast alert */}
          {translationToast && (
            <div className="w-full bg-[#fef08a] border-b border-[#eab308] px-4 py-1.5 text-xs text-black font-sans font-bold flex items-center justify-between animate-in fade-in">
              <span className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-amber-800" />
                <span>{translationToast}</span>
              </span>
              <button
                type="button"
                onClick={() => setTranslationToast(null)}
                className="text-black/70 hover:text-black font-bold text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Reading Scroll Progress Indicator */}
          <div className="w-full h-1 bg-black/10 relative overflow-hidden" title={`Reading Progress: ${scrollProgress}%`}>
            <div
              className="h-full bg-[#facc15] transition-[width] duration-75 ease-out"
              style={{ width: `${scrollProgress}%` }}
              role="progressbar"
              aria-valuenow={scrollProgress}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
        </div>

        {/* Article Body Content */}
        <div className="relative z-1 px-4 sm:px-10 md:px-12 pt-6 sm:pt-8 pb-14 flex-1">
          {/* Decorative Broadsheet Rule */}
          <div className="w-full flex flex-col mb-4">
            <div className="w-full h-[2px] bg-[#facc15]" />
            <div className={`w-full border-t mt-[1px] ${cfg.borderClass}`} />
          </div>

          {/* Category & Date */}
          <div className={`flex items-center space-x-2 text-[11px] uppercase tracking-wider font-sans font-medium mb-3 ${cfg.subtextColor}`}>
            <span className="font-bold">
              {article.category}
              {article.categorySecondary ? ` / ${article.categorySecondary}` : ''}
            </span>
            <span>•</span>
            <span>{article.date}</span>
            {article.readTime && (
              <>
                <span>•</span>
                <span>{article.readTime}</span>
              </>
            )}
          </div>

          {/* Headline */}
          <h1
            id="article-title"
            className="font-headline font-bold text-2xl sm:text-3xl md:text-4xl leading-[1.25] mb-4 text-wrap-balance"
          >
            {article.title}
          </h1>

          {/* Bidirectional Auto-Translation Banner */}
          <div className={`flex flex-wrap items-center justify-between gap-2.5 px-3 py-2 mb-5 rounded-xs border text-xs font-sans shadow-2xs ${
            currentArticleLang === 'si'
              ? 'bg-amber-100/60 border-amber-300 text-stone-900'
              : 'bg-stone-100/70 border-stone-300 text-stone-900'
          }`}>
            <div className="flex items-center gap-2">
              <Languages className="w-4 h-4 text-amber-800 shrink-0" />
              <span className="font-medium text-[11.5px]">
                {currentArticleLang === 'si' ? (
                  <span>
                    මෙම ලිපිය <strong>සිංහල</strong> භාෂාවෙන් පෙන්වයි.
                  </span>
                ) : (
                  <span>
                    Reading this dispatch in <strong>English</strong>.
                  </span>
                )}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {currentArticleLang === 'si' ? (
                <button
                  type="button"
                  disabled={isArticleTranslating}
                  onClick={() => handleTranslateArticle('en', true)}
                  className="px-3 py-1 bg-stone-900 hover:bg-black text-white text-[11px] font-bold rounded-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-60"
                  title="Translate Sinhala article to English using Gemini AI"
                >
                  {isArticleTranslating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                      <span>පරිවර්තනය වෙමින් පවතී...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>✨ Auto-Translate to English (ඉංග්‍රීසි භාෂාවට)</span>
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={isArticleTranslating}
                  onClick={() => handleTranslateArticle('si', true)}
                  className="px-3 py-1 bg-[#991b1b] hover:bg-[#7f1d1d] text-white text-[11px] font-bold rounded-xs flex items-center gap-1.5 transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-60"
                  title="Translate English article to Sinhala using Gemini AI"
                >
                  {isArticleTranslating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-300" />
                      <span>Translating to Sinhala...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                      <span>✨ Auto-Translate to Sinhala (සිංහලට පරිවර්තනය කරන්න)</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Byline */}
          <div className={`flex items-center justify-between pb-4 mb-6 border-b text-xs font-sans ${cfg.borderClass}`}>
            <div className="flex items-center space-x-3">
              <div className={`w-8 h-8 rounded-full font-serif flex items-center justify-center font-bold text-xs uppercase shadow-2xs ${cfg.bylineBadge}`}>
                {article.author.slice(0, 2)}
              </div>
              <div>
                <span className="font-semibold uppercase tracking-wide block">
                  {t.byAuthor} {article.author}
                </span>
                <span className={`block text-[11px] font-medium ${cfg.subtextColor}`}>
                  {language === 'si'
                    ? 'ප්‍රධාන විශේෂාංග ලේඛක'
                    : 'Staff Editorial Correspondent'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={handleLike}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-xs text-xs border transition-colors cursor-pointer ${
                  hasLiked
                    ? 'bg-[#facc15] text-black font-black border-[#eab308]'
                    : `hover:opacity-80 ${cfg.borderClass}`
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5" />
                <span>{likes}</span>
              </button>
            </div>
          </div>

          {/* Top Article Social Share Bar */}
          <div className={`mt-4 mb-6 py-2.5 px-3 rounded-xs border ${cfg.cardBg} ${cfg.borderClass}`}>
            <SocialShareButtons
              url={typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}?article=${encodeURIComponent(article.id)}` : ''}
              title={article.title}
              summary={article.excerpt}
              imageUrl={article.imageUrl}
              language={currentArticleLang}
              variant="bar"
              onOpenDesigner={() => setIsPostDesignerOpen(true)}
            />
          </div>

          {/* Lead Image Linked */}
          {article.imageUrl && (
            <figure className="mb-8">
              <a
                href={article.imageUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (onOpenImageLightbox) {
                    e.preventDefault();
                    onOpenImageLightbox(
                      article.imageUrl!,
                      article.title,
                      article.imageCaption
                    );
                  }
                }}
                title={t.viewHighRes}
                className={`relative overflow-hidden block aspect-[16/10] group/artImg border transition-all cursor-zoom-in ${cfg.borderClass} hover:border-[#eab308]`}
              >
                <img
                  src={article.imageUrl}
                  alt={article.title}
                  className="w-full h-full object-cover filter contrast-105 group-hover/artImg:scale-102 transition-transform duration-300"
                />
                <div className="absolute bottom-3 right-3 bg-[#facc15] hover:bg-[#ffd200] text-black text-[10px] font-sans font-bold px-2.5 py-1 rounded-xs flex items-center gap-1.5 shadow-sm border border-[#eab308]">
                  <Maximize2 className="w-3 h-3 text-black" />
                  <span>{t.viewHighRes}</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setIsPostDesignerOpen(true);
                  }}
                  className="absolute bottom-3 left-3 bg-[#1c1712]/90 hover:bg-black text-[#facc15] text-[10px] font-sans font-bold px-2.5 py-1 rounded-xs flex items-center gap-1.5 shadow-sm border border-[#facc15]/40 backdrop-blur-xs transition-colors cursor-pointer"
                  title="Design and share social media post with this hero image"
                >
                  <Sparkles className="w-3 h-3 text-[#facc15]" />
                  <span>{t.designPostCard}</span>
                </button>
              </a>
              {article.imageCaption && (
                <figcaption className={`mt-2 text-xs font-serif italic text-center font-medium ${cfg.subtextColor}`}>
                  {article.imageCaption}
                </figcaption>
              )}
            </figure>
          )}

          {/* Paragraphs with drop cap */}
          <div
            className={`font-editorial space-y-5 ${fontSizeClasses[fontSize]}`}
          >
            {article.content.map((paragraph, index) => (
              <p
                key={index}
                className={index === 0 && language === 'en' ? 'first-letter-drop' : ''}
              >
                {paragraph}
              </p>
            ))}
          </div>

          {/* Bottom Article Social Sharing Card */}
          <div className="mt-8 mb-6">
            <SocialShareButtons
              url={typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}?article=${encodeURIComponent(article.id)}` : ''}
              title={article.title}
              summary={article.excerpt}
              imageUrl={article.imageUrl}
              language={currentArticleLang}
              variant="expanded"
              onOpenDesigner={() => setIsPostDesignerOpen(true)}
            />
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className={`mt-8 pt-6 border-t ${cfg.borderClass}`}>
              <span className="text-xs uppercase tracking-wider font-bold font-sans mr-3">
                {t.filedUnder}
              </span>
              <div className="inline-flex flex-wrap gap-2 mt-2 sm:mt-0">
                {article.tags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => {
                      if (onSelectTag) onSelectTag(tag);
                      onClose();
                    }}
                    className={`text-xs font-sans px-2.5 py-1 font-bold rounded-xs transition-colors cursor-pointer border ${cfg.cardBg} hover:opacity-80`}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Comments Section */}
          <section className={`mt-12 pt-8 border-t-2 ${cfg.borderClass}`}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-headline italic text-xl font-bold">
                {t.readerDiscussion} ({comments.length})
              </h3>
            </div>

            {/* Comment Form */}
            <form onSubmit={handleAddComment} className={`mb-8 p-5 rounded-xs border shadow-xs ${cfg.cardBg}`}>
              <h4 className="text-xs uppercase tracking-wider font-bold font-sans mb-3">
                {t.joinConversation}
              </h4>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder={t.yourNamePlaceholder}
                  value={newCommentName}
                  onChange={(e) => setNewCommentName(e.target.value)}
                  required
                  className={`w-full text-xs font-sans px-3 py-2 border focus:outline-none focus:border-[#eab308] ${cfg.inputBg}`}
                />
                <textarea
                  rows={3}
                  placeholder={t.commentPlaceholder}
                  value={newCommentText}
                  onChange={(e) => setNewCommentText(e.target.value)}
                  required
                  className={`w-full text-xs font-sans px-3 py-2 border focus:outline-none focus:border-[#eab308] ${cfg.inputBg}`}
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#facc15] hover:bg-[#ffd200] text-black text-[11px] font-black tracking-wider uppercase font-sans cursor-pointer transition-colors shadow-xs border border-[#eab308]"
                >
                  {t.postCommentButton}
                </button>
              </div>
            </form>

            {/* Comment List */}
            <div className="space-y-4">
              {comments.map((c) => (
                <div key={c.id} className={`p-3 border-b text-xs ${cfg.borderClass}`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold font-sans uppercase">
                      {c.author}
                    </span>
                    <span className={`text-[10px] font-mono ${cfg.subtextColor}`}>
                      {c.date}
                    </span>
                  </div>
                  <p className={`font-serif leading-relaxed ${cfg.textColor}`}>
                    {c.text}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* Dedicated High-Visibility Scrollbar Track & Thumb (Guaranteed visible on mobile and desktop) */}
      <div
        ref={scrollTrackRef}
        onClick={handleTrackClick}
        title={`Article Scrollbar (${scrollProgress}%)`}
        aria-label="Article Scrollbar Track"
        className="fixed right-1 sm:right-2 top-14 bottom-16 w-3 sm:w-3.5 z-50 bg-[#1b1712]/85 hover:bg-[#1b1712] backdrop-blur-md rounded-full border border-[#facc15]/50 shadow-2xl relative cursor-pointer touch-none select-none transition-all group"
      >
        {/* Scrollbar Thumb */}
        <div
          onPointerDown={handleThumbPointerDown}
          onPointerMove={handleThumbPointerMove}
          onPointerUp={handleThumbPointerUp}
          onPointerCancel={handleThumbPointerUp}
          style={{
            top: `${Math.min(76, Math.max(0, scrollProgress * 0.76))}%`,
            height: '24%',
            minHeight: '40px',
          }}
          className={`absolute left-0.5 right-0.5 rounded-full transition-colors cursor-grab active:cursor-grabbing border border-[#1b1712] shadow-md ${
            isDraggingThumb ? 'bg-[#ffd700] ring-2 ring-[#facc15]' : 'bg-[#facc15] hover:bg-[#ffd700]'
          }`}
        >
          {/* Grip lines */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 pointer-events-none opacity-80">
            <span className="w-1.5 h-0.5 bg-black/70 rounded-full" />
            <span className="w-1.5 h-0.5 bg-black/70 rounded-full" />
            <span className="w-1.5 h-0.5 bg-black/70 rounded-full" />
          </div>

          {/* Reading Progress Percentage Tooltip */}
          <div className="absolute right-5 top-1/2 -translate-y-1/2 bg-[#1b1712] text-[#facc15] font-mono text-[9px] font-bold px-1.5 py-0.5 rounded-xs border border-[#facc15]/40 shadow-xl whitespace-nowrap pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
            {scrollProgress}%
          </div>
        </div>
      </div>

      {/* Floating Scroll to Top button for mobile reading comfort */}
      {scrollProgress > 8 && (
        <button
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 z-40 bg-[#facc15] text-black hover:bg-[#ffd700] px-3 py-2 rounded-full shadow-2xl border-2 border-black/30 flex items-center gap-1.5 text-xs font-sans font-black cursor-pointer active:scale-95 transition-all"
        >
          <ChevronUp className="w-4 h-4" />
          <span className="text-[10px] font-mono tracking-wider">{scrollProgress}%</span>
        </button>
      )}
      {/* Social Media Post Designer Modal */}
      {isPostDesignerOpen && (
        <SocialPostDesignerModal
          isOpen={isPostDesignerOpen}
          onClose={() => setIsPostDesignerOpen(false)}
          article={dynamicArticle || article}
          language={currentArticleLang}
        />
      )}
    </div>
  );
};
