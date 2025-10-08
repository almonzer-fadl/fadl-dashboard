"use client";

import { useState } from "react";
import { 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  Target, 
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Zap,
  Award,
  Users,
  FileText,
  FolderOpen
} from "lucide-react";

export function AnalyticsDashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState("7d");

  const periods = [
    { value: "1d", label: "Today" },
    { value: "7d", label: "7 Days" },
    { value: "30d", label: "30 Days" },
    { value: "90d", label: "90 Days" },
    { value: "1y", label: "1 Year" }
  ];

  const productivityMetrics = [
    {
      title: "Tasks Completed",
      value: "47",
      change: "+12%",
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-50 dark:bg-green-900/20"
    },
    {
      title: "Focus Time",
      value: "24.5h",
      change: "+3.2h",
      icon: Clock,
      color: "text-blue-500",
      bgColor: "bg-blue-50 dark:bg-blue-900/20"
    },
    {
      title: "Productivity Score",
      value: "87%",
      change: "+5%",
      icon: TrendingUp,
      color: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-900/20"
    },
    {
      title: "Goals Achieved",
      value: "8/12",
      change: "67%",
      icon: Target,
      color: "text-orange-500",
      bgColor: "bg-orange-50 dark:bg-orange-900/20"
    }
  ];

  const habitData = [
    { name: "Morning Routine", completed: 28, total: 30, percentage: 93 },
    { name: "Exercise", completed: 22, total: 30, percentage: 73 },
    { name: "Reading", completed: 25, total: 30, percentage: 83 },
    { name: "Meditation", completed: 18, total: 30, percentage: 60 },
    { name: "Coding", completed: 26, total: 30, percentage: 87 }
  ];

  const projectProgress = [
    { name: "Dashboard Redesign", progress: 85, status: "in-progress" },
    { name: "API Development", progress: 60, status: "in-progress" },
    { name: "Mobile App", progress: 30, status: "planning" },
    { name: "Documentation", progress: 95, status: "review" }
  ];

  const timeDistribution = [
    { category: "Development", hours: 32, color: "bg-blue-500" },
    { category: "Design", hours: 18, color: "bg-purple-500" },
    { category: "Planning", hours: 12, color: "bg-green-500" },
    { category: "Meetings", hours: 8, color: "bg-orange-500" },
    { category: "Learning", hours: 15, color: "bg-pink-500" }
  ];

  const totalHours = timeDistribution.reduce((sum, item) => sum + item.hours, 0);

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
        <div className="flex gap-2">
          {periods.map((period) => (
            <button
              key={period.value}
              onClick={() => setSelectedPeriod(period.value)}
              className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                selectedPeriod === period.value
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {productivityMetrics.map((metric, index) => {
          const Icon = metric.icon;
          return (
            <div
              key={index}
              className="bg-card border rounded-xl p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${metric.bgColor}`}>
                  <Icon className={`h-6 w-6 ${metric.color}`} />
                </div>
                <span className={`text-sm font-medium ${metric.color}`}>
                  {metric.change}
                </span>
              </div>
              <div>
                <p className="text-2xl font-bold">{metric.value}</p>
                <p className="text-sm text-muted-foreground">{metric.title}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Habit Tracking */}
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Habit Tracking</h3>
            <Activity className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            {habitData.map((habit, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">{habit.name}</span>
                  <span className="text-sm text-muted-foreground">
                    {habit.completed}/{habit.total} days
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${habit.percentage}%` }}
                  />
                </div>
                <div className="text-right text-xs text-muted-foreground mt-1">
                  {habit.percentage}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project Progress */}
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Project Progress</h3>
            <FolderOpen className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="space-y-4">
            {projectProgress.map((project, index) => (
              <div key={index}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">{project.name}</span>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    project.status === 'in-progress' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' :
                    project.status === 'planning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                    'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                  }`}>
                    {project.status}
                  </span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>
                <div className="text-right text-xs text-muted-foreground mt-1">
                  {project.progress}%
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Time Distribution */}
      <div className="bg-card border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Time Distribution</h3>
          <PieChart className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {timeDistribution.map((item, index) => (
            <div key={index} className="text-center">
              <div className="relative w-20 h-20 mx-auto mb-2">
                <div className="w-full h-full rounded-full bg-muted flex items-center justify-center">
                  <div className={`w-16 h-16 rounded-full ${item.color} flex items-center justify-center`}>
                    <span className="text-white font-bold text-sm">
                      {Math.round((item.hours / totalHours) * 100)}%
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-sm font-medium">{item.category}</p>
              <p className="text-xs text-muted-foreground">{item.hours}h</p>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Overview */}
      <div className="bg-card border rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Weekly Overview</h3>
          <BarChart3 className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="grid grid-cols-7 gap-4">
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
            const height = Math.random() * 100 + 20; // Mock data
            return (
              <div key={day} className="text-center">
                <div className="h-32 flex items-end justify-center mb-2">
                  <div
                    className="w-8 bg-primary rounded-t transition-all duration-300 hover:bg-primary/80"
                    style={{ height: `${height}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">{day}</p>
                <p className="text-xs font-medium">{Math.round(height)}%</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Insights & Recommendations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="h-5 w-5 text-yellow-500" />
            <h3 className="text-lg font-semibold">Insights</h3>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-sm font-medium text-green-800 dark:text-green-300">
                🎉 Great job! You've completed 87% of your tasks this week.
              </p>
            </div>
            <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm font-medium text-blue-800 dark:text-blue-300">
                💡 Your most productive hours are 9-11 AM. Schedule important tasks then.
              </p>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <p className="text-sm font-medium text-orange-800 dark:text-orange-300">
                ⚠️ Meditation habit needs attention - only 60% completion rate.
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="h-5 w-5 text-purple-500" />
            <h3 className="text-lg font-semibold">Recommendations</h3>
          </div>
          <div className="space-y-3">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-1">Focus on Deep Work</p>
              <p className="text-xs text-muted-foreground">
                Try the Pomodoro technique during your peak hours (9-11 AM)
              </p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-1">Improve Consistency</p>
              <p className="text-xs text-muted-foreground">
                Set a specific time for meditation to build the habit
              </p>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-1">Optimize Schedule</p>
              <p className="text-xs text-muted-foreground">
                Consider moving meetings to afternoons to protect morning focus time
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
