import { Language } from './translations';

export interface Article {
  id: string;
  title: string;
  titleSi?: string;
  category: string;
  categorySi?: string;
  categorySecondary?: string;
  categorySecondarySi?: string;
  offsetDays?: number;
  date: string;
  dateSi?: string;
  author: string;
  authorSi?: string;
  commentsCount: number;
  excerpt: string;
  excerptSi?: string;
  content: string[];
  contentSi?: string[];
  imageUrl?: string;
  imageCaption?: string;
  imageCaptionSi?: string;
  isHero?: boolean;
  isBreaking?: boolean;
  isDailyFeed?: boolean;
  isFeatured?: boolean;
  isLatest?: boolean;
  isPopular?: boolean;
  popularRank?: number;
  tags?: string[];
  tagsSi?: string[];
  readTime?: string;
  readTimeSi?: string;
}

export interface RecommendedBook {
  id: string;
  title: string;
  titleSi?: string;
  imageUrl: string;
  category: string;
  categorySi?: string;
  readTime: string;
  readTimeSi?: string;
  summary: string;
  summarySi?: string;
}

/**
 * Generates dynamic dates formatted relative to current date (today).
 * offsetDays = 0 means today.
 */
export function getRelativeFormattedDate(offsetDays: number = 0, lang: Language = 'en'): string {
  const d = new Date();
  d.setDate(d.getDate() - offsetDays);

  if (lang === 'si') {
    const siMonths = [
      'ජනවාරි', 'පෙබරවාරි', 'මාර්තු', 'අප්‍රේල්', 'මැයි', 'ජූනි',
      'ජූලි', 'අගෝස්තු', 'සැප්තැම්බර්', 'ඔක්තෝබර්', 'නොවැම්බර්', 'දෙසැම්බර්'
    ];
    const year = d.getFullYear();
    const month = siMonths[d.getMonth()];
    const day = d.getDate();
    return `${year} ${month} ${day}`;
  } else {
    const enMonths = [
      'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE',
      'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'
    ];
    const year = d.getFullYear();
    const month = enMonths[d.getMonth()];
    const day = d.getDate().toString().padStart(2, '0');
    return `${month} ${day}, ${year}`;
  }
}

