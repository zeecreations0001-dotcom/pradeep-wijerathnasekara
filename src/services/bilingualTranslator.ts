/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Comprehensive journalistic and educational terminology lexicon
const EN_TO_SI_DICTIONARY: Record<string, string> = {
  // Common educational & media words
  'education': 'අධ්‍යාපනය',
  'educational': 'අධ්‍යාපනික',
  'blog': 'බ්ලොග් අඩවිය',
  'newspaper': 'පුවත්පත',
  'article': 'ලිපිය',
  'articles': 'ලිපි',
  'headline': 'සිරස්තලය',
  'news': 'පුවත්',
  'report': 'වාර්තාව',
  'analysis': 'විග්‍රහය',
  'insights': 'විමර්ශනාත්මක අදහස්',
  'tutorial': 'නිබන්ධනය',
  'tutorials': 'නිබන්ධන',
  'school': 'පාසල',
  'schools': 'පාසල්',
  'student': 'සිසුවා',
  'students': 'සිසුන්',
  'teacher': 'ගුරුවරයා',
  'teachers': 'ගුරුභවතුන්',
  'university': 'විශ්වවිද්‍යාලය',
  'universities': 'විශ්වවිද්‍යාල',
  'knowledge': 'දැනුම',
  'learning': 'ඉගෙනුම',
  'research': 'පර්යේෂණ',
  'study': 'අධ්‍යයනය',
  'studies': 'අධ්‍යයනයන්',
  'exam': 'විභාගය',
  'examinations': 'විභාග',
  'classroom': 'පන්ති කාමරය',
  'curriculum': 'විෂය මාලාව',

  // Categories & themes
  'cultural': 'සංස්කෘතික',
  'culture': 'සංස්කෘතිය',
  'inspirational': 'ආශ්වාදජනක',
  'inspiration': 'ප්‍රබෝධය',
  'politics': 'දේශපාලන',
  'political': 'දේශපාලනික',
  'technology': 'තාක්ෂණය',
  'technological': 'තාක්ෂණික',
  'digital': 'ඩිජිටල්',
  'sports': 'ක්‍රීඩා',
  'fashion': 'විලාසිතා',
  'food': 'ආහාර සංස්කෘතිය',
  'lifestyle': 'ජීවන රටාව',
  'economy': 'ආර්ථිකය',
  'economic': 'ආර්ථික',
  'science': 'විද්‍යාව',
  'scientific': 'විද්‍යාත්මක',
  'environment': 'පරිසරය',
  'editorial': 'කතුවැකිය',

  // Descriptive journalism words
  'breaking': 'උණුසුම්',
  'latest': 'නවතම',
  'recent': 'මෑතකාලීන',
  'global': 'ගෝලීය',
  'local': 'දේශීය',
  'national': 'ජාතික',
  'international': 'ජාත්‍යන්තර',
  'important': 'වැදගත්',
  'significant': 'සුවිශේෂී',
  'comprehensive': 'පුළුල්',
  'future': 'අනාගත',
  'modern': 'නූතන',
  'historical': 'ඓතිහාසික',
  'traditional': 'සාම්ප්‍රදායික',
  'essential': 'අත්‍යවශ්‍ය',
  'success': 'සාර්ථකත්වය',
  'successful': 'සාර්ථක',
  'challenges': 'අභියෝග',
  'development': 'සංවර්ධනය',
  'transformation': 'පරිවර්තනය',
  'growth': 'වර්ධනය',
  'opportunities': 'අවස්ථා',

  // Connectors & verbs
  'and': 'සහ',
  'with': 'සමඟ',
  'in': 'තුළ',
  'on': 'මත',
  'for': 'සඳහා',
  'about': 'පිළිබඳව',
  'by': 'විසින්',
  'from': 'සිට',
  'to': 'වෙත',
  'the': '',
  'a': '',
  'an': '',
  'is': 'වේ',
  'are': 'වේ',
  'was': 'විය',
  'were': 'විය',
  'has': 'ඇත',
  'have': 'ඇත',
  'sri': 'ශ්‍රී',
  'lanka': 'ලංකා',
  'colombo': 'කොළඹ',
  'ministry': 'අමාත්‍යාංශය',
  'minister': 'අමාත්‍යවරයා',
  'government': 'රජය',
  'president': 'ජනාධිපතිවරයා',
  'country': 'රට',
  'island': 'දිවයින',
  'children': 'දරුවන්',
  'parents': 'දෙමාපියන්',
  'results': 'ප්‍රතිඵල',
  'schedule': 'කාලසටහන',
  'programme': 'වැඩසටහන',
  'program': 'වැඩසටහන',
  'project': 'ව්‍යාපෘතිය',
  'policy': 'ප්‍රතිපත්තිය',
  'today': 'අද',
  'yesterday': 'ඊයේ',
  'tomorrow': 'හෙට',
  'new': 'නව',
  'announced': 'නිවේදනය කරන ලදී',
  'announced_by': 'විසින් නිවේදනය කරන ලදී',
  'prepare': 'සූදානම් වේ',
  'across': 'පුරා',
  'all': 'සියලු',
  'state': 'රාජ්‍ය',
  'private': 'පෞද්ගලික',
  'higher': 'උසස්',
  'system': 'පද්ධතිය',
  'held': 'පැවැත්වේ',
  'begins': 'ආරම්භ වේ',
  'ended': 'අවසන් විය',
  'will': 'සිදුවනු ඇත',
  'provides': 'සපයයි',
  'reveals': 'හෙළිදරව් කරයි',
  'shows': 'පෙන්වා දෙයි',
  'explains': 'පැහැදිලි කරයි',
  'announces': 'නිවේදනය කරයි',
  'discusses': 'සාකච්ඡා කරයි',
};

