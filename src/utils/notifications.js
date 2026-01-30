// Notification utility that works for both web app and browser extension

/**
 * Show a notification that works in both web and extension contexts
 * @param {string} title - Notification title
 * @param {string} body - Notification body text
 * @param {object} options - Additional options
 */
export const showNotification = (title, body, options = {}) => {
  // Check if we're in a Chrome extension context
  if (typeof chrome !== 'undefined' && chrome.notifications) {
    // Use Chrome extension notifications API
    chrome.notifications.create({
      type: 'basic',
      iconUrl: options.icon || '/icons/icon48.png',
      title: title,
      message: body,
      priority: 2,
      requireInteraction: options.requireInteraction || false
    });
  } 
  // Fall back to Web Notification API
  else if ('Notification' in window) {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body: body,
        icon: options.icon || '/favicon.ico',
        badge: options.badge || '/favicon.ico',
        tag: options.tag || 'notification',
        requireInteraction: options.requireInteraction || false
      });
    } else if (Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          new Notification(title, {
            body: body,
            icon: options.icon || '/favicon.ico',
            badge: options.badge || '/favicon.ico',
            tag: options.tag || 'notification',
            requireInteraction: options.requireInteraction || false
          });
        }
      });
    }
  }
};

/**
 * Request notification permission
 * @returns {Promise<string>} Permission status
 */
export const requestNotificationPermission = async () => {
  // Chrome extensions have permission via manifest, so just return granted
  if (typeof chrome !== 'undefined' && chrome.notifications) {
    return 'granted';
  }
  
  // For web, request permission
  if ('Notification' in window) {
    if (Notification.permission === 'default') {
      return await Notification.requestPermission();
    }
    return Notification.permission;
  }
  
  return 'denied';
};

/**
 * Play a notification sound
 */
export const playNotificationSound = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.5);
    
    // Second beep
    setTimeout(() => {
      const oscillator2 = audioContext.createOscillator();
      const gainNode2 = audioContext.createGain();
      
      oscillator2.connect(gainNode2);
      gainNode2.connect(audioContext.destination);
      
      oscillator2.frequency.value = 1000;
      oscillator2.type = 'sine';
      
      gainNode2.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode2.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
      
      oscillator2.start(audioContext.currentTime);
      oscillator2.stop(audioContext.currentTime + 0.5);
    }, 200);
  } catch (error) {
    console.warn('Could not play notification sound:', error);
  }
};
