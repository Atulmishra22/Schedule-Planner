// stores/analytics.js
import { defineStore } from 'pinia';
import { useTasksStore } from './tasks';
import { useTimeTrackingStore } from './timeTracking';

export const useAnalyticsStore = defineStore('analytics', () => {
  const tasksStore = useTasksStore();
  const timeStore = useTimeTrackingStore();
  
  // Daily Analytics
  const getDailyAnalytics = (date) => {
    const dayTasks = tasksStore.tasks.filter(task => task.date === date);
    const dayEntries = timeStore.timeEntries.filter(entry => entry.date === date);
    
    const totalPlanned = dayTasks.reduce((sum, task) => sum + task.duration, 0);
    const totalActual = dayEntries.reduce((sum, entry) => sum + entry.duration, 0);
    
    const tasksPlanned = dayTasks.length;
    const tasksCompleted = dayTasks.filter(t => t.status === 'completed').length;
    const tasksSkipped = dayTasks.filter(t => t.status === 'skipped').length;
    
    const avgFocusScore = dayEntries.length > 0
      ? dayEntries.reduce((sum, entry) => sum + entry.focusScore, 0) / dayEntries.length
      : 0;
    
    const categoryBreakdown = calculateCategoryBreakdown(dayTasks, dayEntries);
    const peakProductivityHour = calculatePeakHour(dayEntries);
    
    return {
      date,
      totalPlanned,
      totalActual,
      tasksPlanned,
      tasksCompleted,
      tasksSkipped,
      focusScore: Math.round(avgFocusScore),
      categoryBreakdown,
      peakProductivityHour,
      completionRate: tasksPlanned > 0 
        ? Math.round((tasksCompleted / tasksPlanned) * 100) 
        : 0
    };
  };
  
  // Weekly Analytics
  const getWeeklyAnalytics = (weekStart) => {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 6);
    
    const dailyData = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      dailyData.push(getDailyAnalytics(date.toISOString().slice(0, 10)));
    }
    
    const totalPlanned = dailyData.reduce((sum, day) => sum + day.totalPlanned, 0);
    const totalActual = dailyData.reduce((sum, day) => sum + day.totalActual, 0);
    const averageFocusScore = Math.round(
      dailyData.reduce((sum, day) => sum + day.focusScore, 0) / 7
    );
    
    const bestDay = dailyData.reduce((best, day) => 
      day.totalActual > best.totalActual ? day : best
    );
    
    const worstDay = dailyData.reduce((worst, day) => 
      day.totalActual < worst.totalActual ? day : worst
    );
    
    // Calculate streak
    const streakDays = calculateStreak(dailyData);
    
    // Calculate category breakdown
    const allTasks = dailyData.flatMap(day => 
      tasksStore.tasks.filter(task => task.date === day.date)
    );
    const allEntries = dailyData.flatMap(day => 
      timeStore.timeEntries.filter(entry => entry.date === day.date)
    );
    const categoryBreakdown = calculateCategoryBreakdown(allTasks, allEntries);
    
    return {
      weekStart: weekStart.toISOString().slice(0, 10),
      weekEnd: weekEnd.toISOString().slice(0, 10),
      dailyData,
      totalPlanned,
      totalActual,
      averageFocusScore,
      bestDay: new Date(bestDay.date).toLocaleDateString('en-US', { weekday: 'long' }),
      worstDay: new Date(worstDay.date).toLocaleDateString('en-US', { weekday: 'long' }),
      streakDays,
      categoryBreakdown,
      weeklyGoalProgress: totalPlanned > 0 
        ? Math.round((totalActual / totalPlanned) * 100) 
        : 0
    };
  };
  
  // Monthly Analytics
  const getMonthlyAnalytics = (year, month) => {
    const monthStart = new Date(year, month - 1, 1);
    const monthEnd = new Date(year, month, 0);
    
    const weeklyData = [];
    let currentWeekStart = new Date(monthStart);
    
    // Adjust to Monday
    const day = currentWeekStart.getDay();
    const diff = currentWeekStart.getDate() - day + (day === 0 ? -6 : 1);
    currentWeekStart.setDate(diff);
    
    while (currentWeekStart <= monthEnd) {
      weeklyData.push(getWeeklyAnalytics(new Date(currentWeekStart)));
      currentWeekStart.setDate(currentWeekStart.getDate() + 7);
    }
    
    const totalPlanned = weeklyData.reduce((sum, week) => sum + week.totalPlanned, 0);
    const totalActual = weeklyData.reduce((sum, week) => sum + week.totalActual, 0);
    const averageFocusScore = Math.round(
      weeklyData.reduce((sum, week) => sum + week.averageFocusScore, 0) / weeklyData.length
    );
    
    const bestWeek = weeklyData.reduce((best, week, index) => 
      week.totalActual > weeklyData[best].totalActual ? index : best
    , 0);
    
    const totalTasksCompleted = weeklyData.reduce((sum, week) => 
      sum + week.dailyData.reduce((daySum, day) => daySum + day.tasksCompleted, 0)
    , 0);
    
    // Calculate category breakdown
    const allTasks = tasksStore.tasks.filter(task => {
      const taskDate = new Date(task.date);
      return taskDate >= monthStart && taskDate <= monthEnd;
    });
    const allEntries = timeStore.timeEntries.filter(entry => {
      const entryDate = new Date(entry.date);
      return entryDate >= monthStart && entryDate <= monthEnd;
    });
    const categoryBreakdown = calculateCategoryBreakdown(allTasks, allEntries);
    
    // Calculate trend
    const firstHalfActual = weeklyData.slice(0, Math.ceil(weeklyData.length / 2))
      .reduce((sum, week) => sum + week.totalActual, 0);
    const secondHalfActual = weeklyData.slice(Math.ceil(weeklyData.length / 2))
      .reduce((sum, week) => sum + week.totalActual, 0);
    
    let monthlyTrend = 'stable';
    const difference = secondHalfActual - firstHalfActual;
    if (difference > firstHalfActual * 0.1) monthlyTrend = 'improving';
    if (difference < -firstHalfActual * 0.1) monthlyTrend = 'declining';
    
    // Calculate productive hours distribution
    const productiveHoursDistribution = calculateHourlyDistribution(allEntries);
    
    return {
      month: `${year}-${month.toString().padStart(2, '0')}`,
      year,
      weeklyData,
      totalPlanned,
      totalActual,
      averageFocusScore,
      bestWeek: bestWeek + 1,
      totalTasksCompleted,
      categoryBreakdown,
      monthlyTrend,
      productiveHoursDistribution
    };
  };
  
  // Helper Functions
  const calculateCategoryBreakdown = (tasks, entries) => {
    const categories = ['work', 'personal', 'learning', 'health', 'other'];
    const breakdown = [];
    
    const totalActual = entries.reduce((sum, entry) => sum + entry.duration, 0);
    
    categories.forEach(category => {
      const categoryTasks = tasks.filter(task => task.category === category);
      const categoryTaskIds = categoryTasks.map(task => task.id);
      const categoryEntries = entries.filter(entry => 
        categoryTaskIds.includes(entry.taskId)
      );
      
      const planned = categoryTasks.reduce((sum, task) => sum + task.duration, 0);
      const actual = categoryEntries.reduce((sum, entry) => sum + entry.duration, 0);
      const percentage = totalActual > 0 ? Math.round((actual / totalActual) * 100) : 0;
      
      breakdown.push({
        category,
        planned,
        actual,
        percentage
      });
    });
    
    return breakdown;
  };
  
  const calculatePeakHour = (entries) => {
    const hourCounts = new Array(24).fill(0);
    
    entries.forEach(entry => {
      const hour = new Date(entry.startTime).getHours();
      hourCounts[hour] += entry.duration;
    });
    
    return hourCounts.indexOf(Math.max(...hourCounts));
  };
  
  const calculateStreak = (dailyData) => {
    let streak = 0;
    
    for (let i = dailyData.length - 1; i >= 0; i--) {
      if (dailyData[i].tasksCompleted > 0) {
        streak++;
      } else {
        break;
      }
    }
    
    return streak;
  };
  
  const calculateHourlyDistribution = (entries) => {
    const distribution = [];
    
    for (let hour = 0; hour < 24; hour++) {
      const hourEntries = entries.filter(entry => {
        const entryHour = new Date(entry.startTime).getHours();
        return entryHour === hour;
      });
      
      const productivity = hourEntries.length > 0
        ? Math.round(hourEntries.reduce((sum, entry) => sum + entry.focusScore, 0) / hourEntries.length)
        : 0;
      
      const tasksCompleted = hourEntries.filter(entry => {
        const task = tasksStore.tasks.find(t => t.id === entry.taskId);
        return task && task.status === 'completed';
      }).length;
      
      distribution.push({
        hour,
        productivity,
        tasksCompleted
      });
    }
    
    return distribution;
  };
  
  return {
    getDailyAnalytics,
    getWeeklyAnalytics,
    getMonthlyAnalytics
  };
});
