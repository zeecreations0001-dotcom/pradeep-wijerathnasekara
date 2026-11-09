/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Article,
  BreakingNewsItem,
  Comment,
  Edition,
  FrontPageLayout,
  MediaItem,
  NewsletterSubscriber,
  NewsletterCampaign,
  Section,
  SiteSettings,
  StaffMember,
  StaffRole,
  Tag,
  ActivityLog,
  ReaderUser,
} from '../types/admin';

// Initial Demo Readers
export const INITIAL_READERS: ReaderUser[] = [
  {
    id: 'reader-1',
    name: 'Maya Jin',
    email: 'reader@herald.org',
    password: 'reader123',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
    bio: 'Avid daily reader interested in geopolitics, architecture, and technology innovations.',
    bookmarks: ['art-1', 'art-3'],
    readingHistory: ['art-1', 'art-2'],
    favoriteSections: ['politics', 'tech', 'culture'],
    createdAt: '2024-03-01T10:00:00Z',
  },
  {
    id: 'reader-2',
    name: 'Kasun Bandara',
    email: 'kasun.b@press.lk',
    password: 'reader123',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200',
    bio: 'Economic analyst tracking fiscal policy and maritime logistics.',
    bookmarks: ['art-1', 'art-4'],
    readingHistory: ['art-1'],
    favoriteSections: ['business', 'world'],
    createdAt: '2024-04-15T09:30:00Z',
  },
];

// Initial Demo Staff Accounts
export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'staff-admin-1',
    name: 'Eleanor Vance',
    email: 'admin@herald.org',
    password: 'admin123',
    role: 'super_admin',
    bio: 'Editor-in-Chief with 22 years of investigative journalism experience across international newsrooms.',
    headshot: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=400',
    sections: ['all'],
    socialLinks: { twitter: '@evance_herald', linkedin: 'eleanor-vance-press' },
    active: true,
    createdAt: '2024-01-15T08:00:00Z',
  },
  {
    id: 'staff-editor-1',
    name: 'Marcus Holloway',
    email: 'editor@herald.org',
    password: 'editor123',
    role: 'editor',
    bio: 'Senior Managing Editor heading Politics and World desks. Former foreign correspondent in Brussels.',
    headshot: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=400',
    sections: ['politics', 'world', 'business'],
    socialLinks: { twitter: '@mholloway_news' },
    active: true,
    createdAt: '2024-02-01T09:30:00Z',
  },
  {
    id: 'staff-reporter-1',
    name: 'Sofia Al-Mansoor',
    email: 'reporter@herald.org',
    password: 'reporter123',
    role: 'reporter',
    bio: 'Technology & Science staff reporter focusing on AI ethics, quantum computing, and clean tech.',
    headshot: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    sections: ['tech', 'science'],
    socialLinks: { twitter: '@sofia_techwatch' },
    active: true,
    createdAt: '2024-03-10T11:00:00Z',
  },
  {
    id: 'staff-contrib-1',
    name: 'Julian Sterling',
    email: 'contributor@herald.org',
    password: 'reporter123',
    role: 'contributor',
    bio: 'Guest columnist and culture critic contributing book critiques and architecture essays.',
    headshot: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=400',
    sections: ['culture', 'opinion'],
    socialLinks: { website: 'https://juliansterling.ink' },
    active: true,
    createdAt: '2024-04-12T14:15:00Z',
  },
];

// Initial Newsroom Sections
export const INITIAL_SECTIONS: Section[] = [
  {
    id: 'world',
    name: 'World',
    nameSi: 'ලෝකය',
    slug: 'world',
    description: 'Global affairs, geopolitics, international diplomacy and cross-border developments.',
    color: '#1e3a8a',
    order: 1,
    editorId: 'staff-editor-1',
    heroImage: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'politics',
    name: 'Politics',
    nameSi: 'දේශපාලන',
    slug: 'politics',
    description: 'Parliamentary debates, policy announcements, electoral analysis, and state governance.',
    color: '#991b1b',
    order: 2,
    editorId: 'staff-editor-1',
    heroImage: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'business',
    name: 'Business',
    nameSi: 'ව්‍යාපාරික',
    slug: 'business',
    description: 'Financial markets, macroeconomics, trade policies, startup ventures, and commodities.',
    color: '#065f46',
    order: 3,
    heroImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'tech',
    name: 'Technology',
    nameSi: 'තාක්ෂණය',
    slug: 'tech',
    description: 'Computing breakthroughs, artificial intelligence, cyber security, and consumer electronics.',
    color: '#4c1d95',
    order: 4,
    editorId: 'staff-reporter-1',
    heroImage: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'sports',
    name: 'Sports',
    nameSi: 'ක්‍රීඩා',
    slug: 'sports',
    description: 'Cricket, rugby, international athletics, football championships, and local tournaments.',
    color: '#c2410c',
    order: 5,
    heroImage: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'culture',
    name: 'Culture',
    nameSi: 'සංස්කෘතිය',
    slug: 'culture',
    description: 'Arts, heritage preservation, literature, music, cinema, and culinary traditions.',
    color: '#831843',
    order: 6,
    heroImage: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?auto=format&fit=crop&q=80&w=1200',
  },
  {
    id: 'opinion',
    name: 'Opinion',
    nameSi: 'මතවාද',
    slug: 'opinion',
    description: 'Editorial commentary, guest columns, debate forums, and analytical perspectives.',
    color: '#374151',
    order: 7,
    heroImage: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=1200',
  },
];

export const INITIAL_TAGS: Tag[] = [
  { id: 't1', name: 'AI Regulation', slug: 'ai-regulation' },
  { id: 't2', name: 'Global Economy', slug: 'global-economy' },
  { id: 't3', name: 'Energy Transition', slug: 'energy-transition' },
  { id: 't4', name: 'Cricket World Cup', slug: 'cricket-world-cup' },
  { id: 't5', name: 'Colombo Port', slug: 'colombo-port' },
  { id: 't6', name: 'Cybersecurity', slug: 'cybersecurity' },
  { id: 't7', name: 'Heritage Sites', slug: 'heritage-sites' },
  { id: 't8', name: 'Public Health', slug: 'public-health' },
];

export const INITIAL_BREAKING_NEWS: BreakingNewsItem[] = [
  {
    id: 'bn-1',
    headline: 'Global Climate Summit announces landmark treaty on renewable microgrid adoption across South Asia',
    headlineSi: 'දකුණු ආසියාවේ පුනර්ජනනීය බලශක්ති පද්ධති ප්‍රවර්ධනය සඳහා ඓතිහාසික ගෝලීය දේශගුණ සම්මුතියකට අත්සන් තැබේ',
    articleId: 'art-1',
    expiresAt: new Date(Date.now() + 18 * 3600 * 1000).toISOString(),
    order: 1,
    active: true,
    priority: 'urgent',
  },
  {
    id: 'bn-2',
    headline: 'Central Bank releases third quarter economic forecast projecting 4.2% real GDP rebound',
    headlineSi: 'තෙවන කාර්තුවේ ආර්ථික වර්ධනය 4.2% ක් වනු ඇතැයි මහ බැංකුව පුරෝකථනය කරයි',
    articleId: 'art-2',
    expiresAt: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    order: 2,
    active: true,
    priority: 'high',
  },
  {
    id: 'bn-3',
    headline: 'Major telecom fiber optic undersea link repaired ahead of schedule, restoring full regional speeds',
    headlineSi: 'මුහුදු පතුල හරහා දිවෙන ප්‍රධාන විදුලි සංදේශ සන්නිවේදන රැහැන් පද්ධතිය කඩිනමින් යථා තත්ත්වයට',
    articleId: 'art-3',
    expiresAt: new Date(Date.now() + 12 * 3600 * 1000).toISOString(),
    order: 3,
    active: true,
    priority: 'flash',
  },
];

