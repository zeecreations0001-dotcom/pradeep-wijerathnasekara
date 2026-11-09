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

    // 1. Try Gemini API if API key is configured with fast 1.2-second timeout
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

        // 7.5s timeout gives Gemini ample time to translate full articles
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
        // Fall through immediately to built-in translator
      }
    }

    // 2. Instant resilient fallback translation engine
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
