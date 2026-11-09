export type Language = 'en' | 'si';

export interface TranslationStrings {
  // Common & Navigation
  siteTitle: string;
  siteSubtitle: string;
  dailyEdition: string;
  showToday: string;
  show2017: string;
  dateClassic: string;
  navHome: string;
  navCultural: string;
  navInspirational: string;
  navPolitics: string;
  navTechnology: string;
  navSports: string;
  navFashion: string;
  navFood: string;
  navShortcodes: string;
  navPostTypes: string;
  navContacts: string;
  navOpinion: string;
  searchPlaceholder: string;
  searchButton: string;
  clearFilter: string;
  filteredView: string;
  categoryLabel: string;
  tagLabel: string;

  // Columns
  breakingNewsTitle: string;
  liveBadge: string;
  readMore: string;
  viewStory: string;
  zoomImage: string;
  byAuthor: string;
  commentsCount: string;

  // Left Sidebar
  latestArticlesTitle: string;
  recommendedTitle: string;
  mostPopularTitle: string;
  advertisingTitle: string;
  sponsoredBadge: string;
  visitAdvertiser: string;
  adVertical: string;
  adRectangle: string;
  adDimensions: string;
  topSearchesTitle: string;

  // Daily Feed
  dailyFeedTitle: string;
  inCategory: string;
  viewMorePosts: string;

  // Featured Stories
  featuredStoriesTitle: string;
  newsletterTitle: string;
  newsletterSubtitle: string;
  newsletterPlaceholder: string;
  newsletterButton: string;
  newsletterSuccess: string;

  // Footer
  footerReaderTitle: string;
  footerNewsTitle: string;
  footerOpinionTitle: string;
  footerPopularTitle: string;
  footerRights: string;

  // Reader Modal
  readTimeLabel: string;
  shareArticle: string;
  shareThisStory: string;
  shareOnFacebook: string;
  shareOnTwitter: string;
  shareOnWhatsApp: string;
  shareOnLinkedIn: string;
  shareOnTelegram: string;
  shareOnReddit: string;
  shareOnPinterest: string;
  shareOnThreads: string;
  shareViaEmail: string;
  copyArticleLink: string;
  linkCopied: string;
  designSocialPost: string;
  designPostCard: string;
  downloadPostImage: string;
  copyPostImage: string;
  imageCopied: string;
  copyCaption: string;
  captionCopied: string;
  bookmarkArticle: string;
  printArticle: string;
  closeModal: string;
  viewHighRes: string;
  filedUnder: string;
  readerDiscussion: string;
  joinConversation: string;
  yourNamePlaceholder: string;
  commentPlaceholder: string;
  postCommentButton: string;
  justNow: string;

  // Search Modal
  suggestedSearches: string;
  noArticlesFound: string;
  foundArticles: string;
  articleSingular: string;
  articlePlural: string;
}

