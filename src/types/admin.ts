/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type StaffRole = 'super_admin' | 'editor' | 'reporter' | 'contributor';

export type EditorialStatus = 'draft' | 'in_review' | 'approved' | 'published' | 'archived';

export type PriorityTag = 'standard' | 'breaking' | 'developing' | 'exclusive' | 'analysis' | 'opinion';

export interface LiveBlogEntry {
  id: string;
  timestamp: string;
  headline: string;
  content: string;
  authorName?: string;
}

export interface Article {
  id: string;
  headline: string;
  subheadline?: string;
  slug: string;
  reporterId: string;
  reporterName: string;
  dateline: string;
  sectionId: string;
  subsection?: string;
  priorityTag: PriorityTag;
  featuredImage: string;
  imageCaption?: string;
  imageCredit?: string;
  excerpt: string;
  content: string;
  tags: string[];
  editorialStatus: EditorialStatus;
  scheduledPublishAt?: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  views: number;
  isSticky: boolean;
  isLiveBlog: boolean;
  liveBlogEntries?: LiveBlogEntry[];
  correctionNotice?: string;
  commentsEnabled: boolean;
  readingTimeMinutes?: number;
  // Bilingual support
  headlineSi?: string;
  excerptSi?: string;
  contentSi?: string;
}

export interface Section {
  id: string;
  name: string;
  nameSi?: string;
  slug: string;
  description: string;
  color: string;
  order: number;
  parentId?: string | null;
  editorId?: string;
  heroImage?: string;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  bio: string;
  headshot: string;
  sections: string[];
  socialLinks: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
  active: boolean;
  createdAt: string;
  password?: string;
}

export interface ReaderUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  bio?: string;
  bookmarks: string[];
  readingHistory?: string[];
  favoriteSections?: string[];
  createdAt: string;
  password?: string;
}

export interface BreakingNewsItem {
  id: string;
  headline: string;
  headlineSi?: string;
  articleId?: string;
  expiresAt: string; // ISO string
  order: number;
  active: boolean;
  priority: 'high' | 'urgent' | 'flash';
}

export interface FrontPageBlock {
  id: string;
  sectionId: string;
  title: string;
  style: 'grid' | 'list' | 'card' | 'image-first';
  articleCount: number;
  customArticleIds: string[];
  autoPopulateLatest: boolean;
  order: number;
  visible: boolean;
}

export interface HeroAreaCustomization {
  titleEn?: string;
  titleSi?: string;
  badgeText?: string;
  badgeTextSi?: string;
  badgeStyle?: 'amber' | 'urgent-red' | 'editorial-black' | 'clean-outline';
  showLiveBadge?: boolean;
  layoutStyle?: 'classic' | 'banner' | 'split' | 'compact';
  imageAspect?: '16/10' | '16/9' | '4/3' | '21/9' | 'none';
  imageFilter?: 'newspaper' | 'full-color' | 'sepia';
  headlineSize?: 'normal' | 'large' | 'xlarge';
  showExcerpt?: boolean;
  showMeta?: boolean;
  showSecondaryStories?: boolean;
  secondaryCount?: number;
  secondaryLayout?: 'list' | 'grid' | 'compact';
  showZoomButton?: boolean;
  alertBanner?: {
    enabled: boolean;
    textEn: string;
    textSi?: string;
    style?: 'urgent-red' | 'amber' | 'dark';
    linkArticleId?: string;
  };
}

export interface FrontPageAreaConfig {
  mode: 'auto' | 'custom';
  articleIds: string[];
  count?: number;
  titleEn?: string;
  titleSi?: string;
  visible?: boolean;
}

export interface FrontPageLayout {
  id: string;
  heroMainId: string;
  heroSecondaryIds: string[];
  heroCustomization?: HeroAreaCustomization;
  latestArticlesArea?: FrontPageAreaConfig;
  mostPopularArea?: FrontPageAreaConfig;
  dailyFeedArea?: FrontPageAreaConfig;
  featuredStoriesArea?: FrontPageAreaConfig;
  blocks: FrontPageBlock[];
  sidebarWidgets: {
    id: string;
    type: 'most_read' | 'trending' | 'editors_picks' | 'newsletter' | 'weather' | 'markets';
    label: string;
    visible: boolean;
    order: number;
  }[];
  publishedAt: string;
  scheduledFor?: string;
  name?: string;
}

