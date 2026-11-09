import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  LATEST_ARTICLES_TITLES,
  RECOMMENDED_BOOKS,
  TOP_SEARCHES_TAGS,
  Article,
  getLocalizedArticle,
  getLocalizedBook,
} from '../data/newspaperData';
import {
  Language,
  TRANSLATIONS,
  LATEST_ARTICLES_TITLES_SI,
} from '../data/translations';

interface LeftSidebarProps {
  popularArticles: Article[];
  latestArticles?: Article[];
  latestAreaTitle?: string;
  popularAreaTitle?: string;
  language: Language;
  onSelectArticle: (article: Article) => void;
  onSelectTitle: (title: string) => void;
  onSelectTag: (tag: string) => void;
  onOpenImage?: (imageUrl: string, title: string, caption?: string) => void;
}

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  popularArticles,
  latestArticles,
  latestAreaTitle,
  popularAreaTitle,
  language,
  onSelectArticle,
  onSelectTitle,
  onSelectTag,
  onOpenImage,
}) => {
  const [recommendedIndex, setRecommendedIndex] = useState(0);
  const t = TRANSLATIONS[language];

  const rawBook = RECOMMENDED_BOOKS[recommendedIndex];
  const currentBook = getLocalizedBook(rawBook, language);

  const fallbackTitles =
    language === 'si' ? LATEST_ARTICLES_TITLES_SI : LATEST_ARTICLES_TITLES;

  const handlePrevBook = () => {
    setRecommendedIndex((prev) =>
      prev === 0 ? RECOMMENDED_BOOKS.length - 1 : prev - 1
    );
  };

  const handleNextBook = () => {
    setRecommendedIndex((prev) =>
      prev === 0 ? RECOMMENDED_BOOKS.length - 1 : prev + 1
    );
  };

  return (
    <aside className="w-full flex flex-col space-y-7 pb-6 select-none border-b lg:border-b-0 lg:border-r border-[#e5d8c3] lg:pr-6">
      {/* Latest Articles */}
      <section>
        <div className="border-b border-[#dfd0ba] pb-1 mb-3">
          <h3 className="text-[12px] font-bold tracking-[0.06em] text-black uppercase font-sans flex items-center justify-between">
            <span>{latestAreaTitle || t.latestArticlesTitle}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-[#facc15] shadow-[0_0_8px_#fde047] animate-pulse" />
          </h3>
        </div>

        <ul className="space-y-2.5 text-[13px] leading-[1.35] text-black">
          {latestArticles && latestArticles.length > 0 ? (
            latestArticles.map((rawArt, idx) => {
              const art = getLocalizedArticle(rawArt, language);
              return (
                <li key={art.id || idx} className="flex items-start group">
                  <span className="text-black mr-2 text-[12px] leading-tight select-none font-bold">
                    •
                  </span>
                  <button
                    onClick={() => onSelectArticle(rawArt)}
                    className="text-left font-serif text-[12.5px] leading-snug text-black hover:underline underline-offset-2 transition-colors cursor-pointer"
                  >
                    {art.title}
                  </button>
                </li>
              );
            })
          ) : (
            fallbackTitles.map((title, idx) => (
              <li key={idx} className="flex items-start group">
                <span className="text-black mr-2 text-[12px] leading-tight select-none font-bold">
                  •
                </span>
                <button
                  onClick={() => onSelectTitle(title)}
                  className="text-left font-serif text-[12.5px] leading-snug text-black hover:underline underline-offset-2 transition-colors cursor-pointer"
                >
                  {title}
                </button>
              </li>
            ))
          )}
        </ul>
      </section>

      {/* Recommended Carousel */}
      <section className="pt-2 border-t border-[#e5d8c3]">
        <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#dfd0ba]">
          <h3 className="text-[12px] font-bold tracking-[0.06em] text-black uppercase font-sans">
            {t.recommendedTitle}
          </h3>
          <div className="flex items-center space-x-1 text-black">
            <button
              onClick={handlePrevBook}
              aria-label="Previous recommended item"
              className="hover:opacity-70 transition-opacity p-0.5 cursor-pointer text-black"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="text-[10px] text-black">/</span>
            <button
              onClick={handleNextBook}
              aria-label="Next recommended item"
              className="hover:opacity-70 transition-opacity p-0.5 cursor-pointer text-black"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="group">
          {/* Linked Image */}
          <div className="relative overflow-hidden block bg-[#f4ebdc] aspect-[4/3] mb-2.5 border border-[#dfd0ba] hover:border-[#eab308] transition-colors">
            <a
              href={`#recommended-${currentBook.id}`}
              onClick={(e) => {
                e.preventDefault();
                onSelectTitle(currentBook.title);
              }}
              title={`View story: ${currentBook.title}`}
              className="block w-full h-full cursor-pointer"
            >
              <img
                src={currentBook.imageUrl}
                alt={currentBook.title}
                onError={(e) => {
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=400&q=80';
                }}
                className="w-full h-full object-cover filter grayscale contrast-110 group-hover:filter-none group-hover:scale-103 transition-all duration-300"
              />
            </a>
            <div className="absolute top-2 right-2 flex items-center space-x-1">
              {onOpenImage && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onOpenImage(currentBook.imageUrl, currentBook.title);
                  }}
                  title={t.zoomImage}
                  className="bg-black text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-xs transition-colors cursor-pointer"
                >
                  {t.zoomImage}
                </button>
              )}
              <span
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onSelectTitle(currentBook.title);
                }}
                className="bg-[#facc15] hover:bg-[#ffd200] text-black text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-xs transition-colors cursor-pointer shadow-xs border border-[#eab308]"
              >
                {t.viewStory}
              </span>
            </div>
          </div>
          <h4
            onClick={() => onSelectTitle(currentBook.title)}
            className="font-serif font-bold text-[13.5px] leading-tight text-black hover:underline underline-offset-2 cursor-pointer transition-colors"
          >
            {currentBook.title}
          </h4>
        </div>
      </section>

      {/* Most Popular */}
      <section className="pt-2 border-t border-[#e5d8c3]">
        <div className="border-b border-[#dfd0ba] pb-1 mb-4">
          <h3 className="text-[12px] font-bold tracking-[0.06em] text-black uppercase font-sans">
            {t.mostPopularTitle}
          </h3>
        </div>

        <div className="space-y-4">
          {popularArticles.slice(0, 5).map((rawArticle, idx) => {
            const article = getLocalizedArticle(rawArticle, language);
            const rank = idx + 1;
            return (
              <div
                key={article.id}
                onClick={() => onSelectArticle(article)}
                className="flex items-start gap-3 group cursor-pointer"
              >
                {/* Large Serif Rank Number */}
                <div className="font-serif italic font-black text-3xl sm:text-4xl text-black leading-none w-7 shrink-0 pt-0.5 select-none transition-colors">
                  {rank}
                </div>
                {/* Title */}
                <h4 className="font-serif text-[13px] leading-[1.3] text-black group-hover:underline underline-offset-2 transition-colors">
                  {article.title}
                </h4>
              </div>
            );
          })}
        </div>
      </section>

      {/* Top Searches Tag Cloud */}
      <section className="pt-2 border-t border-[#e5d8c3]">
        <div className="border-b border-[#dfd0ba] pb-1 mb-3">
          <h3 className="text-[12px] font-bold tracking-[0.06em] text-black uppercase font-sans">
            {t.topSearchesTitle}
          </h3>
        </div>

        <div className="flex flex-wrap items-baseline gap-x-2.5 gap-y-2 leading-relaxed">
          {TOP_SEARCHES_TAGS.map((tag, idx) => {
            const isFeaturedTag = idx === 1 || idx === 3 || idx === 7;
            const displayText =
              language === 'si' && tag.textSi ? tag.textSi : tag.text;
            return (
              <button
                key={idx}
                onClick={() => onSelectTag(tag.text)}
                className={`${tag.style} !text-black ${
                  isFeaturedTag
                    ? 'bg-[#fef9c3] border border-[#fde047] px-1.5 py-0.5 rounded-xs !text-black font-bold hover:bg-[#fde047]'
                    : ''
                } hover:underline cursor-pointer transition-colors`}
              >
                {displayText}
              </button>
            );
          })}
        </div>
      </section>
    </aside>
  );
};
