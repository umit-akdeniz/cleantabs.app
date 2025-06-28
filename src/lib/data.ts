import { Site, Category } from '@/types';

export const categories: Category[] = [
  {
    id: 'teknoloji',
    name: 'Teknoloji',
    icon: 'Monitor',
    subcategories: [
      { id: 'yazilim', name: 'Yazılım', icon: 'Code', items: [] }
    ]
  }
];

export const initialSites: Site[] = [
  { id: '1', name: 'GitHub', url: 'https://github.com', categoryId: 'teknoloji', subcategoryId: 'yazilim', tags: [], description: 'GitHub resmi web sitesi', color: '#10b981', reminderEnabled: false, subLinks: [] },
  { id: '2', name: 'Stack Overflow', url: 'https://stackoverflow.com', categoryId: 'teknoloji', subcategoryId: 'yazilim', tags: [], description: 'Stack Overflow resmi web sitesi', color: '#3b82f6', reminderEnabled: false, subLinks: [] },
  { id: '3', name: 'Visual Studio Code', url: 'https://code.visualstudio.com', categoryId: 'teknoloji', subcategoryId: 'yazilim', tags: [], description: 'Visual Studio Code resmi web sitesi', color: '#8b5cf6', reminderEnabled: false, subLinks: [] },
  { id: '4', name: 'GitLab', url: 'https://gitlab.com', categoryId: 'teknoloji', subcategoryId: 'yazilim', tags: [], description: 'GitLab resmi web sitesi', color: '#ef4444', reminderEnabled: false, subLinks: [] },
  { id: '5', name: 'JetBrains', url: 'https://jetbrains.com', categoryId: 'teknoloji', subcategoryId: 'yazilim', tags: [], description: 'JetBrains resmi web sitesi', color: '#f59e0b', reminderEnabled: false, subLinks: [] },
  { id: '6', name: 'Bitbucket', url: 'https://bitbucket.org', categoryId: 'teknoloji', subcategoryId: 'yazilim', tags: [], description: 'Bitbucket resmi web sitesi', color: '#ec4899', reminderEnabled: false, subLinks: [] },
  { id: '7', name: 'CodePen', url: 'https://codepen.io', categoryId: 'teknoloji', subcategoryId: 'yazilim', tags: [], description: 'CodePen resmi web sitesi', color: '#06b6d4', reminderEnabled: false, subLinks: [] },
  { id: '8', name: 'Replit', url: 'https://replit.com', categoryId: 'teknoloji', subcategoryId: 'yazilim', tags: [], description: 'Replit resmi web sitesi', color: '#84cc16', reminderEnabled: false, subLinks: [] },
  { id: '9', name: 'Figma', url: 'https://figma.com', categoryId: 'teknoloji', subcategoryId: 'yazilim', tags: [], description: 'Figma resmi web sitesi', color: '#f97316', reminderEnabled: false, subLinks: [] },
  { id: '10', name: 'Notion', url: 'https://notion.so', categoryId: 'teknoloji', subcategoryId: 'yazilim', tags: [], description: 'Notion resmi web sitesi', color: '#6366f1', reminderEnabled: false, subLinks: [] },
  { id: '11', name: 'Intel', url: 'https://intel.com', categoryId: 'teknoloji', subcategoryId: 'yazilim', tags: [], description: 'Intel resmi web sitesi', color: '#14b8a6', reminderEnabled: false, subLinks: [] },
  { id: '12', name: 'AMD', url: 'https://amd.com', categoryId: 'teknoloji', subcategoryId: 'yazilim', tags: [], description: 'AMD resmi web sitesi', color: '#3b82f6', reminderEnabled: false, subLinks: [] },
  { id: '13', name: 'NVIDIA', url: 'https://nvidia.com', categoryId: 'teknoloji', subcategoryId: 'yazilim', tags: [], description: 'NVIDIA resmi web sitesi', color: '#8b5cf6', reminderEnabled: false, subLinks: [] },
  { id: '14', name: 'ASUS', url: 'https://asus.com', categoryId: 'teknoloji', subcategoryId: 'yazilim', tags: [], description: 'ASUS resmi web sitesi', color: '#ef4444', reminderEnabled: false, subLinks: [] },
  { id: '15', name: 'MSI', url: 'https://msi.com', categoryId: 'teknoloji', subcategoryId: 'yazilim', tags: [], description: 'MSI resmi web sitesi', color: '#f59e0b', reminderEnabled: false, subLinks: [] },
  { id: '16', name: 'Corsair', url: 'https://corsair.com', categoryId: 'teknoloji', subcategoryId: 'yazilim', tags: [], description: 'Corsair resmi web sitesi', color: '#ec4899', reminderEnabled: false, subLinks: [] },
  { id: '17', name: 'Logitech', url: 'https://logitech.com', categoryId: 'teknoloji', subcategoryId: 'yazilim', tags: [], description: 'Logitech resmi web sitesi', color: '#06b6d4', reminderEnabled: false, subLinks: [] },
  { id: '18', name: 'Razer', url: 'https://razer.com', categoryId: 'teknoloji', subcategoryId: 'yazilim', tags: [], description: 'Razer resmi web sitesi', color: '#84cc16', reminderEnabled: false, subLinks: [] },
  { id: '19', name: 'SteelSeries', url: 'https://steelseries.com', categoryId: 'teknoloji', subcategoryId: 'yazilim', tags: [], description: 'SteelSeries resmi web sitesi', color: '#f97316', reminderEnabled: false, subLinks: [] },
  { id: '20', name: 'HyperX', url: 'https://hyperx.com', categoryId: 'teknoloji', subcategoryId: 'yazilim', tags: [], description: 'HyperX resmi web sitesi', color: '#6366f1', reminderEnabled: false, subLinks: [] },
  { id: '21', name: 'Apple', url: 'https://apple.com', categoryId: 'teknoloji', subcategoryId: 'yazilim', tags: [], description: 'Apple resmi web sitesi', color: '#10b981', reminderEnabled: false, subLinks: [] },
  { id: '22', name: 'Samsung', url: 'https://samsung.com', categoryId: 'teknoloji', subcategoryId: 'yazilim', tags: [], description: 'Samsung resmi web sitesi', color: '#3b82f6', reminderEnabled: false, subLinks: [] },
  { id: '23', name: 'Google Pixel', url: 'https://store.google.com/category/phones', categoryId: 'teknoloji', subcategoryId: 'yazilim', tags: [], description: 'Google Pixel resmi web sitesi', color: '#8b5cf6', reminderEnabled: false, subLinks: [] },
  { id: '24', name: 'Xiaomi', url: 'https://mi.com', categoryId: 'teknoloji', subcategoryId: 'yazilim', tags: [], description: 'Xiaomi resmi web sitesi', color: '#ef4444', reminderEnabled: false, subLinks: [] },
  { id: '25', name: 'OnePlus', url: 'https://oneplus.com', categoryId: 'teknoloji', subcategoryId: 'yazilim', tags: [], description: 'OnePlus resmi web sitesi', color: '#f59e0b', reminderEnabled: false, subLinks: [] },
  { id: '26', name: 'Huawei', url: 'https://huawei.com', categoryId: 'teknoloji', subcategoryId: 'yazilim', tags: [], description: 'Huawei resmi web sitesi', color: '#ec4899', reminderEnabled: false, subLinks: [] },
  { id: '27', name: 'Oppo', url: 'https://oppo.com', categoryId: 'teknoloji', subcategoryId: 'yazilim', tags: [], description: 'Oppo resmi web sitesi', color: '#06b6d4', reminderEnabled: false, subLinks: [] },
  { id: '28', name: 'Vivo', url: 'https://vivo.com', categoryId: 'teknoloji', subcategoryId: 'yazilim', tags: [], description: 'Vivo resmi web sitesi', color: '#84cc16', reminderEnabled: false, subLinks: [] },
  { id: '29', name: 'Realme', url: 'https://realme.com', categoryId: 'teknoloji', subcategoryId: 'yazilim', tags: [], description: 'Realme resmi web sitesi', color: '#f97316', reminderEnabled: false, subLinks: [] },
  { id: '30', name: 'Nothing', url: 'https://nothing.tech', categoryId: 'teknoloji', subcategoryId: 'yazilim', tags: [], description: 'Nothing resmi web sitesi', color: '#6366f1', reminderEnabled: false, subLinks: [] }
];