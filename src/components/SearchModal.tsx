import React, { useState, useEffect, useRef } from 'react';
import { Search, X, ArrowRight } from 'lucide-react';
import { Article, getLocalizedArticle } from '../data/newspaperData';
import { Language, TRANSLATIONS } from '../data/translations';

interface SearchModalProps {
  isOpen: boolean;
  language: Language;
  onClose: () => void;
  articles: Article[];
  onSelectArticle: (article: Article) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  language,
  onClose,
  articles,
  onSelectArticle,
}) => {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const t = TRANSLATIONS[language];

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filtered = query.trim()
    ? articles
        .map((a) => getLocalizedArticle(a, language))
        .filter((a) => {
          const q = query.toLowerCase();
          return (
            a.title.toLowerCase().includes(q) ||
            a.excerpt.toLowerCase().includes(q) ||
            a.category.toLowerCase().includes(q) ||
            (a.tags && a.tags.some((t) => t.toLowerCase().includes(q)))
          );
        })
    : [];

  const suggestedTerms =
    language === 'si'
      ? ['මංගලෝත්සව', 'පාපන්දු', 'අධ්‍යාපනය', 'මෙට්‍රෝ කාඩ්', 'මෙට් කෞතුකාගාරය', 'කඳු තරණය']
      : ['Wedding', 'Football', 'Education', 'MetroCard', 'Met Museum', 'Rock Climbing'];

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
      className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-start justify-center pt-4 sm:pt-16 px-3 sm:px-4"
    >
      <div
        className="w-full max-w-[640px] bg-[#faf6ee] text-black shadow-2xl border border-[#d8c7a8] overflow-hidden rounded-xs"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-3.5 sm:px-4 py-3 bg-[#f4ebdc] border-b border-[#dfcead]">
          <Search className="w-5 h-5 text-black mr-2.5 sm:mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            className="w-full text-base sm:text-sm font-sans focus:outline-none placeholder:text-[#555555] text-black bg-transparent"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1.5 text-black hover:opacity-75 cursor-pointer min-w-[32px] min-h-[32px] flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="ml-2 px-2 py-1 text-xs uppercase tracking-wider text-black font-bold hover:underline font-sans cursor-pointer"
          >
            ESC
          </button>
        </div>

        {/* Results */}
        <div className="max-h-[380px] overflow-y-auto p-4 bg-[#faf6ee]">
          {query.trim() === '' ? (
            <div className="py-6 text-center text-xs text-black font-sans">
              <span className="font-bold block text-black mb-1">
                {t.suggestedSearches}
              </span>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {suggestedTerms.map((term) => (
                  <button
                    key={term}
                    onClick={() => setQuery(term)}
                    className="px-2.5 py-1 bg-[#f4ebd9] hover:bg-[#e8d8be] text-black font-bold rounded-xs transition-colors cursor-pointer border border-[#dfcead]"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center text-sm text-black font-serif">
              “{query}” {t.noArticlesFound}.
            </div>
          ) : (
            <div className="space-y-3">
              <div className="text-[11px] font-bold uppercase tracking-wider text-black font-sans mb-1">
                {t.foundArticles} {filtered.length} {filtered.length === 1 ? t.articleSingular : t.articlePlural}
              </div>
              {filtered.map((article) => (
                <div
                  key={article.id}
                  onClick={() => {
                    onSelectArticle(article);
                    onClose();
                  }}
                  className="p-3 border border-[#dfcead]/80 hover:border-[#facc15] hover:bg-[#fbf4e8] rounded cursor-pointer transition-all flex items-start justify-between group"
                >
                  <div className="pr-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-black font-sans">
                      {article.category} • {article.date}
                    </span>
                    <h4 className="font-headline font-bold text-sm text-black group-hover:underline">
                      {article.title}
                    </h4>
                    <p className="font-serif text-xs text-black line-clamp-1 mt-0.5">
                      {article.excerpt}
                    </p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-black shrink-0 mt-1 transition-transform group-hover:translate-x-1" />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
