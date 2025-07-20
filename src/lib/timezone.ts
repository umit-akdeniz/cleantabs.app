// Timezone utilities for global application

export interface TimezoneInfo {
  timezone: string;
  offset: number; // UTC offset in minutes
  label: string;
  region: string;
}

// Common timezones with their UTC offsets
export const COMMON_TIMEZONES: TimezoneInfo[] = [
  // Americas
  { timezone: 'America/New_York', offset: -300, label: 'Eastern Time (ET)', region: 'Americas' },
  { timezone: 'America/Chicago', offset: -360, label: 'Central Time (CT)', region: 'Americas' },
  { timezone: 'America/Denver', offset: -420, label: 'Mountain Time (MT)', region: 'Americas' },
  { timezone: 'America/Los_Angeles', offset: -480, label: 'Pacific Time (PT)', region: 'Americas' },
  { timezone: 'America/Sao_Paulo', offset: -180, label: 'Brasília Time (BRT)', region: 'Americas' },
  { timezone: 'America/Mexico_City', offset: -360, label: 'Central Standard Time (CST)', region: 'Americas' },
  
  // Europe
  { timezone: 'Europe/London', offset: 0, label: 'Greenwich Mean Time (GMT)', region: 'Europe' },
  { timezone: 'Europe/Berlin', offset: 60, label: 'Central European Time (CET)', region: 'Europe' },
  { timezone: 'Europe/Istanbul', offset: 180, label: 'Turkey Time (TRT)', region: 'Europe' },
  { timezone: 'Europe/Moscow', offset: 180, label: 'Moscow Standard Time (MSK)', region: 'Europe' },
  { timezone: 'Europe/Paris', offset: 60, label: 'Central European Time (CET)', region: 'Europe' },
  { timezone: 'Europe/Rome', offset: 60, label: 'Central European Time (CET)', region: 'Europe' },
  
  // Asia
  { timezone: 'Asia/Tokyo', offset: 540, label: 'Japan Standard Time (JST)', region: 'Asia' },
  { timezone: 'Asia/Shanghai', offset: 480, label: 'China Standard Time (CST)', region: 'Asia' },
  { timezone: 'Asia/Kolkata', offset: 330, label: 'India Standard Time (IST)', region: 'Asia' },
  { timezone: 'Asia/Dubai', offset: 240, label: 'Gulf Standard Time (GST)', region: 'Asia' },
  { timezone: 'Asia/Seoul', offset: 540, label: 'Korea Standard Time (KST)', region: 'Asia' },
  { timezone: 'Asia/Singapore', offset: 480, label: 'Singapore Standard Time (SGT)', region: 'Asia' },
  
  // Oceania
  { timezone: 'Australia/Sydney', offset: 600, label: 'Australian Eastern Time (AET)', region: 'Oceania' },
  { timezone: 'Australia/Melbourne', offset: 600, label: 'Australian Eastern Time (AET)', region: 'Oceania' },
  { timezone: 'Pacific/Auckland', offset: 720, label: 'New Zealand Time (NZST)', region: 'Oceania' },
  
  // Africa
  { timezone: 'Africa/Cairo', offset: 120, label: 'Eastern European Time (EET)', region: 'Africa' },
  { timezone: 'Africa/Lagos', offset: 60, label: 'West Africa Time (WAT)', region: 'Africa' },
  { timezone: 'Africa/Johannesburg', offset: 120, label: 'South Africa Standard Time (SAST)', region: 'Africa' },
];

// Get user's current timezone
export const getUserTimezone = (): string => {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
  } catch (error) {
    console.warn('Could not detect user timezone, falling back to UTC');
    return 'UTC';
  }
};

// Get timezone info by timezone string
export const getTimezoneInfo = (timezone: string): TimezoneInfo | null => {
  return COMMON_TIMEZONES.find(tz => tz.timezone === timezone) || null;
};

// Convert date to user's timezone
export const toUserTimezone = (date: Date | string, timezone?: string): Date => {
  const userTz = timezone || getUserTimezone();
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Create a new date in the user's timezone
  const utcTime = dateObj.getTime() + (dateObj.getTimezoneOffset() * 60000);
  const tzOffset = getTimezoneOffset(userTz);
  return new Date(utcTime + (tzOffset * 60000));
};

