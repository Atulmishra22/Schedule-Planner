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
