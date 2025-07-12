export interface PlanLimits {
  maxCategories: number;
  maxSubcategoriesPerCategory: number;
  maxSitesPerSubcategory: number;
  maxTotalSites: number;
}

export const PLAN_LIMITS: Record<'FREE' | 'PREMIUM', PlanLimits> = {
  FREE: {
    maxCategories: 3,
    maxSubcategoriesPerCategory: 5,
    maxSitesPerSubcategory: 10,
    maxTotalSites: 150, // 3 * 5 * 10
  },
  PREMIUM: {
    maxCategories: Infinity,
    maxSubcategoriesPerCategory: Infinity,
    maxSitesPerSubcategory: Infinity,
    maxTotalSites: Infinity,
  },
};

export function checkPlanLimits(
  plan: 'FREE' | 'PREMIUM',
  type: 'category' | 'subcategory' | 'site',
  currentCounts: {
    totalCategories?: number;
    totalSubcategoriesInCategory?: number;
    totalSitesInSubcategory?: number;
    totalSites?: number;
  }
): { allowed: boolean; reason?: string; upgradeRequired?: boolean } {
  const limits = PLAN_LIMITS[plan];

  switch (type) {
    case 'category':
      if ((currentCounts.totalCategories || 0) >= limits.maxCategories) {
        return {
          allowed: false,
          reason: `Free plan allows maximum ${limits.maxCategories} categories. Upgrade to Premium for unlimited categories.`,
          upgradeRequired: true,
        };
      }
      break;

    case 'subcategory':
      if ((currentCounts.totalSubcategoriesInCategory || 0) >= limits.maxSubcategoriesPerCategory) {
        return {
          allowed: false,
          reason: `Free plan allows maximum ${limits.maxSubcategoriesPerCategory} subcategories per category. Upgrade to Premium for unlimited subcategories.`,
          upgradeRequired: true,
        };
      }
      break;

    case 'site':
      if ((currentCounts.totalSitesInSubcategory || 0) >= limits.maxSitesPerSubcategory) {
        return {
          allowed: false,
          reason: `Free plan allows maximum ${limits.maxSitesPerSubcategory} sites per subcategory. Upgrade to Premium for unlimited sites.`,
          upgradeRequired: true,
        };
      }
      if ((currentCounts.totalSites || 0) >= limits.maxTotalSites) {
        return {
          allowed: false,
          reason: `Free plan allows maximum ${limits.maxTotalSites} total sites. Upgrade to Premium for unlimited sites.`,
          upgradeRequired: true,
        };
      }
      break;
  }

  return { allowed: true };
}

export function getPlanUsage(categories: any[], sites: any[], plan: 'FREE' | 'PREMIUM') {
  const limits = PLAN_LIMITS[plan];
  
  const totalCategories = categories.length;
  const totalSites = sites.length;
  
  const subcategoryUsage = Array.isArray(categories) ? categories.map(cat => ({
    categoryId: cat.id,
    categoryName: cat.name,
    subcategoriesCount: cat.subcategories?.length || 0,
    maxSubcategories: limits.maxSubcategoriesPerCategory,
  })) : [];

  const siteUsage = Array.isArray(categories) ? categories.flatMap(cat => 
    Array.isArray(cat.subcategories) ? cat.subcategories.map((sub: any) => ({
      subcategoryId: sub.id,
      subcategoryName: sub.name,
      categoryName: cat.name,
      sitesCount: sites.filter((site: any) => site.subcategoryId === sub.id).length,
      maxSites: limits.maxSitesPerSubcategory,
    })) : []
  ) : [];

  return {
    categories: {
      current: totalCategories,
      max: limits.maxCategories,
      percentage: limits.maxCategories === Infinity ? 0 : (totalCategories / limits.maxCategories) * 100,
    },
    sites: {
      current: totalSites,
      max: limits.maxTotalSites,
      percentage: limits.maxTotalSites === Infinity ? 0 : (totalSites / limits.maxTotalSites) * 100,
    },
    subcategoryUsage,
    siteUsage,
  };
}