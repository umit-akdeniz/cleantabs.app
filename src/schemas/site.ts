import { z } from 'zod';

// URL validation schema
const UrlSchema = z.string().url('Please enter a valid URL');

// Base site schema
export const SiteSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Site name is required').max(100, 'Site name too long'),
  url: UrlSchema,
  description: z.string().max(500, 'Description too long').optional(),
  color: z.string().optional(),
  favicon: z.string().url().optional().nullable(),
  customInitials: z.string().max(3, 'Initials too long').optional(),
  personalNotes: z.string().max(1000, 'Notes too long').optional(),
  tags: z.array(z.string()).optional().default([]),
  reminderEnabled: z.boolean().optional().default(false),
  categoryId: z.string(),
  subcategoryId: z.string(),
  userId: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  subLinks: z.array(z.object({
    name: z.string().min(1, 'Link name is required').max(100, 'Link name too long'),
    url: UrlSchema,
  })).optional().default([]),
});

// Schema for creating a site
export const CreateSiteSchema = z.object({
  name: z.string().min(1, 'Site name is required').max(100, 'Site name too long'),
  url: UrlSchema,
  description: z.string().max(500, 'Description too long').optional(),
  color: z.string().optional(),
  favicon: z.string().url().optional().nullable(),
  customInitials: z.string().max(3, 'Initials too long').optional(),
  personalNotes: z.string().max(1000, 'Notes too long').optional(),
  tags: z.array(z.string()).optional().default([]),
  reminderEnabled: z.boolean().optional().default(false),
  categoryId: z.string().min(1, 'Category ID is required'),
  subcategoryId: z.string().min(1, 'Subcategory ID is required'),
  subLinks: z.array(z.object({
    name: z.string().min(1, 'Link name is required').max(100, 'Link name too long'),
    url: UrlSchema,
  })).optional().default([]),
});

// Schema for updating a site
export const UpdateSiteSchema = z.object({
  name: z.string().min(1, 'Site name is required').max(100, 'Site name too long').optional(),
  url: UrlSchema.optional(),
  description: z.string().max(500, 'Description too long').optional(),
  color: z.string().optional(),
  favicon: z.string().url().optional().nullable(),
  customInitials: z.string().max(3, 'Initials too long').optional(),
  personalNotes: z.string().max(1000, 'Notes too long').optional(),
  tags: z.array(z.string()).optional(),
  reminderEnabled: z.boolean().optional(),
  categoryId: z.string().optional(),
  subcategoryId: z.string().optional(),
  subLinks: z.array(z.object({
    name: z.string().min(1, 'Link name is required').max(100, 'Link name too long'),
    url: UrlSchema,
  })).optional(),
});

// Schema for moving a site
export const MoveSiteSchema = z.object({
  siteId: z.string().min(1, 'Site ID is required'),
  targetSubcategoryId: z.string().min(1, 'Target subcategory ID is required'),
});

// API request validation schemas
export const SiteParamsSchema = z.object({
  id: z.string().min(1, 'Site ID is required'),
});

export const SiteQuerySchema = z.object({
  categoryId: z.string().optional(),
  subcategoryId: z.string().optional(),
  page: z.string().transform(Number).optional(),
  limit: z.string().transform(Number).optional(),
  search: z.string().optional(),
  tags: z.string().optional(), // Comma-separated tags
});

// Type exports
export type Site = z.infer<typeof SiteSchema>;
export type CreateSiteInput = z.infer<typeof CreateSiteSchema>;
export type UpdateSiteInput = z.infer<typeof UpdateSiteSchema>;
export type MoveSiteInput = z.infer<typeof MoveSiteSchema>;