/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  Article,
  EditorialStatus,
  LiveBlogEntry,
  PriorityTag,
  Section,
  StaffMember,
  MediaItem,
} from '../../types/admin';
import { TipTapEditor } from './TipTapEditor';
import {
  X,
  Save,
  CheckCircle,
  Clock,
  Sparkles,
  Plus,
  Trash2,
  AlertCircle,
  Pin,
  MessageSquare,
  Radio,
  FileText,
  Calendar,
  Languages,
  Upload,
  Image as ImageIcon,
  FolderOpen,
  Camera,
  Loader2,
  Search,
  ExternalLink,
} from 'lucide-react';
import { processImageFile, formatBytes } from '../../services/imageService';
import { NewsroomStore } from '../../services/adminStore';
import { translateArticle } from '../../services/translationService';

interface ArticleEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (article: Article) => void;
  initialArticle?: Article | null;
  currentUser: StaffMember | null;
  sections: Section[];
  staffList: StaffMember[];
}

export const ArticleEditorModal: React.FC<ArticleEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialArticle,
  currentUser,
  sections,
  staffList,
}) => {
  const isEditing = !!initialArticle;

  // Form states
  const [headline, setHeadline] = useState('');
  const [headlineSi, setHeadlineSi] = useState('');
  const [subheadline, setSubheadline] = useState('');
  const [slug, setSlug] = useState('');
  const [slugManual, setSlugManual] = useState(false);
  const [reporterId, setReporterId] = useState('');
  const [dateline, setDateline] = useState('COLOMBO');
  const [sectionId, setSectionId] = useState('world');
  const [subsection, setSubsection] = useState('');
  const [priorityTag, setPriorityTag] = useState<PriorityTag>('standard');
  const [featuredImage, setFeaturedImage] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [imageCredit, setImageCredit] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [excerptSi, setExcerptSi] = useState('');
  const [content, setContent] = useState('<p></p>');
  const [contentSi, setContentSi] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [editorialStatus, setEditorialStatus] = useState<EditorialStatus>('draft');
  const [scheduledPublishAt, setScheduledPublishAt] = useState('');
  const [isSticky, setIsSticky] = useState(false);
  const [isLiveBlog, setIsLiveBlog] = useState(false);
  const [liveBlogEntries, setLiveBlogEntries] = useState<LiveBlogEntry[]>([]);
  const [correctionNotice, setCorrectionNotice] = useState('');
  const [commentsEnabled, setCommentsEnabled] = useState(true);

  // Tab: Primary English / Bilingual Sinhala
  const [languageTab, setLanguageTab] = useState<'en' | 'si'>('en');

  // AI Auto-Translation states
  const [isTranslating, setIsTranslating] = useState(false);
  const [translationNotice, setTranslationNotice] = useState<string | null>(null);
  const [translationError, setTranslationError] = useState<string | null>(null);

  // Auto-translate article between English and Sinhala (Bidirectional: EN <-> SI)
  const isSinhalaText = (str?: string) => !!str && /[\u0D80-\u0DFF]/.test(str);

  const handleAutoTranslate = async (targetLang: 'si' | 'en') => {
    setTranslationNotice(null);
    setTranslationError(null);

    if (targetLang === 'en') {
      // Translating from Sinhala to English
      let sourceTitle = headlineSi.trim();
      let sourceExcerpt = excerptSi.trim();
      let sourceContent = contentSi.trim();

      // If Sinhala tab fields are empty, check if author typed Sinhala in the main headline/content
      const mainHasSinhala = isSinhalaText(headline) || isSinhalaText(content);
      if (!sourceTitle && !sourceContent && mainHasSinhala) {
        sourceTitle = headline.trim();
        sourceExcerpt = excerpt.trim();
        sourceContent = content.trim();
      }

      if (!sourceTitle && !sourceContent) {
        setTranslationError(
          'කරුණාකර ඉංග්‍රීසියට පරිවර්තනය කිරීමට පෙර සිංහල සිරස්තලයක් හෝ අන්තර්ගතයක් ඇතුළත් කරන්න. (Please enter Sinhala headline or content before translating to English)'
        );
        return;
      }

      setIsTranslating(true);
      try {
        const res = await translateArticle({
          title: sourceTitle,
          excerpt: sourceExcerpt,
          content: sourceContent,
          targetLanguage: 'en',
          sourceLanguage: 'si',
        });

        if (!res.success) {
          setTranslationError(res.error || 'Translation to English failed. Please try again.');
          return;
        }

        // Preserve original Sinhala text in the Sinhala tab if author wrote it in main fields
        if (mainHasSinhala && (!headlineSi.trim() || headlineSi === headline)) {
          setHeadlineSi(headline);
          if (excerpt && !excerptSi) setExcerptSi(excerpt);
          if (content && !contentSi) setContentSi(content);
        }

        if (res.translatedTitle) setHeadline(res.translatedTitle);
        if (res.translatedExcerpt) setExcerpt(res.translatedExcerpt);
        if (res.translatedContent) setContent(res.translatedContent);

        setLanguageTab('en');
        setTranslationNotice('✓ Successfully auto-translated article from Sinhala to English (ඉංග්‍රීසි භාෂාවට සාර්ථකව පරිවර්තනය විය)!');
        setTimeout(() => setTranslationNotice(null), 5000);
      } catch (err: any) {
        setTranslationError(err.message || 'Auto-translation to English failed.');
      } finally {
        setIsTranslating(false);
      }
    } else {
      // Translating from English to Sinhala
      let sourceTitle = headline.trim();
      let sourceExcerpt = excerpt.trim();
      let sourceContent = content.trim();

      // Fallback if main was empty but headlineSi has English
      if (!sourceTitle && !sourceContent && headlineSi.trim() && !isSinhalaText(headlineSi)) {
        sourceTitle = headlineSi.trim();
        sourceExcerpt = excerptSi.trim();
        sourceContent = contentSi.trim();
      }

      if (!sourceTitle && !sourceContent) {
        setTranslationError(
          'Please enter an English headline or article content first before translating to Sinhala.'
        );
        return;
      }

      setIsTranslating(true);
      try {
        const res = await translateArticle({
          title: sourceTitle,
          excerpt: sourceExcerpt,
          content: sourceContent,
          targetLanguage: 'si',
          sourceLanguage: 'en',
        });

        if (!res.success) {
          setTranslationError(res.error || 'Translation to Sinhala failed. Please try again.');
          return;
        }

        if (res.translatedTitle) setHeadlineSi(res.translatedTitle);
        if (res.translatedExcerpt) setExcerptSi(res.translatedExcerpt);
        if (res.translatedContent) setContentSi(res.translatedContent);

        setLanguageTab('si');
        setTranslationNotice('✓ Successfully auto-translated article into Sinhala (සිංහල භාෂාවට සාර්ථකව පරිවර්තනය විය)!');
        setTimeout(() => setTranslationNotice(null), 5000);
      } catch (err: any) {
        setTranslationError(err.message || 'Auto-translation to Sinhala failed.');
      } finally {
        setIsTranslating(false);
      }
    }
  };

  // Image Upload & Media Management states
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [imageTab, setImageTab] = useState<'upload' | 'library' | 'url'>('upload');
  const [isMediaLibraryModalOpen, setIsMediaLibraryModalOpen] = useState(false);
  const [mediaSearchTerm, setMediaSearchTerm] = useState('');
  const [imageStats, setImageStats] = useState<{ size?: number; dimensions?: string; name?: string } | null>(null);

  // New Live Blog Entry state
  const [newLbHeadline, setNewLbHeadline] = useState('');
  const [newLbContent, setNewLbContent] = useState('');

  // Auto-slug generation
  useEffect(() => {
    if (!slugManual && headline) {
      const generated = headline
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')
        .slice(0, 80);
      setSlug(generated);
    }
  }, [headline, slugManual]);

  // Load article when modal opens
  useEffect(() => {
    if (initialArticle) {
      setHeadline(initialArticle.headline || '');
      setHeadlineSi(initialArticle.headlineSi || '');
      setSubheadline(initialArticle.subheadline || '');
      setSlug(initialArticle.slug || '');
      setSlugManual(true);
      setReporterId(initialArticle.reporterId || currentUser?.id || '');
      setDateline(initialArticle.dateline || 'COLOMBO');
      setSectionId(initialArticle.sectionId || 'world');
      setSubsection(initialArticle.subsection || '');
      setPriorityTag(initialArticle.priorityTag || 'standard');
      setFeaturedImage(initialArticle.featuredImage || '');
      setImageCaption(initialArticle.imageCaption || '');
      setImageCredit(initialArticle.imageCredit || '');
      setExcerpt(initialArticle.excerpt || '');
      setExcerptSi(initialArticle.excerptSi || '');
      setContent(initialArticle.content || '<p></p>');
      setContentSi(initialArticle.contentSi || '');
      setTags(initialArticle.tags || []);
      setEditorialStatus(initialArticle.editorialStatus || 'draft');
      setScheduledPublishAt(initialArticle.scheduledPublishAt || '');
      setIsSticky(!!initialArticle.isSticky);
      setIsLiveBlog(!!initialArticle.isLiveBlog);
      setLiveBlogEntries(initialArticle.liveBlogEntries || []);
      setCorrectionNotice(initialArticle.correctionNotice || '');
      setCommentsEnabled(initialArticle.commentsEnabled ?? true);
    } else {
      // New article defaults
      setHeadline('');
      setHeadlineSi('');
      setSubheadline('');
      setSlug('');
      setSlugManual(false);
      setReporterId(currentUser?.id || (staffList[0]?.id ?? ''));
      setDateline('COLOMBO');
      setSectionId(sections[0]?.id || 'world');
      setSubsection('');
      setPriorityTag('standard');
      setFeaturedImage('https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=1200');
      setImageCaption('');
      setImageCredit('The Herald Archive');
      setExcerpt('');
      setExcerptSi('');
      setContent('<p>Enter breaking dispatch or article report here...</p>');
      setContentSi('');
      setTags(['Global Economy']);
      setEditorialStatus(currentUser?.role === 'contributor' ? 'draft' : 'draft');
      setScheduledPublishAt('');
      setIsSticky(false);
      setIsLiveBlog(false);
      setLiveBlogEntries([]);
      setCorrectionNotice('');
      setCommentsEnabled(true);
    }
  }, [initialArticle, isOpen, currentUser, sections, staffList]);

  // Keyboard shortcut listener (Cmd+S / Ctrl+S, Cmd+Enter)
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        handleSaveForm(editorialStatus);
      } else if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
        e.preventDefault();
        if (canPublishDirectly) {
          handleSaveForm('published');
        } else {
          handleSaveForm('in_review');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, editorialStatus, headline, content, sectionId]);

  if (!isOpen) return null;

  const role = currentUser?.role || 'reporter';
  const canPublishDirectly = role === 'super_admin' || role === 'editor';
  const canSubmitReview = role === 'reporter' || role === 'contributor' || canPublishDirectly;

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleAddLiveBlogEntry = () => {
    if (!newLbHeadline.trim() || !newLbContent.trim()) return;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' GMT';
    const newEntry: LiveBlogEntry = {
      id: 'lb-' + Date.now(),
      timestamp: nowTime,
      headline: newLbHeadline.trim(),
      content: newLbContent.trim(),
      authorName: currentUser?.name || 'Newsroom Desk',
    };
    setLiveBlogEntries([newEntry, ...liveBlogEntries]);
    setNewLbHeadline('');
    setNewLbContent('');
  };

  const handleRemoveLiveBlogEntry = (id: string) => {
    setLiveBlogEntries(liveBlogEntries.filter((e) => e.id !== id));
  };

  // Handle uploading image from user's computer / device
  const handleDeviceImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WebP, GIF, SVG).');
      return;
    }
    setUploadError(null);
    setIsUploadingImage(true);
    try {
      const processed = await processImageFile(file, 1600, 1200, 0.85);
      setFeaturedImage(processed.dataUrl);
      setImageStats({
        name: processed.name,
        size: processed.size,
        dimensions: `${processed.width}x${processed.height}`,
      });

      // Auto-populate caption if empty
      if (!imageCaption.trim()) {
        const cleanName = processed.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' ');
        setImageCaption(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }

      // Auto-populate credit if empty
      if (!imageCredit.trim()) {
        setImageCredit('Staff Photo / Upload');
      }

      // Automatically catalog in Newsroom Media Library
      NewsroomStore.saveMedia({
        id: 'med-' + Date.now(),
        url: processed.dataUrl,
        name: processed.name,
        size: processed.size,
        type: 'image',
        credit: imageCredit.trim() || 'Staff Photo / Upload',
        caption: imageCaption.trim() || processed.name,
        uploadedAt: new Date().toISOString(),
        uploadedBy: currentUser?.name || 'Staff Reporter',
        dimensions: `${processed.width}x${processed.height}`,
      });
    } catch (err: any) {
      setUploadError(err?.message || 'Failed to process image file.');
    } finally {
      setIsUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDropFeatured = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleDeviceImageUpload(file);
    }
  };

  const handleSelectMediaItem = (item: MediaItem) => {
    setFeaturedImage(item.url);
    if (item.caption) setImageCaption(item.caption);
    if (item.credit) setImageCredit(item.credit);
    setImageStats({
      name: item.name,
      size: item.size,
      dimensions: item.dimensions,
    });
    setIsMediaLibraryModalOpen(false);
  };

  const handleSaveForm = (targetStatus: EditorialStatus) => {
    if (!headline.trim()) {
      alert('Please provide an article headline.');
      return;
    }

    const assignedReporter = staffList.find((s) => s.id === reporterId);

    const savedArticle: Article = {
      id: initialArticle?.id || 'art-' + Date.now(),
      headline: headline.trim(),
      headlineSi: headlineSi.trim() || undefined,
      subheadline: subheadline.trim() || undefined,
      slug: slug.trim() || 'story-' + Date.now(),
      reporterId: reporterId || currentUser?.id || 'reporter-1',
      reporterName: assignedReporter?.name || currentUser?.name || 'Staff Correspondent',
      dateline: dateline.trim() || 'COLOMBO',
      sectionId: sectionId || 'world',
      subsection: subsection.trim() || undefined,
      priorityTag,
      featuredImage: featuredImage.trim(),
      imageCaption: imageCaption.trim() || undefined,
      imageCredit: imageCredit.trim() || undefined,
      excerpt: excerpt.trim() || headline.trim(),
      excerptSi: excerptSi.trim() || undefined,
      content: content || '<p></p>',
      contentSi: contentSi.trim() || undefined,
      tags,
      editorialStatus: targetStatus,
      scheduledPublishAt: scheduledPublishAt || undefined,
      createdAt: initialArticle?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      publishedAt: targetStatus === 'published' ? (initialArticle?.publishedAt || new Date().toISOString()) : initialArticle?.publishedAt,
      views: initialArticle?.views || 0,
      isSticky,
      isLiveBlog,
      liveBlogEntries,
      correctionNotice: correctionNotice.trim() || undefined,
      commentsEnabled,
    };

    onSave(savedArticle);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-stone-900/70 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-lg shadow-2xl border border-stone-300 flex flex-col max-h-[95vh] overflow-hidden my-auto">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-stone-900 text-stone-100 border-b border-stone-800">
          <div className="flex items-center gap-3">
            <span className="p-1.5 bg-red-600 rounded text-white font-mono text-xs uppercase tracking-widest font-bold">
              CMS
            </span>
            <div>
              <h2 className="text-lg font-serif font-bold text-white tracking-wide">
                {isEditing ? 'Edit News Dispatch' : 'New Newspaper Article'}
              </h2>
              <p className="text-xs text-stone-400">
                Editorial Workflow: <span className="font-semibold text-stone-200 capitalize">{editorialStatus.replace('_', ' ')}</span>
                {' • '}Author: {currentUser?.name} ({role.replace('_', ' ')})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Bidirectional Auto-Translate Action Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={isTranslating}
                onClick={() => handleAutoTranslate('si')}
                className="px-2.5 py-1.5 text-xs font-bold rounded flex items-center gap-1 transition-all shadow-xs cursor-pointer bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 font-black border border-amber-400 active:scale-95 disabled:opacity-60"
                title="Auto-translate English article into Sinhala using Gemini AI"
              >
                {isTranslating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-stone-950" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-stone-950" />
                )}
                <span>✨ EN ➔ සිංහල</span>
              </button>

              <button
                type="button"
                disabled={isTranslating}
                onClick={() => handleAutoTranslate('en')}
                className="px-2.5 py-1.5 text-xs font-bold rounded flex items-center gap-1 transition-all shadow-xs cursor-pointer bg-stone-100 hover:bg-white text-stone-950 font-black border border-stone-300 active:scale-95 disabled:opacity-60"
                title="Auto-translate Sinhala article into English using Gemini AI (සිංහල ලිපිය ඉංග්‍රීසි භාෂාවට පරිවර්තනය කරන්න)"
              >
                {isTranslating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-stone-950" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                )}
                <span>✨ SI ➔ English</span>
              </button>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center bg-stone-800 rounded p-0.5 border border-stone-700 text-xs">
              <button
                type="button"
                onClick={() => setLanguageTab('en')}
                className={`px-2.5 py-1 rounded font-medium transition ${
                  languageTab === 'en' ? 'bg-red-600 text-white shadow' : 'text-stone-300 hover:text-white'
                }`}
              >
                English
              </button>
              <button
                type="button"
                onClick={() => setLanguageTab('si')}
                className={`px-2.5 py-1 rounded font-medium flex items-center gap-1 transition ${
                  languageTab === 'si' ? 'bg-red-600 text-white shadow' : 'text-stone-300 hover:text-white'
                }`}
              >
                <Languages className="w-3.5 h-3.5" /> සිංහල
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-white hover:bg-stone-800 rounded transition"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Two Columns */}
        <div className="flex-1 overflow-y-auto p-6 bg-stone-50 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Translation Notice Banner */}
          {translationNotice && (
            <div className="lg:col-span-3 p-3 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-900 font-medium flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{translationNotice}</span>
              </div>
              <button
                type="button"
                onClick={() => setTranslationNotice(null)}
                className="text-emerald-700 hover:text-emerald-900 font-bold ml-2 text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Translation Error Banner */}
          {translationError && (
            <div className="lg:col-span-3 p-3 bg-red-50 border border-red-300 rounded text-xs text-red-900 font-medium flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{translationError}</span>
              </div>
              <button
                type="button"
                onClick={() => setTranslationError(null)}
                className="text-red-700 hover:text-red-900 font-bold ml-2 text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>
          )}

          {/* Main Editorial Workspace (2 columns) */}
          <div className="lg:col-span-2 space-y-5">
            {languageTab === 'en' ? (
              <>
                {/* Headline */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700">
                      Headline <span className="text-red-600">*</span>
                    </label>
                    <div className="flex items-center gap-2 flex-wrap">
                      {headline.trim() && (
                        <button
                          type="button"
                          onClick={() => handleAutoTranslate('si')}
                          disabled={isTranslating}
                          className="text-[11px] text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1 cursor-pointer disabled:opacity-60"
                          title="Auto-translate entire article into Sinhala"
                        >
                          <Sparkles className="w-3 h-3 text-amber-600" />
                          <span>{headlineSi ? 'Update Sinhala' : 'Auto-Translate to Sinhala (සිංහල)'}</span>
                        </button>
                      )}
                      {(headlineSi.trim() || isSinhalaText(headline)) && (
                        <button
                          type="button"
                          onClick={() => handleAutoTranslate('en')}
                          disabled={isTranslating}
                          className="text-[11px] text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1 cursor-pointer disabled:opacity-60"
                          title="Translate Sinhala article to English using Gemini AI"
                        >
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          <span>Auto-Translate from Sinhala (සිංහලෙන් ඉංග්‍රීසියට)</span>
                        </button>
                      )}
                    </div>
                  </div>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    placeholder="Enter clear, compelling newspaper headline..."
                    className="w-full px-4 py-2.5 text-lg font-serif font-bold text-stone-900 bg-white border border-stone-300 rounded focus:ring-2 focus:ring-red-600 focus:outline-none"
                  />
                </div>

                {/* Subheadline / Standfirst */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Subheadline / Standfirst (Deck)
                  </label>
                  <input
                    type="text"
                    value={subheadline}
                    onChange={(e) => setSubheadline(e.target.value)}
                    placeholder="1-2 sentences summarizing the core story angle..."
                    className="w-full px-3 py-2 text-sm font-sans text-stone-800 bg-white border border-stone-300 rounded focus:ring-2 focus:ring-red-600 focus:outline-none"
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Summary / Teaser Excerpt
                  </label>
                  <textarea
                    rows={2}
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Teaser snippet shown on homepage listings and RSS feeds..."
                    className="w-full px-3 py-2 text-sm text-stone-800 bg-white border border-stone-300 rounded focus:ring-2 focus:ring-red-600 focus:outline-none"
                  />
                </div>

                {/* Rich Text Editor */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1 flex items-center justify-between">
                    <span>Full Article Body (TipTap Rich Text)</span>
                    <span className="text-[11px] text-stone-500 font-normal">Supports pull quotes, images & links</span>
                  </label>
                  <TipTapEditor content={content} onChange={setContent} />
                </div>
              </>
            ) : (
              /* Sinhala Bilingual Tab */
              <div className="space-y-4 bg-amber-50/50 p-4 rounded border border-amber-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-amber-200 pb-2.5">
                  <div className="flex items-center gap-2 text-amber-900 text-xs font-bold uppercase tracking-wider">
                    <Languages className="w-4 h-4 text-amber-700" />
                    Sinhala Translation (ද්විභාෂික අන්තර්ගතය)
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Pull from English to Sinhala */}
                    <button
                      type="button"
                      disabled={isTranslating}
                      onClick={() => handleAutoTranslate('si')}
                      className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer active:scale-95 disabled:opacity-60"
                      title="Pull and translate content from the English tab into Sinhala"
                    >
                      {isTranslating ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>පරිවර්තනය වෙමින් පවතී...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Pull from English (ඉංග්‍රීසියෙන් පරිවර්තනය)</span>
                        </>
                      )}
                    </button>

                    {/* Auto-Translate from Sinhala to English */}
                    <button
                      type="button"
                      disabled={isTranslating}
                      onClick={() => handleAutoTranslate('en')}
                      className="px-2.5 py-1 bg-stone-900 hover:bg-black text-white rounded text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all cursor-pointer active:scale-95 disabled:opacity-60 border border-stone-800"
                      title="Auto-translate this Sinhala article into publication-grade English"
                    >
                      {isTranslating ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
                          <span>Translating to English...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>✨ Auto-Translate to English (ඉංග්‍රීසි භාෂාවට)</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Sinhala Headline (ප්‍රධාන පුවත් සිරස්තලය)
                  </label>
                  <input
                    type="text"
                    value={headlineSi}
                    onChange={(e) => setHeadlineSi(e.target.value)}
                    placeholder="සිංහල සිරස්තලය මෙහි ඇතුළත් කරන්න..."
                    className="w-full px-3 py-2 text-base font-serif font-bold text-stone-900 bg-white border border-stone-300 rounded focus:ring-2 focus:ring-red-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Sinhala Excerpt (කෙටි විස්තරය)
                  </label>
                  <textarea
                    rows={2}
                    value={excerptSi}
                    onChange={(e) => setExcerptSi(e.target.value)}
                    placeholder="මුල් පිටුව සඳහා කෙටි සිංහල සාරාංශය..."
                    className="w-full px-3 py-2 text-sm text-stone-800 bg-white border border-stone-300 rounded focus:ring-2 focus:ring-red-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Sinhala Content / Translation
                  </label>
                  <textarea
                    rows={8}
                    value={contentSi}
                    onChange={(e) => setContentSi(e.target.value)}
                    placeholder="සම්පූර්ණ සිංහල පුවත් වාර්තාව මෙහි සටහන් කරන්න..."
                    className="w-full px-3 py-2 text-sm text-stone-800 bg-white border border-stone-300 rounded focus:ring-2 focus:ring-red-600 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Live Blog Developing Story Manager */}
            <div className="p-4 bg-stone-100 rounded-md border border-stone-300">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Radio className={`w-4 h-4 ${isLiveBlog ? 'text-red-600 animate-pulse' : 'text-stone-400'}`} />
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-800">
                    Live Blog / Developing Story
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isLiveBlog}
                    onChange={(e) => setIsLiveBlog(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-stone-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-red-600"></div>
                </label>
              </div>

              {isLiveBlog && (
                <div className="space-y-3 pt-2 border-t border-stone-200">
                  <p className="text-xs text-stone-600">
                    Add timestamped real-time dispatches to this ongoing developing story.
                  </p>

                  <div className="bg-white p-3 rounded border border-stone-200 space-y-2">
                    <input
                      type="text"
                      placeholder="Live update title (e.g., '14:30 GMT - Police brief reporters')"
                      value={newLbHeadline}
                      onChange={(e) => setNewLbHeadline(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-stone-300 rounded focus:outline-none"
                    />
                    <textarea
                      rows={2}
                      placeholder="Update details or quotes..."
                      value={newLbContent}
                      onChange={(e) => setNewLbContent(e.target.value)}
                      className="w-full px-2.5 py-1.5 text-xs border border-stone-300 rounded focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={handleAddLiveBlogEntry}
                      className="px-3 py-1 bg-stone-800 hover:bg-stone-900 text-white text-xs font-medium rounded flex items-center gap-1"
                    >
                      <Plus className="w-3.5 h-3.5" /> Post Live Update
                    </button>
                  </div>

                  {/* List of existing live entries */}
                  {liveBlogEntries.length > 0 && (
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {liveBlogEntries.map((entry) => (
                        <div key={entry.id} className="p-2.5 bg-white rounded border border-stone-200 text-xs flex justify-between items-start gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-red-600">{entry.timestamp}</span>
                              <span className="font-semibold text-stone-900">{entry.headline}</span>
                            </div>
                            <p className="text-stone-600 mt-1">{entry.content}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveLiveBlogEntry(entry.id)}
                            className="text-stone-400 hover:text-red-600 p-1"
                            title="Remove live entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Post-Publish Correction Notice */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Correction / Clarification Notice (Editorial Policy)
              </label>
              <input
                type="text"
                value={correctionNotice}
                onChange={(e) => setCorrectionNotice(e.target.value)}
                placeholder="e.g. 'Correction (May 12): An earlier version of this report misstated the minister's title.'"
                className="w-full px-3 py-2 text-xs text-amber-900 bg-amber-50 border border-amber-200 rounded focus:outline-none"
              />
            </div>
          </div>

          {/* Right Column: Metadata, Section, Workflow & Publishing */}
          <div className="space-y-5 bg-white p-4 rounded-md border border-stone-200">
            {/* Status & Action Card */}
            <div className="p-3 bg-stone-100 rounded border border-stone-300 space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-700 block">
                Editorial Status
              </span>

              <select
                value={editorialStatus}
                onChange={(e) => setEditorialStatus(e.target.value as EditorialStatus)}
                className="w-full px-2.5 py-1.5 text-xs font-semibold uppercase bg-white border border-stone-300 rounded focus:outline-none"
              >
                <option value="draft">Draft</option>
                <option value="in_review">In Review (Submit to Desk)</option>
                {canPublishDirectly && (
                  <>
                    <option value="approved">Approved</option>
                    <option value="published">Published</option>
                    <option value="archived">Archived</option>
                  </>
                )}
              </select>

              {editorialStatus === 'published' && (
                <div className="text-[11px] text-emerald-700 bg-emerald-50 p-2 rounded flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Live on public newspaper site
                </div>
              )}
            </div>

            {/* Priority Tag */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Priority Tag
              </label>
              <select
                value={priorityTag}
                onChange={(e) => setPriorityTag(e.target.value as PriorityTag)}
                className="w-full px-3 py-2 text-xs bg-white border border-stone-300 rounded focus:ring-1 focus:ring-red-600 focus:outline-none capitalize"
              >
                <option value="standard">Standard Article</option>
                <option value="breaking">Breaking News</option>
                <option value="developing">Developing Story</option>
                <option value="exclusive">Exclusive / Special Investigation</option>
                <option value="analysis">News Analysis</option>
                <option value="opinion">Editorial / Opinion</option>
              </select>
            </div>

            {/* Section & Subsection */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Section <span className="text-red-600">*</span>
                </label>
                <select
                  value={sectionId}
                  onChange={(e) => setSectionId(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs bg-white border border-stone-300 rounded focus:outline-none capitalize"
                >
                  {sections.map((sec) => (
                    <option key={sec.id} value={sec.id}>
                      {sec.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Sub-Section
                </label>
                <input
                  type="text"
                  value={subsection}
                  onChange={(e) => setSubsection(e.target.value)}
                  placeholder="e.g. Energy / Cricket"
                  className="w-full px-2.5 py-2 text-xs bg-white border border-stone-300 rounded focus:outline-none"
                />
              </div>
            </div>

            {/* Byline / Reporter & Dateline */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Reporter / Byline
                </label>
                <select
                  value={reporterId}
                  onChange={(e) => setReporterId(e.target.value)}
                  disabled={role === 'contributor'}
                  className="w-full px-2.5 py-2 text-xs bg-white border border-stone-300 rounded focus:outline-none"
                >
                  {staffList.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.role.replace('_', ' ')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Dateline
                </label>
                <input
                  type="text"
                  value={dateline}
                  onChange={(e) => setDateline(e.target.value)}
                  placeholder="e.g. COLOMBO"
                  className="w-full px-2.5 py-2 text-xs bg-white border border-stone-300 rounded focus:outline-none uppercase font-mono"
                />
              </div>
            </div>

            {/* Slug */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                  URL Slug
                </label>
                <button
                  type="button"
                  onClick={() => setSlugManual(!slugManual)}
                  className="text-[10px] text-stone-500 hover:text-stone-900 underline"
                >
                  {slugManual ? 'Auto-Generate' : 'Manual Edit'}
                </button>
              </div>
              <input
                type="text"
                value={slug}
                readOnly={!slugManual}
                onChange={(e) => setSlug(e.target.value)}
                className={`w-full px-2.5 py-1.5 text-xs font-mono rounded border ${
                  slugManual ? 'bg-white border-stone-300' : 'bg-stone-100 border-stone-200 text-stone-600'
                }`}
              />
            </div>

            {/* Featured Image Upload & Metadata */}
            <div className="space-y-3 pt-3 border-t border-stone-200">
              {/* Hidden device file input */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleDeviceImageUpload(file);
                }}
                className="hidden"
              />

              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                  <Camera className="w-3.5 h-3.5 text-stone-600" />
                  Featured Lead Image
                </label>

                {/* Source Selection Tabs */}
                <div className="flex items-center gap-1 bg-stone-100 p-0.5 rounded border border-stone-200 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setImageTab('upload')}
                    className={`px-2 py-0.5 rounded font-medium transition flex items-center gap-1 ${
                      imageTab === 'upload' ? 'bg-white shadow-xs text-stone-900 font-semibold' : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    <Upload className="w-3 h-3" /> Device
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setImageTab('library');
                      setIsMediaLibraryModalOpen(true);
                    }}
                    className={`px-2 py-0.5 rounded font-medium transition flex items-center gap-1 ${
                      imageTab === 'library' ? 'bg-white shadow-xs text-stone-900 font-semibold' : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    <FolderOpen className="w-3 h-3" /> Library
                  </button>
                  <button
                    type="button"
                    onClick={() => setImageTab('url')}
                    className={`px-2 py-0.5 rounded font-medium transition flex items-center gap-1 ${
                      imageTab === 'url' ? 'bg-white shadow-xs text-stone-900 font-semibold' : 'text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    <ExternalLink className="w-3 h-3" /> URL
                  </button>
                </div>
              </div>

              {/* Upload error banner if any */}
              {uploadError && (
                <div className="p-2 bg-red-50 border border-red-200 text-red-700 text-xs rounded flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* URL Input when tab is URL */}
              {imageTab === 'url' && (
                <div>
                  <input
                    type="text"
                    value={featuredImage}
                    onChange={(e) => setFeaturedImage(e.target.value)}
                    placeholder="https://images.unsplash.com/... or CDN link"
                    className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-300 rounded focus:ring-1 focus:ring-red-600 focus:outline-none"
                  />
                </div>
              )}

              {/* Device Drag & Drop Zone */}
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDraggingOver(true);
                }}
                onDragLeave={() => setIsDraggingOver(false)}
                onDrop={handleDropFeatured}
                onClick={() => !featuredImage && fileInputRef.current?.click()}
                className={`relative rounded-md border-2 border-dashed transition-all p-3 text-center ${
                  isDraggingOver
                    ? 'border-red-500 bg-red-50/50'
                    : featuredImage
                    ? 'border-stone-300 bg-stone-50/50'
                    : 'border-stone-300 bg-stone-50 hover:bg-stone-100 cursor-pointer'
                }`}
              >
                {isUploadingImage ? (
                  <div className="py-6 flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-red-600" />
                    <span className="text-xs font-semibold text-stone-700">
                      Compressing & loading image from device...
                    </span>
                    <span className="text-[10px] text-stone-400">Optimizing resolution for web speed</span>
                  </div>
                ) : featuredImage ? (
                  <div className="space-y-2">
                    <div className="relative aspect-video rounded overflow-hidden border border-stone-200 bg-stone-900 group">
                      <img
                        src={featuredImage}
                        alt="Article Featured Lead"
                        className="w-full h-full object-cover transition group-hover:opacity-90"
                      />
                      <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            fileInputRef.current?.click();
                          }}
                          className="px-2.5 py-1 bg-white hover:bg-stone-100 text-stone-900 text-xs font-semibold rounded shadow-md flex items-center gap-1 transition"
                        >
                          <Upload className="w-3 h-3 text-red-600" /> Replace from Device
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setIsMediaLibraryModalOpen(true);
                          }}
                          className="px-2.5 py-1 bg-white hover:bg-stone-100 text-stone-900 text-xs font-semibold rounded shadow-md flex items-center gap-1 transition"
                        >
                          <FolderOpen className="w-3 h-3 text-stone-700" /> Library
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setFeaturedImage('');
                            setImageStats(null);
                          }}
                          className="p-1 bg-red-600 hover:bg-red-700 text-white rounded shadow-md transition"
                          title="Remove image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Image metadata badges */}
                    <div className="flex items-center justify-between text-[11px] text-stone-500 px-1">
                      <div className="flex items-center gap-1.5 truncate">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span className="truncate max-w-[180px]">
                          {imageStats?.name || 'Lead Image Loaded'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 font-mono text-[10px] text-stone-400">
                        {imageStats?.dimensions && <span>{imageStats.dimensions}</span>}
                        {imageStats?.size && <span>{formatBytes(imageStats.size)}</span>}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-4 flex flex-col items-center justify-center gap-1.5">
                    <div className="p-2 bg-stone-200 rounded-full text-stone-700">
                      <Upload className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-semibold text-stone-800">
                      Click to upload image from device
                    </div>
                    <p className="text-[11px] text-stone-500">
                      or drag and drop file here (JPG, PNG, WebP)
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          fileInputRef.current?.click();
                        }}
                        className="px-2.5 py-1 bg-stone-800 hover:bg-stone-900 text-white text-[11px] font-semibold rounded flex items-center gap-1 transition"
                      >
                        <Upload className="w-3 h-3 text-red-400" /> Browse Computer
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setIsMediaLibraryModalOpen(true);
                        }}
                        className="px-2.5 py-1 bg-white hover:bg-stone-100 border border-stone-300 text-stone-700 text-[11px] font-semibold rounded flex items-center gap-1 transition"
                      >
                        <FolderOpen className="w-3 h-3 text-stone-500" /> Media Library
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Caption & Photo Credit Inputs */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-500 mb-0.5">
                    Caption
                  </label>
                  <input
                    type="text"
                    value={imageCaption}
                    onChange={(e) => setImageCaption(e.target.value)}
                    placeholder="Photo caption for readers"
                    className="w-full px-2 py-1 text-xs bg-white border border-stone-300 rounded focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold uppercase tracking-wider text-stone-500 mb-0.5">
                    Photo Credit / Agency
                  </label>
                  <input
                    type="text"
                    value={imageCredit}
                    onChange={(e) => setImageCredit(e.target.value)}
                    placeholder="e.g. AFP / Reuters / Staff"
                    className="w-full px-2 py-1 text-xs bg-white border border-stone-300 rounded focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Scheduled Publish Date */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-stone-500" />
                Scheduled Publish (Optional)
              </label>
              <input
                type="datetime-local"
                value={scheduledPublishAt}
                onChange={(e) => setScheduledPublishAt(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs bg-white border border-stone-300 rounded focus:outline-none"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                Tags
              </label>
              <div className="flex gap-1 mb-2">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="Add newsroom tag..."
                  className="flex-1 px-2.5 py-1 text-xs border border-stone-300 rounded"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-2.5 py-1 bg-stone-700 hover:bg-stone-800 text-white text-xs rounded"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-0.5 bg-stone-200 text-stone-800 rounded-full text-[11px]"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-red-600"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Toggles: Pin to Homepage & Comments */}
            <div className="pt-2 border-t border-stone-200 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700 font-medium">
                <input
                  type="checkbox"
                  checked={isSticky}
                  onChange={(e) => setIsSticky(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500"
                />
                <Pin className="w-3.5 h-3.5 text-stone-500" /> Pin article to top of section / front page
              </label>

              <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700 font-medium">
                <input
                  type="checkbox"
                  checked={commentsEnabled}
                  onChange={(e) => setCommentsEnabled(e.target.checked)}
                  className="rounded text-red-600 focus:ring-red-500"
                />
                <MessageSquare className="w-3.5 h-3.5 text-stone-500" /> Enable public reader comments
              </label>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-stone-100 border-t border-stone-300 flex items-center justify-between">
          <div className="text-xs text-stone-500">
            Shortcuts: <kbd className="px-1.5 py-0.5 bg-white border border-stone-300 rounded text-[10px]">Cmd+S</kbd> Save draft •{' '}
            <kbd className="px-1.5 py-0.5 bg-white border border-stone-300 rounded text-[10px]">Cmd+Enter</kbd> Publish
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-stone-300 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded transition"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={() => handleSaveForm('draft')}
              className="px-4 py-2 bg-stone-700 hover:bg-stone-800 text-white text-xs font-semibold rounded flex items-center gap-1.5 transition"
            >
              <Save className="w-3.5 h-3.5" /> Save Draft
            </button>

            {role !== 'contributor' && (
              <button
                type="button"
                onClick={() => handleSaveForm('in_review')}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded flex items-center gap-1.5 transition"
              >
                <Clock className="w-3.5 h-3.5" /> Submit For Review
              </button>
            )}

            {canPublishDirectly && (
              <button
                type="button"
                onClick={() => handleSaveForm('published')}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-sm transition"
              >
                <CheckCircle className="w-3.5 h-3.5" /> Publish Now
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Media Library Selection Modal Overlay */}
      {isMediaLibraryModalOpen && (
        <div className="fixed inset-0 z-60 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-stone-200 w-full max-w-4xl max-h-[85vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-stone-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-red-500" />
                <h3 className="font-serif font-bold text-base tracking-tight">
                  Select Photo from Newsroom Media Library
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsMediaLibraryModalOpen(false)}
                className="text-stone-400 hover:text-white p-1 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Subheader & Search */}
            <div className="p-4 bg-stone-50 border-b border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search photos by name, caption, agency..."
                  value={mediaSearchTerm}
                  onChange={(e) => setMediaSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-red-600"
                />
              </div>

              {/* Upload directly to library from within picker */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded flex items-center gap-1.5 transition shrink-0"
              >
                <Upload className="w-3.5 h-3.5" /> Upload New from Device
              </button>
            </div>

            {/* Media Grid */}
            <div className="p-4 overflow-y-auto flex-1">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {NewsroomStore.getMedia()
                  .filter((m) => {
                    if (m.type !== 'image') return false;
                    if (!mediaSearchTerm) return true;
                    const q = mediaSearchTerm.toLowerCase();
                    return (
                      m.name.toLowerCase().includes(q) ||
                      (m.caption && m.caption.toLowerCase().includes(q)) ||
                      (m.credit && m.credit.toLowerCase().includes(q))
                    );
                  })
                  .map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleSelectMediaItem(item)}
                      className={`group relative rounded border cursor-pointer overflow-hidden transition-all hover:shadow-md ${
                        featuredImage === item.url
                          ? 'border-red-600 ring-2 ring-red-600'
                          : 'border-stone-200 hover:border-stone-400'
                      }`}
                    >
                      <div className="aspect-video bg-stone-100 overflow-hidden relative">
                        <img
                          src={item.url}
                          alt={item.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        {featuredImage === item.url && (
                          <div className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full shadow">
                            <CheckCircle className="w-3.5 h-3.5" />
                          </div>
                        )}
                      </div>
                      <div className="p-2 bg-white text-left">
                        <p className="text-xs font-semibold text-stone-800 truncate" title={item.name}>
                          {item.name}
                        </p>
                        <p className="text-[10px] text-stone-500 truncate" title={item.caption || item.credit}>
                          {item.credit || 'Newsroom Archive'}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-5 py-3 bg-stone-100 border-t border-stone-200 flex justify-end">
              <button
                type="button"
                onClick={() => setIsMediaLibraryModalOpen(false)}
                className="px-4 py-1.5 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-semibold rounded transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
