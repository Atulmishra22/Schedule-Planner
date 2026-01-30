// Sync localStorage to chrome.storage for extension popup access
export function setupExtensionSync() {
  // Only run in Chrome extension context
  if (typeof chrome === 'undefined' || !chrome.storage) {
    return;
  }

  function syncToExtension() {
    try {
      chrome.storage.local.set({
        tasks: localStorage.getItem('tasks'),
        pomodoro: localStorage.getItem('pomodoro'),
        timeTracking: localStorage.getItem('timeTracking'),
        analytics: localStorage.getItem('analytics')
      });
    } catch (e) {
      console.error('Failed to sync to chrome.storage:', e);
    }
  }

  // Initial sync
  syncToExtension();

  // Sync on storage changes
  window.addEventListener('storage', syncToExtension);

  // Sync periodically to catch Pinia state changes (every 1 second for real-time updates)
  setInterval(syncToExtension, 1000);

  console.log('Extension storage sync enabled');
}
