'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { showToast } from '@/components/Toast';

// Create subcategory
export const useCreateSubcategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: { name: string; categoryId: string; icon?: string }) => {
      const response = await fetch('/api/subcategories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create subcategory: ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: (newSubcategory, variables) => {
      // Invalidate categories to refetch with new subcategory
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      
      showToast({
        type: 'success',
        title: 'Subcategory Added',
        message: `Subcategory "${newSubcategory.name}" has been added successfully`
      });
    },
    onError: (error: Error) => {
      console.error('Error creating subcategory:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to add subcategory. Please try again.'
      });
    }
  });
};

// Update subcategory
export const useUpdateSubcategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { name: string } }) => {
      const response = await fetch(`/api/subcategories/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update subcategory: ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate categories to refetch with updated subcategory
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      
      showToast({
        type: 'success',
        title: 'Subcategory Updated',
        message: 'Subcategory has been updated successfully'
      });
    },
    onError: (error: Error) => {
      console.error('Error updating subcategory:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to update subcategory. Please try again.'
      });
    }
  });
};

// Delete subcategory
export const useDeleteSubcategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (subcategoryId: string) => {
      const response = await fetch(`/api/subcategories?id=${subcategoryId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete subcategory: ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate both categories and sites as they might be affected
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      queryClient.invalidateQueries({ queryKey: ['sites'] });
      
      showToast({
        type: 'success',
        title: 'Subcategory Deleted',
        message: 'Subcategory and all its sites have been deleted successfully'
      });
    },
    onError: (error: Error) => {
      console.error('Error deleting subcategory:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Subcategory could not be deleted. Please try again.'
      });
    }
  });
};

// Move subcategory to different category
export const useMoveSubcategory = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ subcategoryId, targetCategoryId }: { subcategoryId: string; targetCategoryId: string }) => {
      const response = await fetch('/api/subcategories/move', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subcategoryId, targetCategoryId })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to move subcategory: ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidate categories to refetch with moved subcategory
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      
      showToast({
        type: 'success',
        title: 'Subcategory Moved',
        message: 'Subcategory has been moved successfully'
      });
    },
    onError: (error: Error) => {
      console.error('Error moving subcategory:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to move subcategory. Please try again.'
      });
    }
  });
};