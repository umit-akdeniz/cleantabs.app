import { z } from 'zod';

// Base category schema
export const CategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Category name is required').max(50, 'Category name too long'),
  icon: z.string().optional().default('Folder'),
  userId: z.string(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
  subcategories: z.array(z.any()).optional(), // Will be refined in subcategory schema
});

// Schema for creating a category
export const CreateCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(50, 'Category name too long'),
  icon: z.string().optional().default('Folder'),
});

// Schema for updating a category
export const UpdateCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(50, 'Category name too long').optional(),
  icon: z.string().optional(),
});

// API request validation schemas
export const CategoryParamsSchema = z.object({
  id: z.string().min(1, 'Category ID is required'),
});

export const CategoryQuerySchema = z.object({
  id: z.string().optional(),
});

// Type exports
export type Category = z.infer<typeof CategorySchema>;
export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;