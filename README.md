# Schedule Planner - Time Management Application

A professional productivity application built with Vue 3 for task-based scheduling, Pomodoro technique integration, and time analytics. Available as both a web application and Chrome extension.

![Vue.js](https://img.shields.io/badge/Vue.js-3.5-4FC08D?style=flat&logo=vue.js&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Pinia](https://img.shields.io/badge/Pinia-3.0-FFD859?style=flat)
![License](https://img.shields.io/badge/License-MIT-blue.svg)

---

## 🎯 Purpose & Vision

**Schedule Planner** is not just another task manager—it's a comprehensive time intelligence platform that bridges the gap between planning and execution. While traditional task planners focus on what to do and schedule managers focus on when to do it, Schedule Planner revolutionizes productivity by tracking **how well you actually execute** your plans.

### The Core Problem We Solve

Most productivity apps fail because they create a disconnect between planning and reality. You plan your day with optimistic estimates, but have no visibility into:
- How much time you *actually* spend on tasks vs. what you planned
- Where your focus breaks down during execution
- What patterns lead to productive vs. unproductive days
- How to improve your time estimation accuracy over time

**Schedule Planner** solves this by combining:
1. **Visual Time Planning** - 24-hour circular clock view for intuitive scheduling
2. **Active Time Tracking** - Real-time monitoring with pause/resume capabilities
3. **Focus Intelligence** - Automated focus scores based on work-to-break ratios
4. **Pomodoro Integration** - Structured work intervals that sync with task tracking
5. **Behavioral Analytics** - Insights into your productivity patterns and peak performance hours

### What Makes Us Different

| Feature | Traditional Task Planners | Schedule Managers | **Schedule Planner** |
|---------|--------------------------|-------------------|---------------------|
| Task Lists | ✅ | ✅ | ✅ |
| Time Blocking | ❌ | ✅ | ✅ |
| **Real-time Tracking** | ❌ | ❌ | ✅ |
| **Planned vs Actual Analysis** | ❌ | ❌ | ✅ |
| **Focus Score Calculation** | ❌ | ❌ | ✅ |
| **24-Hour Circular Visualization** | ❌ | ❌ | ✅ |
| **Pomodoro + Task Timer Sync** | ❌ | ❌ | ✅ |
| **Pause/Break Tracking** | ❌ | ❌ | ✅ |
| **Recurring Task Automation** | ✅ | Limited | ✅ |
| **Peak Performance Insights** | ❌ | ❌ | ✅ |
| **Category-Based Analytics** | Limited | ❌ | ✅ |
| **Offline-First Privacy** | Limited | Limited | ✅ |

### Key Differentiators

🔥 **Dual Timer System**: Independent task timer + Pomodoro timer working in harmony  
📊 **Visual Time Intelligence**: 24-hour circular clock showing your entire day at a glance  
🎯 **Focus Score Algorithm**: Automatically calculates productivity based on actual work vs. breaks  
⏱️ **Second-Level Precision**: Real-time tracking updates every second for accurate time awareness  
📈 **Predictive Analytics**: Learn from your patterns to improve future time estimates  
🔄 **Smart Task Rollover**: Recurring tasks automatically carry forward with customizable rules  
🌓 **Dual-Platform Design**: Seamless experience as both web app and Chrome extension  
🔒 **Privacy-First Architecture**: 100% local storage, no cloud, no tracking, complete data ownership

## ✨ Comprehensive Feature Set

### 📊 Dashboard - Your Command Center
- **Circular Task Timer**: 
  - Real-time visual countdown with second-level precision
  - Color-coded progress states (green → blue → yellow → red)
  - Live MM:SS display with percentage completion
  - Pause/resume with automatic duration tracking
  - Actual vs. planned time comparison

- **Integrated Pomodoro Timer**: 
  - Independent operation from task timer
  - Configurable work/break intervals (15-60 min work, 3-15 min short break, 10-30 min long break)
  - Automatic phase transitions (work → short break → work → long break)
  - Session counter with automatic reset
  - Desktop notifications for phase changes
  - Auto-pause task tracking during Pomodoro breaks

- **Focus Meter**: 
  - Real-time focus score calculation (0-100 scale)
  - Daily, weekly, and monthly productivity tracking
  - Work-to-break ratio analysis
  - Streak tracking for consecutive productive days
  - Visual gauge with color-coded performance zones

- **Quick Stats Dashboard**: 
  - Completed tasks count with visual indicators
  - In-progress task monitoring
  - Pending task queue overview
  - Productivity streak display (consecutive days)

### 📅 Schedule View - Visual Time Planning
- **24-Hour Circular Clock Chart**: 
  - Revolutionary circular timeline showing entire day at a glance
  - Color-coded task segments by category
  - Hour markers with major/minor indicators (0-23 hours)
  - Current time hand with real-time position
  - Visual overlap detection for scheduling conflicts
  - Category-based color coding (work, personal, learning, health, creative)

- **Advanced Task Management**: 
  - Create tasks with detailed attributes (title, duration, category, priority, time slot)
  - 5 categories: Work, Personal, Learning, Health, Creative
  - 4 priority levels: Low, Medium, High, Urgent
  - Recurring task automation with smart rollover
  - Tag support for flexible organization
  - Time slot assignment with conflict detection

- **Interactive Task Cards**: 
  - Start/pause/complete/delete actions
  - Real-time progress tracking
  - Duration vs. actual time display
  - Category and priority badges
  - Circular timer integration per task

### 📈 Analytics - Data-Driven Insights
- **Daily Analytics**: 
  - Total planned vs. actual time comparison
  - Task completion rates and percentages
  - Focus score calculation
  - Category breakdown with time distribution
  - Peak productivity hour identification

- **Weekly Analytics**: 
  - 7-day performance overview
  - Daily trend visualization
  - Best/worst day identification
  - Weekly goal progress tracking
  - Productivity streak calculation
  - Category time allocation analysis

- **Monthly Analytics**: 
  - 30-day performance metrics
  - Long-term trend identification
  - Month-over-month comparisons
  - Cumulative focus scores
  - Category distribution patterns

- **Performance Visualizations**: 
  - Category pie charts with time percentages
  - Progress bar charts for completion rates
  - Focus score trends over time
  - Time utilization graphs

### ⏱️ Time Tracking System - The Intelligence Layer
- **Active Time Tracking**: 
  - Second-by-second duration updates
  - Automatic start/stop with task lifecycle
  - Real-time synchronization with task cards
  - Persistent storage across sessions

- **Pause/Break Management**: 
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

- **Chrome Extension**: 
  - New tab replacement mode
  - Popup interface option
  - Chrome Storage API sync
  - Cross-device data synchronization
  - Icon badge with task count

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
