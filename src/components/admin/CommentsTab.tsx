/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Article, Comment } from '../../types/admin';
import {
  MessageSquare,
  Check,
  X,
  AlertTriangle,
  Trash2,
  ShieldBan,
  Filter,
  CheckCircle,
} from 'lucide-react';

interface CommentsTabProps {
  comments: Comment[];
  articles: Article[];
  onUpdateCommentStatus: (id: string, status: Comment['status']) => void;
  onDeleteComment: (id: string) => void;
  onToggleArticleComments: (articleId: string, enabled: boolean) => void;
}

export const CommentsTab: React.FC<CommentsTabProps> = ({
  comments,
  articles,
  onUpdateCommentStatus,
  onDeleteComment,
  onToggleArticleComments,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'spam' | 'reported'>('pending');

  const filteredComments = comments.filter((c) => {
    if (filter === 'all') return true;
    if (filter === 'reported') return c.reported;
    return c.status === filter;
  });

  const pendingCount = comments.filter((c) => c.status === 'pending').length;
  const reportedCount = comments.filter((c) => c.reported).length;

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-stone-900 rounded text-white">
              <MessageSquare className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-serif font-bold text-stone-900 tracking-tight">
              Reader Discourse & Comment Moderation
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Review reader submissions, prevent hate speech and spam, and toggle article-level discussion threads.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex flex-wrap items-center gap-1.5 bg-stone-100 p-1 rounded border border-stone-300 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded transition ${
              filter === 'pending' ? 'bg-amber-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Pending Queue ({pendingCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('approved')}
            className={`px-3 py-1.5 rounded transition ${
              filter === 'approved' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Approved ({comments.filter((c) => c.status === 'approved').length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('reported')}
            className={`px-3 py-1.5 rounded transition ${
              filter === 'reported' ? 'bg-red-600 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Flagged / Reported ({reportedCount})
          </button>
          <button
            type="button"
            onClick={() => setFilter('spam')}
            className={`px-3 py-1.5 rounded transition ${
              filter === 'spam' ? 'bg-stone-800 text-white shadow-xs' : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Spam ({comments.filter((c) => c.status === 'spam').length})
          </button>
        </div>
      </div>

      {/* Moderation Queue */}
      <div className="bg-white rounded-lg border border-stone-200 shadow-xs overflow-hidden">
        <div className="divide-y divide-stone-200">
          {filteredComments.length === 0 ? (
            <div className="py-12 text-center text-stone-400 font-serif text-xs">
              No comments in "{filter}" queue.
            </div>
          ) : (
            filteredComments.map((comment) => {
              const article = articles.find((a) => a.id === comment.articleId);

              return (
                <div key={comment.id} className="p-4 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:bg-stone-50 transition">
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs text-stone-900">{comment.name}</span>
                      <span className="text-[11px] font-mono text-stone-400">({comment.email})</span>
                      <span className="text-[10px] text-stone-400 font-mono">• {new Date(comment.createdAt).toLocaleString()}</span>

                      {comment.reported && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-800 border border-red-300 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-red-600" />
                          Reported ({comment.reportCount || 1} flags)
                        </span>
                      )}

                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          comment.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : comment.status === 'spam'
                            ? 'bg-stone-200 text-stone-700'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {comment.status}
                      </span>
                    </div>

                    <p className="text-xs text-stone-800 font-serif leading-relaxed bg-stone-50/60 p-2.5 rounded border border-stone-200">
                      "{comment.body}"
                    </p>

                    {article && (
                      <div className="text-[11px] text-stone-500 flex items-center gap-2 pt-0.5">
                        <span>On dispatch: <strong className="text-stone-800 font-serif">{article.headline}</strong></span>
                        <span>•</span>
                        <button
                          type="button"
                          onClick={() => onToggleArticleComments(article.id, !article.commentsEnabled)}
                          className="text-[10px] text-red-700 hover:underline"
                        >
                          {article.commentsEnabled ? 'Turn Off Comments for Article' : 'Turn On Comments'}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Moderation Actions */}
                  <div className="flex items-center gap-1.5 self-end md:self-center">
                    {comment.status !== 'approved' && (
                      <button
                        type="button"
                        onClick={() => onUpdateCommentStatus(comment.id, 'approved')}
                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold flex items-center gap-1"
                        title="Approve Comment"
                      >
                        <Check className="w-3.5 h-3.5" /> Approve
                      </button>
                    )}

                    {comment.status !== 'spam' && (
                      <button
                        type="button"
                        onClick={() => onUpdateCommentStatus(comment.id, 'spam')}
                        className="px-2.5 py-1 bg-stone-700 hover:bg-stone-800 text-white rounded text-xs font-semibold flex items-center gap-1"
                        title="Mark as Spam"
                      >
                        <ShieldBan className="w-3.5 h-3.5" /> Spam
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm('Delete comment permanently?')) {
                          onDeleteComment(comment.id);
                        }
                      }}
                      className="p-1.5 text-stone-400 hover:text-red-600 rounded hover:bg-red-50"
                      title="Delete Comment"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
