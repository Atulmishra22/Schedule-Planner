# Chrome Extension Setup

## Building the Extension

Run the following command to build the extension:

```bash
npm run build:extension
```

This will create a `dist` folder with all the necessary files.

## Loading the Extension in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in the top right corner)
3. Click "Load unpacked"
4. Select the `dist` folder from this project
5. The Schedule Planner extension should now appear in your extensions list

## Using the Extension

- Click the extension icon in your Chrome toolbar to open the popup
- **Popup shows live timer**:
  - 📝 **Active Task Timer**: When a task is running, see countdown with progress bar
  - 🎯 **Pomodoro Timer**: When Pomodoro is active, shows work/break session with countdown
  - **Real-time updates**: Timer refreshes every second
  - **Color-coded progress**: Blue → Yellow → Red as time runs out
  - **Session info**: Task category, duration, and status
- Click "Open Full App" to access the complete dashboard
- All data is stored locally using Chrome's storage API
- Background service worker handles daily task rollover and notifications

## Development

- Run `npm run dev` for local development with hot reload
- Run `npm run build:extension` to build for Chrome extension
- The extension popup will be larger than typical extensions (600x800px) to accommodate the full dashboard

## Notes

- **Popup Timer**: Shows active task or Pomodoro timer with live countdown
- **Priority System**: Pomodoro timer takes precedence when running
- **Real-time Sync**: Uses new timeSegments tracking for accurate elapsed time
- **Notifications**: Chrome notifications work for task completion and Pomodoro alerts
- Icons need to be created at: extension/icons/ (16x16, 48x48, 128x128)
- LocalStorage is used for data persistence
- The extension works offline once loaded
