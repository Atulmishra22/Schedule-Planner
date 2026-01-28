// Background service worker for Chrome extension
console.log('Schedule Planner extension loaded');

// Open app in new tab when extension icon is clicked
chrome.action.onClicked.addListener(() => {
  chrome.tabs.create({
    url: chrome.runtime.getURL('index.html')
  });
});

// Set up alarm for daily rollover check
chrome.alarms.create('dailyRollover', {
  delayInMinutes: 1,
  periodInMinutes: 60 // Check every hour
});

// Listen for alarm
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'dailyRollover') {
    checkRollover();
  }
});

function checkRollover() {
  const today = new Date().toISOString().slice(0, 10);
  
  chrome.storage.local.get(['lastRollover'], (result) => {
    if (result.lastRollover !== today) {
      // Trigger rollover logic
      chrome.storage.local.set({ lastRollover: today });
      
      // Show notification
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'Schedule Planner',
        message: 'Daily tasks have been rolled over!'
      });
    }
  });
}