export const INITIAL_ARTICLES: Article[] = [
  {
    id: 'art-1',
    headline: 'The Grand Maritime Accord: Modern Shipping Routes Redraw Global Logistics',
    subheadline: 'Diplomatic breakthroughs in deepwater port treaties set a new standard for transshipment hubs.',
    slug: 'grand-maritime-accord-shipping-routes',
    reporterId: 'staff-editor-1',
    reporterName: 'Marcus Holloway',
    dateline: 'COLOMBO / SINGAPORE',
    sectionId: 'business',
    subsection: 'Maritime Trade',
    priorityTag: 'exclusive',
    featuredImage: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=1200',
    imageCaption: 'Container carriers docked along deepwater quays under evening loading operations.',
    imageCredit: 'The Herald / World Trade Press',
    excerpt: 'A comprehensive inter-governmental agreement signed this morning establishes streamlined green maritime corridors, reducing cargo turnarounds by 38% across the Indian Ocean.',
    content: `<p>A comprehensive inter-governmental agreement signed early this morning establishes streamlined green maritime corridors across the Indian Ocean basin, reducing vessel transit idle times by nearly two-fifths.</p>
<h2>Unifying Regional Port Operations</h2>
<p>Representatives from twelve maritime nations concluded four weeks of intense multilateral negotiations. The accord standardizes customs clearance manifests through cryptographically verified electronic bills of lading.</p>
<blockquote>"We are witnessing the most significant restructuring of commercial shipping lanes in over forty years," noted Minister of Port Developments.</blockquote>
<p>Industry analysts project the newly certified lanes will shave up to 96 hours off standard passage times between East Asian manufacturing hubs and European consumer ports, insulating key supply chains against acute weather disruptions.</p>`,
    tags: ['Global Economy', 'Colombo Port', 'Energy Transition'],
    editorialStatus: 'published',
    createdAt: '2025-05-10T08:00:00Z',
    updatedAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
    views: 14820,
    isSticky: true,
    isLiveBlog: false,
    commentsEnabled: true,
    readingTimeMinutes: 5,
    headlineSi: 'මහා සාගර වෙළෙඳ ගිවිසුම: නූතන නාවික ගමන් මාර්ග ගෝලීය සැපයුම් ජාලය යළි සකස් කරයි',
    excerptSi: 'අද උදෑසන අත්සන් කරන ලද පුළුල් අන්තර් රාජ්‍ය ගිවිසුම හරහා ඉන්දියන් සාගරය ඔස්සේ හරිත නාවික මාර්ග ස්ථාපිත කරමින් බඩු ප්‍රවාහන ප්‍රමාදයන් 38% කින් අඩු කෙරේ.',
  },
  {
    id: 'art-2',
    headline: 'Quantum Neural Arrays Surpass Silicon Benchmarks in Real-Time Weather Modeling',
    subheadline: 'Meteorological institutes begin operational trials of optical crystal processors.',
    slug: 'quantum-neural-arrays-weather-modeling',
    reporterId: 'staff-reporter-1',
    reporterName: 'Sofia Al-Mansoor',
    dateline: 'GENEVA / TOKYO',
    sectionId: 'tech',
    subsection: 'Applied Sciences',
    priorityTag: 'breaking',
    featuredImage: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1200',
    imageCaption: 'Cryogenic quantum processor chamber undergoing calibration before atmospheric simulation runs.',
    imageCredit: 'CERN / Photonics Lab',
    excerpt: 'Researchers have demonstrated instantaneous simulation of atmospheric micro-vortices using optical quantum lattices, enabling 14-day precision forecasting for tropical cyclones.',
    content: `<p>Researchers at the International Meteorological Computation Center have published peer-reviewed validation demonstrating real-time simulation of chaotic atmospheric phenomena with unprecedented fidelity.</p>
<h2>Sub-Kilometer Atmospheric Resolution</h2>
<p>By leveraging photonic entanglement matrices, the computational cluster achieved an 800-fold acceleration over the world's fastest traditional supercomputers.</p>
<p>Emergency response coordinators will now have access to high-confidence flood and typhoon landfall predictions up to two weeks in advance, transforming civil defense preparation.</p>`,
    tags: ['AI Regulation', 'Cybersecurity'],
    editorialStatus: 'published',
    createdAt: '2025-05-11T10:15:00Z',
    updatedAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
    views: 9450,
    isSticky: false,
    isLiveBlog: true,
    liveBlogEntries: [
      {
        id: 'lb-1',
        timestamp: '14:20 GMT',
        headline: 'Consortium Releases Open-Access Benchmark Data',
        content: 'The core mathematical models have been published on public research repositories for peer verification.',
        authorName: 'Sofia Al-Mansoor',
      },
      {
        id: 'lb-2',
        timestamp: '11:05 GMT',
        headline: 'European Space Agency Approves Satellite Data Hookup',
        content: 'Direct downlinks from earth observation satellites will feed the quantum processor cluster by midnight.',
        authorName: 'Sofia Al-Mansoor',
      },
    ],
    commentsEnabled: true,
    readingTimeMinutes: 4,
    headlineSi: 'ක්වොන්ටම් පරිගණක තාක්ෂණය හරහා කාලගුණ අනාවැකිවල නව පෙරළියක්',
    excerptSi: 'සයික්ලෝන් සහ කුණාටු පිළිබඳ දින 14 කට පෙර නිශ්චිත අනාවැකි පළ කිරීමේ ක්වොන්ටම් ආකෘතියක් විද්‍යාඥයින් විසින් සාර්ථකව අත්හදා බලයි.',
  },
  {
    id: 'art-3',
    headline: 'The Revival of Classical Print: Why Independent Letterpress Presses Are Thriving',
    subheadline: 'In an era of disposable digital scrolls, handcrafted typography finds an ardent audience.',
    slug: 'revival-classical-print-letterpress',
    reporterId: 'staff-contrib-1',
    reporterName: 'Julian Sterling',
    dateline: 'LONDON',
    sectionId: 'culture',
    subsection: 'Typography & Design',
    priorityTag: 'analysis',
    featuredImage: 'https://images.unsplash.com/photo-1507842229451-7f01be8610ce?auto=format&fit=crop&q=80&w=1200',
    imageCaption: 'Heidelberg platen press hand-inking movable lead type for a limited edition portfolio.',
    imageCredit: 'The Monotype Guild',
    excerpt: 'Small-batch artisanal print shops report multi-month backlogs as readers gravitate back toward the tactile permanence of ink pressed into rag cotton paper.',
    content: `<p>There is a distinct, rhythmic thud that fills the basement of the venerable Fleet Street foundry. Lead typesets, hand-cast decades before the birth of the internet, bite firmly into heavyweight mould-made paper.</p>
<p>Far from a quaint relic, physical print is experiencing an aesthetic and intellectual renaissance among designers and serious collectors seeking permanence in an age of ephemeral digital notifications.</p>`,
    tags: ['Heritage Sites'],
    editorialStatus: 'published',
    createdAt: '2025-05-09T14:00:00Z',
    updatedAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
    views: 7120,
    isSticky: false,
    isLiveBlog: false,
    commentsEnabled: true,
    readingTimeMinutes: 6,
    headlineSi: 'සම්භාව්‍ය මුද්‍රණ කලාවේ පුනරුදය: ලෙටර්ප්‍රෙස් අකුරු නැවතත් කරළියට',
    excerptSi: 'ඩිජිටල් තිරවල අස්ථිර සටහන් අතර අත්කම් මුද්‍රණ කලාවේ ස්ථිරභාවය සහ සුන්දරත්වය අගයන පාඨක ප්‍රජාවක් යළි බිහිවේ.',
  },
  {
    id: 'art-4',
    headline: 'National Cricket Selection Board Names Balanced Squad for Continental Championship',
    subheadline: 'Mix of pace bowling veterans and exciting spin prodigies named for high-stakes campaign.',
    slug: 'national-cricket-selection-championship',
    reporterId: 'staff-reporter-1',
    reporterName: 'Sofia Al-Mansoor',
    dateline: 'KANDY',
    sectionId: 'sports',
    subsection: 'International Cricket',
    priorityTag: 'developing',
    featuredImage: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?auto=format&fit=crop&q=80&w=1200',
    imageCaption: 'Players undergoing net training and agility drills at the international stadium.',
    imageCredit: 'Sports Media Sri Lanka',
    excerpt: 'The national selection committee unveiled the final 16-member touring roster this afternoon following rigorous training camps in Dambulla.',
    content: `<p>Following weeks of closed-door selection matches, team management confirmed the 16-player traveling contingent.</p>
<p>Captain Sanath Mendis praised the inclusion of two young left-arm spinners who proved match-winners in the domestic first-class league this winter.</p>`,
    tags: ['Cricket World Cup'],
    editorialStatus: 'published',
    createdAt: '2025-05-11T12:00:00Z',
    updatedAt: new Date().toISOString(),
    publishedAt: new Date().toISOString(),
    views: 12200,
    isSticky: false,
    isLiveBlog: false,
    commentsEnabled: true,
    readingTimeMinutes: 3,
    headlineSi: 'මහාද්වීපික ශූරතාවලිය සඳහා ජාතික ක්‍රිකට් සංචිතය නම් කෙරේ',
    excerptSi: 'පළපුරුදු වේග පන්දු යවන්නන් සහ නවක දක්ෂ දඟ පන්දු යවන්නන් ඇතුළත් සාමාජිකයින් 16 දෙනෙකුගෙන් යුත් සංචිතය අද නිල වශයෙන් ප්‍රකාශයට පත් කෙරිණි.',
  },
  {
    id: 'art-5',
    headline: 'Draft Bill on Sovereign Artificial Intelligence Governance Submitted to Parliamentary Oversight',
    subheadline: 'New statutory frameworks mandate strict synthetic media disclosure and training transparency.',
    slug: 'sovereign-ai-governance-bill-oversight',
    reporterId: 'staff-editor-1',
    reporterName: 'Marcus Holloway',
    dateline: 'PARLIAMENT COMPLEX',
    sectionId: 'politics',
    subsection: 'Statutory Law',
    priorityTag: 'standard',
    featuredImage: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&q=80&w=1200',
    imageCaption: 'Parliament chamber during the presentation of the legislative white paper.',
    imageCredit: 'Government Press Bureau',
    excerpt: 'The landmark governance act establishes independent inspection boards for foundation models and guarantees consumer rights against deepfake impersonation.',
    content: `<p>A cross-party parliamentary committee today presented the definitive draft of the Sovereign AI Governance Act.</p>
<p>The statute introduces mandatory cryptographic provenance watermarks for all generative audio, visual, and synthetic journalism outputs published by accredited broadcasters.</p>`,
    tags: ['AI Regulation', 'Cybersecurity'],
    editorialStatus: 'in_review',
    createdAt: '2025-05-11T15:30:00Z',
    updatedAt: new Date().toISOString(),
    views: 310,
    isSticky: false,
    isLiveBlog: false,
    commentsEnabled: true,
    readingTimeMinutes: 5,
    headlineSi: 'කෘතිම බුද්ධිය නියාමනය කිරීමේ නව පනත් කෙටුම්පත පාර්ලිමේන්තුවට',
    excerptSi: 'සමාජ මාධ්‍ය සහ ඩිජිටල් අන්තර්ගතයන්හි විනිවිදභාවය ආරක්ෂා කර ගැනීම සඳහා නව නීති පද්ධතියක් හඳුන්වා දෙනු ලැබේ.',
  },
  {
    id: 'art-6',
    headline: 'Investigative Report: Hidden Offshore Tax Shelters in Caribbean Port Cities',
    subheadline: 'Multi-year whistleblower documents reveal shell company webs obscuring billions in infrastructure kickbacks.',
    slug: 'investigative-offshore-tax-shelters',
    reporterId: 'staff-admin-1',
    reporterName: 'Eleanor Vance',
    dateline: 'SPECIAL INVESTIGATIONS DESK',
    sectionId: 'opinion',
    subsection: 'Special Investigation',
    priorityTag: 'exclusive',
    featuredImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1200',
    imageCaption: 'Financial district towers in downtown Panama City, center of multiple corporate registry networks.',
    imageCredit: 'Investigative Consortium Archive',
    excerpt: 'A four-month data analysis reveals cross-border holding firms used to divert state procurement funds away from public audits.',
    content: `<p>A cache of over 200,000 internal banking ledgers and leaked registrar filings obtained by The Herald reveals a clandestine network of Caribbean shell entities.</p>
<p>The findings implicate twelve major engineering consortia awarded non-competitive tender bids across municipal transport contracts between 2018 and 2024.</p>`,
    tags: ['Global Economy'],
    editorialStatus: 'approved',
    createdAt: '2025-05-11T18:00:00Z',
    updatedAt: new Date().toISOString(),
    views: 120,
    isSticky: false,
    isLiveBlog: false,
    commentsEnabled: true,
    readingTimeMinutes: 8,
    headlineSi: 'විමර්ශනාත්මක වාර්තාව: කැරිබියන් දූපත් ආශ්‍රිත රහස් බදු තෝතැන්න',
    excerptSi: 'රාජ්‍ය සංවර්ධන ව්‍යාපෘති සඳහා වෙන් කළ මුදල් රහසිගත සමාගම් ජාලයක් ඔස්සේ වෙනතකට යොමු කිරීමේ තොරතුරු හෙළිවේ.',
  },
];

