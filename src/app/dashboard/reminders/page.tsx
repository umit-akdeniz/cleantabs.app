'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/context';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowLeft, Bell, Calendar, Clock, Edit, Trash2, Plus, CheckCircle, XCircle, Download, Crown } from 'lucide-react';

interface Reminder {
  id: string;
  title: string;
  description: string;
  nextReminderDate: string;
  reminderType: string;
  siteId: string;
  site?: {
    id: string;
    name: string;
    url: string;
  };
  isActive: boolean;
  createdAt: string;
}

export default function RemindersPage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active');
  const [editingReminder, setEditingReminder] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    title: string;
    description: string;
    nextReminderDate: string;
    reminderType: string;
  }>({
    title: '',
    description: '',
    nextReminderDate: '',
    reminderType: 'once'
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchReminders();
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const editId = searchParams.get('edit');
    if (editId && reminders.length > 0) {
      const reminder = reminders.find(r => r.id === editId);
      if (reminder) {
        startEditingReminder(reminder);
      }
    }
  }, [searchParams, reminders]);

  const fetchReminders = async () => {
    try {
      const response = await fetch('/api/reminders');
      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data); // Debug log
        setReminders(data.reminders || []);
      } else {
        console.error('API Error:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error fetching reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const startEditingReminder = (reminder: Reminder) => {
    setEditingReminder(reminder.id);
    setEditForm({
      title: reminder.title,
      description: reminder.description,
      nextReminderDate: reminder.nextReminderDate,
      reminderType: reminder.reminderType
    });
  };

  const cancelEditing = () => {
    setEditingReminder(null);
    setEditForm({
      title: '',
      description: '',
      nextReminderDate: '',
      reminderType: 'once'
    });
  };

  const saveReminderEdit = async () => {
    if (!editingReminder) return;
    
    try {
      const response = await fetch(`/api/reminders/${editingReminder}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      
      if (response.ok) {
        const updatedReminder = await response.json();
        setReminders(reminders.map(r => r.id === editingReminder ? updatedReminder : r));
        cancelEditing();
      }
    } catch (error) {
      console.error('Error updating reminder:', error);
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
        body: JSON.stringify({ ...reminder, isActive: !reminder.isActive })
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
    if (filter === 'active') return reminder.isActive;
    if (filter === 'completed') return !reminder.isActive;
    return true;
  });

  const downloadCalendarEvent = async (reminderId: string) => {
    try {
      const response = await fetch(`/api/calendar/reminder?id=${reminderId}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reminder-${reminderId}.ics`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      } else {
        alert('Failed to download calendar event');
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Download failed. Please try again.');
    }
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
      {/* Header */}
      <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-slate-700/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400" />
              </button>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Reminders</h1>
                  <p className="text-slate-600 dark:text-slate-400">Manage your site reminders</p>
                </div>
              </div>
            </div>
            
            <button
              onClick={() => router.push('/dashboard')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl"
            >
              <Plus className="w-5 h-5" />
              Add New Reminder
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filter Tabs */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl p-1 shadow-sm border border-slate-200/50 dark:border-slate-700/50">
            <button
              onClick={() => setFilter('active')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                filter === 'active'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Active ({reminders.filter(r => r.isActive).length})
            </button>
            <button
              onClick={() => setFilter('completed')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                filter === 'completed'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Completed ({reminders.filter(r => !r.isActive).length})
            </button>
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-slate-500 to-slate-600 text-white shadow-lg'
                  : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              All ({reminders.length})
            </button>
          </div>
          
          {/* Quick Stats */}
          <div className="flex items-center gap-4">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl px-4 py-2 border border-slate-200/50 dark:border-slate-700/50">
              <div className="text-sm text-slate-600 dark:text-slate-400">Active</div>
              <div className="text-xl font-bold text-blue-600">{reminders.filter(r => r.isActive).length}</div>
            </div>
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl px-4 py-2 border border-slate-200/50 dark:border-slate-700/50">
              <div className="text-sm text-slate-600 dark:text-slate-400">Completed</div>
              <div className="text-xl font-bold text-green-600">{reminders.filter(r => !r.isActive).length}</div>
            </div>
          </div>
        </div>

        {/* Reminders List */}
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              <p className="text-slate-600 dark:text-slate-400 font-medium">Loading reminders...</p>
            </div>
          </div>
        ) : reminders.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-12 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Bell className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">No reminders yet</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">Create your first reminder to get started.</p>
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl mx-auto"
              >
                <Plus className="w-5 h-5" />
                Go to Dashboard
              </button>
            </div>
          </div>
        ) : filteredReminders.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-12 border border-slate-200/50 dark:border-slate-700/50 shadow-sm">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Bell className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-3">
                {filter === 'active' ? 'No active reminders' : 
                 filter === 'completed' ? 'No completed reminders' : 
                 'No reminders yet'}
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                {filter === 'active' ? 'All your reminders are completed!' : 
                 filter === 'completed' ? 'Complete some reminders to see them here.' : 
                 'Create your first reminder to get started.'}
              </p>
              <button
                onClick={() => router.push('/dashboard')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all flex items-center gap-2 font-semibold shadow-lg hover:shadow-xl mx-auto"
              >
                <Plus className="w-5 h-5" />
                Create First Reminder
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredReminders.map((reminder) => (
              <div
                key={reminder.id}
                className={`bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 p-6 shadow-sm hover:shadow-lg transition-all ${
                  !reminder.isActive ? 'opacity-75' : ''
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <button
                      onClick={() => toggleCompleted(reminder.id)}
                      className={`mt-1 p-2 rounded-xl transition-all ${
                        reminder.isActive
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-600 dark:hover:text-green-400'
                          : 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                      }`}
                    >
                      <CheckCircle className="w-5 h-5" />
                    </button>
                    
                    <div className="flex-1">
                      {editingReminder === reminder.id ? (
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                              Title
                            </label>
                            <input
                              type="text"
                              value={editForm.title}
                              onChange={(e) => setEditForm({...editForm, title: e.target.value})}
                              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                              Description
                            </label>
                            <textarea
                              value={editForm.description}
                              onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                              className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                              rows={3}
                            />
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Reminder Date & Time
                              </label>
                              <input
                                type="datetime-local"
                                value={editForm.nextReminderDate}
                                onChange={(e) => setEditForm({...editForm, nextReminderDate: e.target.value})}
                                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                              />
                            </div>
                            
                            <div>
                              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                                Reminder Type
                              </label>
                              <select
                                value={editForm.reminderType}
                                onChange={(e) => setEditForm({...editForm, reminderType: e.target.value})}
                                className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                              >
                                <option value="once">One-time</option>
                                <option value="daily">Daily</option>
                                <option value="weekly">Weekly</option>
                                <option value="monthly">Monthly</option>
                              </select>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 pt-2">
                            <button
                              onClick={saveReminderEdit}
                              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              Save Changes
                            </button>
                            <button
                              onClick={cancelEditing}
                              className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <h3 className={`text-lg font-bold text-slate-900 dark:text-slate-100 mb-2 ${
                            !reminder.isActive ? 'line-through text-slate-500' : ''
                          }`}>
                            {reminder.title}
                          </h3>
                          {reminder.description && (
                            <p className="text-slate-600 dark:text-slate-400 mb-4 text-sm leading-relaxed">
                              {reminder.description}
                            </p>
                          )}
                          
                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                              <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              <span className="font-medium text-blue-700 dark:text-blue-300">
                                {formatDate(reminder.nextReminderDate)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-purple-50 dark:bg-purple-900/30 rounded-lg">
                              <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                              <span className="font-medium text-purple-700 dark:text-purple-300">
                                {new Date(reminder.nextReminderDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-amber-50 dark:bg-amber-900/30 rounded-lg">
                              <Bell className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                              <span className="font-medium text-amber-700 dark:text-amber-300">
                                {reminder.reminderType === 'once' ? 'One-time' : 'Recurring'}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 dark:bg-slate-800 rounded-lg">
                              <span className="font-medium text-slate-700 dark:text-slate-300">
                                {reminder.site?.name || 'Site'}
                              </span>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {/* Calendar Export Button */}
                    <div className="relative">
                      <button
                        onClick={() => downloadCalendarEvent(reminder.id)}
                        className="p-2 rounded-xl transition-colors bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                        title="Download calendar event"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <button
                      onClick={() => startEditingReminder(reminder)}
                      className="p-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-xl transition-colors"
                      title="Edit reminder"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => toggleCompleted(reminder.id)}
                      className={`p-2 rounded-xl transition-colors ${
                        !reminder.isActive
                          ? 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/50'
                          : 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50'
                      }`}
                      title={!reminder.isActive ? 'Mark as active' : 'Mark as completed'}
                    >
                      {!reminder.isActive ? <XCircle className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => deleteReminder(reminder.id)}
                      className="p-2 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/50 rounded-xl transition-colors"
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