'use client';

import { useCallback } from 'react';
import { Site } from '@/types';
import { 
  useCategories, 
  useCreateCategory, 
  useUpdateCategory, 
  useDeleteCategory 
} from './api/useCategories';
import { 
  useSites, 
  useCreateSite, 
  useUpdateSite, 
  useDeleteSite, 
  useMoveSite 
} from './api/useSites';
import { 
  useCreateSubcategory, 
  useUpdateSubcategory, 
  useDeleteSubcategory, 
  useMoveSubcategory 
} from './api/useSubcategories';

export const useDashboardOperations = () => {
  // Data queries
  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useCategories();
  const { data: sitesData, isLoading: sitesLoading, error: sitesError } = useSites();

  // Ensure data is always an array and properly structured
  const categories = Array.isArray(categoriesData) ? categoriesData.filter(cat => cat && cat.name) : [];
  const sites = Array.isArray(sitesData) ? sitesData.filter(site => site && site.name) : [];

  // Category mutations
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const deleteCategoryMutation = useDeleteCategory();

  // Site mutations
  const createSiteMutation = useCreateSite();
  const updateSiteMutation = useUpdateSite();
  const deleteSiteMutation = useDeleteSite();
  const moveSiteMutation = useMoveSite();

  // Subcategory mutations
  const createSubcategoryMutation = useCreateSubcategory();
  const updateSubcategoryMutation = useUpdateSubcategory();
  const deleteSubcategoryMutation = useDeleteSubcategory();
  const moveSubcategoryMutation = useMoveSubcategory();

  // Category operations
  const handleAddCategory = useCallback(async (name: string, icon?: string) => {
    return createCategoryMutation.mutateAsync({ name, icon });
  }, [createCategoryMutation]);

  const handleUpdateCategory = useCallback(async (categoryId: string, name: string) => {
    return updateCategoryMutation.mutateAsync({ id: categoryId, data: { name } });
  }, [updateCategoryMutation]);

  const handleDeleteCategory = useCallback(async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category and all its subcategories and sites?')) {
      return;
    }
    return deleteCategoryMutation.mutateAsync(categoryId);
  }, [deleteCategoryMutation]);

  // Subcategory operations
  const handleAddSubcategory = useCallback(async (categoryId: string, name: string, icon?: string) => {
    return createSubcategoryMutation.mutateAsync({ name, categoryId, icon });
  }, [createSubcategoryMutation]);

  const handleUpdateSubcategory = useCallback(async (subcategoryId: string, name: string) => {
    return updateSubcategoryMutation.mutateAsync({ id: subcategoryId, data: { name } });
  }, [updateSubcategoryMutation]);

  const handleDeleteSubcategory = useCallback(async (subcategoryId: string) => {
    if (!confirm('Are you sure you want to delete this subcategory and all its sites?')) {
      return;
    }
    return deleteSubcategoryMutation.mutateAsync(subcategoryId);
  }, [deleteSubcategoryMutation]);

  const handleMoveSubcategory = useCallback(async (subcategoryId: string, targetCategoryId: string) => {
    return moveSubcategoryMutation.mutateAsync({ subcategoryId, targetCategoryId });
  }, [moveSubcategoryMutation]);

  // Site operations
  const handleSaveSite = useCallback(async (site: Site, isEditing: boolean = false) => {
    if (isEditing) {
      return updateSiteMutation.mutateAsync(site);
    } else {
      const { id, ...siteData } = site;
      return createSiteMutation.mutateAsync(siteData as Omit<Site, 'id'>);
    }
  }, [createSiteMutation, updateSiteMutation]);

  const handleUpdateSite = useCallback(async (site: Site) => {
    return updateSiteMutation.mutateAsync(site);
  }, [updateSiteMutation]);

  const handleDeleteSite = useCallback(async (siteId: string) => {
    if (!confirm('Are you sure you want to delete this site?')) {
      return;
    }
    return deleteSiteMutation.mutateAsync(siteId);
  }, [deleteSiteMutation]);

  const handleMoveSite = useCallback(async (siteId: string, targetSubcategoryId: string) => {
    return moveSiteMutation.mutateAsync({ siteId, targetSubcategoryId });
  }, [moveSiteMutation]);

  // Loading states
  const isLoading = categoriesLoading || sitesLoading;
  const error = categoriesError || sitesError;

  // Mutation loading states
  const isMutating = 
    createCategoryMutation.isPending ||
    updateCategoryMutation.isPending ||
    deleteCategoryMutation.isPending ||
    createSiteMutation.isPending ||
    updateSiteMutation.isPending ||
    deleteSiteMutation.isPending ||
    moveSiteMutation.isPending ||
    createSubcategoryMutation.isPending ||
    updateSubcategoryMutation.isPending ||
    deleteSubcategoryMutation.isPending ||
    moveSubcategoryMutation.isPending;

  return {
    // Data
    categories,
    sites,
    isLoading,
    error: error?.message || null,
    isMutating,

    // Category operations
    handleAddCategory,
    handleUpdateCategory,
    handleDeleteCategory,

    // Subcategory operations
    handleAddSubcategory,
    handleUpdateSubcategory,
    handleDeleteSubcategory,
    handleMoveSubcategory,

    // Site operations
    handleSaveSite,
    handleUpdateSite,
    handleDeleteSite,
    handleMoveSite,

    // Individual mutation states for specific UI feedback
    categoryOperations: {
      isCreating: createCategoryMutation.isPending,
      isUpdating: updateCategoryMutation.isPending,
      isDeleting: deleteCategoryMutation.isPending,
    },
    siteOperations: {
      isCreating: createSiteMutation.isPending,
      isUpdating: updateSiteMutation.isPending,
      isDeleting: deleteSiteMutation.isPending,
      isMoving: moveSiteMutation.isPending,
    },
    subcategoryOperations: {
      isCreating: createSubcategoryMutation.isPending,
      isUpdating: updateSubcategoryMutation.isPending,
      isDeleting: deleteSubcategoryMutation.isPending,
      isMoving: moveSubcategoryMutation.isPending,
    }
  };
};