export interface Edition {
  id: string;
  name: string;
  type: 'morning' | 'evening' | 'weekend' | 'print_replica';
  date: string;
  articleIds: string[];
  publishedAt: string;
  isArchived: boolean;
  coverImage?: string;
  notes?: string;
}

export interface MediaItem {
  id: string;
  url: string;
  name: string;
  size: number; // in bytes
  type: 'image' | 'video';
  credit: string;
  caption: string;
  uploadedAt: string;
  uploadedBy: string;
  dimensions?: string;
}

export interface Comment {
  id: string;
  articleId: string;
  articleTitle?: string;
  name: string;
  email: string;
  body: string;
  status: 'pending' | 'approved' | 'rejected' | 'spam';
  createdAt: string;
  reported: boolean;
  reportCount?: number;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name?: string;
  subscribedAt: string;
  active: boolean;
  status: 'confirmed' | 'pending';
}

export interface NewsletterCampaign {
  id: string;
  subject: string;
  previewText: string;
  articleIds: string[];
  customMessage?: string;
  scheduledFor?: string;
  sentAt?: string;
  status: 'draft' | 'scheduled' | 'sent';
  recipientCount?: number;
}

export interface SiteSettings {
  general: {
    newspaperName: string;
    tagline: string;
    mastheadLogoUrl: string;
    mobileLogoUrl: string;
    faviconUrl: string;
    dateFormat: 'standard' | 'formal' | 'compact' | 'iso';
    timeZone: string;
    contactEmail: string;
    address: string;
  };
  appearance: {
    primaryColor: string;
    accentColor: string;
    breakingRed: string;
    backgroundColor: string;
    headlineFont: 'Playfair Display' | 'Merriweather' | 'Cinzel' | 'Georgia' | 'Inter';
    bodyFont: 'Merriweather' | 'Lora' | 'Inter' | 'Roboto' | 'Newsreader';
    defaultTheme: 'light' | 'dark' | 'sepia';
    mastheadStyle: 'classic_centered' | 'modern_left' | 'minimal';
    articleDensity: 'compact' | 'comfortable' | 'spacious';
  };
  layout: {
    showBreakingTicker: boolean;
    tickerStyle: 'marquee' | 'static_red' | 'minimal';
    showHero: boolean;
    showDailyFeed: boolean;
    showOpinion: boolean;
    showMostRead: boolean;
    showTrending: boolean;
    showNewsletterWidget: boolean;
    showWeatherWidget: boolean;
    showMarketsWidget: boolean;
    leadStoryId?: string;
  };
  navigation: {
    id: string;
    label: string;
    labelSi?: string;
    url: string;
    isExternal: boolean;
    order: number;
    hasMegaMenu: boolean;
  }[];
  footer: {
    aboutText: string;
    copyrightText: string;
    socialLinks: {
      twitter?: string;
      facebook?: string;
      instagram?: string;
      youtube?: string;
    };
    legalLinks: {
      label: string;
      url: string;
    }[];
    showNewsletterBox: boolean;
    companyInfo: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    ogImageUrl: string;
    googleAnalyticsId: string;
    googleNewsSitemap: boolean;
    rssFeedEnabled: boolean;
    robotsTxt: string;
    enableAmp: boolean;
  };
}

export interface ActivityLog {
  id: string;
  userId: string;
  userName: string;
  userRole: StaffRole;
  action: 'create' | 'update' | 'delete' | 'publish' | 'review' | 'approve' | 'archive' | 'settings_change' | 'login';
  targetType: 'article' | 'breaking_news' | 'front_page' | 'edition' | 'section' | 'staff' | 'comment' | 'settings' | 'media';
  targetId: string;
  targetTitle?: string;
  timestamp: string;
  details?: string;
}
