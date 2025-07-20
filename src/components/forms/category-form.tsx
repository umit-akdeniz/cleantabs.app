'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Category name is required')
    .max(100, 'Category name must be less than 100 characters'),
  icon: z.string().optional(),
})

type CategoryFormData = z.infer<typeof categorySchema>

interface CategoryFormProps {
  onSubmit: (data: CategoryFormData) => Promise<void>
  defaultValues?: Partial<CategoryFormData>
  isLoading?: boolean
  submitLabel?: string
}

export function CategoryForm({
  onSubmit,
  defaultValues,
  isLoading = false,
  submitLabel = 'Create Category',
}: CategoryFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      name: '',
      icon: '',
      ...defaultValues,
    },
    mode: 'onChange',
  })

  const onFormSubmit = async (data: CategoryFormData) => {
    if (isSubmitting || isLoading) return

    try {
      setIsSubmitting(true)
      await onSubmit(data)
      if (!defaultValues) {
        reset() // Only reset if creating new category
      }
    } catch (error) {
      console.error('Form submission error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const loading = isSubmitting || isLoading

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Category Name</Label>
        <Input
          id="name"
          {...register('name')}
          placeholder="Enter category name"
          disabled={loading}
          aria-invalid={errors.name ? 'true' : 'false'}
        />
        {errors.name && (
          <p className="text-sm text-red-600" role="alert">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="icon">Icon (optional)</Label>
        <Input
          id="icon"
          {...register('icon')}
          placeholder="Enter emoji or icon name"
          disabled={loading}
          aria-invalid={errors.icon ? 'true' : 'false'}
        />
        <p className="text-xs text-gray-500">
          You can use emojis like 📚, 🔗, 💼 or icon names
        </p>
        {errors.icon && (
          <p className="text-sm text-red-600" role="alert">
            {errors.icon.message}
          </p>
        )}
      </div>

      <Button
        type="submit"
        disabled={loading || !isValid}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {defaultValues ? 'Updating...' : 'Creating...'}
          </>
        ) : (
          submitLabel
        )}
      </Button>
    </form>
  )
}

// Example usage with tRPC
export function CreateCategoryForm() {
  const utils = api.useUtils()
  const createCategory = api.categories.create.useMutation({
    onSuccess: () => {
      utils.categories.getAll.invalidate()
    },
  })

  return (
    <CategoryForm
      onSubmit={async (data) => {
        await createCategory.mutateAsync(data)
      }}
      isLoading={createCategory.isLoading}
      submitLabel="Create Category"
    />
  )
}

export function EditCategoryForm({ 
  categoryId, 
  defaultValues 
}: { 
  categoryId: string
  defaultValues: CategoryFormData 
}) {
  const utils = api.useUtils()
  const updateCategory = api.categories.update.useMutation({
    onSuccess: () => {
      utils.categories.getAll.invalidate()
      utils.categories.getById.invalidate({ id: categoryId })
    },
  })

  return (
    <CategoryForm
      onSubmit={async (data) => {
        await updateCategory.mutateAsync({ id: categoryId, ...data })
      }}
      defaultValues={defaultValues}
      isLoading={updateCategory.isLoading}
      submitLabel="Update Category"
    />
  )
}