export const TRANSLATIONS: Record<Language, TranslationStrings> = {
  en: {
    siteTitle: 'Pradeep Wijerathnasekara',
    siteSubtitle: 'EDUCATIONAL BLOG',
    dailyEdition: "TODAY'S EDITION",
    showToday: 'TODAY',
    show2017: 'TODAY',
    dateClassic: new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }).format(new Date()),
    navHome: 'HOME',
    navCultural: 'CULTURAL',
    navInspirational: 'INSPIRATIONAL',
    navPolitics: 'POLITICS',
    navTechnology: 'TECHNOLOGY',
    navSports: 'SPORTS',
    navFashion: 'FASHION',
    navFood: 'FOOD',
    navShortcodes: 'SHORTCODES',
    navPostTypes: 'POST TYPES',
    navContacts: 'CONTACTS',
    navOpinion: 'THE OPINION PAGES',
    searchPlaceholder: 'Search news, archives, topics, or authors...',
    searchButton: 'Search',
    clearFilter: 'Clear Filter',
    filteredView: 'Filtered view:',
    categoryLabel: 'Category',
    tagLabel: 'Tag',

    breakingNewsTitle: 'Breaking News',
    liveBadge: 'LIVE',
    readMore: 'READ MORE',
    viewStory: 'VIEW STORY ↗',
    zoomImage: 'ZOOM',
    byAuthor: 'BY',
    commentsCount: 'Comments',

    latestArticlesTitle: 'LATEST ARTICLES',
    recommendedTitle: 'RECOMMENDED',
    mostPopularTitle: 'MOST POPULAR',
    advertisingTitle: 'ADVERTISING',
    sponsoredBadge: 'SPONSORED',
    visitAdvertiser: 'VISIT ADVERTISER',
    adVertical: 'VERTICAL',
    adRectangle: 'RECTANGLE',
    adDimensions: '(240X400)',
    topSearchesTitle: 'TOP SEARCHES',

    dailyFeedTitle: 'Daily Feed',
    inCategory: 'IN',
    viewMorePosts: 'VIEW MORE POSTS',

    featuredStoriesTitle: 'Featured Stories',
    newsletterTitle: 'Sign up for the Educational Newsletter:',
    newsletterSubtitle: 'Curated morning briefings, pedagogical research, and academic articles.',
    newsletterPlaceholder: 'Your email address',
    newsletterButton: 'SIGN UP',
    newsletterSuccess: 'Thank you for subscribing to Pradeep Wijerathnasekara Educational Blog.',

    footerReaderTitle: 'Reader Center',
    footerNewsTitle: 'NEWS',
    footerOpinionTitle: 'OPINION',
    footerPopularTitle: 'MOST POPULAR',
    footerRights: `Pradeep Wijerathnasekara Educational Blog © ${new Date().getFullYear()} | All Rights Reserved`,

    readTimeLabel: 'read',
    shareArticle: 'Share article',
    shareThisStory: 'Share this story:',
    shareOnFacebook: 'Facebook',
    shareOnTwitter: 'X / Twitter',
    shareOnWhatsApp: 'WhatsApp',
    shareOnLinkedIn: 'LinkedIn',
    shareOnTelegram: 'Telegram',
    shareOnReddit: 'Reddit',
    shareOnPinterest: 'Pinterest',
    shareOnThreads: 'Threads',
    shareViaEmail: 'Email',
    copyArticleLink: 'Copy Link',
    linkCopied: 'Link copied!',
    designSocialPost: 'Design Social Post',
    designPostCard: 'Design Social Card with Hero Image',
    downloadPostImage: 'Download Post Graphic (PNG)',
    copyPostImage: 'Copy Image',
    imageCopied: 'Image copied to clipboard!',
    copyCaption: 'Copy Caption',
    captionCopied: 'Caption copied!',
    bookmarkArticle: 'Bookmark article',
    printArticle: 'Print article',
    closeModal: 'Close',
    viewHighRes: 'VIEW HIGH-RES',
    filedUnder: 'Filed Under:',
    readerDiscussion: 'Reader Discussion',
    joinConversation: 'Join the Conversation',
    yourNamePlaceholder: 'Your Name or Moniker',
    commentPlaceholder: 'Share your respectful thoughts on this story...',
    postCommentButton: 'Post Comment',
    justNow: 'JUST NOW',

    suggestedSearches: 'Suggested Searches',
    noArticlesFound: 'No matching articles found for',
    foundArticles: 'Found',
    articleSingular: 'article',
    articlePlural: 'articles',
  },
  si: {
    siteTitle: 'ප්‍රදීප් විජේරත්නසේකර',
    siteSubtitle: 'අධ්‍යාපනික බ්ලොග් අඩවිය (EDUCATIONAL BLOG)',
    dailyEdition: 'අද සංස්කරණය',
    showToday: 'අද දිනය',
    show2017: 'අද දිනය',
    dateClassic: new Intl.DateTimeFormat('si-LK', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date()),
    navHome: 'මුල් පිටුව',
    navCultural: 'සංස්කෘතික',
    navInspirational: 'ප්‍රබෝධාත්මක',
    navPolitics: 'දේශපාලන',
    navTechnology: 'තාක්ෂණය',
    navSports: 'ක්‍රීඩා',
    navFashion: 'විලාසිතා',
    navFood: 'ආහාර පාන',
    navShortcodes: 'කෙටි කේත',
    navPostTypes: 'පුවත් ආකෘති',
    navContacts: 'සබඳතා',
    navOpinion: 'විමර්ශන හා මත',
    searchPlaceholder: 'පුවත්, ලේඛනාගාර, මාතෘකා හෝ ලේඛකයන් සොයන්න...',
    searchButton: 'සොයන්න',
    clearFilter: 'පෙරහන ඉවත් කරන්න',
    filteredView: 'පෙරහන් කළ දැක්ම:',
    categoryLabel: 'ප්‍රවර්ගය',
    tagLabel: 'ටැගය',

    breakingNewsTitle: 'උණුසුම් පුවත්',
    liveBadge: 'සජීවී',
    readMore: 'තව කියවන්න',
    viewStory: 'පුවත කියවන්න ↗',
    zoomImage: 'විශාලනය',
    byAuthor: 'ලේඛක',
    commentsCount: 'අදහස්',

    latestArticlesTitle: 'නවතම ලිපි',
    recommendedTitle: 'නිර්දේශිත',
    mostPopularTitle: 'වඩාත් ජනප්‍රිය',
    advertisingTitle: 'දැන්වීම්',
    sponsoredBadge: 'අනුග්‍රාහක',
    visitAdvertiser: 'වෙළෙඳ දැන්වීම බලන්න',
    adVertical: 'සිරස්',
    adRectangle: 'සෘජුකෝණාස්‍රය',
    adDimensions: '(240X400)',
    topSearchesTitle: 'නිතර සෙවූ මාතෘකා',

    dailyFeedTitle: 'දෛනික පුවත් සංග්‍රහය',
    inCategory: 'අංශය',
    viewMorePosts: 'තවත් ලිපි බලන්න',

    featuredStoriesTitle: 'විශේෂාංග ලිපි',
    newsletterTitle: 'ස්පොට්ලයිට් පුවත් සංග්‍රහයට එක්වන්න:',
    newsletterSubtitle: 'උදෑසන සංක්ෂිප්ත පුවත්, විමර්ශනාත්මක විශ්ලේෂණ සහ සංස්කෘතික විශේෂාංග.',
    newsletterPlaceholder: 'ඔබගේ විද්‍යුත් තැපැල් ලිපිනය',
    newsletterButton: 'ලියාපදිංචි වන්න',
    newsletterSuccess: 'ප්‍රදීප් විජේරත්නසේකර අධ්‍යාපනික බ්ලොග් අඩවිය වෙත ලියාපදිංචි වීම පිළිබඳව ස්තූතියි.',

    footerReaderTitle: 'පාඨක සේවා',
    footerNewsTitle: 'පුවත්',
    footerOpinionTitle: 'මත විමසුම්',
    footerPopularTitle: 'වඩාත් ජනප්‍රිය',
    footerRights: `ප්‍රදීප් විජේරත්නසේකර © ${new Date().getFullYear()} | සියලු හිමිකම් ඇවිරිණි`,

    readTimeLabel: 'කියවීමට',
    shareArticle: 'ලිපිය බෙදාහරින්න',
    shareThisStory: 'මෙම ලිපිය බෙදාහරින්න:',
    shareOnFacebook: 'Facebook',
    shareOnTwitter: 'X / Twitter',
    shareOnWhatsApp: 'WhatsApp',
    shareOnLinkedIn: 'LinkedIn',
    shareOnTelegram: 'Telegram',
    shareOnReddit: 'Reddit',
    shareOnPinterest: 'Pinterest',
    shareOnThreads: 'Threads',
    shareViaEmail: 'Email',
    copyArticleLink: 'ලින්ක් එක කොපි කරන්න',
    linkCopied: 'සබැඳිය පිටපත් විය!',
    designSocialPost: 'පෝස්ටුවක් නිර්මාණය කරන්න',
    designPostCard: 'ප්‍රධාන ඡායාරූපය සහිත පෝස්ටුවක් නිර්මාණය කරන්න',
    downloadPostImage: 'පෝස්ටු ඡායාරූපය බාගත කරන්න (PNG)',
    copyPostImage: 'ඡායාරූපය පිටපත් කරන්න',
    imageCopied: 'ඡායාරූපය පිටපත් විය!',
    copyCaption: 'විස්තරය පිටපත් කරන්න',
    captionCopied: 'විස්තරය පිටපත් විය!',
    bookmarkArticle: 'සුරකින්න',
    printArticle: 'මුද්‍රණය කරන්න',
    closeModal: 'වසන්න',
    viewHighRes: 'පැහැදිලි ඡායාරූපය',
    filedUnder: 'අදාළ මාතෘකා:',
    readerDiscussion: 'පාඨක අදහස්',
    joinConversation: 'ඔබේ අදහස එක් කරන්න',
    yourNamePlaceholder: 'ඔබගේ නම',
    commentPlaceholder: 'මෙම පුවත පිළිබඳ ඔබේ ගෞරවනීය අදහස මෙහි සටහන් කරන්න...',
    postCommentButton: 'අදහස පළ කරන්න',
    justNow: 'මීට සුළු මොහොතකට පෙර',

    suggestedSearches: 'යෝජිත සෙවුම් මාතෘකා',
    noArticlesFound: 'සඳහා කිසිදු ලිපියක් හමු නොවීය',
    foundArticles: 'හමු වූ ලිපි ගණන',
    articleSingular: 'ලිපියකි',
    articlePlural: 'ලිපි',
  },
};

