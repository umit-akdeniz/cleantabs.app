'use client';

import { useState, useEffect, useRef } from 'react';
import { Site, SubLink } from '@/types';
import { Category } from '@/types';
import { fetchFavicon } from '@/lib/favicon';
import { generateId } from '@/lib/utils';
import { X, Plus, Trash2, Palette } from 'lucide-react';
import IconRenderer from './IconRenderer';

interface AddSiteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (site: Site) => void;
  editingSite?: Site | null;
  categories: Category[];
  defaultCategoryId?: string;
  defaultSubcategoryId?: string;
}

export default function AddSiteModal({ isOpen, onClose, onSave, editingSite, categories, defaultCategoryId, defaultSubcategoryId }: AddSiteModalProps) {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [subLinks, setSubLinks] = useState<SubLink[]>([]);
  const [categoryId, setCategoryId] = useState('');
  const [subcategoryId, setSubcategoryId] = useState('');
  const [favicon, setFavicon] = useState<string | null>(null);
  const [isLoadingFavicon, setIsLoadingFavicon] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#10b981');
  const [customInitials, setCustomInitials] = useState('');
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editingSite) {
      setName(editingSite.name);
      setUrl(editingSite.url);
      setSubLinks(editingSite.subLinks);
      setCategoryId(editingSite.categoryId || '');
      setSubcategoryId(editingSite.subcategoryId || '');
      setFavicon(editingSite.favicon || null);
      setTags(editingSite.tags || []);
      setDescription(editingSite.description || '');
      setColor(editingSite.color || '#10b981');
      setCustomInitials(editingSite.customInitials || '');
    } else {
      setName('');
      setUrl('');
      setSubLinks([]);
      setCategoryId(defaultCategoryId || '');
      setSubcategoryId(defaultSubcategoryId || '');
      setFavicon(null);
      setTags([]);
      setDescription('');
      setColor('#10b981');
      setCustomInitials('');
    }
  }, [editingSite, isOpen, defaultCategoryId, defaultSubcategoryId]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  const handleUrlChange = async (newUrl: string) => {
    setUrl(newUrl);
    
    if (newUrl && newUrl.startsWith('http')) {
      setIsLoadingFavicon(true);
      try {
        const faviconUrl = await fetchFavicon(newUrl);
        setFavicon(faviconUrl);
      } catch (error) {
        console.error('Error fetching favicon:', error);
      } finally {
        setIsLoadingFavicon(false);
      }
    }
  };

  const addSubLink = () => {
    const newSubLink: SubLink = {
      id: generateId('sublink'),
      name: '',
      url: '',
      description: ''
    };
    setSubLinks([...subLinks, newSubLink]);
  };

  const updateSubLink = (id: string, field: keyof SubLink, value: string) => {
    setSubLinks(subLinks.map(link => 
      link.id === id ? { ...link, [field]: value } : link
    ));
  };

  const removeSubLink = (id: string) => {
    setSubLinks(subLinks.filter(link => link.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url || !categoryId || !subcategoryId) return;

    // Site sayısını kontrol et (sadece yeni site eklerken)
    if (!editingSite) {
      // Bu kontrolü parent component'te yapmak daha doğru olur ama burada da ekleyelim
      // Geçici olarak sites array'ini alamadığımız için warning verelim
      console.warn('Site limit kontrolü yapılacak...');
    }

    const validSubLinks = subLinks.filter(link => link.name && link.url);

    const site: Site = {
      id: editingSite?.id || Date.now().toString(),
      name,
      url,
      subLinks: validSubLinks,
      categoryId,
      subcategoryId,
      favicon: favicon || undefined,
      tags,
      description,
      color,
      customInitials,
      reminderEnabled: editingSite?.reminderEnabled || false
    };

    onSave(site);
    onClose();
  };

  const addTag = (tagName: string) => {
    if (tagName.trim() && !tags.includes(tagName.trim())) {
      setTags([...tags, tagName.trim()]);
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const selectedCategory = categories.find(c => c.id === categoryId);
  const availableSubcategories = selectedCategory?.subcategories || [];

  const predefinedColors = [
    '#10b981', '#3b82f6', '#8b5cf6', '#ef4444', '#f59e0b', 
    '#ec4899', '#06b6d4', '#84cc16', '#f97316', '#6366f1'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div ref={modalRef} className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {editingSite ? 'Edit Site' : 'Add New Site'}
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  setSubcategoryId('');
                }}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
              >
                <option value="">Select category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Subcategory *
              </label>
              <select
                value={subcategoryId}
                onChange={(e) => setSubcategoryId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                required
                disabled={!categoryId}
              >
                <option value="">Select subcategory</option>
                {availableSubcategories.map((subcategory) => (
                  <option key={subcategory.id} value={subcategory.id}>
                    {subcategory.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Site Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g. Google"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="Brief description of the site"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Site URL *
            </label>
            <div className="flex gap-2">
              <input
                type="url"
                value={url}
                onChange={(e) => handleUrlChange(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="https://example.com"
                required
              />
              {isLoadingFavicon && (
                <div className="flex items-center px-3">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                </div>
              )}
            </div>
          </div>

          {/* Color and Initials Section */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Icon Color
              </label>
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-lg flex items-center justify-center cursor-pointer border-2 border-gray-300"
                  style={{ backgroundColor: color }}
                >
                  <span className="text-white font-bold text-sm" style={{ fontFamily: 'Inter, Arial, sans-serif', textShadow: '0 1px 2px rgba(0,0,0,0.5)' }}>
                    {customInitials || name.split(' ').map(word => word.charAt(0).toUpperCase()).join('').slice(0, 2)}
                  </span>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {predefinedColors.map((colorOption) => (
                    <button
                      key={colorOption}
                      type="button"
                      className="w-6 h-6 rounded border-2 border-gray-300 hover:scale-110 transition-transform"
                      style={{ backgroundColor: colorOption }}
                      onClick={() => setColor(colorOption)}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Custom Initials (Optional)
              </label>
              <input
                type="text"
                value={customInitials}
                onChange={(e) => setCustomInitials(e.target.value.slice(0, 2).toUpperCase())}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="DN"
                maxLength={2}
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Leave empty to use site name initials
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tags
            </label>
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Add a tag and press Enter"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag(e.currentTarget.value);
                    e.currentTarget.value = '';
                  }
                }}
              />
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 border border-blue-200 rounded-md dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-blue-600 dark:hover:text-blue-200"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Quick Links
              </label>
              <button
                type="button"
                onClick={addSubLink}
                className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                Add Link
              </button>
            </div>

            <div className="space-y-3">
              {subLinks.map((subLink) => (
                <div key={subLink.id} className="border dark:border-gray-600 rounded-md p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick Link</h4>
                    <button
                      type="button"
                      onClick={() => removeSubLink(subLink.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Link name"
                    value={subLink.name}
                    onChange={(e) => updateSubLink(subLink.id, 'name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                  <input
                    type="url"
                    placeholder="https://example.com/link"
                    value={subLink.url}
                    onChange={(e) => updateSubLink(subLink.id, 'url', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                  <input
                    type="text"
                    placeholder="Description (optional)"
                    value={subLink.description}
                    onChange={(e) => updateSubLink(subLink.id, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 font-medium"
            >
              {editingSite ? 'Update Site' : 'Add Site'}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 font-medium"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}