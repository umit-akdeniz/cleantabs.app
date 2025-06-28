'use client';

import React, { useState } from 'react';
import { Category, Site } from '@/types';
import { ChevronDown, ExternalLink, Edit, Trash2, Bell, Settings, Search, X, Palette, FileText, Save, Calendar, Clock } from 'lucide-react';
import ReminderModal from './ReminderModal';
import CreativeIcon from './CreativeIcon';
import ClientOnly from './ClientOnly';

interface MobileLayoutNewProps {
  categories: Category[];
  sites: Site[];
  selectedCategory: string | null;
  selectedSubcategory: string | null;
  selectedSite: Site | null;
  onCategorySelect: (categoryId: string) => void;
  onSubcategorySelect: (subcategoryId: string) => void;
  onSiteSelect: (site: Site) => void;
  onEditSite?: (site: Site) => void;
  onDeleteSite?: (siteId: string) => void;
  onAddSite?: () => void;
  onOpenCategoryModal?: () => void;
  onSearch?: (query: string) => void;
  onSiteUpdate?: (site: Site) => void;
  onMoveSubcategory?: (subcategoryId: string, targetCategoryId: string) => void;
  onMoveSite?: (siteId: string, targetSubcategoryId: string) => void;
}

export default function MobileLayoutNew({
  categories,
  sites,
  selectedCategory,
  selectedSubcategory,
  selectedSite,
  onCategorySelect,
  onSubcategorySelect,
  onSiteSelect,
  onEditSite,
  onDeleteSite,
  onAddSite,
  onOpenCategoryModal,
  onSearch,
  onSiteUpdate,
  onMoveSubcategory,
  onMoveSite,
}: MobileLayoutNewProps) {
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isSubcategoryDropdownOpen, setIsSubcategoryDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [personalNotes, setPersonalNotes] = useState('');
  const [isNotesChanged, setIsNotesChanged] = useState(false);
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [draggedItem, setDraggedItem] = useState<{type: 'subcategory' | 'site', id: string} | null>(null);
  const [dragOverTarget, setDragOverTarget] = useState<{type: 'category' | 'subcategory', id: string} | null>(null);
  const [touchStart, setTouchStart] = useState<{x: number, y: number} | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const selectedCategoryData = categories.find(c => c.id === selectedCategory);
  const selectedSubcategoryData = selectedCategoryData?.subcategories.find(s => s.id === selectedSubcategory);
  const sitesInSubcategory = sites.filter(site => site.subcategoryId === selectedSubcategory);

  const predefinedColors = [
    '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#f59e0b', 
    '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
  ];

  // Touch and drag handlers for mobile
  const handleTouchStart = (e: React.TouchEvent, type: 'subcategory' | 'site', id: string) => {
    const touch = e.touches[0];
    setTouchStart({ x: touch.clientX, y: touch.clientY });
    setDraggedItem({ type, id });
    
    // Add haptic feedback if available
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!touchStart || !draggedItem) return;
    
    const touch = e.touches[0];
    const deltaX = Math.abs(touch.clientX - touchStart.x);
    const deltaY = Math.abs(touch.clientY - touchStart.y);
    
    // Start dragging if moved more than 10px
    if (deltaX > 10 || deltaY > 10) {
      setIsDragging(true);
      e.preventDefault(); // Prevent scrolling
    }
  };

  const handleTouchEnd = (e: React.TouchEvent, targetType?: 'category' | 'subcategory', targetId?: string) => {
    if (isDragging && draggedItem && targetType && targetId) {
      if (draggedItem.type === 'subcategory' && targetType === 'category' && onMoveSubcategory) {
        onMoveSubcategory(draggedItem.id, targetId);
      } else if (draggedItem.type === 'site' && targetType === 'subcategory' && onMoveSite) {
        onMoveSite(draggedItem.id, targetId);
      }
    }
    
    // Reset states
    setTouchStart(null);
    setDraggedItem(null);
    setIsDragging(false);
    setDragOverTarget(null);
  };

  // Desktop drag handlers
  const handleDragStart = (e: React.DragEvent, type: 'subcategory' | 'site', id: string) => {
    setDraggedItem({ type, id });
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', '');
  };

  const handleDragOver = (e: React.DragEvent, targetType: 'category' | 'subcategory', targetId: string) => {
    if (!draggedItem) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverTarget({ type: targetType, id: targetId });
  };

  const handleDragLeave = () => {
    setDragOverTarget(null);
  };

  const handleDrop = (e: React.DragEvent, targetType: 'category' | 'subcategory', targetId: string) => {
    e.preventDefault();
    console.log('Mobile Drop:', { draggedItem, targetType, targetId });
    
    if (!draggedItem) {
      console.log('Mobile: No dragged item');
      return;
    }
    
    try {
      if (draggedItem.type === 'subcategory' && targetType === 'category') {
        if (!onMoveSubcategory) {
          console.log('Mobile: onMoveSubcategory function not provided');
          return;
        }
        console.log('Mobile: Moving subcategory:', draggedItem.id, 'to category:', targetId);
        onMoveSubcategory(draggedItem.id, targetId);
      } else if (draggedItem.type === 'site' && targetType === 'subcategory') {
        if (!onMoveSite) {
          console.log('Mobile: onMoveSite function not provided');
          return;
        }
        console.log('Mobile: Moving site:', draggedItem.id, 'to subcategory:', targetId);
        onMoveSite(draggedItem.id, targetId);
      } else {
        console.log('Mobile: Invalid drop combination:', { draggedType: draggedItem.type, targetType });
      }
    } catch (error) {
      console.log('Mobile: Error in handleDrop:', error);
    }
    
    setDraggedItem(null);
    setDragOverTarget(null);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
    setDragOverTarget(null);
  };

  // Update local state when selectedSite changes
  React.useEffect(() => {
    if (selectedSite) {
      setPersonalNotes(selectedSite.personalNotes || '');
      setIsNotesChanged(false);
    }
  }, [selectedSite]);

  const handleCategorySelect = (categoryId: string) => {
    onCategorySelect(categoryId);
    setIsCategoryDropdownOpen(false);
    // Auto-select first subcategory
    const category = categories.find(c => c.id === categoryId);
    if (category && category.subcategories.length > 0) {
      onSubcategorySelect(category.subcategories[0].id);
    }
  };

  const handleSubcategorySelect = (subcategoryId: string) => {
    onSubcategorySelect(subcategoryId);
    setIsSubcategoryDropdownOpen(false);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowSearchResults(query.length > 0);
    if (onSearch) {
      onSearch(query);
    }
  };

  // Filter sites based on search query
  const filteredSites = searchQuery 
    ? sites.filter(site => 
        site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        site.url.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 10)
    : [];

  const handleColorChange = (color: string) => {
    if (selectedSite && onSiteUpdate) {
      const updatedSite = { ...selectedSite, color };
      onSiteUpdate(updatedSite);
    }
    setIsColorPickerOpen(false);
  };

  const handleNotesChange = (notes: string) => {
    setPersonalNotes(notes);
    setIsNotesChanged(notes !== (selectedSite?.personalNotes || ''));
  };

  const handleSaveNotes = async () => {
    if (selectedSite && onSiteUpdate) {
      try {
        const updatedSite = { ...selectedSite, personalNotes };
        
        // Save to database first
        const response = await fetch(`/api/sites/${selectedSite.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedSite)
        });

        if (response.ok) {
          const savedSite = await response.json();
          onSiteUpdate(savedSite);
          setIsNotesChanged(false);
        } else {
          alert('Notes could not be saved. Please try again.');
        }
      } catch (error) {
        console.error('Error saving notes:', error);
        alert('Notes could not be saved. Please try again.');
      }
    }
  };

  const handleSaveReminder = async (reminderData: {
    title: string;
    description: string;
    reminderDate: string;
    reminderType: 'NOTIFICATION' | 'EMAIL' | 'BOTH';
  }) => {
    try {
      const response = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...reminderData,
          siteId: selectedSite?.id,
        }),
      });

      if (response.ok) {
        const reminder = await response.json();
        console.log('Reminder created:', reminder);
        
        // Update site to show reminder is enabled
        if (selectedSite && onSiteUpdate) {
          onSiteUpdate({ ...selectedSite, reminderEnabled: true });
        }
        
        // Show success notification
        if (Notification.permission === 'granted') {
          new Notification('Reminder Set!', {
            body: `Reminder for ${selectedSite?.name} has been scheduled.`,
            icon: '/icon-192x192.png'
          });
        }
      }
    } catch (error) {
      console.error('Error saving reminder:', error);
    }
  };

  return (
    <div className="h-screen w-full bg-gray-50 dark:bg-gray-900 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
      {/* Top Menu - Categories */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 w-full">
        {/* Header with actions */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">CleanTabs</h2>
          <div className="flex items-center gap-2">
            {onOpenCategoryModal && (
              <button
                onClick={onOpenCategoryModal}
                className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                title="Manage Categories"
              >
                <Settings className="w-4 h-4" />
              </button>
            )}
            {onAddSite && (
              <button
                onClick={onAddSite}
                className="bg-primary-600 text-white px-3 py-2 rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
              >
                Add Site
              </button>
            )}
          </div>
        </div>

        {/* Search Bar - Above Categories */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search sites..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => setShowSearchResults(searchQuery.length > 0)}
            onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
            className="w-full pl-10 pr-10 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-sm text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
          />
          {searchQuery && (
            <button
              onClick={() => handleSearch('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          
          {/* Search Results Dropdown */}
          {showSearchResults && filteredSites.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
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
                      <CreativeIcon
                        name={site.name}
                        url={site.url}
                        customInitials={site.customInitials}
                        size="sm"
                        shape="rounded"
                        color={site.color}
                        favicon={site.favicon || undefined}
                      />
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
        
        <div className="relative w-full">
          <button
            onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
            className="w-full flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
          >
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {selectedCategoryData ? selectedCategoryData.name : 'Select Category'}
            </span>
            <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${
              isCategoryDropdownOpen ? 'rotate-180' : ''
            }`} />
          </button>
          
          {isCategoryDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  onDragOver={(e) => handleDragOver(e, 'category', category.id)}
                  onDragLeave={handleDragLeave}
                  onDrop={(e) => handleDrop(e, 'category', category.id)}
                  onTouchEnd={(e) => handleTouchEnd(e, 'category', category.id)}
                  className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 last:border-b-0 ${
                    selectedCategory === category.id ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'text-gray-900 dark:text-gray-100'
                  } ${
                    dragOverTarget?.type === 'category' && dragOverTarget.id === category.id
                      ? 'ring-2 ring-primary-500 bg-primary-100 dark:bg-primary-900/50'
                      : ''
                  }`}
                >
                  <div className="font-medium">{category.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {category.subcategories?.length || 0} subcategories
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>


      {/* Second Menu - Subcategories */}
      {selectedCategoryData && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 w-full">
          <div className="relative w-full">
            <button
              onClick={() => setIsSubcategoryDropdownOpen(!isSubcategoryDropdownOpen)}
              className="w-full flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
            >
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {selectedSubcategoryData ? selectedSubcategoryData.name : 'Select Subcategory'}
              </span>
              <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${
                isSubcategoryDropdownOpen ? 'rotate-180' : ''
              }`} />
            </button>
            
            {isSubcategoryDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-20 max-h-60 overflow-y-auto">
                {selectedCategoryData.subcategories.map((subcategory) => {
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
                      onTouchStart={(e) => handleTouchStart(e, 'subcategory', subcategory.id)}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={(e) => handleTouchEnd(e, 'subcategory', subcategory.id)}
                      onClick={() => !isDragging && handleSubcategorySelect(subcategory.id)}
                      className={`w-full p-4 text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 last:border-b-0 touch-manipulation ${
                        selectedSubcategory === subcategory.id ? 'bg-accent-50 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400' : 'text-gray-900 dark:text-gray-100'
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
                      <div className="font-medium">{subcategory.name}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {sitesCount} sites
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Sites List - Thin rows, 5 sites per row for desktop, stacked for mobile */}
      {selectedSubcategoryData && sitesInSubcategory.length > 0 && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 w-full">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
            {selectedSubcategoryData.name} Sites
          </h3>
          <div className="space-y-1 max-h-48 overflow-y-auto" style={{ WebkitOverflowScrolling: 'touch' }}>
            {sitesInSubcategory.map((site) => (
              <button
                key={site.id}
                draggable
                onDragStart={(e) => handleDragStart(e, 'site', site.id)}
                onDragEnd={handleDragEnd}
                onTouchStart={(e) => handleTouchStart(e, 'site', site.id)}
                onTouchMove={handleTouchMove}
                onTouchEnd={(e) => handleTouchEnd(e)}
                onClick={() => !isDragging && onSiteSelect(site)}
                className={`w-full p-2 rounded-md border transition-all duration-200 touch-manipulation ${
                  selectedSite?.id === site.id
                    ? 'bg-primary-50 dark:bg-primary-900/30 border-primary-200 dark:border-primary-800'
                    : 'bg-gray-50 dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-600'
                } ${
                  draggedItem?.type === 'site' && draggedItem.id === site.id
                    ? 'opacity-50'
                    : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <CreativeIcon
                    name={site.name}
                    url={site.url}
                    customInitials={site.customInitials}
                    size="sm"
                    shape="circle"
                    color={site.color}
                    favicon={site.favicon || undefined}
                  />
                  <div className="flex-1 text-left min-w-0">
                    <div className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                      {site.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {site.url.replace(/^https?:\/\//, '').split('/')[0]}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selected Site Detail - Bottom */}
      {selectedSite && (
        <div className="bg-white dark:bg-gray-800 p-4 w-full min-h-screen">
          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div 
                  className="cursor-pointer group relative"
                  onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
                >
                  <CreativeIcon
                    name={selectedSite.name}
                    url={selectedSite.url}
                    customInitials={selectedSite.customInitials}
                    size="lg"
                    shape="rounded"
                    color={selectedSite.color}
                    favicon={selectedSite.favicon || undefined}
                    className="shadow-sm"
                  />
                  <div className="absolute inset-0 bg-black/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Palette className="w-4 h-4 text-white" />
                  </div>
                </div>
                
                {/* Color Picker */}
                {isColorPickerOpen && (
                  <div className="absolute top-14 left-0 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3 z-10">
                    <div className="grid grid-cols-5 gap-2">
                      {predefinedColors.map((color) => (
                        <button
                          key={color}
                          className="w-8 h-8 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:scale-110 transition-transform"
                          style={{ backgroundColor: color }}
                          onClick={() => handleColorChange(color)}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-lg">
                  {selectedSite.name}
                </h3>
                <p className="text-primary-600 dark:text-primary-400 text-sm">
                  {selectedSite.url.replace(/^https?:\/\//, '')}
                </p>
              </div>
            </div>

            {/* Description */}
            {selectedSite.description && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Description</h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                  {selectedSite.description}
                </p>
              </div>
            )}

            {/* Tags */}
            {selectedSite.tags && selectedSite.tags.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedSite.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Last Visit */}
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 uppercase tracking-wide">
                Last Visit
              </h4>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 dark:text-gray-400">Last Checked</span>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    <ClientOnly fallback="Loading...">
                      {selectedSite.lastChecked ? new Date(selectedSite.lastChecked).toLocaleDateString('en-US') : 'Unknown'}
                    </ClientOnly>
                  </span>
                </div>
              </div>
            </div>

            {/* Personal Notes */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-wide flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Personal Notes
                </h4>
                {isNotesChanged && (
                  <button
                    onClick={handleSaveNotes}
                    className="flex items-center gap-1 px-3 py-1 text-xs bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
                  >
                    <Save className="w-3 h-3" />
                    Save
                  </button>
                )}
              </div>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                <textarea
                  value={personalNotes}
                  onChange={(e) => handleNotesChange(e.target.value)}
                  placeholder="Add your personal notes about this site..."
                  className="w-full h-24 bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 resize-none border-none outline-none"
                />
              </div>
            </div>

            {/* Sub Links */}
            {selectedSite.subLinks && selectedSite.subLinks.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quick Links</h4>
                <div className="space-y-2">
                  {selectedSite.subLinks.map((link) => (
                    <button
                      key={link.id}
                      onClick={() => window.open(link.url, '_blank')}
                      className="w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {link.name}
                      </span>
                      <ExternalLink className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={async () => {
                  // Update last checked date before opening
                  if (selectedSite && onSiteUpdate) {
                    const updatedSite = { ...selectedSite, lastChecked: new Date().toISOString() };
                    try {
                      const response = await fetch(`/api/sites/${selectedSite.id}`, {
                        method: 'PUT',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(updatedSite)
                      });

                      if (response.ok) {
                        const savedSite = await response.json();
                        onSiteUpdate(savedSite);
                      }
                    } catch (error) {
                      console.error('Error updating last checked date:', error);
                    }
                  }
                  window.open(selectedSite.url, '_blank');
                }}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4" />
                Visit Site
              </button>
              
              {/* Secondary Actions */}
              <div className="flex gap-2">
                {onEditSite && (
                  <button
                    onClick={() => onEditSite(selectedSite)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                )}
                <button
                  onClick={() => setShowReminderModal(true)}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                    selectedSite.reminderEnabled
                      ? 'bg-accent-100 dark:bg-accent-900/30 text-accent-600 dark:text-accent-400 hover:bg-accent-200 dark:hover:bg-accent-900/50'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  title="Set Reminder"
                >
                  <Bell className="w-4 h-4" />
                </button>
                {onDeleteSite && (
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this site?')) {
                        onDeleteSite(selectedSite.id);
                      }
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
                    title="Delete Site"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State - No category selected */}
      {!selectedCategory && (
        <div className="bg-white dark:bg-gray-800 p-8 w-full min-h-screen flex items-center justify-center">
          <div className="text-center w-full max-w-sm">
            <div className="w-16 h-16 bg-primary-100 dark:bg-primary-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExternalLink className="w-8 h-8 text-primary-600 dark:text-primary-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Welcome!</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Select a category above to get started
            </p>
          </div>
        </div>
      )}

      {/* Empty State - No sites in subcategory */}
      {!selectedSite && selectedSubcategoryData && sitesInSubcategory.length === 0 && (
        <div className="bg-white dark:bg-gray-800 p-8 w-full min-h-screen flex items-center justify-center">
          <div className="text-center w-full max-w-sm">
            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <ExternalLink className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No Sites</h3>
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              No sites found in this subcategory
            </p>
          </div>
        </div>
      )}

      {/* Reminder Modal */}
      {selectedSite && (
        <ReminderModal
          isOpen={showReminderModal}
          onClose={() => setShowReminderModal(false)}
          siteId={selectedSite.id}
          siteName={selectedSite.name}
          onSave={handleSaveReminder}
        />
      )}
    </div>
  );
}