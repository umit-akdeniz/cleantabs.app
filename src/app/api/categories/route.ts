import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateId } from '@/lib/utils';
import { MiddlewareUtils } from '@/lib/auth/middleware-utils';
import { APIErrorHandler, withErrorHandler } from '@/lib/api/error-handler';
import { CacheManager } from '@/lib/cache/cache-manager';
import { z } from 'zod';

export const GET = withErrorHandler(async (request: NextRequest) => {
  const user = await MiddlewareUtils.getAuthenticatedUser(request);
  
  if (!user) {
    return APIErrorHandler.unauthorized();
  }

  // Try cache first
  const cacheKey = CacheManager.getUserCacheKey(user.userId, 'categories');
  const cached = CacheManager.get(cacheKey);
  
  if (cached) {
    return APIErrorHandler.success(cached);
  }

  const categories = await prisma.category.findMany({
    where: { userId: user.userId },
    include: {
      subcategories: {
        include: {
          sites: {
            include: {
              tags: true,
              subLinks: true
            }
          }
        }
      }
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  // Transform data to match the expected format
  const transformedCategories = Array.isArray(categories) ? categories.map(category => ({
    id: category.id,
    name: category.name,
    icon: category.icon,
    subcategories: Array.isArray(category.subcategories) ? category.subcategories.map(sub => ({
      id: sub.id,
      name: sub.name,
      icon: sub.icon,
      items: Array.isArray(sub.sites) ? sub.sites.map(site => ({
        id: site.id,
        name: site.name,
        url: site.url,
        description: site.description,
        color: site.color,
        favicon: site.favicon,
        personalNotes: site.personalNotes,
        tags: Array.isArray(site.tags) ? site.tags.map(tag => tag.name) : [],
        reminderEnabled: site.reminderEnabled,
        categoryId: category.id,
        subcategoryId: sub.id,
        subLinks: Array.isArray(site.subLinks) ? site.subLinks.map(link => ({
          name: link.name,
          url: link.url
        })) : []
      })) : []
    })) : []
  })) : [];

  // Cache the result
  CacheManager.set(cacheKey, transformedCategories, {
    ttl: 10 * 60 * 1000, // 10 minutes
    tags: ['categories', `user:${user.userId}`]
  });

  return APIErrorHandler.success(transformedCategories);
});

const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(50, 'Category name too long'),
  icon: z.string().optional().default('Folder')
});

export const POST = withErrorHandler(async (request: NextRequest) => {
  const user = await MiddlewareUtils.getAuthenticatedUser(request);
  
  if (!user) {
    return APIErrorHandler.unauthorized();
  }

  const body = await request.json();
  const { name, icon } = createCategorySchema.parse(body);

  const category = await prisma.category.create({
    data: {
      name,
      icon,
      userId: user.userId
    },
    include: {
      subcategories: true
    }
  });

  // Invalidate user's categories cache
  CacheManager.clearByTags([`user:${user.userId}`, 'categories']);

  return APIErrorHandler.success(category, 201);
});

export const DELETE = withErrorHandler(async (request: NextRequest) => {
  const user = await MiddlewareUtils.getAuthenticatedUser(request);
  
  if (!user) {
    return APIErrorHandler.unauthorized();
  }

  const { searchParams } = new URL(request.url);
  const categoryId = searchParams.get('id');
  
  if (!categoryId) {
    return APIErrorHandler.badRequest('Category ID is required');
  }

  // Verify ownership before deletion
  const category = await prisma.category.findFirst({
    where: { 
      id: categoryId,
      userId: user.userId 
    }
  });

  if (!category) {
    return APIErrorHandler.notFound('Category');
  }

  await prisma.category.delete({
    where: { id: categoryId }
  });

  // Invalidate user's cache
  CacheManager.clearByTags([`user:${user.userId}`, 'categories', 'sites']);

  return APIErrorHandler.success({ success: true });
});