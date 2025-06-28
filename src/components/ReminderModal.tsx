'use client';

import { useState } from 'react';
import { X, Calendar, Clock, Bell, Mail, CheckCircle } from 'lucide-react';

interface ReminderModalProps {
  isOpen: boolean;
  onClose: () => void;
  siteId: string;
  siteName: string;
  onSave: (reminder: {
    title: string;
    description: string;
    reminderDate: string;
    reminderType: 'NOTIFICATION' | 'EMAIL' | 'BOTH';
  }) => void;
}

export default function ReminderModal({ 
  isOpen, 
  onClose, 
  siteId, 
  siteName, 
  onSave 
}: ReminderModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [reminderType, setReminderType] = useState<'NOTIFICATION' | 'EMAIL' | 'BOTH'>('NOTIFICATION');
  const [loading, setLoading] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringType, setRecurringType] = useState<'daily' | 'weekly' | 'monthly'>('weekly');

  if (!isOpen) return null;

  const setQuickReminder = (minutes: number) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + minutes);
    setReminderDate(now.toISOString().split('T')[0]);
    setReminderTime(now.toTimeString().slice(0, 5));
  };

  const presets = [
    { label: '15 minutes', minutes: 15 },
    { label: '1 hour', minutes: 60 },
    { label: '1 day', minutes: 24 * 60 },
    { label: '1 week', minutes: 7 * 24 * 60 },
    { label: '1 month', minutes: 30 * 24 * 60 }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const reminderDateTime = `${reminderDate}T${reminderTime}:00.000Z`;
      
      await onSave({
        title: title || `Check ${siteName}`,
        description,
        reminderDate: reminderDateTime,
        reminderType
      });

      // Reset form
      setTitle('');
      setDescription('');
      setReminderDate('');
      setReminderTime('');
      setReminderType('NOTIFICATION');
      onClose();
    } catch (error) {
      console.error('Error saving reminder:', error);
    } finally {
      setLoading(false);
    }
  };

  // Set default date to tomorrow
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-2 md:p-4 z-50">
      <div className="glass-effect rounded-2xl p-4 md:p-6 w-full max-w-sm md:max-w-md shadow-professional max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="gradient-primary p-2 rounded-lg">
              <Bell className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-brand-900 dark:text-brand-100">
                Set Reminder
              </h2>
              <p className="text-sm text-brand-600 dark:text-brand-400">
                for {siteName}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-brand-100 dark:hover:bg-brand-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-2">
              Reminder Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-white dark:bg-brand-800 border border-brand-300 dark:border-brand-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
              placeholder={`Check ${siteName}`}
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-2">
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-white dark:bg-brand-800 border border-brand-300 dark:border-brand-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors resize-none"
              placeholder="Add details about this reminder..."
            />
          </div>

          {/* Quick Presets */}
          <div>
            <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-3">
              Quick Set
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setQuickReminder(preset.minutes)}
                  className="px-2 md:px-3 py-2 text-xs font-medium bg-white dark:bg-brand-800 border border-brand-200 dark:border-brand-700 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-700 transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Recurring Option */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="text-primary-600 focus:ring-primary-500"
              />
              <span className="text-sm font-medium text-brand-700 dark:text-brand-300">
                Recurring Reminder
              </span>
            </label>
            {isRecurring && (
              <div className="mt-3">
                <select
                  value={recurringType}
                  onChange={(e) => setRecurringType(e.target.value as any)}
                  className="w-full px-4 py-2 bg-white dark:bg-brand-800 border border-brand-300 dark:border-brand-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-2">
                Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-400" />
                <input
                  id="date"
                  type="date"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  min={defaultDate}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-brand-800 border border-brand-300 dark:border-brand-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  required
                />
              </div>
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-2">
                Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-brand-400" />
                <input
                  id="time"
                  type="time"
                  value={reminderTime}
                  onChange={(e) => setReminderTime(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white dark:bg-brand-800 border border-brand-300 dark:border-brand-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors"
                  required
                />
              </div>
            </div>
          </div>

          {/* Reminder Type */}
          <div>
            <label className="block text-sm font-medium text-brand-700 dark:text-brand-300 mb-3">
              Notification Type
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-3 p-3 border border-brand-200 dark:border-brand-700 rounded-lg cursor-pointer hover:bg-brand-50 dark:hover:bg-brand-800/50 transition-colors">
                <input
                  type="radio"
                  name="reminderType"
                  value="NOTIFICATION"
                  checked={reminderType === 'NOTIFICATION'}
                  onChange={(e) => setReminderType(e.target.value as any)}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <Bell className="w-4 h-4 text-primary-600" />
                <span className="text-sm font-medium text-brand-700 dark:text-brand-300">
                  Browser Notification
                </span>
              </label>
              
              <label className="flex items-center gap-3 p-3 border border-brand-200 dark:border-brand-700 rounded-lg cursor-pointer hover:bg-brand-50 dark:hover:bg-brand-800/50 transition-colors">
                <input
                  type="radio"
                  name="reminderType"
                  value="EMAIL"
                  checked={reminderType === 'EMAIL'}
                  onChange={(e) => setReminderType(e.target.value as any)}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <Mail className="w-4 h-4 text-accent-600" />
                <span className="text-sm font-medium text-brand-700 dark:text-brand-300">
                  Email Notification
                </span>
              </label>

              <label className="flex items-center gap-3 p-3 border border-brand-200 dark:border-brand-700 rounded-lg cursor-pointer hover:bg-brand-50 dark:hover:bg-brand-800/50 transition-colors">
                <input
                  type="radio"
                  name="reminderType"
                  value="BOTH"
                  checked={reminderType === 'BOTH'}
                  onChange={(e) => setReminderType(e.target.value as any)}
                  className="text-primary-600 focus:ring-primary-500"
                />
                <div className="flex items-center gap-1">
                  <Bell className="w-4 h-4 text-primary-600" />
                  <Mail className="w-4 h-4 text-accent-600" />
                </div>
                <span className="text-sm font-medium text-brand-700 dark:text-brand-300">
                  Both Notifications
                </span>
              </label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col md:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 bg-brand-100 dark:bg-brand-800 text-brand-700 dark:text-brand-300 rounded-lg font-medium hover:bg-brand-200 dark:hover:bg-brand-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !reminderDate || !reminderTime}
              className="flex-1 gradient-primary text-white px-4 py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Saving...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Set Reminder
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}