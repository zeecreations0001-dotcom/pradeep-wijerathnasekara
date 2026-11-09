/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { NewsroomStore } from './adminStore';
import { Article as AdminArticle, BreakingNewsItem, FrontPageLayout, SiteSettings } from '../types/admin';
import { Article as PublicArticle } from '../data/newspaperData';

export function mapAdminArticleToPublic(art: AdminArticle, isHero: boolean = false): PublicArticle {
  // Convert html paragraphs to array of string paragraphs
  const cleanParagraphs = art.content
    ? art.content
        .split(/<\/p>/i)
        .map((p) => p.replace(/<[^>]+>/g, '').trim())
        .filter(Boolean)
    : [art.excerpt];

  const cleanParagraphsSi = art.contentSi
    ? art.contentSi
        .split(/\n+/)
        .map((p) => p.trim())
        .filter(Boolean)
    : undefined;

  return {
    id: art.id,
    title: art.headline,
    titleSi: art.headlineSi,
    category: art.sectionId.toUpperCase(),
    categorySi: art.sectionId === 'world' ? 'ලෝකය' : art.sectionId === 'politics' ? 'දේශපාලන' : art.sectionId === 'business' ? 'ව්‍යාපාරික' : art.sectionId === 'tech' ? 'තාක්ෂණය' : 'පුවත්',
    categorySecondary: art.subsection,
    date: new Date(art.publishedAt || art.createdAt).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    dateSi: new Date(art.publishedAt || art.createdAt).toLocaleDateString('si-LK', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    }),
    author: art.reporterName,
    authorSi: art.reporterName,
    commentsCount: 2,
    excerpt: art.excerpt,
    excerptSi: art.excerptSi,
    content: cleanParagraphs.length > 0 ? cleanParagraphs : [art.excerpt],
    contentSi: cleanParagraphsSi,
    imageUrl: art.featuredImage,
    imageCaption: art.imageCaption,
    isHero: isHero || art.isSticky,
    isBreaking: art.priorityTag === 'breaking' || art.priorityTag === 'developing',
    isDailyFeed: true,
    isFeatured: art.priorityTag === 'exclusive' || art.isSticky,
    isLatest: true,
    isPopular: (art.views || 0) > 8000,
    tags: art.tags,
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
