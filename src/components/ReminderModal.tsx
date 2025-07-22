'use client';

import { useState, useEffect } from 'react';
import { X, Calendar, Clock, Bell, Mail, CheckCircle, Timer, Zap, CalendarDays, Repeat, Globe } from 'lucide-react';
import { 
  getUserTimezone, 
  formatForDateTimeLocal, 
  parseFromDateTimeLocal, 
  addMinutesToDate,
  getTimezoneInfo,
  COMMON_TIMEZONES,
  formatDateForDisplay
} from '@/lib/timezone';

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
    isRecurring?: boolean;
    recurringType?: 'daily' | 'weekly' | 'monthly';
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
  const [dateTimeLocal, setDateTimeLocal] = useState('');
  const [reminderType, setReminderType] = useState<'NOTIFICATION' | 'EMAIL' | 'BOTH'>('NOTIFICATION');
  const [loading, setLoading] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringType, setRecurringType] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [activeTab, setActiveTab] = useState<'quick' | 'custom' | 'recurring'>('quick');
  const [userTimezone, setUserTimezone] = useState('');
  const [selectedTimezone, setSelectedTimezone] = useState('');
  const [quickDateTime, setQuickDateTime] = useState<Date | null>(null);

  // Initialize timezone
  useEffect(() => {
    const timezone = getUserTimezone();
    setUserTimezone(timezone);
    setSelectedTimezone(timezone);
  }, []);

  if (!isOpen) return null;

  const setQuickReminder = (minutes: number) => {
    const now = new Date();
    const reminderTime = addMinutesToDate(now, minutes);
    setQuickDateTime(reminderTime);
    
    // Format date for datetime-local input (browser handles timezone)
    setDateTimeLocal(formatForDateTimeLocal(reminderTime));
    setActiveTab('quick');
  };

  const quickPresets = [
    { label: '5 min', minutes: 5 },
    { label: '15 min', minutes: 15 },
    { label: '30 min', minutes: 30 },
    { label: '1 hour', minutes: 60 },
    { label: '2 hours', minutes: 120 },
    { label: '6 hours', minutes: 360 },
    { label: '1 day', minutes: 1440 },
    { label: '1 week', minutes: 10080 }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let reminderDateTime: Date;
      
      if (activeTab === 'quick' && quickDateTime) {
        reminderDateTime = quickDateTime;
      } else {
        // Parse from datetime-local input
        reminderDateTime = parseFromDateTimeLocal(dateTimeLocal, selectedTimezone);
      }
      
      await onSave({
        title: title || `Check ${siteName}`,
        description,
        reminderDate: reminderDateTime.toISOString(),
        reminderType,
        isRecurring: isRecurring && activeTab === 'recurring',
        recurringType: isRecurring && activeTab === 'recurring' ? recurringType : undefined
      });

      // Reset form
      setTitle('');
      setDescription('');
      setDateTimeLocal('');
      setQuickDateTime(null);
      setReminderType('NOTIFICATION');
      setIsRecurring(false);
      onClose();
    } catch (error) {
      console.error('Error saving reminder:', error);
    } finally {
      setLoading(false);
    }
  };

  // Set default date to today (no minimum restriction)
  const today = new Date();
  const defaultDate = today.toISOString().split('T')[0];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 px-8 py-6">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/90 via-purple-600/90 to-indigo-600/90 backdrop-blur-sm"></div>
          <div className="relative flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">
                  Set Reminder
                </h2>
                <p className="text-white/80 text-sm">
                  for {siteName}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-xl transition-colors"
            >
              <X className="w-6 h-6 text-white" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {/* Tabs */}
          <div className="flex bg-slate-100 dark:bg-slate-800 rounded-2xl p-1 mb-6">
            <button
              onClick={() => setActiveTab('quick')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'quick'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Zap className="w-4 h-4" />
              Quick
            </button>
            <button
              onClick={() => setActiveTab('custom')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'custom'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Custom
            </button>
            <button
              onClick={() => setActiveTab('recurring')}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'recurring'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Repeat className="w-4 h-4" />
              Recurring
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Reminder Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                placeholder={`Check ${siteName}`}
              />
            </div>

            {/* Timezone Selector */}
            <div className="mb-4">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                <Globe className="w-4 h-4 inline mr-2" />
                Timezone
              </label>
              <select
                value={selectedTimezone}
                onChange={(e) => setSelectedTimezone(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 dark:text-white"
              >
                <option value={userTimezone}>
                  {getTimezoneInfo(userTimezone)?.label || userTimezone} (Auto-detected)
                </option>
                {COMMON_TIMEZONES.map((tz) => (
                  <option key={tz.timezone} value={tz.timezone}>
                    {tz.label} ({tz.timezone})
                  </option>
                ))}
              </select>
            </div>

            {/* Tab Content */}
            {activeTab === 'quick' && (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                  Quick Presets
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {quickPresets.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setQuickReminder(preset.minutes)}
                      className={`flex items-center justify-center px-4 py-3 border rounded-xl transition-all group ${
                        quickDateTime && dateTimeLocal ? 
                        'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600' :
                        'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 hover:border-blue-300 dark:hover:border-blue-600'
                      }`}
                    >
                      <span className={`text-sm font-medium transition-colors ${
                        quickDateTime && dateTimeLocal ?
                        'text-blue-600 dark:text-blue-400' :
                        'text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400'
                      }`}>
                        {preset.label}
                      </span>
                    </button>
                  ))}
                </div>
                
                {/* Quick reminder preview */}
                {quickDateTime && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4">
                    <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Reminder set for: {formatDateForDisplay(quickDateTime, selectedTimezone)}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'custom' && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="datetime" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                    Date & Time
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      id="datetime"
                      type="datetime-local"
                      value={dateTimeLocal}
                      onChange={(e) => {
                        setDateTimeLocal(e.target.value);
                        setQuickDateTime(null); // Clear quick selection
                      }}
                      className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 dark:text-white"
                      required={activeTab === 'custom'}
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    Time in {getTimezoneInfo(selectedTimezone)?.label || selectedTimezone}
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'recurring' && (
              <div className="space-y-6">
                {/* Recurring Toggle */}
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                  <label className="flex items-center gap-4 cursor-pointer">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={isRecurring}
                        onChange={(e) => setIsRecurring(e.target.checked)}
                        className="w-6 h-6 text-blue-600 rounded focus:ring-blue-500 focus:ring-2"
                      />
                      {isRecurring && (
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                      )}
                    </div>
                    <div>
                      <span className="text-lg font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                        <Repeat className="w-5 h-5" />
                        Enable Recurring Reminder
                      </span>
                      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Automatically create new reminders based on your schedule
                      </p>
                    </div>
                  </label>
                </div>

                {/* Recurring Options */}
                {isRecurring && (
                  <div className="space-y-4">
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                      Repeat Frequency
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {[
                        { value: 'daily', label: 'Daily', desc: 'Every day', icon: '🗓️' },
                        { value: 'weekly', label: 'Weekly', desc: 'Every week', icon: '📅' },
                        { value: 'monthly', label: 'Monthly', desc: 'Every month', icon: '🗓️' }
                      ].map((option) => (
                        <label
                          key={option.value}
                          className={`flex flex-col p-4 border-2 rounded-xl cursor-pointer transition-all ${
                            recurringType === option.value
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600'
                          }`}
                        >
                          <input
                            type="radio"
                            name="recurringType"
                            value={option.value}
                            checked={recurringType === option.value}
                            onChange={(e) => setRecurringType(e.target.value as any)}
                            className="sr-only"
                          />
                          <div className="text-center">
                            <div className="text-2xl mb-2">{option.icon}</div>
                            <div className={`font-semibold text-sm ${
                              recurringType === option.value
                                ? 'text-blue-700 dark:text-blue-300'
                                : 'text-slate-700 dark:text-slate-300'
                            }`}>
                              {option.label}
                            </div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              {option.desc}
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>

                    {/* Initial Date/Time for Recurring */}
                    <div>
                      <label htmlFor="recurring-datetime" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                        First Reminder Date & Time
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input
                          id="recurring-datetime"
                          type="datetime-local"
                          value={dateTimeLocal}
                          onChange={(e) => {
                            setDateTimeLocal(e.target.value);
                            setQuickDateTime(null);
                          }}
                          className="w-full pl-12 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-slate-900 dark:text-white"
                          required={activeTab === 'recurring' && isRecurring}
                        />
                      </div>
                      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        Time in {getTimezoneInfo(selectedTimezone)?.label || selectedTimezone}
                      </p>
                    </div>

                    {/* Recurring Preview */}
                    {recurringType && dateTimeLocal && (
                      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-4">
                        <div className="flex items-center gap-2 text-green-700 dark:text-green-300">
                          <Repeat className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            Will repeat {recurringType} starting from {formatDateForDisplay(parseFromDateTimeLocal(dateTimeLocal, selectedTimezone), selectedTimezone)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Description <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400"
                placeholder="Add details about this reminder..."
              />
            </div>

            {/* Notification Type */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Notification Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <label className="flex items-center gap-3 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group">
                  <input
                    type="radio"
                    name="reminderType"
                    value="NOTIFICATION"
                    checked={reminderType === 'NOTIFICATION'}
                    onChange={(e) => setReminderType(e.target.value as any)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
                  />
                  <Bell className="w-5 h-5 text-blue-600" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                    Browser
                  </span>
                </label>
                
                <label className="flex items-center gap-3 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group">
                  <input
                    type="radio"
                    name="reminderType"
                    value="EMAIL"
                    checked={reminderType === 'EMAIL'}
                    onChange={(e) => setReminderType(e.target.value as any)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
                  />
                  <Mail className="w-5 h-5 text-purple-600" />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-purple-600 dark:group-hover:text-purple-400">
                    Email
                  </span>
                </label>

                <label className="flex items-center gap-3 p-4 border-2 border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-all group">
                  <input
                    type="radio"
                    name="reminderType"
                    value="BOTH"
                    checked={reminderType === 'BOTH'}
                    onChange={(e) => setReminderType(e.target.value as any)}
                    className="w-4 h-4 text-blue-600 focus:ring-blue-500 focus:ring-2"
                  />
                  <div className="flex items-center gap-1">
                    <Bell className="w-4 h-4 text-blue-600" />
                    <Mail className="w-4 h-4 text-purple-600" />
                  </div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                    Both
                  </span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-6 border-t border-slate-200 dark:border-slate-700">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-semibold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || (!quickDateTime && !dateTimeLocal)}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Set Reminder
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}