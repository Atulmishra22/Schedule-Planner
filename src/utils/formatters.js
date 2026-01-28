export const formatMinutes = (minutes) => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins}m`;
  }
  return `${mins}m`;
};

export const formatPercentage = (value) => {
  return `${Math.round(value)}%`;
};

export const formatNumber = (value) => {
  return new Intl.NumberFormat('en-US').format(value);
};
