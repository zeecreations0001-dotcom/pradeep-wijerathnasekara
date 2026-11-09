/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { SiteSettings } from '../../types/admin';
import {
  Settings,
  Paintbrush,
  Layout,
  Navigation,
  FileCode,
  Globe,
  Save,
  CheckCircle,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  ExternalLink,
} from 'lucide-react';

interface SiteSettingsTabProps {
  settings: SiteSettings;
  onSaveSettings: (settings: SiteSettings) => void;
}

export const SiteSettingsTab: React.FC<SiteSettingsTabProps> = ({
  settings,
  onSaveSettings,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'general' | 'appearance' | 'layout' | 'nav' | 'footer' | 'seo'>('general');
  const [formData, setFormData] = useState<SiteSettings>(settings);
  const [showSavedFeedback, setShowSavedFeedback] = useState(false);

  // New navigation item state
  const [newNavLabel, setNewNavLabel] = useState('');
  const [newNavUrl, setNewNavUrl] = useState('');

  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSaveSettings(formData);
    setShowSavedFeedback(true);
    setTimeout(() => setShowSavedFeedback(false), 3000);
  };

  // Nav item handlers
  const handleAddNavItem = () => {
    if (!newNavLabel.trim() || !newNavUrl.trim()) return;
    const newItem = {
      id: 'nav-' + Date.now(),
      label: newNavLabel.trim(),
      url: newNavUrl.trim(),
      isExternal: newNavUrl.startsWith('http'),
      order: formData.navigation.length + 1,
      hasMegaMenu: false,
    };
    setFormData({
      ...formData,
      navigation: [...formData.navigation, newItem],
    });
    setNewNavLabel('');
    setNewNavUrl('');
  };

  const handleDeleteNavItem = (id: string) => {
    setFormData({
      ...formData,
      navigation: formData.navigation.filter((n) => n.id !== id),
    });
  };

  const moveNavItem = (index: number, direction: 'up' | 'down') => {
    const list = [...formData.navigation];
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= list.length) return;
    const tmp = list[index];
    list[index] = list[target];
    list[target] = tmp;
    setFormData({
      ...formData,
      navigation: list.map((item, idx) => ({ ...item, order: idx + 1 })),
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Save Actions */}
      <div className="bg-white p-5 rounded-lg border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-stone-900 rounded text-white">
              <Settings className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-serif font-bold text-stone-900 tracking-tight">
              Site Settings & Brand Customization
            </h1>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Configure newspaper masthead, typography font pairings, color themes, navigation menus, and SEO syndication.
          </p>
        </div>

        <button
          type="button"
          onClick={() => handleSave()}
          className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded flex items-center gap-2 shadow-sm transition"
        >
          <Save className="w-4 h-4" /> Save Site Settings
        </button>
      </div>

      {showSavedFeedback && (
        <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-300 rounded flex items-center gap-2 text-xs font-semibold">
          <CheckCircle className="w-4 h-4 text-emerald-600" />
          Settings successfully saved. Reader front-end styling updated immediately!
        </div>
      )}

      {/* Tabs Bar */}
      <div className="bg-white rounded-lg border border-stone-200 shadow-xs overflow-hidden">
        <div className="flex flex-wrap border-b border-stone-200 bg-stone-50 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveSubTab('general')}
            className={`px-4 py-3 flex items-center gap-2 transition ${
              activeSubTab === 'general'
                ? 'bg-white border-b-2 border-red-600 text-red-700 font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Settings className="w-4 h-4" /> General Identity
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('appearance')}
            className={`px-4 py-3 flex items-center gap-2 transition ${
              activeSubTab === 'appearance'
                ? 'bg-white border-b-2 border-red-600 text-red-700 font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Paintbrush className="w-4 h-4" /> Appearance & Typography
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('layout')}
            className={`px-4 py-3 flex items-center gap-2 transition ${
              activeSubTab === 'layout'
                ? 'bg-white border-b-2 border-red-600 text-red-700 font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Layout className="w-4 h-4" /> Homepage Layout
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('nav')}
            className={`px-4 py-3 flex items-center gap-2 transition ${
              activeSubTab === 'nav'
                ? 'bg-white border-b-2 border-red-600 text-red-700 font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Navigation className="w-4 h-4" /> Navigation Menus
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('footer')}
            className={`px-4 py-3 flex items-center gap-2 transition ${
              activeSubTab === 'footer'
                ? 'bg-white border-b-2 border-red-600 text-red-700 font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <FileCode className="w-4 h-4" /> Footer & Legal
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('seo')}
            className={`px-4 py-3 flex items-center gap-2 transition ${
              activeSubTab === 'seo'
                ? 'bg-white border-b-2 border-red-600 text-red-700 font-bold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Globe className="w-4 h-4" /> SEO & Syndication
          </button>
        </div>

        {/* Tab Content Areas */}
        <div className="p-6">
          {/* TAB 1: General */}
          {activeSubTab === 'general' && (
            <div className="max-w-3xl space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Newspaper Masthead Name
                  </label>
                  <input
                    type="text"
                    value={formData.general.newspaperName}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        general: { ...formData.general, newspaperName: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-base font-serif font-bold text-stone-900 border border-stone-300 rounded focus:ring-1 focus:ring-red-600 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Time Zone
                  </label>
                  <input
                    type="text"
                    value={formData.general.timeZone}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        general: { ...formData.general, timeZone: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Tagline / Motto
                </label>
                <input
                  type="text"
                  value={formData.general.tagline}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      general: { ...formData.general, tagline: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs font-serif text-stone-800 border border-stone-300 rounded focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Editorial Contact Email
                  </label>
                  <input
                    type="email"
                    value={formData.general.contactEmail}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        general: { ...formData.general, contactEmail: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Publication Date Display Format
                  </label>
                  <select
                    value={formData.general.dateFormat}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        general: { ...formData.general, dateFormat: e.target.value as any },
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:outline-none"
                  >
                    <option value="standard">Standard: Monday, October 26, 2026</option>
                    <option value="formal">Formal: Monday • 26th October 2026</option>
                    <option value="compact">Compact: 26 Oct 2026</option>
                    <option value="iso">ISO: 2026-10-26</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Headquarters / Newsroom Address
                </label>
                <input
                  type="text"
                  value={formData.general.address}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      general: { ...formData.general, address: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 2: Appearance & Typography */}
          {activeSubTab === 'appearance' && (
            <div className="max-w-3xl space-y-6">
              {/* Color Palette */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-3">
                  Brand Color Swatches
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs text-stone-600 mb-1">Primary Color</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.appearance.primaryColor}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            appearance: { ...formData.appearance, primaryColor: e.target.value },
                          })
                        }
                        className="w-8 h-8 rounded border border-stone-300 cursor-pointer"
                      />
                      <span className="text-xs font-mono">{formData.appearance.primaryColor}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-stone-600 mb-1">Accent Red</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.appearance.accentColor}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            appearance: { ...formData.appearance, accentColor: e.target.value },
                          })
                        }
                        className="w-8 h-8 rounded border border-stone-300 cursor-pointer"
                      />
                      <span className="text-xs font-mono">{formData.appearance.accentColor}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-stone-600 mb-1">Breaking News Alert</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.appearance.breakingRed}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            appearance: { ...formData.appearance, breakingRed: e.target.value },
                          })
                        }
                        className="w-8 h-8 rounded border border-stone-300 cursor-pointer"
                      />
                      <span className="text-xs font-mono">{formData.appearance.breakingRed}</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs text-stone-600 mb-1">Background Tint</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="color"
                        value={formData.appearance.backgroundColor}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            appearance: { ...formData.appearance, backgroundColor: e.target.value },
                          })
                        }
                        className="w-8 h-8 rounded border border-stone-300 cursor-pointer"
                      />
                      <span className="text-xs font-mono">{formData.appearance.backgroundColor}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Typography Pairing */}
              <div className="pt-4 border-t border-stone-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-3">
                  Google Fonts Typography System
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-stone-600 mb-1">
                      Headline Font (Editorial Serif)
                    </label>
                    <select
                      value={formData.appearance.headlineFont}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          appearance: { ...formData.appearance, headlineFont: e.target.value as any },
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded font-serif"
                    >
                      <option value="Playfair Display">Playfair Display (NYT / Traditional Classic)</option>
                      <option value="Merriweather">Merriweather (Sturdy Editorial)</option>
                      <option value="Cinzel">Cinzel (Roman Lapidary)</option>
                      <option value="Georgia">Georgia (Clean Web Classic)</option>
                      <option value="Inter">Inter (Modern Sans Serif)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs text-stone-600 mb-1">
                      Body Copy Font (Reading Comfort)
                    </label>
                    <select
                      value={formData.appearance.bodyFont}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          appearance: { ...formData.appearance, bodyFont: e.target.value as any },
                        })
                      }
                      className="w-full px-3 py-2 text-xs border border-stone-300 rounded"
                    >
                      <option value="Merriweather">Merriweather (Book Serif)</option>
                      <option value="Lora">Lora (Contemporary Calligraphic)</option>
                      <option value="Newsreader">Newsreader (Crafted for Longform)</option>
                      <option value="Inter">Inter (Sans Serif Modern)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Layout Density & Masthead Style */}
              <div className="pt-4 border-t border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-stone-600 mb-1">
                    Masthead Layout Style
                  </label>
                  <select
                    value={formData.appearance.mastheadStyle}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        appearance: { ...formData.appearance, mastheadStyle: e.target.value as any },
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded"
                  >
                    <option value="classic_centered">Centered Classic Newspaper (Engraved)</option>
                    <option value="modern_left">Left-Aligned Contemporary Media</option>
                    <option value="minimal">Minimal Single-Line Header</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs text-stone-600 mb-1">
                    Article Layout Density
                  </label>
                  <select
                    value={formData.appearance.articleDensity}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        appearance: { ...formData.appearance, articleDensity: e.target.value as any },
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded"
                  >
                    <option value="comfortable">Comfortable (Standard)</option>
                    <option value="compact">Compact (High Information Density)</option>
                    <option value="spacious">Spacious (Magazine Style)</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Homepage Layout Toggles */}
          {activeSubTab === 'layout' && (
            <div className="max-w-2xl space-y-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800 mb-2">
                Homepage Section Modules Visibility
              </h3>

              <div className="space-y-3 bg-stone-50 p-4 rounded border border-stone-200">
                {[
                  { key: 'showBreakingTicker', label: 'Breaking News Ticker Bar' },
                  { key: 'showHero', label: 'Above the Fold Hero Package' },
                  { key: 'showDailyFeed', label: 'Daily Feed / Top Dispatches Stream' },
                  { key: 'showOpinion', label: 'Opinion & Editorial Columns' },
                  { key: 'showMostRead', label: 'Most Read Today Widget' },
                  { key: 'showTrending', label: 'Trending Topics Bar' },
                  { key: 'showNewsletterWidget', label: 'Newsletter Signup Widget' },
                  { key: 'showWeatherWidget', label: 'Weather Widget' },
                  { key: 'showMarketsWidget', label: 'Markets / Stock Exchange Bar' },
                ].map(({ key, label }) => (
                  <label key={key} className="flex items-center justify-between cursor-pointer py-1">
                    <span className="text-xs font-medium text-stone-800">{label}</span>
                    <input
                      type="checkbox"
                      checked={(formData.layout as any)[key]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          layout: {
                            ...formData.layout,
                            [key]: e.target.checked,
                          },
                        })
                      }
                      className="rounded text-red-600 focus:ring-red-500 w-4 h-4"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Navigation Menus */}
          {activeSubTab === 'nav' && (
            <div className="max-w-3xl space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-800">
                  Primary Header Menu Items
                </h3>
              </div>

              {/* Add New Nav Item */}
              <div className="flex gap-2 p-3 bg-stone-50 rounded border border-stone-200">
                <input
                  type="text"
                  placeholder="Menu Label (e.g. World)"
                  value={newNavLabel}
                  onChange={(e) => setNewNavLabel(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs border border-stone-300 rounded"
                />
                <input
                  type="text"
                  placeholder="URL target (e.g. #world)"
                  value={newNavUrl}
                  onChange={(e) => setNewNavUrl(e.target.value)}
                  className="flex-1 px-3 py-1.5 text-xs border border-stone-300 rounded font-mono"
                />
                <button
                  type="button"
                  onClick={handleAddNavItem}
                  className="px-4 py-1.5 bg-stone-800 hover:bg-stone-900 text-white text-xs font-semibold rounded flex items-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Link
                </button>
              </div>

              {/* Nav List */}
              <div className="divide-y divide-stone-200 border border-stone-200 rounded overflow-hidden">
                {formData.navigation.map((item, index) => (
                  <div
                    key={item.id}
                    className="p-3 flex items-center justify-between bg-white hover:bg-stone-50 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex flex-col gap-0.5">
                        <button
                          type="button"
                          disabled={index === 0}
                          onClick={() => moveNavItem(index, 'up')}
                          className="p-0.5 text-stone-400 hover:text-stone-700 disabled:opacity-20"
                        >
                          <ArrowUp className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          disabled={index === formData.navigation.length - 1}
                          onClick={() => moveNavItem(index, 'down')}
                          className="p-0.5 text-stone-400 hover:text-stone-700 disabled:opacity-20"
                        >
                          <ArrowDown className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="font-semibold text-stone-900">{item.label}</span>
                      <span className="text-stone-400 font-mono text-[11px]">{item.url}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1 text-[11px] text-stone-600 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.hasMegaMenu}
                          onChange={(e) => {
                            const updated = formData.navigation.map((n) =>
                              n.id === item.id ? { ...n, hasMegaMenu: e.target.checked } : n
                            );
                            setFormData({ ...formData, navigation: updated });
                          }}
                          className="rounded text-red-600"
                        />
                        Mega Menu
                      </label>

                      <button
                        type="button"
                        onClick={() => handleDeleteNavItem(item.id)}
                        className="text-stone-400 hover:text-red-600 p-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: Footer & Legal */}
          {activeSubTab === 'footer' && (
            <div className="max-w-3xl space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  About Column Text
                </label>
                <textarea
                  rows={2}
                  value={formData.footer.aboutText}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      footer: { ...formData.footer, aboutText: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Copyright Notice
                </label>
                <input
                  type="text"
                  value={formData.footer.copyrightText}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      footer: { ...formData.footer, copyrightText: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Company Info / Press Council Registration
                </label>
                <input
                  type="text"
                  value={formData.footer.companyInfo}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      footer: { ...formData.footer, companyInfo: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* TAB 6: SEO & Syndication */}
          {activeSubTab === 'seo' && (
            <div className="max-w-3xl space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Homepage Meta Title
                </label>
                <input
                  type="text"
                  value={formData.seo.metaTitle}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seo: { ...formData.seo, metaTitle: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:outline-none font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  Homepage Meta Description
                </label>
                <textarea
                  rows={2}
                  value={formData.seo.metaDescription}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seo: { ...formData.seo, metaDescription: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Google Analytics Measurement ID
                  </label>
                  <input
                    type="text"
                    value={formData.seo.googleAnalyticsId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seo: { ...formData.seo, googleAnalyticsId: e.target.value },
                      })
                    }
                    placeholder="G-XXXXXXXXXX"
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                    Open Graph Share Image
                  </label>
                  <input
                    type="text"
                    value={formData.seo.ogImageUrl}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seo: { ...formData.seo, ogImageUrl: e.target.value },
                      })
                    }
                    className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <label className="flex items-center gap-2 text-xs font-medium text-stone-700">
                  <input
                    type="checkbox"
                    checked={formData.seo.googleNewsSitemap}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seo: { ...formData.seo, googleNewsSitemap: e.target.checked },
                      })
                    }
                    className="rounded text-red-600"
                  />
                  Google News XML Sitemap
                </label>

                <label className="flex items-center gap-2 text-xs font-medium text-stone-700">
                  <input
                    type="checkbox"
                    checked={formData.seo.rssFeedEnabled}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seo: { ...formData.seo, rssFeedEnabled: e.target.checked },
                      })
                    }
                    className="rounded text-red-600"
                  />
                  RSS 2.0 Syndication Feed
                </label>

                <label className="flex items-center gap-2 text-xs font-medium text-stone-700">
                  <input
                    type="checkbox"
                    checked={formData.seo.enableAmp}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        seo: { ...formData.seo, enableAmp: e.target.checked },
                      })
                    }
                    className="rounded text-red-600"
                  />
                  Accelerated Mobile Pages (AMP)
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                  robots.txt Configuration
                </label>
                <textarea
                  rows={4}
                  value={formData.seo.robotsTxt}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seo: { ...formData.seo, robotsTxt: e.target.value },
                    })
                  }
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded focus:outline-none font-mono bg-stone-50"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
