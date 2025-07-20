'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Plus, Edit3, Trash2, Save, Folder, FolderPlus, Check } from 'lucide-react';
import { Category } from '@/types';
import { showToast } from './Toast';

interface CategoryManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onAddCategory: (name: string) => void;
  onAddSubcategory: (categoryId: string, name: string) => void;
  onUpdateCategory?: (categoryId: string, name: string) => void;
  onUpdateSubcategory?: (categoryId: string, subcategoryId: string, name: string) => void;
  onDeleteCategory?: (categoryId: string) => void;
  onDeleteSubcategory?: (categoryId: string, subcategoryId: string) => void;
  selectedCategoryId?: string | null;
}

export default function CategoryManagementModal({
  isOpen,
  onClose,
  categories,
  onAddCategory,
  onAddSubcategory,
  onUpdateCategory,
  onUpdateSubcategory,
  onDeleteCategory,
  onDeleteSubcategory,
  selectedCategoryId
}: CategoryManagementModalProps) {
  const [activeTab, setActiveTab] = useState<'manage' | 'add'>('manage');
  const [editingCategory, setEditingCategory] = useState<string | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<string | null>(null);
  const [editCategoryName, setEditCategoryName] = useState('');
  const [editSubcategoryName, setEditSubcategoryName] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [selectedCategoryIdForSubcategory, setSelectedCategoryIdForSubcategory] = useState('');
  const [deleteStates, setDeleteStates] = useState<{[key: string]: boolean}>({});
  const modalRef = useRef<HTMLDivElement>(null);

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

  // Auto-select category and switch to add tab when selectedCategoryId is provided
  useEffect(() => {
    if (isOpen && selectedCategoryId) {
      setActiveTab('add');
      setSelectedCategoryIdForSubcategory(selectedCategoryId);
    }
  }, [isOpen, selectedCategoryId]);

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      if (categories.length >= 10) {
        alert('Maximum 10 main categories allowed!');
        return;
      }
      onAddCategory(newCategoryName.trim());
      setNewCategoryName('');
    }
  };

  const handleAddSubcategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubcategoryName.trim() && selectedCategoryIdForSubcategory) {
      const selectedCategory = Array.isArray(categories) ? categories.find(c => c.id === selectedCategoryIdForSubcategory) : null;
      if (selectedCategory && Array.isArray(selectedCategory.subcategories) && selectedCategory.subcategories.length >= 15) {
        alert('Maximum 15 subcategories per category allowed!');
        return;
      }
      onAddSubcategory(selectedCategoryIdForSubcategory, newSubcategoryName.trim());
      setNewSubcategoryName('');
    }
  };

  const startEditingCategory = (categoryId: string, currentName: string) => {
    setEditingCategory(categoryId);
    setEditCategoryName(currentName);
  };

  const startEditingSubcategory = (subcategoryId: string, currentName: string) => {
    setEditingSubcategory(subcategoryId);
    setEditSubcategoryName(currentName);
  };

  const saveEditCategory = () => {
    if (editingCategory && editCategoryName.trim() && onUpdateCategory) {
      onUpdateCategory(editingCategory, editCategoryName.trim());
      setEditingCategory(null);
      setEditCategoryName('');
    }
  };

  const saveEditSubcategory = (categoryId: string) => {
    if (editingSubcategory && editSubcategoryName.trim() && onUpdateSubcategory) {
      onUpdateSubcategory(categoryId, editingSubcategory, editSubcategoryName.trim());
      setEditingSubcategory(null);
      setEditSubcategoryName('');
    }
  };

  const cancelEdit = () => {
    setEditingCategory(null);
    setEditingSubcategory(null);
    setEditCategoryName('');
    setEditSubcategoryName('');
  };

  const handleDeleteClick = (type: 'category' | 'subcategory', id: string, categoryId?: string) => {
    const key = `${type}-${id}`;
    
    if (deleteStates[key]) {
      // Second click - actually delete
      if (type === 'category' && onDeleteCategory) {
        console.log('🗑️ Deleting category:', id);
        onDeleteCategory(id);
        showToast({
          type: 'success',
          title: 'Category deleted',
          message: 'Category has been successfully deleted',
          duration: 3000
        });
      } else if (type === 'subcategory' && onDeleteSubcategory && categoryId) {
        console.log('🗑️ Deleting subcategory:', id, 'from category:', categoryId);
        onDeleteSubcategory(categoryId, id);
        showToast({
          type: 'success',
          title: 'Subcategory deleted',
          message: 'Subcategory has been successfully deleted',
          duration: 3000
        });
      }
      
      // Reset delete state
      setDeleteStates(prev => ({ ...prev, [key]: false }));
    } else {
      // First click - activate delete mode
      setDeleteStates(prev => ({ ...prev, [key]: true }));
      
      // Reset after 3 seconds if no second click
      setTimeout(() => {
        setDeleteStates(prev => ({ ...prev, [key]: false }));
      }, 3000);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div 
        ref={modalRef}
        className="bg-white dark:bg-slate-800 rounded-lg w-[700px] max-w-[95vw] h-[500px] max-h-[95vh] overflow-hidden shadow-xl border border-slate-200 dark:border-slate-700"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-medium text-slate-900 dark:text-slate-100">
            Category Management
          </h2>
          <button 
            onClick={onClose} 
            className="p-1 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('manage')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'manage'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Manage
          </button>
          <button
            onClick={() => setActiveTab('add')}
            className={`flex-1 px-4 py-3 text-sm font-medium transition-colors ${
              activeTab === 'add'
                ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Add New
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto h-[400px]">
          {activeTab === 'manage' ? (
            /* Manage Categories Tab */
            <div className="p-4">
              {categories.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Folder className="w-6 h-6 text-slate-500 dark:text-slate-400" />
                  </div>
                  <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-2">No categories yet</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                    Create your first category to get started
                  </p>
                  <button
                    onClick={() => setActiveTab('add')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors"
                  >
                    Add Category
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {Array.isArray(categories) ? categories.map((category) => (
                    <div key={category.id} className="border border-slate-200 dark:border-slate-700 rounded p-3">
                      {/* Category Header */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          {editingCategory === category.id ? (
                            <div className="flex items-center gap-3">
                              <input
                                type="text"
                                value={editCategoryName}
                                onChange={(e) => setEditCategoryName(e.target.value)}
                                className="px-3 py-2 text-lg font-semibold border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') saveEditCategory();
                                  if (e.key === 'Escape') cancelEdit();
                                }}
                                autoFocus
                              />
                              <button
                                onClick={saveEditCategory}
                                className="p-2 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                              <button
                                onClick={cancelEdit}
                                className="p-2 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <h3 className="font-medium text-slate-900 dark:text-slate-100">
                                {category.name}
                              </h3>
                              <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400 rounded">
                                {category.subcategories?.length || 0}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        {editingCategory !== category.id && (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => startEditingCategory(category.id, category.name)}
                              className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-200"
                              title="Edit Category"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleDeleteClick('category', category.id);
                              }}
                              className={`p-2 rounded transition-all duration-200 ${
                                deleteStates[`category-${category.id}`]
                                  ? 'text-red-600 bg-red-50 dark:bg-red-900/30 scale-110 animate-pulse'
                                  : 'text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30'
                              }`}
                              title={deleteStates[`category-${category.id}`] ? "Click again to delete" : "Delete Category"}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>

                      {/* Subcategories */}
                      {category.subcategories && category.subcategories.length > 0 && (
                        <div>
                          <h4 className="text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">Subcategories:</h4>
                          <div className="grid grid-cols-2 gap-2">
                            {Array.isArray(category.subcategories) ? category.subcategories.map((subcategory) => (
                              <div key={subcategory.id} className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-700/50 rounded">
                                {editingSubcategory === subcategory.id ? (
                                  <div className="flex items-center gap-2 flex-1">
                                    <input
                                      type="text"
                                      value={editSubcategoryName}
                                      onChange={(e) => setEditSubcategoryName(e.target.value)}
                                      className="flex-1 px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-blue-500"
                                      onKeyDown={(e) => {
                                        if (e.key === 'Enter') saveEditSubcategory(category.id);
                                        if (e.key === 'Escape') cancelEdit();
                                      }}
                                      autoFocus
                                    />
                                    <button
                                      onClick={() => saveEditSubcategory(category.id)}
                                      className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded"
                                    >
                                      <Check className="w-3 h-3" />
                                    </button>
                                    <button
                                      onClick={cancelEdit}
                                      className="p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ) : (
                                  <>
                                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300 flex-1">
                                      {subcategory.name}
                                    </span>
                                    <div className="flex items-center gap-1">
                                      <button
                                        onClick={() => startEditingSubcategory(subcategory.id, subcategory.name)}
                                        className="p-1 text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded transition-colors"
                                        title="Edit Subcategory"
                                      >
                                        <Edit3 className="w-3 h-3" />
                                      </button>
                                      <button
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          handleDeleteClick('subcategory', subcategory.id, category.id);
                                        }}
                                        className={`p-1 rounded transition-all duration-200 ${
                                          deleteStates[`subcategory-${subcategory.id}`]
                                            ? 'text-red-600 bg-red-50 dark:bg-red-900/30 scale-110 animate-pulse'
                                            : 'text-slate-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30'
                                        }`}
                                        title={deleteStates[`subcategory-${subcategory.id}`] ? "Click again to delete" : "Delete Subcategory"}
                                      >
                                        <Trash2 className="w-3 h-3" />
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            )) : []}
                          </div>
                        </div>
                      )}
                    </div>
                  )) : []}
                </div>
              )}
            </div>
          ) : (
            /* Add New Tab */
            <div className="p-4 space-y-4">
              {/* Add Category Section */}
              <div className="border border-slate-200 dark:border-slate-700 rounded p-4">
                <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-3">Add Category</h3>
                <form onSubmit={handleAddCategory} className="flex gap-2">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-blue-500 placeholder-slate-400"
                    placeholder="Category name..."
                    required
                  />
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm transition-colors"
                  >
                    Add
                  </button>
                </form>
              </div>

              {/* Add Subcategory Section */}
              <div className="border border-slate-200 dark:border-slate-700 rounded p-4">
                <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-3">Add Subcategory</h3>
                <div className="space-y-2">
                  <select
                    value={selectedCategoryIdForSubcategory}
                    onChange={(e) => setSelectedCategoryIdForSubcategory(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select category...</option>
                    {Array.isArray(categories) ? categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    )) : []}
                  </select>
                  <form onSubmit={handleAddSubcategory} className="flex gap-2">
                    <input
                      type="text"
                      value={newSubcategoryName}
                      onChange={(e) => setNewSubcategoryName(e.target.value)}
                      className="flex-1 px-3 py-2 border border-slate-200 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-sm text-slate-900 dark:text-slate-100 focus:ring-1 focus:ring-blue-500 placeholder-slate-400 disabled:opacity-50"
                      placeholder="Subcategory name..."
                      disabled={!selectedCategoryIdForSubcategory}
                      required
                    />
                    <button
                      type="submit"
                      disabled={!selectedCategoryIdForSubcategory}
                      className="bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded text-sm transition-colors"
                    >
                      Add
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}