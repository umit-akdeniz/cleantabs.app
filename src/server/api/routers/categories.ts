import { z } from 'zod'
import { createTRPCRouter, protectedProcedure } from '@/lib/trpc/server'
import { TRPCError } from '@trpc/server'

const createCategorySchema = z.object({
  name: z.string().min(1, 'Category name is required').max(100),
  icon: z.string().optional(),
  order: z.number().int().min(0).optional(),
})

const updateCategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1).max(100).optional(),
  icon: z.string().optional(),
  order: z.number().int().min(0).optional(),
})

const deleteCategorySchema = z.object({
  id: z.string(),
})

const reorderCategoriesSchema = z.object({
  categories: z.array(z.object({
    id: z.string(),
    order: z.number().int().min(0),
  })),
})

export const categoriesRouter = createTRPCRouter({
  // Get all categories for the current user
  getAll: protectedProcedure
    .query(async ({ ctx }) => {
      const categories = await ctx.prisma.category.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        include: {
          subcategories: {
            include: {
              sites: {
                select: {
                  id: true,
                  name: true,
                  url: true,
                  favicon: true,
                  order: true,
                },
                orderBy: {
                  order: 'asc',
                },
              },
            },
            orderBy: {
              order: 'asc',
            },
          },
          _count: {
            select: {
              subcategories: true,
            },
          },
        },
        orderBy: {
          order: 'asc',
        },
      })

      return categories
    }),

  // Get a single category by ID
  getById: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const category = await ctx.prisma.category.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        include: {
          subcategories: {
            include: {
              sites: {
                orderBy: {
                  order: 'asc',
                },
              },
            },
            orderBy: {
              order: 'asc',
            },
          },
        },
      })

      if (!category) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Category not found',
        })
      }

      return category
    }),

  // Create a new category
  create: protectedProcedure
    .input(createCategorySchema)
    .mutation(async ({ input, ctx }) => {
      // Get the next order value
      const lastCategory = await ctx.prisma.category.findFirst({
        where: {
          userId: ctx.session.user.id,
        },
        orderBy: {
          order: 'desc',
        },
        select: {
          order: true,
        },
      })

      const order = input.order ?? (lastCategory?.order ?? 0) + 1

      const category = await ctx.prisma.category.create({
        data: {
          name: input.name,
          icon: input.icon,
          order,
          userId: ctx.session.user.id,
        },
        include: {
          subcategories: {
            include: {
              sites: true,
            },
          },
          _count: {
            select: {
              subcategories: true,
            },
          },
        },
      })

      return category
    }),

  // Update a category
  update: protectedProcedure
    .input(updateCategorySchema)
    .mutation(async ({ input, ctx }) => {
      // Verify the category belongs to the user
      const existingCategory = await ctx.prisma.category.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      })

      if (!existingCategory) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Category not found',
        })
      }

      const { id, ...updateData } = input

      const category = await ctx.prisma.category.update({
        where: {
          id,
        },
        data: updateData,
        include: {
          subcategories: {
            include: {
              sites: true,
            },
          },
          _count: {
            select: {
              subcategories: true,
            },
          },
        },
      })

      return category
    }),

  // Delete a category
  delete: protectedProcedure
    .input(deleteCategorySchema)
    .mutation(async ({ input, ctx }) => {
      // Verify the category belongs to the user
      const existingCategory = await ctx.prisma.category.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
        include: {
          _count: {
            select: {
              subcategories: true,
            },
          },
        },
      })

      if (!existingCategory) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Category not found',
        })
      }

      // Check if category has subcategories
      if (existingCategory._count.subcategories > 0) {
        throw new TRPCError({
          code: 'PRECONDITION_FAILED',
          message: 'Cannot delete category with subcategories. Delete subcategories first.',
        })
      }

      await ctx.prisma.category.delete({
        where: {
          id: input.id,
        },
      })

      return { success: true }
    }),

  // Reorder categories
  reorder: protectedProcedure
    .input(reorderCategoriesSchema)
    .mutation(async ({ input, ctx }) => {
      // Verify all categories belong to the user
      const categoryIds = input.categories.map(c => c.id)
      const existingCategories = await ctx.prisma.category.findMany({
        where: {
          id: { in: categoryIds },
          userId: ctx.session.user.id,
        },
        select: { id: true },
      })

      if (existingCategories.length !== categoryIds.length) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'One or more categories not found',
        })
      }

      // Update all categories in a transaction
      await ctx.prisma.$transaction(
        input.categories.map(({ id, order }) =>
          ctx.prisma.category.update({
            where: { id },
            data: { order },
          })
        )
      )

      return { success: true }
    }),

  // Get category statistics
  getStats: protectedProcedure
    .query(async ({ ctx }) => {
      const stats = await ctx.prisma.category.findMany({
        where: {
          userId: ctx.session.user.id,
        },
        select: {
          id: true,
          name: true,
          _count: {
            select: {
              subcategories: true,
            },
          },
          subcategories: {
            select: {
              _count: {
                select: {
                  sites: true,
                },
              },
            },
          },
        },
      })

      return stats.map(category => ({
        id: category.id,
        name: category.name,
        subcategoryCount: category._count.subcategories,
        siteCount: category.subcategories.reduce(
          (total, subcategory) => total + subcategory._count.sites,
          0
        ),
      }))
    }),
})