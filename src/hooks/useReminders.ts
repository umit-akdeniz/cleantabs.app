'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

interface Reminder {
  id: string;
  title: string;
  description?: string;
  reminderDate: string;
  reminderType: 'NOTIFICATION' | 'EMAIL' | 'BOTH';
  completed: boolean;
  emailSent: boolean;
  site: {
    id: string;
    name: string;
    url: string;
  };
}

export const useReminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const router = useRouter();

  // Request notification permission
  const requestNotificationPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      return permission === 'granted';
    }
    return false;
  }, []);

  // Check for browser notifications permission
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Fetch reminders
  const fetchReminders = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/reminders');
      
      if (!response.ok) {
        throw new Error('Failed to fetch reminders');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setReminders(data.reminders);
        return data.reminders;
      } else {
        throw new Error(data.error || 'Failed to fetch reminders');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error fetching reminders:', err);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new reminder
  const createReminder = useCallback(async (reminderData: {
    title: string;
    description?: string;
    reminderDate: string;
    reminderType: 'NOTIFICATION' | 'EMAIL' | 'BOTH';
    siteId: string;
  }) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reminderData),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Refresh reminders list
        await fetchReminders();
        
        // Show browser notification if permission granted and type includes NOTIFICATION
        if (
          (reminderData.reminderType === 'NOTIFICATION' || reminderData.reminderType === 'BOTH') &&
          Notification.permission === 'granted'
        ) {
          const reminderDate = new Date(reminderData.reminderDate);
          const now = new Date();
          const timeUntilReminder = reminderDate.getTime() - now.getTime();
          
          // If reminder is in the future, schedule a browser notification
          if (timeUntilReminder > 0) {
            setTimeout(() => {
              new Notification('CleanTabs Reminder', {
                body: `Time to check: ${reminderData.title}`,
                icon: '/icon-192x192.png',
                tag: `reminder-${data.reminder.id}`,
                requireInteraction: true
              });
            }, timeUntilReminder);
          }
        }
        
        return data.reminder;
      } else {
        throw new Error(data.error || 'Failed to create reminder');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error creating reminder:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [fetchReminders]);

  // Check for due reminders and show notifications
  const checkDueReminders = useCallback(async () => {
    if (Notification.permission !== 'granted') return;
    
    try {
      const now = new Date();
      const dueReminders = reminders.filter(reminder => {
        const reminderDate = new Date(reminder.reminderDate);
        return (
          !reminder.completed &&
          reminderDate <= now &&
          (reminder.reminderType === 'NOTIFICATION' || reminder.reminderType === 'BOTH')
        );
      });
      
      dueReminders.forEach(reminder => {
        const notification = new Notification(`CleanTabs Reminder: ${reminder.site.name}`, {
          body: reminder.description || reminder.title,
          icon: '/icon-192x192.png',
          tag: `reminder-${reminder.id}`,
          requireInteraction: true,
          actions: [
            {
              action: 'open',
              title: 'Open Site',
              icon: '/icon-192x192.png'
            },
            {
              action: 'dismiss',
              title: 'Dismiss',
              icon: '/icon-192x192.png'
            }
          ]
        });
        
        notification.onclick = () => {
          window.open(reminder.site.url, '_blank');
          notification.close();
        };
      });
      
    } catch (err) {
      console.error('Error checking due reminders:', err);
    }
  }, [reminders]);

  // Delete a reminder
  const deleteReminder = useCallback(async (reminderId: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/reminders/${reminderId}`, {
        method: 'DELETE',
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        // Remove from local state
        setReminders(prev => prev.filter(r => r.id !== reminderId));
        return true;
      } else {
        throw new Error(data.error || 'Failed to delete reminder');
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      console.error('Error deleting reminder:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Periodic check for due reminders (every minute)
  useEffect(() => {
    if (reminders.length === 0) return;
    
    const interval = setInterval(checkDueReminders, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [reminders, checkDueReminders]);

  // Initial load
  useEffect(() => {
    fetchReminders();
  }, [fetchReminders]);

  return {
    reminders,
    loading,
    error,
    notificationPermission,
    requestNotificationPermission,
    fetchReminders,
    createReminder,
    deleteReminder,
    checkDueReminders
  };
};