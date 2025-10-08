"use client";

import { useState, useEffect } from "react";
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Download, 
  Filter, 
  RefreshCw,
  Clock,
  Target,
  Activity,
  Users,
  FileText,
  CheckCircle,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Minus
} from "lucide-react";

interface ReportData {
  timeTracking: {
    totalHours: number;
    dailyAverage: number;
    weeklyTotal: number;
    monthlyTotal: number;
    categoryBreakdown: Array<{
      category: string;
      hours: number;
      percentage: number;
    }>;
    dailyHours: Array<{
      date: string;
      hours: number;
    }>;
  };
  productivity: {
    tasksCompleted: number;
    tasksOverdue: number;
    completionRate: number;
    averageTaskTime: number;
    focusTime: number;
    breakTime: number;
  };
  projects: {
    activeProjects: number;
    completedProjects: number;
    overdueProjects: number;
    averageProjectDuration: number;
    projectSuccessRate: number;
  };
  notes: {
    totalNotes: number;
    notesThisWeek: number;
    averageNoteLength: number;
    mostUsedTags: Array<{
      tag: string;
      count: number;
    }>;
  };
  files: {
    totalFiles: number;
    filesThisWeek: number;
    totalSize: number;
    mostAccessedFiles: Array<{
      name: string;
      accessCount: number;
    }>;
  };
}

interface ReportingDashboardProps {
  dateRange: {
    start: string;
    end: string;
  };
  onExport?: (format: 'pdf' | 'csv' | 'json') => void;
}