export const ARTICLES: Article[] = [
  // Breaking News Hero
  {
    id: 'catering-summer-wedding',
    title: 'Get the Best Catering for Your Summer Wedding in Philly',
    titleSi: 'පෙන්සිල්වේනියාවේ ග්‍රීෂ්ම මංගලෝත්සව සඳහා විශිෂ්ටතම සූපවේදී සේවාවන්',
    category: 'LIFESTYLE',
    categorySi: 'ජීවන රටාව',
    categorySecondary: 'MAIN',
    categorySecondarySi: 'ප්‍රධාන',
    date: 'MAY 13, 2017',
    dateSi: '2017 මැයි 13',
    author: 'CMSMASTERS',
    authorSi: 'සී.එම්.එස් මාස්ටර්ස්',
    commentsCount: 1,
    excerpt: 'Etiam eu molestie eros, commodo nec turpis hendrerit sapien. Maecenas tempus leo ac nisi iaculis porta. Sed sapien tempus.',
    excerptSi: 'ග්‍රීෂ්ම සෘතුවේ මංගල උත්සව සඳහා නවීන සහ සාම්ප්‍රදායික ආහාර වට්ටෝරු සම්මිශ්‍රණය කරමින් පිළියෙළ කෙරෙන සුවිශේෂී සූපවේදී අත්දැකීමක්.',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    imageCaption: 'A joyful summer celebration in Philadelphia featuring bespoke seasonal fare and artisanal arrangements.',
    imageCaptionSi: 'සුවිශේෂී සෘතුමය ආහාර සහ කලාත්මක සැරසිලි සහිත ග්‍රීෂ්ම මංගල සැමරුමක්.',
    isHero: true,
    isBreaking: true,
    tags: ['Lifestyle', 'Food', 'Culture', 'Blog'],
    tagsSi: ['ජීවන රටාව', 'ආහාර', 'සංස්කෘතිය', 'බ්ලොග්'],
    readTime: '4 min read',
    readTimeSi: 'මිනිත්තු 4 ක කියවීමක්',
    content: [
      'Etiam eu molestie eros, commodo nec turpis hendrerit sapien. Maecenas tempus leo ac nisi iaculis porta. Sed sapien tempus. Duis eleifend nunc sit amet mi dapibus ornare. Suspendisse non tempus vel libero sem pellentesque ornare amet.',
      'Planning a summer wedding in Philadelphia calls for an inventive gastronomic approach that embraces both classic Mid-Atlantic flavors and contemporary outdoor dining sensibilities. From artisanal farm-to-table farmhouses in Chester County to rooftop terraces overlooking the historic Center City skyline, culinary curators are redefining festive menus.',
      '“Couples want lightness and narrative in their courses,” explains veteran Philadelphia banquet chef Elena Rossi. “Rather than heavy sauces, we are crafting chilled heirloom gazpachos, cedar-plank Atlantic salmon infused with lemon verbena, and local strawberry shortcakes served in mason glassware.”',
      'Maecenas ornare consequat massa ullamcorper dapibus. Aliquam auctor, sapien sit amet sapien. Vivamus laoreet non mauris eget mattis. Nam turpis orci, consectetur vel accumsan sed, at sapien. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae.'
    ],
    contentSi: [
      'ග්‍රීෂ්ම සෘතුවේ එළිමහන් මංගල උත්සව සැලසුම් කිරීමේදී සාම්ප්‍රදායික මෙන්ම නවීන සූපවේදී කලාවන්ගේ සුසංයෝගය අතිශයින් වැදගත් වේ. නැවුම් එළවළු, පළතුරු සහ මුහුදු ආහාර එක්තැන් කරමින් සුවිශේෂී රස මුසු මෙනුවක් නිර්මාණය කිරීම මෙහි ප්‍රධාන අරමුණයි.',
      'නගරබද වහල මත හෝ සොඳුරු ගෙවතු පරිශ්‍රයන්හි පැවැත්වෙන මංගල සාද සඳහා සැහැල්ලු සහ ප්‍රබෝධමත් ආහාර වර්ග පිළියෙළ කිරීම අද වන විට වඩාත් ජනප්‍රිය වී තිබේ. පැමිණෙන ආරාධිතයන්ට අමතක නොවන රස අත්දැකීමක් ලබාදීමට ප්‍රවීණ සූපවේදීන් නිරන්තරයෙන් කැපවෙයි.',
      '“වර්තමාන තරුණ යුවළයන් බලාපොරොත්තු වන්නේ සාම්ප්‍රදායික බරැති ආහාර වෙනුවට සෞඛ්‍යාරක්ෂිත, නැවුම් හා ආකර්ෂණීය අතුරුපස හා ප්‍රධාන ආහාර වේලක්,” යැයි ප්‍රධාන සූපවේදිනියක වන එලේනා රොසී පවසයි.',
      'මංගල දිනය යනු ජීවිතයේ අමතක නොවන සන්ධිස්ථානයක් වන බැවින්, ආහාරපානවල ගුණාත්මකභාවය සහ ඉදිරිපත් කිරීමේ ආකර්ෂණීය බව ඒ සඳහා සුවිශේෂී වටිනාකමක් එක්කරයි.'
    ]
  },
  {
    id: 'college-football-team',
    title: "The Best College Football Team You've Probably Never Heard Of",
    titleSi: 'ඔබ කිසිදා අසා නැති විශිෂ්ටතම විශ්වවිද්‍යාල පාපන්දු කණ්ඩායම',
    category: 'MAIN',
    categorySi: 'ප්‍රධාන',
    categorySecondary: 'SPORTS',
    categorySecondarySi: 'ක්‍රීඩා',
    date: 'JUNE 20, 2017',
    dateSi: '2017 ජූනි 20',
    author: 'CMSMASTERS',
    authorSi: 'සී.එම්.එස් මාස්ටර්ස්',
    commentsCount: 0,
    excerpt: 'Aenean rhoncus gravida nisl vel pretium. Nam ac nisl non ipsum vestibulum vehicula vulputate sagittis magna.',
    excerptSi: 'අඛණ්ඩව තරග 38ක් ජයග්‍රහණය කරමින් ජාතික මට්ටමේ කණ්ඩායම් පවා අභිබවා පෙරමුණ ගත් සුවිශේෂී ක්‍රීඩා සමාජයක කතාව.',
    imageUrl: 'https://images.unsplash.com/photo-1566577739112-5180d4bf9390?auto=format&fit=crop&w=1000&q=80',
    isBreaking: true,
    isPopular: true,
    popularRank: 4,
    tags: ['Sports', 'Business', 'U.S.'],
    tagsSi: ['ක්‍රීඩා', 'ව්‍යාපාර', 'ඇමෙරිකාව'],
    readTime: '6 min read',
    readTimeSi: 'මිනිත්තු 6 ක කියවීමක්',
    content: [
      'Aenean rhoncus gravida nisl vel pretium. Nam ac nisl non ipsum vestibulum vehicula vulputate sagittis magna. Curabitur vel feugiat massa, sed facilisis ligula.',
      'Tucked away in the scenic foothills of the upper Midwest, a Division III athletic program has quietly assembled an undefeated 38-game streak, outscoring national powerhouse opponents with a razor-sharp triple-option offense and an airtight turnover differential.',
      'Head coach Marcus Sterling operates without athletic scholarships, relying instead on relentless player development, cognitive reaction drilling, and an enduring team-first culture that attracts scholar-athletes from coast to coast.',
      'Sed sapien tortor, aliquet a velit ut, lacinia molestie velit. Maecenas ornare consequat massa ullamcorper dapibus.'
    ],
    contentSi: [
      'කිසිදු විශේෂ ක්‍රීඩා ශිෂ්‍යත්වයක් හෝ දැවැන්ත මූල්‍ය ආයෝජනයක් නොමැතිව, මනා විනය සහ කණ්ඩායම් හැඟීම පෙරදැරි කරගනිමින් මේ විශ්වවිද්‍යාල කණ්ඩායම වාර්තාගත ජයග්‍රහණ රැසක් අත්කරගෙන ඇත.',
      'ප්‍රධාන පුහුණුකරුගේ නව්‍ය උපක්‍රමශීලී සැලසුම් සහ ක්‍රීඩකයන්ගේ නොපසුබස්නා උත්සාහය මෙම අසමසම ගමනේ රහස බව විචාරකයෝ පවසති.',
      'අධ්‍යාපනය සහ ක්‍රීඩාව සමබරව පවත්වාගනිමින්, ජාතික තලයේ දැවැන්ත ප්‍රතිවාදීන්ට අභියෝග කළ හැකි විශිෂ්ට කණ්ඩායම් සංස්කෘතියක් ගොඩනැගීමට ඔවුන් සමත්ව ඇත.'
    ]
  },
  {
    id: 'sex-education-evidence',
    title: "Sex Education Based on Abstinence? There's a Real Absence of Evidence",
    titleSi: 'විද්‍යාත්මක පදනමකින් තොර ලිංගික අධ්‍යාපන ප්‍රතිපත්ති පිළිබඳ විමර්ශනයක්',
    category: 'MAIN',
    categorySi: 'ප්‍රධාන',
    categorySecondary: 'POLITICS',
    categorySecondarySi: 'දේශපාලන',
    date: 'JULY 15, 2017',
    dateSi: '2017 ජූලි 15',
    author: 'CMSMASTERS',
    authorSi: 'සී.එම්.එස් මාස්ටර්ස්',
    commentsCount: 0,
    excerpt: 'Sed sapien tortor, aliquet a velit ut, lacinia molestie velit. Maecenas ornare consequat massa ullamcorper dapibus.',
    excerptSi: 'වසර 15ක පර්යේෂණ දත්ත විශ්ලේෂණය කරමින් පාසල් සෞඛ්‍ය විෂයමාලාවන්හි කාලීන අවශ්‍යතා පිළිබඳ පුළුල් විග්‍රහයක්.',
    imageUrl: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1000&q=80',
    isBreaking: true,
    isPopular: true,
    popularRank: 1,
    tags: ['Politics', 'Health', 'Science'],
    tagsSi: ['දේශපාලන', 'සෞඛ්‍ය', 'විද්‍යාව'],
    readTime: '5 min read',
    readTimeSi: 'මිනිත්තු 5 ක කියවීමක්',
    content: [
      'Sed sapien tortor, aliquet a velit ut, lacinia molestie velit. Maecenas ornare consequat massa ullamcorper dapibus.',
      'Public health researchers across three universities have published a comprehensive longitudinal meta-analysis tracking sexual health outcomes across 24 state school curricula over fifteen years.',
      'The data indicates that programs focusing solely on abstinence consistently underperform comprehensive health curricula in preventing unwanted teen pregnancies and transmission rates, pointing toward an urgent need for evidence-grounded policy updates.',
      'Aliquam auctor, sapien sit amet sapien. Vivamus laoreet non mauris eget mattis.'
    ],
    contentSi: [
      'රාජ්‍ය විශ්වවිද්‍යාල ත්‍රිත්වයක මහජන සෞඛ්‍ය පර්යේෂකයන් විසින් වසර පහළොවක් පුරා සිදු කරන ලද දීර්ඝකාලීන සමීක්ෂණ වාර්තාවකින් නූතන අධ්‍යාපන පද්ධතියේ පවතින ගැටලු රැසක් අනාවරණය කර ඇත.',
      'විද්‍යාත්මක හා පුළුල් සෞඛ්‍ය අධ්‍යාපනයක් ලබාදීමෙන් තරුණ පරපුරේ සුබසාධනය ඉහළ නැංවිය හැකි බව පර්යේෂකයෝ තහවුරු කරති.'
    ]
  },

  // Daily Feed items
  {
    id: 'google-employee-productive',
    title: 'How to be as Productive as a Google Employee',
    titleSi: 'ගූගල් ආයතනයේ සේවකයෙකු මෙන් ඉහළ ඵලදායිතාවක් අත්කර ගන්නේ කෙසේද?',
    category: 'LIFESTYLE',
    categorySi: 'ජීවන රටාව',
    categorySecondary: 'TECHNOLOGY',
    categorySecondarySi: 'තාක්ෂණය',
    date: 'MAY 10, 2017',
    dateSi: '2017 මැයි 10',
    author: 'CMSMASTERS',
    authorSi: 'සී.එම්.එස් මාස්ටර්ස්',
    commentsCount: 3,
    excerpt: 'Suspendisse quis orci ut orci pulvinar eleifend. Nulla eu mattis ipsum. Integer eget sagittis nulla praesent et maximus.',
    excerptSi: 'කාල කළමනාකරණය, අනවශ්‍ය රැස්වීම් අවම කිරීම සහ නවීන ඩිජිටල් මෙවලම් භාවිතයෙන් කාර්යක්ෂමතාව දෙගුණ කර ගැනීමේ ක්‍රමවේද.',
    imageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
    isDailyFeed: true,
    tags: ['Technology', 'Lifestyle', 'Business'],
    tagsSi: ['තාක්ෂණය', 'ජීවන රටාව', 'ව්‍යාපාර'],
    readTime: '3 min read',
    readTimeSi: 'මිනිත්තු 3 ක කියවීමක්',
    content: [
      'Suspendisse quis orci ut orci pulvinar eleifend. Nulla eu mattis ipsum. Integer eget sagittis nulla praesent et maximus.',
      'From the famed 20% innovation time to rigorous OKR (Objectives and Key Results) alignment, Google’s internal workflows are studied by management leaders worldwide. But the true driver of day-to-day productivity lies in asynchronous micro-documentation and aggressive meeting pruning.',
      'Engineering directors mandate no-meeting Wednesdays, encourage concise executive summaries over lengthy slide presentations, and leverage structured peer reviews to keep velocity high without burnout.'
    ],
    contentSi: [
      'දිනකට ලැබෙන කාලය වඩාත් ඵලදායී ලෙස කළමනාකරණය කර ගැනීම නවීන වෘත්තිකයන් මුහුණ දෙන ප්‍රධාන අභියෝගයකි. ගූගල් සමාගම තුළ සාර්ථකව ක්‍රියාත්මක වන වැඩ සටහන් සහ සැලසුම් ලොව පුරා අවධානයට ලක්ව ඇත.',
      'අනවශ්‍ය රැස්වීම් අවම කිරීම, පැහැදිලි කෙටි සටහන් භාවිතය සහ ස්වයංක්‍රීය මෙවලම් උපයෝගී කරගනිමින් විඩාවෙන් තොරව ඉහළ ප්‍රතිඵල ළඟා කරගත හැකිය.'
    ]
  },
  {
    id: 'met-museum-fixing',
    title: 'The Most Fascinating Show? The Met Trying to Fix Itself',
    titleSi: 'නිව්යෝර්ක් මෙට් කෞතුකාගාරයේ නවීකරණ ප්‍රයත්නය සහ අභියෝග',
    category: 'CULTURAL',
    categorySi: 'සංස්කෘතික',
    categorySecondary: 'ARTS',
    categorySecondarySi: 'කලාව',
    date: 'MAY 11, 2017',
    dateSi: '2017 මැයි 11',
    author: 'CMSMASTERS',
    authorSi: 'සී.එම්.එස් මාස්ටර්ස්',
    commentsCount: 2,
    excerpt: 'Etiam eu molestie eros, commodo hendrerit sapien. Nunc pretium tortor felis, eget cursus magna egetnec imperdiet ornare.',
    excerptSi: 'ඓතිහාසික කලා කෘති සංරක්ෂණය කරමින් ඩිජිටල් යුගයට ගැලපෙන අයුරින් කෞතුකාගාරය ප්‍රතිසංවිධානය කිරීම.',
    imageUrl: 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Visitors exploring gallery installations during the Met retrospective exhibition.',
    imageCaptionSi: 'කලාගාර ප්‍රදර්ශන කුටි නරඹන නරඹන්නන් පිරිසක්.',
    isDailyFeed: true,
    isFeatured: true,
    tags: ['Culture', 'Art & Design', 'N.Y.'],
    tagsSi: ['සංස්කෘතිය', 'කලාව හා මෝස්තර', 'නිව්යෝර්ක්'],
    readTime: '5 min read',
    readTimeSi: 'මිනිත්තු 5 ක කියවීමක්',
    content: [
      'Etiam eu molestie eros, commodo hendrerit sapien. Nunc pretium tortor felis, eget cursus magna egetnec imperdiet ornare.',
      'The Metropolitan Museum of Art has embarked on its most ambitious internal reconfiguration in three decades, addressing capital expansions, digital archival preservation, and structural fiscal sustainability.',
      'Curators and museum trustees are balancing the preservation of classical antiquities with modern experiential galleries, proving that even a global icon must periodically reinvent its own institutional canvas.'
    ],
    contentSi: [
      'මෙට්‍රොපොලිටන් කලා කෞතුකාගාරය සිය දශක තුනක ඉතිහාසයේ වඩාත්ම විප්ලවීය ප්‍රතිසංස්කරණ ක්‍රියාවලිය ආරම්භ කර තිබේ.',
      'පෞරාණික කලාකෘති ආරක්ෂා කරමින්, නූතන නරඹන්නන් සඳහා අන්තර්ක්‍රියාකාරී ඩිජිටල් අත්දැකීම් නිර්මාණය කිරීමට කෞතුකාගාර භාරකාර මණ්ඩලය පියවර ගෙන ඇත.'
    ]
  },
  {
    id: 'liverpool-hoffenheim',
    title: 'Liverpool Tops Hoffenheim in First Leg of Champions Playoff',
    titleSi: 'චැම්පියන්ස් ලීග් තරගාවලියේ ලිවර්පූල් පිලට තියුණු ජයක්',
    category: 'SPORTS',
    categorySi: 'ක්‍රීඩා',
    categorySecondary: 'MAIN',
    categorySecondarySi: 'ප්‍රධාන',
    date: 'MAY 15, 2017',
    dateSi: '2017 මැයි 15',
    author: 'CMSMASTERS',
    authorSi: 'සී.එම්.එස් මාස්ටර්ස්',
    commentsCount: 5,
    excerpt: 'Maecenas ornare consequat massa ullamcorper dapibus. Aliquam auctor, sapien sit amet sapien. Vivamus laoreet non mauris.',
    excerptSi: 'යුරෝපීය ශූරයන්ගේ ප්ලේ-ඕෆ් තරගයේ පළමු අදියරේදී ලිවර්පූල් ක්‍රීඩකයෝ අගනා ජයග්‍රහණයක් වාර්තා කරති.',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'High-tempo action on the pitch during the European Champions playoff fixture.',
    imageCaptionSi: 'යුරෝපීය ශූරතා තරගයේ උද්වේගකර අවස්ථාවක්.',
    isDailyFeed: true,
    isFeatured: true,
    tags: ['Sports', 'World'],
    tagsSi: ['ක්‍රීඩා', 'ලෝකය'],
    readTime: '4 min read',
    readTimeSi: 'මිනිත්තු 4 ක කියවීමක්',
    content: [
      'Maecenas ornare consequat massa ullamcorper dapibus. Aliquam auctor, sapien sit amet sapien. Vivamus laoreet non mauris.',
      'A thrilling clash in Sinsheim saw Liverpool grab a pivotal away advantage through a sensational curling free-kick from 18-year-old Trent Alexander-Arnold and a deflected second-half drive.',
      'Despite Hoffenheim’s relentless pressing under Julian Nagelsmann, Jürgen Klopp’s side held firm in the dying minutes to seal a 2-1 first-leg victory that paves the way for Anfield’s return fixture.'
    ],
    contentSi: [
      '18 හැවිරිදි ට්‍රෙන්ට් ඇලෙක්සැන්ඩර්-ආර්නෝල්ඩ්ගේ අලංකාර නිදහස් පහරක් මගින් ලිවර්පූල් පිල පෙරමුණ ලබාගත් අතර, තරගය අවසානයේ 2-1ක් ලෙස ජය තහවුරු කරගැනීමට ඔවුහු සමත් වූහ.',
      'ජූර්ගන් ක්ලොප්ගේ මඟපෙන්වීම යටතේ ලිවර්පූල් කණ්ඩායම දැක්වූ විශිෂ්ට ක්‍රීඩා විලාශය පාපන්දු ලෝලීන්ගේ දැඩි පැසසුමට ලක්විය.'
    ]
  },

  // Featured Stories (6 cards grid)
  {
    id: 'nyc-subway-metrocard',
    title: 'Which New York City Subway MetroCard to Buy?',
    titleSi: 'නිව්යෝර්ක් උමං දුම්රිය ගමනට වඩාත් වාසිදායක මෙට්‍රෝ කාඩ්පත කුමක්ද?',
    category: 'SCIENCE',
    categorySi: 'විද්‍යාව',
    categorySecondary: 'LIFESTYLE',
    categorySecondarySi: 'ජීවන රටාව',
    date: 'MAY 18, 2017',
    dateSi: '2017 මැයි 18',
    author: 'CMSMASTERS',
    authorSi: 'සී.එම්.එස් මාස්ටර්ස්',
    commentsCount: 4,
    excerpt: 'Duis eleifend nunc sit amet mi dapibus ornare. Suspendisse non tempus vel libero sem pellentesque ornare amet.',
    excerptSi: 'සතිපතා ගමන් වාර ගණන අනුව සාක්කුවට වාසිදායක අසීමිත ගමන් කාඩ්පත් සහ මුදල් ගෙවන කාඩ්පත් පිළිබඳ සැසඳීමක්.',
    imageUrl: 'https://images.unsplash.com/photo-1516245834210-c4c142787335?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'The uptown transit line pulling into 14th Street Union Square.',
    imageCaptionSi: 'යුනියන් චතුරශ්‍ර දුම්රිය ස්ථානයට ළඟාවන උමං දුම්රියක්.',
    isFeatured: true,
    tags: ['N.Y.', 'Travel', 'Economy'],
    tagsSi: ['නිව්යෝර්ක්', 'සංචාරක', 'ආර්ථිකය'],
    readTime: '3 min read',
    readTimeSi: 'මිනිත්තු 3 ක කියවීමක්',
    content: [
      'Duis eleifend nunc sit amet mi dapibus ornare. Suspendisse non tempus vel libero sem pellentesque ornare amet.',
      'Navigating the MTA fare system requires simple mathematics. For commuters taking more than 13 rides per calendar week, the 7-day Unlimited Ride card remains the unrivaled choice.',
      'For weekend visitors or hybrid travelers, Pay-Per-Ride bonuses and free bus-to-subway transfers within two hours offer flexibility and value across all five boroughs.'
    ],
    contentSi: [
      'නිව්යෝර්ක් නගරයේ උමං දුම්රිය පද්ධතිය භාවිත කරන මගීන්ට තමන්ගේ ගමන් වාර ප්‍රමාණය අනුව සුදුසුම ප්‍රවේශපත්‍රය තෝරාගැනීමෙන් සැලකිය යුතු මුදලක් ඉතිරි කරගත හැකිය.',
      'සතියකට ගමන් වාර 13කට වඩා ගමන් කරන අයෙකුට දින 7 අසීමිත කාඩ්පත වඩාත් සුදුසු වන අතර, කෙටි සංචාරකයින් සඳහා සාමාන්‍ය ගෙවීම් කාඩ්පත් වඩාත් පහසු වේ.'
    ]
  },
  {
    id: 'rock-climbing-young-climbers',
    title: 'Physiological Responses to Rock Climbing in Young Climbers',
    titleSi: 'තරුණ කඳු තරණය කරන්නන්ගේ ශාරීරික හා මානසික ප්‍රතිචාර පිළිබඳ අධ්‍යයනයක්',
    category: 'ARTS',
    categorySi: 'කලාව',
    categorySecondary: 'POLITICS',
    categorySecondarySi: 'දේශපාලන',
    date: 'MAY 23, 2017',
    dateSi: '2017 මැයි 23',
    author: 'CMSMASTERS',
    authorSi: 'සී.එම්.එස් මාස්ටර්ස්',
    commentsCount: 2,
    excerpt: 'Sed nec blandit nibh. Pellentesque commodo suscipit gravida. Sed sit amet ex sed mi dignissim elementum in ut.',
    excerptSi: 'කඳු තරණ ක්‍රීඩාවේ යෙදෙන නව යොවුන් ක්‍රීඩකයන්ගේ මාංශ පේශි ශක්තිය සහ ආතති පාලනය පිළිබඳ නව විද්‍යාත්මක සොයාගැනීම්.',
    imageUrl: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Youth bouldering athlete navigating a high-angle technical problem.',
    imageCaptionSi: 'අභියෝගාත්මක ගල් කුළක් තරණය කරන තරුණ ක්‍රීඩකයෙක්.',
    isFeatured: true,
    isPopular: true,
    popularRank: 2,
    tags: ['Health', 'Sports', 'Science'],
    tagsSi: ['සෞඛ්‍ය', 'ක්‍රීඩා', 'විද්‍යාව'],
    readTime: '5 min read',
    readTimeSi: 'මිනිත්තු 5 ක කියවීමක්',
    content: [
      'Sed nec blandit nibh. Pellentesque commodo suscipit gravida. Sed sit amet ex sed mi dignissim elementum in ut.',
      'Sports physiologists measuring cardiovascular strain, forearm blood flow, and lactate accumulation in competitive junior climbers found remarkable adaptations in tendon density and isometric endurance.',
      'The sport also fosters rapid spatial problem-solving and emotional regulation under pressure, offering compelling evidence for integrating youth climbing leagues into standard physical education curricula.'
    ],
    contentSi: [
      'කඳු තරණය යනු හුදෙක් ශාරීරික ව්‍යායාමයක් පමණක් නොව, ක්ෂණික තීරණ ගැනීමේ හැකියාව සහ මානසික ඒකාග්‍රතාව වර්ධනය කරන අද්විතීය ක්‍රීඩාවකි.',
      'මෙම ක්‍රීඩාවෙහි නිරත වන තරුණ ක්‍රීඩකයින්ගේ හෘද ස්පන්දන වේගය, පේශි ශක්තිය මෙන්ම අවදානම් කළමනාකරණය ඉතා ඉහළ මට්ටමක පවතින බව පර්යේෂකයෝ පෙන්වා දෙති.'
    ]
  },
  {
    id: 'educate-primary-children',
    title: 'Leading Article: A Better Way to Educate Primary School Children',
    titleSi: 'ප්‍රාථමික පාසල් දරුවන් සඳහා නව්‍ය හා ප්‍රායෝගික අධ්‍යාපන ක්‍රමවේද',
    category: 'INSPIRATIONAL',
    categorySi: 'ප්‍රබෝධාත්මක',
    categorySecondary: 'EDUCATION',
    categorySecondarySi: 'අධ්‍යාපනය',
    date: 'MAY 24, 2017',
    dateSi: '2017 මැයි 24',
    author: 'CMSMASTERS',
    authorSi: 'සී.එම්.එස් මාස්ටර්ස්',
    commentsCount: 7,
    excerpt: 'Vivamus laoreet non mauris eget mattis. Nam turpis orci, consectetur vel accumsan sed, at sapien. Etiam eu molestie eros.',
    excerptSi: 'කටපාඩම් කිරීම වෙනුවට ප්‍රායෝගික ක්‍රියාකාරකම් සහ නිර්මාණශීලී චින්තනය දිරිගන්වන අධ්‍යාපන ප්‍රතිසංස්කරණ.',
    imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Collaborative inquiry-based learning in an early elementary classroom.',
    imageCaptionSi: 'ප්‍රාථමික පන්ති කාමරයක දරුවන් එක්ව ක්‍රියාකාරකම්වල යෙදෙන අයුරු.',
    isFeatured: true,
    tags: ['Economy', 'Politics', 'Culture'],
    tagsSi: ['ආර්ථිකය', 'දේශපාලන', 'සංස්කෘතිය'],
    readTime: '6 min read',
    readTimeSi: 'මිනිත්තු 6 ක කියවීමක්',
    content: [
      'Vivamus laoreet non mauris eget mattis. Nam turpis orci, consectetur vel accumsan sed, at sapien. Etiam eu molestie eros.',
      'Rather than rigid standardized test drills, pedagogical pioneers in Scandinavia and New England are seeing breakthrough results with integrated project-based modules.',
      'Children learn mathematics through community garden architecture, language arts through oral folklore storytelling, and social science through restorative council circles.'
    ],
    contentSi: [
      'සාම්ප්‍රදායික විභාග කේන්ද්‍රීය අධ්‍යාපන රටාව වෙනුවට දරුවන්ගේ නිර්මාණශීලීත්වය, පරිසර හිතකාමී බව සහ සහයෝගීතාව වර්ධනය කරන අධ්‍යාපන ක්‍රමවේද ලොව පුරා සාර්ථක ප්‍රතිඵල පෙන්වා ඇත.',
      'ගණිතය, භාෂාව සහ විද්‍යාව ප්‍රායෝගික ජීවිතයේ අත්දැකීම් සමඟ මුසු කර ඉගැන්වීමෙන් දරුවන්ගේ ඉගෙනුම් උනන්දුව ඉහළ යයි.'
    ]
  },
  {
    id: 'photographers-america',
    title: "13 Photographers Who Captured the Epic Beauty of America's",
    titleSi: 'ඇමෙරිකාවේ සුවිශේෂී ස්වභාව සෞන්දර්යය කැමරා කාචයට හසුකරගත් ඡායාරූප ශිල්පීන් 13 දෙනා',
    category: 'ARTS',
    categorySi: 'කලාව',
    categorySecondary: 'CULTURE',
    categorySecondarySi: 'සංස්කෘතිය',
    date: 'MAY 28, 2017',
    dateSi: '2017 මැයි 28',
    author: 'CMSMASTERS',
    authorSi: 'සී.එම්.එස් මාස්ටර්ස්',
    commentsCount: 9,
    excerpt: 'Nunc ut egestas neque, eu hendrerit lacus. Suspendisse fermentum congue dui nec fringilla. Duis volutpat nunc.',
    excerptSi: 'කඳුහෙල්, තැනිතලා සහ ඓතිහාසික නගර සීමා තුළ සැඟවුණු මිනිස් ජීවිතය හා සොබාදහම මනරම් ඡායාරූප එකතුවක් ලෙසින්.',
    imageUrl: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=800&q=80',
    imageCaption: 'Documentary lens examining shifting rural horizons and urban intersections.',
    imageCaptionSi: 'ග්‍රාමීය හා නාගරික ජීවිතය කැඩපතක් බඳු ඡායාරූපමය විවරණයක්.',
    isFeatured: true,
    tags: ['Photos', 'Art & Design', 'Culture'],
    tagsSi: ['ඡායාරූප', 'කලාව හා මෝස්තර', 'සංස්කෘතිය'],
    readTime: '7 min read',
    readTimeSi: 'මිනිත්තු 7 ක කියවීමක්',
    content: [
      'Nunc ut egestas neque, eu hendrerit lacus. Suspendisse fermentum congue dui nec fringilla. Duis volutpat nunc.',
      'From the dust-swept plains of the American Midwest captured in striking gelatin silver by Gordon Parks and Dorothea Lange to contemporary color-saturated highways documented by modern lenses, this visual anthology celebrates the complex soul of a nation.',
      'Each frame bears witness to moments of solitude, labor, celebration, and scenic wonder that transcend temporal boundaries.'
    ],
    contentSi: [
      'කළු සුදු ඡායාරූප යුගයේ සිට නූතන වර්ණ ඡායාරූපකරණය දක්වා විහිදුනු මෙම අසිරිමත් කලා එකතුවෙන් ඇමෙරිකානු භූමියේ සහ ජනජීවිතයේ විවිධ පැතිකඩ නිරූපණය වේ.',
      'සෑම ඡායාරූපයක්ම මිනිසා සහ සොබාදහම අතර පවතින ගැඹුරු බැඳීම පිළිබඳ අපූර්ව කතාවක් කියාපායි.'
    ]
  },

  // Popular extra items
  {
    id: 'yankees-breather-gantlet',
    title: 'Yankees May Get a Breather, but a Gantlet Awaits',
    titleSi: 'යැන්කීස් කණ්ඩායමට කෙටි විරාමයක්: දැවැන්ත තරග මාලාවක් ඉදිරියට',
    category: 'SPORTS',
    categorySi: 'ක්‍රීඩා',
    date: 'JUNE 12, 2017',
    dateSi: '2017 ජූනි 12',
    author: 'CMSMASTERS',
    authorSi: 'සී.එම්.එස් මාස්ටර්ස්',
    commentsCount: 3,
    excerpt: 'Nam ac nisl non ipsum vestibulum vehicula vulputate sagittis magna. Curabitur vel feugiat massa.',
    excerptSi: 'බෝල්ටිමෝර් හි පැවති තියුණු තරගවලින් පසු නිව්යෝර්ක් යැන්කීස් කණ්ඩායම ඉදිරි අභියෝගාත්මක තරග සඳහා සූදානම් වේ.',
    imageUrl: 'https://images.unsplash.com/photo-1508344928928-7165b67de128?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    popularRank: 3,
    tags: ['Sports', 'N.Y.'],
    tagsSi: ['ක්‍රීඩා', 'නිව්යෝර්ක්'],
    readTime: '4 min read',
    readTimeSi: 'මිනිත්තු 4 ක කියවීමක්',
    content: [
      'Nam ac nisl non ipsum vestibulum vehicula vulputate sagittis magna. Curabitur vel feugiat massa, sed facilisis ligula.',
      'With an off-day after a grueling series sweep in Baltimore, the New York Yankees prepare for a nine-game road swing against division rivals that will test their bullpen depth and starting rotation resilience.'
    ],
    contentSi: [
      'නිව්යෝර්ක් යැන්කීස් බේස්බෝල් කණ්ඩායම සිය ප්‍රතිවාදීන්ට එරෙහිව ඉදිරියට එන තරග මාලාව වෙනුවෙන් කණ්ඩායමේ ශක්තිය උපරිමයෙන් පෙළගස්වමින් සිටී.'
    ]
  },
  {
    id: 'coal-mining-health-study',
    title: 'Coal Mining Health Study Is Halted by Interior Department',
    titleSi: 'ගල් අඟුරු පතල් ආශ්‍රිත සෞඛ්‍ය සමීක්ෂණය අත්හිටුවීමට පියවර',
    category: 'POLITICS',
    categorySi: 'දේශපාලන',
    date: 'AUGUST 21, 2017',
    dateSi: '2017 අගෝස්තු 21',
    author: 'CMSMASTERS',
    authorSi: 'සී.එම්.එස් මාස්ටර්ස්',
    commentsCount: 14,
    excerpt: 'Etiam eu molestie eros, commodo nec turpis hendrerit sapien. Suspendisse non tempus vel libero.',
    excerptSi: 'පතල් ආශ්‍රිත ජනතාවගේ සෞඛ්‍ය අවදානම් පිළිබඳ විමර්ශනය කළ පර්යේෂණය තාවකාලිකව නවතා දැමීම සම්බන්ධයෙන් මතභේද.',
    imageUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?auto=format&fit=crop&w=800&q=80',
    isPopular: true,
    popularRank: 5,
    tags: ['Politics', 'Health', 'Economy'],
    tagsSi: ['දේශපාලන', 'සෞඛ්‍ය', 'ආර්ථිකය'],
    readTime: '5 min read',
    readTimeSi: 'මිනිත්තු 5 ක කියවීමක්',
    content: [
      'Etiam eu molestie eros, commodo nec turpis hendrerit sapien. Suspendisse non tempus vel libero.',
      'Federal officials have suspended funding for a National Academies of Sciences study evaluating potential health risks for residents living near mountaintop removal coal mining sites in Central Appalachia, prompting sharp inquiries from health advocates and regional representatives.'
    ],
    contentSi: [
      'පතල් කැණීම් ආශ්‍රිත ප්‍රදේශවල පාරිසරික සහ සෞඛ්‍ය සාධක පිළිබඳ අධ්‍යයනය කරමින් සිටි ජාතික විද්‍යා ඇකඩමියේ ව්‍යාපෘතියක් හදිසියේ අත්හිටුවීම පිළිබඳව පරිසරවේදීන් සිය විරෝධය පළ කරති.'
    ]
  },
  {
    id: 'bridges-books',
    title: '6 Books About The Best Bridges You Should Read',
    titleSi: 'ලොව විශිෂ්ටතම පාලම් නිර්මාණ පිළිබඳ ඔබ කියවිය යුතු පොත් 6ක්',
    category: 'RECOMMENDED',
    categorySi: 'නිර්දේශිත',
    categorySecondary: 'ARCHITECTURE',
    categorySecondarySi: 'ගෘහ නිර්මාණ',
    date: 'SEPTEMBER 12, 2017',
    dateSi: '2017 සැප්තැම්බර් 12',
    author: 'CMSMASTERS',
    authorSi: 'සී.එම්.එස් මාස්ටර්ස්',
    commentsCount: 3,
    excerpt: 'From the Brooklyn Bridge to the Golden Gate, explore historic engineering masterworks and architectural narratives.',
    excerptSi: 'බෘක්ලින් පාලමේ සිට ගෝල්ඩන් ගේට් දක්වා, ඓතිහාසික ඉංජිනේරු මහිමය සහ ගෘහ නිර්මාණ ශිල්පයේ අපූර්වත්වය විදහාපාන ග්‍රන්ථ.',
    imageUrl: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=1000&q=80',
    imageCaption: 'The majestic masonry and steel suspension span of the East River crossing.',
    imageCaptionSi: 'නැගෙනහිර ගංගාව හරහා ඉදිවූ යකඩ සහ කළුගල් පාලමේ තේජාන්විත දසුන.',
    tags: ['Architecture', 'Art & Design', 'Culture'],
    tagsSi: ['ගෘහ නිර්මාණ', 'කලාව හා මෝස්තර', 'සංස්කෘතිය'],
    readTime: '4 min read',
    readTimeSi: 'මිනිත්තු 4 ක කියවීමක්',
    content: [
      'From the stone pylons of the Brooklyn Bridge to the Art Deco towers of the Golden Gate, monumental bridges represent both utilitarian engineering triumphs and poetic symbols of human connectivity.',
      'In this curated compendium, architectural historians and civil engineers recount how pioneering builders overcame treacherous currents, political intrigue, and unprecedented material limits to span the uncrossable.',
      'Each recommended volume provides archival blueprints, oral histories from construction sandhogs, and stunning monochrome photography capturing these iconic structures as they emerged from the water.'
    ],
    contentSi: [
      'ලෝකයේ දැවැන්ත පාලම් යනු හුදෙක් ගමනාගමන පහසුකමක් පමණක් නොව, මිනිස් බුද්ධියේ හා ඉංජිනේරු වික්‍රමයේ සංකේතයකි.',
      'මෙම කෘති මගින් අසීරු දියවැල්, භූගෝලීය බාධක සහ දේශපාලන අභියෝග මැඩපවත්වමින් ඉතිහාසගත පාලම් නිර්මාණය කළ පුරෝගාමීන්ගේ වීර කතාවන් විස්තර කෙරේ.'
    ]
  },
  {
    id: 'architecture-monuments',
    title: 'The Great Architectural Monuments of the 20th Century',
    titleSi: '20 වැනි සියවසේ ශ්‍රේෂ්ඨතම ගෘහ නිර්මාණ ස්මාරක',
    category: 'RECOMMENDED',
    categorySi: 'නිර්දේශිත',
    categorySecondary: 'ARTS',
    categorySecondarySi: 'කලාව',
    date: 'AUGUST 29, 2017',
    dateSi: '2017 අගෝස්තු 29',
    author: 'CMSMASTERS',
    authorSi: 'සී.එම්.එස් මාස්ටර්ස්',
    commentsCount: 4,
    excerpt: 'A panoramic review of concrete, glass, and iron marvels that reshaped global metropolises.',
    excerptSi: 'ලෝකයේ ප්‍රධාන නගරවල මුහුණුවර වෙනස් කළ කොන්ක්‍රීට්, වීදුරු සහ වානේ නිර්මාණ පිළිබඳ පරිපූර්ණ විමර්ශනයක්.',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80',
    imageCaption: 'Clean modernist lines and cantilevered geometries.',
    imageCaptionSi: 'නවීන ගෘහ නිර්මාණ ශිල්පයේ ජ්‍යාමිතික සුන්දරත්වය.',
    tags: ['Architecture', 'Culture', 'Art & Design'],
    tagsSi: ['ගෘහ නිර්මාණ', 'සංස්කෘතිය', 'කලාව හා මෝස්තර'],
    readTime: '5 min read',
    readTimeSi: 'මිනිත්තු 5 ක කියවීමක්',
    content: [
      'The 20th century unleashed unprecedented revolutions in materials, structural calculation, and urban philosophy.',
      'From Bauhaus functionalism in Weimar Germany to the daring organic curves of Brazilian modernism and the crystalline spires of Manhattan, architects reimagined the relationship between shelter, light, and civic democracy.'
    ],
    contentSi: [
      'විසිවන සියවස යනු ගොඩනැගිලි ද්‍රව්‍ය සහ නාගරික සැලසුම්කරණයේ පෙරළිකාර යුගයකි. නවීන තාක්ෂණය උපයෝගී කරගනිමින් මිනිසාගේ වාසස්ථාන හා පොදු ගොඩනැගිලි කලාව නව මුහුණුවරක් ගත්තේය.'
    ]
  },
  {
    id: 'urban-transit-subways',
    title: 'Anatomy of Urban Transit: Subways and Skylines',
    titleSi: 'නාගරික ප්‍රවාහනයේ ස්වභාවය: උමං දුම්රිය මාර්ග සහ අහස සිඹින ගොඩනැගිලි',
    category: 'RECOMMENDED',
    categorySi: 'නිර්දේශිත',
    categorySecondary: 'URBANISM',
    categorySecondarySi: 'නාගරීකරණය',
    date: 'AUGUST 14, 2017',
    dateSi: '2017 අගෝස්තු 14',
    author: 'CMSMASTERS',
    authorSi: 'සී.එම්.එස් මාස්ටර්ස්',
    commentsCount: 6,
    excerpt: 'How underground tunnels and elevated viaducts enabled modern metropolitan life.',
    excerptSi: 'භූගත උමං සහ අධිවේගී මාර්ග මඟින් නූතන නාගරික ජීවිතය සවිමත් වූ ආකාරය පිළිබඳ ඓතිහාසික බැල්මක්.',
    imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=1000&q=80',
    imageCaption: 'Bustling transit arteries weaving beneath the urban skyline.',
    imageCaptionSi: 'නගර මධ්‍යයේ ක්‍රියාත්මක වන කාර්යබහුල ප්‍රවාහන ජාලය.',
    tags: ['N.Y.', 'Economy', 'Science'],
    tagsSi: ['නිව්යෝර්ක්', 'ආර්ථිකය', 'විද්‍යාව'],
    readTime: '4 min read',
    readTimeSi: 'මිනිත්තු 4 ක කියවීමක්',
    content: [
      'Subterranean transit systems are the unseen nervous systems of the world’s greatest cities. This retrospective examines the logistical feats required to carve tunnels beneath dense historical foundations.'
    ],
    contentSi: [
      'ලොව ප්‍රධාන නගරවල ජීවනාලිය බඳු භූගත ප්‍රවාහන පද්ධති ඉදි කිරීමේදී ජයගත් ඉංජිනේරු අභියෝග මෙම ලිපියෙන් සාකච්ඡා කෙරේ.'
    ]
  }
];

