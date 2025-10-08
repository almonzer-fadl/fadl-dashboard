import { NextRequest, NextResponse } from 'next/server';

// Mock analytics data - in production, this would come from your database
const analyticsData = {
  productivityMetrics: {
    tasksCompleted: 47,
    focusTime: 24.5,
    productivityScore: 87,
    goalsAchieved: 8,
    totalGoals: 12
  },
  habitTracking: [
    { name: "Morning Routine", completed: 28, total: 30, percentage: 93 },
    { name: "Exercise", completed: 22, total: 30, percentage: 73 },
    { name: "Reading", completed: 25, total: 30, percentage: 83 },
    { name: "Meditation", completed: 18, total: 30, percentage: 60 },
    { name: "Coding", completed: 26, total: 30, percentage: 87 }
  ],
  projectProgress: [
    { name: "Dashboard Redesign", progress: 85, status: "in-progress" },
    { name: "API Development", progress: 60, status: "in-progress" },
    { name: "Mobile App", progress: 30, status: "planning" },
    { name: "Documentation", progress: 95, status: "review" }
  ],
  timeDistribution: [
    { category: "Development", hours: 32, color: "bg-blue-500" },
    { category: "Design", hours: 18, color: "bg-purple-500" },
    { category: "Planning", hours: 12, color: "bg-green-500" },
    { category: "Meetings", hours: 8, color: "bg-orange-500" },
    { category: "Learning", hours: 15, color: "bg-pink-500" }
  ],
  weeklyOverview: [
    { day: "Mon", productivity: 85 },
    { day: "Tue", productivity: 92 },
    { day: "Wed", productivity: 78 },
    { day: "Thu", productivity: 88 },
    { day: "Fri", productivity: 95 },
    { day: "Sat", productivity: 45 },
    { day: "Sun", productivity: 30 }
  ],
  insights: [
    {
      type: "success",
      message: "Great job! You've completed 87% of your tasks this week.",
      icon: "🎉"
    },
    {
      type: "tip",
      message: "Your most productive hours are 9-11 AM. Schedule important tasks then.",
      icon: "💡"
    },
    {
      type: "warning",
      message: "Meditation habit needs attention - only 60% completion rate.",
      icon: "⚠️"
    }
  ],
  recommendations: [
    {
      title: "Focus on Deep Work",
      description: "Try the Pomodoro technique during your peak hours (9-11 AM)"
    },
    {
      title: "Improve Consistency",
      description: "Set a specific time for meditation to build the habit"
    },
    {
      title: "Optimize Schedule",
      description: "Consider moving meetings to afternoons to protect morning focus time"
    }
  ]
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get('period') || '7d';
  const metric = searchParams.get('metric');

  // In production, filter data based on period and metric
  let responseData = analyticsData;

  if (metric) {
    responseData = { [metric]: analyticsData[metric as keyof typeof analyticsData] };
  }

  return NextResponse.json(responseData);
}
