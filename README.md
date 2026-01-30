# Schedule Planner - Time Management Application

A professional productivity application built with Vue 3 for task-based scheduling, real-time time tracking, and comprehensive analytics. Available as both a web application and Chrome extension.

![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=flat&logo=vue.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-3.0-FFD859?style=flat)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

---

## 🎯 Purpose & Vision

**Schedule Planner** is a comprehensive time intelligence platform that bridges planning and execution. It tracks not just what you plan, but **how and when you actually work**, providing real-time insights and visual feedback.

### The Core Problem We Solve

Most productivity apps create a disconnect between planning and reality. You plan optimistically, but have no visibility into:
- When you *actually* work on tasks vs. when you scheduled them
- How your actual work time compares to planned duration
- Real-time progress and accountability during task execution
- Patterns showing when you're most productive vs. when you planned to be

**Schedule Planner** solves this with:
1. **Dual-Layer Time Visualization** - See both planned schedule AND actual work sessions on a 24-hour clock
2. **Real-Time Tracking** - Live monitoring that updates every second with automatic completion
3. **Reward System** - Visual feedback (gold colors) when you work on schedule
4. **Smart Notifications** - Sound and browser alerts when tasks complete
5. **Focus Intelligence** - Automated scores based on planned vs. actual efficiency
6. **Multi-Session Support** - Track multiple work sessions per task with pause/resume

### Revolutionary Features

| Feature | Traditional Apps | **Schedule Planner** |
|---------|-----------------|---------------------|
| **Time Segments Tracking** | ❌ | ✅ Real-time work sessions |
| **Dual-Layer Clock** | ❌ | ✅ Scheduled + Actual overlay |
| **On-Schedule Rewards** | ❌ | ✅ Gold colors for punctuality |
| **Auto-Completion** | ❌ | ✅ Sound + notification |
| **Real-Time Updates** | ❌ | ✅ Every second refresh |
| **Multiple Sessions/Task** | ❌ | ✅ Pause/resume tracking |
| **Visual Time Comparison** | ❌ | ✅ Thin vs. wide segments |
| **Focus Score (AI)** | ❌ | ✅ Variance-based calculation |
| **Cross-Platform Notifications** | Limited | ✅ Web + Extension |

### Key Differentiators

🔥 **Real-Time Work Tracking**: Monitors actual work sessions, not just planned time  
📊 **24-Hour Dual-Layer Clock**: Shows both your plan (thin) and reality (wide) simultaneously  
🎯 **Smart Reward System**: Gold/bright colors when you work exactly when scheduled  
⏱️ **Live Progress Tracking**: Updates every second with growing visual segments  
🔔 **Auto-Complete with Alerts**: Sound + notification when scheduled time ends  
🎨 **Visual Time Intelligence**: Instantly see gaps between planning and execution  
🔄 **Multi-Session Tasks**: Track start/pause/resume cycles for each task  
🌓 **Dual-Platform**: Seamless experience as web app and Chrome extension  
🔒 **Privacy-First**: 100% local storage, zero cloud, complete data ownership

## ✨ Comprehensive Feature Set

### 📊 Dashboard - Your Command Center

- **Circular Task Timer with Auto-Complete**: 
  - Real-time visual countdown with second-level precision
  - Color-coded progress (blue → gold/green → warning)
  - Live MM:SS display with percentage completion
  - **Auto-completion when time expires**: Sound + notification + automatic status update
  - Pause/resume with automatic time segment tracking
  - Multiple work session support per task
  - Actual vs. planned time comparison

- **Smart Notifications System**: 
  - **Cross-platform support**: Works in both web app and Chrome extension
  - **Automatic triggers**: When scheduled duration completes
  - **Two-tone sound alert**: Pleasant notification beep
  - **Browser notifications**: Desktop popup with task details
  - **Auto-complete**: Task marks complete 1 second after notification

- **Integrated Pomodoro Timer**: 
  - Independent operation from task timer
  - Configurable work/break intervals (15-60 min work, 3-15 min short break, 10-30 min long break)
  - Automatic phase transitions (work → short break → work → long break)
  - Session counter with automatic reset
  - Auto-pause task tracking during Pomodoro breaks

- **Focus Meter with Smart Calculation**: 
  - **Variance-based focus score** (0-100 scale) calculated from actual vs. planned efficiency
  - Formula: `100 - (|actual - planned| / planned × 100)`
  - Perfect match (actual ≈ planned) = 100% score
  - Variance increases = score decreases proportionally
  - No plan but working = 50% base score
  - Planned but no work = 0% score
  - Daily, weekly, and monthly tracking
  - Streak tracking for consecutive productive days

