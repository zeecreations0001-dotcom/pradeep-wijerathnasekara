/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import fs from 'fs';
import path from 'path';
import {
  Article,
  BreakingNewsItem,
  FrontPageLayout,
  SiteSettings,
  Section,
  Tag,
  Edition,
  MediaItem,
  StaffMember,
  Comment,
  NewsletterSubscriber,
  ActivityLog,
} from '../types/admin';
import {
  INITIAL_ARTICLES,
  INITIAL_SECTIONS,
  INITIAL_TAGS,
  INITIAL_BREAKING_NEWS,
  INITIAL_FRONT_PAGE,
  INITIAL_EDITIONS,
  INITIAL_MEDIA,
  INITIAL_COMMENTS,
  INITIAL_SUBSCRIBERS,
  INITIAL_SITE_SETTINGS,
  INITIAL_STAFF,
} from '../services/adminStore';

export interface ServerStoreData {
  articles: Article[];
  sections: Section[];
  tags: Tag[];
  breakingNews: BreakingNewsItem[];
  frontPage: FrontPageLayout;
  settings: SiteSettings;
  editions: Edition[];
  media: MediaItem[];
  staff: StaffMember[];
  comments: Comment[];
  subscribers: NewsletterSubscriber[];
  logs: ActivityLog[];
  version: number;
  lastUpdated: string;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'newsroom-db.json');

class NewsroomServerDb {
  private data: ServerStoreData;
  private isLoaded = false;

  constructor() {
    this.data = this.getDefaultData();
    this.init();
  }

  private getDefaultData(): ServerStoreData {
    return {
      articles: INITIAL_ARTICLES,
      sections: INITIAL_SECTIONS,
      tags: INITIAL_TAGS,
      breakingNews: INITIAL_BREAKING_NEWS,
      frontPage: INITIAL_FRONT_PAGE,
      settings: INITIAL_SITE_SETTINGS,
      editions: INITIAL_EDITIONS,
      media: INITIAL_MEDIA,
      staff: INITIAL_STAFF,
      comments: INITIAL_COMMENTS,
      subscribers: INITIAL_SUBSCRIBERS,
      logs: [],
      version: 1,
      lastUpdated: new Date().toISOString(),
    };
  }

  private init() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }

      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        if (raw && raw.trim().startsWith('{')) {
          const parsed = JSON.parse(raw);
          this.data = {
            ...this.getDefaultData(),
            ...parsed,
          };
          this.isLoaded = true;
          return;
        }
      }

      // Write default file
      this.saveToDisk();
      this.isLoaded = true;
    } catch (err) {
      console.warn('[NewsroomServerDb] Failed to load DB file, using memory fallback:', err);
      this.isLoaded = true;
    }
  }

  private saveToDisk() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      this.data.lastUpdated = new Date().toISOString();
      this.data.version = (this.data.version || 1) + 1;
      fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('[NewsroomServerDb] Error writing to DB file:', err);
    }
  }

  public getAll(): ServerStoreData {
    return this.data;
  }

  public saveArticle(article: Article): Article {
    const list = this.data.articles || [];
    const idx = list.findIndex((a) => a.id === article.id);
    const now = new Date().toISOString();

    const wordCount = ((article.content || '') + ' ' + (article.contentSi || ''))
      .replace(/<[^>]+>/g, '')
      .split(/\s+/)
      .filter(Boolean).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));

    const finalArt: Article = {
      ...article,
      readingTimeMinutes: readingTime,
      updatedAt: now,
      publishedAt: article.editorialStatus === 'published' ? (article.publishedAt || now) : article.publishedAt,
    };

    if (idx >= 0) {
      list[idx] = finalArt;
    } else {
      list.unshift(finalArt);
    }

    this.data.articles = list;
    this.saveToDisk();
    return finalArt;
  }

  public deleteArticle(id: string): boolean {
    const list = this.data.articles || [];
    const initialLen = list.length;
    this.data.articles = list.filter((a) => a.id !== id);
    if (this.data.articles.length !== initialLen) {
      this.saveToDisk();
      return true;
    }
    return false;
  }

  public saveBreakingNews(items: BreakingNewsItem[]): BreakingNewsItem[] {
    this.data.breakingNews = items;
    this.saveToDisk();
    return items;
  }

  public saveFrontPage(layout: FrontPageLayout): FrontPageLayout {
    this.data.frontPage = layout;
    this.saveToDisk();
    return layout;
  }

  public saveSettings(settings: SiteSettings): SiteSettings {
    this.data.settings = settings;
    this.saveToDisk();
    return settings;
  }

  public saveSection(sec: Section): Section {
    const list = this.data.sections || [];
    const idx = list.findIndex((s) => s.id === sec.id);
    if (idx >= 0) list[idx] = sec;
    else list.push(sec);
    this.data.sections = list;
    this.saveToDisk();
    return sec;
  }

  public deleteSection(id: string): boolean {
    const list = this.data.sections || [];
    this.data.sections = list.filter((s) => s.id !== id);
    this.saveToDisk();
    return true;
  }

  public saveTag(tag: Tag): Tag {
    const list = this.data.tags || [];
    const idx = list.findIndex((t) => t.id === tag.id);
    if (idx >= 0) list[idx] = tag;
    else list.push(tag);
    this.data.tags = list;
    this.saveToDisk();
    return tag;
  }

  public deleteTag(id: string): boolean {
    const list = this.data.tags || [];
    this.data.tags = list.filter((t) => t.id !== id);
    this.saveToDisk();
    return true;
  }

  public syncAll(incoming: Partial<ServerStoreData>): ServerStoreData {
    if (incoming.articles && Array.isArray(incoming.articles)) {
      this.data.articles = incoming.articles;
    }
    if (incoming.breakingNews && Array.isArray(incoming.breakingNews)) {
      this.data.breakingNews = incoming.breakingNews;
    }
    if (incoming.frontPage) {
      this.data.frontPage = incoming.frontPage;
    }
    if (incoming.settings) {
      this.data.settings = incoming.settings;
    }
    if (incoming.sections && Array.isArray(incoming.sections)) {
      this.data.sections = incoming.sections;
    }
    if (incoming.tags && Array.isArray(incoming.tags)) {
      this.data.tags = incoming.tags;
    }
    if (incoming.editions && Array.isArray(incoming.editions)) {
      this.data.editions = incoming.editions;
    }
    if (incoming.media && Array.isArray(incoming.media)) {
      this.data.media = incoming.media;
    }
    this.saveToDisk();
    return this.data;
  }

  public resetToDefaults(): ServerStoreData {
    this.data = this.getDefaultData();
    this.saveToDisk();
    return this.data;
  }
}

export const serverDb = new NewsroomServerDb();
