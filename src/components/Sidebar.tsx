'use client';

import { useState } from 'react';
import { Category, Subcategory, SubcategoryItem } from '@/types';
import { ChevronRight, ChevronDown, Plus } from 'lucide-react';

interface SidebarProps {
  categories: Category[];
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  selectedItem: string | null;
  onCategorySelect: (categoryId: string) => void;
  onSubcategorySelect: (subcategoryId: string) => void;
  onItemSelect: (itemId: string) => void;
  onAddSite: () => void;
}

export default function Sidebar({
  categories,
  selectedCategory,
  selectedSubcategory,
  selectedItem,
  onCategorySelect,
  onSubcategorySelect,
  onItemSelect,
  onAddSite
}: SidebarProps) {
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [expandedSubcategories, setExpandedSubcategories] = useState<string[]>([]);

  const toggleCategory = (categoryId: string) => {
    if (expandedCategories.includes(categoryId)) {
      setExpandedCategories(expandedCategories.filter(id => id !== categoryId));
    } else {
      setExpandedCategories([...expandedCategories, categoryId]);
    }
    onCategorySelect(categoryId);
  };

  const toggleSubcategory = (subcategoryId: string) => {
    if (expandedSubcategories.includes(subcategoryId)) {
      setExpandedSubcategories(expandedSubcategories.filter(id => id !== subcategoryId));
    } else {
      setExpandedSubcategories([...expandedSubcategories, subcategoryId]);
    }
    onSubcategorySelect(subcategoryId);
  };

  return (
    <div className="w-80 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-screen overflow-y-auto">
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Kategoriler</h2>
          <button
            onClick={onAddSite}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
            title="Site Ekle"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4">
        {Array.isArray(categories) ? categories.map((category) => (
          <div key={category.id} className="mb-2">
            <button
              onClick={() => toggleCategory(category.id)}
              className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                selectedCategory === category.id
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                  : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
              }`}
            >
              <span className="text-lg">{category.icon}</span>
              <span className="font-medium flex-1">{category.name}</span>
              {expandedCategories.includes(category.id) ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </button>

            {expandedCategories.includes(category.id) && (
              <div className="ml-6 mt-2 space-y-1">
                {Array.isArray(category.subcategories) ? category.subcategories.map((subcategory) => (
                  <div key={subcategory.id}>
                    <button
                      onClick={() => toggleSubcategory(subcategory.id)}
                      className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${
                        selectedSubcategory === subcategory.id
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                          : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      <span className="text-sm">{subcategory.icon}</span>
                      <span className="text-sm font-medium flex-1">{subcategory.name}</span>
                      {expandedSubcategories.includes(subcategory.id) ? (
                        <ChevronDown className="w-3 h-3" />
                      ) : (
                        <ChevronRight className="w-3 h-3" />
                      )}
                    </button>

                    {expandedSubcategories.includes(subcategory.id) && (
                      <div className="ml-6 mt-1 space-y-1">
                        {Array.isArray(subcategory.items) ? subcategory.items.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => onItemSelect(item.id)}
                            className={`w-full flex items-center gap-3 p-2 rounded-lg text-left transition-colors ${
                              selectedItem === item.id
                                ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-500'
                            }`}
                          >
                            <span className="text-xs">{item.icon}</span>
                            <span className="text-xs">{item.name}</span>
                          </button>
                        )) : []}
                      </div>
                    )}
                  </div>
                )) : []}
              </div>
            )}
          </div>
        )) : []}
      </div>
    </div>
  );
}