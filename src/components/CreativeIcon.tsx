'use client';

import React from 'react';
import { generateCreativeInitials, generateCreativeBackground, createGeometricClipPath, fetchFavicon } from '@/lib/favicon';
import { Globe } from 'lucide-react';

interface CreativeIconProps {
  name: string;
  url?: string;
  customInitials?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  shape?: 'geometric' | 'circle' | 'rounded';
  color?: string;
  className?: string;
  favicon?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm', 
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg'
};

export default function CreativeIcon({
  name,
  url,
  customInitials,
  size = 'md',
  shape = 'geometric',
  color,
  className = '',
  favicon
}: CreativeIconProps) {
  const [faviconUrl, setFaviconUrl] = React.useState<string | null>(favicon || null);
  const [faviconError, setFaviconError] = React.useState(false);
  const [isClient, setIsClient] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);
  
  const initials = generateCreativeInitials(name, customInitials);
  const background = color === null ? 'transparent' : color === 'transparent' ? 'transparent' : (color || generateCreativeBackground(name));
  const clipPath = shape === 'geometric' ? createGeometricClipPath(initials) : undefined;
  const showPlainIcon = color === null;
  const showTransparent = color === 'transparent';
  
  React.useEffect(() => {
    setMounted(true);
    setIsClient(true);
  }, []);
  
  React.useEffect(() => {
    if (mounted && isClient && url && !favicon && !faviconUrl) {
      fetchFavicon(url).then(url => {
        if (url) {
          setFaviconUrl(url);
        }
      }).catch(() => {
        // Silently fail
      });
    }
  }, [mounted, isClient, url, favicon, faviconUrl]);

  const handleFaviconError = () => {
    setFaviconError(true);
    setFaviconUrl(null);
  };

  const getShapeStyle = () => {
    switch (shape) {
      case 'geometric':
        return {
          clipPath: clipPath,
          background: background
        };
      case 'circle':
        return {
          borderRadius: '50%',
          background: background
        };
      case 'rounded':
        return {
          borderRadius: '20%',
          background: background
        };
      default:
        return {
          background: background
        };
    }
  };

  const shouldShowFavicon = mounted && isClient && faviconUrl && !faviconError;

  // Prevent hydration mismatch by showing consistent content until mounted
  if (!mounted) {
    return (
      <div 
        className={`${sizeClasses[size]} flex items-center justify-center font-bold text-white flex-shrink-0 overflow-hidden relative ${className}`}
        style={getShapeStyle()}
      >
        <span 
          style={{ 
            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            fontFamily: 'Inter, Arial, sans-serif'
          }}
        >
          {initials}
        </span>
      </div>
    );
  }

  return (
    <div 
      className={`${sizeClasses[size]} flex items-center justify-center font-bold ${showPlainIcon || showTransparent ? 'text-gray-600 dark:text-gray-400' : 'text-white'} flex-shrink-0 overflow-hidden relative ${className} ${showPlainIcon ? 'bg-gray-100 dark:bg-gray-700 rounded-lg' : showTransparent ? 'border border-gray-300 dark:border-gray-600 rounded-lg' : ''}`}
      style={showPlainIcon || showTransparent ? {} : getShapeStyle()}
    >
      {shouldShowFavicon ? (
        <>
          <img 
            src={faviconUrl} 
            alt={`${name} favicon`}
            className={`${size === 'sm' ? 'w-4 h-4' : size === 'md' ? 'w-6 h-6' : size === 'lg' ? 'w-8 h-8' : 'w-10 h-10'} object-contain`}
            onError={handleFaviconError}
          />
          {!showPlainIcon && !showTransparent && (
            <div 
              className="absolute inset-0 -z-10"
              style={{ background: background, opacity: 0.3 }}
            />
          )}
        </>
      ) : showPlainIcon || showTransparent ? (
        <Globe className={`${size === 'sm' ? 'w-3 h-3' : size === 'md' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-8 h-8'}`} />
      ) : (
        <span 
          style={{ 
            textShadow: '0 1px 2px rgba(0,0,0,0.5)',
            fontFamily: 'Inter, Arial, sans-serif'
          }}
        >
          {initials}
        </span>
      )}
    </div>
  );
}