- **Notification System**: 
  - **Real-time notification panel** with sliding drawer interface
  - **Unread badge counter** on notification bell icon
  - **Auto-cleanup**: Notifications older than 3 days automatically removed
  - **Persistent storage**: All notifications saved to localStorage
  - **Event triggers**: Task completion, auto-complete, pause events
  - **Visual indicators**: Icons, timestamps, read/unread status
  - **Time formatting**: "Just now", "5m ago", "2h ago" display

### 📅 Schedule View - Revolutionary Time Visualization

- **24-Hour Dual-Layer Clock Chart**: 
  - **Two visual layers on single clock**:
    - **Thin segments (background)**: Your planned schedule
    - **Wide segments (foreground)**: Your actual work sessions
  - **Real-time growing segments**: Active tasks expand every second
  - **Reward color system**:
    - 🎯 **Gold (#fbbf24)**: Currently working on schedule
    - ✨ **Bright Green (#22c55e)**: Completed work done on schedule
    - **Lime (#a3e635)**: Paused work that was on schedule
    - **Blue (#3b82f6)**: Working but off schedule
    - **Normal Green**: Completed but off schedule
    - **Gray**: Paused off-schedule work
  - **15-minute tolerance window**: Flexible schedule matching
  - Hour markers with major/minor indicators (0-23 hours)
  - Current time indicator (blue line) updates in real-time
  - Visual comparison: planned vs. actual work periods

- **Time Segments Tracking System**: 
  - **Multiple sessions per task**: Each start/stop creates a new segment
  - **Real-time segment growth**: Active segment shows current duration
  - **Session history**: All work periods stored with start/end times
  - **Automatic duration calculation**: Total from all segments
  - **Pause/resume support**: Stop creates endpoint, start creates new segment
  - **Visual on clock**: Each segment displayed at its actual time period

- **Advanced Task Management**: 
  - Create tasks with detailed attributes (title, duration, category, priority, time slot)
  - 5 categories: Work, Personal, Learning, Health, Creative
  - 4 priority levels: Low, Medium, High, Urgent
  - Recurring task automation with smart rollover
  - Tag support for flexible organization
  - Time slot assignment with visual clock placement
  - **Real-time progress tracking** with live elapsed time display
  - **Multi-session work support**: Pause/resume preserves all time segments
  - **Active task persistence**: Current task survives page refreshes
  - **Accurate progress bars**: Shows total elapsed time from all work sessions

### 📈 Analytics - Data-Driven Insights

- **Smart Focus Score Calculation**: 
  - **Based on actual vs. planned efficiency variance**, not arbitrary ratings
  - Formula: `100 - (|actual - planned| / planned × 100)`
  - Perfect execution (60min planned, 60min actual) = 100%
  - 50% variance (60min planned, 30min or 90min actual) = 50%
  - Unplanned work (0min planned, any actual) = 50% base
  - Planned but didn't do (any planned, 0min actual) = 0%
  - **Handles all edge cases**: No NaN errors, graceful degradation
  - **Applied everywhere**: Dashboard, Analytics views use same calculation

- **Daily Analytics**: 
  - Total planned vs. actual time comparison
  - Task completion rates and percentages
  - **Calculated focus score** (variance-based)
  - Category breakdown with time distribution
  - Peak productivity hour identification
  - Real work sessions tracked via timeSegments

- **Weekly Analytics**: 
  - 7-day performance overview
  - Daily trend visualization
  - **Average focus score** (only days with activity)
  - Best/worst day identification
  - Weekly goal progress tracking
  - Productivity streak calculation

- **Monthly Analytics**: 
  - 30-day performance metrics
  - Long-term trend identification
  - **Average focus score** (only weeks with data)
  - Month-over-month comparisons
  - Cumulative productivity patterns

### ⏱️ Real-Time Tracking System - The Intelligence Layer

- **Time Segments Architecture**: 
  - Each task stores `timeSegments` array
  - Segment structure: `{ startTime: ISO, endTime: ISO|null }`
  - Active segment: `endTime === null`
  - Completed segment: `endTime` set when paused/stopped
  - Real-time calculation from all segments 
  - Unlimited pause cycles per task
  - Automatic pause time calculation
  - Break reason tagging
  - Pause duration exclusion from work time
  - Resume with time continuity

- **Focus Score Algorithm**: 
  - Calculates ratio of work time to total time
  - Excludes pause periods automatically
  - Weighted scoring based on task duration
  - Real-time score updates
  - Aggregation for daily/weekly/monthly metrics

- **Time Entry History**: 
  - Complete log of all time tracking sessions
  - Per-task duration breakdown
  - Pause event logging with timestamps
  - Date-based filtering and search

### ⚙️ Settings & Configuration
- **Pomodoro Customization**: 
  - Work duration: 15-60 minutes (default 25)
  - Short break: 3-15 minutes (default 5)
  - Long break: 10-30 minutes (default 15)
  - Intervals before long break: customizable (default 4)
  - Auto-start preferences for breaks and work sessions
  - Enable/disable Pomodoro integration

- **Data Management**: 
  - Export all data to JSON format
  - Import data with merge options
  - Automatic localStorage persistence
  - Chrome Storage API sync (extension mode)
  - No data loss on browser closure

- **Notification System**: 
  - Desktop notifications for Pomodoro phase changes
  - Task completion reminders
  - Break time alerts
  - Browser permission management
  - Customizable notification preferences

### 🔄 Smart Features
- **Recurring Tasks**: 
  - Daily, weekly, monthly patterns
  - Automatic rollover to next period
  - Duplicate detection to prevent conflicts
  - Preserve task attributes (category, priority, duration)
  - Carry-over tracking

- **Task Lifecycle Management**: 
  - Status tracking: pending → in-progress → completed
  - Single active task enforcement
  - Automatic state transitions
  - Timestamp logging (created, started, completed)
  - Update history preservation

- **Multi-Category Support**: 
  - Work: Professional tasks and projects
  - Personal: Life management and errands
  - Learning: Education and skill development
  - Health: Exercise, meditation, wellness
  - Creative: Hobbies, art, creative pursuits

### 🌐 Dual Platform Experience
- **Web Application**: 
  - Full-screen progressive web app
  - Responsive design (mobile, tablet, desktop)
  - Keyboard shortcuts support
  - Browser localStorage persistence
  - Real-time updates every second

- **Chrome Extension**: 
  - **New tab replacement mode**: Opens full app when creating new tabs
  - **Icon click opens app**: Clicking extension icon opens full app in new tab
  - **No popup interface**: Streamlined experience without fragmented popup
  - **Chrome Storage API sync**: Data syncs across devices
  - **Background service worker**: Handles daily task rollover
  - **Notification integration**: Desktop notifications for task events
  - **Automatic daily rollover**: Tasks reset at midnight automatically

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
   - Click the extension icon to open the app in a new tab
   - Or open a new tab (the app replaces the default new tab page)
   - All data persists locally using localStorage
   - Daily rollover happens automatically at midnight

## 📁 Project Structure

```
timeManagement/
├── src/
│   ├── components/
│   │   ├── analytics/      # Analytics charts and visualizations
│   │   ├── dashboard/      # Dashboard widgets (Pomodoro, FocusMeter)
│   │   ├── layout/         # Header, navigation, NotificationPanel
│   │   ├── schedule/       # DailyClockChart for 24-hour visualization
│   │   ├── tasks/          # Task components (TaskCard, TaskModal, TaskCircularTimer)
│   │   └── ui/             # Reusable UI components
│   ├── router/             # Vue Router configuration
│   ├── stores/             # Pinia stores (tasks, timeTracking, analytics, pomodoro, notifications)
│   ├── utils/              # Helper functions (dateHelpers, formatters)
│   ├── views/              # Page components (Dashboard, Schedule, Analytics, Settings)
│   ├── App.vue             # Root component
│   ├── main.js             # Application entry point
│   └── style.css           # Global styles
├── extension/
│   ├── background.js       # Chrome extension service worker with click handler
│   ├── manifest.json       # Extension configuration (no popup)
│   └── icons/              # Extension icons
├── public/                 # Static assets
├── scripts/
│   └── build-extension.js  # Extension build script
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

---

## 💡 Use Cases & Target Users

### For Professionals
- Track billable hours with precision
- Analyze time spent on client projects
- Identify time-wasting patterns
- Improve project time estimates
- Balance work and break periods

### For Students
- Structure study sessions with Pomodoro
- Track time per subject/course
- Analyze peak learning hours
- Build consistent study streaks
- Balance study with breaks

### For Freelancers
- Monitor project time allocation
- Improve client time estimates
- Track multiple project categories
- Generate time reports from data exports
- Optimize productivity patterns

### For Knowledge Workers
- Deep work session tracking
- Focus time optimization
- Meeting vs. productive work analysis
- Daily productivity pattern identification
- Work-life balance monitoring

---

## 🚀 Why Schedule Planner Wins

### vs. Traditional Task Managers (Todoist, Microsoft To Do)
❌ **They offer**: Simple checkbox lists  
✅ **We provide**: Real-time execution tracking with focus intelligence

❌ **They show**: What you planned to do  
✅ **We reveal**: How well you actually executed your plans

❌ **They lack**: Time awareness during task execution  
✅ **We deliver**: Second-by-second progress tracking with visual feedback

### vs. Time Blocking Apps (Sunsama, Motion)
❌ **They focus**: When to do tasks  
✅ **We combine**: When + how long + how focused

❌ **They assume**: You'll stick to the schedule  
✅ **We track**: Actual time vs. planned time deviations

❌ **They miss**: Break patterns and focus degradation  
✅ **We capture**: Every pause, break, and interruption for insights

### vs. Pomodoro Timers (Forest, Pomofocus)
❌ **They provide**: Generic 25-minute cycles  
✅ **We integrate**: Pomodoro with actual task context

❌ **They separate**: Timer from tasks  
✅ **We unify**: Pomodoro sessions with task tracking and analytics

❌ **They ignore**: Task-specific time needs  
✅ **We adapt**: Different work durations for different task types

### vs. RescueTime / Toggl Track
❌ **They track**: Applications and websites  
✅ **We track**: Intentional tasks with active engagement

❌ **They are passive**: Automatic background tracking  
✅ **We are active**: Deliberate task start/stop for mindful work

❌ **They lack**: Visual planning interface  
✅ **We provide**: 24-hour circular clock for day-at-a-glance planning

### The Schedule Planner Advantage

1. **Unified Experience**: Planning + Execution + Analysis in one seamless interface
2. **Visual Intelligence**: Circular clock view makes time tangible and visible
3. **Focus Science**: Automated focus score based on actual behavioral patterns
4. **Dual Timer Wisdom**: Task timer for flexibility + Pomodoro for structure
5. **Privacy Guarantee**: 100% local data, no cloud dependencies, complete ownership
6. **Cross-Platform**: Web + Chrome extension with data sync
7. **Zero Learning Curve**: Intuitive design that feels natural from day one
8. **Behavioral Insights**: Learn what makes YOU productive, not generic advice

## 🛠️ Development

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for web production
- `npm run preview` - Preview production build locally
- `npm run build:extension` - Build Chrome extension

### State Management

The application uses Pinia for state management with the following stores:

- **tasks**: Task CRUD operations, status management, activeTaskId persistence
- **timeTracking**: Active time tracking with timeSegments, pause/resume, history
- **pomodoro**: Pomodoro timer state and configuration
- **analytics**: Performance metrics, variance-based focus score calculation
- **notifications**: Notification management with localStorage persistence, auto-cleanup

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
3. Timer begins countdown automatically with real-time updates every second
4. Use **Pause** to take breaks (all work sessions are preserved)
5. Click **Resume** to continue (creates new time segment)
6. Click **Complete** when finished or wait for auto-completion

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
- **Zero dependencies**: No third-party data processors
- **GDPR compliant**: By design - your data never leaves your device
- **Transparent storage**: Plain JSON format for easy inspection and migration

---

## 🎓 Getting Started Guide

### First-Time Setup (3 minutes)

1. **Configure Pomodoro** (optional)
   - Go to Settings → Pomodoro Configuration
   - Set your preferred work duration (default: 25 min)
   - Set break durations (default: 5 min short, 15 min long)
   - Save preferences

2. **Create Your First Task**
   - Navigate to Schedule or Dashboard
   - Click "+ Add Task"
   - Enter: Title, Duration (in minutes), Category
   - Optional: Set priority, time slot, tags
   - Click "Add Task"

3. **Start Tracking**
   - Click "Start" on your task
   - Watch the circular timer count down
   - Use "Pause" for breaks (breaks won't count against work time)
   - Click "Complete" when finished

4. **Review Your Data**
   - Go to Analytics to see your performance
   - Check your Focus Score
   - Identify your peak productivity hours
   - Adjust planning based on insights

### Tips for Maximum Productivity

✅ **Plan your day each morning** - Use the 24-hour clock view to visualize your day  
✅ **Use categories consistently** - Better analytics and pattern recognition  
✅ **Be honest with pause tracking** - Breaks are normal and provide valuable insights  
✅ **Review analytics weekly** - Identify patterns and optimize your schedule  
✅ **Experiment with Pomodoro** - Find your ideal work/break rhythm  
✅ **Export data regularly** - Backup your productivity history  
✅ **Set recurring tasks** - Automate daily habits and routines

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

## 🌟 Roadmap

### Coming Soon
- [ ] Mobile app (iOS & Android with React Native)
- [ ] Team collaboration features
- [ ] Advanced analytics with ML-powered insights
- [ ] Calendar integration (Google Calendar, Outlook)
- [ ] Voice commands for hands-free task management
- [ ] Dark/Light theme toggle
- [ ] Export to PDF reports
- [ ] API for third-party integrations

---

**Built with ❤️ using Vue 3 + Vite**

*Transform your relationship with time. Not just managing tasks—mastering execution.*
