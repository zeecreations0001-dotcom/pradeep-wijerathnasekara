import express from 'express';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';
import { GoogleGenAI, Type } from '@google/genai';
import { fallbackTranslateArticle } from './src/services/bilingualTranslator';

dotenv.config();

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Helper with timeout
function withTimeout<T>(promise: Promise<T>, ms: number, errorMsg: string): Promise<T> {
  let timer: any;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(errorMsg)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

// Fast neural machine translation helper for full articles
async function translateTextViaMyMemory(text: string, sl: string, tl: string): Promise<string> {
  if (!text || !text.trim()) return '';
  const clean = text.trim();
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(clean)}&langpair=${sl}|${tl}`;
  const res = await fetch(url, { headers: { 'User-Agent': 'HeraldNewsroom/1.0' } });
  if (!res.ok) throw new Error(`MyMemory HTTP ${res.status}`);
  const data = await res.json();
  const result = data?.responseData?.translatedText;
  if (!result || result.includes('MYMEMORY WARNING')) {
    throw new Error('MyMemory quota warning or invalid response');
  }
  return result;
}

async function translateArticleField(fullText: string, sl: string, tl: string): Promise<string> {
  if (!fullText || !fullText.trim()) return '';

  // Split paragraphs by </p> or double newline
  const rawParas = fullText
    .split(/<\/p>|\n\n+/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  // Translate all paragraphs in parallel
  const translatedParas = await Promise.all(
    rawParas.map(async (rawPara) => {
      const hasPTag = rawPara.startsWith('<p') || fullText.includes('<p>');
      const cleanText = rawPara.replace(/<[^>]+>/g, '').trim();
      if (!cleanText) return '';

      // Split into sentences if paragraph is long
      const sentenceChunks = cleanText.split(/([.!?।]+[\s$])/);
      const translatedChunks: string[] = [];
      let buffer = '';

      for (const chunk of sentenceChunks) {
        if ((buffer + chunk).length > 350) {
          if (buffer.trim()) {
            const trans = await translateTextViaMyMemory(buffer, sl, tl);
            translatedChunks.push(trans);
            buffer = '';
          }
        }
        buffer += chunk;
      }
      if (buffer.trim()) {
        const trans = await translateTextViaMyMemory(buffer, sl, tl);
        translatedChunks.push(trans);
      }

      const paraText = translatedChunks.join(' ');
      return hasPTag ? `<p>${paraText}</p>` : paraText;
    })
  );

  return translatedParas.filter((p) => p.length > 0).join('\n\n');
}

// Translation endpoint for articles
app.post('/api/translate-article', async (req, res) => {
  try {
    const body = req.body || {};
    const title = typeof body.title === 'string' ? body.title : '';
    const excerpt = typeof body.excerpt === 'string' ? body.excerpt : '';
    const content = typeof body.content === 'string' ? body.content : '';
    const targetLanguage = body.targetLanguage === 'si' ? 'si' : 'en';
    const sourceLanguage = body.sourceLanguage === 'si' ? 'si' : (targetLanguage === 'si' ? 'en' : 'si');

    if (!title.trim() && !content.trim()) {
      return res.status(400).json({ error: 'Title or content required for translation', success: false });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    const isKeyAvailable = Boolean(apiKey && apiKey.trim() && apiKey !== 'MY_GEMINI_API_KEY');

    // 1. Try Gemini API if API key is configured with fast 7.5-second timeout
    if (isKeyAvailable && apiKey) {
      try {
        const ai = new GoogleGenAI({
          apiKey,
          httpOptions: {
            headers: {
              'User-Agent': 'aistudio-build',
            },
          },
        });

        const targetLangName = targetLanguage === 'si' ? 'Sinhala (සිංහල)' : 'English';
        const sourceLangName = sourceLanguage === 'si' ? 'Sinhala (සිංහල)' : 'English';

        const prompt = `You are an expert bilingual news journalist and senior editor for Sri Lankan educational journalism.
Translate the following news article from ${sourceLangName} into natural, publication-grade ${targetLangName}.
Preserve any HTML tags (such as <p>, <strong>, <em>, <blockquote>, <ul>, <li>, <h3>, etc.) present in the content so the rich text layout remains intact.
Translate with high linguistic accuracy, formal journalistic tone, and natural phrasing.

Source Title:
${title}

Source Excerpt / Summary:
${excerpt}

Source Content:
${content}
`;

        const apiCall = ai.models.generateContent({
          model: 'gemini-flash-latest',
          contents: prompt,
          config: {
            systemInstruction: `You are an expert Sri Lankan bilingual newspaper editor translating between English and Sinhala. Produce fluent, grammatically flawless, authoritative journalism text. Maintain HTML structure. Return pure JSON only.`,
            responseMimeType: 'application/json',
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                translatedTitle: {
                  type: Type.STRING,
                  description: `Article headline translated into ${targetLangName}`,
                },
                translatedExcerpt: {
                  type: Type.STRING,
                  description: `Brief summary or excerpt translated into ${targetLangName}`,
                },
                translatedContent: {
                  type: Type.STRING,
                  description: `Full article body translated into ${targetLangName}, maintaining HTML markup`,
                },
              },
              required: ['translatedTitle', 'translatedContent'],
            },
          },
        });

        const response = await withTimeout(apiCall, 7500, 'Gemini request timed out');
        const parsed = JSON.parse(response.text || '{}');
        if (parsed.translatedTitle || parsed.translatedContent) {
          return res.json({
            success: true,
            engine: 'gemini-ai',
            model: 'gemini-flash-latest',
            translatedTitle: parsed.translatedTitle || title,
            translatedExcerpt: parsed.translatedExcerpt || excerpt,
            translatedContent: parsed.translatedContent || content,
          });
        }
      } catch (aiErr: any) {
        console.warn('[Gemini AI Translation Error]', aiErr?.message || aiErr);
        // Fall through immediately to neural translation engine
      }
    }

    // 2. High-speed neural translation engine (translates entire full article text)
    try {
      const [neuralTitle, neuralExcerpt, neuralContent] = await withTimeout(
        Promise.all([
          title.trim() ? translateTextViaMyMemory(title, sourceLanguage, targetLanguage) : Promise.resolve(''),
          excerpt.trim() ? translateTextViaMyMemory(excerpt, sourceLanguage, targetLanguage) : Promise.resolve(''),
          content.trim() ? translateArticleField(content, sourceLanguage, targetLanguage) : Promise.resolve(''),
        ]),
        10000,
        'Neural translation timed out'
      );

      if (neuralTitle || neuralContent) {
        return res.json({
          success: true,
          engine: 'neural-translator',
          translatedTitle: neuralTitle || title,
          translatedExcerpt: neuralExcerpt || excerpt,
          translatedContent: neuralContent || content,
        });
      }
    } catch (neuralErr: any) {
      console.warn('[Neural Translation Error]', neuralErr?.message || neuralErr);
      // Fall through to dictionary fallback
    }

    // 3. Instant resilient fallback translation engine
    const fallback = fallbackTranslateArticle(title, excerpt, content, targetLanguage);
    return res.json({
      success: true,
      engine: 'bilingual-lexicon',
      translatedTitle: fallback.translatedTitle,
      translatedExcerpt: fallback.translatedExcerpt,
      translatedContent: fallback.translatedContent,
    });
  } catch (err: any) {
    console.error('Translation error:', err);
    const body = req.body || {};
    const fallback = fallbackTranslateArticle(
      body.title || '',
      body.excerpt || '',
      body.content || '',
      body.targetLanguage || 'si'
    );
    return res.json({
      success: true,
      engine: 'fallback-emergency',
      translatedTitle: fallback.translatedTitle,
      translatedExcerpt: fallback.translatedExcerpt,
      translatedContent: fallback.translatedContent,
    });
  }
});

import { serverDb } from './src/server/newsroomServerDb';

// Newsroom Persistent Cloud Database Endpoints
app.get('/api/newsroom/store', (req, res) => {
  try {
    const data = serverDb.getAll();
    res.json({ success: true, data });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/newsroom/articles', (req, res) => {
  try {
    const article = req.body;
    if (!article || !article.id) {
      return res.status(400).json({ success: false, error: 'Article ID is required' });
    }
    const saved = serverDb.saveArticle(article);
    res.json({ success: true, article: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.delete('/api/newsroom/articles/:id', (req, res) => {
  try {
    const ok = serverDb.deleteArticle(req.params.id);
    res.json({ success: ok });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/newsroom/breaking', (req, res) => {
  try {
    const items = req.body;
    const saved = serverDb.saveBreakingNews(items);
    res.json({ success: true, items: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/newsroom/frontpage', (req, res) => {
  try {
    const layout = req.body;
    const saved = serverDb.saveFrontPage(layout);
    res.json({ success: true, frontPage: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/newsroom/settings', (req, res) => {
  try {
    const settings = req.body;
    const saved = serverDb.saveSettings(settings);
    res.json({ success: true, settings: saved });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/newsroom/sync', (req, res) => {
  try {
    const synced = serverDb.syncAll(req.body || {});
    res.json({ success: true, data: synced });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/newsroom/export', (req, res) => {
  try {
    const data = serverDb.getAll();
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="newsroom-database-backup.json"');
    res.send(JSON.stringify(data, null, 2));
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/newsroom/import', (req, res) => {
  try {
    const data = req.body;
    const synced = serverDb.syncAll(data);
    res.json({ success: true, data: synced });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Quick health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (req, res) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
