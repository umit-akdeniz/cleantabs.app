'use client';

import { Site } from '@/types';
import { ExternalLink, Edit, Trash2, Plus } from 'lucide-react';

interface SiteCardProps {
  site: Site;
  onEdit: (site: Site) => void;
  onDelete: (id: string) => void;
  onAddSubLink: (siteId: string) => void;
}

export default function SiteCard({ site, onEdit, onDelete, onAddSubLink }: SiteCardProps) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow border border-slate-200 dark:border-slate-700">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            {site.name}
          </h3>
          <a
            href={site.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 dark:text-blue-400 hover:underline text-sm flex items-center gap-1 font-medium"
          >
            {site.url}
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onEdit(site)}
            className="p-1 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(site.id)}
            className="p-1 text-slate-500 hover:text-red-600 dark:hover:text-red-400"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300">Sub Links</h4>
          <button
            onClick={() => onAddSubLink(site.id)}
            className="p-1 text-slate-500 hover:text-green-600 dark:hover:text-green-400"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        {site.subLinks.length === 0 ? (
          <p className="text-sm text-slate-500 dark:text-slate-400">No sub links added</p>
        ) : (
          <ul className="space-y-1">
            {site.subLinks.map((subLink) => (
              <li key={subLink.id} className="text-sm">
                <a
                  href={subLink.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
                >
                  {subLink.name}
                  <ExternalLink className="w-3 h-3" />
                </a>
                {subLink.description && (
                  <p className="text-slate-500 dark:text-slate-400 text-xs ml-4">
                    {subLink.description}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}