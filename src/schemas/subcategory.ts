import { z } from 'zod';

// Base subcategory schema
export const SubcategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Subcategory name is required').max(50, 'Subcategory name too long'),
  icon: z.string().optional().default('Folder'),
  categoryId: z.string(),
  userId: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  sites: z.array(z.any()).optional(), // Will be refined in site schema
});

// Schema for creating a subcategory
export const CreateSubcategorySchema = z.object({
  name: z.string().min(1, 'Subcategory name is required').max(50, 'Subcategory name too long'),
  icon: z.string().optional().default('Folder'),
  categoryId: z.string().min(1, 'Category ID is required'),
});

// Schema for updating a subcategory
export const UpdateSubcategorySchema = z.object({
  name: z.string().min(1, 'Subcategory name is required').max(50, 'Subcategory name too long').optional(),
  icon: z.string().optional(),
});

// Schema for moving a subcategory
export const MoveSubcategorySchema = z.object({
  subcategoryId: z.string().min(1, 'Subcategory ID is required'),
  targetCategoryId: z.string().min(1, 'Target category ID is required'),
});

// API request validation schemas
export const SubcategoryParamsSchema = z.object({
  id: z.string().min(1, 'Subcategory ID is required'),
});

export const SubcategoryQuerySchema = z.object({
  id: z.string().optional(),
  categoryId: z.string().optional(),
});

// Type exports
export type Subcategory = z.infer<typeof SubcategorySchema>;
export type CreateSubcategoryInput = z.infer<typeof CreateSubcategorySchema>;
export type UpdateSubcategoryInput = z.infer<typeof UpdateSubcategorySchema>;
export type MoveSubcategoryInput = z.infer<typeof MoveSubcategorySchema>;