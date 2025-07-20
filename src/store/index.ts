import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

// Global app state
interface AppState {
  // UI state
  sidebarOpen: boolean
  theme: 'light' | 'dark' | 'system'
  layout: 'grid' | 'list'
  
  // User preferences
  preferences: {
    defaultView: 'grid' | 'list'
    itemsPerPage: number
    autoRefresh: boolean
    showFavicons: boolean
    openLinksInNewTab: boolean
    compactMode: boolean
  }
  
  // Search and filter state
  searchQuery: string
  selectedCategory: string | null
  selectedTags: string[]
  sortBy: 'name' | 'date' | 'url' | 'order'
  sortOrder: 'asc' | 'desc'
  
  // Temporary UI state
  selectedItems: Set<string>
  draggedItem: string | null
  contextMenu: {
    open: boolean
    x: number
    y: number
    itemId?: string
    type?: 'category' | 'subcategory' | 'site'
  }
  
  // Actions
  setSidebarOpen: (open: boolean) => void
  setTheme: (theme: 'light' | 'dark' | 'system') => void
  setLayout: (layout: 'grid' | 'list') => void
  updatePreferences: (preferences: Partial<AppState['preferences']>) => void
  setSearchQuery: (query: string) => void
  setSelectedCategory: (category: string | null) => void
  toggleTag: (tag: string) => void
  setSorting: (sortBy: AppState['sortBy'], sortOrder: AppState['sortOrder']) => void
  toggleItemSelection: (itemId: string) => void
  clearSelection: () => void
  setDraggedItem: (itemId: string | null) => void
  openContextMenu: (x: number, y: number, itemId?: string, type?: 'category' | 'subcategory' | 'site') => void
  closeContextMenu: () => void
  reset: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    immer((set, get) => ({
      // Initial state
      sidebarOpen: true,
      theme: 'system',
      layout: 'grid',
      
      preferences: {
        defaultView: 'grid',
        itemsPerPage: 20,
        autoRefresh: false,
        showFavicons: true,
        openLinksInNewTab: true,
        compactMode: false,
      },
      
      searchQuery: '',
      selectedCategory: null,
      selectedTags: [],
      sortBy: 'order',
      sortOrder: 'asc',
      
      selectedItems: new Set(),
      draggedItem: null,
      contextMenu: {
        open: false,
        x: 0,
        y: 0,
      },
      
      // Actions
      setSidebarOpen: (open) => set((state) => {
        state.sidebarOpen = open
      }),
      
      setTheme: (theme) => set((state) => {
        state.theme = theme
      }),
      
      setLayout: (layout) => set((state) => {
        state.layout = layout
      }),
      
      updatePreferences: (newPreferences) => set((state) => {
        state.preferences = { ...state.preferences, ...newPreferences }
      }),
      
      setSearchQuery: (query) => set((state) => {
        state.searchQuery = query
      }),
      
      setSelectedCategory: (category) => set((state) => {
        state.selectedCategory = category
      }),
      
      toggleTag: (tag) => set((state) => {
        const index = state.selectedTags.indexOf(tag)
        if (index > -1) {
          state.selectedTags.splice(index, 1)
        } else {
          state.selectedTags.push(tag)
        }
      }),
      
      setSorting: (sortBy, sortOrder) => set((state) => {
        state.sortBy = sortBy
        state.sortOrder = sortOrder
      }),
      
      toggleItemSelection: (itemId) => set((state) => {
        if (state.selectedItems.has(itemId)) {
          state.selectedItems.delete(itemId)
        } else {
          state.selectedItems.add(itemId)
        }
      }),
      
      clearSelection: () => set((state) => {
        state.selectedItems.clear()
      }),
      
      setDraggedItem: (itemId) => set((state) => {
        state.draggedItem = itemId
      }),
      
      openContextMenu: (x, y, itemId, type) => set((state) => {
        state.contextMenu = {
          open: true,
          x,
          y,
          itemId,
          type,
        }
      }),
      
      closeContextMenu: () => set((state) => {
        state.contextMenu.open = false
      }),
      
      reset: () => set((state) => {
        state.searchQuery = ''
        state.selectedCategory = null
        state.selectedTags = []
        state.selectedItems.clear()
        state.draggedItem = null
        state.contextMenu.open = false
      }),
    })),
    {
      name: 'cleantabs-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        theme: state.theme,
        layout: state.layout,
        preferences: state.preferences,
        sidebarOpen: state.sidebarOpen,
      }),
      // Custom serialization for Set objects
      serialize: (state) => JSON.stringify({
        ...state,
        selectedItems: Array.from(state.selectedItems),
      }),
      deserialize: (str) => {
        const parsed = JSON.parse(str)
        return {
          ...parsed,
          selectedItems: new Set(parsed.selectedItems || []),
        }
      },
    }
  )
)

// Export selectors for better performance
export const useTheme = () => useAppStore((state) => state.theme)
export const useLayout = () => useAppStore((state) => state.layout)
export const useSidebarOpen = () => useAppStore((state) => state.sidebarOpen)
export const usePreferences = () => useAppStore((state) => state.preferences)
export const useSearchQuery = () => useAppStore((state) => state.searchQuery)
export const useSelectedCategory = () => useAppStore((state) => state.selectedCategory)
export const useSelectedTags = () => useAppStore((state) => state.selectedTags)
export const useSorting = () => useAppStore((state) => ({ sortBy: state.sortBy, sortOrder: state.sortOrder }))
export const useSelectedItems = () => useAppStore((state) => state.selectedItems)
export const useContextMenu = () => useAppStore((state) => state.contextMenu)

// Export actions
export const useAppActions = () => useAppStore((state) => ({
  setSidebarOpen: state.setSidebarOpen,
  setTheme: state.setTheme,
  setLayout: state.setLayout,
  updatePreferences: state.updatePreferences,
  setSearchQuery: state.setSearchQuery,
  setSelectedCategory: state.setSelectedCategory,
  toggleTag: state.toggleTag,
  setSorting: state.setSorting,
  toggleItemSelection: state.toggleItemSelection,
  clearSelection: state.clearSelection,
  setDraggedItem: state.setDraggedItem,
  openContextMenu: state.openContextMenu,
  closeContextMenu: state.closeContextMenu,
  reset: state.reset,
}))