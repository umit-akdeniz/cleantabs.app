'use client';

import { useState } from 'react';
import React from 'react';
import { Site } from '@/types';
import ReminderModal from './ReminderModal';
import CreativeIcon from './CreativeIcon';
import ClientOnly from './ClientOnly';
import { ExternalLink, Edit, Trash2, Calendar, Clock, Bell, BellOff, Tag, X, Palette, FileText, Save, ArrowLeft } from 'lucide-react';

interface SiteDetailPanelProps {
  site: Site | null;
  onEdit: (site: Site) => void;
  onUpdate?: (site: Site) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

const predefinedColors = [
  null, // No color option
  'transparent', // Transparent option
  '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#f59e0b', 
  '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
];

export default function SiteDetailPanel({ site, onEdit, onUpdate, onDelete, onClose }: SiteDetailPanelProps) {
  const [isColorPickerOpen, setIsColorPickerOpen] = useState(false);
  const [customInitials, setCustomInitials] = useState('');
  const [isEditingInitials, setIsEditingInitials] = useState(false);
  const [showReminderModal, setShowReminderModal] = useState(false);
  const [personalNotes, setPersonalNotes] = useState('');
  const [isNotesChanged, setIsNotesChanged] = useState(false);
  const [aboutDescription, setAboutDescription] = useState('');
  const [isAboutChanged, setIsAboutChanged] = useState(false);

  // Save any pending changes before switching sites
  const savePendingChanges = async () => {
    if (isNotesChanged && site && onUpdate) {
      try {
        const updatedSite = { ...site, personalNotes };
        const response = await fetch(`/api/sites/${site.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedSite)
        });
        if (response.ok) {
          const savedSite = await response.json();
          onUpdate(savedSite);
        }
      } catch (error) {
        console.error('Error auto-saving notes:', error);
      }
    }
    
    if (isAboutChanged && site && onUpdate) {
      try {
        const updatedSite = { ...site, description: aboutDescription };
        const response = await fetch(`/api/sites/${site.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedSite)
        });
        if (response.ok) {
          const savedSite = await response.json();
          onUpdate(savedSite);
        }
      } catch (error) {
        console.error('Error auto-saving description:', error);
      }
    }
  };

  // Update local state when site changes
  React.useEffect(() => {
    // Save any pending changes from previous site before switching
    if (isNotesChanged || isAboutChanged) {
      savePendingChanges();
    }
    
    if (site) {
      setCustomInitials(site.customInitials || '');
      setPersonalNotes(site.personalNotes || '');
      setAboutDescription(site.description || '');
      setIsNotesChanged(false);
      setIsAboutChanged(false);
    }
  }, [site?.id]); // Only trigger when site ID changes
  const handleColorChange = (color: string | null) => {
    if (site && onUpdate) {
      const updatedSite = { ...site, color: color || undefined };
      onUpdate(updatedSite);
    }
    setIsColorPickerOpen(false);
  };

  const handleInitialsChange = (initials: string) => {
    setCustomInitials(initials);
    if (site && onUpdate) {
      const updatedSite = { ...site, customInitials: initials };
      onUpdate(updatedSite);
    }
  };

  const handleInitialsBlur = () => {
    setIsEditingInitials(false);
    if (site && onUpdate && customInitials !== site.customInitials) {
      const updatedSite = { ...site, customInitials };
      onUpdate(updatedSite);
    }
  };

  const getDisplayInitials = () => {
    if (site?.customInitials) return site.customInitials.slice(0, 2).toUpperCase();
    if (customInitials) return customInitials.slice(0, 2).toUpperCase();
    if (site) {
      return site.name.split(' ').map(word => word.charAt(0).toUpperCase()).join('').slice(0, 2);
    }
    return '';
  };