export const INITIAL_FRONT_PAGE: FrontPageLayout = {
  id: 'layout-main-current',
  heroMainId: 'art-1',
  heroSecondaryIds: ['art-2', 'art-3', 'art-4'],
  heroCustomization: {
    titleEn: 'Breaking News',
    titleSi: 'උණුසුම් පුවත්',
    badgeText: 'LIVE',
    badgeTextSi: 'සජීවී',
    badgeStyle: 'amber',
    showLiveBadge: true,
    layoutStyle: 'classic',
    imageAspect: '16/10',
    imageFilter: 'newspaper',
    headlineSize: 'large',
    showExcerpt: true,
    showMeta: true,
    showSecondaryStories: true,
    secondaryCount: 2,
    secondaryLayout: 'list',
    showZoomButton: true,
    alertBanner: {
      enabled: false,
      textEn: 'Developing story: Updates continuously verified by our Colombo editorial team.',
      textSi: 'නවතම තොරතුරු: අපගේ කොළඹ කර්තෘ මණ්ඩලය විසින් තහවුරු කරනු ලබයි.',
      style: 'urgent-red',
    },
  },
  latestArticlesArea: {
    mode: 'custom',
    articleIds: ['art-1', 'art-2', 'art-3', 'art-4', 'catering-summer-wedding', 'college-football-team'],
    count: 6,
    titleEn: 'Latest Articles',
    titleSi: 'නවතම ලිපි',
    visible: true,
  },
  mostPopularArea: {
    mode: 'custom',
    articleIds: ['art-2', 'art-1', 'college-football-team', 'art-3', 'catering-summer-wedding'],
    count: 5,
    titleEn: 'Most Popular',
    titleSi: 'වඩාත් ජනප්‍රිය',
    visible: true,
  },
  dailyFeedArea: {
    mode: 'custom',
    articleIds: ['art-1', 'art-2', 'art-3', 'art-4', 'catering-summer-wedding', 'college-football-team', 'vintage-camera', 'fashion-week'],
    count: 8,
    titleEn: 'Daily Feed',
    titleSi: 'දවසේ තොරතුරු',
    visible: true,
  },
  featuredStoriesArea: {
    mode: 'custom',
    articleIds: ['art-3', 'catering-summer-wedding', 'college-football-team', 'art-1', 'art-4', 'art-2'],
    count: 6,
    titleEn: 'Featured Stories',
    titleSi: 'විශේෂාංග ලිපි',
    visible: true,
  },
  blocks: [
    {
      id: 'block-world',
      sectionId: 'world',
      title: 'World Dispatch',
      style: 'card',
      articleCount: 4,
      customArticleIds: [],
      autoPopulateLatest: true,
      order: 1,
      visible: true,
    },
    {
      id: 'block-business',
      sectionId: 'business',
      title: 'Financial Markets & Trade',
      style: 'image-first',
      articleCount: 3,
      customArticleIds: ['art-1'],
      autoPopulateLatest: true,
      order: 2,
      visible: true,
    },
    {
      id: 'block-tech',
      sectionId: 'tech',
      title: 'Technology & Silicon',
      style: 'grid',
      articleCount: 4,
      customArticleIds: ['art-2'],
      autoPopulateLatest: true,
      order: 3,
      visible: true,
    },
    {
      id: 'block-sports',
      sectionId: 'sports',
      title: 'Sports Arena',
      style: 'list',
      articleCount: 3,
      customArticleIds: ['art-4'],
      autoPopulateLatest: true,
      order: 4,
      visible: true,
    },
  ],
  sidebarWidgets: [
    { id: 'w-most-read', type: 'most_read', label: 'Most Read Today', visible: true, order: 1 },
    { id: 'w-trending', type: 'trending', label: 'Trending Topics', visible: true, order: 2 },
    { id: 'w-editors-picks', type: 'editors_picks', label: "Editor's Recommendations", visible: true, order: 3 },
    { id: 'w-newsletter', type: 'newsletter', label: 'Morning Briefing Signup', visible: true, order: 4 },
    { id: 'w-weather', type: 'weather', label: 'Colombo & Regional Weather', visible: true, order: 5 },
    { id: 'w-markets', type: 'markets', label: 'Stock & Currency Ticker', visible: true, order: 6 },
  ],
  publishedAt: new Date().toISOString(),
  name: 'Standard Daily Front Page',
};

