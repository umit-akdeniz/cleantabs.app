'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { performCompleteSignOut, initializeUserSession, validateSession } from '@/lib/auth-utils';
import { Site } from '@/types';
import { useDatabase } from '@/hooks/useDatabase';
// Dynamic imports to prevent hydration issues
const ModernThreePanelSidebar = dynamic(() => import('@/components/ModernThreePanelSidebar'), {
  ssr: false,
  loading: () => <div className="flex-1 bg-white/95 dark:bg-brand-900/95 animate-pulse" />
});

const SiteDetailPanel = dynamic(() => import('@/components/SiteDetailPanel'), {
  ssr: false,
  loading: () => <div className="flex-1 bg-white/80 dark:bg-gray-800/80 animate-pulse" />
});

const AddSiteModal = dynamic(() => import('@/components/AddSiteModal'), { 
  ssr: false,
  loading: () => null
});
const PremiumUpgradeModal = dynamic(() => import('@/components/PremiumUpgradeModal'), { 
  ssr: false,
  loading: () => null
});
const CategoryManagementModal = dynamic(() => import('@/components/CategoryManagementModal'), { 
  ssr: false,
  loading: () => null
});
const BookmarkImportModal = dynamic(() => import('@/components/BookmarkImportModal'), { 
  ssr: false,
  loading: () => null
});
const AIPromptsModal = dynamic(() => import('@/components/AIPromptsModal'), { 
  ssr: false,
  loading: () => null
});
import ThemeToggle from '@/components/ThemeToggle';
import Logo from '@/components/Logo';
import { checkPlanLimits } from '@/lib/planLimits';
import { Globe, AlertCircle, LogOut, User, Crown, Search, Settings, UserCircle, Sliders, ChevronDown, Sparkles } from 'lucide-react';
import { showToast } from '@/components/Toast';
import CookieConsent from '@/components/CookieConsent';

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { categories, sites: dbSites, loading, error, refreshData, refreshCategories } = useDatabase();

  // Session validation - çıkış yap eğer session geçersizse
  useEffect(() => {
    if (status === 'loading') return;

    if (status === 'unauthenticated' || !session) {
      router.push('/auth/signin');
      return;
    }

    // Session var ama user bilgileri eksikse çıkış yap
    if (session && (!session.user || !session.user.email)) {
      console.log('Invalid session detected, signing out');
      performCompleteSignOut('/auth/signin');
      return;
    }

    // Session geçerliyse kullanıcı bilgilerini initialize et
    if (session?.user && status === 'authenticated') {
      initializeUserSession(session.user);
    }

    // Local storage session validation
    if (session && !validateSession()) {
      console.log('Local session invalid, signing out');
      performCompleteSignOut('/auth/signin');
      return;
    }
  }, [session, status, router]);
  const [sites, setSites] = useState<Site[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSite, setEditingSite] = useState<Site | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedSite, setSelectedSite] = useState<Site | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showAIPromptsModal, setShowAIPromptsModal] = useState(false);

  useEffect(() => {
    if (dbSites.length > 0) {
      setSites(dbSites);
    }
  }, [dbSites]);

  // Load saved state on mount
  useEffect(() => {
    if (categories.length > 0 && sites.length > 0) {
      const savedState = localStorage.getItem('cleantabs-state');
      if (savedState) {
        try {
          const { categoryId, subcategoryId, siteId } = JSON.parse(savedState);
          
          // Verify that saved IDs still exist
          const category = categories.find(c => c.id === categoryId);
          if (category) {
            setSelectedCategory(categoryId);
            
            const subcategory = category.subcategories.find(s => s.id === subcategoryId);
            if (subcategory) {
              setSelectedSubcategory(subcategoryId);
              
              const site = sites.find(s => s.id === siteId && s.subcategoryId === subcategoryId);
              if (site) {
                setSelectedSite(site);
              }
            }
          }
        } catch (error) {
          console.log('Error loading saved state:', error);
        }
      }
    }
  }, [categories, sites]);

  // Save state when selections change
  useEffect(() => {
    if (selectedCategory) {
      const stateToSave = {
        categoryId: selectedCategory,
        subcategoryId: selectedSubcategory,
        siteId: selectedSite?.id
      };
      localStorage.setItem('cleantabs-state', JSON.stringify(stateToSave));
    }
  }, [selectedCategory, selectedSubcategory, selectedSite]);


  const handleAddSite = () => {
    // Check plan limits for free users
    if (session?.user?.plan === 'FREE') {
      const limitCheck = checkPlanLimits('FREE', 'site', {
        totalSites: sites.length,
        totalSitesInSubcategory: selectedSubcategory 
          ? sites.filter(s => s.subcategoryId === selectedSubcategory).length 
          : 0
      });

      if (!limitCheck.allowed) {
        setShowUpgradeModal(true);
        return;
      }
    }

    setEditingSite(null);
    setIsModalOpen(true);
  };

  const handleEditSite = (site: Site) => {
    setEditingSite(site);
    setIsModalOpen(true);
  };

  const handleSaveSite = useCallback(async (site: Site) => {
    try {
      if (editingSite) {
        // Update existing site
        const response = await fetch(`/api/sites/${site.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(site)
        });
        
        if (response.ok) {
          const updatedSite = await response.json();
          setSites(prevSites => prevSites.map(s => s.id === site.id ? updatedSite : s));
          if (selectedSite?.id === site.id) {
            setSelectedSite(updatedSite);
          }
          showToast({
            type: 'success',
            title: 'Site Updated',
            message: `${site.name} has been updated successfully`
          });
        }
      } else {
        // Create new site
        const response = await fetch('/api/sites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(site)
        });
        
        if (response.ok) {
          const newSite = await response.json();
          setSites(prevSites => [...prevSites, newSite]);
          showToast({
            type: 'success',
            title: 'Site Added',
            message: `${site.name} has been added successfully`
          });
        }
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error saving site:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Site could not be saved. Please try again.'
      });
    }
  }, [editingSite, selectedSite?.id]);

  const handleSiteUpdate = useCallback((updatedSite: Site) => {
    setSites(prevSites => prevSites.map(s => s.id === updatedSite.id ? updatedSite : s));
    if (selectedSite?.id === updatedSite.id) {
      setSelectedSite(updatedSite);
    }
  }, [selectedSite?.id]);

  const handleAddCategory = async (name: string) => {
    // Check plan limits for free users
    if (session?.user?.plan === 'FREE') {
      const limitCheck = checkPlanLimits('FREE', 'category', {
        totalCategories: categories.length
      });

      if (!limitCheck.allowed) {
        setShowUpgradeModal(true);
        return;
      }
    }

    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });

      if (response.ok) {
        const newCategory = await response.json();
        showToast({
          type: 'success',
          title: 'Category Added',
          message: `Category "${name}" has been created successfully`
        });
        // Refresh only categories data without affecting sites
        await refreshCategories();
      } else {
        console.error('Failed to add category');
        showToast({
          type: 'error',
          title: 'Error',
          message: 'Failed to add category. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error adding category:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Category could not be added. Please try again.'
      });
    }
  };

  const handleAddSubcategory = async (categoryId: string, name: string) => {
    // Check plan limits for free users
    if (session?.user?.plan === 'FREE') {
      const category = categories.find(c => c.id === categoryId);
      const subcategoryCount = category?.subcategories?.length || 0;
      
      const limitCheck = checkPlanLimits('FREE', 'subcategory', {
        totalSubcategoriesInCategory: subcategoryCount
      });

      if (!limitCheck.allowed) {
        setShowUpgradeModal(true);
        return;
      }
    }

    try {
      const response = await fetch('/api/subcategories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, categoryId })
      });

      if (response.ok) {
        const category = categories.find(c => c.id === categoryId);
        showToast({
          type: 'success',
          title: 'Subcategory Added',
          message: `Subcategory "${name}" has been added to "${category?.name}"`
        });
        // Refresh only categories data without affecting sites
        await refreshCategories();
      } else {
        console.error('Failed to add subcategory');
        showToast({
          type: 'error',
          title: 'Error',
          message: 'Failed to add subcategory. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error adding subcategory:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Subcategory could not be added. Please try again.'
      });
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category and all its subcategories and sites?')) {
      return;
    }

    try {
      const response = await fetch(`/api/categories?id=${categoryId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Clear selected states if deleted category was selected
        if (selectedCategory === categoryId) {
          setSelectedCategory(null);
          setSelectedSubcategory(null);
          setSelectedSite(null);
        }
        // Refresh categories data
        await refreshData();
        showToast({
          type: 'success',
          title: 'Category Deleted',
          message: 'Category and all its content have been deleted successfully'
        });
      } else {
        console.error('Failed to delete category');
        showToast({
          type: 'error',
          title: 'Error',
          message: 'Category could not be deleted. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Category could not be deleted. Please try again.'
      });
    }
  };

  const handleUpdateCategory = async (categoryId: string, name: string) => {
    try {
      const response = await fetch(`/api/categories/${categoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });

      if (response.ok) {
        showToast({
          type: 'success',
          title: 'Category Updated',
          message: `Category has been updated successfully`
        });
        // Refresh only categories data without affecting sites
        await refreshCategories();
      } else {
        console.error('Failed to update category');
        showToast({
          type: 'error',
          title: 'Error',
          message: 'Failed to update category. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error updating category:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Category could not be updated. Please try again.'
      });
    }
  };

  const handleUpdateSubcategory = async (categoryId: string, subcategoryId: string, name: string) => {
    try {
      const response = await fetch(`/api/subcategories/${subcategoryId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
      });

      if (response.ok) {
        showToast({
          type: 'success',
          title: 'Subcategory Updated',
          message: `Subcategory has been updated successfully`
        });
        // Refresh only categories data without affecting sites
        await refreshCategories();
      } else {
        console.error('Failed to update subcategory');
        showToast({
          type: 'error',
          title: 'Error',
          message: 'Failed to update subcategory. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error updating subcategory:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Subcategory could not be updated. Please try again.'
      });
    }
  };

  const handleDeleteSubcategory = async (categoryId: string, subcategoryId: string) => {
    if (!confirm('Are you sure you want to delete this subcategory and all its sites?')) {
      return;
    }

    try {
      const response = await fetch(`/api/subcategories?id=${subcategoryId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // Clear selected states if deleted subcategory was selected
        if (selectedSubcategory === subcategoryId) {
          setSelectedSubcategory(null);
          setSelectedSite(null);
        }
        // Refresh categories data
        await refreshData();
        showToast({
          type: 'success',
          title: 'Subcategory Deleted',
          message: 'Subcategory and all its sites have been deleted successfully'
        });
      } else {
        console.error('Failed to delete subcategory');
        showToast({
          type: 'error',
          title: 'Error',
          message: 'Subcategory could not be deleted. Please try again.'
        });
      }
    } catch (error) {
      console.error('Error deleting subcategory:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Subcategory could not be deleted. Please try again.'
      });
    }
  };

  const handleDeleteSite = useCallback(async (id: string) => {
    const siteToDelete = sites.find(s => s.id === id);
    if (confirm('Are you sure you want to delete this site?')) {
      try {
        const response = await fetch(`/api/sites/${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          setSites(prevSites => prevSites.filter(s => s.id !== id));
          if (selectedSite?.id === id) {
            setSelectedSite(null);
          }
          showToast({
            type: 'success',
            title: 'Site Deleted',
            message: `${siteToDelete?.name || 'Site'} has been deleted successfully`
          });
        }
      } catch (error) {
        console.error('Error deleting site:', error);
        showToast({
          type: 'error',
          title: 'Error',
          message: 'Failed to delete site. Please try again.'
        });
      }
    }
  }, [sites, selectedSite?.id]);

  const handleAddSubLink = (siteId: string) => {
    const site = sites.find(s => s.id === siteId);
    if (site) {
      handleEditSite(site);
    }
  };

  const handleCategorySelect = useCallback((categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    setSelectedCategory(categoryId);
    
    // Auto-select first subcategory if available
    if (category && category.subcategories.length > 0) {
      const firstSubcategory = category.subcategories[0];
      setSelectedSubcategory(firstSubcategory.id);
      
      // Auto-select first site in that subcategory if available
      const sitesInSubcategory = sites.filter(site => 
        site.categoryId === categoryId && site.subcategoryId === firstSubcategory.id
      );
      
      if (sitesInSubcategory.length > 0) {
        setSelectedSite(sitesInSubcategory[0]);
      } else {
        setSelectedSite(null);
      }
    } else {
      setSelectedSubcategory(null);
      setSelectedSite(null);
    }
    
    setSelectedItem(null);
  }, [categories, sites]);

  const handleSubcategorySelect = useCallback((subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId);
    
    // Auto-select first site in selected subcategory if available
    const sitesInSubcategory = sites.filter(site => 
      site.categoryId === selectedCategory && site.subcategoryId === subcategoryId
    );
    
    if (sitesInSubcategory.length > 0) {
      setSelectedSite(sitesInSubcategory[0]);
    } else {
      setSelectedSite(null);
    }
    
    setSelectedItem(null);
  }, [sites, selectedCategory]);

  const handleItemSelect = (itemId: string) => {
    setSelectedItem(itemId);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowSearchResults(query.length > 0);
  };

  // Filter sites based on search query (memoized)
  const filteredSites = useMemo(() => {
    if (!searchQuery) return [];
    return sites.filter(site => 
      site.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      site.url.toLowerCase().includes(searchQuery.toLowerCase())
    ).slice(0, 8);
  }, [sites, searchQuery]);

  const handleTagFilter = (tags: string[]) => {
    setSelectedTags(tags);
  };

  // Get all available tags from sites (memoized)
  const availableTags = useMemo(() => 
    Array.from(new Set(sites.flatMap(site => site.tags || []))), 
    [sites]
  );

  const handleSiteSelect = useCallback((site: Site) => {
    setSelectedSite(site);
  }, []);

  // Handle moving subcategory to different category
  const handleMoveSubcategory = async (subcategoryId: string, targetCategoryId: string) => {
    try {
      const response = await fetch(`/api/subcategories/move`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subcategoryId, targetCategoryId })
      });

      if (response.ok) {
        showToast({
          type: 'success',
          title: 'Subcategory Moved',
          message: 'Subcategory has been moved successfully'
        });
        // Refresh only categories data without affecting current selections
        await refreshCategories();
      } else {
        throw new Error('Failed to move subcategory');
      }
    } catch (error) {
      console.error('Error moving subcategory:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to move subcategory. Please try again.'
      });
    }
  };


  // Handle moving site to different subcategory
  const handleMoveSite = useCallback(async (siteId: string, targetSubcategoryId: string) => {
    console.log('handleMoveSite called:', { siteId, targetSubcategoryId });
    try {
      const response = await fetch(`/api/sites/move`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId, targetSubcategoryId })
      });

      if (response.ok) {
        const updatedSite = await response.json();
        console.log('Site moved successfully:', updatedSite);
        setSites(prevSites => prevSites.map(s => s.id === siteId ? updatedSite : s));
        if (selectedSite?.id === siteId) {
          setSelectedSite(updatedSite);
        }
        showToast({
          type: 'success',
          title: 'Site Moved',
          message: 'Site has been moved successfully'
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.log('Move site failed:', response.status, errorData);
        throw new Error(`Failed to move site: ${response.status}`);
      }
    } catch (error) {
      console.log('Error moving site:', error);
      console.log('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        siteId,
        targetSubcategoryId
      });
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to move site. Please try again.'
      });
    }
  }, [selectedSite?.id]);

  // Redirect to signin if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin?callbackUrl=/dashboard');
    }
  }, [status, router]);

  // Show loading while checking authentication
  if (status === 'loading') {
    return (
      <div className="h-screen bg-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 dark:bg-gradient-to-br flex items-center justify-center">
        <div className="text-center space-y-6 flex flex-col items-center">
          <div className="flex justify-center mb-4">
            <Logo size="2xl" showText={true} />
          </div>
          <div className="flex justify-center">
            {/* Modern animated rings */}
            <div className="relative w-20 h-20">
              <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-transparent border-t-blue-500 rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-2 border-transparent border-t-indigo-400 rounded-full animate-spin" style={{animationDelay: '150ms'}}></div>
              <div className="absolute inset-4 border-2 border-transparent border-t-blue-300 rounded-full animate-spin" style={{animationDelay: '300ms'}}></div>
              
              {/* Modern logo icon in center */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                  <div className="flex gap-0.5">
                    <div className="w-1 h-4 bg-white rounded-full opacity-90"></div>
                    <div className="w-1 h-4 bg-white rounded-full opacity-70"></div>
                    <div className="w-1 h-4 bg-white rounded-full opacity-50"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Loading your organized space...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated
  if (status === 'unauthenticated') {
    return null;
  }

  if (error) {
    return (
      <div className="h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center space-y-4 p-8 max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto" />
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">
            Database Connection Error
          </h2>
          <p className="text-slate-600 dark:text-slate-400">
            {error}
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 dark:bg-gradient-to-br flex flex-col">
      
      {/* Header */}
      <div className="flex items-center justify-between p-3 lg:p-4 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/20 dark:border-slate-700/30 shadow-sm relative z-50">
        <Logo 
          size="md" 
          onClick={() => window.location.href = '/'} 
        />
        
        {/* Center Search Bar - Desktop Only */}
        <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8 relative z-[100]">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Find your organized sites..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              onFocus={() => setShowSearchResults(searchQuery.length > 0)}
              onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors text-sm text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
            />
            
            {/* Search Results Dropdown */}
            {showSearchResults && filteredSites.length > 0 && (
              <div 
                className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-2xl backdrop-blur-sm z-[200]"
              >
                <div className="p-2 max-h-80 overflow-y-auto">
                  <div className="text-xs text-slate-500 dark:text-slate-400 mb-2 px-2">
                    Found {filteredSites.length} sites
                  </div>
                  {filteredSites.map((site) => {
                    const category = categories.find(c => 
                      c.subcategories.some(sub => sub.id === site.subcategoryId)
                    );
                    const subcategory = category?.subcategories.find(sub => sub.id === site.subcategoryId);
                    
                    return (
                      <div
                        key={site.id}
                        onClick={() => {
                          if (category && subcategory) {
                            handleCategorySelect(category.id);
                            handleSubcategorySelect(subcategory.id);
                            handleSiteSelect(site);
                          }
                          setShowSearchResults(false);
                          setSearchQuery('');
                        }}
                        className="flex items-center gap-3 p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded cursor-pointer"
                      >
                        <div 
                          className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0"
                          style={{ backgroundColor: site.color || '#64748b' }}
                        >
                          <Globe className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate">
                            {site.name}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 truncate">
                            {category?.name} → {subcategory?.name}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 lg:gap-3">
          {/* Mobile Theme Toggle */}
          <div className="md:hidden">
            <ThemeToggle />
          </div>
          
          {/* User Profile Section */}
          <div className="relative">
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              onBlur={() => setTimeout(() => setShowProfileMenu(false), 200)}
              className="flex items-center gap-2 px-2.5 py-1.5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              {/* Avatar */}
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white shadow-sm ${
                session?.user?.plan === 'PREMIUM' 
                  ? 'bg-gradient-to-br from-slate-700 to-slate-800' 
                  : 'bg-gradient-to-br from-slate-500 to-slate-600'
              }`}>
                <User className="w-3.5 h-3.5 text-white" />
              </div>
              
              {/* User Info */}
              <div className="hidden md:block text-left">
                <div className="text-sm font-medium text-slate-900 dark:text-slate-100 capitalize">
                  {session?.user?.name || session?.user?.email}
                </div>
              </div>
              
              <ChevronDown className={`w-3 h-3 text-slate-600 dark:text-slate-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div 
                className="absolute top-full right-0 mt-2 w-52 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-xl shadow-2xl py-2 animate-in slide-in-from-top-2 duration-200 ease-out"
                style={{ zIndex: 999999 }}
              >
                <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                  {session?.user?.plan === 'PREMIUM' && (
                    <div className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1">
                      <User className="w-3 h-3" />
                      Premium User
                    </div>
                  )}
                  <div className="text-sm font-medium text-slate-900 dark:text-slate-100 capitalize">
                    {session?.user?.name || 'User'}
                  </div>
                </div>
                
                <button 
                  onClick={() => {
                    setShowProfileMenu(false);
                    router.push('/account');
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-3"
                >
                  <UserCircle className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  My Profile
                </button>
                
                <button 
                  onClick={() => {
                    setShowProfileMenu(false);
                    router.push('/settings');
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-3"
                >
                  <Settings className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  Settings
                </button>
                
{/* Preferences temporarily disabled
                <button 
                  onClick={() => {
                    setShowProfileMenu(false);
                    router.push('/preferences');
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-3"
                >
                  <Sliders className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  Preferences
                </button>
                */}

                <button 
                  onClick={() => {
                    setShowProfileMenu(false);
                    setShowAIPromptsModal(true);
                  }}
                  className="w-full px-4 py-2.5 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-3"
                >
                  <Sparkles className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  AI Prompts
                </button>
                
                <div className="border-t border-slate-100 dark:border-slate-700 mt-2 pt-2">
                  <button
                    onClick={() => performCompleteSignOut('/auth/signin')}
                    className="w-full px-4 py-2.5 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-3"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Desktop Theme Toggle */}
          <div className="hidden md:block">
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden w-full">

      {loading ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="relative">
              <div className="w-8 h-8 border-2 border-slate-200 dark:border-slate-700 rounded-full animate-spin border-t-blue-500"></div>
            </div>
          </div>
        </div>
      ) : (
        <>
          <ModernThreePanelSidebar
            categories={categories}
            sites={sites}
            selectedCategory={selectedCategory}
            selectedSubcategory={selectedSubcategory}
            selectedSite={selectedSite}
            onCategorySelect={handleCategorySelect}
            onSubcategorySelect={handleSubcategorySelect}
            onSiteSelect={handleSiteSelect}
            onAddSite={handleAddSite}
            onSearch={handleSearch}
            onTagFilter={handleTagFilter}
            availableTags={availableTags}
            selectedTags={selectedTags}
            onOpenCategoryModal={() => setShowCategoryModal(true)}
            onOpenImportModal={() => setShowImportModal(true)}
            onEditSite={handleEditSite}
            onDeleteSite={handleDeleteSite}
            onSiteUpdate={handleSiteUpdate}
            onMoveSubcategory={handleMoveSubcategory}
            onMoveSite={handleMoveSite}
          />
          
          {/* Detail Panel - Tablet & Desktop Only */}
          <div className="hidden md:block flex-1 min-w-0 border-l border-gray-100 dark:border-slate-800">
            <SiteDetailPanel
              site={selectedSite}
              onEdit={handleEditSite}
              onUpdate={handleSiteUpdate}
              onDelete={handleDeleteSite}
              onClose={() => setSelectedSite(null)}
            />
          </div>
        </>
      )}
      </div>

      <AddSiteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveSite}
        editingSite={editingSite}
        categories={categories}
        defaultCategoryId={selectedCategory || undefined}
        defaultSubcategoryId={selectedSubcategory || undefined}
      />

      <PremiumUpgradeModal
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
      />

      <CategoryManagementModal
        isOpen={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        categories={categories}
        onAddCategory={handleAddCategory}
        onAddSubcategory={handleAddSubcategory}
        onUpdateCategory={handleUpdateCategory}
        onUpdateSubcategory={handleUpdateSubcategory}
        onDeleteCategory={handleDeleteCategory}
        onDeleteSubcategory={handleDeleteSubcategory}
      />

      <BookmarkImportModal
        isOpen={showImportModal}
        onClose={() => setShowImportModal(false)}
        onImportComplete={() => {
          refreshData();
          setShowImportModal(false);
        }}
      />

      <AIPromptsModal
        isOpen={showAIPromptsModal}
        onClose={() => setShowAIPromptsModal(false)}
      />
      
      <CookieConsent />
    </div>
  );
}