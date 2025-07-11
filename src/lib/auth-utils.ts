'use client';

import { signOut as nextAuthSignOut } from 'next-auth/react';

export function clearAllStorageData() {
  if (typeof window === 'undefined') return;
  
  try {
    // Clear localStorage
    localStorage.clear();
    
    // Clear sessionStorage
    sessionStorage.clear();
    
    // Clear specific auth-related items
    const authKeys = [
      'next-auth.session-token',
      'next-auth.callback-url',
      'next-auth.csrf-token',
      'next-auth.pkce.code_verifier',
      'admin_access_key',
      'user_preferences',
      'dashboard_settings',
      'categories_cache',
      'sites_cache'
    ];
    
    authKeys.forEach(key => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });
    
    // Clear all cookies (client-side accessible ones)
    document.cookie.split(";").forEach(cookie => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      if (name) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.cleantabs.app`;
      }
    });
    
    console.log('All storage data cleared');
  } catch (error) {
    console.error('Error clearing storage:', error);
  }
}

export async function performCompleteSignOut(callbackUrl: string = '/auth/signin') {
  try {
    console.log('Performing complete sign out...');
    
    // Clear all storage first
    clearAllStorageData();
    
    // Sign out with NextAuth
    await nextAuthSignOut({
      callbackUrl,
      redirect: true
    });
    
    // Force reload to ensure clean state
    setTimeout(() => {
      window.location.href = callbackUrl;
    }, 100);
    
  } catch (error) {
    console.error('Error during sign out:', error);
    // Fallback: force redirect
    window.location.href = callbackUrl;
  }
}

export function initializeUserSession(user: any) {
  if (typeof window === 'undefined') return;
  
  try {
    // Set user-specific data
    const userPreferences = {
      theme: 'system',
      lastLogin: new Date().toISOString(),
      userId: user.id,
      email: user.email,
      plan: user.plan
    };
    
    localStorage.setItem('user_preferences', JSON.stringify(userPreferences));
    
    // Clear any stale cache data
    localStorage.removeItem('categories_cache');
    localStorage.removeItem('sites_cache');
    
    console.log('User session initialized');
  } catch (error) {
    console.error('Error initializing user session:', error);
  }
}

export function validateSession(): boolean {
  if (typeof window === 'undefined') return false;
  
  try {
    const userPrefs = localStorage.getItem('user_preferences');
    if (!userPrefs) return false;
    
    const prefs = JSON.parse(userPrefs);
    
    // Check if session is too old (24 hours)
    const lastLogin = new Date(prefs.lastLogin);
    const now = new Date();
    const hoursDiff = (now.getTime() - lastLogin.getTime()) / (1000 * 60 * 60);
    
    if (hoursDiff > 24) {
      console.log('Session expired, clearing data');
      clearAllStorageData();
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error validating session:', error);
    return false;
  }
}