"use client";

import { CheckCircle, Circle, Clock, AlertCircle } from "lucide-react";

export function RecentTasks() {
  const tasks = [
    {
      id: 1,
      title: "Complete dashboard design",
      priority: "high",
      status: "in-progress",
      dueDate: "Today"
    },
    {
      id: 2,
      title: "Review project documentation",
      priority: "medium",
      status: "todo",
      dueDate: "Tomorrow"
    },
    {
      id: 3,
      title: "Update portfolio website",
      priority: "low",
      status: "completed",
      dueDate: "Yesterday"
    },
    {
      id: 4,
      title: "Prepare presentation slides",
      priority: "high",
      status: "todo",
      dueDate: "Friday"
    }
  ];

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case "high":
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case "medium":
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case "low":
        return <Circle className="h-4 w-4 text-green-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <div className="bg-card border rounded-xl p-6">
      <h2 className="text-xl font-bold mb-4">Recent Tasks</h2>
      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-accent/60 transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              {getStatusIcon(task.status)}
              <div>
                <p className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                  {task.title}
                </p>
                <p className="text-sm text-muted-foreground">Due: {task.dueDate}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getPriorityIcon(task.priority)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
