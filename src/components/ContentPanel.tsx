'use client';

import { Site } from '@/types';
import { ExternalLink, Edit, Trash2, Plus, Globe, Calendar, Tag, Link2, Eye } from 'lucide-react';

interface ContentPanelProps {
  sites: Site[];
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  selectedItem: string | null;
  onEditSite: (site: Site) => void;
  onDeleteSite: (id: string) => void;
  onAddSite: () => void;
  onSiteSelect: (site: Site) => void;
  searchQuery?: string;
  selectedTags?: string[];
}

export default function ContentPanel({
  sites,
  selectedCategory,
  selectedSubcategory,
  selectedItem,
  onEditSite,
  onDeleteSite,
  onAddSite,
  onSiteSelect,
  searchQuery = '',
  selectedTags = []
}: ContentPanelProps) {
  const filteredSites = sites.filter(site => {
    // Category filter
    if (selectedCategory && site.categoryId !== selectedCategory) return false;
    if (selectedSubcategory && site.subcategoryId !== selectedSubcategory) return false;
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = site.name.toLowerCase().includes(query);
      const matchesUrl = site.url.toLowerCase().includes(query);
      const matchesDescription = site.description?.toLowerCase().includes(query);
      const matchesTags = site.tags?.some(tag => tag.toLowerCase().includes(query));
      if (!matchesName && !matchesUrl && !matchesDescription && !matchesTags) return false;
    }
    
    // Tag filter
    if (selectedTags.length > 0) {
      const siteTags = site.tags || [];
      const hasMatchingTag = selectedTags.some(tag => siteTags.includes(tag));
      if (!hasMatchingTag) return false;
    }
    
    return true;
  });

  const openUrl = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (!selectedCategory) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/50 to-indigo-50/30 dark:from-slate-900 dark:via-slate-900/80 dark:to-indigo-950/20 min-h-screen">
        <div className="glass-effect p-12 rounded-3xl shadow-professional max-w-lg mx-auto text-center transform hover:scale-105 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg animate-pulse">
            <Globe className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent mb-4">
            Site Manager
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
            Soldan bir kategori seçerek başlayın. Sitelerinizi düzenli bir şekilde organize edin.
          </p>
          <button
            onClick={onAddSite}
            className="group relative flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-semibold"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            Site Ekle
            <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/10 dark:from-slate-900 dark:via-slate-900/90 dark:to-indigo-950/10 overflow-y-auto custom-scrollbar">
      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
              {selectedItem ? 'Siteler' : selectedSubcategory ? 'Alt Kategoriler' : 'Kategoriler'}
            </h1>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full animate-pulse"></div>
              <p className="text-slate-600 dark:text-slate-400 font-medium">
                {filteredSites.length} site listeleniyor
              </p>
            </div>
          </div>
          <button
            onClick={onAddSite}
            className="group relative flex items-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-semibold"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            Site Ekle
            <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>

        {filteredSites.length === 0 ? (
          <div className="text-center py-20">
            <div className="glass-effect p-12 rounded-3xl shadow-professional max-w-md mx-auto transform hover:scale-105 transition-all duration-500">
              <div className="bg-gradient-to-br from-slate-400 to-slate-600 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Globe className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">
                Henüz site eklenmemiş
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
                Bu kategoriye ilk sitenizi ekleyerek başlayın
              </p>
              <button
                onClick={onAddSite}
                className="group relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 font-semibold"
              >
                İlk Siteyi Ekle
                <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-1">
            {/* Group sites into rows of 5 */}
            {Array.from({ length: Math.ceil(filteredSites.length / 5) }, (_, rowIndex) => {
              const startIndex = rowIndex * 5;
              const rowSites = filteredSites.slice(startIndex, startIndex + 5);
              
              return (
                <div key={rowIndex} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
                  {rowSites.map((site) => {
                    const isOverdue = site.nextCheck && new Date(site.nextCheck) < new Date();
                    
                    return (
                      <button
                        key={site.id}
                        onClick={() => onSiteSelect(site)}
                        className="group relative bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 p-3 hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-200 text-left"
                      >
                        <div className="flex items-center gap-3">
                          {/* Favicon */}
                          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-sm flex-shrink-0">
                            {site.favicon ? (
                              <img src={site.favicon} alt="" className="w-5 h-5 rounded object-contain" />
                            ) : (
                              <span className="text-white font-bold text-sm">
                                {site.name.charAt(0).toUpperCase()}
                              </span>
                            )}
                          </div>

                          {/* Site Info */}
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm text-slate-900 dark:text-white truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                              {site.name}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                              {site.url.replace(/^https?:\/\//, '').split('/')[0]}
                            </p>
                          </div>

                          {/* Quick Actions - Show on hover */}
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openUrl(site.url);
                              }}
                              className="p-1 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-all duration-200"
                              title="Visit Site"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditSite(site);
                              }}
                              className="p-1 text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded transition-all duration-200"
                              title="Edit Site"
                            >
                              <Edit className="w-3 h-3" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onDeleteSite(site.id);
                              }}
                              className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-all duration-200"
                              title="Delete Site"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Status Indicator */}
                        {isOverdue && (
                          <div className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}