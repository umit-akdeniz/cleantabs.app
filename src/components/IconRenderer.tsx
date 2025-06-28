'use client';

import { LucideIcon } from 'lucide-react';
import * as Icons from 'lucide-react';

interface IconRendererProps {
  iconName: string;
  className?: string;
  size?: number;
}

export default function IconRenderer({ iconName, className = '', size = 20 }: IconRendererProps) {
  const IconComponent = (Icons as any)[iconName] as LucideIcon;
  
  if (!IconComponent) {
    return <Icons.Circle className={className} size={size} />;
  }
  
  return <IconComponent className={className} size={size} />;
}