export const LATEST_ARTICLES_TITLES = [
  "The Ultimate Guide to New York's Favorite Food",
  "Salty Peanut-Pretzel Ice Cream Cake",
  "A Cool Solution for Hot Summer Nights",
  "Full Irish Breakfast In Manhattan",
  "Overcoming Your Fear Of The Kitchen",
  "Want to Make Creamed Corn Into a Meal? Add Shrimp",
  "Why Healthy Eating Doesn't Mean Dieting",
  "A Quick, Satisfying Fix for Weeknight Chicken",
  "Fresh Food on TV: Weekend Edition",
  "When to Cook Your Vegetables Long Past 'Done'"
];

export const RECOMMENDED_BOOKS: RecommendedBook[] = [
  {
    id: 'bridges-books',
    title: '6 Books About The Best Bridges You Should Read',
    titleSi: 'ලොව විශිෂ්ටතම පාලම් නිර්මාණ පිළිබඳ ඔබ කියවිය යුතු පොත් 6ක්',
    imageUrl: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=400&q=80',
    category: 'RECOMMENDED',
    categorySi: 'නිර්දේශිත',
    readTime: '3 min read',
    readTimeSi: 'මිනිත්තු 3 ක කියවීමක්',
    summary: 'From the Brooklyn Bridge to the Golden Gate, explore historic engineering masterworks and architectural narratives.',
    summarySi: 'බෘක්ලින් පාලමේ සිට ගෝල්ඩන් ගේට් දක්වා, ඓතිහාසික ඉංජිනේරු මහිමය සහ ගෘහ නිර්මාණ ශිල්පය.'
  },
  {
    id: 'architecture-monuments',
    title: 'The Great Architectural Monuments of the 20th Century',
    titleSi: '20 වැනි සියවසේ ශ්‍රේෂ්ඨතම ගෘහ නිර්මාණ ස්මාරක',
    imageUrl: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=400&q=80',
    category: 'ARCHITECTURE',
    categorySi: 'ගෘහ නිර්මාණ',
    readTime: '5 min read',
    readTimeSi: 'මිනිත්තු 5 ක කියවීමක්',
    summary: 'A panoramic review of concrete, glass, and iron marvels that reshaped global metropolises.',
    summarySi: 'ලෝකයේ නගරවල මුහුණුවර වෙනස් කළ කොන්ක්‍රීට් සහ වානේ නිර්මාණ පිළිබඳ විමර්ශනයක්.'
  },
  {
    id: 'urban-transit-subways',
    title: 'Anatomy of Urban Transit: Subways and Skylines',
    titleSi: 'නාගරික ප්‍රවාහනයේ ස්වභාවය: උමං දුම්රිය මාර්ග සහ අහස සිඹින ගොඩනැගිලි',
    imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?auto=format&fit=crop&w=400&q=80',
    category: 'URBANISM',
    categorySi: 'නාගරීකරණය',
    readTime: '4 min read',
    readTimeSi: 'මිනිත්තු 4 ක කියවීමක්',
    summary: 'How underground tunnels and elevated viaducts enabled modern metropolitan life.',
    summarySi: 'භූගත උමං සහ අධිවේගී මාර්ග මඟින් නූතන නාගරික ජීවිතය සවිමත් වූ ආකාරය.'
  }
];

