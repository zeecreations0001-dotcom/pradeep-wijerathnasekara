/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Article, Edition } from '../../types/admin';
import {
  BookOpen,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Archive,
  CheckCircle,
  Eye,
  FileText,
  ExternalLink,
} from 'lucide-react';

interface EditionsTabProps {
  editions: Edition[];
  articles: Article[];
  onSaveEdition: (edition: Edition) => void;
  onDeleteEdition: (id: string) => void;
}

export const EditionsTab: React.FC<EditionsTabProps> = ({
  editions,
  articles,
  onSaveEdition,
  onDeleteEdition,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEdition, setEditingEdition] = useState<Edition | null>(null);

  // Form states
  const [name, setName] = useState('');
  const [type, setType] = useState<Edition['type']>('morning');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedArticleIds, setSelectedArticleIds] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [coverImage, setCoverImage] = useState('');

  // Snapshot modal state
  const [snapshotEdition, setSnapshotEdition] = useState<Edition | null>(null);

  const handleOpenNew = () => {
    setEditingEdition(null);
    setName('Morning City Edition');
    setType('morning');
    setDate(new Date().toISOString().split('T')[0]);
    setSelectedArticleIds(articles.filter((a) => a.editorialStatus === 'published').slice(0, 4).map((a) => a.id));
    setNotes('');
    setCoverImage('https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=800');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (edition: Edition) => {
    setEditingEdition(edition);
    setName(edition.name);
    setType(edition.type);
    setDate(edition.date);
    setSelectedArticleIds(edition.articleIds);
    setNotes(edition.notes || '');
    setCoverImage(edition.coverImage || '');
    setIsModalOpen(true);
  };

  const handleToggleArticle = (artId: string) => {
    if (selectedArticleIds.includes(artId)) {
      setSelectedArticleIds(selectedArticleIds.filter((id) => id !== artId));
    } else {
      setSelectedArticleIds([...selectedArticleIds, artId]);
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newEdition: Edition = {
      id: editingEdition?.id || 'ed-' + Date.now(),
      name: name.trim(),
      type,
      date,
      articleIds: selectedArticleIds,
      publishedAt: editingEdition?.publishedAt || new Date().toISOString(),
      isArchived: editingEdition?.isArchived || false,
      notes: notes.trim() || undefined,
      coverImage: coverImage.trim() || undefined,
    };

    onSaveEdition(newEdition);
    setIsModalOpen(false);
  };

  const toggleArchive = (edition: Edition) => {
    onSaveEdition({
      ...edition,
      isArchived: !edition.isArchived,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-stone-900 rounded text-white">
              <BookOpen className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-serif font-bold text-stone-900 tracking-tight">
              Editions & Print Archive Manager
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Publish distinct daily editions (Morning, Evening, Weekend, Print Replica) and preserve date-bound historical snapshots.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNew}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-sm transition"
        >
          <Plus className="w-4 h-4" /> Create New Edition
        </button>
      </div>

      {/* Editions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {editions.map((edition) => {
          const editionArticles = edition.articleIds
            .map((id) => articles.find((a) => a.id === id))
            .filter(Boolean) as Article[];

          return (
            <div
              key={edition.id}
              className={`bg-white rounded-lg border overflow-hidden shadow-xs flex flex-col transition hover:shadow-md ${
                edition.isArchived ? 'border-stone-300 opacity-75' : 'border-stone-200'
              }`}
            >
              {/* Cover Preview Image */}
              <div className="relative aspect-video bg-stone-100 overflow-hidden border-b border-stone-200">
                <img
                  src={edition.coverImage || 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?auto=format&fit=crop&q=80&w=800'}
                  alt={edition.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-black/75 backdrop-blur-xs text-white text-[10px] font-mono uppercase px-2 py-0.5 rounded">
                  {edition.type.replace('_', ' ')}
                </div>
                {edition.isArchived && (
                  <div className="absolute top-2 right-2 bg-amber-600 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded flex items-center gap-1">
                    <Archive className="w-3 h-3" /> Archived
                  </div>
                )}
              </div>

              {/* Card Body */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-2 text-[11px] text-stone-500 mb-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>{edition.date}</span>
                    <span>•</span>
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>{new Date(edition.publishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <h3 className="text-base font-serif font-bold text-stone-900">
                    {edition.name}
                  </h3>

                  {edition.notes && (
                    <p className="text-xs text-stone-600 line-clamp-2 mt-1">
                      {edition.notes}
                    </p>
                  )}

                  <div className="mt-3 pt-3 border-t border-stone-100">
                    <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500 mb-1.5">
                      Included Articles ({editionArticles.length})
                    </div>
                    <ul className="space-y-1">
                      {editionArticles.slice(0, 3).map((art) => (
                        <li key={art.id} className="text-xs text-stone-700 truncate font-serif">
                          • {art.headline}
                        </li>
                      ))}
                      {editionArticles.length > 3 && (
                        <li className="text-[11px] text-stone-400 italic">
                          +{editionArticles.length - 3} more articles in edition
                        </li>
                      )}
                    </ul>
                  </div>
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-stone-200 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => setSnapshotEdition(edition)}
                    className="text-stone-700 hover:text-red-700 font-semibold flex items-center gap-1"
                  >
                    <Eye className="w-3.5 h-3.5" /> View Snapshot
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => toggleArchive(edition)}
                      className="text-stone-500 hover:text-stone-800"
                      title={edition.isArchived ? 'Unarchive' : 'Archive'}
                    >
                      <Archive className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(edition)}
                      className="text-stone-500 hover:text-stone-800"
                      title="Edit"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete edition "${edition.name}"?`)) {
                          onDeleteEdition(edition.id);
                        }
                      }}
                      className="text-stone-400 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* MODAL: Create / Edit Edition */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-xl border border-stone-300 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden">
            <div className="px-5 py-4 bg-stone-900 text-white flex items-center justify-between">
              <h2 className="font-serif font-bold text-base flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-red-500" />
                {editingEdition ? 'Edit Edition Package' : 'Create New Newspaper Edition'}
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="p-5 overflow-y-auto space-y-4 flex-1">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Edition Title <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Morning City Edition"
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded focus:ring-1 focus:ring-red-600 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Edition Type
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:outline-none capitalize"
                  >
                    <option value="morning">Morning Edition</option>
                    <option value="evening">Evening Chronicle</option>
                    <option value="weekend">Weekend Special</option>
                    <option value="print_replica">Print Replica (PDF/E-Paper)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Publication Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Cover / Front Page Image URL
                </label>
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Select Articles to Bundle ({selectedArticleIds.length} selected)
                </label>
                <div className="max-h-48 overflow-y-auto border border-stone-200 rounded p-2 divide-y divide-stone-100 bg-stone-50">
                  {articles.map((art) => (
                    <label
                      key={art.id}
                      className="flex items-center gap-2 py-1.5 px-2 cursor-pointer hover:bg-stone-100 rounded text-xs"
                    >
                      <input
                        type="checkbox"
                        checked={selectedArticleIds.includes(art.id)}
                        onChange={() => handleToggleArticle(art.id)}
                        className="rounded text-red-600 focus:ring-red-500"
                      />
                      <span className="font-semibold text-stone-900 truncate flex-1 font-serif">
                        {art.headline}
                      </span>
                      <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-stone-200 rounded">
                        {art.sectionId}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Editorial Notes (Internal or Summary)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Notes about this historical issue..."
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded shadow-sm"
                >
                  Save Edition
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SNAPSHOT MODAL: View Edition on Date */}
      {snapshotEdition && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/80 backdrop-blur-xs">
          <div className="bg-[#fbfbf9] text-stone-900 rounded-lg shadow-2xl border border-stone-300 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
            {/* Vintage Masthead in Snapshot */}
            <div className="p-6 border-b border-stone-300 text-center bg-stone-100/60 relative">
              <button
                type="button"
                onClick={() => setSnapshotEdition(null)}
                className="absolute top-4 right-4 text-stone-500 hover:text-stone-900 text-sm font-bold p-1"
              >
                ✕ Close Snapshot
              </button>
              <div className="text-[10px] tracking-widest uppercase font-mono text-stone-500 mb-1">
                HISTORICAL NEWSPAPER EDITION ARCHIVE • {snapshotEdition.type.toUpperCase().replace('_', ' ')}
              </div>
              <h2 className="text-3xl font-serif font-black tracking-tight text-stone-900">
                {snapshotEdition.name}
              </h2>
              <div className="text-xs font-serif italic text-stone-600 mt-1">
                Published on {snapshotEdition.date} • {snapshotEdition.articleIds.length} Featured Dispatches
              </div>
            </div>

            {/* Content Snapshot Grid */}
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {snapshotEdition.articleIds.map((id) => {
                  const art = articles.find((a) => a.id === id);
                  if (!art) return null;
                  return (
                    <div key={art.id} className="p-4 bg-white border border-stone-200 rounded shadow-xs space-y-2">
                      <img src={art.featuredImage} alt="" className="w-full h-40 object-cover rounded" />
                      <span className="text-[10px] font-bold text-red-700 uppercase tracking-wider">
                        {art.sectionId} • {art.priorityTag}
                      </span>
                      <h4 className="text-base font-serif font-bold text-stone-900 leading-snug">
                        {art.headline}
                      </h4>
                      <p className="text-xs text-stone-600 line-clamp-3">
                        {art.excerpt}
                      </p>
                      <div className="text-[10px] text-stone-400 font-mono pt-1">
                        By {art.reporterName} • {art.dateline}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
