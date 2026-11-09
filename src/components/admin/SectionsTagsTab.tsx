/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Article, Section, StaffMember, Tag } from '../../types/admin';
import {
  FolderTree,
  Plus,
  Trash2,
  Edit3,
  ArrowUp,
  ArrowDown,
  Tag as TagIcon,
  CheckCircle,
  Hash,
  UserCheck,
} from 'lucide-react';

interface SectionsTagsTabProps {
  sections: Section[];
  tags: Tag[];
  articles: Article[];
  staffList: StaffMember[];
  onSaveSection: (section: Section) => void;
  onDeleteSection: (id: string) => void;
  onReorderSections: (sections: Section[]) => void;
  onSaveTag: (tag: Tag) => void;
  onDeleteTag: (id: string) => void;
}

export const SectionsTagsTab: React.FC<SectionsTagsTabProps> = ({
  sections,
  tags,
  articles,
  staffList,
  onSaveSection,
  onDeleteSection,
  onReorderSections,
  onSaveTag,
  onDeleteTag,
}) => {
  // Section Modal state
  const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [secName, setSecName] = useState('');
  const [secNameSi, setSecNameSi] = useState('');
  const [secSlug, setSecSlug] = useState('');
  const [secDesc, setSecDesc] = useState('');
  const [secColor, setSecColor] = useState('#1e3a8a');
  const [secEditorId, setSecEditorId] = useState('');
  const [secHeroImage, setSecHeroImage] = useState('');

  // Tag Modal / Inline Add state
  const [newTagName, setNewTagName] = useState('');

  // Open section modal
  const handleOpenNewSection = () => {
    setEditingSection(null);
    setSecName('');
    setSecNameSi('');
    setSecSlug('');
    setSecDesc('');
    setSecColor('#1e3a8a');
    setSecEditorId(staffList[0]?.id || '');
    setSecHeroImage('');
    setIsSectionModalOpen(true);
  };

  const handleOpenEditSection = (section: Section) => {
    setEditingSection(section);
    setSecName(section.name);
    setSecNameSi(section.nameSi || '');
    setSecSlug(section.slug);
    setSecDesc(section.description || '');
    setSecColor(section.color || '#1e3a8a');
    setSecEditorId(section.editorId || '');
    setSecHeroImage(section.heroImage || '');
    setIsSectionModalOpen(true);
  };

  const handleSaveSectionForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!secName.trim()) return;

    const slug = secSlug.trim() || secName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const finalSection: Section = {
      id: editingSection?.id || slug,
      name: secName.trim(),
      nameSi: secNameSi.trim() || undefined,
      slug,
      description: secDesc.trim(),
      color: secColor,
      order: editingSection?.order || sections.length + 1,
      editorId: secEditorId || undefined,
      heroImage: secHeroImage.trim() || undefined,
    };

    onSaveSection(finalSection);
    setIsSectionModalOpen(false);
  };

  // Reorder sections
  const moveSection = (index: number, direction: 'up' | 'down') => {
    const list = [...sections];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= list.length) return;
    const tmp = list[index];
    list[index] = list[target];
    list[target] = tmp;
    onReorderSections(list);
  };

  // Add Tag
  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTagName.trim()) return;
    const name = newTagName.trim();
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    onSaveTag({
      id: 'tag-' + Date.now(),
      name,
      slug,
    });
    setNewTagName('');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-stone-900 rounded text-white">
              <FolderTree className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-serif font-bold text-stone-900 tracking-tight">
              Newsroom Desks & Tag Taxonomy
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Configure primary newspaper verticals, assigned desk heads, and topic indexing tags.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNewSection}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-sm transition"
        >
          <Plus className="w-4 h-4" /> Add News Desk
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sections List (2 Cols) */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-stone-200 shadow-xs overflow-hidden">
          <div className="px-5 py-3.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-800">
              Active Editorial Desks ({sections.length})
            </h2>
            <span className="text-[11px] text-stone-500">
              Drag or use arrows to adjust sequence order
            </span>
          </div>

          <div className="divide-y divide-stone-200">
            {sections.map((sec, index) => {
              const articleCount = articles.filter((a) => a.sectionId === sec.id).length;
              const assignedEditor = staffList.find((s) => s.id === sec.editorId);

              return (
                <div
                  key={sec.id}
                  className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50 transition"
                >
                  <div className="flex items-start gap-3">
                    {/* Reorder buttons */}
                    <div className="flex flex-col gap-0.5 pt-0.5">
                      <button
                        type="button"
                        disabled={index === 0}
                        onClick={() => moveSection(index, 'up')}
                        className="p-1 hover:bg-stone-200 rounded text-stone-500 disabled:opacity-20"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={index === sections.length - 1}
                        onClick={() => moveSection(index, 'down')}
                        className="p-1 hover:bg-stone-200 rounded text-stone-500 disabled:opacity-20"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: sec.color }}
                        />
                        <h3 className="text-sm font-serif font-bold text-stone-900">
                          {sec.name}
                        </h3>
                        {sec.nameSi && (
                          <span className="text-xs text-stone-500 font-serif">
                            ({sec.nameSi})
                          </span>
                        )}
                        <span className="text-[10px] font-mono text-stone-400">/{sec.slug}</span>
                      </div>

                      <p className="text-xs text-stone-600 line-clamp-1">
                        {sec.description || 'No desk description provided.'}
                      </p>

                      <div className="text-[11px] text-stone-500 flex items-center gap-3 pt-0.5">
                        <span className="font-semibold text-stone-700">
                          {articleCount} {articleCount === 1 ? 'article' : 'articles'} published
                        </span>
                        {assignedEditor && (
                          <span className="flex items-center gap-1 text-stone-600">
                            <UserCheck className="w-3 h-3 text-emerald-600" />
                            Desk Head: {assignedEditor.name}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => handleOpenEditSection(sec)}
                      className="px-3 py-1.5 text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 rounded flex items-center gap-1"
                    >
                      <Edit3 className="w-3.5 h-3.5" /> Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Delete section "${sec.name}"? Articles in this section may become unassigned.`)) {
                          onDeleteSection(sec.id);
                        }
                      }}
                      className="p-1.5 text-stone-400 hover:text-red-600 rounded hover:bg-red-50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tags Taxonomy (1 Col) */}
        <div className="bg-white rounded-lg border border-stone-200 shadow-xs overflow-hidden flex flex-col">
          <div className="px-5 py-3.5 bg-stone-50 border-b border-stone-200">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-800">
              Topic Tags & Keywords
            </h2>
            <p className="text-[11px] text-stone-500">
              Taxonomy terms applied to articles for search and related feeds.
            </p>
          </div>

          <div className="p-4 space-y-4 flex-1 flex flex-col justify-between">
            {/* Add Tag Form */}
            <form onSubmit={handleAddTag} className="flex gap-2">
              <input
                type="text"
                placeholder="New topic keyword..."
                value={newTagName}
                onChange={(e) => setNewTagName(e.target.value)}
                className="flex-1 px-3 py-1.5 text-xs border border-stone-300 rounded focus:outline-none"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold rounded flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" /> Add
              </button>
            </form>

            {/* Tags Cloud / List */}
            <div className="flex flex-wrap gap-1.5 max-h-72 overflow-y-auto pt-2">
              {tags.map((tg) => {
                const count = articles.filter((a) => a.tags?.includes(tg.name)).length;
                return (
                  <span
                    key={tg.id}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-stone-100 hover:bg-stone-200 border border-stone-200 rounded-full text-xs text-stone-800 transition"
                  >
                    <Hash className="w-3 h-3 text-stone-400" />
                    <span>{tg.name}</span>
                    <span className="text-[10px] text-stone-400 font-mono">({count})</span>
                    <button
                      type="button"
                      onClick={() => onDeleteTag(tg.id)}
                      className="text-stone-400 hover:text-red-600 ml-0.5"
                      title="Remove Tag"
                    >
                      ×
                    </button>
                  </span>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION MODAL */}
      {isSectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-xl border border-stone-300 w-full max-w-lg overflow-hidden">
            <div className="px-5 py-4 bg-stone-900 text-white flex items-center justify-between">
              <h2 className="font-serif font-bold text-base flex items-center gap-2">
                <FolderTree className="w-4 h-4 text-red-500" />
                {editingSection ? 'Edit Newsroom Desk' : 'Create New Newsroom Desk'}
              </h2>
              <button
                type="button"
                onClick={() => setIsSectionModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveSectionForm} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Desk Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={secName}
                    onChange={(e) => setSecName(e.target.value)}
                    placeholder="e.g. World"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Sinhala Name (සිංහල)
                  </label>
                  <input
                    type="text"
                    value={secNameSi}
                    onChange={(e) => setSecNameSi(e.target.value)}
                    placeholder="e.g. ලෝකය"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:outline-none font-serif"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    URL Slug
                  </label>
                  <input
                    type="text"
                    value={secSlug}
                    onChange={(e) => setSecSlug(e.target.value)}
                    placeholder="e.g. world"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded font-mono focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Color Accent
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={secColor}
                      onChange={(e) => setSecColor(e.target.value)}
                      className="w-9 h-8 rounded border border-stone-300 cursor-pointer"
                    />
                    <span className="text-xs font-mono">{secColor}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Desk Managing Editor
                </label>
                <select
                  value={secEditorId}
                  onChange={(e) => setSecEditorId(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:outline-none"
                >
                  <option value="">Unassigned</option>
                  {staffList.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} ({st.role.replace('_', ' ')})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Editorial Description / Scope
                </label>
                <textarea
                  rows={2}
                  value={secDesc}
                  onChange={(e) => setSecDesc(e.target.value)}
                  placeholder="Summary of news coverage for this desk..."
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Hero Header Image URL
                </label>
                <input
                  type="text"
                  value={secHeroImage}
                  onChange={(e) => setSecHeroImage(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSectionModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded shadow-sm"
                >
                  Save News Desk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
