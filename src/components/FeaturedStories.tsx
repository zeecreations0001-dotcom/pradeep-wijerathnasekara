import React, { useState } from 'react';
import { Article, getLocalizedArticle } from '../data/newspaperData';
import { CheckCircle2 } from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';
import { SocialShareButtons } from './SocialShareButtons';

interface FeaturedStoriesProps {
  articles: Article[];
  curatedArticles?: Article[];
  areaTitle?: string;
  language: Language;
  onSelectArticle: (article: Article) => void;
  onViewMore: () => void;
  onOpenLightbox?: (imageUrl: string, title: string, caption?: string) => void;
}

export const FeaturedStories: React.FC<FeaturedStoriesProps> = ({
  articles,
  curatedArticles,
  areaTitle,
  language,
  onSelectArticle,
  onViewMore,
  onOpenLightbox,
}) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const t = TRANSLATIONS[language];

  const featured =
    curatedArticles && curatedArticles.length > 0
      ? curatedArticles.slice(0, 6)
      : articles.filter((a) => a.isFeatured).slice(0, 6);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim() && email.includes('@')) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 4000);
    }
  };

  return (
    <section className="w-full pt-8 pb-10">
      {/* Top Section Border */}
      <div className="w-full flex flex-col mb-6">
        <div className="w-full h-[2px] bg-[#facc15]" />
        <div className="w-full border-t border-[#2b2014] mt-[1px]" />
      </div>

      {/* Section Title */}
      <div className="mb-6 flex items-center justify-between">
        <h2 className="font-headline italic text-2xl sm:text-[28px] font-bold text-black leading-none flex items-center gap-2">
          <span>{t.featuredStoriesTitle}</span>
          <span className="w-2 h-2 rounded-full bg-[#facc15]" />
        </h2>
        <div className="hidden sm:block h-[1px] flex-1 ml-6 bg-[#dfd0ba]" />
      </div>

      {/* 3-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-9">
        {featured.map((rawStory) => {
          const story = getLocalizedArticle(rawStory, language);
          return (
            <article
              key={story.id}
              onClick={() => onSelectArticle(story)}
              className="group flex flex-col cursor-pointer"
            >
              {/* Story Image Linked */}
              {story.imageUrl && (
                <div className="relative overflow-hidden block bg-[#f4ebdc] aspect-[16/10] mb-3 group/storyImg border border-[#dfd0ba] hover:border-[#eab308] transition-all cursor-pointer">
                  <a
                    href={`#featured-${story.id}`}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onSelectArticle(story);
                    }}
                    title={story.title}
                    className="block w-full h-full"
                  >
                    <img
                      src={story.imageUrl}
                      alt={story.title}
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=800&q=80';
                      }}
                      className="w-full h-full object-cover filter grayscale contrast-110 sepia-20 group-hover:filter-none group-hover/storyImg:scale-103 transition-all duration-300"
                    />
                  </a>

                  {/* Direct Action Badges */}
                  <div className="absolute top-2 right-2 flex items-center space-x-1.5">
                    {onOpenLightbox && (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          onOpenLightbox(
                            story.imageUrl!,
                            story.title,
                            story.imageCaption
                          );
                        }}
                        title={t.zoomImage}
                        className="bg-black text-white text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-xs transition-colors cursor-pointer shadow-xs"
                      >
                        {t.zoomImage}
                      </button>
                    )}
                    <span
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        onSelectArticle(story);
                      }}
                      className="bg-[#facc15] hover:bg-[#ffd200] text-black text-[9.5px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-xs transition-colors opacity-95 group-hover/storyImg:opacity-100 flex items-center gap-1 cursor-pointer shadow-xs border border-[#eab308]"
                    >
                      {t.viewStory}
                    </span>
                  </div>
                </div>
              )}

              {/* Meta */}
              <div className="flex items-center space-x-2 text-[10.5px] uppercase tracking-wider text-black font-sans font-medium mb-1.5">
                <span className="text-black">{story.date}</span>
                <span className="text-black">/</span>
                <span className="text-black font-extrabold bg-[#fef08a]/60 px-1 rounded-xs">
                  {story.category}
                  {story.categorySecondary ? `, ${story.categorySecondary}` : ''}
                </span>
              </div>

              {/* Title */}
              <h3 className="font-headline font-bold text-[17px] sm:text-[18px] leading-[1.25] text-black group-hover:underline transition-colors mb-2">
                {story.title}
              </h3>

              {/* Excerpt */}
              <p className="font-serif text-[12.5px] leading-relaxed text-black mb-3">
                {story.excerpt}
              </p>

              {/* Direct Card Social Share Toolbar */}
              <div 
                onClick={(e) => e.stopPropagation()} 
                className="mt-auto pt-2 border-t border-[#dfd0ba]/70"
              >
                <SocialShareButtons
                  url={typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}?article=${encodeURIComponent(story.id)}` : ''}
                  title={story.title}
                  summary={story.excerpt}
                  imageUrl={story.imageUrl}
                  language={language}
                  variant="compact"
                  onOpenDesigner={() => onSelectArticle(story)}
                />
              </div>
            </article>
          );
        })}
      </div>

      {/* View More Posts Bar */}
      <div className="mt-8 pt-4 border-t border-[#dfd0ba]">
        <button
          onClick={onViewMore}
          className="text-[11px] font-bold tracking-[0.08em] uppercase text-black hover:underline underline-offset-2 cursor-pointer transition-colors"
        >
          {t.viewMorePosts}
        </button>
      </div>

      {/* Spotlight Newsletter Box with Warm Brownish Parchment & Bright Yellow Accent */}
      <div className="mt-10 py-7 px-6 bg-[#f4ebd9] border border-[#d8c7a8] rounded-xs shadow-xs max-w-[560px] mx-auto text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#facc15]" />
        <h4 className="font-serif italic text-[16px] sm:text-[17px] text-black mb-2 font-bold">
          {t.newsletterTitle}
        </h4>
        <p className="text-[11.5px] font-sans text-black mb-4 font-medium">
          {t.newsletterSubtitle}
        </p>

        {subscribed ? (
          <div className="flex items-center justify-center gap-2 text-black bg-[#fbf2dd] px-5 py-2.5 border border-[#dfcead] text-xs font-sans font-bold">
            <CheckCircle2 className="w-4 h-4 text-black" />
            <span>{t.newsletterSuccess}</span>
          </div>
        ) : (
          <form
            onSubmit={handleSubscribe}
            className="flex flex-col sm:flex-row items-center w-full max-w-[460px] mx-auto gap-2 sm:gap-0"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.newsletterPlaceholder}
              required
              className="w-full sm:flex-1 h-10 sm:h-9 px-3.5 text-base sm:text-xs font-serif italic text-black bg-[#fcfaf5] border border-[#d1bf9d] sm:border-r-0 focus:outline-none focus:border-[#eab308] transition-colors placeholder:text-[#555555]"
            />
            <button
              type="submit"
              className="w-full sm:w-auto h-10 sm:h-9 px-6 bg-[#facc15] hover:bg-[#ffd200] text-black text-[11px] font-black tracking-[0.1em] uppercase transition-colors shrink-0 cursor-pointer shadow-xs border border-[#eab308]"
            >
              {t.newsletterButton}
            </button>
          </form>
        )}
      </div>
    </section>
  );
};
