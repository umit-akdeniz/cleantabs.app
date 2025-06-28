import { useState, useEffect, useCallback } from 'react';
import { Site, Category } from '@/types';

interface DatabaseData {
  categories: Category[];
  sites: Site[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

export function useDatabase(): DatabaseData {
  const [categories, setCategories] = useState<Category[]>([]);
  const [sites, setSites] = useState<Site[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Fetch both in parallel for faster loading
      const [categoriesRes, sitesRes] = await Promise.all([
        fetch('/api/categories', { cache: 'no-store' }),
        fetch('/api/sites', { cache: 'no-store' })
      ]);
      
      if (!categoriesRes.ok) throw new Error('Failed to fetch categories');
      if (!sitesRes.ok) throw new Error('Failed to fetch sites');
      
      const [categoriesData, sitesData] = await Promise.all([
        categoriesRes.json(),
        sitesRes.json()
      ]);
      
      setCategories(categoriesData);
      setSites(sitesData);
      setError(null);
    } catch (err) {
      console.error('Database fetch error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refreshData = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  return {
    categories,
    sites,
    loading,
    error,
    refreshData
  };
}