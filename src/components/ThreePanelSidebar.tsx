'use client';

import { useState } from 'react';
import { Category, Subcategory, SubcategoryItem, Site } from '@/types';
import { Plus, ChevronRight, Settings, Edit, Trash2 } from 'lucide-react';
import IconRenderer from './IconRenderer';
import SearchBar from './SearchBar';
import CategoryModal from './CategoryModal';
import CategoryManagementModal from './CategoryManagementModal';

interface ThreePanelSidebarProps {
  categories: Category[];
  sites: Site[];
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  selectedItem: string | null;
  selectedSite: Site | null;
  onCategorySelect: (categoryId: string) => void;
  onSubcategorySelect: (subcategoryId: string) => void;
  onSiteSelect: (site: Site) => void;
  onSiteUpdate?: (site: Site) => void;
  onAddSite: () => void;
  onSearch: (query: string) => void;
  onTagFilter: (tags: string[]) => void;
  availableTags: string[];
  selectedTags: string[];
  onAddCategory?: (name: string) => void;
  onAddSubcategory?: (categoryId: string, name: string) => void;
  onDeleteCategory?: (categoryId: string) => void;
  onDeleteSubcategory?: (categoryId: string, subcategoryId: string) => void;
}

export default function ThreePanelSidebar({
  categories,
  sites,
  selectedCategory,
  selectedSubcategory,
  selectedItem,
  selectedSite,
  onCategorySelect,
  onSubcategorySelect,
  onSiteSelect,
  onSiteUpdate,
  onAddSite,
  onSearch,
  onTagFilter,
  availableTags,
  selectedTags,
  onAddCategory,
  onAddSubcategory,
  onDeleteCategory,
  onDeleteSubcategory
}: ThreePanelSidebarProps) {
  const [showCategoryManagement, setShowCategoryManagement] = useState(false);
  const [showSubcategoryManagement, setShowSubcategoryManagement] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubcategoryModalOpen, setIsSubcategoryModalOpen] = useState(false);
  const [isCategoryManagementOpen, setIsCategoryManagementOpen] = useState(false);
  
  const selectedCategoryData = categories.find(c => c.id === selectedCategory);
  const selectedSubcategoryData = selectedCategoryData?.subcategories.find(s => s.id === selectedSubcategory);

  const filteredSites = sites.filter(site => {
    if (selectedCategory && site.categoryId !== selectedCategory) return false;
    if (selectedSubcategory && site.subcategoryId !== selectedSubcategory) return false;
    return true;
  });

  const handleAddCategory = (name: string) => {
    alert(`Kategori "${name}" eklendi!`);
  };

  const handleAddSubcategory = (name: string) => {
    alert(`Alt kategori "${name}" eklendi!`);
  };

  return (
    <>
    <div className="flex h-full">
      {/* Panel 1: Categories */}
      <div className="w-80 border-r border-brand-200/30 dark:border-brand-700/50 flex flex-col bg-white/90 dark:bg-brand-900/90 backdrop-blur-sm">
        <div className="p-6 border-b border-brand-200/30 dark:border-brand-700/50">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-brand-900 dark:text-brand-100">Categories</h2>
            <div className="flex items-center gap-2">
              <button
                onClick={onAddSite}
                className="p-2.5 gradient-primary text-white rounded-lg hover:opacity-90 transition-all shadow-sm"
                title="Add Site"
              >
                <Plus className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsCategoryManagementOpen(true)}
                className="p-2.5 bg-brand-100 dark:bg-brand-800 text-brand-700 dark:text-brand-300 rounded-lg hover:bg-brand-200 dark:hover:bg-brand-700 transition-colors"
                title="Manage Categories"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="space-y-6 w-full px-8 py-6 flex flex-col items-center justify-center min-h-full">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => onCategorySelect(category.id)}
                className={`w-full text-center transition-all duration-300 font-medium text-lg flex items-center justify-center gap-2 ${
                  selectedCategory === category.id
                    ? 'text-teal-600 dark:text-teal-400 transform scale-110'
                    : 'text-slate-600 dark:text-slate-400 hover:text-teal-500 dark:hover:text-teal-300'
                }`}
              >
                <span className={`${selectedCategory === category.id ? 'text-teal-500 dark:text-teal-400' : 'text-transparent'}`}>
                  &gt;
                </span>
                {category.name}
              </button>
            ))}
            
            {showCategoryManagement && (
              <button
                onClick={() => setIsCategoryModalOpen(true)}
                className="w-full p-2 border-2 border-dashed border-slate-400 dark:border-slate-500 rounded-xl text-slate-500 dark:text-slate-400 hover:border-teal-500 hover:text-teal-500 transition-all duration-200 flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Add Category
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Panel 2: Subcategories */}
      <div className={`w-64 border-r border-slate-200/30 dark:border-slate-700/30 flex flex-col bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all duration-300 relative ${
        selectedCategoryData ? 'translate-x-0 opacity-100' : 'translate-x-4 opacity-0 pointer-events-none'
      }`}>
        {/* Connection Line */}
        <div className="absolute -left-px top-0 bottom-0 w-px bg-teal-300/40 dark:bg-teal-600/40"></div>
        <div className="p-4">
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {selectedCategoryData && (
            <div className="space-y-6 w-full px-8 py-6 flex flex-col items-center justify-center min-h-full">
              {selectedCategoryData.subcategories.map((subcategory) => (
                <button
                  key={subcategory.id}
                  onClick={() => onSubcategorySelect(subcategory.id)}
                  className={`w-full text-center transition-all duration-300 font-medium text-lg flex items-center justify-center gap-2 ${
                    selectedSubcategory === subcategory.id
                      ? 'text-teal-600 dark:text-teal-400 transform scale-110'
                      : 'text-slate-600 dark:text-slate-400 hover:text-teal-500 dark:hover:text-teal-300'
                  }`}
                >
                  <span className={`${selectedSubcategory === subcategory.id ? 'text-teal-500 dark:text-teal-400' : 'text-transparent'}`}>
                    &gt;
                  </span>
                  {subcategory.name}
                </button>
              ))}
              
              {showSubcategoryManagement && (
                <button
                  onClick={() => setIsSubcategoryModalOpen(true)}
                  className="w-full p-2 border-2 border-dashed border-slate-400 dark:border-slate-500 rounded-xl text-slate-500 dark:text-slate-400 hover:border-teal-500 hover:text-teal-500 transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add Subcategory
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Panel 3: Sites */}
      <div className={`flex-1 flex flex-col bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm transition-all duration-300 relative ${
        selectedSubcategoryData ? 'translate-x-0 opacity-100' : 'translate-x-6 opacity-0 pointer-events-none'
      }`}>
        {/* Connection Line */}
        <div className="absolute -left-px top-0 bottom-0 w-px bg-teal-300/40 dark:bg-teal-600/40"></div>
        <div className="p-4">
        </div>

        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          {selectedSubcategoryData && (
            <div className="space-y-4">
              {filteredSites.map((site) => (
                <div
                  key={site.id}
                  className="group cursor-pointer"
                  onClick={() => onSiteSelect(site)}
                >
                  <div className={`flex items-center justify-between p-4 rounded-lg transition-all duration-200 border ${
                    selectedSite?.id === site.id 
                      ? 'bg-teal-50 dark:bg-teal-900/20 border-teal-200 dark:border-teal-700' 
                      : 'border-transparent hover:bg-slate-50/50 dark:hover:bg-slate-700/30'
                  }`}>
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: site.color || '#10b981' }}
                      >
                        <span className="text-white font-bold text-xs" style={{ fontFamily: 'Inter, Arial, sans-serif', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                          {(site.customInitials && site.customInitials.trim()) ? 
                            site.customInitials.slice(0, 2).toUpperCase() : 
                            site.name.split(' ').map(word => word.charAt(0).toUpperCase()).join('').slice(0, 2)
                          }
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`font-medium truncate text-sm ${
                          selectedSite?.id === site.id 
                            ? 'text-teal-700 dark:text-teal-300' 
                            : 'text-gray-900 dark:text-gray-100'
                        }`}>
                          {site.name}
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {site.url.replace(/^https?:\/\//, '')}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={async (e) => {
                          e.stopPropagation();
                          // Update last checked date before opening
                          const updatedSite = { ...site, lastChecked: new Date().toISOString() };
                          try {
                            const response = await fetch(`/api/sites/${site.id}`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify(updatedSite)
                            });

                            if (response.ok) {
                              const savedSite = await response.json();
                              if (onSiteUpdate) {
                                onSiteUpdate(savedSite);
                              }
                            }
                          } catch (error) {
                            console.error('Error updating last checked date:', error);
                          }
                          window.open(site.url, '_blank');
                        }}
                        className="bg-teal-500 dark:bg-teal-600 text-white px-3 py-1.5 rounded-lg hover:bg-teal-600 dark:hover:bg-teal-700 transition-colors text-xs font-medium"
                      >
                        Git
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSiteSelect(site);
                        }}
                        className="bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors text-xs font-medium"
                      >
                        Detay
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredSites.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500 dark:text-gray-400 text-sm">
                    Henüz site yok
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>

    {/* Modals */}
    <CategoryManagementModal
      isOpen={isCategoryManagementOpen}
      onClose={() => setIsCategoryManagementOpen(false)}
      categories={categories}
      onAddCategory={onAddCategory || (() => {})}
      onAddSubcategory={onAddSubcategory || (() => {})}
      onDeleteCategory={onDeleteCategory}
      onDeleteSubcategory={onDeleteSubcategory}
    />

    <CategoryModal
      isOpen={isCategoryModalOpen}
      onClose={() => setIsCategoryModalOpen(false)}
      onSave={handleAddCategory}
      title="Yeni Kategori Ekle"
      placeholder="Kategori adını girin"
    />

    <CategoryModal
      isOpen={isSubcategoryModalOpen}
      onClose={() => setIsSubcategoryModalOpen(false)}
      onSave={handleAddSubcategory}
      title="Yeni Alt Kategori Ekle"
      placeholder="Alt kategori adını girin"
    />
  </>
  );
}