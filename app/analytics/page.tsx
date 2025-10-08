"use client";

import { useState } from "react";
import { Navigation } from "@/components/navigation";
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";
import { TimeTracking } from "@/components/analytics/time-tracking";
import { ReportingDashboard } from "@/components/analytics/reporting-dashboard";

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'time-tracking' | 'reports'>('overview');
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 days ago
    end: new Date().toISOString().split('T')[0] // today
  });

  const handleExport = (format: 'pdf' | 'csv' | 'json') => {
    console.log(`Exporting report as ${format}`);
    // In a real app, this would trigger the actual export
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Analytics & Insights</h1>
          <p className="text-muted-foreground">Track your productivity, habits, and progress with detailed analytics</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex gap-1 bg-muted p-1 rounded-lg w-fit">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('time-tracking')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'time-tracking'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Time Tracking
            </button>
            <button
              onClick={() => setActiveTab('reports')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'reports'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Reports
            </button>
          </div>
        </div>

        {/* Date Range Selector */}
        <div className="mb-6 flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">From:</label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              className="px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium">To:</label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              className="px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && <AnalyticsDashboard />}
        {activeTab === 'time-tracking' && <TimeTracking />}
        {activeTab === 'reports' && (
          <ReportingDashboard 
            dateRange={dateRange} 
            onExport={handleExport}
          />
        )}
      </main>

      <Navigation />
    </div>
  );
}