// Inverse dictionary for Sinhala to English
const SI_TO_EN_DICTIONARY: Record<string, string> = {};
for (const [en, si] of Object.entries(EN_TO_SI_DICTIONARY)) {
  if (si && !SI_TO_EN_DICTIONARY[si]) {
    SI_TO_EN_DICTIONARY[si] = en.charAt(0).toUpperCase() + en.slice(1);
  }
}

// Additional Sinhala journalistic words & phrases
SI_TO_EN_DICTIONARY['ශ්‍රී ලංකා'] = 'Sri Lanka';
SI_TO_EN_DICTIONARY['ශ්‍රී ලංකාව'] = 'Sri Lanka';
SI_TO_EN_DICTIONARY['ශ්‍රී ලංකාවේ'] = 'of Sri Lanka';
SI_TO_EN_DICTIONARY['කොළඹ'] = 'Colombo';
SI_TO_EN_DICTIONARY['කොළඹදී'] = 'in Colombo';
SI_TO_EN_DICTIONARY['රජය'] = 'Government';
SI_TO_EN_DICTIONARY['සමාජය'] = 'Society';
SI_TO_EN_DICTIONARY['මහජන'] = 'Public';
SI_TO_EN_DICTIONARY['විශේෂ'] = 'Special';
SI_TO_EN_DICTIONARY['විශේෂාංග'] = 'Featured';
SI_TO_EN_DICTIONARY['විද්‍යාඥයින්'] = 'Scientists';
SI_TO_EN_DICTIONARY['පර්යේෂකයින්'] = 'Researchers';
SI_TO_EN_DICTIONARY['කර්තෘ'] = 'Editorial';
SI_TO_EN_DICTIONARY['මණ්ඩලය'] = 'Board';
SI_TO_EN_DICTIONARY['සංස්කාරක'] = 'Editor';
SI_TO_EN_DICTIONARY['වාර්තාකරු'] = 'Correspondent';
SI_TO_EN_DICTIONARY['ප්‍රකාශ'] = 'Statements';
SI_TO_EN_DICTIONARY['කරයි'] = 'states';
SI_TO_EN_DICTIONARY['සඳහන්'] = 'mentioned';
SI_TO_EN_DICTIONARY['අනාවරණය'] = 'revealed';
SI_TO_EN_DICTIONARY['තහවුරු'] = 'confirmed';
SI_TO_EN_DICTIONARY['නව'] = 'New';
SI_TO_EN_DICTIONARY['නවතම'] = 'Latest';
SI_TO_EN_DICTIONARY['සුවිශේෂී'] = 'Remarkable';
SI_TO_EN_DICTIONARY['ඓතිහාසික'] = 'Historic';
SI_TO_EN_DICTIONARY['ජාතික'] = 'National';
SI_TO_EN_DICTIONARY['ජාත්‍යන්තර'] = 'International';
SI_TO_EN_DICTIONARY['ගෝලීය'] = 'Global';
SI_TO_EN_DICTIONARY['ප්‍රධාන'] = 'Major';
SI_TO_EN_DICTIONARY['උණුසුම්'] = 'Breaking';
SI_TO_EN_DICTIONARY['විශ්වවිද්‍යාල'] = 'Universities';
SI_TO_EN_DICTIONARY['විශ්වවිද්‍යාලය'] = 'University';
SI_TO_EN_DICTIONARY['විශ්වවිද්‍යාලයේ'] = 'of the University';
SI_TO_EN_DICTIONARY['අධ්‍යාපන'] = 'Education';
SI_TO_EN_DICTIONARY['අධ්‍යාපනය'] = 'Education';
SI_TO_EN_DICTIONARY['අධ්‍යාපනික'] = 'Educational';
SI_TO_EN_DICTIONARY['පාසල්'] = 'Schools';
SI_TO_EN_DICTIONARY['පාසල'] = 'School';
SI_TO_EN_DICTIONARY['සිසුන්'] = 'Students';
SI_TO_EN_DICTIONARY['සිසුවා'] = 'Student';
SI_TO_EN_DICTIONARY['ගුරුවරුන්'] = 'Teachers';
SI_TO_EN_DICTIONARY['විෂය'] = 'Subject';
SI_TO_EN_DICTIONARY['විභාග'] = 'Examinations';
SI_TO_EN_DICTIONARY['ආර්ථික'] = 'Economic';
SI_TO_EN_DICTIONARY['ආර්ථිකය'] = 'Economy';
SI_TO_EN_DICTIONARY['දේශපාලන'] = 'Political';
SI_TO_EN_DICTIONARY['දේශපාලනය'] = 'Politics';
SI_TO_EN_DICTIONARY['තාක්ෂණ'] = 'Technology';
SI_TO_EN_DICTIONARY['තාක්ෂණය'] = 'Technology';
SI_TO_EN_DICTIONARY['තාක්ෂණික'] = 'Technological';
SI_TO_EN_DICTIONARY['සංස්කෘතික'] = 'Cultural';
SI_TO_EN_DICTIONARY['සංස්කෘතිය'] = 'Culture';
SI_TO_EN_DICTIONARY['ක්‍රීඩා'] = 'Sports';
SI_TO_EN_DICTIONARY['කාලගුණ'] = 'Weather';
SI_TO_EN_DICTIONARY['පරිසර'] = 'Environment';
SI_TO_EN_DICTIONARY['සංවර්ධන'] = 'Development';
SI_TO_EN_DICTIONARY['සංවර්ධනය'] = 'Development';
SI_TO_EN_DICTIONARY['ව්‍යාපෘතිය'] = 'Project';
SI_TO_EN_DICTIONARY['වැඩසටහන'] = 'Program';
SI_TO_EN_DICTIONARY['සැලසුම්'] = 'Plans';
SI_TO_EN_DICTIONARY['සාකච්ඡා'] = 'Discussions';
SI_TO_EN_DICTIONARY['හමුව'] = 'Meeting';
SI_TO_EN_DICTIONARY['සම්මුතිය'] = 'Accord';
SI_TO_EN_DICTIONARY['ගිවිසුම'] = 'Agreement';
SI_TO_EN_DICTIONARY['තීරණය'] = 'Decision';
SI_TO_EN_DICTIONARY['අභියෝග'] = 'Challenges';
SI_TO_EN_DICTIONARY['අවස්ථා'] = 'Opportunities';
SI_TO_EN_DICTIONARY['සාර්ථක'] = 'Successful';
SI_TO_EN_DICTIONARY['ප්‍රතිඵල'] = 'Results';
SI_TO_EN_DICTIONARY['ක්‍රියාවලිය'] = 'Process';
SI_TO_EN_DICTIONARY['ක්ෂේත්‍රය'] = 'Sector';
SI_TO_EN_DICTIONARY['මහ බැංකුව'] = 'Central Bank';
SI_TO_EN_DICTIONARY['ශ්‍රී ලංකා මහ බැංකුව'] = 'Central Bank of Sri Lanka';
SI_TO_EN_DICTIONARY['බැංකුව'] = 'Bank';
SI_TO_EN_DICTIONARY['බැංකු'] = 'Banks';
SI_TO_EN_DICTIONARY['මූල්‍ය'] = 'Financial';
SI_TO_EN_DICTIONARY['ප්‍රතිපත්තියක්'] = 'Policy';
SI_TO_EN_DICTIONARY['ප්‍රතිපත්තිය'] = 'Policy';
SI_TO_EN_DICTIONARY['ප්‍රතිපත්ති'] = 'Policies';
SI_TO_EN_DICTIONARY['ප්‍රකාශයට පත්'] = 'announced';
SI_TO_EN_DICTIONARY['කරන ලදී'] = 'was conducted';
SI_TO_EN_DICTIONARY['හඳුන්වා දී ඇත'] = 'has introduced';
SI_TO_EN_DICTIONARY['ස්ථාවරත්වය'] = 'Stability';
SI_TO_EN_DICTIONARY['විදේශ සංචිත'] = 'Foreign Reserves';
SI_TO_EN_DICTIONARY['සංචිත'] = 'Reserves';
SI_TO_EN_DICTIONARY['උද්ධමනය'] = 'Inflation';
SI_TO_EN_DICTIONARY['පාලනය'] = 'Control';
SI_TO_EN_DICTIONARY['වර්ධනය'] = 'Growth';
SI_TO_EN_DICTIONARY['සහන'] = 'Relief';
SI_TO_EN_DICTIONARY['මිල'] = 'Price';
SI_TO_EN_DICTIONARY['මිල ගණන්'] = 'Prices';
SI_TO_EN_DICTIONARY['වෙළෙඳපොළ'] = 'Market';
SI_TO_EN_DICTIONARY['ආයෝජන'] = 'Investment';
SI_TO_EN_DICTIONARY['නිෂ්පාදන'] = 'Production';
SI_TO_EN_DICTIONARY['කර්මාන්ත'] = 'Industry';
SI_TO_EN_DICTIONARY['සේවා'] = 'Services';
SI_TO_EN_DICTIONARY['ප්‍රවාහන'] = 'Transport';
SI_TO_EN_DICTIONARY['සෞඛ්‍ය'] = 'Health';
SI_TO_EN_DICTIONARY['රෝහල්'] = 'Hospitals';
SI_TO_EN_DICTIONARY['ඖෂධ'] = 'Medicine';
SI_TO_EN_DICTIONARY['වෛද්‍ය'] = 'Medical';
SI_TO_EN_DICTIONARY['ආරක්ෂක'] = 'Security';
SI_TO_EN_DICTIONARY['හමුදාව'] = 'Armed Forces';
SI_TO_EN_DICTIONARY['පොලිසිය'] = 'Police';
SI_TO_EN_DICTIONARY['නීතිය'] = 'Law';
SI_TO_EN_DICTIONARY['අධිකරණය'] = 'Court';
SI_TO_EN_DICTIONARY['විනිසුරු'] = 'Judge';
SI_TO_EN_DICTIONARY['මැතිවරණ'] = 'Elections';
SI_TO_EN_DICTIONARY['පාර්ලිමේන්තුව'] = 'Parliament';
SI_TO_EN_DICTIONARY['මන්ත්‍රී'] = 'Member of Parliament';
SI_TO_EN_DICTIONARY['අගමැති'] = 'Prime Minister';
SI_TO_EN_DICTIONARY['ජනපති'] = 'President';
SI_TO_EN_DICTIONARY['ප්‍රජාතන්ත්‍රවාදය'] = 'Democracy';
SI_TO_EN_DICTIONARY['මානව හිමිකම්'] = 'Human Rights';
SI_TO_EN_DICTIONARY['අයිතිවාසිකම්'] = 'Rights';
SI_TO_EN_DICTIONARY['නිදහස'] = 'Freedom';
SI_TO_EN_DICTIONARY['සාමය'] = 'Peace';
SI_TO_EN_DICTIONARY['සංහිඳියාව'] = 'Reconciliation';
SI_TO_EN_DICTIONARY['සංචාරක'] = 'Tourism';
SI_TO_EN_DICTIONARY['සංචාරකයින්'] = 'Tourists';
SI_TO_EN_DICTIONARY['හෝටල්'] = 'Hotels';
SI_TO_EN_DICTIONARY['ගුවන්'] = 'Aviation';
SI_TO_EN_DICTIONARY['නැව්'] = 'Shipping';
SI_TO_EN_DICTIONARY['වරාය'] = 'Port';
SI_TO_EN_DICTIONARY['කෘෂිකර්ම'] = 'Agriculture';
SI_TO_EN_DICTIONARY['ගොවීන්'] = 'Farmers';
SI_TO_EN_DICTIONARY['අස්වැන්න'] = 'Harvest';
SI_TO_EN_DICTIONARY['පොහොර'] = 'Fertilizer';
SI_TO_EN_DICTIONARY['ජලය'] = 'Water';
SI_TO_EN_DICTIONARY['විදුලිය'] = 'Electricity';
SI_TO_EN_DICTIONARY['ඉන්ධන'] = 'Fuel';
SI_TO_EN_DICTIONARY['තෙල්'] = 'Oil';
SI_TO_EN_DICTIONARY['ගෑස්'] = 'Gas';
SI_TO_EN_DICTIONARY['බලශක්ති'] = 'Energy';
SI_TO_EN_DICTIONARY['පුනර්ජනනීය'] = 'Renewable';
SI_TO_EN_DICTIONARY['දේශගුණික'] = 'Climatic';
SI_TO_EN_DICTIONARY['විපර්යාස'] = 'Change';
SI_TO_EN_DICTIONARY['ගංවතුර'] = 'Floods';
SI_TO_EN_DICTIONARY['නියඟය'] = 'Drought';
SI_TO_EN_DICTIONARY['ආපදා'] = 'Disaster';
SI_TO_EN_DICTIONARY['කළමනාකරණ'] = 'Management';
SI_TO_EN_DICTIONARY['අනතුරු ඇඟවීම්'] = 'Warnings';
SI_TO_EN_DICTIONARY['වාර්තාව'] = 'Report';
SI_TO_EN_DICTIONARY['විශ්ලේෂණය'] = 'Analysis';
SI_TO_EN_DICTIONARY['සංඛ්‍යාලේඛන'] = 'Statistics';
SI_TO_EN_DICTIONARY['අධ්‍යයනය'] = 'Study';
SI_TO_EN_DICTIONARY['සමීක්ෂණය'] = 'Survey';
SI_TO_EN_DICTIONARY['සම්මුඛ සාකච්ඡාව'] = 'Interview';
SI_TO_EN_DICTIONARY['විශේෂ වාර්තාව'] = 'Special Report';
SI_TO_EN_DICTIONARY['සංස්කාරක මණ්ඩලය'] = 'Editorial Board';
SI_TO_EN_DICTIONARY['විසින්'] = 'by';
SI_TO_EN_DICTIONARY['සඳහා'] = 'for';
SI_TO_EN_DICTIONARY['පිළිබඳව'] = 'regarding';
SI_TO_EN_DICTIONARY['සමඟ'] = 'with';
SI_TO_EN_DICTIONARY['සහ'] = 'and';
SI_TO_EN_DICTIONARY['තුළ'] = 'in';
SI_TO_EN_DICTIONARY['ඔස්සේ'] = 'through';
SI_TO_EN_DICTIONARY['වෙත'] = 'to';
SI_TO_EN_DICTIONARY['මත'] = 'on';

