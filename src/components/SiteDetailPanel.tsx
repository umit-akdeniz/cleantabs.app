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

  // Update local state when site changes
  React.useEffect(() => {
    if (site) {
      setCustomInitials(site.customInitials || '');
      setPersonalNotes(site.personalNotes || '');
      setIsNotesChanged(false);
    }
  }, [site]);
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
      <div className="flex-1 h-full bg-white dark:bg-gray-800 flex items-center justify-center">
        <div className="text-center p-8">
          <div className="w-16 h-16 bg-gray-100 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <ExternalLink className="w-8 h-8 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">Site Details</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Select a site to view details
          </p>
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
      const response = await fetch('/api/reminders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...reminderData,
          siteId: site?.id,
        }),
      });

      if (response.ok) {
        const reminder = await response.json();
        console.log('Reminder created:', reminder);
        
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
      }
    } catch (error) {
      console.error('Error saving reminder:', error);
    }
  };

  return (
    <div className="flex-1 h-full bg-white dark:bg-gray-800 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
        {/* Mobile Back Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
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
                <div className="absolute top-14 left-0 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-3 z-10">
                  <div className="grid grid-cols-5 gap-2">
                    {predefinedColors.map((color, index) => (
                      <button
                        key={color || `option-${index}`}
                        className={`w-8 h-8 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:scale-110 transition-transform flex items-center justify-center ${
                          color === null ? 'bg-gray-100 dark:bg-gray-700' : 
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
                          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">✕</span>
                        )}
                        {color === 'transparent' && (
                          <span className="text-xs text-gray-600 dark:text-gray-400 font-medium">◯</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100 text-xl">
                {site.name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
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
                    className="text-xs p-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    maxLength={2}
                    autoFocus
                  />
                </div>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {site.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            {site.description}
          </p>
        )}

        <div className="flex gap-3">
          <button
            onClick={() => openUrl(site.url)}
            className="flex-1 flex items-center justify-center gap-2 gradient-primary text-white px-4 py-2.5 rounded-xl hover:opacity-90 transition-all text-sm font-medium shadow-sm"
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
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
            About Site
          </h4>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            {site.description || 'No description available'}
          </div>
        </div>

        {/* Last Visit */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
            Last Visit
          </h4>
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Last Checked</span>
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                <ClientOnly fallback="Loading...">
                  {site.lastChecked ? new Date(site.lastChecked).toLocaleDateString('en-US') : 'Unknown'}
                </ClientOnly>
              </span>
            </div>
          </div>
        </div>


        {/* Personal Notes */}
        <div>
          <div className="flex items-center justify-between mb-3">
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
          <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4">
            <textarea
              value={personalNotes}
              onChange={(e) => handleNotesChange(e.target.value)}
              placeholder="Add your personal notes about this site..."
              className="w-full h-32 bg-transparent text-sm text-gray-700 dark:text-gray-300 placeholder-gray-400 dark:placeholder-gray-500 resize-none border-none outline-none"
            />
          </div>
        </div>

        {/* Related Links */}
        {site.subLinks && site.subLinks.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 uppercase tracking-wide">
              Related Links
            </h4>
            <div className="space-y-3">
              {site.subLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => openUrl(link.url)}
                  className="w-full text-left p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors group border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: site.color || '#10b981' }}
                    >
                      <ExternalLink className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">
                        {link.name}
                      </div>
                      {link.description && (
                        <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                          {link.description}
                        </div>
                      )}
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
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