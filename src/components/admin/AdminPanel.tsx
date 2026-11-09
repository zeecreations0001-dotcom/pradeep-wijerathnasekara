/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { NewsroomStore } from '../../services/adminStore';
import { Article, BreakingNewsItem, FrontPageLayout, MediaItem, Section, SiteSettings, StaffMember, Tag } from '../../types/admin';
import { AdminLayout } from './AdminLayout';
import { AdminAuth } from './AdminAuth';
import { DashboardTab } from './DashboardTab';
import { ArticlesTab } from './ArticlesTab';
import { ArticleEditorModal } from './ArticleEditorModal';
import { BreakingNewsTab } from './BreakingNewsTab';
import { FrontPageTab } from './FrontPageTab';
import { EditionsTab } from './EditionsTab';
import { SectionsTagsTab } from './SectionsTagsTab';
import { MediaLibraryTab } from './MediaLibraryTab';
import { StaffTab } from './StaffTab';
import { CommentsTab } from './CommentsTab';
import { NewsletterTab } from './NewsletterTab';
import { SiteSettingsTab } from './SiteSettingsTab';
import { SystemSettingsTab } from './SystemSettingsTab';

interface AdminPanelProps {
  onReturnToPublic: () => void;
  onPreviewArticleInPublic: (article: Article) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onReturnToPublic,
  onPreviewArticleInPublic,
}) => {
  // Store reactive state
  const [currentUser, setCurrentUser] = useState<StaffMember | null>(NewsroomStore.getCurrentUser());
  const [articles, setArticles] = useState<Article[]>(NewsroomStore.getArticles());
  const [sections, setSections] = useState<Section[]>(NewsroomStore.getSections());
  const [tags, setTags] = useState<Tag[]>(NewsroomStore.getTags());
  const [breakingNews, setBreakingNews] = useState<BreakingNewsItem[]>(NewsroomStore.getBreakingNews());
  const [frontPage, setFrontPage] = useState<FrontPageLayout>(NewsroomStore.getFrontPageLayout());
  const [editions, setEditions] = useState(NewsroomStore.getEditions());
  const [media, setMedia] = useState<MediaItem[]>(NewsroomStore.getMedia());
  const [comments, setComments] = useState(NewsroomStore.getComments());
  const [subscribers, setSubscribers] = useState(NewsroomStore.getSubscribers());
  const [settings, setSettings] = useState<SiteSettings>(NewsroomStore.getSiteSettings());
  const [staffList, setStaffList] = useState<StaffMember[]>(NewsroomStore.getStaff());
  const [activityLogs, setActivityLogs] = useState(NewsroomStore.getActivityLogs());

  // Navigation tab
  const [activeTab, setActiveTab] = useState<string>('dashboard');

  // Article Editor Modal
  const [isArticleModalOpen, setIsArticleModalOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<Article | null>(null);

  // Subscribe to store updates
  useEffect(() => {
    const unsubscribe = NewsroomStore.subscribe(() => {
      setCurrentUser(NewsroomStore.getCurrentUser());
      setArticles(NewsroomStore.getArticles());
      setSections(NewsroomStore.getSections());
      setTags(NewsroomStore.getTags());
      setBreakingNews(NewsroomStore.getBreakingNews());
      setFrontPage(NewsroomStore.getFrontPageLayout());
      setEditions(NewsroomStore.getEditions());
      setMedia(NewsroomStore.getMedia());
      setComments(NewsroomStore.getComments());
      setSubscribers(NewsroomStore.getSubscribers());
      setSettings(NewsroomStore.getSiteSettings());
      setStaffList(NewsroomStore.getStaff());
      setActivityLogs(NewsroomStore.getActivityLogs());
    });
    return unsubscribe;
  }, []);

  // Auth check
  if (!currentUser) {
    return (
      <AdminAuth
        onLogin={(email, password, role) => {
          const res = NewsroomStore.login(email, password, role);
          return res;
        }}
        onClose={onReturnToPublic}
        staffList={staffList}
        isStandalonePage={true}
      />
    );
  }

  // Article handlers
  const handleNewArticle = () => {
    setEditingArticle(null);
    setIsArticleModalOpen(true);
  };

  const handleEditArticle = (art: Article) => {
    setEditingArticle(art);
    setIsArticleModalOpen(true);
  };

  const handleSaveArticle = (art: Article) => {
    NewsroomStore.saveArticle(art);
    setIsArticleModalOpen(false);
  };

  const handleDeleteArticle = (id: string) => {
    NewsroomStore.deleteArticle(id);
  };

  const handleBulkUpdateArticles = (ids: string[], updates: Partial<Article>) => {
    NewsroomStore.bulkUpdateArticles(ids, updates);
  };

  // Breaking news handlers
  const handleSaveBreakingItem = (item: BreakingNewsItem) => {
    NewsroomStore.saveBreakingNews(item);
  };

  const handleDeleteBreakingItem = (id: string) => {
    NewsroomStore.deleteBreakingNews(id);
  };

  const handleReorderBreakingItems = (items: BreakingNewsItem[]) => {
    NewsroomStore.reorderBreakingNews(items);
  };

  // Front Page handler
  const handleSaveFrontPageLayout = (layout: FrontPageLayout) => {
    NewsroomStore.saveFrontPageLayout(layout);
  };

  // Editions handler
  const handleSaveEdition = (ed: any) => {
    NewsroomStore.saveEdition(ed);
  };

  const handleDeleteEdition = (id: string) => {
    NewsroomStore.deleteEdition(id);
  };

  // Sections & Tags
  const handleSaveSection = (sec: Section) => {
    NewsroomStore.saveSection(sec);
  };

  const handleDeleteSection = (id: string) => {
    NewsroomStore.deleteSection(id);
  };

  const handleReorderSections = (secs: Section[]) => {
    NewsroomStore.reorderSections(secs);
  };

  const handleSaveTag = (tg: Tag) => {
    NewsroomStore.saveTag(tg);
  };

  const handleDeleteTag = (id: string) => {
    NewsroomStore.deleteTag(id);
  };

  // Media
  const handleSaveMedia = (m: MediaItem) => {
    NewsroomStore.saveMedia(m);
  };

  const handleDeleteMedia = (id: string) => {
    NewsroomStore.deleteMedia(id);
  };

  // Staff
  const handleSaveStaff = (member: StaffMember) => {
    NewsroomStore.saveStaff(member);
  };

  const handleDeleteStaff = (id: string) => {
    NewsroomStore.deleteStaff(id);
  };

  const handleSwitchUser = (member: StaffMember) => {
    NewsroomStore.setCurrentUser(member);
  };

  // Comments
  const handleUpdateCommentStatus = (id: string, status: any) => {
    NewsroomStore.updateCommentStatus(id, status);
  };

  const handleDeleteComment = (id: string) => {
    NewsroomStore.deleteComment(id);
  };

  const handleToggleArticleComments = (articleId: string, enabled: boolean) => {
    NewsroomStore.bulkUpdateArticles([articleId], { commentsEnabled: enabled });
  };

  // Newsletter
  const handleAddSubscriber = (email: string, name?: string) => {
    NewsroomStore.addSubscriber(email, name);
  };

  const handleDeleteSubscriber = (id: string) => {
    NewsroomStore.deleteSubscriber(id);
  };

  // Site Settings
  const handleSaveSiteSettings = (newSettings: SiteSettings) => {
    NewsroomStore.saveSiteSettings(newSettings);
  };

  // Count badges
  const pendingReviewsCount = articles.filter((a) => a.editorialStatus === 'in_review').length;
  const breakingActiveCount = NewsroomStore.getActiveBreakingNews().length;

  return (
    <AdminLayout
      currentTab={activeTab}
      onSelectTab={setActiveTab}
      currentUser={currentUser}
      staffList={staffList}
      onSwitchUser={handleSwitchUser}
      onLogout={() => NewsroomStore.logout()}
      onViewPublicSite={onReturnToPublic}
      pendingReviewsCount={pendingReviewsCount}
      breakingActiveCount={breakingActiveCount}
    >
      {activeTab === 'dashboard' && (
        <DashboardTab
          articles={articles}
          sections={sections}
          staffList={staffList}
          activityLogs={activityLogs}
          currentUser={currentUser}
          onNavigateTab={setActiveTab}
          onNewArticle={handleNewArticle}
          onEditArticle={handleEditArticle}
        />
      )}

      {activeTab === 'articles' && (
        <ArticlesTab
          articles={articles}
          sections={sections}
          staffList={staffList}
          currentUser={currentUser}
          onEditArticle={handleEditArticle}
          onNewArticle={handleNewArticle}
          onDeleteArticle={handleDeleteArticle}
          onBulkUpdate={handleBulkUpdateArticles}
          onPreviewArticle={onPreviewArticleInPublic}
        />
      )}

      {activeTab === 'breaking' && (
        <BreakingNewsTab
          breakingItems={breakingNews}
          articles={articles}
          settings={settings}
          onSaveItem={handleSaveBreakingItem}
          onDeleteItem={handleDeleteBreakingItem}
          onReorderItems={handleReorderBreakingItems}
          onUpdateSettings={handleSaveSiteSettings}
        />
      )}

      {activeTab === 'frontpage' && (
        <FrontPageTab
          layout={frontPage}
          articles={articles}
          sections={sections}
          onSaveLayout={handleSaveFrontPageLayout}
          onPreviewFrontPage={onReturnToPublic}
        />
      )}

      {activeTab === 'editions' && (
        <EditionsTab
          editions={editions}
          articles={articles}
          onSaveEdition={handleSaveEdition}
          onDeleteEdition={handleDeleteEdition}
        />
      )}

      {activeTab === 'sections' && (
        <SectionsTagsTab
          sections={sections}
          tags={tags}
          articles={articles}
          staffList={staffList}
          onSaveSection={handleSaveSection}
          onDeleteSection={handleDeleteSection}
          onReorderSections={handleReorderSections}
          onSaveTag={handleSaveTag}
          onDeleteTag={handleDeleteTag}
        />
      )}

      {activeTab === 'media' && (
        <MediaLibraryTab
          media={media}
          currentUser={currentUser}
          onSaveMedia={handleSaveMedia}
          onDeleteMedia={handleDeleteMedia}
        />
      )}

      {activeTab === 'staff' && (
        <StaffTab
          staffList={staffList}
          articles={articles}
          sections={sections}
          currentUser={currentUser}
          onSaveStaff={handleSaveStaff}
          onDeleteStaff={handleDeleteStaff}
          onSwitchUser={handleSwitchUser}
        />
      )}

      {activeTab === 'comments' && (
        <CommentsTab
          comments={comments}
          articles={articles}
          onUpdateCommentStatus={handleUpdateCommentStatus}
          onDeleteComment={handleDeleteComment}
          onToggleArticleComments={handleToggleArticleComments}
        />
      )}

      {activeTab === 'newsletter' && (
        <NewsletterTab
          subscribers={subscribers}
          articles={articles}
          onAddSubscriber={handleAddSubscriber}
          onDeleteSubscriber={handleDeleteSubscriber}
        />
      )}

      {activeTab === 'settings' && (
        <SiteSettingsTab
          settings={settings}
          onSaveSettings={handleSaveSiteSettings}
        />
      )}

      {activeTab === 'system' && (
        <SystemSettingsTab
          activityLogs={activityLogs}
          onExportJson={() => NewsroomStore.exportAllDataJson()}
          onImportJson={(json) => NewsroomStore.importAllDataJson(json)}
          onResetDemo={() => NewsroomStore.resetToDemo()}
        />
      )}

      {/* Full Modal for Article Editing */}
      <ArticleEditorModal
        isOpen={isArticleModalOpen}
        onClose={() => setIsArticleModalOpen(false)}
        onSave={handleSaveArticle}
        initialArticle={editingArticle}
        currentUser={currentUser}
        sections={sections}
        staffList={staffList}
      />
    </AdminLayout>
  );
};