export const TOP_SEARCHES_TAGS = [
  { text: 'Art & Design', textSi: 'කලාව හා මෝස්තර', style: 'text-sm font-semibold tracking-wide text-black' },
  { text: 'Blog', textSi: 'බ්ලොග්', style: 'text-xs italic font-serif text-black' },
  { text: 'Business', textSi: 'ව්‍යාපාර', style: 'text-xs text-black font-medium' },
  { text: 'Culture', textSi: 'සංස්කෘතිය', style: 'text-base font-serif text-black' },
  { text: 'Economy', textSi: 'ආර්ථිකය', style: 'text-sm font-medium text-black' },
  { text: 'Health', textSi: 'සෞඛ්‍ය', style: 'text-sm font-bold text-black' },
  { text: 'Lifestyle', textSi: 'ජීවන රටාව', style: 'text-lg font-serif font-bold text-black' },
  { text: 'Movies', textSi: 'සිනමාව', style: 'text-xs italic text-black' },
  { text: 'N.Y.', textSi: 'එන්.වයි.', style: 'text-sm font-mono text-black' },
  { text: 'Newspaper', textSi: 'පුවත්පත', style: 'text-xs uppercase tracking-wider text-black' },
  { text: 'Obituaries', textSi: 'ශෝක ප්‍රකාශ', style: 'text-xs font-serif text-black' },
  { text: 'Photos', textSi: 'ඡායාරූප', style: 'text-sm font-semibold text-black' },
  { text: 'Politics', textSi: 'දේශපාලන', style: 'text-xs font-serif italic text-black' },
  { text: 'Post', textSi: 'පෝස්ට්', style: 'text-xs text-black' },
  { text: 'Science', textSi: 'විද්‍යාව', style: 'text-sm font-serif text-black' },
  { text: 'Sports', textSi: 'ක්‍රීඩා', style: 'text-sm font-bold text-black' },
  { text: 'Tech', textSi: 'තාක්ෂණ', style: 'text-xs uppercase tracking-widest text-black' },
  { text: "Today's Arts", textSi: 'අද දවසේ කලාව', style: 'text-xs italic font-serif text-black' },
  { text: 'Travel', textSi: 'සංචාරක', style: 'text-sm font-medium text-black' },
  { text: 'U.S.', textSi: 'ඇමෙරිකාව', style: 'text-xs font-bold text-black' },
  { text: 'Videos', textSi: 'වීඩියෝ', style: 'text-xs text-black' },
  { text: 'World', textSi: 'ලෝකය', style: 'text-sm font-serif font-semibold text-black' }
];