/**
 * Translates a single text sentence or headline from English to Sinhala
 */
export function translateEnToSiText(text: string): string {
  if (!text || !text.trim()) return '';

  // Preserve HTML tags
  const tagMatches: { placeholder: string; tag: string }[] = [];
  let cleanText = text.replace(/<[^>]+>/g, (tag, idx) => {
    const placeholder = `__TAG_${idx}__`;
    tagMatches.push({ placeholder, tag });
    return placeholder;
  });

  // Tokenize preserving punctuation
  const words = cleanText.split(/(\s+|[.,!?:;()"-]+)/);
  const translatedTokens = words.map((token) => {
    // If it's a tag placeholder or punctuation or whitespace, preserve
    if (/^__TAG_\d+__$/.test(token) || /^[\s.,!?:;()"-]+$/.test(token)) {
      return token;
    }

    const lower = token.toLowerCase();
    if (EN_TO_SI_DICTIONARY[lower]) {
      return EN_TO_SI_DICTIONARY[lower];
    }

    // Try stem / plural removal
    if (lower.endsWith('s') && EN_TO_SI_DICTIONARY[lower.slice(0, -1)]) {
      return EN_TO_SI_DICTIONARY[lower.slice(0, -1)];
    }
    if (lower.endsWith('ing') && EN_TO_SI_DICTIONARY[lower.slice(0, -3)]) {
      return EN_TO_SI_DICTIONARY[lower.slice(0, -3)] + ' ක්‍රියාවලිය';
    }

    // If word is not in dictionary, leave as is
    return token;
  });

  let result = translatedTokens.join('');

  // Re-substitute HTML tags
  for (const { placeholder, tag } of tagMatches) {
    result = result.replace(placeholder, tag);
  }

  return result.trim();
}

/**
 * Translates text from Sinhala to English
 */
export function translateSiToEnText(text: string): string {
  if (!text || !text.trim()) return '';

  // Preserve HTML tags
  const tagMatches: { placeholder: string; tag: string }[] = [];
  let cleanText = text.replace(/<[^>]+>/g, (tag, idx) => {
    const placeholder = `__TAG_${idx}__`;
    tagMatches.push({ placeholder, tag });
    return placeholder;
  });

  // Multi-word Sinhala phrases matched first (e.g. "මහ බැංකුව", "ශ්‍රී ලංකා")
  const multiWordPhrases = Object.keys(SI_TO_EN_DICTIONARY)
    .filter((k) => k.includes(' '))
    .sort((a, b) => b.length - a.length);

  for (const phrase of multiWordPhrases) {
    if (cleanText.includes(phrase)) {
      cleanText = cleanText.split(phrase).join(` ${SI_TO_EN_DICTIONARY[phrase]} `);
    }
  }

  // Tokenize preserving punctuation
  const words = cleanText.split(/(\s+|[.,!?:;()"-]+)/);
  const translatedTokens = words.map((token) => {
    if (!token || /^__TAG_\d+__$/.test(token) || /^[\s.,!?:;()"-]+$/.test(token)) {
      return token;
    }

    if (SI_TO_EN_DICTIONARY[token]) {
      return SI_TO_EN_DICTIONARY[token];
    }

    // Common grammatical suffix heuristics
    if (token.endsWith('යේ') && SI_TO_EN_DICTIONARY[token.slice(0, -2)]) {
      return 'of ' + SI_TO_EN_DICTIONARY[token.slice(0, -2)];
    }
    if (token.endsWith('ට') && SI_TO_EN_DICTIONARY[token.slice(0, -1)]) {
      return 'to ' + SI_TO_EN_DICTIONARY[token.slice(0, -1)];
    }
    if (token.endsWith('න්') && SI_TO_EN_DICTIONARY[token.slice(0, -1)]) {
      return SI_TO_EN_DICTIONARY[token.slice(0, -1)];
    }

    return token;
  });

  let result = translatedTokens.join('');

  for (const { placeholder, tag } of tagMatches) {
    result = result.replace(placeholder, tag);
  }

  return result.trim();
}

/**
 * Full fallback translation for an article
 */
export function fallbackTranslateArticle(
  title: string,
  excerpt: string,
  content: string,
  targetLang: 'si' | 'en'
): { translatedTitle: string; translatedExcerpt: string; translatedContent: string } {
  if (targetLang === 'si') {
    return {
      translatedTitle: translateEnToSiText(title) || title,
      translatedExcerpt: translateEnToSiText(excerpt) || excerpt,
      translatedContent: translateEnToSiText(content) || content,
    };
  } else {
    return {
      translatedTitle: translateSiToEnText(title) || title,
      translatedExcerpt: translateSiToEnText(excerpt) || excerpt,
      translatedContent: translateSiToEnText(content) || content,
    };
  }
}
