/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { MediaItem, StaffMember } from '../../types/admin';
import {
  Image,
  Upload,
  Search,
  Copy,
  Trash2,
  Film,
  ExternalLink,
  CheckCircle,
  FileText,
  Plus,
  Loader2,
} from 'lucide-react';
import { processImageFile, formatBytes } from '../../services/imageService';

interface MediaLibraryTabProps {
  media: MediaItem[];
  currentUser: StaffMember | null;
  onSaveMedia: (item: MediaItem) => void;
  onDeleteMedia: (id: string) => void;
}

export const MediaLibraryTab: React.FC<MediaLibraryTabProps> = ({
  media,
  currentUser,
  onSaveMedia,
  onDeleteMedia,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState<'all' | 'image' | 'video'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New Media Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaName, setMediaName] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [credit, setCredit] = useState('');
  const [caption, setCaption] = useState('');

  // Device file upload
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const modalFileInputRef = useRef<HTMLInputElement | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleDeviceFilesUpload = async (files: FileList | File[]) => {
    setIsUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (!file.type.startsWith('image/')) continue;

        const processed = await processImageFile(file, 1600, 1200, 0.85);
        const newItem: MediaItem = {
          id: 'med-' + Date.now() + '-' + i,
          url: processed.dataUrl,
          name: processed.name,
          size: processed.size,
          type: 'image',
          credit: 'Staff Upload / Newsroom',
          caption: processed.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' '),
          uploadedAt: new Date().toISOString(),
          uploadedBy: currentUser?.name || 'Staff Correspondent',
          dimensions: `${processed.width}x${processed.height}`,
        };
        onSaveMedia(newItem);
      }
    } catch (err) {
      console.error('Failed to upload device files:', err);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      if (modalFileInputRef.current) modalFileInputRef.current.value = '';
    }
  };

  const filteredMedia = media.filter((m) => {
    if (selectedType !== 'all' && m.type !== selectedType) return false;
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      const matchName = m.name.toLowerCase().includes(q);
      const matchCaption = m.caption?.toLowerCase().includes(q);
      const matchCredit = m.credit?.toLowerCase().includes(q);
      if (!matchName && !matchCaption && !matchCredit) return false;
    }
    return true;
  });

  const handleCopyUrl = (item: MediaItem) => {
    navigator.clipboard.writeText(item.url);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSaveMediaForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mediaUrl.trim() || !mediaName.trim()) return;

    const newItem: MediaItem = {
      id: 'med-' + Date.now(),
      url: mediaUrl.trim(),
      name: mediaName.trim(),
      size: Math.floor(Math.random() * 2000000 + 500000),
      type: mediaType,
      credit: credit.trim() || 'Newsroom Archive',
      caption: caption.trim() || mediaName.trim(),
      uploadedAt: new Date().toISOString(),
      uploadedBy: currentUser?.name || 'Staff Correspondent',
      dimensions: mediaType === 'image' ? '1920x1080' : '1080p Video',
    };

    onSaveMedia(newItem);
    setIsModalOpen(false);
    setMediaUrl('');
    setMediaName('');
    setCredit('');
    setCaption('');
  };

  return (
    <div className="space-y-6">
      {/* Hidden file input for batch header uploads */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
        onChange={(e) => e.target.files && handleDeviceFilesUpload(e.target.files)}
        className="hidden"
      />

      {/* Header Bar */}
      <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-stone-900 rounded text-white">
              <Image className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-serif font-bold text-stone-900 tracking-tight">
              Newsroom Media Asset Library
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Archival photography, local device photo uploads, satellite imagery, video embeds, and licensed journalistic photo assets.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Upload directly from device button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="px-3.5 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-sm transition"
          >
            {isUploading ? (
              <Loader2 className="w-4 h-4 animate-spin text-red-400" />
            ) : (
              <Upload className="w-4 h-4 text-red-500" />
            )}
            <span>Upload from Device</span>
          </button>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-sm transition"
          >
            <Plus className="w-4 h-4" /> Add by URL / Video
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search assets by title, credit, caption..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-300 rounded focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto text-xs">
          <span className="font-semibold text-stone-600">Filter:</span>
          <button
            type="button"
            onClick={() => setSelectedType('all')}
            className={`px-2.5 py-1 rounded transition ${
              selectedType === 'all' ? 'bg-stone-800 text-white font-bold' : 'bg-stone-100 text-stone-600'
            }`}
          >
            All Assets ({media.length})
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('image')}
            className={`px-2.5 py-1 rounded transition ${
              selectedType === 'image' ? 'bg-stone-800 text-white font-bold' : 'bg-stone-100 text-stone-600'
            }`}
          >
            Photos
          </button>
          <button
            type="button"
            onClick={() => setSelectedType('video')}
            className={`px-2.5 py-1 rounded transition ${
              selectedType === 'video' ? 'bg-stone-800 text-white font-bold' : 'bg-stone-100 text-stone-600'
            }`}
          >
            Video Embeds
          </button>
        </div>
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredMedia.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-lg border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition flex flex-col justify-between"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-stone-100 overflow-hidden border-b border-stone-200 group">
              <img
                src={item.url}
                alt={item.caption || item.name}
                className="w-full h-full object-cover transition duration-300 group-hover:scale-105"
              />
              <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-mono uppercase px-2 py-0.5 rounded">
                {item.type}
              </div>
            </div>

            {/* Info */}
            <div className="p-3 space-y-1.5 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="text-xs font-serif font-bold text-stone-900 line-clamp-1">
                  {item.name}
                </h4>
                {item.caption && (
                  <p className="text-[11px] text-stone-600 line-clamp-2 mt-0.5">
                    {item.caption}
                  </p>
                )}
                <div className="text-[10px] text-stone-400 font-mono mt-1">
                  Credit: {item.credit} • {(item.size / 1024 / 1024).toFixed(1)} MB
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                <button
                  type="button"
                  onClick={() => handleCopyUrl(item)}
                  className={`text-[11px] font-semibold flex items-center gap-1 transition ${
                    copiedId === item.id ? 'text-emerald-600' : 'text-stone-700 hover:text-red-700'
                  }`}
                >
                  {copiedId === item.id ? (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" /> Copy URL
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Delete media asset "${item.name}"?`)) {
                      onDeleteMedia(item.id);
                    }
                  }}
                  className="p-1 text-stone-400 hover:text-red-600"
                  title="Delete Asset"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL: Upload / Add Media */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-xl border border-stone-300 w-full max-w-lg overflow-hidden">
            <div className="px-5 py-4 bg-stone-900 text-white flex items-center justify-between">
              <h2 className="font-serif font-bold text-base flex items-center gap-2">
                <Upload className="w-4 h-4 text-red-500" />
                Add Newsroom Media Asset
              </h2>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveMediaForm} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Asset Type
                  </label>
                  <select
                    value={mediaType}
                    onChange={(e) => setMediaType(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:outline-none"
                  >
                    <option value="image">Photography / Image</option>
                    <option value="video">Video Embed / Clip</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Filename / Title <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={mediaName}
                    onChange={(e) => setMediaName(e.target.value)}
                    placeholder="e.g. parliament_session_01.jpg"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:outline-none"
                  />
                </div>
              </div>

              {/* Media File Upload or URL */}
              <div>
                <input
                  ref={modalFileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif,image/svg+xml"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setIsUploading(true);
                      try {
                        const processed = await processImageFile(file, 1600, 1200, 0.85);
                        setMediaUrl(processed.dataUrl);
                        if (!mediaName) setMediaName(processed.name);
                        if (!caption) setCaption(processed.name.replace(/\.[^/.]+$/, '').replace(/[-_]+/g, ' '));
                        if (!credit) setCredit('Staff Upload');
                      } catch (err) {
                        console.error('Failed to read image:', err);
                      } finally {
                        setIsUploading(false);
                      }
                    }
                  }}
                  className="hidden"
                />

                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                    Image Source (Device Upload or URL) <span className="text-red-600">*</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => modalFileInputRef.current?.click()}
                    className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
                  >
                    <Upload className="w-3 h-3" /> Browse Computer
                  </button>
                </div>

                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    value={mediaUrl}
                    onChange={(e) => setMediaUrl(e.target.value)}
                    placeholder="Paste URL or click Browse Computer..."
                    className="flex-1 px-3 py-2 text-xs border border-stone-300 rounded focus:outline-none font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => modalFileInputRef.current?.click()}
                    className="px-3 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded text-xs font-medium text-stone-700 flex items-center gap-1"
                  >
                    <Upload className="w-3.5 h-3.5" /> Upload File
                  </button>
                </div>
              </div>

              {mediaUrl && (
                <div className="aspect-video rounded border border-stone-300 overflow-hidden bg-stone-100 relative group">
                  <img src={mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setMediaUrl('')}
                    className="absolute top-2 right-2 p-1 bg-red-600 text-white rounded shadow text-xs hover:bg-red-700 transition"
                    title="Clear image"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Photo Credit
                  </label>
                  <input
                    type="text"
                    value={credit}
                    onChange={(e) => setCredit(e.target.value)}
                    placeholder="e.g. Reuters / AFP"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Editorial Caption
                  </label>
                  <input
                    type="text"
                    value={caption}
                    onChange={(e) => setCaption(e.target.value)}
                    placeholder="Description of the scene..."
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:outline-none"
                  />
                </div>
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
                  Save to Media Library
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
