'use client';

import React, { useState } from 'react';
import { Category, Site } from '@/types';
import { Plus, Settings, Search, ChevronRight, ChevronDown } from 'lucide-react';

interface DesktopSidebarProps {
  categories: Category[];
  sites: Site[];
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  selectedSite: Site | null;
  onCategorySelect: (categoryId: string) => void;
  onSubcategorySelect: (subcategoryId: string) => void;
  onSiteSelect: (site: Site) => void;
  onAddSite: () => void;
  onSearch: (query: string) => void;
  onOpenCategoryModal?: () => void;
  onMoveSubcategory?: (subcategoryId: string, targetCategoryId: string) => void;
  onMoveSite?: (siteId: string, targetSubcategoryId: string) => void;
}

export default function DesktopSidebar({
  categories,
  sites,
  selectedCategory,
  selectedSubcategory,
  selectedSite,
  onCategorySelect,
  onSubcategorySelect,
  onSiteSelect,
  onAddSite,
  onSearch,
  onOpenCategoryModal,
  onMoveSubcategory,
  onMoveSite,
}: DesktopSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(selectedCategory ? [selectedCategory] : []));
  const [draggedItem, setDraggedItem] = useState<{type: 'subcategory' | 'site', id: string} | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<{type: 'category' | 'subcategory', id: string} | null>(null);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowSearchResults(query.length > 0);
    onSearch(query);
  };

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
    onCategorySelect(categoryId);
  };

  // Filter sites based on search query
  const filteredSites = searchQuery 
    ? sites.filter(site => 
        site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.url.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 5)
    : [];

  // Drag and drop handlers
  const handleDragStart = (e: React.DragEvent, type: 'subcategory' | 'site', id: string) => {
    setDraggedItem({ type, id });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', '');
  };

  const handleDragOver = (e: React.DragEvent, targetType: 'category' | 'subcategory', targetId: string) => {
    if (!draggedItem) return;
    
    // Prevent default to allow drop
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    
    // Set drag over target for visual feedback
    setDragOverTarget({ type: targetType, id: targetId });
  };

  const handleDragLeave = () => {
    setDragOverTarget(null);
  };

  const handleDrop = (e: React.DragEvent, targetType: 'category' | 'subcategory', targetId: string) => {
    e.preventDefault();
    
    if (!draggedItem) return;
    
    if (draggedItem.type === 'subcategory' && targetType === 'category' && onMoveSubcategory) {
      // Move subcategory to different category
      onMoveSubcategory(draggedItem.id, targetId);
    } else if (draggedItem.type === 'site' && targetType === 'subcategory' && onMoveSite) {
      // Move site to different subcategory
      onMoveSite(draggedItem.id, targetId);
    }
    
    // Reset drag state
    setDraggedItem(null);
    setDragOverTarget(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverTarget(null);
  };

  return (
    <div className="w-80 border-r border-gray-200 dark:border-gray-700 flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Navigation</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCategoryModal}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-all duration-200"
              title="Manage Categories"
            >
              <Settings className="w-4 h-4" />
            </button>
            <button
              onClick={onAddSite}
              className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-all duration-200 flex items-center gap-2 text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Site
            </button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search sites..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setShowSearchResults(searchQuery.length > 0)}
            onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-sm"
          />
          
          {/* Search Results Dropdown */}
          {showSearchResults && filteredSites.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
              {filteredSites.map((site) => {
                const category = categories.find(c => 
                  c.subcategories.some(sub => sub.id === site.subcategoryId)
                );
                const subcategory = category?.subcategories.find(sub => sub.id === site.subcategoryId);
                
                return (
                  <button
                    key={site.id}
                    onClick={() => {
                      if (category && subcategory) {
                        onCategorySelect(category.id);
                        onSubcategorySelect(subcategory.id);
                        onSiteSelect(site);
                      }
                      setShowSearchResults(false);
                      setSearchQuery('');
                    }}
                    className="w-full p-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/50 dark:to-accent-900/50 flex items-center justify-center text-xs font-semibold text-primary-700 dark:text-primary-300">
                        {site.favicon ? (
                          <img 
                            src={site.favicon} 
                            alt={`${site.name} favicon`}
                            className="w-4 h-4 object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          site.name.substring(0, 2).toUpperCase()
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                          {site.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {category?.name} → {subcategory?.name}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Navigation Tree */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-1">
          {categories.map((category) => (
            <div key={category.id}>
              {/* Category */}
              <button
                onClick={() => toggleCategory(category.id)}
                onDragOver={(e) => handleDragOver(e, 'category', category.id)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, 'category', category.id)}
                className={`w-full p-3 rounded-lg text-left transition-all duration-200 flex items-center justify-between group ${
                  selectedCategory === category.id
                    ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                } ${
                  dragOverTarget?.type === 'category' && dragOverTarget.id === category.id
                    ? 'ring-2 ring-primary-500 bg-primary-100 dark:bg-primary-900/50'
                    : ''
                }`}
              >
                <div className="flex-1">
                  <div className="font-medium text-sm">{category.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {category.subcategories?.length || 0} subcategories
                  </div>
                </div>
                {expandedCategories.has(category.id) ? (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                )}
              </button>

              {/* Subcategories */}
              {expandedCategories.has(category.id) && category.subcategories && (
                <div className="ml-4 mt-1 space-y-1">
                  {category.subcategories.map((subcategory) => {
                    const sitesInSubcategory = sites.filter(site => site.subcategoryId === subcategory.id);
                    return (
                      <div key={subcategory.id}>
                        <button
                          draggable
                          onDragStart={(e) => handleDragStart(e, 'subcategory', subcategory.id)}
                          onDragEnd={handleDragEnd}
                          onDragOver={(e) => handleDragOver(e, 'subcategory', subcategory.id)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, 'subcategory', subcategory.id)}
                          onClick={() => onSubcategorySelect(subcategory.id)}
                          className={`w-full p-2 rounded-lg text-left transition-all duration-200 cursor-move ${
                            selectedSubcategory === subcategory.id
                              ? 'bg-accent-50 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                          } ${
                            draggedItem?.type === 'subcategory' && draggedItem.id === subcategory.id
                              ? 'opacity-50'
                              : ''
                          } ${
                            dragOverTarget?.type === 'subcategory' && dragOverTarget.id === subcategory.id
                              ? 'ring-2 ring-accent-500 bg-accent-100 dark:bg-accent-900/50'
                              : ''
                          }`}
                        >
                          <div className="font-medium text-sm">{subcategory.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {sitesInSubcategory.length} sites
                          </div>
                        </button>

                        {/* Sites */}
                        {selectedSubcategory === subcategory.id && sitesInSubcategory.length > 0 && (
                          <div className="ml-3 mt-1 space-y-1">
                            {sitesInSubcategory.map((site) => (
                              <button
                                key={site.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, 'site', site.id)}
                                onDragEnd={handleDragEnd}
                                onClick={() => onSiteSelect(site)}
                                className={`w-full p-2 rounded-lg text-left transition-all duration-200 flex items-center gap-2 cursor-move ${
                                  selectedSite?.id === site.id
                                    ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                                    : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                                } ${
                                  draggedItem?.type === 'site' && draggedItem.id === site.id
                                    ? 'opacity-50'
                                    : ''
                                }`}
                              >
                                <div className="w-5 h-5 rounded bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/50 dark:to-accent-900/50 flex items-center justify-center text-xs font-semibold text-primary-700 dark:text-primary-300 overflow-hidden flex-shrink-0">
                                  {site.favicon ? (
                                    <img 
                                      src={site.favicon} 
                                      alt={`${site.name} favicon`}
                                      className="w-3 h-3 object-contain"
                                      onError={(e) => {
                                        (e.target as HTMLImageElement).style.display = 'none';
                                      }}
                                    />
                                  ) : (
                                    site.name.substring(0, 1).toUpperCase()
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-medium text-xs truncate">{site.name}</div>
                                </div>
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}