export const INITIAL_EDITIONS: Edition[] = [
  {
    id: 'ed-today-morning',
    name: 'Morning City Edition',
    type: 'morning',
    date: new Date().toISOString().split('T')[0],
    articleIds: ['art-1', 'art-2', 'art-3', 'art-4'],
    publishedAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
    isArchived: false,
    coverImage: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=800',
    notes: 'Primary morning distribution featuring the Maritime Accord and Quantum processor breakthroughs.',
  },
  {
    id: 'ed-yesterday-evening',
    name: 'Late Evening Chronicle',
    type: 'evening',
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    articleIds: ['art-1', 'art-3'],
    publishedAt: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
    isArchived: true,
    coverImage: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800',
    notes: 'Wrap-up of overnight European market closing benchmarks and domestic legislature speeches.',
  },
];

export const INITIAL_MEDIA: MediaItem[] = [
  {
    id: 'med-1',
    url: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&q=80&w=1200',
    name: 'colombo_deepwater_port_night.jpg',
    size: 2489000,
    type: 'image',
    credit: 'The Herald Photo Desk',
    caption: 'Night gantry operations at the southern transshipment terminal.',
    uploadedAt: '2025-05-10T07:15:00Z',
    uploadedBy: 'Marcus Holloway',
    dimensions: '1920x1080',
  },
  {
    id: 'med-2',
    url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=1200',
    name: 'quantum_lattice_core.jpg',
    size: 3120000,
    type: 'image',
    credit: 'CERN Photonics Archive',
    caption: 'Cryogenic quantum processor core during optical alignment.',
    uploadedAt: '2025-05-11T09:40:00Z',
    uploadedBy: 'Sofia Al-Mansoor',
    dimensions: '2400x1600',
  },
  {
    id: 'med-3',
    url: 'https://images.unsplash.com/photo-1507842229451-7f01be8610ce?auto=format&fit=crop&q=80&w=1200',
    name: 'fleet_street_letterpress.jpg',
    size: 1940000,
    type: 'image',
    credit: 'Guild of Master Printers',
    caption: 'Handset metal typography lockup on stone imposing table.',
    uploadedAt: '2025-05-09T13:20:00Z',
    uploadedBy: 'Julian Sterling',
    dimensions: '1600x1200',
  },
];

export const INITIAL_COMMENTS: Comment[] = [
  {
    id: 'comm-1',
    articleId: 'art-1',
    articleTitle: 'The Grand Maritime Accord: Modern Shipping Routes Redraw Global Logistics',
    name: 'Captain Ranjit Silva',
    email: 'ranjit.silva@maritimelogistics.lk',
    body: 'The transshipment fee reduction will stimulate dry-dock repair services immensely. A very well-researched article.',
    status: 'approved',
    createdAt: '2025-05-10T11:30:00Z',
    reported: false,
  },
  {
    id: 'comm-2',
    articleId: 'art-2',
    articleTitle: 'Quantum Neural Arrays Surpass Silicon Benchmarks in Real-Time Weather Modeling',
    name: 'Dr. Aruna Perera',
    email: 'aruna.perera@metdept.gov.lk',
    body: 'Can the author clarify whether the optical crystal processor operates at room temperature or requires liquid helium coolant?',
    status: 'pending',
    createdAt: '2025-05-11T13:45:00Z',
    reported: false,
  },
  {
    id: 'comm-3',
    articleId: 'art-3',
    articleTitle: 'The Revival of Classical Print: Why Independent Letterpress Presses Are Thriving',
    name: 'Spam Bot 3000',
    email: 'get-crypto-free@fakeblast.com',
    body: 'BUY BITCOIN 1000X LEVERAGE TODAY ONLY CLICK LINK HERE!',
    status: 'spam',
    createdAt: '2025-05-11T14:10:00Z',
    reported: true,
    reportCount: 3,
  },
];

