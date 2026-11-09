import React from 'react';
import { FOOTER_LINKS } from '../data/newspaperData';
import { Language, TRANSLATIONS, FOOTER_LINKS_SI } from '../data/translations';

interface FooterProps {
  language: Language;
  onSelectCategory: (category: string) => void;
  onSelectTag: (tag: string) => void;
  onOpenContact: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  language,
  onSelectCategory,
  onSelectTag,
  onOpenContact,
}) => {
  const t = TRANSLATIONS[language];
  const links = language === 'si' ? FOOTER_LINKS_SI : FOOTER_LINKS;

  return (
    <footer className="w-full bg-[#f4ebd9] select-none border-t border-[#dfcead]">
      {/* Bright Yellow Editorial Stripe & Thick Rule */}
      <div className="w-full h-[3px] bg-[#facc15]" />
      <div className="w-full border-t-2 border-[#2b2014]" />

      <div className="max-w-[1180px] mx-auto px-4 sm:px-6 pt-10 pb-8">
        {/* 4 Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand & Reader links */}
          <div>
            <div className="mb-4 flex items-center gap-2.5">
              <img
                src="/assets/aistudio/Logo_W2.jpg_741157ec.jpeg"
                alt="Logo"
                className="w-12 h-12 object-contain mix-blend-multiply rounded-full shrink-0"
              />
              <div>
                <span className="font-masthead font-black text-[17px] text-black block leading-tight">
                  <span className="inline-flex items-center gap-x-1.5">
                    <span>{t.siteTitle.split(' ')[0]}</span>
                    <span>{t.siteTitle.substring(t.siteTitle.indexOf(' ') + 1)}</span>
                  </span>
                </span>
                <span className="text-[10px] uppercase font-sans font-bold tracking-wider text-black block">
                  {t.siteSubtitle}
                </span>
              </div>
            </div>

            <ul className="space-y-1.5 text-[12px] font-serif text-black">
              {links.reader.map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => {
                      if (
                        item.toLowerCase().includes('contact') ||
                        item.includes('සබඳතා')
                      ) {
                        onOpenContact();
                      } else {
                        onSelectCategory('ALL');
                      }
                    }}
                    className="hover:underline cursor-pointer transition-colors text-left text-black"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 2: NEWS */}
          <div>
            <h4 className="text-[11px] font-bold tracking-[0.08em] uppercase text-black font-sans mb-3.5">
              {t.footerNewsTitle}
            </h4>
            <ul className="space-y-1.5 text-[12px] font-serif text-black">
              {links.news.map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => {
                      // Map common categories or fallback to ALL
                      onSelectCategory('ALL');
                    }}
                    className="hover:underline cursor-pointer transition-colors text-left text-black"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: OPINION */}
          <div>
            <h4 className="text-[11px] font-bold tracking-[0.08em] uppercase text-black font-sans mb-3.5">
              {t.footerOpinionTitle}
            </h4>
            <ul className="space-y-1.5 text-[12px] font-serif text-black">
              {links.opinion.map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => onSelectCategory('OPINION')}
                    className="hover:underline cursor-pointer transition-colors text-left text-black"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: MOST POPULAR */}
          <div>
            <h4 className="text-[11px] font-bold tracking-[0.08em] uppercase text-black font-sans mb-3.5">
              {t.footerPopularTitle}
            </h4>
            <ul className="space-y-1.5 text-[12px] font-serif text-black">
              {links.mostPopular.map((item, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => onSelectTag(item)}
                    className="hover:underline cursor-pointer transition-colors text-left text-black"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="w-full border-t border-[#dfd0ba] pt-6 pb-2">
          {/* Social Icons matching original styling: f, g+, mail, twitter */}
          <div className="flex items-center justify-center space-x-4 mb-3 text-black">
            {/* Facebook */}
            <a
              href="#facebook"
              aria-label="Facebook"
              onClick={(e) => e.preventDefault()}
              className="w-6 h-6 flex items-center justify-center font-serif font-bold text-sm hover:opacity-75 transition-colors"
            >
              f
            </a>
            {/* Google+ */}
            <a
              href="#googleplus"
              aria-label="Google Plus"
              onClick={(e) => e.preventDefault()}
              className="w-6 h-6 flex items-center justify-center font-sans font-bold text-xs hover:opacity-75 transition-colors"
            >
              g+
            </a>
            {/* Mail */}
            <a
              href="#newsletter"
              aria-label="Email"
              onClick={(e) => e.preventDefault()}
              className="w-6 h-6 flex items-center justify-center text-xs hover:opacity-75 transition-colors"
            >
              ✉
            </a>
            {/* Twitter */}
            <a
              href="#twitter"
              aria-label="Twitter"
              onClick={(e) => e.preventDefault()}
              className="w-6 h-6 flex items-center justify-center font-serif text-sm hover:opacity-75 transition-colors"
            >
              𝕏
            </a>
          </div>

          {/* Copyright */}
          <div className="text-center text-[11px] text-black font-sans font-semibold">
            {t.footerRights}
          </div>
        </div>
      </div>
    </footer>
  );
};
