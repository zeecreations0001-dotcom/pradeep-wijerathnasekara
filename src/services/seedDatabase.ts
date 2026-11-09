/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Newsroom Database Seed Script
 *
 * Can be invoked from the browser console, node, or the admin dashboard
 * to populate initial editorial staff, sections, breaking ticker items,
 * and high-impact investigative news articles.
 */

import {
  INITIAL_STAFF,
  INITIAL_SECTIONS,
  INITIAL_TAGS,
  INITIAL_ARTICLES,
  INITIAL_BREAKING_NEWS,
  INITIAL_FRONT_PAGE,
  INITIAL_EDITIONS,
  INITIAL_MEDIA,
  INITIAL_COMMENTS,
  INITIAL_SUBSCRIBERS,
  INITIAL_SITE_SETTINGS,
  INITIAL_ACTIVITY_LOGS,
  NewsroomStore,
} from './adminStore';

export async function seedNewsroomDatabase() {
  console.log('Seeding newsroom database with demo editorial assets...');

  // Reset to initial baseline
  NewsroomStore.resetToDemo();

  console.log(`✓ Seeded ${INITIAL_STAFF.length} staff members (Super Admin, Editor, Reporter, Contributor)`);
  console.log(`✓ Seeded ${INITIAL_SECTIONS.length} newsroom desks (World, Politics, Business, Tech, Sports, Culture, Opinion)`);
  console.log(`✓ Seeded ${INITIAL_ARTICLES.length} rich investigative articles with live blog and bilingual content`);
  console.log(`✓ Seeded ${INITIAL_BREAKING_NEWS.length} breaking ticker items`);
  console.log(`✓ Seeded ${INITIAL_EDITIONS.length} published newspaper editions`);
  console.log(`✓ Seeded ${INITIAL_MEDIA.length} media library assets`);
  console.log(`✓ Seeded ${INITIAL_COMMENTS.length} reader comments`);
  console.log(`✓ Seeded ${INITIAL_SUBSCRIBERS.length} newsletter subscribers`);
  console.log(`✓ Seeded site customization settings and ${INITIAL_ACTIVITY_LOGS.length} audit logs`);

  return {
    success: true,
    message: 'Newsroom database seeded successfully.',
  };
}

// Attach to window in dev for developer convenience
if (typeof window !== 'undefined') {
  (window as any).seedNewsroomDatabase = seedNewsroomDatabase;
}