export const INITIAL_SUBSCRIBERS: NewsletterSubscriber[] = [
  {
    id: 'sub-1',
    email: 'sarah.connor@pressreader.com',
    name: 'Sarah Connor',
    subscribedAt: '2024-11-12T09:00:00Z',
    active: true,
    status: 'confirmed',
  },
  {
    id: 'sub-2',
    email: 'dinesh.jayawardene@colombotrade.org',
    name: 'Dinesh Jayawardene',
    subscribedAt: '2025-01-05T14:20:00Z',
    active: true,
    status: 'confirmed',
  },
  {
    id: 'sub-3',
    email: 'claire.bennett@reutersarchive.net',
    name: 'Claire Bennett',
    subscribedAt: '2025-02-18T16:45:00Z',
    active: true,
    status: 'confirmed',
  },
  {
    id: 'sub-4',
    email: 'kamal.fernando@ceylonchamber.lk',
    name: 'Kamal Fernando',
    subscribedAt: '2025-03-01T10:10:00Z',
    active: true,
    status: 'confirmed',
  },
];

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  general: {
    newspaperName: 'Pradeep Wijerathnasekara',
    tagline: 'Educational Blog — Academic Insights, Pedagogy & Technology in Education',
    mastheadLogoUrl: '/assets/aistudio/Logo_W2.jpg_741157ec.jpeg',
    mobileLogoUrl: '/assets/aistudio/Logo_W2.jpg_741157ec.jpeg',
    faviconUrl: '/assets/aistudio/Logo_W2.jpg_741157ec.jpeg',
    dateFormat: 'standard',
    timeZone: 'Asia/Colombo (GMT+5:30)',
    contactEmail: 'contact@pradeepwijerathnasekara.com',
    address: 'Colombo, Sri Lanka',
  },
  appearance: {
    primaryColor: '#0a2342',
    accentColor: '#d97706',
    breakingRed: '#dc2626',
    backgroundColor: '#faf6ee',
    headlineFont: 'Playfair Display',
    bodyFont: 'Merriweather',
    defaultTheme: 'light',
    mastheadStyle: 'classic_centered',
    articleDensity: 'comfortable',
  },
  layout: {
    showBreakingTicker: true,
    tickerStyle: 'marquee',
    showHero: true,
    showDailyFeed: true,
    showOpinion: true,
    showMostRead: true,
    showTrending: true,
    showNewsletterWidget: true,
    showWeatherWidget: true,
    showMarketsWidget: true,
    leadStoryId: 'art-1',
  },
  navigation: [
    { id: 'nav-1', label: 'Front Page', labelSi: 'මුල් පිටුව', url: '#', isExternal: false, order: 1, hasMegaMenu: false },
    { id: 'nav-cultural', label: 'Cultural', labelSi: 'සංස්කෘතික', url: '#cultural', isExternal: false, order: 2, hasMegaMenu: false },
    { id: 'nav-inspirational', label: 'Inspirational', labelSi: 'ප්‍රබෝධාත්මක', url: '#inspirational', isExternal: false, order: 3, hasMegaMenu: false },
    { id: 'nav-2', label: 'World', labelSi: 'ලෝකය', url: '#world', isExternal: false, order: 4, hasMegaMenu: true },
    { id: 'nav-3', label: 'Politics', labelSi: 'දේශපාලන', url: '#politics', isExternal: false, order: 5, hasMegaMenu: true },
    { id: 'nav-4', label: 'Business', labelSi: 'ව්‍යාපාරික', url: '#business', isExternal: false, order: 4, hasMegaMenu: true },
    { id: 'nav-5', label: 'Technology', labelSi: 'තාක්ෂණය', url: '#tech', isExternal: false, order: 5, hasMegaMenu: false },
    { id: 'nav-6', label: 'Sports', labelSi: 'ක්‍රීඩා', url: '#sports', isExternal: false, order: 6, hasMegaMenu: false },
    { id: 'nav-7', label: 'Culture & Arts', labelSi: 'සංස්කෘතිය', url: '#culture', isExternal: false, order: 7, hasMegaMenu: false },
    { id: 'nav-8', label: 'Editorial & Opinion', labelSi: 'මතවාද', url: '#opinion', isExternal: false, order: 8, hasMegaMenu: false },
  ],
  footer: {
    aboutText: 'Pradeep Wijerathnasekara Educational Blog offers comprehensive learning guides, modern pedagogical resources, technological insights, and academic commentary.',
    copyrightText: '© 2026 Pradeep Wijerathnasekara. All rights reserved.',
    socialLinks: {
      twitter: 'https://twitter.com',
      facebook: 'https://facebook.com',
      instagram: 'https://instagram.com',
      youtube: 'https://youtube.com',
    },
    legalLinks: [
      { label: 'Educational Resources & Guides', url: '#resources' },
      { label: 'Privacy Policy', url: '#privacy' },
      { label: 'Terms of Use', url: '#terms' },
      { label: 'Contact & Inquiries', url: '#contacts' },
    ],
    showNewsletterBox: true,
    companyInfo: 'Pradeep Wijerathnasekara Educational Blog • Academic Press.',
  },
  seo: {
    metaTitle: 'Pradeep Wijerathnasekara — Educational Blog',
    metaDescription: 'Pradeep Wijerathnasekara Educational Blog - In-depth educational articles, tutorials, academic resources and technology news.',
    ogImageUrl: '/assets/aistudio/Logo_W2.jpg_741157ec.jpeg',
    googleAnalyticsId: 'G-NEWSROOM99',
    googleNewsSitemap: true,
    rssFeedEnabled: true,
    robotsTxt: 'User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: /sitemap.xml',
    enableAmp: true,
  },
};

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [
  {
    id: 'act-1',
    userId: 'staff-admin-1',
    userName: 'Eleanor Vance',
    userRole: 'super_admin',
    action: 'publish',
    targetType: 'article',
    targetId: 'art-1',
    targetTitle: 'The Grand Maritime Accord',
    timestamp: '2025-05-10T08:00:00Z',
    details: 'Published lead story with sticky priority on homepage.',
  },
  {
    id: 'act-2',
    userId: 'staff-editor-1',
    userName: 'Marcus Holloway',
    userRole: 'editor',
    action: 'approve',
    targetType: 'article',
    targetId: 'art-2',
    targetTitle: 'Quantum Neural Arrays Surpass Silicon',
    timestamp: '2025-05-11T10:10:00Z',
    details: 'Approved article from In Review and enabled Live Blog updates.',
  },
  {
    id: 'act-3',
    userId: 'staff-reporter-1',
    userName: 'Sofia Al-Mansoor',
    userRole: 'reporter',
    action: 'create',
    targetType: 'breaking_news',
    targetId: 'bn-1',
    targetTitle: 'Climate Summit Microgrid Accord',
    timestamp: '2025-05-11T11:00:00Z',
    details: 'Added urgent breaking news ticker with 18h auto-expiry.',
  },
];

// LocalStorage Keys
const KEYS = {
  CURRENT_USER: 'herald_cms_current_user',
  STAFF: 'herald_cms_staff_data',
  READERS: 'herald_cms_readers_data',
  CURRENT_READER: 'herald_cms_current_reader',
  ARTICLES: 'herald_cms_articles_data',
  SECTIONS: 'herald_cms_sections_data',
  TAGS: 'herald_cms_tags_data',
  BREAKING_NEWS: 'herald_cms_breaking_data',
  FRONT_PAGE: 'herald_cms_front_page_data',
  EDITIONS: 'herald_cms_editions_data',
  MEDIA: 'herald_cms_media_data',
  COMMENTS: 'herald_cms_comments_data',
  SUBSCRIBERS: 'herald_cms_subscribers_data',
  SETTINGS: 'herald_cms_settings_data',
  LOGS: 'herald_cms_logs_data',
  API_KEYS: 'herald_cms_api_keys',
};

// Safe storage access helper
function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) {
      localStorage.setItem(key, JSON.stringify(fallback));
      return fallback;
    }
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error(`Failed to write to localStorage for key: ${key}`, err);
  }
}

// Event-driven reactive store
type Listener = () => void;
const listeners = new Set<Listener>();

function notifyAll(): void {
  listeners.forEach((fn) => {
    try {
      fn();
    } catch (e) {
      console.error('Error notifying subscriber:', e);
    }
  });
}

