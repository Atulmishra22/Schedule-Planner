# Schedule Planner - Time Management Application

A professional productivity application built with Vue 3 for task-based scheduling, Pomodoro technique integration, and time analytics. Available as both a web application and Chrome extension.

![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=flat&logo=vue.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-3.0-FFD859?style=flat)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

## ✨ Features

### 📊 Dashboard
- **Real-time Task Timer**: Visual circular countdown timer with MM:SS format
- **Pomodoro Integration**: Configurable focus/break cycles with automatic transitions
- **Focus Analytics**: Live tracking of daily, weekly, and monthly productivity
- **Quick Stats**: At-a-glance view of completed, in-progress, and pending tasks

### 📅 Schedule View
- **Timeline Interface**: Chronological task layout with time slots
- **Task Management**: Create, edit, pause, complete, and delete tasks
- **Daily Summary**: Progress tracking and completion rates
- **Category Organization**: Visual categorization of tasks by type

### 📈 Analytics
- **Performance Metrics**: Detailed productivity insights (coming soon)
- **Chart Visualization**: Track trends and patterns over time
- **Focus Score**: Automated calculation based on work/pause ratios

### ⚙️ Settings
- **Pomodoro Configuration**: Customize work duration (15-60 min), short breaks (3-15 min), long breaks (10-30 min)
- **Data Management**: Export/import functionality for backup and migration
- **Notification Controls**: Enable/disable desktop notifications

## 🚀 Tech Stack

- **Frontend Framework**: Vue 3 (Composition API with `<script setup>`)
- **State Management**: Pinia
- **Routing**: Vue Router
- **Styling**: Tailwind CSS 4.x
- **Build Tool**: Vite
- **UI Components**: HeadlessUI Vue
- **Charts**: Chart.js
- **Storage**: LocalStorage (Web) / Chrome Storage API (Extension)

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/Atulmishra22/Schedule-Planner.git
cd timeManagement
```

2. **Install dependencies**
```bash
npm install
```

3. **Run development server**
```bash
npm run dev
```

4. **Open your browser**
Navigate to `http://localhost:5173`

## 🏗️ Build for Production

### Web Application
```bash
npm run build
npm run preview  # Preview production build
```

### Chrome Extension
```bash
npm run build:extension
```

The built extension will be in the `dist/` folder.

## 🔧 Chrome Extension Installation

1. **Build the extension**
```bash
npm run build:extension
```

2. **Load in Chrome**
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable **Developer mode** (toggle in top-right corner)
   - Click **Load unpacked**
   - Select the `dist` folder from this project

3. **Usage**
   - Click the extension icon to open in a new tab
   - Or open a new tab (the app replaces the default new tab page)
   - All data syncs automatically using Chrome Storage

## 📁 Project Structure

```
timeManagement/
├── src/
│   ├── components/
│   │   ├── analytics/      # Analytics charts and visualizations
│   │   ├── dashboard/      # Dashboard widgets (Pomodoro, FocusMeter)
│   │   ├── layout/         # Header and navigation
│   │   ├── tasks/          # Task components (TaskCard, TaskModal, TaskCircularTimer)
│   │   └── ui/             # Reusable UI components
│   ├── router/             # Vue Router configuration
│   ├── stores/             # Pinia stores (tasks, timeTracking, analytics, pomodoro)
│   ├── utils/              # Helper functions (dateHelpers, formatters)
│   ├── views/              # Page components (Dashboard, Schedule, Analytics, Settings)
│   ├── App.vue             # Root component
│   ├── main.js             # Application entry point
│   └── style.css           # Global styles
├── extension/
│   ├── background.js       # Chrome extension service worker
│   ├── manifest.json       # Extension configuration
│   └── icons/              # Extension icons
├── public/                 # Static assets
├── dist/                   # Build output (generated)
├── index.html              # HTML entry point
├── vite.config.js          # Vite configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── package.json            # Project dependencies
```

## 🎯 Key Features Explained

### Circular Task Timer
- **Visual Progress**: SVG-based circular progress indicator
- **Countdown Display**: Shows remaining time in MM:SS format
- **Color Coding**: Green (0-50%), Blue (50-75%), Yellow (75-100%), Red (100%+)
- **Real-time Updates**: Updates every second during active tracking

### Pomodoro Timer
- **Configurable Cycles**: Customize work and break durations
- **Automatic Transitions**: Seamlessly switches between focus and break periods
- **Session Counter**: Tracks completed Pomodoro cycles
- **Independent Operation**: Runs separately from task timer

### Time Tracking
- **Pause/Resume**: Track breaks and interruptions
- **Automatic Calculation**: Real-time duration updates
- **Focus Score**: Calculated based on work time vs pause time
- **Persistent Storage**: All data saved to localStorage/Chrome Storage

## 🎨 Color Scheme

- **Primary**: Dark blue (#1e293b, #334155, #475569)
- **Accent**: Blue-purple gradient (#3b82f6 to #8b5cf6)
- **Success**: Green (#10b981)
- **Warning**: Orange (#f59e0b)
- **Error**: Red (#ef4444)

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for web production
- `npm run preview` - Preview production build locally
- `npm run build:extension` - Build Chrome extension

### State Management

The application uses Pinia for state management with the following stores:

- **tasks**: Task CRUD operations, status management
- **timeTracking**: Active time tracking, pause/resume, history
- **pomodoro**: Pomodoro timer state and configuration
- **analytics**: Performance metrics and statistics (planned)

### Adding New Features

1. Create components in appropriate `src/components/` subdirectory
2. Add routes in `src/router/index.js`
3. Create Pinia store if needed in `src/stores/`
4. Update views in `src/views/`

## 📝 Usage Guide

### Creating a Task
1. Click **+ Add Task** button
2. Fill in task details:
   - Title (required)
   - Duration in minutes (required)
   - Category (work, personal, learning, health, creative)
   - Priority (low, medium, high, urgent)
   - Time slot (optional)
3. Click **Add Task**

### Starting a Task
1. Navigate to Dashboard or Schedule
2. Click **Start** on any pending task
3. Timer begins countdown automatically
4. Use **Pause** to take breaks
5. Click **Complete** when finished

### Using Pomodoro Timer
1. Go to Settings to configure durations
2. Click **Start** on Pomodoro widget
3. Focus during work period
4. Take breaks when prompted
5. Repeat cycle as needed

## 🔒 Privacy & Data

- **All data stored locally**: No external servers or APIs
- **No tracking**: No analytics or telemetry
- **Offline capable**: Works without internet connection
- **Data ownership**: Full control over export/import

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Vue.js Team** - For the amazing framework
- **Tailwind CSS** - For the utility-first CSS framework
- **Pinia** - For intuitive state management
- **HeadlessUI** - For accessible UI components

## 📧 Contact

For questions, suggestions, or issues, please open an issue on GitHub.

---

**Built with ❤️ using Vue 3 + Vite**
