/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { NewsroomStore } from './adminStore';
import { Article as AdminArticle, BreakingNewsItem, FrontPageLayout, SiteSettings } from '../types/admin';
import { Article as PublicArticle } from '../data/newspaperData';

export function mapAdminArticleToPublic(art: AdminArticle, isHero: boolean = false): PublicArticle {
  // Convert html paragraphs to array of clean string paragraphs
  const cleanParagraphs = art.content
    ? art.content
        .split(/<\/p>/i)
        .map((p) => p.replace(/<[^>]+>/g, '').trim())
        .filter(Boolean)
    : [];

  const cleanParagraphsSi = art.contentSi
    ? art.contentSi
        .split(/<\/p>|\n+/)
        .map((p) => p.replace(/<[^>]+>/g, '').trim())
        .filter(Boolean)
    : undefined;

  const validContent =
    cleanParagraphs.length > 0
      ? cleanParagraphs
      : cleanParagraphsSi && cleanParagraphsSi.length > 0
      ? cleanParagraphsSi
      : [art.excerpt || art.headline || 'News dispatch'];

  const safeDate = new Date(art.publishedAt || art.createdAt || Date.now());
  const finalDate = isNaN(safeDate.getTime()) ? new Date() : safeDate;

  return {
    id: art.id,
    title: art.headline || art.headlineSi || 'Untitled Dispatch',
    titleSi: art.headlineSi || art.headline,
    category: (art.sectionId || 'world').toUpperCase(),
    categorySi:
      art.sectionId === 'world'
        ? 'ලෝකය'
        : art.sectionId === 'politics'
        ? 'දේශපාලන'
        : art.sectionId === 'business'
        ? 'ව්‍යාපාරික'
        : art.sectionId === 'tech'
        ? 'තාක්ෂණය'
        : 'පුවත්',
    categorySecondary: art.subsection,
    date: finalDate.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    dateSi: finalDate.toLocaleDateString('si-LK', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    author: art.reporterName || 'Staff Correspondent',
    authorSi: art.reporterName || 'කාර්ය මණ්ඩල වාර්තාකරු',
    commentsCount: 2,
    excerpt: art.excerpt || art.excerptSi || art.headline,
    excerptSi: art.excerptSi || art.excerpt || art.headlineSi,
    content: validContent,
    contentSi: cleanParagraphsSi || validContent,
    imageUrl: art.featuredImage || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=1200',
    imageCaption: art.imageCaption,
    isHero: isHero || art.isSticky,
    isBreaking: art.priorityTag === 'breaking' || art.priorityTag === 'developing',
    isDailyFeed: true,
    isFeatured: art.priorityTag === 'exclusive' || art.isSticky,
    isLatest: true,
    isPopular: (art.views || 0) > 8000,
    tags: art.tags && art.tags.length > 0 ? art.tags : ['News'],
    readTime: `${art.readingTimeMinutes || 4} MIN READ`,
    readTimeSi: `විනාඩි ${art.readingTimeMinutes || 4} ක කියවීමක්`,
  };
}

export function useNewsroomData() {
  const [, setVersion] = useState(0);

  useEffect(() => {
    const unsub = NewsroomStore.subscribe(() => {
      setVersion((v) => v + 1);
    });
    return unsub;
  }, []);

  const adminArticles = NewsroomStore.getArticles();
  const frontPage = NewsroomStore.getFrontPageLayout();
  const breakingNews = NewsroomStore.getActiveBreakingNews();
  const settings = NewsroomStore.getSiteSettings();
  const currentUser = NewsroomStore.getCurrentUser();

  // Filter only published articles for public view
  const publishedAdminArticles = adminArticles.filter(
    (a) => a.editorialStatus === 'published'
  );

  // Map to public format with hero determination
  const publicArticles: PublicArticle[] = publishedAdminArticles.map((art) => {
    const isLeadHero = art.id === frontPage.heroMainId;
    return mapAdminArticleToPublic(art, isLeadHero);
  });

  return {
    publicArticles,
    frontPage,
    breakingNews,
    settings,
    currentUser,
  };
}