// Sinhala Category Translations
export const CATEGORY_TRANSLATIONS: Record<string, string> = {
  ALL: 'සියලු පුවත්',
  CULTURAL: 'සංස්කෘතික',
  INSPIRATIONAL: 'ප්‍රබෝධාත්මක',
  POLITICS: 'දේශපාලන',
  TECHNOLOGY: 'තාක්ෂණය',
  SPORTS: 'ක්‍රීඩා',
  FASHION: 'විලාසිතා',
  FOOD: 'ආහාර පාන',
  LIFESTYLE: 'ජීවන රටාව',
  MAIN: 'ප්‍රධාන',
  URBAN: 'නාගරික',
  HISTORY: 'ඉතිහාසය',
  CULTURE: 'සංස්කෘතිය',
  OPINION: 'මත විමසුම්',
  EDUCATION: 'අධ්‍යාපනය',
  EDITORIAL: 'කතුවැකිය',
  TRAVEL: 'සංචාරක',
  SCIENCE: 'විද්‍යාව',
  ARTS: 'කලාව',
  HEALTH: 'සෞඛ්‍ය',
  BUSINESS: 'ව්‍යාපාර',
  WORLD: 'ලෝක පුවත්',
  RECOMMENDED: 'නිර්දේශිත',
  ARCHITECTURE: 'ගෘහ නිර්මාණ',
  URBANISM: 'නාගරීකරණය',
};

