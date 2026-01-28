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
- The full app will open in a popup window (600x800px)
- All data is stored locally using Chrome's storage API
- Background service worker handles daily task rollover

## Development

- Run `npm run dev` for local development with hot reload
- Run `npm run build:extension` to build for Chrome extension
- The extension popup will be larger than typical extensions (600x800px) to accommodate the full dashboard

## Notes

- Icons need to be created at: extension/icons/ (16x16, 48x48, 128x128)
- LocalStorage is used for data persistence
- The extension works offline once loaded