export const NewsroomStore = {
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  // AUTH & SESSION
  getCurrentUser(): StaffMember | null {
    return loadFromStorage<StaffMember | null>(KEYS.CURRENT_USER, null);
  },

  setCurrentUser(user: StaffMember | null): void {
    saveToStorage(KEYS.CURRENT_USER, user);
    if (user) {
      this.logActivity({
        action: 'login',
        targetType: 'staff',
        targetId: user.id,
        targetTitle: user.name,
        details: `Logged in as ${user.role}`,
      });
    }
    notifyAll();
  },

  login(email: string, password?: string, role?: StaffRole): { success: boolean; message?: string; user?: StaffMember } {
    const staff = this.getStaff();
    const cleanEmail = email.trim().toLowerCase();
    const found = staff.find((s) => s.email.toLowerCase() === cleanEmail);
    if (!found) {
      return { success: false, message: 'No editorial staff account found with this email address.' };
    }
    if (!found.active) {
      return { success: false, message: 'This staff account has been deactivated.' };
    }
    const expected = (found.password || (found.role === 'super_admin' ? 'admin123' : found.role === 'editor' ? 'editor123' : 'reporter123')).trim();
    if (password !== undefined && password.trim() !== expected) {
      return { success: false, message: 'Incorrect password. Please verify and try again.' };
    }
    this.setCurrentUser(found);
    return { success: true, user: found };
  },

  logout(): void {
    saveToStorage(KEYS.CURRENT_USER, null);
    notifyAll();
  },

  registerStaff(data: {
    name: string;
    email: string;
    password?: string;
    role: StaffRole;
    bio?: string;
    headshot?: string;
    sections?: string[];
    twitter?: string;
  }): { success: boolean; message?: string; user?: StaffMember } {
    const emailClean = data.email.trim().toLowerCase();
    if (!emailClean || !data.name.trim()) {
      return { success: false, message: 'Name and email are required.' };
    }
    const staff = this.getStaff();
    const existing = staff.find((s) => s.email.toLowerCase() === emailClean);
    if (existing) {
      return { success: false, message: 'An account with this email address already exists in the newsroom.' };
    }

    const newStaff: StaffMember = {
      id: 'staff-' + Date.now(),
      name: data.name.trim(),
      email: emailClean,
      password: data.password || 'herald2025',
      role: data.role || 'reporter',
      bio: data.bio?.trim() || `Journalist and contributor covering ${data.sections?.join(', ') || 'general news'}.`,
      headshot: data.headshot || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      sections: data.sections && data.sections.length > 0 ? data.sections : ['world'],
      socialLinks: {
        twitter: data.twitter || `@${data.name.toLowerCase().replace(/\s+/g, '')}`,
      },
      active: true,
      createdAt: new Date().toISOString(),
    };

    this.saveStaff(newStaff);
    this.setCurrentUser(newStaff);
    return { success: true, user: newStaff };
  },

  // READER USER ACCOUNTS
  getReaderUsers(): ReaderUser[] {
    const list = loadFromStorage<ReaderUser[]>(KEYS.READERS, INITIAL_READERS);
    return list.map((r) => ({
      ...r,
      password: r.password || 'reader123',
    }));
  },

  saveReaderUser(user: ReaderUser): void {
    const list = this.getReaderUsers();
    const idx = list.findIndex((r) => r.id === user.id);
    if (idx >= 0) {
      list[idx] = user;
    } else {
      list.unshift(user);
    }
    saveToStorage(KEYS.READERS, list);

    const current = this.getCurrentReader();
    if (current && current.id === user.id) {
      saveToStorage(KEYS.CURRENT_READER, user);
    }
    notifyAll();
  },

  deleteReaderUser(id: string): void {
    const list = this.getReaderUsers().filter((r) => r.id !== id);
    saveToStorage(KEYS.READERS, list);
    const current = this.getCurrentReader();
    if (current && current.id === id) {
      saveToStorage(KEYS.CURRENT_READER, null);
    }
    notifyAll();
  },

  getCurrentReader(): ReaderUser | null {
    return loadFromStorage<ReaderUser | null>(KEYS.CURRENT_READER, null);
  },

  setCurrentReader(user: ReaderUser | null): void {
    saveToStorage(KEYS.CURRENT_READER, user);
    notifyAll();
  },

  registerReader(data: {
    name: string;
    email: string;
    password?: string;
    avatar?: string;
    favoriteSections?: string[];
  }): { success: boolean; message?: string; user?: ReaderUser } {
    const emailClean = data.email.trim().toLowerCase();
    if (!emailClean || !data.name.trim()) {
      return { success: false, message: 'Name and email are required.' };
    }
    const readers = this.getReaderUsers();
    if (readers.some((r) => r.email.toLowerCase() === emailClean)) {
      return { success: false, message: 'A reader account with this email already exists.' };
    }

    const newReader: ReaderUser = {
      id: 'reader-' + Date.now(),
      name: data.name.trim(),
      email: emailClean,
      password: data.password || 'reader123',
      avatar: data.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200',
      bookmarks: [],
      readingHistory: [],
      favoriteSections: data.favoriteSections || ['politics', 'world'],
      createdAt: new Date().toISOString(),
    };

    this.saveReaderUser(newReader);
    this.setCurrentReader(newReader);
    return { success: true, user: newReader };
  },

  loginReader(email: string, password?: string): { success: boolean; message?: string; user?: ReaderUser } {
    const readers = this.getReaderUsers();
    const cleanEmail = email.trim().toLowerCase();
    const found = readers.find((r) => r.email.toLowerCase() === cleanEmail);
    if (!found) {
      return { success: false, message: 'No reader account found with this email. Please check your email or create an account.' };
    }
    const expected = (found.password || 'reader123').trim();
    if (password !== undefined && password.trim() !== expected) {
      return { success: false, message: 'Incorrect password. Please verify your password and try again.' };
    }
    this.setCurrentReader(found);
    return { success: true, user: found };
  },

  logoutReader(): void {
    saveToStorage(KEYS.CURRENT_READER, null);
    notifyAll();
  },

  toggleBookmark(articleId: string): boolean {
    const reader = this.getCurrentReader();
    if (!reader) return false;
    const isBookmarked = reader.bookmarks?.includes(articleId);
    const updatedBookmarks = isBookmarked
      ? reader.bookmarks.filter((id) => id !== articleId)
      : [...(reader.bookmarks || []), articleId];

    const updatedReader: ReaderUser = {
      ...reader,
      bookmarks: updatedBookmarks,
    };
    this.saveReaderUser(updatedReader);
    return !isBookmarked;
  },

  isBookmarked(articleId: string): boolean {
    const reader = this.getCurrentReader();
    return !!reader?.bookmarks?.includes(articleId);
  },

  getBookmarkedArticles(): Article[] {
    const reader = this.getCurrentReader();
    if (!reader || !reader.bookmarks?.length) return [];
    const all = this.getArticles();
    return all.filter((a) => reader.bookmarks.includes(a.id));
  },

  // STAFF
  getStaff(): StaffMember[] {
    const list = loadFromStorage<StaffMember[]>(KEYS.STAFF, INITIAL_STAFF);
    return list.map((s) => ({
      ...s,
      password: s.password || (s.role === 'super_admin' ? 'admin123' : s.role === 'editor' ? 'editor123' : 'reporter123'),
    }));
  },

  saveStaff(member: StaffMember): void {
    const list = this.getStaff();
    const index = list.findIndex((s) => s.id === member.id);
    if (index >= 0) {
      list[index] = member;
      this.logActivity({
        action: 'update',
        targetType: 'staff',
        targetId: member.id,
        targetTitle: member.name,
        details: `Updated staff profile (${member.role})`,
      });
    } else {
      list.push(member);
      this.logActivity({
        action: 'create',
        targetType: 'staff',
        targetId: member.id,
        targetTitle: member.name,
        details: `Added new staff member (${member.role})`,
      });
    }
    saveToStorage(KEYS.STAFF, list);
    notifyAll();
  },

  deleteStaff(id: string): void {
    const list = this.getStaff().filter((s) => s.id !== id);
    saveToStorage(KEYS.STAFF, list);
    this.logActivity({
      action: 'delete',
      targetType: 'staff',
      targetId: id,
      targetTitle: 'Staff Member',
      details: 'Staff account removed',
    });
    notifyAll();
  },

  // ARTICLES
  getArticles(): Article[] {
    return loadFromStorage<Article[]>(KEYS.ARTICLES, INITIAL_ARTICLES);
  },

  getArticleById(id: string): Article | undefined {
    return this.getArticles().find((a) => a.id === id);
  },

  saveArticle(article: Article): Article {
    const articles = this.getArticles();
    const index = articles.findIndex((a) => a.id === article.id);
    const now = new Date().toISOString();

    // Auto-calculate reading time (~200 words/min)
    const wordCount = (article.content || '').replace(/<[^>]+>/g, '').split(/\s+/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    const finalArticle: Article = {
      ...article,
      readingTimeMinutes: readingTime,
      updatedAt: now,
      publishedAt: article.editorialStatus === 'published' ? (article.publishedAt || now) : article.publishedAt,
    };

    if (index >= 0) {
      articles[index] = finalArticle;
      this.logActivity({
        action: 'update',
        targetType: 'article',
        targetId: finalArticle.id,
        targetTitle: finalArticle.headline,
        details: `Updated article status to ${finalArticle.editorialStatus}`,
      });
    } else {
      articles.unshift(finalArticle);
      this.logActivity({
        action: 'create',
        targetType: 'article',
        targetId: finalArticle.id,
        targetTitle: finalArticle.headline,
        details: `Created new article in status: ${finalArticle.editorialStatus}`,
      });
    }
    saveToStorage(KEYS.ARTICLES, articles);
    notifyAll();
    return finalArticle;
  },

  deleteArticle(id: string): void {
    const target = this.getArticleById(id);
    const articles = this.getArticles().filter((a) => a.id !== id);
    saveToStorage(KEYS.ARTICLES, articles);
    this.logActivity({
      action: 'delete',
      targetType: 'article',
      targetId: id,
      targetTitle: target?.headline || id,
      details: 'Deleted news article',
    });
    notifyAll();
  },

  bulkUpdateArticles(ids: string[], updates: Partial<Article>): void {
    const articles = this.getArticles().map((a) => {
      if (ids.includes(a.id)) {
        return { ...a, ...updates, updatedAt: new Date().toISOString() };
      }
      return a;
    });
    saveToStorage(KEYS.ARTICLES, articles);
    this.logActivity({
      action: 'update',
      targetType: 'article',
      targetId: ids.join(','),
      targetTitle: `${ids.length} Articles`,
      details: `Bulk updated attributes: ${Object.keys(updates).join(', ')}`,
    });
    notifyAll();
  },

  incrementArticleViews(id: string): void {
    const articles = this.getArticles();
    const index = articles.findIndex((a) => a.id === id);
    if (index >= 0) {
      articles[index].views = (articles[index].views || 0) + 1;
      saveToStorage(KEYS.ARTICLES, articles);
      notifyAll();
    }
  },

  // BREAKING NEWS TICKER
  getBreakingNews(): BreakingNewsItem[] {
    const items = loadFromStorage<BreakingNewsItem[]>(KEYS.BREAKING_NEWS, INITIAL_BREAKING_NEWS);
    // Sort by order ascending
    return items.sort((a, b) => a.order - b.order);
  },

  getActiveBreakingNews(): BreakingNewsItem[] {
    const now = Date.now();
    return this.getBreakingNews().filter((item) => {
      if (!item.active) return false;
      const expiry = new Date(item.expiresAt).getTime();
      return expiry > now;
    });
  },

  saveBreakingNews(item: BreakingNewsItem): void {
    const items = this.getBreakingNews();
    const index = items.findIndex((b) => b.id === item.id);
    if (index >= 0) {
      items[index] = item;
      this.logActivity({
        action: 'update',
        targetType: 'breaking_news',
        targetId: item.id,
        targetTitle: item.headline,
        details: 'Updated breaking ticker headline',
      });
    } else {
      items.push(item);
      this.logActivity({
        action: 'create',
        targetType: 'breaking_news',
        targetId: item.id,
        targetTitle: item.headline,
        details: 'Created breaking news alert',
      });
    }
    saveToStorage(KEYS.BREAKING_NEWS, items);
    notifyAll();
  },

  deleteBreakingNews(id: string): void {
    const items = this.getBreakingNews().filter((b) => b.id !== id);
    saveToStorage(KEYS.BREAKING_NEWS, items);
    this.logActivity({
      action: 'delete',
      targetType: 'breaking_news',
      targetId: id,
      targetTitle: 'Breaking News Item',
      details: 'Removed breaking news item',
    });
    notifyAll();
  },

  reorderBreakingNews(newOrder: BreakingNewsItem[]): void {
    const items = newOrder.map((item, idx) => ({ ...item, order: idx + 1 }));
    saveToStorage(KEYS.BREAKING_NEWS, items);
    notifyAll();
  },

  getFrontPageLayout(): FrontPageLayout {
    const layout = loadFromStorage<FrontPageLayout>(KEYS.FRONT_PAGE, INITIAL_FRONT_PAGE);
    if (!layout.heroCustomization) {
      layout.heroCustomization = INITIAL_FRONT_PAGE.heroCustomization;
    }
    if (!layout.latestArticlesArea) {
      layout.latestArticlesArea = INITIAL_FRONT_PAGE.latestArticlesArea;
    }
    if (!layout.mostPopularArea) {
      layout.mostPopularArea = INITIAL_FRONT_PAGE.mostPopularArea;
    }
    if (!layout.dailyFeedArea) {
      layout.dailyFeedArea = INITIAL_FRONT_PAGE.dailyFeedArea;
    }
    if (!layout.featuredStoriesArea) {
      layout.featuredStoriesArea = INITIAL_FRONT_PAGE.featuredStoriesArea;
    }
    return layout;
  },

  saveFrontPageLayout(layout: FrontPageLayout): void {
    saveToStorage(KEYS.FRONT_PAGE, layout);
    this.logActivity({
      action: 'update',
      targetType: 'front_page',
      targetId: layout.id,
      targetTitle: layout.name || 'Front Page Layout',
      details: 'Published new front page hero and block configuration',
    });
    notifyAll();
  },

  // EDITIONS
  getEditions(): Edition[] {
    return loadFromStorage<Edition[]>(KEYS.EDITIONS, INITIAL_EDITIONS);
  },

  saveEdition(edition: Edition): void {
    const list = this.getEditions();
    const index = list.findIndex((e) => e.id === edition.id);
    if (index >= 0) {
      list[index] = edition;
    } else {
      list.unshift(edition);
    }
    saveToStorage(KEYS.EDITIONS, list);
    this.logActivity({
      action: index >= 0 ? 'update' : 'create',
      targetType: 'edition',
      targetId: edition.id,
      targetTitle: edition.name,
      details: `Edition dated ${edition.date} saved`,
    });
    notifyAll();
  },

  deleteEdition(id: string): void {
    const list = this.getEditions().filter((e) => e.id !== id);
    saveToStorage(KEYS.EDITIONS, list);
    notifyAll();
  },

  // SECTIONS & TAGS
  getSections(): Section[] {
    return loadFromStorage<Section[]>(KEYS.SECTIONS, INITIAL_SECTIONS).sort((a, b) => a.order - b.order);
  },

  saveSection(section: Section): void {
    const list = this.getSections();
    const index = list.findIndex((s) => s.id === section.id);
    if (index >= 0) {
      list[index] = section;
    } else {
      list.push(section);
    }
    saveToStorage(KEYS.SECTIONS, list);
    this.logActivity({
      action: index >= 0 ? 'update' : 'create',
      targetType: 'section',
      targetId: section.id,
      targetTitle: section.name,
      details: `Section ${section.name} updated`,
    });
    notifyAll();
  },

  deleteSection(id: string): void {
    const list = this.getSections().filter((s) => s.id !== id);
    saveToStorage(KEYS.SECTIONS, list);
    notifyAll();
  },

  reorderSections(newOrder: Section[]): void {
    const list = newOrder.map((s, idx) => ({ ...s, order: idx + 1 }));
    saveToStorage(KEYS.SECTIONS, list);
    notifyAll();
  },

  getTags(): Tag[] {
    return loadFromStorage<Tag[]>(KEYS.TAGS, INITIAL_TAGS);
  },

  saveTag(tag: Tag): void {
    const list = this.getTags();
    const index = list.findIndex((t) => t.id === tag.id);
    if (index >= 0) {
      list[index] = tag;
    } else {
      list.push(tag);
    }
    saveToStorage(KEYS.TAGS, list);
    notifyAll();
  },

  deleteTag(id: string): void {
    const list = this.getTags().filter((t) => t.id !== id);
    saveToStorage(KEYS.TAGS, list);
    notifyAll();
  },

  // MEDIA LIBRARY
  getMedia(): MediaItem[] {
    return loadFromStorage<MediaItem[]>(KEYS.MEDIA, INITIAL_MEDIA);
  },

  saveMedia(item: MediaItem): void {
    const list = this.getMedia();
    const index = list.findIndex((m) => m.id === item.id);
    if (index >= 0) {
      list[index] = item;
    } else {
      list.unshift(item);
    }
    saveToStorage(KEYS.MEDIA, list);
    this.logActivity({
      action: index >= 0 ? 'update' : 'create',
      targetType: 'media',
      targetId: item.id,
      targetTitle: item.name,
      details: 'Media asset cataloged in newsroom library',
    });
    notifyAll();
  },

  deleteMedia(id: string): void {
    const list = this.getMedia().filter((m) => m.id !== id);
    saveToStorage(KEYS.MEDIA, list);
    notifyAll();
  },

  // COMMENTS MODERATION
  getComments(): Comment[] {
    return loadFromStorage<Comment[]>(KEYS.COMMENTS, INITIAL_COMMENTS);
  },

  saveComment(comment: Comment): void {
    const list = this.getComments();
    const index = list.findIndex((c) => c.id === comment.id);
    if (index >= 0) {
      list[index] = comment;
    } else {
      list.unshift(comment);
    }
    saveToStorage(KEYS.COMMENTS, list);
    notifyAll();
  },

  updateCommentStatus(id: string, status: Comment['status']): void {
    const list = this.getComments().map((c) => (c.id === id ? { ...c, status } : c));
    saveToStorage(KEYS.COMMENTS, list);
    this.logActivity({
      action: 'review',
      targetType: 'comment',
      targetId: id,
      targetTitle: 'Reader Comment',
      details: `Comment moderation status changed to ${status}`,
    });
    notifyAll();
  },

  deleteComment(id: string): void {
    const list = this.getComments().filter((c) => c.id !== id);
    saveToStorage(KEYS.COMMENTS, list);
    notifyAll();
  },

  // NEWSLETTER & SUBSCRIBERS
  getSubscribers(): NewsletterSubscriber[] {
    return loadFromStorage<NewsletterSubscriber[]>(KEYS.SUBSCRIBERS, INITIAL_SUBSCRIBERS);
  },

  addSubscriber(email: string, name?: string): NewsletterSubscriber {
    const list = this.getSubscribers();
    const existing = list.find((s) => s.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return existing;
    }
    const newSub: NewsletterSubscriber = {
      id: 'sub-' + Date.now(),
      email,
      name,
      subscribedAt: new Date().toISOString(),
      active: true,
      status: 'confirmed',
    };
    list.unshift(newSub);
    saveToStorage(KEYS.SUBSCRIBERS, list);
    notifyAll();
    return newSub;
  },

  deleteSubscriber(id: string): void {
    const list = this.getSubscribers().filter((s) => s.id !== id);
    saveToStorage(KEYS.SUBSCRIBERS, list);
    notifyAll();
  },

  // SITE SETTINGS
  getSiteSettings(): SiteSettings {
    const settings = loadFromStorage<SiteSettings>(KEYS.SETTINGS, INITIAL_SITE_SETTINGS);
    if (settings && (settings.general?.newspaperName === 'The Newspaper' || !settings.general?.mastheadLogoUrl || settings.general?.mastheadLogoUrl.includes('WhatsApp_Image'))) {
      settings.general.newspaperName = 'Pradeep Wijerathnasekara';
      settings.general.tagline = 'Educational Blog — Academic Insights, Pedagogy & Technology in Education';
      settings.general.mastheadLogoUrl = '/assets/aistudio/Logo_W2.jpg_741157ec.jpeg';
      settings.general.mobileLogoUrl = '/assets/aistudio/Logo_W2.jpg_741157ec.jpeg';
      settings.general.faviconUrl = '/assets/aistudio/Logo_W2.jpg_741157ec.jpeg';
      saveToStorage(KEYS.SETTINGS, settings);
    }
    return settings;
  },

  saveSiteSettings(settings: SiteSettings): void {
    saveToStorage(KEYS.SETTINGS, settings);
    this.logActivity({
      action: 'settings_change',
      targetType: 'settings',
      targetId: 'siteSettings',
      targetTitle: 'Site Customization Settings',
      details: 'Updated global site settings and typography preferences',
    });
    notifyAll();
  },

  // AUDIT & ACTIVITY LOGS
  getActivityLogs(): ActivityLog[] {
    return loadFromStorage<ActivityLog[]>(KEYS.LOGS, INITIAL_ACTIVITY_LOGS);
  },

  logActivity(entry: Omit<ActivityLog, 'id' | 'timestamp' | 'userId' | 'userName' | 'userRole'>): void {
    const user = this.getCurrentUser();
    const newLog: ActivityLog = {
      id: 'log-' + Date.now() + '-' + Math.floor(Math.random() * 1000),
      userId: user?.id || 'sys-anonymous',
      userName: user?.name || 'System User',
      userRole: user?.role || 'reporter',
      timestamp: new Date().toISOString(),
      ...entry,
    };
    const logs = this.getActivityLogs();
    logs.unshift(newLog);
    // keep max 200 logs
    if (logs.length > 200) {
      logs.splice(200);
    }
    saveToStorage(KEYS.LOGS, logs);
  },

  // BACKUP & RESTORE
  exportAllDataJson(): string {
    const data = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      staff: this.getStaff(),
      articles: this.getArticles(),
      sections: this.getSections(),
      tags: this.getTags(),
      breakingNews: this.getBreakingNews(),
      frontPage: this.getFrontPageLayout(),
      editions: this.getEditions(),
      media: this.getMedia(),
      comments: this.getComments(),
      subscribers: this.getSubscribers(),
      settings: this.getSiteSettings(),
      activityLogs: this.getActivityLogs(),
    };
    return JSON.stringify(data, null, 2);
  },

  importAllDataJson(jsonString: string): boolean {
    try {
      const data = JSON.parse(jsonString);
      if (data.articles) saveToStorage(KEYS.ARTICLES, data.articles);
      if (data.sections) saveToStorage(KEYS.SECTIONS, data.sections);
      if (data.tags) saveToStorage(KEYS.TAGS, data.tags);
      if (data.staff) saveToStorage(KEYS.STAFF, data.staff);
      if (data.breakingNews) saveToStorage(KEYS.BREAKING_NEWS, data.breakingNews);
      if (data.frontPage) saveToStorage(KEYS.FRONT_PAGE, data.frontPage);
      if (data.editions) saveToStorage(KEYS.EDITIONS, data.editions);
      if (data.media) saveToStorage(KEYS.MEDIA, data.media);
      if (data.comments) saveToStorage(KEYS.COMMENTS, data.comments);
      if (data.subscribers) saveToStorage(KEYS.SUBSCRIBERS, data.subscribers);
      if (data.settings) saveToStorage(KEYS.SETTINGS, data.settings);
      if (data.activityLogs) saveToStorage(KEYS.LOGS, data.activityLogs);

      this.logActivity({
        action: 'settings_change',
        targetType: 'settings',
        targetId: 'backup',
        targetTitle: 'Database Restore',
        details: 'Restored full newsroom database from JSON backup',
      });
      notifyAll();
      return true;
    } catch (err) {
      console.error('Failed to parse backup JSON:', err);
      return false;
    }
  },

  resetToDemo(): void {
    localStorage.clear();
    saveToStorage(KEYS.CURRENT_USER, INITIAL_STAFF[0]);
    saveToStorage(KEYS.STAFF, INITIAL_STAFF);
    saveToStorage(KEYS.SECTIONS, INITIAL_SECTIONS);
    saveToStorage(KEYS.TAGS, INITIAL_TAGS);
    saveToStorage(KEYS.ARTICLES, INITIAL_ARTICLES);
    saveToStorage(KEYS.BREAKING_NEWS, INITIAL_BREAKING_NEWS);
    saveToStorage(KEYS.FRONT_PAGE, INITIAL_FRONT_PAGE);
    saveToStorage(KEYS.EDITIONS, INITIAL_EDITIONS);
    saveToStorage(KEYS.MEDIA, INITIAL_MEDIA);
    saveToStorage(KEYS.COMMENTS, INITIAL_COMMENTS);
    saveToStorage(KEYS.SUBSCRIBERS, INITIAL_SUBSCRIBERS);
    saveToStorage(KEYS.SETTINGS, INITIAL_SITE_SETTINGS);
    saveToStorage(KEYS.LOGS, INITIAL_ACTIVITY_LOGS);
    notifyAll();
  },

  // PERMISSION CHECKER
  can(action: 'publish' | 'edit_any' | 'delete_any' | 'manage_settings' | 'manage_staff' | 'approve' | 'manage_front_page', role?: StaffRole): boolean {
    const activeRole = role || this.getCurrentUser()?.role;
    if (!activeRole) return false;
    if (activeRole === 'super_admin') return true;

    switch (action) {
      case 'publish':
      case 'approve':
      case 'manage_front_page':
        return activeRole === 'editor';
      case 'edit_any':
        return activeRole === 'editor';
      case 'delete_any':
      case 'manage_settings':
      case 'manage_staff':
        return false;
      default:
        return false;
    }
  },
};
