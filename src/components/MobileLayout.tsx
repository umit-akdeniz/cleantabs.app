'use client';

import React, { useState } from 'react';
import { Category, Site } from '@/types';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface MobileLayoutProps {
  categories: Category[];
  sites: Site[];
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  selectedSite: Site | null;
  onCategorySelect: (categoryId: string) => void;
  onSubcategorySelect: (subcategoryId: string) => void;
  onSiteSelect: (site: Site) => void;
}

export default function MobileLayout({
  categories,
  sites,
  selectedCategory,
  selectedSubcategory,
  selectedSite,
  onCategorySelect,
  onSubcategorySelect,
  onSiteSelect,
}: MobileLayoutProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(selectedCategory);

  const selectedCategoryData = Array.isArray(categories) ? categories.find(c => c.id === selectedCategory) : null;
  const sitesInSubcategory = Array.isArray(sites) ? sites.filter(site => site.subcategoryId === selectedSubcategory) : [];

  const handleCategoryClick = (categoryId: string) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
    } else {
      setExpandedCategory(categoryId);
      onCategorySelect(categoryId);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-slate-900">
      {/* Categories & Subcategories */}
      <div className="flex-none max-h-72 overflow-y-auto bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
            <div className="w-1.5 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
            Categories
          </h2>
          <div className="space-y-2">
            {Array.isArray(categories) ? categories.map((category) => (
              <div key={category.id}>
                {/* Category Button */}
                <button
                  onClick={() => handleCategoryClick(category.id)}
                  className={`w-full p-3 rounded-xl text-left transition-all duration-300 flex items-center justify-between shadow-sm hover:shadow-md ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                      : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 border border-slate-200 dark:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 flex items-center justify-center">
                      <div className="w-4 h-4 rounded bg-gradient-to-br from-blue-500 to-indigo-600"></div>
                    </div>
                    <div>
                      <div className="font-medium text-sm">{category.name}</div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {category.subcategories?.length || 0} subcategories
                      </div>
                    </div>
                  </div>
                  <div className={`transition-transform duration-300 ${
                    expandedCategory === category.id ? 'rotate-180' : 'rotate-0'
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {/* Subcategories */}
                {expandedCategory === category.id && category.subcategories && (
                  <div className="mt-3 ml-2 space-y-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    {Array.isArray(category.subcategories) ? category.subcategories.map((subcategory) => {
                      const sitesCount = sites.filter(site => site.subcategoryId === subcategory.id).length;
                      return (
                        <button
                          key={subcategory.id}
                          onClick={() => onSubcategorySelect(subcategory.id)}
                          className={`w-full p-3 rounded-lg text-left transition-all duration-300 shadow-sm hover:shadow-md ${
                            selectedSubcategory === subcategory.id
                              ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/30 dark:to-emerald-900/30 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700'
                              : 'bg-slate-100 dark:bg-slate-600 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-500 border border-slate-200 dark:border-slate-500'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <div className="w-2 h-2 rounded-full bg-current opacity-60"></div>
                            <div className="font-medium text-sm">{subcategory.name}</div>
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 ml-4">
                            {sitesCount} sites
                          </div>
                        </button>
                      );
                    }) : []}
                  </div>
                )}
              </div>
            )) : []}
          </div>
        </div>
      </div>

      {/* Horizontal Sites Scroll */}
      {selectedSubcategory && sitesInSubcategory.length > 0 && (
        <div className="flex-none bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="p-4">
            <h3 className="text-md font-medium text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <div className="w-1.5 h-5 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></div>
              {selectedCategoryData && Array.isArray(selectedCategoryData.subcategories) ? selectedCategoryData.subcategories.find(s => s.id === selectedSubcategory)?.name : 'Sites'} Sites
            </h3>
            <div className="overflow-x-auto">
              <div className="flex gap-3 pb-2" style={{ width: 'max-content' }}>
                {Array.isArray(sitesInSubcategory) ? sitesInSubcategory.map((site) => (
                  <button
                    key={site.id}
                    onClick={() => onSiteSelect(site)}
                    className={`flex-none w-52 p-4 rounded-xl border transition-all duration-300 shadow-sm hover:shadow-md ${
                      selectedSite?.id === site.id
                        ? 'bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/30 dark:to-indigo-900/30 border-blue-200 dark:border-blue-700 shadow-md'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 flex items-center justify-center text-xs font-semibold text-blue-700 dark:text-blue-300 overflow-hidden shadow-sm">
                        {site.favicon ? (
                          <img 
                            src={site.favicon} 
                            alt={`${site.name} favicon`}
                            className="w-6 h-6 object-contain"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        ) : (
                          site.name.substring(0, 2).toUpperCase()
                        )}
                      </div>
                    </div>
                    <div className="text-left flex-1">
                      <div className="font-semibold text-sm text-slate-900 dark:text-slate-100 truncate mb-1">
                        {site.name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                        {site.url.replace(/^https?:\/\//, '')}
                      </div>
                    </div>
                  </button>
                )) : []}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Site Info */}
      {selectedSite && (
        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 dark:bg-slate-900">
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-lg">
            <div className="flex items-center gap-4 mb-6">
              <button
                onClick={() => window.open(selectedSite.url, '_blank')}
                className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50 flex items-center justify-center overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
              >
                {selectedSite.favicon ? (
                  <img 
                    src={selectedSite.favicon} 
                    alt={`${selectedSite.name} favicon`}
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <span className="text-blue-700 dark:text-blue-300 font-bold text-lg">
                    {selectedSite.name.substring(0, 2).toUpperCase()}
                  </span>
                )}
              </button>
              <div className="flex-1">
                <button
                  onClick={() => window.open(selectedSite.url, '_blank')}
                  className="text-left hover:opacity-80 transition-opacity duration-200"
                >
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-xl mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {selectedSite.name}
                  </h3>
                </button>
                <a 
                  href={selectedSite.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-blue-600 dark:text-blue-400 text-sm hover:underline font-medium inline-flex items-center gap-1"
                >
                  {selectedSite.url}
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3 flex items-center gap-2">
                <div className="w-1 h-4 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
                Description
              </h4>
              <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 border border-slate-200 dark:border-slate-600">
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {selectedSite.description || 'No description available for this website.'}
                </p>
              </div>
            </div>

            {/* Visit Button */}
            <button
              onClick={() => window.open(selectedSite.url, '_blank')}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <span>Visit Site</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}