// Convert date from user's timezone to UTC
export const fromUserTimezone = (date: Date | string, timezone?: string): Date => {
  const userTz = timezone || getUserTimezone();
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // Convert from user timezone to UTC
  const tzOffset = getTimezoneOffset(userTz);
  return new Date(dateObj.getTime() - (tzOffset * 60000));
};

// Get timezone offset in minutes (positive for east of UTC, negative for west)
export const getTimezoneOffset = (timezone: string): number => {
  try {
    const now = new Date();
    const utcTime = new Date(now.toLocaleString("en-US", { timeZone: "UTC" }));
    const tzTime = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
    return (tzTime.getTime() - utcTime.getTime()) / (1000 * 60);
  } catch (error) {
    console.warn(`Could not get offset for timezone ${timezone}, falling back to 0`);
    return 0;
  }
};

// Format date for datetime-local input (YYYY-MM-DDTHH:MM)
export const formatForDateTimeLocal = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

// Parse datetime-local input to Date object
export const parseFromDateTimeLocal = (datetimeLocal: string, timezone?: string): Date => {
  if (!datetimeLocal) return new Date();
  
  // Parse the local datetime string
  const [datePart, timePart] = datetimeLocal.split('T');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hours, minutes] = timePart.split(':').map(Number);
  
  // Create date in user's timezone
  const userTz = timezone || getUserTimezone();
  const localDate = new Date(year, month - 1, day, hours, minutes);
  
  // Convert to UTC for storage
  return fromUserTimezone(localDate, userTz);
};

// Add minutes to a date, handling timezone correctly
export const addMinutesToDate = (date: Date, minutes: number, timezone?: string): Date => {
  const userTz = timezone || getUserTimezone();
  const userDate = toUserTimezone(date, userTz);
  const newUserDate = new Date(userDate.getTime() + (minutes * 60000));
  return fromUserTimezone(newUserDate, userTz);
};

// Check if a date is in the past (considering timezone)
export const isDateInPast = (date: Date, timezone?: string): boolean => {
  const userTz = timezone || getUserTimezone();
  const now = new Date();
  const userNow = toUserTimezone(now, userTz);
  const userDate = toUserTimezone(date, userTz);
  
  return userDate.getTime() < userNow.getTime();
};

// Format date for display in user's timezone
export const formatDateForDisplay = (date: Date | string, timezone?: string, options?: Intl.DateTimeFormatOptions): string => {
  const userTz = timezone || getUserTimezone();
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: userTz,
    ...options
  };
  
  return dateObj.toLocaleDateString('en-US', defaultOptions);
};

// Get relative time string (e.g., "in 5 minutes", "2 hours ago")
export const getRelativeTimeString = (date: Date | string, timezone?: string): string => {
  const userTz = timezone || getUserTimezone();
  const now = new Date();
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  const nowInTz = toUserTimezone(now, userTz);
  const dateInTz = toUserTimezone(dateObj, userTz);
  
  const diffMs = dateInTz.getTime() - nowInTz.getTime();
  const diffMinutes = Math.round(diffMs / (1000 * 60));
  
  if (Math.abs(diffMinutes) < 1) {
    return 'now';
  } else if (diffMinutes > 0) {
    // Future
    if (diffMinutes < 60) {
      return `in ${diffMinutes} minute${diffMinutes === 1 ? '' : 's'}`;
    } else if (diffMinutes < 1440) { // 24 hours
      const hours = Math.round(diffMinutes / 60);
      return `in ${hours} hour${hours === 1 ? '' : 's'}`;
    } else {
      const days = Math.round(diffMinutes / 1440);
      return `in ${days} day${days === 1 ? '' : 's'}`;
    }
  } else {
    // Past
    const absDiffMinutes = Math.abs(diffMinutes);
    if (absDiffMinutes < 60) {
      return `${absDiffMinutes} minute${absDiffMinutes === 1 ? '' : 's'} ago`;
    } else if (absDiffMinutes < 1440) { // 24 hours
      const hours = Math.round(absDiffMinutes / 60);
      return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    } else {
      const days = Math.round(absDiffMinutes / 1440);
      return `${days} day${days === 1 ? '' : 's'} ago`;
    }
  }
};