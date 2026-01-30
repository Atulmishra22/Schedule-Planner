// Date helper functions

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const formatTime = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

export const getWeekStart = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Adjust to Monday
  return new Date(d.setDate(diff));
};

export const getMonthStart = (year, month) => {
  return new Date(year, month - 1, 1);
};

export const getMonthEnd = (year, month) => {
  return new Date(year, month, 0);
};

export const getDayName = (date) => {
  return new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
};

export const getMonthName = (month) => {
  const date = new Date(2000, month - 1, 1);
  return date.toLocaleDateString('en-US', { month: 'long' });
};

// Get today's date in local timezone (YYYY-MM-DD format)
export const getTodayLocal = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Get yesterday's date in local timezone (YYYY-MM-DD format)
export const getYesterdayLocal = () => {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const year = yesterday.getFullYear();
  const month = String(yesterday.getMonth() + 1).padStart(2, '0');
  const day = String(yesterday.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Convert any date to local YYYY-MM-DD format
export const toLocalDateString = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
