'use client';

import { useState, useRef, useEffect } from 'react';
import { X, Upload, FileText, Chrome, AlertCircle, CheckCircle, Loader2, Download, Save } from 'lucide-react';
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

type ImportMethod = 'file' | 'text' | 'ai';

export default function BookmarkImportModal({ isOpen, onClose, onImportComplete }: BookmarkImportModalProps) {
  const [importMethod, setImportMethod] = useState<ImportMethod>('file');
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textInput, setTextInput] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);
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
      
      await processContent(fileContent, file.name);
    } catch (error) {
      console.error('Error processing file:', error);
      setError(error instanceof Error ? error.message : 'Failed to process file');
      setSelectedFile(null);
      setPreview(null);
    }
  };

  const handleTextInput = async (content: string) => {
    try {
      setError(null);
      
      if (!content.trim()) {
        throw new Error('Please paste some bookmark data.');
      }

      if (content.length > 5 * 1024 * 1024) { // 5MB limit for text
        throw new Error('Text content too large. Please use a smaller amount of data.');
      }

      await processContent(content, 'pasted-bookmarks');
    } catch (error) {
      console.error('Error processing text:', error);
      setError(error instanceof Error ? error.message : 'Failed to process text data');
      setPreview(null);
    }
  };

  const handleAiGenerate = async (prompt: string) => {
    setAiGenerating(true);
    setError(null);
    
    try {
      if (!prompt.trim()) {
        throw new Error('Please enter a description for the bookmarks you need.');
      }

      const response = await fetch('/api/bookmarks/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate bookmarks');
      }

      const result = await response.json();
      
      // Save generated data as file for backup
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
      const filename = `ai-generated-bookmarks-${timestamp}.json`;
      const blob = new Blob([JSON.stringify(result.bookmarkData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      showToast({
        type: 'success',
        title: 'Backup Saved',
        message: `Generated bookmarks saved as ${filename}`
      });

      await processContent(result.bookmarkData, 'ai-generated');
    } catch (error) {
      console.error('Error generating bookmarks:', error);
      setError(error instanceof Error ? error.message : 'Failed to generate bookmarks');
    } finally {
      setAiGenerating(false);
    }
  };

  const processContent = async (content: string, source: string) => {
    // Detect file type
    const fileType = detectBookmarkFileType(content);
    if (fileType === 'unknown') {
      throw new Error('Unsupported format. Please provide valid HTML or JSON bookmark data.');
    }

    // Parse bookmarks
    const parsed = parseBookmarkFile(content);
    
    if (parsed.totalBookmarks === 0) {
      throw new Error('No bookmarks found in the data. Please check the format.');
    }

    // Determine browser type
    const browserType: 'firefox' | 'chrome' = fileType === 'json' ? 'firefox' : 
      (source.toLowerCase().includes('firefox') ? 'firefox' : 'chrome');

    // Convert to categories
    const categories = convertToCategories(parsed, browserType);

    setPreview({ parsed, categories, fileType, browserType });
  };

  const handleImport = async () => {
    if (!preview) return;

    setImporting(true);
    setError(null);

    try {
      let response;

      if (importMethod === 'file' && selectedFile) {
        // File upload method
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('options', JSON.stringify({
          createCategories: true,
          createSubcategories: true,
          mergeExisting: false
        }));

        response = await fetch('/api/bookmarks/import', {
          method: 'POST',
          body: formData
        });
      } else {
        // Text or AI method - send data directly
        const requestBody = {
          data: importMethod === 'text' ? textInput : 
                importMethod === 'ai' ? 'AI_GENERATED_DATA' : '',
          type: importMethod,
          options: {
            createCategories: true,
            createSubcategories: true,
            mergeExisting: false
          }
        };

        response = await fetch('/api/bookmarks/import-data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });
      }

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
    setImportMethod('file');
    setSelectedFile(null);
    setTextInput('');
    setAiPrompt('');
    setAiGenerating(false);
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
              {/* Import Method Selector */}
              <div className="flex gap-2 p-1 bg-slate-100 dark:bg-slate-700 rounded-lg">
                <button
                  onClick={() => setImportMethod('file')}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    importMethod === 'file'
                      ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  📄 File Upload
                </button>
                <button
                  onClick={() => setImportMethod('text')}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    importMethod === 'text'
                      ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  📝 Text Paste
                </button>
                <button
                  onClick={() => setImportMethod('ai')}
                  className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    importMethod === 'ai'
                      ? 'bg-white dark:bg-slate-600 text-slate-900 dark:text-slate-100 shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  ✨ AI Generated
                </button>
              </div>
              {/* Instructions */}
              {importMethod === 'file' && (
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
              )}

              {importMethod === 'text' && (
                <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                  <h3 className="font-medium text-green-900 dark:text-green-100 mb-2">
                    Paste your bookmark data:
                  </h3>
                  <p className="text-sm text-green-800 dark:text-green-200">
                    Paste HTML or JSON bookmark data directly. Supports exported data from any browser.
                  </p>
                </div>
              )}

              {importMethod === 'ai' && (
                <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
                  <h3 className="font-medium text-purple-900 dark:text-purple-100 mb-2">
                    Generate bookmarks with AI:
                  </h3>
                  <p className="text-sm text-purple-800 dark:text-purple-200">
                    Describe the bookmarks you need and AI will generate them for you. Great for starting collections or finding resources.
                  </p>
                </div>
              )}

              {/* Content Area Based on Import Method */}
              {importMethod === 'file' && (
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
              )}

              {importMethod === 'text' && (
                <div className="space-y-4">
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Paste your HTML or JSON bookmark data here...

Example:
&lt;DT&gt;&lt;H3&gt;Bookmarks Bar&lt;/H3&gt;
&lt;DL&gt;&lt;p&gt;
&lt;DT&gt;&lt;A HREF=&quot;https://example.com&quot;&gt;Example Site&lt;/A&gt;
&lt;/DL&gt;&lt;p&gt;

Or JSON format from Firefox..."
                    className="w-full h-48 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm font-mono resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {textInput.length} characters • Supports HTML and JSON formats
                    </div>
                    <button
                      onClick={() => handleTextInput(textInput)}
                      disabled={!textInput.trim() || importing}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-slate-400 transition-colors font-medium text-sm"
                    >
                      Process Text
                    </button>
                  </div>
                </div>
              )}

              {importMethod === 'ai' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Describe the bookmarks you need:
                    </label>
                    <textarea
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                      placeholder="Example: 'Create a collection of web development learning resources including documentation sites, tutorials, and tools for React, TypeScript, and Node.js'

Or: 'Generate bookmarks for productivity tools and apps for project management, note-taking, and time tracking'"
                      className="w-full h-32 px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 text-sm resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      AI will generate 10-20 relevant bookmarks based on your description
                    </div>
                    <button
                      onClick={() => handleAiGenerate(aiPrompt)}
                      disabled={!aiPrompt.trim() || aiGenerating}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-slate-400 transition-colors font-medium text-sm flex items-center gap-2"
                    >
                      {aiGenerating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          ✨ Generate
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

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
          
          {preview && (
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