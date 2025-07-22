import { Site, Category } from '@/types';

export const categories: Category[] = [
  {
    id: 'technology',
    name: 'Technology',
    icon: 'Monitor',
    subcategories: [
      { id: 'software', name: 'Software', icon: 'Code', items: [] }
    ]
  }
];

export const initialSites: Site[] = [
  { id: '1', name: 'GitHub', url: 'https://github.com', categoryId: 'technology', subcategoryId: 'software', tags: [], description: 'GitHub official website', color: '#10b981', reminderEnabled: false, subLinks: [] },
  { id: '2', name: 'Stack Overflow', url: 'https://stackoverflow.com', categoryId: 'technology', subcategoryId: 'software', tags: [], description: 'Stack Overflow official website', color: '#3b82f6', reminderEnabled: false, subLinks: [] },
  { id: '3', name: 'Visual Studio Code', url: 'https://code.visualstudio.com', categoryId: 'technology', subcategoryId: 'software', tags: [], description: 'Visual Studio Code official website', color: '#8b5cf6', reminderEnabled: false, subLinks: [] },
  { id: '4', name: 'GitLab', url: 'https://gitlab.com', categoryId: 'technology', subcategoryId: 'software', tags: [], description: 'GitLab official website', color: '#ef4444', reminderEnabled: false, subLinks: [] },
  { id: '5', name: 'JetBrains', url: 'https://jetbrains.com', categoryId: 'technology', subcategoryId: 'software', tags: [], description: 'JetBrains official website', color: '#f59e0b', reminderEnabled: false, subLinks: [] },
  { id: '6', name: 'Bitbucket', url: 'https://bitbucket.org', categoryId: 'technology', subcategoryId: 'software', tags: [], description: 'Bitbucket official website', color: '#ec4899', reminderEnabled: false, subLinks: [] },
  { id: '7', name: 'CodePen', url: 'https://codepen.io', categoryId: 'technology', subcategoryId: 'software', tags: [], description: 'CodePen official website', color: '#06b6d4', reminderEnabled: false, subLinks: [] },
  { id: '8', name: 'Replit', url: 'https://replit.com', categoryId: 'technology', subcategoryId: 'software', tags: [], description: 'Replit official website', color: '#84cc16', reminderEnabled: false, subLinks: [] },
  { id: '9', name: 'Figma', url: 'https://figma.com', categoryId: 'technology', subcategoryId: 'software', tags: [], description: 'Figma official website', color: '#f97316', reminderEnabled: false, subLinks: [] },
  { id: '10', name: 'Notion', url: 'https://notion.so', categoryId: 'technology', subcategoryId: 'software', tags: [], description: 'Notion official website', color: '#6366f1', reminderEnabled: false, subLinks: [] },
  { id: '11', name: 'Intel', url: 'https://intel.com', categoryId: 'technology', subcategoryId: 'software', tags: [], description: 'Intel official website', color: '#14b8a6', reminderEnabled: false, subLinks: [] },
  { id: '12', name: 'AMD', url: 'https://amd.com', categoryId: 'technology', subcategoryId: 'software', tags: [], description: 'AMD official website', color: '#3b82f6', reminderEnabled: false, subLinks: [] },
  { id: '13', name: 'NVIDIA', url: 'https://nvidia.com', categoryId: 'technology', subcategoryId: 'software', tags: [], description: 'NVIDIA official website', color: '#8b5cf6', reminderEnabled: false, subLinks: [] },
  { id: '14', name: 'ASUS', url: 'https://asus.com', categoryId: 'technology', subcategoryId: 'software', tags: [], description: 'ASUS official website', color: '#ef4444', reminderEnabled: false, subLinks: [] },
  { id: '15', name: 'MSI', url: 'https://msi.com', categoryId: 'technology', subcategoryId: 'software', tags: [], description: 'MSI official website', color: '#f59e0b', reminderEnabled: false, subLinks: [] },
  { id: '16', name: 'Corsair', url: 'https://corsair.com', categoryId: 'technology', subcategoryId: 'software', tags: [], description: 'Corsair official website', color: '#ec4899', reminderEnabled: false, subLinks: [] },
  { id: '17', name: 'Logitech', url: 'https://logitech.com', categoryId: 'technology', subcategoryId: 'software', tags: [], description: 'Logitech official website', color: '#06b6d4', reminderEnabled: false, subLinks: [] },
  { id: '18', name: 'Razer', url: 'https://razer.com', categoryId: 'technology', subcategoryId: 'software', tags: [], description: 'Razer official website', color: '#84cc16', reminderEnabled: false, subLinks: [] },
  { id: '19', name: 'SteelSeries', url: 'https://steelseries.com', categoryId: 'technology', subcategoryId: 'software', tags: [], description: 'SteelSeries official website', color: '#f97316', reminderEnabled: false, subLinks: [] },
  { id: '20', name: 'HyperX', url: 'https://hyperx.com', categoryId: 'technology', subcategoryId: 'software', tags: [], description: 'HyperX official website', color: '#6366f1', reminderEnabled: false, subLinks: [] },
  { id: '21', name: 'Apple', url: 'https://apple.com', categoryId: 'technology', subcategoryId: 'software', tags: [], description: 'Apple official website', color: '#10b981', reminderEnabled: false, subLinks: [] },
  { id: '22', name: 'Samsung', url: 'https://samsung.com', categoryId: 'technology', subcategoryId: 'software', tags: [], description: 'Samsung official website', color: '#3b82f6', reminderEnabled: false, subLinks: [] },
  { id: '23', name: 'Google Pixel', url: 'https://store.google.com/category/phones', categoryId: 'technology', subcategoryId: 'software', tags: [], description: 'Google Pixel official website', color: '#8b5cf6', reminderEnabled: false, subLinks: [] },
  { id: '24', name: 'Xiaomi', url: 'https://mi.com', categoryId: 'technology', subcategoryId: 'software', tags: [], description: 'Xiaomi official website', color: '#ef4444', reminderEnabled: false, subLinks: [] },
  { id: '25', name: 'OnePlus', url: 'https://oneplus.com', categoryId: 'technology', subcategoryId: 'software', tags: [], description: 'OnePlus official website', color: '#f59e0b', reminderEnabled: false, subLinks: [] },
  { id: '26', name: 'Huawei', url: 'https://huawei.com', categoryId: 'technology', subcategoryId: 'software', tags: [], description: 'Huawei official website', color: '#ec4899', reminderEnabled: false, subLinks: [] },
  { id: '27', name: 'Oppo', url: 'https://oppo.com', categoryId: 'technology', subcategoryId: 'software', tags: [], description: 'Oppo official website', color: '#06b6d4', reminderEnabled: false, subLinks: [] },
  { id: '28', name: 'Vivo', url: 'https://vivo.com', categoryId: 'technology', subcategoryId: 'software', tags: [], description: 'Vivo official website', color: '#84cc16', reminderEnabled: false, subLinks: [] },
  { id: '29', name: 'Realme', url: 'https://realme.com', categoryId: 'technology', subcategoryId: 'software', tags: [], description: 'Realme official website', color: '#f97316', reminderEnabled: false, subLinks: [] },
  { id: '30', name: 'Nothing', url: 'https://nothing.tech', categoryId: 'technology', subcategoryId: 'software', tags: [], description: 'Nothing official website', color: '#6366f1', reminderEnabled: false, subLinks: [] }
];