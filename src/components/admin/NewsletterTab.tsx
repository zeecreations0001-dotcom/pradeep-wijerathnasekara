/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Article, NewsletterSubscriber } from '../../types/admin';
import {
  Send,
  Download,
  Trash2,
  Mail,
  Plus,
  Calendar,
  CheckCircle,
  Eye,
  FileSpreadsheet,
} from 'lucide-react';

interface NewsletterTabProps {
  subscribers: NewsletterSubscriber[];
  articles: Article[];
  onAddSubscriber: (email: string, name?: string) => void;
  onDeleteSubscriber: (id: string) => void;
}

export const NewsletterTab: React.FC<NewsletterTabProps> = ({
  subscribers,
  articles,
  onAddSubscriber,
  onDeleteSubscriber,
}) => {
  // Campaign composer states
  const [subject, setSubject] = useState('The Morning Edition Briefing — Top Dispatches');
  const [previewText, setPreviewText] = useState('Maritime accord treaties, quantum weather simulations, and culture dispatches.');
  const [selectedArticles, setSelectedArticles] = useState<string[]>(
    articles.slice(0, 3).map((a) => a.id)
  );
  const [customEditorialNote, setCustomEditorialNote] = useState(
    'Good morning. Today our foreign bureau unpacks the landmark Indian Ocean shipping pact and its broader impact on consumer trade routes.'
  );
  const [scheduledSendDate, setScheduledSendDate] = useState('');
  const [sentFeedback, setSentFeedback] = useState(false);

  // New subscriber modal / input
  const [newEmail, setNewEmail] = useState('');
  const [newName, setNewName] = useState('');

  // Toggle article in newsletter
  const toggleArticleInNewsletter = (id: string) => {
    if (selectedArticles.includes(id)) {
      setSelectedArticles(selectedArticles.filter((artId) => artId !== id));
    } else {
      setSelectedArticles([...selectedArticles, id]);
    }
  };

  // CSV export
  const handleExportCsv = () => {
    const headers = 'ID,Email,Name,SubscribedAt,Status\n';
    const rows = subscribers
      .map(
        (s) =>
          `"${s.id}","${s.email}","${s.name || ''}","${s.subscribedAt}","${s.status}"`
      )
      .join('\n');
    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `newsletter_subscribers_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSendCampaign = () => {
    setSentFeedback(true);
    setTimeout(() => setSentFeedback(false), 4000);
  };

  const handleAddManualSubscriber = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    onAddSubscriber(newEmail.trim(), newName.trim() || undefined);
    setNewEmail('');
    setNewName('');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-stone-900 rounded text-white">
              <Mail className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-serif font-bold text-stone-900 tracking-tight">
              Newsletter & Reader Subscriptions
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Build morning news briefings, broadcast digests to {subscribers.length} subscribers, and export mailing lists.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCsv}
          className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded flex items-center gap-1.5 border border-stone-300 transition"
        >
          <FileSpreadsheet className="w-4 h-4 text-emerald-700" /> Export CSV List
        </button>
      </div>

      {sentFeedback && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded flex items-center gap-2 text-xs font-semibold">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          Newsletter broadcast scheduled and queued for dispatch to {subscribers.length} subscribers!
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Newsletter Campaign Composer (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-lg border border-stone-200 shadow-xs p-5 space-y-4">
          <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-800">
              Morning Briefing Broadcast Composer
            </h2>
            <span className="text-[11px] text-stone-500 font-mono">
              Audience: {subscribers.length} Confirmed Readers
            </span>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Email Subject Line
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 text-sm font-serif font-bold text-stone-900 border border-stone-300 rounded focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Preview Snippet (Preheader)
            </label>
            <input
              type="text"
              value={previewText}
              onChange={(e) => setPreviewText(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Editor's Opening Note
            </label>
            <textarea
              rows={3}
              value={customEditorialNote}
              onChange={(e) => setCustomEditorialNote(e.target.value)}
              className="w-full px-3 py-2 text-xs font-serif border border-stone-300 rounded focus:outline-none leading-relaxed"
            />
          </div>

          {/* Curate Articles for Newsletter */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
              Pick Stories for Digest ({selectedArticles.length} chosen)
            </label>
            <div className="max-h-56 overflow-y-auto border border-stone-200 rounded p-2 divide-y divide-stone-100 bg-stone-50">
              {articles.map((art) => (
                <label
                  key={art.id}
                  className="flex items-center gap-2 py-1.5 px-2 hover:bg-stone-100 rounded cursor-pointer text-xs"
                >
                  <input
                    type="checkbox"
                    checked={selectedArticles.includes(art.id)}
                    onChange={() => toggleArticleInNewsletter(art.id)}
                    className="rounded text-red-600 focus:ring-red-500"
                  />
                  <span className="font-serif font-semibold text-stone-900 truncate flex-1">
                    {art.headline}
                  </span>
                  <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-stone-200 rounded">
                    {art.sectionId}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Schedule & Send Buttons */}
          <div className="pt-3 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-stone-400" />
              <input
                type="datetime-local"
                value={scheduledSendDate}
                onChange={(e) => setScheduledSendDate(e.target.value)}
                className="px-2 py-1 text-xs border border-stone-300 rounded focus:outline-none"
              />
            </div>

            <button
              type="button"
              onClick={handleSendCampaign}
              className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded flex items-center justify-center gap-2 shadow-sm transition"
            >
              <Send className="w-4 h-4" />
              {scheduledSendDate ? 'Schedule Dispatch' : 'Send Broadcast Now'}
            </button>
          </div>
        </div>

        {/* Subscribers List (1 col) */}
        <div className="bg-white rounded-lg border border-stone-200 shadow-xs p-5 space-y-4 flex flex-col justify-between">
          <div>
            <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
              <h2 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                Subscribers Directory ({subscribers.length})
              </h2>
            </div>

            {/* Manual add subscriber */}
            <form onSubmit={handleAddManualSubscriber} className="space-y-2 pt-3">
              <input
                type="text"
                placeholder="Subscriber Name (Optional)"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs border border-stone-300 rounded"
              />
              <div className="flex gap-1.5">
                <input
                  type="email"
                  required
                  placeholder="reader@email.com"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 text-xs border border-stone-300 rounded font-mono"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold rounded flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add
                </button>
              </div>
            </form>

            {/* List */}
            <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto mt-3">
              {subscribers.map((sub) => (
                <div key={sub.id} className="py-2 flex items-center justify-between gap-2 text-xs">
                  <div>
                    <div className="font-semibold text-stone-900 font-mono text-[11px] truncate">
                      {sub.email}
                    </div>
                    {sub.name && (
                      <div className="text-[10px] text-stone-500">{sub.name}</div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => onDeleteSubscriber(sub.id)}
                    className="text-stone-400 hover:text-red-600 p-1"
                    title="Remove Subscriber"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
