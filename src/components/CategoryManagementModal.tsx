'use client';

import { useState } from 'react';
import { X, Plus, Edit, Trash2 } from 'lucide-react';
import { Category } from '@/types';

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
  onDeleteSubcategory
}: CategoryManagementModalProps) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newSubcategoryName, setNewSubcategoryName] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState('');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCategoryName.trim()) {
      if (categories.length >= 10) {
        alert('Maksimum 10 ana kategori ekleyebilirsiniz!');
        return;
      }
      onAddCategory(newCategoryName.trim());
      setNewCategoryName('');
    }
  };

  const handleAddSubcategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubcategoryName.trim() && selectedCategoryId) {
      const selectedCategory = categories.find(c => c.id === selectedCategoryId);
      if (selectedCategory && selectedCategory.subcategories.length >= 15) {
        alert('Bir kategoride maksimum 15 alt kategori olabilir!');
        return;
      }
      onAddSubcategory(selectedCategoryId, newSubcategoryName.trim());
      setNewSubcategoryName('');
    }
  };

  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-y-auto shadow-elevated border border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            Kategori Yönetimi
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-8">
          {/* Ana Kategori Ekleme */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Ana Kategori Ekle
            </h3>
            <form onSubmit={handleAddCategory} className="flex gap-3">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Kategori adını girin"
                required
              />
              <button
                type="submit"
                className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 font-medium transition-all duration-200 shadow-subtle hover:shadow-elevated flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Ekle
              </button>
            </form>
          </div>

          {/* Alt Kategori Ekleme */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Alt Kategori Ekle
            </h3>
            <div className="space-y-3">
              <select
                value={selectedCategoryId}
                onChange={(e) => setSelectedCategoryId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
              >
                <option value="">Ana kategori seçin</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
              <form onSubmit={handleAddSubcategory} className="flex gap-3">
                <input
                  type="text"
                  value={newSubcategoryName}
                  onChange={(e) => setNewSubcategoryName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                  placeholder="Alt kategori adını girin"
                  disabled={!selectedCategoryId}
                  required
                />
                <button
                  type="submit"
                  disabled={!selectedCategoryId}
                  className="bg-teal-500 text-white px-4 py-2 rounded-lg hover:bg-teal-600 font-medium transition-all duration-200 shadow-subtle hover:shadow-elevated flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                  Ekle
                </button>
              </form>
            </div>
          </div>

          {/* Mevcut Kategoriler */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
              Mevcut Kategoriler
            </h3>
            <div className="space-y-4">
              {categories.map((category) => (
                <div key={category.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {category.name}
                    </h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onDeleteCategory?.(category.id)}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                        title="Kategoriyi Sil"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {category.subcategories.length > 0 && (
                    <div className="space-y-2 ml-4">
                      <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Alt Kategoriler:
                      </h5>
                      {category.subcategories.map((subcategory) => (
                        <div key={subcategory.id} className="flex items-center justify-between py-1">
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            • {subcategory.name}
                          </span>
                          <button
                            onClick={() => onDeleteSubcategory?.(category.id, subcategory.id)}
                            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                            title="Alt Kategoriyi Sil"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500 font-medium transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
}