export function ReportingDashboard({ dateRange, onExport }: ReportingDashboardProps) {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedView, setSelectedView] = useState<'overview' | 'detailed' | 'comparison'>('overview');

  // Mock data - in a real app, this would come from the API
  useEffect(() => {
    const loadReportData = async () => {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: ReportData = {
        timeTracking: {
          totalHours: 168.5,
          dailyAverage: 8.4,
          weeklyTotal: 42.0,
          monthlyTotal: 168.5,
          categoryBreakdown: [
            { category: 'work', hours: 120.5, percentage: 71.5 },
            { category: 'meeting', hours: 25.0, percentage: 14.8 },
            { category: 'learning', hours: 15.0, percentage: 8.9 },
            { category: 'break', hours: 8.0, percentage: 4.8 }
          ],
          dailyHours: [
            { date: '2024-01-15', hours: 8.5 },
            { date: '2024-01-16', hours: 7.0 },
            { date: '2024-01-17', hours: 9.0 },
            { date: '2024-01-18', hours: 8.0 },
            { date: '2024-01-19', hours: 6.5 }
          ]
        },
        productivity: {
          tasksCompleted: 45,
          tasksOverdue: 3,
          completionRate: 93.8,
          averageTaskTime: 2.5,
          focusTime: 6.2,
          breakTime: 1.8
        },
        projects: {
          activeProjects: 8,
          completedProjects: 12,
          overdueProjects: 1,
          averageProjectDuration: 14.5,
          projectSuccessRate: 92.3
        },
        notes: {
          totalNotes: 156,
          notesThisWeek: 23,
          averageNoteLength: 245,
          mostUsedTags: [
            { tag: 'meeting', count: 45 },
            { tag: 'ideas', count: 32 },
            { tag: 'research', count: 28 },
            { tag: 'todo', count: 25 }
          ]
        },
        files: {
          totalFiles: 89,
          filesThisWeek: 12,
          totalSize: 2.4,
          mostAccessedFiles: [
            { name: 'project-proposal.pdf', accessCount: 15 },
            { name: 'meeting-notes.md', accessCount: 12 },
            { name: 'design-mockups.fig', accessCount: 8 }
          ]
        }
      };
      
      setReportData(mockData);
      setLoading(false);
    };

    loadReportData();
  }, [dateRange]);

  const formatFileSize = (gb: number) => {
    if (gb < 1) {
      return `${(gb * 1024).toFixed(1)} MB`;
    }
    return `${gb.toFixed(1)} GB`;
  };

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) return <ArrowUp className="h-4 w-4 text-green-500" />;
    if (current < previous) return <ArrowDown className="h-4 w-4 text-red-500" />;
    return <Minus className="h-4 w-4 text-gray-500" />;
  };

  const getTrendColor = (current: number, previous: number) => {
    if (current > previous) return "text-green-500";
    if (current < previous) return "text-red-500";
    return "text-gray-500";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Generating report...</p>
        </div>
      </div>
    );
  }

  if (!reportData) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <p className="text-destructive">Failed to load report data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Analytics Report</h2>
          <p className="text-muted-foreground">
            {new Date(dateRange.start).toLocaleDateString()} - {new Date(dateRange.end).toLocaleDateString()}
          </p>
        </div>
        
        <div className="flex gap-2">
          <select
            value={selectedView}
            onChange={(e) => setSelectedView(e.target.value as any)}
            className="px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="overview">Overview</option>
            <option value="detailed">Detailed</option>
            <option value="comparison">Comparison</option>
          </select>
          
          <button
            onClick={() => onExport?.('pdf')}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">Total Hours</span>
          </div>
          <div className="text-2xl font-bold">{reportData.timeTracking.totalHours.toFixed(1)}h</div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            {getTrendIcon(reportData.timeTracking.totalHours, 160)}
            <span className={getTrendColor(reportData.timeTracking.totalHours, 160)}>
              +5.3% from last month
            </span>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">Tasks Completed</span>
          </div>
          <div className="text-2xl font-bold">{reportData.productivity.tasksCompleted}</div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            {getTrendIcon(reportData.productivity.tasksCompleted, 42)}
            <span className={getTrendColor(reportData.productivity.tasksCompleted, 42)}>
              +7.1% from last month
            </span>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium">Completion Rate</span>
          </div>
          <div className="text-2xl font-bold">{reportData.productivity.completionRate.toFixed(1)}%</div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            {getTrendIcon(reportData.productivity.completionRate, 89.2)}
            <span className={getTrendColor(reportData.productivity.completionRate, 89.2)}>
              +4.6% from last month
            </span>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium">Focus Time</span>
          </div>
          <div className="text-2xl font-bold">{reportData.productivity.focusTime.toFixed(1)}h</div>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            {getTrendIcon(reportData.productivity.focusTime, 5.8)}
            <span className={getTrendColor(reportData.productivity.focusTime, 5.8)}>
              +6.9% from last month
            </span>
          </div>
        </div>
      </div>

      {/* Time Tracking Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Time by Category</h3>
          <div className="space-y-3">
            {reportData.timeTracking.categoryBreakdown.map((category) => (
              <div key={category.category} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="capitalize font-medium">{category.category}</span>
                  <span className="font-mono">{category.hours.toFixed(1)}h ({category.percentage.toFixed(1)}%)</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${category.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Daily Hours Trend</h3>
          <div className="space-y-2">
            {reportData.timeTracking.dailyHours.map((day) => (
              <div key={day.date} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                </span>
                <div className="flex items-center gap-2">
                  <div className="w-20 bg-muted rounded-full h-2">
                    <div
                      className="bg-primary h-2 rounded-full"
                      style={{ width: `${(day.hours / 10) * 100}%` }}
                    />
                  </div>
                  <span className="font-mono text-sm w-12 text-right">{day.hours.toFixed(1)}h</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Project & Task Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Project Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Active Projects</span>
              <span className="font-bold text-blue-500">{reportData.projects.activeProjects}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Completed</span>
              <span className="font-bold text-green-500">{reportData.projects.completedProjects}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Overdue</span>
              <span className="font-bold text-red-500">{reportData.projects.overdueProjects}</span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm">Success Rate</span>
                <span className="font-bold">{reportData.projects.projectSuccessRate.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Productivity Metrics</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Avg Task Time</span>
              <span className="font-bold">{reportData.productivity.averageTaskTime.toFixed(1)}h</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Focus Time</span>
              <span className="font-bold text-green-500">{reportData.productivity.focusTime.toFixed(1)}h</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Break Time</span>
              <span className="font-bold text-orange-500">{reportData.productivity.breakTime.toFixed(1)}h</span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm">Overdue Tasks</span>
                <span className="font-bold text-red-500">{reportData.productivity.tasksOverdue}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-card border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Content Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Notes</span>
              <span className="font-bold">{reportData.notes.totalNotes}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Notes This Week</span>
              <span className="font-bold text-blue-500">{reportData.notes.notesThisWeek}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Total Files</span>
              <span className="font-bold">{reportData.files.totalFiles}</span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm">Storage Used</span>
                <span className="font-bold">{formatFileSize(reportData.files.totalSize)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Most Used Tags */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Most Used Tags</h3>
        <div className="flex flex-wrap gap-2">
          {reportData.notes.mostUsedTags.map((tag) => (
            <div
              key={tag.tag}
              className="flex items-center gap-2 px-3 py-1 bg-muted rounded-full text-sm"
            >
              <span>#{tag.tag}</span>
              <span className="text-muted-foreground">({tag.count})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Most Accessed Files */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Most Accessed Files</h3>
        <div className="space-y-2">
          {reportData.files.mostAccessedFiles.map((file) => (
            <div key={file.name} className="flex items-center justify-between p-2 hover:bg-muted/30 rounded">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{file.name}</span>
              </div>
              <span className="text-sm text-muted-foreground">{file.accessCount} accesses</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