// Sinhala Footer Links Mapping
export const FOOTER_LINKS_SI = {
  reader: [
    'පාඨක මධ්‍යස්ථානය',
    'සේවා සහ මෙවලම්',
    'ටයිම්ස් මාතෘකා',
    'සිදුවීම් මගපෙන්වීම',
    'අධ්‍යාපනික සංචාර',
    'ද නිව්ස්පේපර් දායකත්වය',
    'අපගේ සබඳතා'
  ],
  news: [
    'කලාව හා සංස්කෘතිය',
    'ආර්ථිකය හා මූල්‍ය',
    'විලාසිතා හා රූපලාවණ්‍ය',
    'ආහාර හා සූපවේදය',
    'සෞඛ්‍ය හා යහපැවැත්ම',
    'ජීවන රටාව',
    'දේශපාලන විග්‍රහ',
    'විද්‍යා හා පර්යේෂණ',
    'දේශීය හා ජාත්‍යන්තර ක්‍රීඩා',
    'නව තාක්ෂණය',
    'සංචාරක තොරතුරු'
  ],
  opinion: [
    'අද දවසේ මතය',
    'විශේෂ තීරු ලිපි',
    'කතුවැකි සටහන්',
    'බාහිර ලේඛක මඬුල්ල',
    'පාඨක අදහස් හා ප්‍රතිචාර',
    'විචාරාත්මක අතිරේකය',
    'කර්තෘ වෙත ලිපි',
    'ඉරිදා සංග්‍රහය',
    'සංවාද මණ්ඩපය',
    'ප්‍රසිද්ධ කතිකාව',
    'මහජන සංස්කාරක'
  ],
  mostPopular: [
    'කලාව සහ සැලසුම්',
    'ලෝක පුවත්',
    'බ්ලොග් විශේෂාංග',
    'ව්‍යාපාරික තොරතුරු',
    'සංස්කෘතිය',
    'ජීවන රටාව',
    'නිව්යෝර්ක් පුවත්',
    'ද නිව්ස්පේපර් මුද්‍රණය',
    'ඡායාරූප විශේෂාංග',
    'ප්‍රධාන සිරස්තල'
  ]
};

