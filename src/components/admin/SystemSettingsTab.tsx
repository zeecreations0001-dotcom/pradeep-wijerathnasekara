/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ActivityLog } from '../../types/admin';
import {
  Database,
  Download,
  Upload,
  RotateCcw,
  Key,
  Shield,
  Clock,
  CheckCircle,
  AlertTriangle,
  Copy,
} from 'lucide-react';

interface SystemSettingsTabProps {
  activityLogs: ActivityLog[];
  onExportJson: () => string;
  onImportJson: (json: string) => boolean;
  onResetDemo: () => void;
}

export const SystemSettingsTab: React.FC<SystemSettingsTabProps> = ({
  activityLogs,
  onExportJson,
  onImportJson,
  onResetDemo,
}) => {
  const [importJsonText, setImportJsonText] = useState('');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);

  // Demo API Key state
  const [apiKeys, setApiKeys] = useState([
    { id: 'key-1', name: 'iOS & Android Mobile App Key', key: 'np_live_49f82bc719001bfa', createdAt: '2025-01-10' },
    { id: 'key-2', name: 'RSS News Syndication Webhook', key: 'np_hook_88aa31c0021e78cc', createdAt: '2025-03-22' },
  ]);
  const [newKeyName, setNewKeyName] = useState('');
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  const handleDownloadBackup = () => {
    const json = onExportJson();
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `newspaper_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    setFeedback('Full newsroom backup downloaded successfully.');
    setTimeout(() => setFeedback(null), 3000);
  };

  const handleImportBackup = () => {
    if (!importJsonText.trim()) return;
    const success = onImportJson(importJsonText);
    if (success) {
      setFeedback('Backup successfully restored into newsroom database!');
      setErrorFeedback(null);
      setImportJsonText('');
    } else {
      setErrorFeedback('Failed to parse and import JSON. Please verify JSON format.');
    }
    setTimeout(() => {
      setFeedback(null);
      setErrorFeedback(null);
    }, 4000);
  };

  const handleCreateApiKey = () => {
    if (!newKeyName.trim()) return;
    const randomHex = Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    const newEntry = {
      id: 'key-' + Date.now(),
      name: newKeyName.trim(),
      key: `np_live_${randomHex}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setApiKeys([...apiKeys, newEntry]);
    setNewKeyName('');
  };

  const handleDeleteApiKey = (id: string) => {
    setApiKeys(apiKeys.filter((k) => k.id !== id));
  };

  const handleCopyKey = (id: string, key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-stone-900 rounded text-white">
              <Database className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-serif font-bold text-stone-900 tracking-tight">
              System Maintenance & Data Continuity
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Database JSON backup and restore, mobile client API credentials, and immutable newsroom audit logging.
          </p>
        </div>

        <button
          type="button"
          onClick={handleDownloadBackup}
          className="px-4 py-2 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded flex items-center gap-1.5 transition"
        >
          <Download className="w-4 h-4" /> Download Backup (JSON)
        </button>
      </div>

      {feedback && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded flex items-center gap-2 text-xs font-semibold">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          {feedback}
        </div>
      )}

      {errorFeedback && (
        <div className="p-3 bg-red-50 text-red-800 border border-red-300 rounded flex items-center gap-2 text-xs font-semibold">
          <AlertTriangle className="w-4 h-4 text-red-600" />
          {errorFeedback}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Backup & Restore Panel */}
        <div className="bg-white rounded-lg border border-stone-200 shadow-xs p-5 space-y-4">
          <div className="border-b border-stone-200 pb-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-800">
              Restore Newsroom Database
            </h2>
            <p className="text-[11px] text-stone-500">
              Paste exported JSON schema here to restore articles, editions, breaking items, and staff.
            </p>
          </div>

          <textarea
            rows={6}
            placeholder="Paste raw backup JSON text here..."
            value={importJsonText}
            onChange={(e) => setImportJsonText(e.target.value)}
            className="w-full px-3 py-2 text-xs font-mono bg-stone-50 border border-stone-300 rounded focus:outline-none"
          />

          <div className="flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleImportBackup}
              disabled={!importJsonText.trim()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded flex items-center gap-1.5 disabled:opacity-40 transition"
            >
              <Upload className="w-4 h-4" /> Import & Overwrite
            </button>

            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset the entire newsroom database back to fresh default demo dispatches and staff?')) {
                  onResetDemo();
                }
              }}
              className="px-3 py-1.5 text-xs text-stone-500 hover:text-red-700 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset to Demo Data
            </button>
          </div>
        </div>

        {/* API Credentials Management */}
        <div className="bg-white rounded-lg border border-stone-200 shadow-xs p-5 space-y-4">
          <div className="border-b border-stone-200 pb-3 flex items-center justify-between">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-800">
              API Keys (Mobile Apps & Webhooks)
            </h2>
          </div>

          {/* Add API key */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Application Name (e.g. Android App)"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              className="flex-1 px-3 py-1.5 text-xs border border-stone-300 rounded"
            />
            <button
              type="button"
              onClick={handleCreateApiKey}
              className="px-3.5 py-1.5 bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold rounded flex items-center gap-1"
            >
              <Key className="w-3.5 h-3.5" /> Generate
            </button>
          </div>

          {/* List of keys */}
          <div className="divide-y divide-stone-100 max-h-52 overflow-y-auto">
            {apiKeys.map((k) => (
              <div key={k.id} className="py-2.5 flex items-center justify-between text-xs">
                <div>
                  <div className="font-semibold text-stone-900">{k.name}</div>
                  <div className="text-[11px] font-mono text-stone-500 mt-0.5">{k.key}</div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyKey(k.id, k.key)}
                    className="p-1 text-stone-500 hover:text-stone-900"
                    title="Copy Key"
                  >
                    {copiedKeyId === k.id ? (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteApiKey(k.id)}
                    className="p-1 text-stone-400 hover:text-red-600"
                    title="Revoke Key"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Full Newsroom Audit Log */}
      <div className="bg-white rounded-lg border border-stone-200 shadow-xs overflow-hidden">
        <div className="px-5 py-3.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-stone-600" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-800">
              Newsroom Integrity Audit Log
            </h2>
          </div>
          <span className="text-[11px] text-stone-500 font-mono">
            {activityLogs.length} Timestamped Events
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-100/70 text-[10px] uppercase font-bold text-stone-600 tracking-wider border-b border-stone-200">
                <th className="py-2.5 px-4">Timestamp</th>
                <th className="py-2.5 px-3">Journalist / Staff</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Action</th>
                <th className="py-2.5 px-3">Target Entity</th>
                <th className="py-2.5 px-4">Event Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {activityLogs.slice(0, 15).map((log) => (
                <tr key={log.id} className="hover:bg-stone-50">
                  <td className="py-2 px-4 font-mono text-[11px] text-stone-500 whitespace-nowrap">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="py-2 px-3 font-semibold text-stone-900">{log.userName}</td>
                  <td className="py-2 px-3 font-mono text-[10px] uppercase text-stone-500">
                    {log.userRole}
                  </td>
                  <td className="py-2 px-3">
                    <span className="px-1.5 py-0.5 rounded font-mono text-[10px] uppercase bg-stone-100 font-semibold text-stone-800">
                      {log.action}
                    </span>
                  </td>
                  <td className="py-2 px-3 font-serif font-medium text-stone-800 truncate max-w-xs">
                    {log.targetTitle || log.targetId}
                  </td>
                  <td className="py-2 px-4 text-stone-600 text-[11px] truncate max-w-sm">
                    {log.details || '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
