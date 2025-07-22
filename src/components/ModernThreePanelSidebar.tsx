'use client';

import React, { useState } from 'react';
import { Category, Site } from '@/types';
import { Plus, Settings, Search, Filter, ChevronRight, FolderOpen, Globe, Clock, Menu, X, Download } from 'lucide-react';
import MobileLayoutNew from './MobileLayoutNew';
import CreativeIcon from './CreativeIcon';
import ClientOnly from './ClientOnly';
import CategoryManagementModal from './CategoryManagementModal';

interface ModernThreePanelSidebarProps {
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
  onTagFilter: (tags: string[]) => void;
  availableTags: string[];
  selectedTags: string[];
  onAddCategory?: (name: string) => void;
  onAddSubcategory?: (categoryId: string, name: string) => void;
  onOpenCategoryModal?: () => void;
  onEditSite?: (site: Site) => void;
  onDeleteSite?: (siteId: string) => void;
  onSiteUpdate?: (site: Site) => void;
  onMoveSubcategory?: (subcategoryId: string, targetCategoryId: string) => void;
  onMoveSite?: (siteId: string, targetSubcategoryId: string) => void;
  onOpenImportModal?: () => void;
}

export default function ModernThreePanelSidebar({
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
  onEditSite,
  onDeleteSite,
  onSiteUpdate,
  onMoveSubcategory,
  onMoveSite,
  onOpenImportModal,
}: ModernThreePanelSidebarProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [draggedItem, setDraggedItem] = useState<{type: 'subcategory' | 'site', id: string} | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<{type: 'category' | 'subcategory', id: string} | null>(null);
  const [showCategoryManagement, setShowCategoryManagement] = useState(false);
  const [selectedCategoryForSubcategory, setSelectedCategoryForSubcategory] = useState<string | null>(null);

  const selectedCategoryData = Array.isArray(categories) ? categories.find(c => c.id === selectedCategory) : null;
  const selectedSubcategoryData = selectedCategoryData && Array.isArray(selectedCategoryData.subcategories) ? selectedCategoryData.subcategories.find(s => s.id === selectedSubcategory) : null;
  const sitesInSubcategory = Array.isArray(sites) ? sites.filter(site => site.subcategoryId === selectedSubcategory) : [];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowSearchResults(query.length > 0);
    onSearch(query);
  };

  const handleAddSubcategory = (categoryId: string) => {
    setSelectedCategoryForSubcategory(categoryId);
    setShowCategoryManagement(true);
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
    console.log('Drag start:', { type, id });
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
    console.log('Drop:', { draggedItem, targetType, targetId });
    
    if (!draggedItem) {
      console.log('No dragged item');
      return;
    }
    
    try {
      if (draggedItem.type === 'subcategory' && targetType === 'category') {
        if (!onMoveSubcategory) {
          console.log('onMoveSubcategory function not provided');
          return;
        }
        // Move subcategory to different category
        console.log('Moving subcategory:', draggedItem.id, 'to category:', targetId);
        onMoveSubcategory(draggedItem.id, targetId);
      } else if (draggedItem.type === 'site' && targetType === 'subcategory') {
        if (!onMoveSite) {
          console.log('onMoveSite function not provided');
          return;
        }
        // Move site to different subcategory
        console.log('Moving site:', draggedItem.id, 'to subcategory:', targetId);
        onMoveSite(draggedItem.id, targetId);
      } else {
        console.log('Invalid drop combination:', { draggedType: draggedItem.type, targetType });
      }
    } catch (error) {
      console.log('Error in handleDrop:', error);
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
    <>
      {/* Mobile Layout - New Design */}
      <div className="md:hidden h-screen w-full">
        <MobileLayoutNew
          categories={categories}
          sites={sites}
          selectedCategory={selectedCategory}
          selectedSubcategory={selectedSubcategory}
          selectedSite={selectedSite}
          onCategorySelect={onCategorySelect}
          onSubcategorySelect={onSubcategorySelect}
          onSiteSelect={onSiteSelect}
          onEditSite={onEditSite}
          onDeleteSite={onDeleteSite}
          onAddSite={onAddSite}
          onOpenCategoryModal={onOpenCategoryModal}
          onSearch={onSearch}
          onSiteUpdate={onSiteUpdate}
          onMoveSubcategory={onMoveSubcategory}
          onMoveSite={onMoveSite}
        />
      </div>

      {/* Tablet & Desktop Layout - Three Panels */}
      <div className="hidden md:flex h-full flex-none">
        {/* Panel 1: Categories */}
        <div className="w-56 md:w-64 lg:w-80 border-r border-brand-200/20 dark:border-brand-700/30 flex flex-col bg-white/98 dark:bg-brand-900/98 backdrop-blur-sm shadow-subtle max-h-full">
          {/* Header */}
          <div className="h-20 p-4 border-b border-brand-200/30 dark:border-brand-700/50 flex items-center justify-between">
            <h2 className="text-base font-semibold text-brand-900 dark:text-brand-100">Categories</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenCategoryModal}
                className="p-2 text-brand-600 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-800 rounded-lg transition-all duration-200 shadow-subtle"
                title="Manage Categories"
              >
                <Settings className="w-4 h-4" />
              </button>
              <button
                onClick={onOpenImportModal}
                className="p-2 text-brand-600 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-800 rounded-lg transition-all duration-200 shadow-subtle"
                title="Import Bookmarks"
              >
                <Download className="w-4 h-4" />
              </button>
              <button
                onClick={onAddSite}
                className="gradient-primary text-white p-2 rounded-lg hover:opacity-90 hover:shadow-elevated transition-all duration-200 shadow-subtle"
                title="Add Site"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Categories List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
            <div className="menu-grid-balanced">
              {Array.isArray(categories) ? categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => onCategorySelect(category.id)}
                  onDragOver={(e) => handleDragOver(e, 'category', category.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, 'category', category.id)}
                  className={`w-full p-3 rounded-lg text-left transition-all duration-200 ease-in-out flex items-center gap-2 group relative ${
                    selectedCategory === category.id
                      ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 shadow-sm'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300'
                  } ${
                    dragOverTarget?.type === 'category' && dragOverTarget.id === category.id
                      ? 'ring-2 ring-primary-500 bg-primary-100 dark:bg-primary-900/50 drag-over-target'
                      : ''
                  }`}
                >
                  <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full transition-all ${
                    selectedCategory === category.id
                      ? 'bg-primary-500 dark:bg-primary-400'
                      : 'bg-transparent'
                  }`}></div>
                  <div className="flex-1 ml-3">
                    <div className="font-medium text-sm">{category.name ? category.name.charAt(0).toUpperCase() + category.name.slice(1).toLowerCase() : 'Unnamed Category'}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {category.subcategories?.length || 0} subcategories
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {(!category.subcategories || category.subcategories.length === 0) && (
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddSubcategory(category.id);
                        }}
                        className="p-1 text-gray-400 hover:text-primary-600 hover:bg-primary-100 dark:hover:bg-primary-900/30 rounded transition-colors cursor-pointer"
                        title="Add subcategory"
                      >
                        <Plus className="w-3 h-3" />
                      </div>
                    )}
                    <ChevronRight className={`w-3 h-3 text-gray-400 transition-transform ${
                      selectedCategory === category.id ? 'rotate-90' : ''
                    }`} />
                  </div>
                </button>
              )) : []}
            </div>
          </div>
        </div>

        {/* Panel 2: Subcategories */}
        <div className="w-56 md:w-64 lg:w-80 border-r border-brand-200/20 dark:border-brand-700/30 flex flex-col bg-white/98 dark:bg-brand-900/98 backdrop-blur-sm shadow-subtle max-h-full">
          {/* Header */}
          <div className="h-20 p-4 border-b border-brand-200/30 dark:border-brand-700/50 flex items-center justify-between">
            {selectedCategoryData ? (
              <div>
                <h2 className="text-base font-medium text-brand-900 dark:text-brand-100">
                  Subcategories
                </h2>
                <p className="text-xs text-brand-500 dark:text-brand-400">
                  {selectedCategoryData.name}
                </p>
              </div>
            ) : (
              <div>
                <h2 className="text-base font-medium text-brand-900 dark:text-brand-100">Subcategories</h2>
                <p className="text-xs text-brand-500 dark:text-brand-400">Select category</p>
              </div>
            )}
            {selectedCategoryData && (
              <button
                onClick={() => handleAddSubcategory(selectedCategoryData.id)}
                className="p-2 text-brand-600 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-800 rounded-lg transition-all duration-200 shadow-subtle"
                title="Add Subcategory"
              >
                <Plus className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Subcategories List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
            {selectedCategoryData ? (
              selectedCategoryData.subcategories.length > 0 ? (
                <div className="space-y-2">
                  {Array.isArray(selectedCategoryData.subcategories) ? selectedCategoryData.subcategories.map((subcategory) => {
                    const sitesCount = sites.filter(site => site.subcategoryId === subcategory.id).length;
                    return (
                      <button
                        key={subcategory.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, 'subcategory', subcategory.id)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => handleDragOver(e, 'subcategory', subcategory.id)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, 'subcategory', subcategory.id)}
                        onClick={() => onSubcategorySelect(subcategory.id)}
                        className={`w-full p-2.5 rounded-lg text-left transition-all duration-200 ease-in-out flex items-center gap-2 group relative ${
                          selectedSubcategory === subcategory.id
                            ? 'bg-accent-50 dark:bg-accent-900/30 text-accent-700 dark:text-accent-300 shadow-sm'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-800/50 text-gray-700 dark:text-gray-300'
                        } ${
                          draggedItem?.type === 'subcategory' && draggedItem.id === subcategory.id
                            ? 'opacity-50 drag-ghost'
                            : ''
                        } ${
                          dragOverTarget?.type === 'subcategory' && dragOverTarget.id === subcategory.id
                            ? 'ring-2 ring-accent-500 bg-accent-100 dark:bg-accent-900/50 drag-over-target'
                            : ''
                        }`}
                      >
                        <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full transition-all ${
                          selectedSubcategory === subcategory.id
                            ? 'bg-accent-500 dark:bg-accent-400'
                            : 'bg-transparent'
                        }`}></div>
                        <div className="flex-1 ml-3">
                          <div className="font-medium text-sm">{subcategory.name ? subcategory.name.charAt(0).toUpperCase() + subcategory.name.slice(1).toLowerCase() : 'Unnamed Subcategory'}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {sitesCount} sites
                          </div>
                        </div>
                        <ChevronRight className={`w-3 h-3 text-gray-400 transition-transform ${
                          selectedSubcategory === subcategory.id ? 'rotate-90' : ''
                        }`} />
                      </button>
                    );
                  }) : []}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center px-4">
                  <div className="w-12 h-12 bg-brand-100 dark:bg-brand-800 rounded-xl flex items-center justify-center mx-auto mb-3">
                    <FolderOpen className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                  </div>
                  <p className="text-brand-500 dark:text-brand-400 mb-1 font-medium text-sm">No Subcategories</p>
                  <p className="text-xs text-brand-400 dark:text-brand-500">
                    Use the + button above to add subcategories
                  </p>
                </div>
              )
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="w-12 h-12 bg-brand-100 dark:bg-brand-800 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <FolderOpen className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                </div>
                <p className="text-brand-500 dark:text-brand-400 mb-1 font-medium text-sm">Select a Category</p>
                <p className="text-xs text-brand-400 dark:text-brand-500">
                  Choose a category to view subcategories
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Panel 3: Sites */}
        <div className="w-64 md:w-72 lg:w-96 flex flex-col bg-white/98 dark:bg-brand-900/98 backdrop-blur-sm shadow-subtle hidden lg:flex max-h-full">
          {/* Header */}
          <div className="h-20 p-4 border-b border-brand-200/30 dark:border-brand-700/50 flex items-center">
            {selectedSubcategoryData ? (
              <div>
                <h2 className="text-base font-normal text-brand-900 dark:text-brand-100">
                  Sites
                </h2>
                <p className="text-xs text-brand-500 dark:text-brand-400">
                  {selectedSubcategoryData.name} • {sitesInSubcategory.length} site
                </p>
              </div>
            ) : (
              <div>
                <h2 className="text-base font-normal text-brand-900 dark:text-brand-100">Sites</h2>
                <p className="text-xs text-brand-500 dark:text-brand-400">Select subcategory</p>
              </div>
            )}
          </div>

          {/* Sites List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3">
            {selectedSubcategoryData && sitesInSubcategory.length > 0 ? (
              <div className="space-y-2">
                {Array.isArray(sitesInSubcategory) ? sitesInSubcategory.map((site) => (
                  <button
                    key={site.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, 'site', site.id)}
                    onDragEnd={handleDragEnd}
                    onClick={() => onSiteSelect(site)}
                    className={`w-full p-3 rounded-lg text-left transition-all duration-200 ease-in-out group ${
                      selectedSite?.id === site.id
                        ? 'bg-primary-50 dark:bg-primary-900/30 shadow-md border border-primary-200 dark:border-primary-800'
                        : 'bg-white dark:bg-brand-800/50 hover:bg-brand-50 dark:hover:bg-brand-800 shadow-sm border border-brand-200/50 dark:border-brand-700/50'
                    } ${
                      draggedItem?.type === 'site' && draggedItem.id === site.id
                        ? 'opacity-50 drag-ghost'
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <CreativeIcon
                        name={site.name}
                        url={site.url}
                        customInitials={site.customInitials}
                        size="sm"
                        shape="geometric"
                        color={site.color}
                        favicon={site.favicon || undefined}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-xs text-brand-900 dark:text-brand-100 truncate">
                          {site.name ? site.name.charAt(0).toUpperCase() + site.name.slice(1).toLowerCase() : 'Unnamed Site'}
                        </div>
                        <div className="text-xs text-brand-500 dark:text-brand-400 truncate">
                          {site.url.replace(/^https?:\/\//, '')}
                        </div>
                      </div>
                      {site.reminderEnabled && (
                        <Clock className="w-3 h-3 text-accent-500 flex-shrink-0" />
                      )}
                    </div>
                  </button>
              )) : []}
              </div>
            ) : selectedSubcategoryData ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-12 h-12 bg-brand-100 dark:bg-brand-800 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Globe className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                </div>
                <p className="text-brand-500 dark:text-brand-400 mb-1 text-sm">No sites yet</p>
                <p className="text-xs text-brand-400 dark:text-brand-500 mb-4">
                  Add your first site to this subcategory
                </p>
                <button
                  onClick={onAddSite}
                  className="gradient-primary text-white px-4 py-2 rounded-lg hover:opacity-90 transition-all text-sm font-medium"
                >
                  Add Site
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="w-12 h-12 bg-brand-100 dark:bg-brand-800 rounded-xl flex items-center justify-center mx-auto mb-3">
                  <Globe className="w-5 h-5 text-brand-600 dark:text-brand-400" />
                </div>
                <p className="text-brand-500 dark:text-brand-400 mb-1 font-medium text-sm">Select a Subcategory</p>
                <p className="text-xs text-brand-400 dark:text-brand-500">
                  Choose a subcategory to view sites
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Category Management Modal */}
      <CategoryManagementModal
        isOpen={showCategoryManagement}
        onClose={() => {
          setShowCategoryManagement(false);
          setSelectedCategoryForSubcategory(null);
        }}
        categories={categories}
        onAddCategory={(name) => {
          console.log('Add category:', name);
          // Category added
        }}
        onAddSubcategory={(categoryId, name) => {
          console.log('Add subcategory:', categoryId, name);
          // Subcategory added
        }}
        selectedCategoryId={selectedCategoryForSubcategory}
      />
    </>
  );
}