export const FOOTER_LINKS = {
  reader: [
    'Reader Center',
    'Tools & Services',
    'Times Topics',
    'T:N Events Guide',
    'Times Journeys',
    'Subscribe Educational Blog',
    'Our Contacts'
  ],
  news: [
    'Arts',
    'Economy',
    'Fashion & Style',
    'Food',
    'Health',
    'Lifestyle',
    'Politics',
    'Science',
    'Sports',
    'Technology',
    'Travel'
  ],
  opinion: [
    "Today's Opinion",
    'Op-Ed Columnists',
    'Editorials',
    'Contributing Writers',
    'Op-Ed Contributors',
    'Opinionator',
    'Letters',
    'Sunday Review',
    'Taking Note',
    'Room for Debate',
    'Public Editor'
  ],
  mostPopular: [
    'Art & Design',
    'World',
    'Blog',
    'Business',
    'Culture',
    'Lifestyle',
    'N.Y.',
    'Newspaper',
    'Photos',
    'Post'
  ]
};

export function getLocalizedArticle(article: Article, lang: Language): Article {
  const offset = article.offsetDays ?? 0;
  const dynamicDate = getRelativeFormattedDate(offset, lang);

  if (lang === 'en') {
    return {
      ...article,
      date: dynamicDate,
    };
  }
  return {
    ...article,
    title: article.titleSi || article.title,
    category: article.categorySi || article.category,
    categorySecondary: article.categorySecondarySi || article.categorySecondary,
    excerpt: article.excerptSi || article.excerpt,
    content: article.contentSi && article.contentSi.length > 0 ? article.contentSi : article.content,
    author: article.authorSi || article.author,
    date: dynamicDate,
    imageCaption: article.imageCaptionSi || article.imageCaption,
    readTime: article.readTimeSi || article.readTime,
    tags: article.tagsSi && article.tagsSi.length > 0 ? article.tagsSi : article.tags,
  };
}

export function getLocalizedBook(book: RecommendedBook, lang: Language): RecommendedBook {
  if (lang === 'en') return book;
  return {
    ...book,
    title: book.titleSi || book.title,
    category: book.categorySi || book.category,
    readTime: book.readTimeSi || book.readTime,
    summary: book.summarySi || book.summary,
  };
}