// Sinhala Top Searches Mapping
export const TOP_SEARCHES_TAGS_SI = [
  'කලාව හා මෝස්තර',
  'බ්ලොග්',
  'ව්‍යාපාර',
  'සංස්කෘතිය',
  'ආර්ථිකය',
  'සෞඛ්‍ය',
  'ජීවන රටාව',
  'සිනමාව',
  'එන්.වයි.',
  'පුවත්පත',
  'ශෝක ප්‍රකාශ',
  'ඡායාරූප',
  'දේශපාලන',
  'පෝස්ට්',
  'විද්‍යාව',
  'ක්‍රීඩා',
  'තාක්ෂණ',
  'අද දවසේ කලාව',
  'සංචාරක',
  'ඇමෙරිකාව',
  'වීඩියෝ',
  'ලෝකය'
];

// Sinhala Latest Article Titles Mapping
export const LATEST_ARTICLES_TITLES_SI = [
  'පෙන්සිල්වේනියාවේ ග්‍රීෂ්ම මංගලෝත්සව සඳහා විශිෂ්ට සූපවේදී සේවාවන්',
  'ඔබ කිසිදා අසා නැති විශිෂ්ටතම විශ්වවිද්‍යාල පාපන්දු කණ්ඩායම',
  'බෘක්ලින් පාලම ඉදිකිරීම: ඇමෙරිකානු ඉංජිනේරු ශිල්පයේ අභිමානය',
  'බ්‍රෝඩ්වේ නාට්‍ය කලාවේ පුනරුදය: නව යුගයක වේදිකා ආලෝකය',
  'මෙට්‍රෝ කාඩ්පතේ සිට ඩිජිටල් ගෙවීම් දක්වා: නිව්යෝර්ක් උමං දුම්රිය ගමන',
  'ෆිලඩෙල්ෆියාවේ ඓතිහාසික සූපවේදය: පාරම්පරික රසය හා නවමු අත්දැකීම්',
  'මහජන පාසල් අධ්‍යාපන ප්‍රතිසංස්කරණ: අනාගත පරපුරට නව මඟක්',
  'නවීන කලා කෞතුකාගාරයේ ඓතිහාසික ප්‍රදර්ශනයක්',
  'ඇල්ප්ස් කඳු තරණ චාරිකාව: ස්වභාවධර්මයේ අභියෝගය ජය ගැනීම',
  'පැරණි කැමරා සහ ඇනලොග් ඡායාරූප කලාවේ නැවත පැමිණීම'
];
