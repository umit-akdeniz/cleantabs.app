import { useState, useEffect, useCallback } from 'react';
import { Site, Category } from '@/types';
import { useAuth } from '@/lib/auth/context';

interface DatabaseData {
  categories: Category[];
  sites: Site[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
  refreshCategories: () => Promise<void>;
}

export function useDatabase(): DatabaseData {
  const { user, isAuthenticated } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setCategories([]);
      setSites([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const headers = {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'x-user-id': user.id,
        'x-user-email': user.email,
        'x-user-plan': user.plan || 'FREE'
      };
      
      // Fetch both in parallel for faster loading
      const [categoriesRes, sitesRes] = await Promise.all([
        fetch('/api/categories', { 
          cache: 'no-store',
          headers
        }),
        fetch('/api/sites', { 
          cache: 'no-store',
          headers
        })
      ]);
      
      if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
      if (!sitesRes.ok) throw new Error('Failed to fetch sites');
      
      const [categoriesData, sitesData] = await Promise.all([
        categoriesRes.json(),
        sitesRes.json()
      ]);

      console.log('🔍 Categories API response:', categoriesData);
      console.log('🔍 Sites API response:', sitesData);
      
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      setSites(Array.isArray(sitesData) ? sitesData : []);
      setError(null);
    } catch (err) {
      console.error('Database fetch error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refreshData = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  const refreshCategories = useCallback(async () => {
    if (!isAuthenticated || !user) return;

    try {
      const headers = {
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'x-user-id': user.id,
        'x-user-email': user.email,
        'x-user-plan': user.plan || 'FREE'
      };

      const categoriesRes = await fetch('/api/categories', { 
        cache: 'no-store',
        headers
      });
      if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
      const categoriesData = await categoriesRes.json();
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
    } catch (err) {
      console.error('Categories fetch error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    }
  }, [isAuthenticated, user]);

  return {
    categories,
    sites,
    loading,
    error,
    refreshData,
    refreshCategories
  };
}