'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Site } from '@/types';
import { showToast } from '@/components/Toast';

const SITES_QUERY_KEY = ['sites'] as const;

// Fetch sites
export const useSites = () => {
  return useQuery({
    queryKey: SITES_QUERY_KEY,
    queryFn: async (): Promise<Site[]> => {
      const response = await fetch('/api/sites', {
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Failed to fetch sites: ${response.status}`);
      }
      
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Create site
export const useCreateSite = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (siteData: Omit<Site, 'id'>) => {
      const response = await fetch('/api/sites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(siteData)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create site: ${response.status}`);
      }
      
      return response.json();
    },
    onSuccess: (newSite) => {
      // Optimistically update the cache
      queryClient.setQueryData(SITES_QUERY_KEY, (oldData: Site[] = []) => {
        return [...oldData, newSite];
      });
      
      showToast({
        type: 'success',
        title: 'Site Added',
        message: `${newSite.name} has been added successfully`
      });
    },
    onError: (error: Error) => {
      console.error('Error creating site:', error);
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Site could not be saved. Please try again.'
      });
    }
  });
};

// Update site
export const useUpdateSite = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (site: Site) => {
      const response = await fetch(`/api/sites/${site.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(site)
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update site: ${response.status}`);
      }
      
      return response.json();
    },
    onMutate: async (newSite) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: SITES_QUERY_KEY });
      
      const previousSites = queryClient.getQueryData(SITES_QUERY_KEY);
      
      queryClient.setQueryData(SITES_QUERY_KEY, (oldData: Site[] = []) => 
        oldData.map(site => site.id === newSite.id ? { ...site, ...newSite } : site)
      );
      
      return { previousSites };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousSites) {
        queryClient.setQueryData(SITES_QUERY_KEY, context.previousSites);
      }
      
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to update site. Please try again.'
      });
    },
    onSuccess: (updatedSite) => {
      showToast({
        type: 'success',
        title: 'Site Updated',
        message: `${updatedSite.name} has been updated successfully`
      });
    }
  });
};

// Delete site
export const useDeleteSite = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (siteId: string) => {
      const response = await fetch(`/api/sites/${siteId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`Failed to delete site: ${response.status}`);
      }
      
      return response.json();
    },
    onMutate: async (siteId) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: SITES_QUERY_KEY });
      
      const previousSites = queryClient.getQueryData(SITES_QUERY_KEY) as Site[];
      const siteToDelete = previousSites?.find(s => s.id === siteId);
      
      queryClient.setQueryData(SITES_QUERY_KEY, (oldData: Site[] = []) => 
        oldData.filter(site => site.id !== siteId)
      );
      
      return { previousSites, siteToDelete };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousSites) {
        queryClient.setQueryData(SITES_QUERY_KEY, context.previousSites);
      }
      
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to delete site. Please try again.'
      });
    },
    onSuccess: (data, siteId, context) => {
      showToast({
        type: 'success',
        title: 'Site Deleted',
        message: `${context?.siteToDelete?.name || 'Site'} has been deleted successfully`
      });
    }
  });
};

// Move site to different subcategory
export const useMoveSite = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ siteId, targetSubcategoryId }: { siteId: string; targetSubcategoryId: string }) => {
      const response = await fetch('/api/sites/move', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ siteId, targetSubcategoryId })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(`Failed to move site: ${response.status}`);
      }
      
      return response.json();
    },
    onMutate: async ({ siteId, targetSubcategoryId }) => {
      // Optimistic update
      await queryClient.cancelQueries({ queryKey: SITES_QUERY_KEY });
      
      const previousSites = queryClient.getQueryData(SITES_QUERY_KEY);
      
      queryClient.setQueryData(SITES_QUERY_KEY, (oldData: Site[] = []) => 
        oldData.map(site => 
          site.id === siteId 
            ? { ...site, subcategoryId: targetSubcategoryId }
            : site
        )
      );
      
      return { previousSites };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousSites) {
        queryClient.setQueryData(SITES_QUERY_KEY, context.previousSites);
      }
      
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Failed to move site. Please try again.'
      });
    },
    onSuccess: () => {
      showToast({
        type: 'success',
        title: 'Site Moved',
        message: 'Site has been moved successfully'
      });
    }
  });
};