import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Article, getLocalizedArticle } from '../data/newspaperData';
import { Language, TRANSLATIONS } from '../data/translations';

interface DailyFeedProps {
  articles: Article[];
  areaTitle?: string;
  itemsPerPage?: number;
  language: Language;
  onSelectArticle: (article: Article) => void;
  onViewMore: () => void;
}

export const DailyFeed: React.FC<DailyFeedProps> = ({
  articles,
  areaTitle,
  itemsPerPage = 4,
  language,
  onSelectArticle,
  onViewMore,
}) => {
  const [page, setPage] = useState(0);
  const pageSize = itemsPerPage;
  const t = TRANSLATIONS[language];

  const totalPages = Math.max(1, Math.ceil(articles.length / pageSize));
  const currentFeed = articles.slice(page * pageSize, (page + 1) * pageSize);

  const handlePrev = () => {
    setPage((prev) => (prev === 0 ? totalPages - 1 : prev - 1));
  };

  const handleNext = () => {
    setPage((prev) => (prev === totalPages - 1 ? 0 : prev + 1));
  };

  return (
    <div className="w-full pb-6 select-none">
      {/* Column Header */}
      <div className="border-b border-[#dfd0ba] pb-2 mb-4">
        <h2 className="font-headline italic text-2xl sm:text-[26px] font-bold text-black leading-none">
          {areaTitle || t.dailyFeedTitle}
        </h2>
      </div>

      {/* Feed Items */}
      <div className="space-y-4">
        {currentFeed.map((rawItem, idx) => {
          const item = getLocalizedArticle(rawItem, language);
          return (
            <article
              key={item.id}
              className={`group cursor-pointer ${
                idx > 0 ? 'pt-4 border-t border-[#e5d8c3]' : ''
              }`}
              onClick={() => onSelectArticle(item)}
            >
              {/* Category tag */}
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#facc15]" />
                <span className="text-[10px] uppercase tracking-wider text-black font-sans font-bold bg-[#fef9c3] px-1.5 py-0.2 rounded-xs border border-[#fde047]">
                  {t.inCategory} {item.category}
                  {item.categorySecondary ? `, ${item.categorySecondary}` : ''}
                </span>
              </div>

              {/* Headline */}
              <h3 className="font-headline font-bold text-[16px] leading-[1.28] text-black group-hover:underline transition-colors mb-1.5">
                {item.title}
              </h3>

              {/* Excerpt */}
              <p className="font-serif text-[12.5px] leading-relaxed text-black line-clamp-3">
                {item.excerpt}
              </p>
            </article>
          );
        })}
      </div>

      {/* View More Posts footer bar with arrows */}
      <div className="mt-6 pt-3 border-t border-[#dfd0ba] flex items-center justify-between">
        <button
          onClick={onViewMore}
          className="text-[11px] font-bold tracking-[0.08em] uppercase text-black hover:underline underline-offset-2 cursor-pointer transition-colors"
        >
          {t.viewMorePosts}
        </button>

        <div className="flex items-center space-x-1.5 text-black">
          <button
            onClick={handlePrev}
            aria-label="Previous daily feed posts"
            className="hover:opacity-75 transition-opacity p-0.5 cursor-pointer text-black"
            title="Previous feed page"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] text-black">/</span>
          <button
            onClick={handleNext}
            aria-label="Next daily feed posts"
            className="hover:opacity-75 transition-opacity p-0.5 cursor-pointer text-black"
            title="Next feed page"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
