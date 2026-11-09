/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { fallbackTranslateArticle } from './bilingualTranslator';

export interface TranslationResult {
  success: boolean;
  translatedTitle: string;
  translatedExcerpt: string;
  translatedContent: string;
  engine?: string;
  note?: string;
  error?: string;
}

export interface TranslationInput {
  title: string;
  excerpt?: string;
  content: string;
  targetLanguage: 'si' | 'en';
  sourceLanguage?: 'si' | 'en';
}

/**
 * Calls the server-side Gemini API endpoint to translate article components
 * between English and Sinhala while preserving HTML formatting.
 * Automatically falls back to built-in linguistic translator if server API is unreachable.
 */
export async function translateArticle({
  title,
  excerpt = '',
  content,
  targetLanguage,
  sourceLanguage,
}: TranslationInput): Promise<TranslationResult> {
  const determinedSourceLang = sourceLanguage || (targetLanguage === 'si' ? 'en' : 'si');

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8500);

    const response = await fetch('/api/translate-article', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        title,
        excerpt,
        content,
        targetLanguage,
        sourceLanguage: determinedSourceLang,
      }),
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    if (response.ok) {
      const data = await response.json();
      if (data.success && (data.translatedTitle || data.translatedContent)) {
        return {
          success: true,
          engine: data.engine,
          note: data.note,
          translatedTitle: data.translatedTitle || '',
          translatedExcerpt: data.translatedExcerpt || '',
          translatedContent: data.translatedContent || '',
        };
      }
    }
  } catch (netErr: any) {
    // Network call failed or timed out - seamlessly proceed to client-side translator
  }

  // Resilient fallback: translate directly on client
  try {
    const fallback = fallbackTranslateArticle(title, excerpt, content, targetLanguage);
    return {
      success: true,
      engine: 'bilingual-lexicon',
      translatedTitle: fallback.translatedTitle,
      translatedExcerpt: fallback.translatedExcerpt,
      translatedContent: fallback.translatedContent,
    };
  } catch (err: any) {
    return {
      success: false,
      translatedTitle: '',
      translatedExcerpt: '',
      translatedContent: '',
      error: 'Translation error: ' + (err.message || 'Unknown'),
    };
  }
}