  if (!site) {
    return (
      <div className="flex-1 h-full bg-white dark:bg-slate-800 flex flex-col">
        {/* Welcome Section */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="max-w-md text-center">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-4">
              <ExternalLink className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-3">Welcome to CleanTabs</h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 leading-relaxed">
              Organize your favorite websites with our clean, minimal interface. Create categories, 
              manage subcategories, and keep all your important links in one place.
            </p>
            
            {/* Quick Guide */}
            <div className="space-y-3 text-left bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4">
              <h3 className="font-medium text-slate-900 dark:text-slate-100 text-sm mb-2">How to get started:</h3>
              <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-1 h-1 bg-blue-500 rounded-full mt-1.5"></span>
                  <span>Select a category from the left panel</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-1 h-1 bg-blue-500 rounded-full mt-1.5"></span>
                  <span>Choose a subcategory to view your sites</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="flex-shrink-0 w-1 h-1 bg-blue-500 rounded-full mt-1.5"></span>
                  <span>Click on any site to view details here</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const openUrl = async (url: string) => {
    // Update last checked date before opening
    if (site && onUpdate) {
      const currentDate = new Date().toISOString();
      const updatedSite = { ...site, lastChecked: currentDate };
      
      try {
        const response = await fetch(`/api/sites/${site.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedSite)
        });

        if (response.ok) {
          const savedSite = await response.json();
          onUpdate(savedSite);
          console.log('Last checked date updated:', savedSite.lastChecked);
        } else {
          console.error('Failed to update last checked date');
        }
      } catch (error) {
        console.error('Error updating last checked date:', error);
      }
    }
    
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleNotesChange = (notes: string) => {
    setPersonalNotes(notes);
    setIsNotesChanged(notes !== (site?.personalNotes || ''));
  };

  const handleAboutChange = (description: string) => {
    // Limit to 240 characters
    const limitedDescription = description.slice(0, 240);
    setAboutDescription(limitedDescription);
    setIsAboutChanged(limitedDescription !== (site?.description || ''));
  };

  const handleSaveAbout = async () => {
    if (site && onUpdate) {
      try {
        const updatedSite = { ...site, description: aboutDescription };
        
        // Save to database first
        const response = await fetch(`/api/sites/${site.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedSite)
        });

        if (response.ok) {
          const savedSite = await response.json();
          onUpdate(savedSite);
          setIsAboutChanged(false);
          console.log('About description saved successfully');
          // Show success notification
          if (typeof window !== 'undefined') {
            const { showToast } = require('@/components/Toast');
            showToast({
              type: 'success',
              title: 'Saved!',
              message: 'About description updated successfully.'
            });
          }
        } else {
          const error = await response.text();
          console.error('Failed to save about description:', error);
          // Use toast notification instead of alert
          if (typeof window !== 'undefined') {
            const { showToast } = require('@/components/Toast');
            showToast({
              type: 'error',
              title: 'Error',
              message: 'About description could not be saved. Please try again.'
            });
          }
        }
      } catch (error) {
        console.error('Error saving about description:', error);
        // Use toast notification instead of alert
        if (typeof window !== 'undefined') {
          const { showToast } = require('@/components/Toast');
          showToast({
            type: 'error',
            title: 'Error',
            message: 'About description could not be saved. Please try again.'
          });
        }
      }
    }
  };

  const handleSaveNotes = async () => {
    if (site && onUpdate) {
      try {
        const updatedSite = { ...site, personalNotes };
        
        // Save to database first
        const response = await fetch(`/api/sites/${site.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedSite)
        });

        if (response.ok) {
          const savedSite = await response.json();
          onUpdate(savedSite);
          setIsNotesChanged(false);
          console.log('Notes saved successfully');
          // Show success notification
          if (typeof window !== 'undefined') {
            const { showToast } = require('@/components/Toast');
            showToast({
              type: 'success',
              title: 'Saved!',
              message: 'Personal notes updated successfully.'
            });
          }
        } else {
          const error = await response.text();
          console.error('Failed to save notes:', error);
          // Use toast notification instead of alert
          if (typeof window !== 'undefined') {
            const { showToast } = require('@/components/Toast');
            showToast({
              type: 'error',
              title: 'Error',
              message: 'Notes could not be saved. Please try again.'
            });
          }
        }
      } catch (error) {
        console.error('Error saving notes:', error);
        // Use toast notification instead of alert
        if (typeof window !== 'undefined') {
          const { showToast } = require('@/components/Toast');
          showToast({
            type: 'error',
            title: 'Error',
            message: 'Notes could not be saved. Please try again.'
          });
        }
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
      console.log('Creating reminder with data:', reminderData, 'siteId:', site?.id);
      
      const response = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...reminderData,
          siteId: site?.id,
        }),
      });

      console.log('Response status:', response.status);
      
      if (response.ok) {
        const reminder = await response.json();
        console.log('Reminder created successfully:', reminder);
        
        // Update site to show reminder is enabled
        if (site && onUpdate) {
          onUpdate({ ...site, reminderEnabled: true });
        }
        
        // Show success notification
        if (Notification.permission === 'granted') {
          new Notification('Reminder Set!', {
            body: `Reminder for ${site?.name} has been scheduled.`,
            icon: '/icon-192x192.png'
          });
        }
      } else {
        const errorData = await response.text();
        console.error('Failed to create reminder:', response.status, errorData);
      }
    } catch (error) {
      console.error('Error saving reminder:', error);
    }
  };

  return (
    <div className="flex-1 h-full bg-slate-50 dark:bg-slate-900 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-slate-200 dark:border-slate-700">
        {/* Mobile Back Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back to Sites</span>
          </button>
        </div>
        
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div 
                className="cursor-pointer group relative"
                onClick={() => setIsColorPickerOpen(!isColorPickerOpen)}
              >
                <CreativeIcon
                  key={`${site.id}-${site.color}-${customInitials}`}
                  name={site.name}
                  url={site.url}
                  customInitials={customInitials}
                  size="xl"
                  shape="rounded"
                  color={site.color}
                  favicon={site.favicon || undefined}
                  className="shadow-sm"
                />
                <div className="absolute inset-0 bg-black/20 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Palette className="w-4 h-4 text-white" />
                </div>
              </div>
              
              {/* Color Picker */}
              {isColorPickerOpen && (
                <div className="absolute top-14 left-0 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-3 z-10">
                  <div className="grid grid-cols-5 gap-2">
                    {predefinedColors.map((color, index) => (
                      <button
                        key={color || `option-${index}`}
                        className={`w-8 h-8 rounded-lg border-2 border-slate-200 dark:border-slate-600 hover:scale-110 transition-transform flex items-center justify-center ${
                          color === null ? 'bg-slate-100 dark:bg-slate-700' : 
                          color === 'transparent' ? 'bg-transparent border-dashed' : ''
                        }`}
                        style={color && color !== 'transparent' && color !== null ? { backgroundColor: color } : {}}
                        onClick={() => handleColorChange(color)}
                        title={
                          color === null ? 'No Color' : 
                          color === 'transparent' ? 'Transparent' : 
                          color
                        }
                      >
                        {color === null && (
                          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">✕</span>
                        )}
                        {color === 'transparent' && (
                          <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">◯</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-xl">
                {site.name.charAt(0).toUpperCase() + site.name.slice(1).toLowerCase()}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {site.url.replace(/^https?:\/\//, '')}
              </p>
              
              {/* Initials Editor */}
              {isEditingInitials && (
                <div className="mt-2">
                  <input
                    type="text"
                    value={customInitials}
                    onChange={(e) => handleInitialsChange(e.target.value)}
                    onBlur={handleInitialsBlur}
                    onKeyPress={(e) => e.key === 'Enter' && handleInitialsBlur()}
                    placeholder="Initials (max 2)"
                    className="text-xs p-1 border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100"
                    maxLength={2}
                    autoFocus
                  />
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {site.description && (
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">
            {site.description}
          </p>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => openUrl(site.url)}
            className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors text-sm font-medium"
          >
            <ExternalLink className="w-4 h-4" />
            Open Site
          </button>
          <button
            onClick={() => setShowReminderModal(true)}
            className={`p-2.5 rounded-xl transition-colors ${
              site.reminderEnabled
                ? 'text-accent-600 dark:text-accent-400 bg-accent-50 dark:bg-accent-900/20 hover:bg-accent-100 dark:hover:bg-accent-900/30'
                : 'text-brand-500 dark:text-brand-400 hover:text-accent-600 dark:hover:text-accent-400 hover:bg-accent-50 dark:hover:bg-accent-900/20'
            }`}
            title="Set Reminder"
          >
            <Bell className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(site)}
            className="p-2.5 text-brand-500 dark:text-brand-400 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-xl transition-colors"
            title="Edit Site"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(site.id)}
            className="p-2.5 text-brand-500 dark:text-brand-400 hover:text-danger-600 dark:hover:text-danger-400 hover:bg-danger-50 dark:hover:bg-danger-900/20 rounded-xl transition-colors"
            title="Delete Site"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 lg:space-y-6 custom-scrollbar">
        {/* About Site */}
        <div className="relative">
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 tracking-wide mb-3">
            About site
          </h4>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700">
            <textarea
              value={aboutDescription}
              onChange={(e) => handleAboutChange(e.target.value)}
              placeholder="Add a description for this site..."
              maxLength={240}
              className="w-full h-20 bg-transparent text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 resize-none border-none outline-none"
            />
            <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-200 dark:border-slate-600">
              <span className="text-xs text-slate-500 dark:text-slate-400">About this website</span>
              <span className={`text-xs ${
                aboutDescription.length > 220 
                  ? 'text-orange-500 dark:text-orange-400' 
                  : aboutDescription.length > 200 
                    ? 'text-yellow-500 dark:text-yellow-400'
                    : 'text-slate-500 dark:text-slate-400'
              }`}>
                {aboutDescription.length}/240
              </span>
            </div>
          </div>
          {isAboutChanged && (
            <button
              onClick={handleSaveAbout}
              className="absolute top-0 right-0 flex items-center gap-1 px-3 py-1 text-xs bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors shadow-sm"
            >
              <Save className="w-3 h-3" />
              Save
            </button>
          )}
        </div>



        {/* Personal Notes */}
        <div className="flex-1 flex flex-col relative">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 tracking-wide flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Personal notes
            </h4>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 flex-1 flex flex-col">
            <textarea
              value={personalNotes}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Add your personal notes about this site..."
              className="w-full flex-1 bg-transparent text-sm text-slate-700 dark:text-slate-300 placeholder-slate-400 dark:placeholder-slate-500 resize-none border-none outline-none min-h-[200px]"
            />
            <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <Clock className="w-3 h-3" />
                <span>Last visited:</span>
                <ClientOnly fallback="Loading...">
                  {site.lastChecked ? new Date(site.lastChecked).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  }) : 'Never'}
                </ClientOnly>
              </div>
            </div>
          </div>
          {isNotesChanged && (
            <button
              onClick={handleSaveNotes}
              className="absolute top-0 right-0 flex items-center gap-1 px-3 py-1 text-xs bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors shadow-sm"
            >
              <Save className="w-3 h-3" />
              Save
            </button>
          )}
        </div>

        {/* Related Links */}
        {site.subLinks && site.subLinks.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 tracking-wide">
              Related links
            </h4>
            <div className="space-y-3">
              {site.subLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => openUrl(link.url)}
                  className="w-full text-left p-4 bg-slate-50 dark:bg-slate-700 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-600 transition-colors group border border-slate-200 dark:border-slate-600"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: site.color || '#10b981' }}
                    >
                      <ExternalLink className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate">
                        {link.name}
                      </div>
                      {link.description && (
                        <div className="text-xs text-slate-500 dark:text-slate-400 truncate mt-1">
                          {link.description}
                        </div>
                      )}
                    </div>
                    <ExternalLink className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300 transition-colors" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Reminder Modal */}
      {site && (
        <ReminderModal
          isOpen={showReminderModal}
          onClose={() => setShowReminderModal(false)}
          siteId={site.id}
          siteName={site.name}
          onSave={handleSaveReminder}
        />
      )}
    </div>
  );
}