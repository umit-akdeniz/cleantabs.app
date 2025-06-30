'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell, Calendar, Clock, Edit, Trash2, Plus, CheckCircle, XCircle } from 'lucide-react';

interface Reminder {
  id: string;
  title: string;
  description: string;
  reminderDate: string;
  reminderType: 'NOTIFICATION' | 'EMAIL' | 'BOTH';
  siteId: string;
  siteName: string;
  isCompleted: boolean;
  createdAt: string;
}

export default function RemindersPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active');

  useEffect(() => {
    if (session) {
      fetchReminders();
    }
  }, [session]);

  const fetchReminders = async () => {
    try {
      const response = await fetch('/api/reminders');
      if (response.ok) {
        const data = await response.json();
        setReminders(data);
      }
    } catch (error) {
      console.error('Error fetching reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteReminder = async (id: string) => {
    if (!confirm('Are you sure you want to delete this reminder?')) return;
    
    try {
      const response = await fetch(`/api/reminders/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        setReminders(reminders.filter(r => r.id !== id));
      }
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };

  const toggleCompleted = async (id: string) => {
    try {
      const reminder = reminders.find(r => r.id === id);
      if (!reminder) return;

      const response = await fetch(`/api/reminders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...reminder, isCompleted: !reminder.isCompleted })
      });
      
      if (response.ok) {
        const updated = await response.json();
        setReminders(reminders.map(r => r.id === id ? updated : r));
      }
    } catch (error) {
      console.error('Error updating reminder:', error);
    }
  };

  const filteredReminders = reminders.filter(reminder => {
    if (filter === 'active') return !reminder.isCompleted;
    if (filter === 'completed') return reminder.isCompleted;
    return true;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    if (days === -1) return 'Yesterday';
    if (days < 0) return `${Math.abs(days)} days ago`;
    return `In ${days} days`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900">
      {/* Header */}
      <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/20 dark:border-slate-700/30 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
            </button>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100">Reminders</h1>
                <p className="text-sm text-slate-500 dark:text-slate-400">Manage your reminders</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filter Tabs */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'active'
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              Active ({reminders.filter(r => !r.isCompleted).length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'completed'
                  ? 'bg-green-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              Completed ({reminders.filter(r => r.isCompleted).length})
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-slate-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
              }`}
            >
              All ({reminders.length})
            </button>
          </div>
          
          <button
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2 font-medium"
          >
            <Plus className="w-4 h-4" />
            Add New Reminder
          </button>
        </div>

        {/* Reminders List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : filteredReminders.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
              {filter === 'active' ? 'No active reminders' : 
               filter === 'completed' ? 'No completed reminders' : 
               'No reminders yet'}
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              {filter === 'active' ? 'All your reminders are completed!' : 
               filter === 'completed' ? 'Complete some reminders to see them here.' : 
               'Create your first reminder to get started.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredReminders.map((reminder) => (
              <div
                key={reminder.id}
                className={`bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 shadow-sm hover:shadow-md transition-all ${
                  reminder.isCompleted ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <button
                      onClick={() => toggleCompleted(reminder.id)}
                      className={`mt-1 p-1 rounded-full transition-colors ${
                        reminder.isCompleted
                          ? 'text-green-600 bg-green-100 dark:bg-green-900/30'
                          : 'text-slate-400 hover:text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30'
                      }`}
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    
                    <div className="flex-1">
                      <h3 className={`font-semibold text-slate-900 dark:text-slate-100 mb-2 ${
                        reminder.isCompleted ? 'line-through text-slate-500' : ''
                      }`}>
                        {reminder.title}
                      </h3>
                      {reminder.description && (
                        <p className="text-slate-600 dark:text-slate-400 mb-3 text-sm">
                          {reminder.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(reminder.reminderDate)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {new Date(reminder.reminderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                        <div className="flex items-center gap-1">
                          <Bell className="w-3 h-3" />
                          {reminder.reminderType}
                        </div>
                        <div>
                          Site: {reminder.siteName}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleCompleted(reminder.id)}
                      className={`p-2 rounded-lg transition-colors ${
                        reminder.isCompleted
                          ? 'text-yellow-600 hover:bg-yellow-100 dark:hover:bg-yellow-900/30'
                          : 'text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30'
                      }`}
                      title={reminder.isCompleted ? 'Mark as active' : 'Mark as completed'}
                    >
                      {reminder.isCompleted ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => deleteReminder(reminder.id)}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                      title="Delete reminder"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}