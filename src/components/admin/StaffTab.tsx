/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Article, Section, StaffMember, StaffRole, ReaderUser } from '../../types/admin';
import { NewsroomStore } from '../../services/adminStore';
import { imageService } from '../../services/imageService';
import {
  Users,
  Plus,
  Trash2,
  Edit3,
  Mail,
  Shield,
  CheckCircle,
  XCircle,
  FileText,
  UserCheck,
  ExternalLink,
  Bookmark,
  Upload,
  Lock,
  Search,
} from 'lucide-react';

interface StaffTabProps {
  staffList: StaffMember[];
  articles: Article[];
  sections: Section[];
  currentUser: StaffMember | null;
  onSaveStaff: (member: StaffMember) => void;
  onDeleteStaff: (id: string) => void;
  onSwitchUser: (member: StaffMember) => void;
}

export const StaffTab: React.FC<StaffTabProps> = ({
  staffList,
  articles,
  sections,
  currentUser,
  onSaveStaff,
  onDeleteStaff,
  onSwitchUser,
}) => {
  const [subTab, setSubTab] = useState<'staff' | 'readers'>('staff');
  const [readersList, setReadersList] = useState<ReaderUser[]>(NewsroomStore.getReaderUsers());
  const [readerSearch, setReaderSearch] = useState('');

  // Staff modal states
  const [isStaffModalOpen, setIsStaffModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null);

  // Filter / view by reporter
  const [selectedStaffArticles, setSelectedStaffArticles] = useState<StaffMember | null>(null);

  // Staff Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<StaffRole>('reporter');
  const [bio, setBio] = useState('');
  const [headshot, setHeadshot] = useState('');
  const [assignedSections, setAssignedSections] = useState<string[]>([]);
  const [twitter, setTwitter] = useState('');
  const [active, setActive] = useState(true);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);

  // Reader modal states
  const [isReaderModalOpen, setIsReaderModalOpen] = useState(false);
  const [newReaderName, setNewReaderName] = useState('');
  const [newReaderEmail, setNewReaderEmail] = useState('');
  const [newReaderPassword, setNewReaderPassword] = useState('');

  const refreshReaders = () => {
    setReadersList(NewsroomStore.getReaderUsers());
  };

  const handleOpenNewStaff = () => {
    setEditingStaff(null);
    setName('');
    setEmail('');
    setPassword('herald2025');
    setRole('reporter');
    setBio('');
    setHeadshot('https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400');
    setAssignedSections(['world']);
    setTwitter('');
    setActive(true);
    setIsStaffModalOpen(true);
  };

  const handleOpenEditStaff = (staff: StaffMember) => {
    setEditingStaff(staff);
    setName(staff.name);
    setEmail(staff.email);
    setPassword(staff.password || '••••••••');
    setRole(staff.role);
    setBio(staff.bio);
    setHeadshot(staff.headshot);
    setAssignedSections(staff.sections || []);
    setTwitter(staff.socialLinks?.twitter || '');
    setActive(staff.active);
    setIsStaffModalOpen(true);
  };

  const toggleSection = (secId: string) => {
    if (assignedSections.includes(secId)) {
      setAssignedSections(assignedSections.filter((id) => id !== secId));
    } else {
      setAssignedSections([...assignedSections, secId]);
    }
  };

  const handleSaveStaffForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    const finalStaff: StaffMember = {
      id: editingStaff?.id || 'staff-' + Date.now(),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      bio: bio.trim(),
      headshot: headshot.trim() || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
      sections: assignedSections,
      socialLinks: {
        twitter: twitter.trim() || undefined,
      },
      password: password.trim() || undefined,
      active,
      createdAt: editingStaff?.createdAt || new Date().toISOString(),
    };

    onSaveStaff(finalStaff);
    setIsStaffModalOpen(false);
  };

  const handleUploadPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploadingPhoto(true);
    try {
      const res = await imageService.uploadImage(file, 'staff_headshot');
      setHeadshot(res.url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleCreateReader = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReaderName.trim() || !newReaderEmail.trim()) return;

    NewsroomStore.registerReader({
      name: newReaderName.trim(),
      email: newReaderEmail.trim(),
      password: newReaderPassword.trim() || 'readerpass',
    });

    setNewReaderName('');
    setNewReaderEmail('');
    setNewReaderPassword('');
    setIsReaderModalOpen(false);
    refreshReaders();
  };

  const handleDeleteReader = (id: string) => {
    if (confirm('Are you sure you want to delete this reader account?')) {
      NewsroomStore.deleteReaderUser(id);
      refreshReaders();
    }
  };

  const getRoleBadge = (r: StaffRole) => {
    switch (r) {
      case 'super_admin':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-800 border border-red-300">Super Admin</span>;
      case 'editor':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800 border border-blue-300">Managing Editor</span>;
      case 'reporter':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300">Staff Reporter</span>;
      case 'contributor':
        return <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 border border-stone-300">Contributor</span>;
    }
  };

  const filteredReaders = readersList.filter(
    (r) =>
      r.name.toLowerCase().includes(readerSearch.toLowerCase()) ||
      r.email.toLowerCase().includes(readerSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-stone-900 rounded text-white">
              <Users className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-serif font-bold text-stone-900 tracking-tight">
              Newsroom Staff & User Accounts Management
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Manage journalists, section editors, bylines, access levels (RBAC), credentials, and registered newspaper readers.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {subTab === 'staff' ? (
            <button
              type="button"
              onClick={handleOpenNewStaff}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Staff Member
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setIsReaderModalOpen(true)}
              className="px-4 py-2 bg-stone-900 hover:bg-black text-[#facc15] text-xs font-semibold rounded flex items-center gap-1.5 shadow-sm transition cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Reader Account
            </button>
          )}
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex border-b border-stone-200 gap-6 text-sm font-semibold">
        <button
          type="button"
          onClick={() => setSubTab('staff')}
          className={`pb-2.5 flex items-center gap-2 transition cursor-pointer ${
            subTab === 'staff'
              ? 'text-red-700 border-b-2 border-red-600 font-bold'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>Editorial Staff & Journalists ({staffList.length})</span>
        </button>
        <button
          type="button"
          onClick={() => setSubTab('readers')}
          className={`pb-2.5 flex items-center gap-2 transition cursor-pointer ${
            subTab === 'readers'
              ? 'text-red-700 border-b-2 border-red-600 font-bold'
              : 'text-stone-500 hover:text-stone-900'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Registered Reader Accounts ({readersList.length})</span>
        </button>
      </div>

      {/* VIEW 1: STAFF LIST */}
      {subTab === 'staff' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {staffList.map((staff) => {
            const reporterArticles = articles.filter((a) => a.reporterId === staff.id);
            const isCurrentLoggedIn = currentUser?.id === staff.id;

            return (
              <div
                key={staff.id}
                className={`bg-white rounded-lg border p-4 shadow-xs flex flex-col justify-between space-y-4 transition hover:shadow-md ${
                  !staff.active
                    ? 'opacity-60 border-stone-300'
                    : isCurrentLoggedIn
                    ? 'border-red-600 ring-1 ring-red-600'
                    : 'border-stone-200'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <img
                      src={staff.headshot}
                      alt={staff.name}
                      className="w-14 h-14 rounded-full object-cover border border-stone-200 shadow-xs"
                    />
                    <div className="flex flex-col items-end gap-1">
                      {getRoleBadge(staff.role)}
                      {isCurrentLoggedIn && (
                        <span className="text-[10px] text-red-600 font-bold uppercase tracking-wider">
                          • You (Active)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3">
                    <h3 className="text-base font-serif font-bold text-stone-900">
                      {staff.name}
                    </h3>
                    <div className="text-xs text-stone-500 font-mono flex items-center gap-1 mt-0.5">
                      <Mail className="w-3 h-3 text-stone-400" />
                      {staff.email}
                    </div>
                    <p className="text-xs text-stone-600 line-clamp-2 mt-2">
                      {staff.bio || 'Newsroom staff correspondent.'}
                    </p>
                  </div>

                  {/* Desk tags */}
                  <div className="mt-3 flex flex-wrap gap-1">
                    {staff.sections?.map((sec) => (
                      <span
                        key={sec}
                        className="text-[10px] uppercase font-mono px-1.5 py-0.5 bg-stone-100 text-stone-700 rounded border border-stone-200"
                      >
                        {sec}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Stats & Actions */}
                <div className="pt-3 border-t border-stone-100 space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-600">
                    <button
                      type="button"
                      onClick={() => setSelectedStaffArticles(staff)}
                      className="font-medium hover:text-red-700 flex items-center gap-1 cursor-pointer"
                    >
                      <FileText className="w-3.5 h-3.5 text-stone-400" />
                      <span>{reporterArticles.length} stories</span>
                    </button>
                    <span className="text-[10px] text-stone-400 font-mono">
                      {new Date(staff.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    {!isCurrentLoggedIn && (
                      <button
                        type="button"
                        onClick={() => onSwitchUser(staff)}
                        className="text-[11px] font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 px-2.5 py-1 rounded transition cursor-pointer flex items-center gap-1"
                        title="Simulate working as this user"
                      >
                        <UserCheck className="w-3 h-3 text-stone-500" />
                        <span>Switch</span>
                      </button>
                    )}

                    <div className="flex items-center gap-1 ml-auto">
                      <button
                        type="button"
                        onClick={() => handleOpenEditStaff(staff)}
                        className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded transition cursor-pointer"
                        title="Edit credentials & permissions"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>

                      {staff.id !== currentUser?.id && (
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm(`Remove staff member ${staff.name}?`)) {
                              onDeleteStaff(staff.id);
                            }
                          }}
                          className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                          title="Remove staff member"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 2: REGISTERED READER ACCOUNTS */}
      {subTab === 'readers' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-lg border border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search reader name or email..."
                value={readerSearch}
                onChange={(e) => setReaderSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs border border-stone-300 rounded focus:outline-none focus:ring-1 focus:ring-stone-800"
              />
            </div>
            <span className="text-xs text-stone-500">
              Showing {filteredReaders.length} of {readersList.length} readers
            </span>
          </div>

          <div className="bg-white rounded-lg border border-stone-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs text-stone-700">
              <thead className="bg-stone-100 border-b border-stone-200 font-semibold text-stone-800 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Reader Profile</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Saved Bookmarks</th>
                  <th className="py-3 px-4">Registered Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {filteredReaders.map((reader) => (
                  <tr key={reader.id} className="hover:bg-stone-50 transition">
                    <td className="py-3 px-4 flex items-center gap-2.5">
                      <img
                        src={reader.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200'}
                        alt=""
                        className="w-8 h-8 rounded-full object-cover border border-stone-200"
                      />
                      <div>
                        <div className="font-semibold text-stone-900">{reader.name}</div>
                        <div className="text-[10px] text-stone-400 font-mono">Reader Account</div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-stone-600">{reader.email}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 bg-amber-100 text-amber-900 rounded font-bold font-mono text-[10px]">
                        {reader.bookmarks?.length || 0} stories saved
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-stone-500">
                      {new Date(reader.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleDeleteReader(reader.id)}
                        className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                        title="Delete Reader Account"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredReaders.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-stone-400 italic">
                      No reader accounts found matching search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODAL: Create / Edit Staff */}
      {isStaffModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-xl border border-stone-300 w-full max-w-lg overflow-hidden">
            <div className="px-5 py-4 bg-stone-900 text-white flex items-center justify-between">
              <h2 className="font-serif font-bold text-base flex items-center gap-2">
                <Users className="w-4 h-4 text-red-500" />
                {editingStaff ? 'Edit Staff Credentials' : 'Add Newsroom Staff'}
              </h2>
              <button
                type="button"
                onClick={() => setIsStaffModalOpen(false)}
                className="text-stone-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveStaffForm} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sofia Al-Mansoor"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Email Address <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="reporter@herald.org"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded font-mono focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Set login password"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Access Role (RBAC)
                  </label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value as StaffRole)}
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:outline-none capitalize"
                  >
                    <option value="super_admin">Super Admin (Full Control)</option>
                    <option value="editor">Managing Editor (Publish & Layout)</option>
                    <option value="reporter">Staff Reporter (Create & Review)</option>
                    <option value="contributor">Contributor (Draft Only)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Twitter / X Handle
                  </label>
                  <input
                    type="text"
                    value={twitter}
                    onChange={(e) => setTwitter(e.target.value)}
                    placeholder="@presshandle"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Headshot Photo
                  </label>
                  <div className="flex items-center gap-2">
                    <img
                      src={headshot || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'}
                      alt=""
                      className="w-8 h-8 rounded-full object-cover border border-stone-300 shrink-0"
                    />
                    <label className="flex-1 py-1.5 px-2 bg-stone-100 hover:bg-stone-200 border border-stone-300 rounded text-[11px] font-semibold text-stone-700 flex items-center justify-center gap-1 cursor-pointer transition">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{isUploadingPhoto ? 'Uploading...' : 'Upload Image'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleUploadPhoto}
                      />
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Journalist Bio / Byline Credits
                </label>
                <textarea
                  rows={2}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Senior investigative correspondent covering geopolitics..."
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Assigned Desks
                </label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {sections.map((sec) => (
                    <label key={sec.id} className="flex items-center gap-1 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={assignedSections.includes(sec.id)}
                        onChange={() => toggleSection(sec.id)}
                        className="rounded text-red-600"
                      />
                      <span>{sec.name}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-stone-200">
                <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-stone-800">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={(e) => setActive(e.target.checked)}
                    className="rounded text-red-600 focus:ring-red-500"
                  />
                  Active staff member (Allow newsroom dashboard login)
                </label>
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsStaffModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded shadow-sm cursor-pointer"
                >
                  Save Staff Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Create Reader Account */}
      {isReaderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-lg shadow-xl border border-stone-300 w-full max-w-md overflow-hidden">
            <div className="px-5 py-4 bg-stone-900 text-white flex items-center justify-between">
              <h2 className="font-serif font-bold text-base flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-[#facc15]" />
                Create Reader Account
              </h2>
              <button
                type="button"
                onClick={() => setIsReaderModalOpen(false)}
                className="text-stone-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateReader} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newReaderName}
                  onChange={(e) => setNewReaderName(e.target.value)}
                  placeholder="e.g. Kasun Bandara"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={newReaderEmail}
                  onChange={(e) => setNewReaderEmail(e.target.value)}
                  placeholder="reader@press.lk"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded font-mono focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  value={newReaderPassword}
                  onChange={(e) => setNewReaderPassword(e.target.value)}
                  placeholder="Create reader password"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:outline-none"
                />
              </div>

              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsReaderModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold rounded cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 hover:bg-black text-[#facc15] text-xs font-semibold rounded shadow-sm cursor-pointer"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
