'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Category } from '@/types';
import { showToast } from '@/components/Toast';

const CATEGORIES_QUERY_KEY = ['categories'] as const;

// Fetch categories
export const useCategories = () => {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: async (): Promise<Category[]> => {
      const response = await fetch('/api/categories', {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch categories: ${response.status}`);
      }
      
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Create category
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { name: string; icon?: string }) => {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to create category: ${response.status} ${errorData}`);
      }
      
      return response.json();
    },
    onSuccess: (newCategory) => {
      // Optimistically update the cache
      queryClient.setQueryData(CATEGORIES_QUERY_KEY, (oldData: Category[] = []) => {
        return [...oldData, newCategory];
      });
      
      showToast({
        type: 'success',
        title: 'Category Added',
        message: `Category "${newCategory.name}" has been created successfully`
      });
    },
    onError: (error: Error) => {
      console.error('Error creating category:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: error.message || 'Category could not be added. Please try again.'
      });
    }
  });
};

// Update category
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { name: string } }) => {
      const response = await fetch(`/api/categories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update category: ${response.status}`);
      }
      
      return response.json();
    },
    onMutate: async ({ id, data }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: CATEGORIES_QUERY_KEY });
      
      const previousCategories = queryClient.getQueryData(CATEGORIES_QUERY_KEY);
      
      queryClient.setQueryData(CATEGORIES_QUERY_KEY, (oldData: Category[] = []) => 
        oldData.map(cat => cat.id === id ? { ...cat, ...data } : cat)
      );
      
      return { previousCategories };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousCategories) {
        queryClient.setQueryData(CATEGORIES_QUERY_KEY, context.previousCategories);
      }
      
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to update category. Please try again.'
      });
    },
    onSuccess: () => {
      showToast({
        type: 'success',
        title: 'Category Updated',
        message: 'Category has been updated successfully'
      });
    }
  });
};

// Delete category
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (categoryId: string) => {
      const response = await fetch(`/api/categories?id=${categoryId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete category: ${response.status}`);
      }
      
      return response.json();
    },
    onMutate: async (categoryId) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: CATEGORIES_QUERY_KEY });
      
      const previousCategories = queryClient.getQueryData(CATEGORIES_QUERY_KEY);
      
      queryClient.setQueryData(CATEGORIES_QUERY_KEY, (oldData: Category[] = []) => 
        oldData.filter(cat => cat.id !== categoryId)
      );
      
      return { previousCategories };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousCategories) {
        queryClient.setQueryData(CATEGORIES_QUERY_KEY, context.previousCategories);
      }
      
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Category could not be deleted. Please try again.'
      });
    },
    onSuccess: () => {
      // Also invalidate sites as they might be affected
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      
      showToast({
        type: 'success',
        title: 'Category Deleted',
        message: 'Category and all its content have been deleted successfully'
      });
    }
  });
};