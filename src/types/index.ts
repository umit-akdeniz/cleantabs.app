export interface Site {
  id: string;
  name: string;
  url: string;
  logo?: string;
  favicon?: string;
  color?: string;
  customInitials?: string;
  subLinks: SubLink[];
  categoryId: string;
  subcategoryId: string;
  tags: string[];
  description?: string;
  lastChecked?: string;
  nextCheck?: string;
  reminderEnabled: boolean;
  personalNotes?: string;
  rating?: number;
  status?: 'active' | 'inactive' | 'archived';
}

export interface SubLink {
  id: string;
  name: string;
  url: string;
  description?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  subcategories: Subcategory[];
}

export interface Subcategory {
  id: string;
  name: string;
  icon: string;
  items: SubcategoryItem[];
}

export interface SubcategoryItem {
  id: string;
  name: string;
  icon: string;
}