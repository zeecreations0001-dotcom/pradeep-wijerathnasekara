/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import {
  Article,
  EditorialStatus,
  PriorityTag,
  Section,
  StaffMember,
} from '../../types/admin';
import {
  Plus,
  Search,
  Filter,
  CheckSquare,
  Square,
  Edit3,
  Trash2,
  ExternalLink,
  Eye,
  Clock,
  Pin,
  Radio,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from 'lucide-react';

interface ArticlesTabProps {
  articles: Article[];
  sections: Section[];
  staffList: StaffMember[];
  currentUser: StaffMember | null;
  onEditArticle: (article: Article) => void;
  onNewArticle: () => void;
  onDeleteArticle: (id: string) => void;
  onBulkUpdate: (ids: string[], updates: Partial<Article>) => void;
  onPreviewArticle: (article: Article) => void;
}

export const ArticlesTab: React.FC<ArticlesTabProps> = ({
  articles,
  sections,
  staffList,
  currentUser,
  onEditArticle,
  onNewArticle,
  onDeleteArticle,
  onBulkUpdate,
  onPreviewArticle,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [selectedPriority, setSelectedPriority] = useState<string>('ALL');
  const [viewScope, setViewScope] = useState<'all' | 'mine'>('all');
  const [sortBy, setSortBy] = useState<'updated' | 'published' | 'views'>('updated');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Bulk selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState<string>('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const role = currentUser?.role || 'reporter';
  const canPublish = role === 'super_admin' || role === 'editor';
  const canDeleteAny = role === 'super_admin';

  // Filtered and sorted list
  const filteredArticles = useMemo(() => {
    return articles.filter((art) => {
      // Scope filter (mine vs all)
      if (viewScope === 'mine' && currentUser) {
        if (art.reporterId !== currentUser.id) return false;
      }
      // Search
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchTitle = art.headline.toLowerCase().includes(q) || (art.headlineSi && art.headlineSi.toLowerCase().includes(q));
        const matchReporter = art.reporterName.toLowerCase().includes(q);
        const matchDateline = art.dateline?.toLowerCase().includes(q);
        if (!matchTitle && !matchReporter && !matchDateline) return false;
      }
      // Section
      if (selectedSection !== 'ALL' && art.sectionId !== selectedSection) {
        return false;
      }
      // Status
      if (selectedStatus !== 'ALL' && art.editorialStatus !== selectedStatus) {
        return false;
      }
      // Priority
      if (selectedPriority !== 'ALL' && art.priorityTag !== selectedPriority) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      let valA: number = 0;
      let valB: number = 0;
      if (sortBy === 'updated') {
        valA = new Date(a.updatedAt).getTime();
        valB = new Date(b.updatedAt).getTime();
      } else if (sortBy === 'published') {
        valA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
        valB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      } else if (sortBy === 'views') {
        valA = a.views || 0;
        valB = b.views || 0;
      }
      return sortOrder === 'desc' ? valB - valA : valA - valB;
    });
  }, [articles, searchTerm, selectedSection, selectedStatus, selectedPriority, viewScope, currentUser, sortBy, sortOrder]);

  // Paginated articles
  const totalPages = Math.max(1, Math.ceil(filteredArticles.length / pageSize));
  const paginatedArticles = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredArticles.slice(start, start + pageSize);
  }, [filteredArticles, currentPage, pageSize]);

  const handleSelectAllOnPage = () => {
    const pageIds = paginatedArticles.map((a) => a.id);
    const allSelected = pageIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds(selectedIds.filter((id) => !pageIds.includes(id)));
    } else {
      setSelectedIds(Array.from(new Set([...selectedIds, ...pageIds])));
    }
  };

  const toggleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((i) => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleExecuteBulkAction = () => {
    if (selectedIds.length === 0 || !bulkAction) return;
    if (bulkAction === 'publish') {
      onBulkUpdate(selectedIds, { editorialStatus: 'published', publishedAt: new Date().toISOString() });
    } else if (bulkAction === 'draft') {
      onBulkUpdate(selectedIds, { editorialStatus: 'draft' });
    } else if (bulkAction === 'archive') {
      onBulkUpdate(selectedIds, { editorialStatus: 'archived' });
    } else if (bulkAction.startsWith('section:')) {
      const targetSec = bulkAction.replace('section:', '');
      onBulkUpdate(selectedIds, { sectionId: targetSec });
    } else if (bulkAction === 'delete') {
      if (window.confirm(`Are you sure you want to delete ${selectedIds.length} articles?`)) {
        selectedIds.forEach((id) => onDeleteArticle(id));
      }
    }
    setSelectedIds([]);
    setBulkAction('');
  };

  const getStatusBadge = (status: EditorialStatus) => {
    switch (status) {
      case 'published':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">Published</span>;
      case 'in_review':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-800 border border-amber-300">In Review</span>;
      case 'approved':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-300">Approved</span>;
      case 'archived':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-stone-200 text-stone-700 border border-stone-300">Archived</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-600 border border-stone-300">Draft</span>;
    }
  };

  const getPriorityBadge = (priority: PriorityTag) => {
    switch (priority) {
      case 'breaking':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-600 text-white animate-pulse">Breaking</span>;
      case 'developing':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-800 border border-orange-300">Developing</span>;
      case 'exclusive':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-800 border border-purple-300">Exclusive</span>;
      case 'analysis':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-indigo-100 text-indigo-800 border border-indigo-300">Analysis</span>;
      case 'opinion':
        return <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-stone-200 text-stone-800">Opinion</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Action & View Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-lg border border-stone-200 shadow-xs">
        <div>
          <h1 className="text-xl font-serif font-bold text-stone-900 tracking-tight">
            News Articles Desk
          </h1>
          <p className="text-xs text-stone-500">
            Total {articles.length} news dispatches • Showing {filteredArticles.length} matching criteria
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* My Articles vs All Articles toggle */}
          <div className="flex items-center bg-stone-100 rounded p-0.5 border border-stone-300 text-xs">
            <button
              type="button"
              onClick={() => { setViewScope('all'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded font-medium transition ${
                viewScope === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Articles
            </button>
            <button
              type="button"
              onClick={() => { setViewScope('mine'); setCurrentPage(1); }}
              className={`px-3 py-1.5 rounded font-medium transition ${
                viewScope === 'mine' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              My Desk ({articles.filter((a) => a.reporterId === currentUser?.id).length})
            </button>
          </div>

          <button
            type="button"
            onClick={onNewArticle}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" /> New Article
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search Input */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search headline, reporter, dateline..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded focus:bg-white focus:ring-1 focus:ring-red-600 focus:outline-none"
            />
          </div>

          {/* Section Filter */}
          <div>
            <select
              value={selectedSection}
              onChange={(e) => { setSelectedSection(e.target.value); setCurrentPage(1); }}
              className="w-full px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded focus:bg-white focus:outline-none capitalize"
            >
              <option value="ALL">All Sections</option>
              {sections.map((sec) => (
                <option key={sec.id} value={sec.id}>
                  {sec.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
              className="w-full px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded focus:bg-white focus:outline-none uppercase"
            >
              <option value="ALL">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="in_review">In Review</option>
              <option value="approved">Approved</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Priority Tag Filter */}
          <div>
            <select
              value={selectedPriority}
              onChange={(e) => { setSelectedPriority(e.target.value); setCurrentPage(1); }}
              className="w-full px-2.5 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded focus:bg-white focus:outline-none capitalize"
            >
              <option value="ALL">All Priority Tags</option>
              <option value="standard">Standard</option>
              <option value="breaking">Breaking</option>
              <option value="developing">Developing</option>
              <option value="exclusive">Exclusive</option>
              <option value="analysis">Analysis</option>
              <option value="opinion">Opinion</option>
            </select>
          </div>
        </div>

        {/* Sort Bar */}
        <div className="flex flex-wrap items-center justify-between pt-2 border-t border-stone-100 text-xs text-stone-600 gap-2">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-500">Sort by:</span>
            <button
              type="button"
              onClick={() => setSortBy('updated')}
              className={`hover:text-stone-900 ${sortBy === 'updated' ? 'font-bold text-stone-900 underline' : ''}`}
            >
              Last Updated
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setSortBy('published')}
              className={`hover:text-stone-900 ${sortBy === 'published' ? 'font-bold text-stone-900 underline' : ''}`}
            >
              Publish Date
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setSortBy('views')}
              className={`hover:text-stone-900 ${sortBy === 'views' ? 'font-bold text-stone-900 underline' : ''}`}
            >
              Views / Traffic
            </button>

            <button
              type="button"
              onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
              className="ml-2 px-1.5 py-0.5 bg-stone-100 rounded text-[11px] font-mono hover:bg-stone-200"
            >
              {sortOrder.toUpperCase()}
            </button>
          </div>

          {/* Bulk Action Controls */}
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 bg-stone-100 px-3 py-1 rounded border border-stone-300">
              <span className="font-bold text-stone-800 text-xs">
                {selectedIds.length} selected
              </span>
              <select
                value={bulkAction}
                onChange={(e) => setBulkAction(e.target.value)}
                className="px-2 py-0.5 text-xs bg-white border border-stone-300 rounded focus:outline-none"
              >
                <option value="">Choose bulk action...</option>
                {canPublish && <option value="publish">Publish All</option>}
                <option value="draft">Move to Draft</option>
                <option value="archive">Archive All</option>
                <optgroup label="Move to Section">
                  {sections.map((s) => (
                    <option key={s.id} value={`section:${s.id}`}>
                      {s.name}
                    </option>
                  ))}
                </optgroup>
                <option value="delete">Delete Selected</option>
              </select>
              <button
                type="button"
                onClick={handleExecuteBulkAction}
                className="px-2.5 py-0.5 bg-stone-800 hover:bg-stone-900 text-white rounded text-xs font-semibold"
              >
                Apply
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Articles Table */}
      <div className="bg-white rounded-lg border border-stone-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-100 border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                <th className="py-3 px-4 w-10 text-center">
                  <button
                    type="button"
                    onClick={handleSelectAllOnPage}
                    className="text-stone-500 hover:text-stone-800"
                    title="Select all on page"
                  >
                    {paginatedArticles.length > 0 && paginatedArticles.every((a) => selectedIds.includes(a.id)) ? (
                      <CheckSquare className="w-4 h-4 text-red-600" />
                    ) : (
                      <Square className="w-4 h-4" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-4">Headline / Story</th>
                <th className="py-3 px-3">Section</th>
                <th className="py-3 px-3">Reporter</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Views</th>
                <th className="py-3 px-3">Last Modified</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200 text-xs">
              {paginatedArticles.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-stone-400 font-serif">
                    No articles found matching the selected search and filter criteria.
                  </td>
                </tr>
              ) : (
                paginatedArticles.map((article) => {
                  const isSelected = selectedIds.includes(article.id);
                  const sectionObj = sections.find((s) => s.id === article.sectionId);
                  const isMyArticle = article.reporterId === currentUser?.id;
                  const canEdit = canPublish || isMyArticle;
                  const canDelete = canDeleteAny || (isMyArticle && article.editorialStatus === 'draft');

                  return (
                    <tr
                      key={article.id}
                      className={`hover:bg-stone-50 transition ${isSelected ? 'bg-red-50/40' : ''}`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => toggleSelectOne(article.id)}
                          className="text-stone-400 hover:text-stone-700"
                        >
                          {isSelected ? (
                            <CheckSquare className="w-4 h-4 text-red-600" />
                          ) : (
                            <Square className="w-4 h-4" />
                          )}
                        </button>
                      </td>

                      {/* Headline, deck & badges */}
                      <td className="py-3 px-4 max-w-md">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          {getPriorityBadge(article.priorityTag)}
                          {article.isSticky && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] text-amber-700 font-semibold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                              <Pin className="w-3 h-3" /> Pinned
                            </span>
                          )}
                          {article.isLiveBlog && (
                            <span className="inline-flex items-center gap-0.5 text-[10px] text-red-700 font-semibold bg-red-50 px-1.5 py-0.5 rounded border border-red-200">
                              <Radio className="w-3 h-3 text-red-600 animate-pulse" /> Live Blog
                            </span>
                          )}
                          {article.correctionNotice && (
                            <span className="text-[10px] text-orange-700 font-mono bg-orange-50 px-1 py-0.5 rounded border border-orange-200">
                              Correction
                            </span>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => onEditArticle(article)}
                          className="text-sm font-serif font-bold text-stone-900 hover:text-red-700 transition text-left line-clamp-2"
                        >
                          {article.headline}
                        </button>

                        {article.headlineSi && (
                          <p className="text-[11px] text-stone-500 font-serif line-clamp-1 mt-0.5">
                            සිංහල: {article.headlineSi}
                          </p>
                        )}

                        {article.subheadline && (
                          <p className="text-[11px] text-stone-500 line-clamp-1 mt-0.5">
                            {article.subheadline}
                          </p>
                        )}
                      </td>

                      {/* Section */}
                      <td className="py-3 px-3">
                        <span
                          className="inline-block px-2 py-0.5 rounded text-[11px] font-semibold text-white uppercase tracking-wider"
                          style={{ backgroundColor: sectionObj?.color || '#333' }}
                        >
                          {sectionObj?.name || article.sectionId}
                        </span>
                        {article.subsection && (
                          <div className="text-[10px] text-stone-400 mt-0.5 font-mono">
                            {article.subsection}
                          </div>
                        )}
                      </td>

                      {/* Reporter */}
                      <td className="py-3 px-3">
                        <span className="font-medium text-stone-800 block">{article.reporterName}</span>
                        <span className="text-[10px] text-stone-400 font-mono">{article.dateline}</span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        {getStatusBadge(article.editorialStatus)}
                      </td>

                      {/* Views */}
                      <td className="py-3 px-3 font-mono text-stone-700">
                        <div className="flex items-center gap-1">
                          <Eye className="w-3.5 h-3.5 text-stone-400" />
                          {(article.views || 0).toLocaleString()}
                        </div>
                      </td>

                      {/* Last Modified */}
                      <td className="py-3 px-3 text-stone-500 text-[11px]">
                        <div>{new Date(article.updatedAt).toLocaleDateString()}</div>
                        <div className="text-[10px] text-stone-400">{new Date(article.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => onPreviewArticle(article)}
                            className="p-1 text-stone-500 hover:text-stone-900 rounded hover:bg-stone-100"
                            title="Preview in Reader"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>

                          {canEdit && (
                            <button
                              type="button"
                              onClick={() => onEditArticle(article)}
                              className="p-1 text-stone-700 hover:text-red-700 rounded hover:bg-stone-100"
                              title="Edit Article"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                          )}

                          {canDelete && (
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Delete article "${article.headline}"?`)) {
                                  onDeleteArticle(article.id);
                                }
                              }}
                              className="p-1 text-stone-400 hover:text-red-600 rounded hover:bg-red-50"
                              title="Delete Article"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="px-4 py-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600">
          <div>
            Showing <span className="font-bold">{(currentPage - 1) * pageSize + 1}</span> to{' '}
            <span className="font-bold">{Math.min(currentPage * pageSize, filteredArticles.length)}</span> of{' '}
            <span className="font-bold">{filteredArticles.length}</span> entries
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(currentPage - 1)}
              className="p-1.5 rounded border border-stone-300 bg-white hover:bg-stone-100 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-medium text-stone-800">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(currentPage + 1)}
              className="p-1.5 rounded border border-stone-300 bg-white hover:bg-stone-100 disabled:opacity-40"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
