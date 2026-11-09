/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Download,
  Copy,
  Check,
  Share2,
  Sparkles,
  Sliders,
  Image as ImageIcon,
  Palette,
  Maximize2,
  RefreshCw,
  Eye,
  Type
} from 'lucide-react';
import { Article, getLocalizedArticle } from '../data/newspaperData';
import { Language, TRANSLATIONS } from '../data/translations';

interface SocialPostDesignerModalProps {
  isOpen: boolean;
  onClose: () => void;
  article: Article;
  language: Language;
}

type AspectRatioType = '1:1' | '16:9' | '9:16';
type ThemeStyleType = 'vintage' | 'amber' | 'midnight' | 'clean';
type ImageFilterType = 'none' | 'mono' | 'sepia' | 'contrast';

export const SocialPostDesignerModal: React.FC<SocialPostDesignerModalProps> = ({
  isOpen,
  onClose,
  article: rawArticle,
  language,
}) => {
  const [aspect, setAspect] = useState<AspectRatioType>('1:1');
  const [theme, setTheme] = useState<ThemeStyleType>('vintage');
  const [imageFilter, setImageFilter] = useState<ImageFilterType>('contrast');
  const [postLanguage, setPostLanguage] = useState<Language>(language);
  const [showMasthead, setShowMasthead] = useState(true);
  const [showImage, setShowImage] = useState(true);
  const [showExcerpt, setShowExcerpt] = useState(true);
  const [showDateCategory, setShowDateCategory] = useState(true);
  const [showWatermark, setShowWatermark] = useState(true);
  const [customQuote, setCustomQuote] = useState('');
  const [isEditingText, setIsEditingText] = useState(false);

  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedImage, setCopiedImage] = useState(false);
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewCardRef = useRef<HTMLDivElement>(null);

  const t = TRANSLATIONS[postLanguage];
  const article = getLocalizedArticle(rawArticle, postLanguage);

  useEffect(() => {
    setPostLanguage(language);
  }, [language]);

  useEffect(() => {
    if (article) {
      setCustomQuote(article.excerpt || '');
    }
  }, [article.id, postLanguage]);

  if (!isOpen) return null;

  // Permalink for the article
  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://herald-news.edu';
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/';
  const articlePermalink = `${currentOrigin}${currentPath}?article=${encodeURIComponent(article.id)}`;

  const heroImageUrl = article.imageUrl || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&w=1200&q=80';

  // Theme styling configurations
  const themeStyles = {
    vintage: {
      id: 'vintage',
      name: 'Vintage Newsprint',
      bgClass: 'bg-[#f4ebd9] text-[#1c1712]',
      borderClass: 'border-[#3d2f1f]',
      accentBg: 'bg-[#1c1712] text-[#facc15]',
      mastheadClass: 'text-[#1c1712]',
      quoteBg: 'bg-[#eae0cc] border-[#d8cbbb]',
      canvasBg: '#f4ebd9',
      canvasText: '#1c1712',
      canvasSubtext: '#4a3b2c',
      canvasAccent: '#facc15',
      canvasBorder: '#3d2f1f',
    },
    amber: {
      id: 'amber',
      name: 'Herald Amber',
      bgClass: 'bg-[#1e1913] text-[#fbf6ec]',
      borderClass: 'border-[#facc15]',
      accentBg: 'bg-[#facc15] text-[#1c1712]',
      mastheadClass: 'text-[#facc15]',
      quoteBg: 'bg-[#2b241c] border-[#433728]',
      canvasBg: '#1e1913',
      canvasText: '#fbf6ec',
      canvasSubtext: '#d4c7b2',
      canvasAccent: '#facc15',
      canvasBorder: '#facc15',
    },
    midnight: {
      id: 'midnight',
      name: 'Midnight Edition',
      bgClass: 'bg-[#0f1115] text-white',
      borderClass: 'border-[#2a2e39]',
      accentBg: 'bg-[#3b82f6] text-white',
      mastheadClass: 'text-white',
      quoteBg: 'bg-[#1a1e26] border-[#2e3442]',
      canvasBg: '#0f1115',
      canvasText: '#ffffff',
      canvasSubtext: '#94a3b8',
      canvasAccent: '#3b82f6',
      canvasBorder: '#2a2e39',
    },
    clean: {
      id: 'clean',
      name: 'Clean Modern',
      bgClass: 'bg-white text-black',
      borderClass: 'border-black',
      accentBg: 'bg-black text-white',
      mastheadClass: 'text-black',
      quoteBg: 'bg-stone-50 border-stone-200',
      canvasBg: '#ffffff',
      canvasText: '#000000',
      canvasSubtext: '#444444',
      canvasAccent: '#000000',
      canvasBorder: '#000000',
    },
  }[theme];

  // Aspect ratio dimensions for export
  const aspectConfig = {
    '1:1': {
      width: 1080,
      height: 1080,
      aspectClass: 'aspect-square',
      label: '1:1 Square (Instagram, WhatsApp, FB)',
    },
    '16:9': {
      width: 1200,
      height: 675,
      aspectClass: 'aspect-[16/9]',
      label: '16:9 Landscape (Twitter/X, LinkedIn)',
    },
    '9:16': {
      width: 1080,
      height: 1920,
      aspectClass: 'aspect-[9/16] max-h-[580px]',
      label: '9:16 Story (Insta Story, WhatsApp Status)',
    },
  }[aspect];

  // Helper to load image for Canvas with CORS
  const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => {
        // Fallback retry without crossOrigin if local/data URL
        const fallback = new Image();
        fallback.onload = () => resolve(fallback);
        fallback.onerror = (e) => reject(e);
        fallback.src = src;
      };
      img.src = src;
    });
  };

  // Render to Canvas
  const drawCardToCanvas = async (targetCanvas: HTMLCanvasElement) => {
    const ctx = targetCanvas.getContext('2d');
    if (!ctx) return;

    const width = aspectConfig.width;
    const height = aspectConfig.height;
    targetCanvas.width = width;
    targetCanvas.height = height;

    // Background
    ctx.fillStyle = themeStyles.canvasBg;
    ctx.fillRect(0, 0, width, height);

    // Decorative double border
    const pad = Math.round(width * 0.035);
    ctx.strokeStyle = themeStyles.canvasBorder;
    ctx.lineWidth = 4;
    ctx.strokeRect(pad, pad, width - pad * 2, height - pad * 2);

    ctx.lineWidth = 1;
    ctx.strokeRect(pad + 6, pad + 6, width - (pad + 6) * 2, height - (pad + 6) * 2);

    let currentY = pad + 24;

    // 1. Masthead
    if (showMasthead) {
      ctx.fillStyle = themeStyles.canvasText;
      ctx.textAlign = 'center';

      // Small top banner
      ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillText(
        postLanguage === 'si' ? 'විශ්වාසනීය අධ්‍යාපනික හා පුවත් සඟරාව' : 'THE VERIFIED JOURNAL OF RECORD',
        width / 2,
        currentY
      );
      currentY += 28;

      // Big Masthead
      ctx.font = '900 48px "Playfair Display", "Libre Baskerville", "Abhaya Libre", serif';
      ctx.fillText('THE DAILY HERALD', width / 2, currentY);
      currentY += 16;

      // Divider line
      ctx.strokeStyle = themeStyles.canvasBorder;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(pad + 20, currentY);
      ctx.lineTo(width - pad - 20, currentY);
      ctx.stroke();

      currentY += 18;
    }

    // 2. Category & Date Pill
    if (showDateCategory) {
      const catText = `${article.category.toUpperCase()} • ${article.date.toUpperCase()}`;
      ctx.textAlign = 'left';
      ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';

      // Badge pill
      ctx.fillStyle = themeStyles.canvasAccent;
      const textWidth = ctx.measureText(catText).width;
      const badgeH = 26;
      ctx.fillRect(pad + 24, currentY, textWidth + 24, badgeH);

      // Badge text
      ctx.fillStyle = '#000000';
      ctx.fillText(catText, pad + 36, currentY + 18);
      currentY += badgeH + 18;
    }

    // 3. Hero Image
    if (showImage && heroImageUrl) {
      try {
        const img = await loadImage(heroImageUrl);
        const imgPad = pad + 20;
        const imgWidth = width - imgPad * 2;
        let imgHeight = aspect === '16:9' ? height * 0.45 : aspect === '9:16' ? height * 0.42 : height * 0.44;

        ctx.save();
        ctx.beginPath();
        ctx.rect(imgPad, currentY, imgWidth, imgHeight);
        ctx.clip();

        // Calculate aspect fill
        const imgAspect = img.width / img.height;
        const targetAspect = imgWidth / imgHeight;
        let sx = 0, sy = 0, sw = img.width, sh = img.height;

        if (imgAspect > targetAspect) {
          sw = img.height * targetAspect;
          sx = (img.width - sw) / 2;
        } else {
          sh = img.width / targetAspect;
          sy = (img.height - sh) / 2;
        }

        // Apply filters via canvas filter
        if (imageFilter === 'mono') {
          ctx.filter = 'grayscale(100%) contrast(120%)';
        } else if (imageFilter === 'sepia') {
          ctx.filter = 'sepia(80%) contrast(110%)';
        } else if (imageFilter === 'contrast') {
          ctx.filter = 'contrast(125%) saturate(110%)';
        }

        ctx.drawImage(img, sx, sy, sw, sh, imgPad, currentY, imgWidth, imgHeight);
        ctx.restore();

        // Image frame border
        ctx.strokeStyle = themeStyles.canvasBorder;
        ctx.lineWidth = 2;
        ctx.strokeRect(imgPad, currentY, imgWidth, imgHeight);

        currentY += imgHeight + 24;
      } catch (err) {
        console.warn('Canvas hero image draw failed, continuing without image:', err);
      }
    }

    // 4. Headline
    ctx.fillStyle = themeStyles.canvasText;
    ctx.textAlign = 'left';
    const headlineFontSize = aspect === '9:16' ? 42 : aspect === '16:9' ? 36 : 38;
    ctx.font = `bold ${headlineFontSize}px "Playfair Display", "Abhaya Libre", serif`;

    const headlineText = article.title;
    const maxTextWidth = width - (pad + 24) * 2;
    const words = headlineText.split(' ');
    let line = '';
    const lines: string[] = [];

    for (let n = 0; n < words.length; n++) {
      const testLine = line + words[n] + ' ';
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxTextWidth && n > 0) {
        lines.push(line.trim());
        line = words[n] + ' ';
      } else {
        line = testLine;
      }
    }
    lines.push(line.trim());

    const maxLines = aspect === '16:9' ? 2 : 3;
    for (let i = 0; i < Math.min(lines.length, maxLines); i++) {
      ctx.fillText(lines[i], pad + 24, currentY + (i * (headlineFontSize + 8)));
    }
    currentY += Math.min(lines.length, maxLines) * (headlineFontSize + 8) + 16;

    // 5. Excerpt / Pull Quote
    if (showExcerpt && customQuote.trim()) {
      const quoteFontSize = aspect === '9:16' ? 22 : 19;
      ctx.font = `italic ${quoteFontSize}px "Newsreader", "Libre Baskerville", "Noto Sans Sinhala", serif`;
      ctx.fillStyle = themeStyles.canvasSubtext;

      const quoteWords = `“${customQuote.trim()}”`.split(' ');
      let qLine = '';
      const qLines: string[] = [];

      for (let n = 0; n < quoteWords.length; n++) {
        const testLine = qLine + quoteWords[n] + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxTextWidth && n > 0) {
          qLines.push(qLine.trim());
          qLine = quoteWords[n] + ' ';
        } else {
          qLine = testLine;
        }
      }
      qLines.push(qLine.trim());

      const maxQLines = aspect === '16:9' ? 2 : aspect === '9:16' ? 4 : 3;
      for (let i = 0; i < Math.min(qLines.length, maxQLines); i++) {
        ctx.fillText(qLines[i], pad + 24, currentY + (i * (quoteFontSize + 6)));
      }
      currentY += Math.min(qLines.length, maxQLines) * (quoteFontSize + 6) + 14;
    }

    // 6. Watermark Footer
    if (showWatermark) {
      const footerY = height - pad - 20;
      ctx.strokeStyle = themeStyles.canvasBorder;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad + 20, footerY - 14);
      ctx.lineTo(width - pad - 20, footerY - 14);
      ctx.stroke();

      ctx.font = 'bold 15px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = themeStyles.canvasSubtext;
      ctx.textAlign = 'left';
      ctx.fillText(`By ${article.author.toUpperCase()} • ${article.readTime || '4 min read'}`, pad + 24, footerY + 6);

      ctx.textAlign = 'right';
      ctx.fillStyle = themeStyles.canvasText;
      ctx.fillText('herald-news.edu ➔ READ REPORT', width - pad - 24, footerY + 6);
    }
  };

  // Download Post Graphic as PNG
  const handleDownloadImage = async () => {
    setIsGenerating(true);
    try {
      const offscreenCanvas = document.createElement('canvas');
      await drawCardToCanvas(offscreenCanvas);

      offscreenCanvas.toBlob((blob) => {
        if (!blob) return;
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.download = `herald-social-${article.id}-${aspect.replace(':', 'x')}.png`;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        setIsGenerating(false);
      }, 'image/png');
    } catch (err) {
      console.error('Error generating image:', err);
      setIsGenerating(false);
    }
  };

  // Copy Image directly to clipboard (for WhatsApp Web, Twitter, Slack, Telegram)
  const handleCopyImage = async () => {
    setIsGenerating(true);
    try {
      const offscreenCanvas = document.createElement('canvas');
      await drawCardToCanvas(offscreenCanvas);

      offscreenCanvas.toBlob(async (blob) => {
        if (!blob) {
          setIsGenerating(false);
          return;
        }

        if (typeof navigator !== 'undefined' && navigator.clipboard && (window as any).ClipboardItem) {
          try {
            await navigator.clipboard.write([
              new (window as any).ClipboardItem({ 'image/png': blob }),
            ]);
            setCopiedImage(true);
            setTimeout(() => setCopiedImage(false), 2600);
          } catch {
            // Fallback download if clipboard image copy restricted
            handleDownloadImage();
          }
        } else {
          handleDownloadImage();
        }
        setIsGenerating(false);
      }, 'image/png');
    } catch (err) {
      console.error('Copy image failed:', err);
      setIsGenerating(false);
    }
  };

  // Formatted caption copy
  const postCaption = `📰 ${article.title}

“${customQuote.trim()}”

👉 Read the verified report:
${articlePermalink}

#Education #TheDailyHerald #SriLanka #News`;

  const handleCopyCaption = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(postCaption);
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2400);
    }
  };

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(articlePermalink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2400);
    }
  };

  // Direct Social Share URLs with hero image & formatted text
  const encodedUrl = encodeURIComponent(articlePermalink);
  const encodedTitle = encodeURIComponent(article.title);
  const encodedText = encodeURIComponent(`${article.title}\n\n${customQuote.slice(0, 100)}...\n\n${articlePermalink}`);
  const encodedImage = encodeURIComponent(heroImageUrl);

  const directShareLinks = [
    {
      id: 'whatsapp',
      name: 'WhatsApp',
      href: `https://wa.me/?text=${encodedText}`,
      bgClass: 'bg-[#25D366] hover:bg-[#1faa4f] text-white',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12.044.002C5.402.002 0 5.404 0 12.046c0 2.119.553 4.186 1.605 6.01L0 24l6.103-1.601a11.986 11.986 0 005.94 1.558h.005c6.641 0 12.043-5.402 12.043-12.044 0-3.218-1.253-6.243-3.53-8.522A11.96 11.96 0 0012.044.002z" />
        </svg>
      ),
    },
    {
      id: 'twitter',
      name: 'X (Twitter)',
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}&hashtags=Education,TheDailyHerald`,
      bgClass: 'bg-black hover:bg-neutral-800 text-white',
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
      ),
    },
    {
      id: 'facebook',
      name: 'Facebook',
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      bgClass: 'bg-[#1877F2] hover:bg-[#0f64d0] text-white',
      icon: (
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      ),
    },
    {
      id: 'linkedin',
      name: 'LinkedIn',
      href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      bgClass: 'bg-[#0A66C2] hover:bg-[#084e96] text-white',
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
        </svg>
      ),
    },
    {
      id: 'pinterest',
      name: 'Pinterest',
      href: `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodedImage}&description=${encodedTitle}`,
      bgClass: 'bg-[#E60023] hover:bg-[#b8001c] text-white',
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 01.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
        </svg>
      ),
    },
    {
      id: 'telegram',
      name: 'Telegram',
      href: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
      bgClass: 'bg-[#229ED9] hover:bg-[#1a83b5] text-white',
      icon: (
        <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
          <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.643-.204-.657-.643.136-.953l11.57-4.458c.538-.196 1.006.128.832.941z" />
        </svg>
      ),
    },
  ];

  // Mobile native share with file if supported
  const handleNativeMobileShare = async () => {
    if (typeof navigator === 'undefined' || !navigator.share) return;

    try {
      const offscreenCanvas = document.createElement('canvas');
      await drawCardToCanvas(offscreenCanvas);

      offscreenCanvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `herald-social-${article.id}.png`, { type: 'image/png' });

        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: article.title,
            text: `${article.title}\n\n${articlePermalink}`,
          });
        } else {
          await navigator.share({
            title: article.title,
            text: article.excerpt,
            url: articlePermalink,
          });
        }
      }, 'image/png');
    } catch {
      // User cancelled share
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-xs">
      <div className="relative w-full max-w-5xl max-h-[92vh] bg-[#fbf8f2] rounded-xs shadow-2xl border-2 border-[#1c1712] flex flex-col overflow-hidden text-black">
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3.5 bg-[#1c1712] text-white border-b border-black">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xs bg-[#facc15] text-black flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-headline font-bold text-base sm:text-lg tracking-wide uppercase text-white leading-tight">
                {postLanguage === 'si' ? 'සමාජ මාධ්‍ය පෝස්ට් නිර්මාණ ශිල්පය' : 'Social Media Post Studio'}
              </h3>
              <p className="text-[11px] text-stone-300 font-sans">
                {postLanguage === 'si'
                  ? 'ප්‍රධාන ඡායාරූපය සහ පුවත් සිරස්තලය සමඟ උසස් ප්‍රමිතියේ පෝස්ටුවක් සකසන්න'
                  : 'Design editorial social cards featuring the hero image for Instagram, WhatsApp & Twitter'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Bilingual Switcher */}
            <button
              onClick={() => setPostLanguage((prev) => (prev === 'en' ? 'si' : 'en'))}
              className="px-2.5 py-1 text-xs font-bold rounded-xs bg-white/10 hover:bg-white/20 text-[#facc15] border border-white/20 transition-colors cursor-pointer"
            >
              {postLanguage === 'en' ? 'සිංහල අනුවාදය' : 'English Version'}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 text-stone-300 hover:text-white rounded-xs transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Studio Body: Split View (Preview Canvas on Left, Controls on Right) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 bg-[#f7f2e7]">
          {/* LEFT: Live Interactive Preview Card */}
          <div className="lg:col-span-7 flex flex-col items-center justify-start">
            <div className="w-full flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-black flex items-center gap-1.5 font-sans">
                <Eye className="w-3.5 h-3.5 text-[#d97706]" />
                <span>Live Card Preview</span>
              </span>
              <span className="text-[11px] font-sans font-medium text-stone-600 bg-black/5 px-2 py-0.5 rounded-xs">
                {aspectConfig.label}
              </span>
            </div>

            {/* Simulated Live Post Card */}
            <div
              ref={previewCardRef}
              className={`w-full max-w-[460px] p-5 rounded-xs border-2 shadow-lg transition-all relative overflow-hidden flex flex-col ${themeStyles.bgClass} ${themeStyles.borderClass} ${aspectConfig.aspectClass}`}
            >
              {/* Decorative vintage borders */}
              <div className={`absolute inset-2 border pointer-events-none ${themeStyles.borderClass} opacity-40`} />

              {/* 1. Masthead */}
              {showMasthead && (
                <div className="text-center mb-3 pb-2 border-b border-current/25 relative z-10">
                  <div className="text-[9px] uppercase tracking-widest font-sans font-bold opacity-80 mb-0.5">
                    {postLanguage === 'si' ? 'විශ්වාසනීය අධ්‍යාපනික හා පුවත් සඟරාව' : 'THE VERIFIED JOURNAL OF RECORD'}
                  </div>
                  <h1 className="font-headline text-2xl sm:text-3xl font-black tracking-tight leading-none uppercase">
                    THE DAILY HERALD
                  </h1>
                </div>
              )}

              {/* 2. Category & Date Pill */}
              {showDateCategory && (
                <div className="mb-2.5 flex items-center justify-between relative z-10">
                  <span className={`text-[10px] font-sans font-black px-2 py-0.5 uppercase tracking-wider rounded-2xs ${themeStyles.accentBg}`}>
                    {article.category}
                  </span>
                  <span className="text-[10px] font-sans font-semibold opacity-75 uppercase">
                    {article.date}
                  </span>
                </div>
              )}

              {/* 3. Hero Image */}
              {showImage && heroImageUrl && (
                <div className="relative mb-3 rounded-2xs overflow-hidden border border-current/25 z-10 shrink-0 aspect-[16/9]">
                  <img
                    src={heroImageUrl}
                    alt={article.title}
                    className={`w-full h-full object-cover transition-all ${
                      imageFilter === 'mono'
                        ? 'filter grayscale contrast-125'
                        : imageFilter === 'sepia'
                        ? 'filter sepia contrast-110'
                        : imageFilter === 'contrast'
                        ? 'filter contrast-125 saturate-110'
                        : ''
                    }`}
                  />
                  <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] font-sans font-bold px-1.5 py-0.5 rounded-2xs backdrop-blur-xs">
                    PHOTO: HERALD ARCHIVES
                  </div>
                </div>
              )}

              {/* 4. Headline */}
              <div className="relative z-10 flex-1">
                <h2 className="font-headline font-bold text-base sm:text-lg leading-snug tracking-tight mb-2">
                  {article.title}
                </h2>

                {/* 5. Excerpt / Pull Quote */}
                {showExcerpt && customQuote && (
                  <div className={`p-2 rounded-2xs border text-xs font-serif italic mb-2 ${themeStyles.quoteBg} opacity-95`}>
                    “{customQuote}”
                  </div>
                )}
              </div>

              {/* 6. Watermark Footer */}
              {showWatermark && (
                <div className="pt-2 mt-auto border-t border-current/25 flex items-center justify-between text-[10px] font-sans relative z-10">
                  <span className="font-bold opacity-80 truncate max-w-[55%]">
                    By {article.author} • {article.readTime || '4 min'}
                  </span>
                  <span className="font-extrabold uppercase tracking-wider text-[#d97706] flex items-center gap-1">
                    herald-news.edu ➔
                  </span>
                </div>
              )}
            </div>

            {/* Quick Action Pills Under Preview */}
            <div className="w-full max-w-[460px] flex items-center justify-between gap-2 mt-3">
              <button
                type="button"
                onClick={handleCopyCaption}
                className="flex-1 py-1.5 px-2 bg-white hover:bg-stone-50 text-black border border-stone-300 rounded-xs text-xs font-bold font-sans flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                {copiedCaption ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.captionCopied}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-black" />
                    <span>{t.copyCaption}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleCopyLink}
                className="flex-1 py-1.5 px-2 bg-white hover:bg-stone-50 text-black border border-stone-300 rounded-xs text-xs font-bold font-sans flex items-center justify-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                {copiedLink ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{t.linkCopied}</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-3.5 h-3.5 text-black" />
                    <span>{t.copyArticleLink}</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* RIGHT: Design Controls & Direct Share Toolbar */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            {/* 1. Format / Aspect Ratio Selector */}
            <div className="bg-white p-3.5 rounded-xs border border-[#d6c49e] shadow-2xs">
              <label className="text-xs font-bold uppercase tracking-wider font-sans text-black flex items-center gap-1.5 mb-2">
                <Sliders className="w-3.5 h-3.5 text-[#d97706]" />
                <span>1. Aspect Ratio / Format</span>
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {(['1:1', '16:9', '9:16'] as AspectRatioType[]).map((fmt) => (
                  <button
                    key={fmt}
                    type="button"
                    onClick={() => setAspect(fmt)}
                    className={`py-2 px-1 rounded-xs text-xs font-bold font-sans text-center transition-all cursor-pointer border ${
                      aspect === fmt
                        ? 'bg-[#1c1712] text-[#facc15] border-[#1c1712] shadow-xs'
                        : 'bg-[#faf6ee] hover:bg-[#efe4cf] text-black border-stone-200'
                    }`}
                  >
                    <div>{fmt}</div>
                    <div className="text-[10px] font-normal opacity-75">
                      {fmt === '1:1' ? 'Square' : fmt === '16:9' ? 'Landscape' : 'Story'}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Theme / Visual Style */}
            <div className="bg-white p-3.5 rounded-xs border border-[#d6c49e] shadow-2xs">
              <label className="text-xs font-bold uppercase tracking-wider font-sans text-black flex items-center gap-1.5 mb-2">
                <Palette className="w-3.5 h-3.5 text-[#d97706]" />
                <span>2. Theme Presets</span>
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                {[
                  { id: 'vintage', name: 'Vintage Paper', color: 'bg-[#f4ebd9] text-black' },
                  { id: 'amber', name: 'Herald Gold', color: 'bg-[#1e1913] text-[#facc15]' },
                  { id: 'midnight', name: 'Midnight Dark', color: 'bg-[#0f1115] text-white' },
                  { id: 'clean', name: 'Modern Clean', color: 'bg-white text-black border border-stone-300' },
                ].map((th) => (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => setTheme(th.id as ThemeStyleType)}
                    className={`py-2 px-2.5 rounded-xs text-xs font-bold font-sans flex items-center justify-between transition-all cursor-pointer border ${th.color} ${
                      theme === th.id ? 'ring-2 ring-[#d97706] shadow-xs' : 'opacity-85 hover:opacity-100'
                    }`}
                  >
                    <span>{th.name}</span>
                    {theme === th.id && <Check className="w-3.5 h-3.5" />}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Hero Image Filters & Toggles */}
            <div className="bg-white p-3.5 rounded-xs border border-[#d6c49e] shadow-2xs">
              <label className="text-xs font-bold uppercase tracking-wider font-sans text-black flex items-center gap-1.5 mb-2">
                <ImageIcon className="w-3.5 h-3.5 text-[#d97706]" />
                <span>3. Hero Image Adjustments</span>
              </label>
              <div className="grid grid-cols-4 gap-1.5 mb-3">
                {[
                  { id: 'none', label: 'Original' },
                  { id: 'contrast', label: 'Vivid' },
                  { id: 'mono', label: 'B&W Ink' },
                  { id: 'sepia', label: 'Sepia' },
                ].map((flt) => (
                  <button
                    key={flt.id}
                    type="button"
                    onClick={() => setImageFilter(flt.id as ImageFilterType)}
                    className={`py-1.5 px-1 rounded-xs text-xs font-bold font-sans text-center transition-all cursor-pointer border ${
                      imageFilter === flt.id
                        ? 'bg-[#d97706] text-white border-[#b45309]'
                        : 'bg-[#faf6ee] hover:bg-[#efe4cf] text-black border-stone-200'
                    }`}
                  >
                    {flt.label}
                  </button>
                ))}
              </div>

              {/* Elements Toggles */}
              <div className="space-y-1.5 pt-2 border-t border-stone-100 text-xs font-sans font-medium">
                <label className="flex items-center justify-between cursor-pointer">
                  <span>Show Hero Photograph</span>
                  <input
                    type="checkbox"
                    checked={showImage}
                    onChange={(e) => setShowImage(e.target.checked)}
                    className="accent-[#d97706] w-4 h-4 cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span>Show Masthead ("THE DAILY HERALD")</span>
                  <input
                    type="checkbox"
                    checked={showMasthead}
                    onChange={(e) => setShowMasthead(e.target.checked)}
                    className="accent-[#d97706] w-4 h-4 cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span>Show Excerpt / Highlight Quote</span>
                  <input
                    type="checkbox"
                    checked={showExcerpt}
                    onChange={(e) => setShowExcerpt(e.target.checked)}
                    className="accent-[#d97706] w-4 h-4 cursor-pointer"
                  />
                </label>
                <label className="flex items-center justify-between cursor-pointer">
                  <span>Show Category & Date Badge</span>
                  <input
                    type="checkbox"
                    checked={showDateCategory}
                    onChange={(e) => setShowDateCategory(e.target.checked)}
                    className="accent-[#d97706] w-4 h-4 cursor-pointer"
                  />
                </label>
              </div>
            </div>

            {/* 4. Edit Highlight Quote */}
            {showExcerpt && (
              <div className="bg-white p-3.5 rounded-xs border border-[#d6c49e] shadow-2xs">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider font-sans text-black flex items-center gap-1.5">
                    <Type className="w-3.5 h-3.5 text-[#d97706]" />
                    <span>Quote / Excerpt Text</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => setCustomQuote(article.excerpt || '')}
                    className="text-[11px] font-sans font-bold text-[#d97706] hover:underline cursor-pointer"
                  >
                    Reset
                  </button>
                </div>
                <textarea
                  value={customQuote}
                  onChange={(e) => setCustomQuote(e.target.value)}
                  rows={2}
                  className="w-full text-xs font-serif p-2 rounded-xs border border-stone-300 focus:outline-hidden focus:border-[#d97706] bg-[#faf6ee]"
                  placeholder="Type a custom quote or key excerpt to highlight on social media..."
                />
              </div>
            )}

            {/* 5. PRIMARY EXPORT ACTIONS */}
            <div className="bg-[#1c1712] text-white p-4 rounded-xs shadow-md space-y-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#facc15] font-sans block">
                Export & Share Social Graphic
              </span>

              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={handleDownloadImage}
                  disabled={isGenerating}
                  className="py-2.5 px-3 rounded-xs font-sans font-bold text-xs bg-[#facc15] hover:bg-[#ffd200] text-black flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95 disabled:opacity-50"
                >
                  <Download className="w-4 h-4 text-black" />
                  <span>{isGenerating ? 'Rendering...' : t.downloadPostImage}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopyImage}
                  disabled={isGenerating}
                  className={`py-2.5 px-3 rounded-xs font-sans font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer active:scale-95 border ${
                    copiedImage
                      ? 'bg-emerald-600 border-emerald-500 text-white'
                      : 'bg-white hover:bg-stone-100 text-black border-white'
                  }`}
                >
                  {copiedImage ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>{t.imageCopied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-black" />
                      <span>{t.copyPostImage}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Direct Social Media Links */}
              <div className="pt-2 border-t border-white/15">
                <span className="text-[10px] uppercase tracking-wider text-stone-300 font-sans block mb-1.5">
                  Share Permalinks Directly
                </span>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                  {directShareLinks.map((p) => (
                    <a
                      key={p.id}
                      href={p.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={`Share on ${p.name}`}
                      className={`py-1.5 px-1 rounded-xs flex items-center justify-center gap-1 text-[11px] font-sans font-bold transition-transform hover:scale-105 active:scale-95 ${p.bgClass}`}
                    >
                      {p.icon}
                      <span className="truncate">{p.name}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* Mobile Native Share if supported */}
              {typeof navigator !== 'undefined' && 'share' in navigator && (
                <button
                  type="button"
                  onClick={handleNativeMobileShare}
                  className="w-full py-2 px-3 rounded-xs text-xs font-sans font-bold bg-white/10 hover:bg-white/20 text-white border border-white/20 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5 text-[#facc15]" />
                  <span>Open Phone Share Sheet (WhatsApp, Instagram, etc.)</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="px-6 py-3 bg-[#f2e8d5] border-t border-[#dfcead] flex items-center justify-between text-xs font-sans">
          <span className="text-black/80 font-medium truncate">
            {article.title} • {postLanguage === 'si' ? 'සිංහල' : 'English'}
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xs font-bold bg-[#1c1712] text-white hover:bg-black transition-colors cursor-pointer"
          >
            {t.closeModal}
          </button>
        </div>
      </div>
    </div>
  );
};
