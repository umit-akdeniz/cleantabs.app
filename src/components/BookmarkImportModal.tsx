'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Upload, FileText, Chrome, AlertCircle, CheckCircle, Loader2, Download } from 'lucide-react';
import { parseBookmarkFile, convertToCategories, detectBookmarkFileType, type ParsedBookmarks } from '@/lib/bookmarkImporter';
import { showToast } from './Toast';

interface BookmarkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportComplete?: () => void;
}

interface ImportPreview {
  parsed: ParsedBookmarks;
  categories: ReturnType<typeof convertToCategories>;
  fileType: 'html' | 'json';
  browserType: 'firefox' | 'chrome';
}

export default function BookmarkImportModal({ isOpen, onClose, onImportComplete }: BookmarkImportModalProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<ImportPreview | null>(null);
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFile = async (file: File) => {
    try {
      setError(null);
      setSelectedFile(file);

      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File size too large. Please use a file smaller than 10MB.');
      }

      // Read file content
      const fileContent = await file.text();
      
      // Detect file type
      const fileType = detectBookmarkFileType(fileContent);
      if (fileType === 'unknown') {
        throw new Error('Unsupported file format. Please upload HTML or JSON bookmark file exported from Chrome/Firefox.');
      }

      // Parse bookmarks
      const parsed = parseBookmarkFile(fileContent);
      
      if (parsed.totalBookmarks === 0) {
        throw new Error('No bookmarks found in the file. Please check your bookmark export.');
      }

      // Determine browser type
      const browserType: 'firefox' | 'chrome' = fileType === 'json' ? 'firefox' : 
        (file.name.toLowerCase().includes('firefox') ? 'firefox' : 'chrome');

      // Convert to categories
      const categories = convertToCategories(parsed, browserType);

      setPreview({ parsed, categories, fileType, browserType });
    } catch (error) {
      console.error('Error processing file:', error);
      setError(error instanceof Error ? error.message : 'Failed to process file');
      setSelectedFile(null);
      setPreview(null);
    }
  };

  const handleImport = async () => {
    if (!selectedFile || !preview) return;

    setImporting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('options', JSON.stringify({
        createCategories: true,
        createSubcategories: true,
        mergeExisting: false
      }));

      const response = await fetch('/api/bookmarks/import', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status === 402) {
          // Plan limit exceeded
          throw new Error(
            `Plan limit exceeded. This import requires ${result.required.categories} categories, ${result.required.subcategories} subcategories, and ${result.required.sites} sites. Please upgrade your plan or reduce the number of bookmarks to import.`
          );
        }
        throw new Error(result.error || 'Import failed');
      }

      showToast({
        type: 'success',
        title: 'Import Successful',
        message: `Successfully imported ${result.stats.sitesCreated} bookmarks in ${result.stats.categoriesCreated} categories`
      });

      if (result.errors && result.errors.length > 0) {
        console.warn('Import warnings:', result.errors);
        showToast({
          type: 'warning',
          title: 'Import Completed with Warnings',
          message: `${result.errors.length} items could not be imported. Check console for details.`
        });
      }

      onImportComplete?.();
      handleClose();
    } catch (error) {
      console.error('Import error:', error);
      setError(error instanceof Error ? error.message : 'Import failed');
      // Don't close modal on error so user can see the error message
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreview(null);
    setError(null);
    setDragActive(false);
    onClose();
  };

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div ref={modalRef} className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Download className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                Import Bookmarks
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Import your browser bookmarks from Chrome or Firefox
              </p>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {!selectedFile ? (
            /* File Upload Section */
            <div className="space-y-6">
              {/* Instructions */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                <h3 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
                  How to export bookmarks:
                </h3>
                <div className="space-y-2 text-sm text-blue-800 dark:text-blue-200">
                  <div className="flex items-start gap-2">
                    <Chrome className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <strong>Chrome:</strong> Menu → Bookmarks → Bookmark manager → ⋮ → Export bookmarks
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-4 h-4 mt-0.5 flex-shrink-0 text-orange-500">🦊</div>
                    <div>
                      <strong>Firefox:</strong> Library → Bookmarks → Show All Bookmarks → Import and Backup → Export Bookmarks to HTML/Backup
                    </div>
                  </div>
                </div>
              </div>

              {/* File Drop Zone */}
              <div
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                  dragActive
                    ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-slate-300 dark:border-slate-600 hover:border-slate-400 dark:hover:border-slate-500'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".html,.json"
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-2xl flex items-center justify-center mx-auto">
                    <Upload className="w-8 h-8 text-slate-500 dark:text-slate-400" />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                      Drop your bookmark file here
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-4">
                      Or click to browse and select your file
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                      Choose File
                    </button>
                  </div>
                  
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Supports HTML and JSON files up to 10MB
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-900 dark:text-red-100">Error</h4>
                      <p className="text-sm text-red-800 dark:text-red-200 mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Preview Section */
            <div className="space-y-6">
              {/* File Info */}
              <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="w-5 h-5 text-slate-500" />
                  <div>
                    <div className="font-medium text-slate-900 dark:text-slate-100">
                      {selectedFile.name}
                    </div>
                    <div className="text-sm text-slate-600 dark:text-slate-400">
                      {(selectedFile.size / 1024).toFixed(1)} KB • {preview?.browserType} bookmarks
                    </div>
                  </div>
                  {preview?.browserType === 'firefox' ? (
                    <div className="w-6 h-6 text-orange-500 ml-auto flex items-center justify-center">🦊</div>
                  ) : (
                    <Chrome className="w-6 h-6 text-blue-500 ml-auto" />
                  )}
                </div>
              </div>

              {/* Import Preview */}
              {preview && (
                <div className="space-y-4">
                  <h3 className="font-medium text-slate-900 dark:text-slate-100">
                    Import Preview
                  </h3>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                        {preview.categories.length}
                      </div>
                      <div className="text-sm text-blue-800 dark:text-blue-200">Categories</div>
                    </div>
                    <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                        {preview.categories.reduce((sum, cat) => sum + cat.subcategories.length, 0)}
                      </div>
                      <div className="text-sm text-green-800 dark:text-green-200">Subcategories</div>
                    </div>
                    <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 text-center">
                      <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                        {preview.parsed.totalBookmarks}
                      </div>
                      <div className="text-sm text-purple-800 dark:text-purple-200">Bookmarks</div>
                    </div>
                  </div>

                  {/* Category Preview */}
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {Array.isArray(preview.categories) ? preview.categories.map((category, catIdx) => (
                      <div key={catIdx} className="border border-slate-200 dark:border-slate-700 rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-lg">{category.icon}</span>
                          <span className="font-medium text-slate-900 dark:text-slate-100">
                            {category.name}
                          </span>
                        </div>
                        <div className="space-y-1 pl-6">
                          {Array.isArray(category.subcategories) ? category.subcategories.slice(0, 3).map((subcategory, subIdx) => (
                            <div key={subIdx} className="flex items-center gap-2 text-sm">
                              <span>{subcategory.icon}</span>
                              <span className="text-slate-600 dark:text-slate-400">
                                {subcategory.name} ({subcategory.sites.length} sites)
                              </span>
                            </div>
                          )) : []}
                          {category.subcategories && category.subcategories.length > 3 && (
                            <div className="text-xs text-slate-500 dark:text-slate-400 pl-6">
                              +{category.subcategories.length - 3} more subcategories
                            </div>
                          )}
                        </div>
                      </div>
                    )) : []}
                  </div>
                </div>
              )}

              {error && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-900 dark:text-red-100">Import Failed</h4>
                      <p className="text-sm text-red-800 dark:text-red-200 mt-1">{error}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
          >
            Cancel
          </button>
          
          {selectedFile && preview && (
            <button
              onClick={handleImport}
              disabled={importing}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors font-medium flex items-center gap-2"
            >
              {importing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Importing...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Import Bookmarks
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}