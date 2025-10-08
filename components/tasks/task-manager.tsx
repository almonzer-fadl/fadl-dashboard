"use client";

import { useState } from "react";
import { 
  Plus, 
  Filter, 
  Search, 
  Calendar, 
  User, 
  Tag, 
  Clock, 
  CheckCircle, 
  Circle, 
  AlertCircle,
  MoreHorizontal,
  Edit,
  Trash2,
  Star,
  Link,
  ChevronDown,
  ChevronRight
} from "lucide-react";
import { TaskDependencies } from "./task-dependencies";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "review" | "done";
  priority: "low" | "medium" | "high" | "urgent";
  assignee: string;
  dueDate: string;
  tags: string[];
  isStarred: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TaskDependency {
  id: string;
  taskId: string;
  dependsOn: string;
  type: "blocks" | "blocked_by" | "related";
  description?: string;
}

export function TaskManager() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDependencies, setShowDependencies] = useState(false);

  const [dependencies, setDependencies] = useState<TaskDependency[]>([]);

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Design new dashboard layout",
      description: "Create wireframes and mockups for the new dashboard interface",
      status: "in-progress",
      priority: "high",
      assignee: "You",
      dueDate: "2024-01-20",
      tags: ["design", "ui", "frontend"],
      isStarred: true,
      createdAt: "2024-01-10",
      updatedAt: "2024-01-15"
    },
    {
      id: "2",
      title: "Implement authentication system",
      description: "Set up JWT authentication with refresh tokens",
      status: "todo",
      priority: "urgent",
      assignee: "You",
      dueDate: "2024-01-18",
      tags: ["backend", "auth", "security"],
      isStarred: false,
      createdAt: "2024-01-12",
      updatedAt: "2024-01-12"
    },
    {
      id: "3",
      title: "Write API documentation",
      description: "Document all API endpoints with examples",
      status: "review",
      priority: "medium",
      assignee: "You",
      dueDate: "2024-01-22",
      tags: ["documentation", "api"],
      isStarred: false,
      createdAt: "2024-01-14",
      updatedAt: "2024-01-16"
    },
    {
      id: "4",
      title: "Set up database migrations",
      description: "Create and test database migration scripts",
      status: "done",
      priority: "high",
      assignee: "You",
      dueDate: "2024-01-15",
      tags: ["database", "migrations"],
      isStarred: false,
      createdAt: "2024-01-08",
      updatedAt: "2024-01-15"
    }
  ]);

  const statuses = ["todo", "in-progress", "review", "done"];
  const priorities = ["low", "medium", "high", "urgent"];

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         task.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = !selectedStatus || task.status === selectedStatus;
    const matchesPriority = !selectedPriority || task.priority === selectedPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent":
        return "text-red-500 bg-red-50 dark:bg-red-900/20";
      case "high":
        return "text-orange-500 bg-orange-50 dark:bg-orange-900/20";
      case "medium":
        return "text-yellow-500 bg-yellow-50 dark:bg-yellow-900/20";
      case "low":
        return "text-green-500 bg-green-50 dark:bg-green-900/20";
      default:
        return "text-gray-500 bg-gray-50 dark:bg-gray-900/20";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "review":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <Circle className="h-4 w-4 text-gray-400" />;
    }
  };

  const toggleStar = (taskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, isStarred: !task.isStarred } : task
    ));
  };

  const updateTaskStatus = (taskId: string, newStatus: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId ? { ...task, status: newStatus as Task["status"] } : task
    ));
  };

  const createNewTask = () => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: "New Task",
      description: "Click to edit description",
      status: "todo",
      priority: "medium",
      assignee: "You",
      dueDate: new Date().toISOString().split('T')[0],
      tags: [],
      isStarred: false,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setTasks(prev => [newTask, ...prev]);
  };

  return (
    <div className="space-y-6">
      {/* Dependencies Panel */}
      {selectedTask && showDependencies && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card border rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Task Dependencies - {selectedTask.title}</h2>
              <button
                onClick={() => setShowDependencies(false)}
                className="p-2 hover:bg-accent/60 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6">
              <TaskDependencies
                task={selectedTask}
                allTasks={tasks}
                dependencies={dependencies}
                onAddDependency={addDependency}
                onRemoveDependency={removeDependency}
                onUpdateDependency={updateDependency}
              />
            </div>
          </div>
        </div>
      )}
      {/* Header with Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              showFilters ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </button>
          <button
            onClick={createNewTask}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Task
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-card border rounded-xl p-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={selectedStatus || ""}
                onChange={(e) => setSelectedStatus(e.target.value || null)}
                className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Statuses</option>
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Priority</label>
              <select
                value={selectedPriority || ""}
                onChange={(e) => setSelectedPriority(e.target.value || null)}
                className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">All Priorities</option>
                {priorities.map(priority => (
                  <option key={priority} value={priority}>
                    {priority.charAt(0).toUpperCase() + priority.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.map((task) => (
          <div
            key={task.id}
            className="bg-card border rounded-xl p-6 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleStar(task.id)}
                  className="mt-1"
                >
                  <Star className={`h-4 w-4 ${task.isStarred ? 'text-yellow-500 fill-current' : 'text-muted-foreground'}`} />
                </button>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-semibold">{task.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-3">{task.description}</p>
                  
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {task.assignee}
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(task.updatedAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {task.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs"
                      >
                        <Tag className="h-2 w-2" />
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                  {getStatusIcon(task.status)}
                  <select
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                    className="px-2 py-1 border rounded text-sm bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>
                        {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
                      </option>
                    ))}
                  </select>
                </div>
                <button className="p-2 hover:bg-accent/60 rounded transition-colors">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <Circle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No tasks found</h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery || selectedStatus || selectedPriority
                ? "Try adjusting your search or filter criteria"
                : "Create your first task to get started"
              }
            </p>
            {!searchQuery && !selectedStatus && !selectedPriority && (
              <button
                onClick={createNewTask}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Create Task
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
