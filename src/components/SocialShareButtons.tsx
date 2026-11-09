/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Link2, Check, Share2, Sparkles, Image as ImageIcon } from 'lucide-react';
import { Language, TRANSLATIONS } from '../data/translations';

interface SocialShareButtonsProps {
  url?: string;
  title: string;
  summary?: string;
  imageUrl?: string;
  language: Language;
  variant?: 'bar' | 'compact' | 'expanded';
  className?: string;
  onOpenDesigner?: () => void;
}

export const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({
  url,
  title,
  summary,
  imageUrl,
  language,
  variant = 'bar',
  className = '',
  onOpenDesigner,
}) => {
  const [copied, setCopied] = useState(false);
  const t = TRANSLATIONS[language];

  // Resolve active URL
  const shareUrl =
    url || (typeof window !== 'undefined' ? window.location.href : 'https://herald-news.edu');
  const shareTitle = title;
  const encodedUrl = encodeURIComponent(shareUrl);
  const encodedTitle = encodeURIComponent(shareTitle);
  const encodedSummary = summary ? summary.slice(0, 140) + '... ' : '';
  const encodedText = encodeURIComponent(`${shareTitle}\n\n${encodedSummary}\n\n${shareUrl}`);
  const encodedImage = encodeURIComponent(imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80');

  const handleCopyLink = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2400);
    }
  };

  const handleNativeShare = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof navigator !== 'undefined' && navigator.share) {
      navigator
        .share({
          title: shareTitle,
          text: summary || shareTitle,
          url: shareUrl,
        })
        .catch(() => {});
    }
  };

  const socialPlatforms = [
    {
      id: 'facebook',
      name: t.shareOnFacebook,
      shortName: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      bgClass: 'bg-[#1877F2] hover:bg-[#0f64d0] text-white',
      borderClass: 'border-[#1464cc]',
      icon: (
        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      id: 'twitter',
      name: t.shareOnTwitter,
      shortName: 'X',
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&hashtags=Education,TheDailyHerald`,
      bgClass: 'bg-black hover:bg-neutral-800 text-white',
      borderClass: 'border-black',
      icon: (
        <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      id: 'whatsapp',
      name: t.shareOnWhatsApp,
      shortName: 'WhatsApp',
      href: `https://wa.me/?text=${encodedText}`,
      bgClass: 'bg-[#25D366] hover:bg-[#1faa4f] text-white',
      borderClass: 'border-[#1ea750]',
      icon: (
        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12.044.002C5.402.002 0 5.404 0 12.046c0 2.119.553 4.186 1.605 6.01L0 24l6.103-1.601a11.986 11.986 0 005.94 1.558h.005c6.641 0 12.043-5.402 12.043-12.044 0-3.218-1.253-6.243-3.53-8.522A11.96 11.96 0 0012.044.002z" />
        </svg>
      ),
    },
    {
      id: 'linkedin',
      name: t.shareOnLinkedIn,
      shortName: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      bgClass: 'bg-[#0A66C2] hover:bg-[#084e96] text-white',
      borderClass: 'border-[#064789]',
      icon: (
        <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
    {
      id: 'pinterest',
      name: t.shareOnPinterest || 'Pinterest',
      shortName: 'Pinterest',
      href: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImage}&description=${encodedTitle}`,
      bgClass: 'bg-[#E60023] hover:bg-[#b8001c] text-white',
      borderClass: 'border-[#b8001c]',
      icon: (
        <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
        </svg>
      ),
    },
    {
      id: 'telegram',
      name: t.shareOnTelegram,
      shortName: 'Telegram',
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      bgClass: 'bg-[#229ED9] hover:bg-[#1a83b5] text-white',
      borderClass: 'border-[#1774a1]',
      icon: (
        <svg className="w-3.5 h-3.5 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.941z" />
        </svg>
      ),
    },
    {
      id: 'reddit',
      name: t.shareOnReddit,
      shortName: 'Reddit',
      href: `https://reddit.com/submit?url=${encodedUrl}&title=${encodedTitle}`,
      bgClass: 'bg-[#FF4500] hover:bg-[#d63b00] text-white',
      borderClass: 'border-[#c43600]',
      icon: (
        <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.688-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.197-2.512-.73a.326.326 0 0 0-.232-.095z" />
        </svg>
      ),
    },
    {
      id: 'email',
      name: t.shareViaEmail,
      shortName: 'Email',
      href: `mailto:?subject=${encodedTitle}&body=${encodedTitle}%0A%0A${encodedUrl}`,
      bgClass: 'bg-stone-700 hover:bg-stone-900 text-white',
      borderClass: 'border-stone-800',
      icon: <Mail className="w-3.5 h-3.5 shrink-0" />,
    },
  ];

  /* -------------------------------------------------------------
   * VARIANT: Compact (clean horizontal row of icon buttons)
   * ------------------------------------------------------------- */
  if (variant === 'compact') {
    return (
      <div className={`flex flex-col space-y-2.5 ${className}`}>
        {onOpenDesigner && (
          <button
            type="button"
            onClick={onOpenDesigner}
            className="w-full py-1.5 px-2 bg-[#facc15] hover:bg-[#ffd200] text-black rounded-xs text-xs font-bold font-sans flex items-center justify-center gap-1.5 shadow-2xs border border-[#eab308] cursor-pointer transition-transform hover:scale-102 active:scale-95"
          >
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>{t.designPostCard}</span>
          </button>
        )}

        <div className="flex items-center flex-wrap gap-1.5">
          {socialPlatforms.map((platform) => (
            <a
              key={platform.id}
              href={platform.href}
              target="_blank"
              rel="noopener noreferrer"
              title={`${t.shareArticle} - ${platform.name}`}
              className={`w-7 h-7 rounded-xs flex items-center justify-center transition-transform hover:scale-110 active:scale-95 shadow-2xs ${platform.bgClass}`}
            >
              {platform.icon}
            </a>
          ))}

          <button
            type="button"
            onClick={handleCopyLink}
            title={copied ? t.linkCopied : t.copyArticleLink}
            className={`h-7 px-2 rounded-xs flex items-center gap-1 text-[10.5px] font-sans font-bold uppercase transition-all shadow-2xs cursor-pointer ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-white hover:bg-stone-100 text-black border border-stone-300'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-white" />
                <span>{t.linkCopied}</span>
              </>
            ) : (
              <>
                <Link2 className="w-3 h-3" />
                <span className="hidden sm:inline">{t.copyArticleLink}</span>
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
   * VARIANT: Expanded (Full-width reader engagement section)
   * ------------------------------------------------------------- */
  if (variant === 'expanded') {
    return (
      <div className={`p-4 sm:p-5 rounded-xs bg-[#f4ebd9] border-2 border-[#dfcead] text-black ${className}`}>
        {/* Top Header & Post Designer CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-[#dfcead]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xs bg-[#1c1712] text-[#facc15] flex items-center justify-center shadow-xs shrink-0">
              <Share2 className="w-4 h-4" />
            </div>
            <div>
              <h4 className="font-headline font-bold text-base text-black uppercase tracking-wider leading-none mb-1">
                {t.shareThisStory}
              </h4>
              <p className="text-[11px] text-black/75 font-sans">
                {language === 'si'
                  ? 'මෙම ප්‍රවෘත්තිය ඔබගේ සමාජ මාධ්‍ය ජාලයන් ඔස්සේ මිතුරන් සමඟ බෙදාගන්න'
                  : 'Spread verified educational journalism with your network and colleagues'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
            {/* DESIGN SOCIAL POST WITH HERO IMAGE BUTTON */}
            {onOpenDesigner && (
              <button
                type="button"
                onClick={onOpenDesigner}
                className="px-3.5 py-1.5 rounded-xs text-xs font-bold font-sans flex items-center gap-1.5 bg-[#1c1712] hover:bg-black text-[#facc15] shadow-xs cursor-pointer border border-black transition-transform hover:scale-102 active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-[#facc15]" />
                <span>{t.designPostCard}</span>
              </button>
            )}

            {/* Quick copy link pill */}
            <button
              type="button"
              onClick={handleCopyLink}
              className={`px-3 py-1.5 rounded-xs text-xs font-bold font-sans flex items-center gap-1.5 transition-all shadow-2xs cursor-pointer border ${
                copied
                  ? 'bg-emerald-600 border-emerald-700 text-white'
                  : 'bg-white hover:bg-[#faf6ee] text-black border-[#d6c49e]'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>{t.linkCopied}</span>
                </>
              ) : (
                <>
                  <Link2 className="w-3.5 h-3.5 text-black" />
                  <span>{t.copyArticleLink}</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Grid of full social buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-2">
          {socialPlatforms.map((platform) => (
            <a
              key={platform.id}
              href={platform.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xs text-xs font-bold font-sans transition-all shadow-2xs hover:shadow-xs hover:scale-103 active:scale-95 text-center ${platform.bgClass}`}
              title={`Share on ${platform.name}`}
            >
              {platform.icon}
              <span className="truncate">{platform.shortName}</span>
            </a>
          ))}
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
   * DEFAULT VARIANT: Standard Bar (Prominent byline social toolbar)
   * ------------------------------------------------------------- */
  return (
    <div className={`flex flex-wrap items-center justify-between gap-2.5 ${className}`}>
      <div className="flex items-center flex-wrap gap-2">
        <span className="text-[11px] uppercase tracking-wider font-bold text-black font-sans flex items-center gap-1.5 mr-1">
          <Share2 className="w-3.5 h-3.5 text-black" />
          <span>{t.shareThisStory}</span>
        </span>

        <div className="flex items-center flex-wrap gap-1.5">
          {socialPlatforms.map((platform) => (
            <a
              key={platform.id}
              href={platform.href}
              target="_blank"
              rel="noopener noreferrer"
              title={`${t.shareThisStory} ${platform.name}`}
              className={`h-7 px-2.5 rounded-xs flex items-center gap-1.5 text-xs font-sans font-bold transition-all hover:scale-105 active:scale-95 shadow-2xs ${platform.bgClass}`}
            >
              {platform.icon}
              <span className="text-[11px] hidden xs:inline">{platform.shortName}</span>
            </a>
          ))}

          <button
            type="button"
            onClick={handleCopyLink}
            title={copied ? t.linkCopied : t.copyArticleLink}
            className={`h-7 px-2.5 rounded-xs flex items-center gap-1.5 text-xs font-sans font-bold transition-all shadow-2xs cursor-pointer border ${
              copied
                ? 'bg-emerald-600 border-emerald-700 text-white'
                : 'bg-white hover:bg-stone-50 text-black border-[#d6c49e]'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-white" />
                <span className="text-[11px]">{t.linkCopied}</span>
              </>
            ) : (
              <>
                <Link2 className="w-3 h-3 text-black" />
                <span className="text-[11px] hidden sm:inline">{t.copyArticleLink}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* DESIGN SOCIAL POST WITH HERO IMAGE BUTTON */}
      {onOpenDesigner && (
        <button
          type="button"
          onClick={onOpenDesigner}
          className="h-7 px-3 rounded-xs bg-[#1c1712] hover:bg-black text-[#facc15] text-xs font-bold font-sans flex items-center gap-1.5 shadow-2xs border border-black cursor-pointer transition-transform hover:scale-103 active:scale-95"
          title="Open Post Studio to design an image card with the hero photograph"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#facc15]" />
          <span>{t.designPostCard}</span>
        </button>
      )}
    </div>
  );
};
