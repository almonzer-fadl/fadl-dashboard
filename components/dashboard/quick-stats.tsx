"use client";

import { TrendingUp, Clock, CheckCircle, Target } from "lucide-react";

export function QuickStats() {
  const stats = [
    {
      title: "Tasks Completed",
      value: "24",
      change: "+12%",
      icon: CheckCircle,
      color: "text-green-600"
    },
    {
      title: "Hours Focused",
      value: "8.5",
      change: "+2.3h",
      icon: Clock,
      color: "text-blue-600"
    },
    {
      title: "Projects Active",
      value: "5",
      change: "2 new",
      icon: Target,
      color: "text-purple-600"
    },
    {
      title: "Productivity Score",
      value: "87%",
      change: "+5%",
      icon: TrendingUp,
      color: "text-orange-600"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className="bg-card border rounded-xl p-4 hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className={`text-xs ${stat.color}`}>{stat.change}</p>
              </div>
              <Icon className={`h-8 w-8 ${stat.color}`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
