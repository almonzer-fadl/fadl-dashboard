"use client";

import { useState } from "react";
import { Plus, MoreHorizontal, Calendar, User, Tag, FolderPlus, Edit, Trash2, FileType } from "lucide-react";
import { ProjectForm } from "./project-form";
import { ProjectTemplates } from "./project-templates";
import { ConfirmModal } from "@/components/ui/modal";

interface Task {
  id: string;
  title: string;
  description?: string;
  assignee?: string;
  dueDate?: string;
  priority: "low" | "medium" | "high";
  tags?: string[];
}

interface Column {
  id: string;
  title: string;
  tasks: Task[];
  color: string;
}

export function KanbanBoard() {
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  
  const [columns, setColumns] = useState<Column[]>([
    {
      id: "todo",
      title: "To Do",
      color: "bg-gray-100 dark:bg-gray-800",
      tasks: [
        {
          id: "1",
          title: "Design new dashboard layout",
          description: "Create wireframes and mockups for the new dashboard",
          assignee: "You",
          dueDate: "2024-01-15",
          priority: "high",
          tags: ["design", "ui"]
        },
        {
          id: "2",
          title: "Research new technologies",
          description: "Look into latest React patterns and best practices",
          assignee: "You",
          dueDate: "2024-01-20",
          priority: "medium",
          tags: ["research", "tech"]
        }
      ]
    },
    {
      id: "in-progress",
      title: "In Progress",
      color: "bg-blue-100 dark:bg-blue-900",
      tasks: [
        {
          id: "3",
          title: "Implement authentication system",
          description: "Set up JWT authentication with refresh tokens",
          assignee: "You",
          dueDate: "2024-01-18",
          priority: "high",
          tags: ["backend", "auth"]
        }
      ]
    },
    {
      id: "review",
      title: "Review",
      color: "bg-yellow-100 dark:bg-yellow-900",
      tasks: [
        {
          id: "4",
          title: "Code review for API endpoints",
          description: "Review and test all API endpoints",
          assignee: "You",
          dueDate: "2024-01-16",
          priority: "medium",
          tags: ["review", "api"]
        }
      ]
    },
    {
      id: "done",
      title: "Done",
      color: "bg-green-100 dark:bg-green-900",
      tasks: [
        {
          id: "5",
          title: "Set up project structure",
          description: "Initialize Next.js project with TypeScript",
          assignee: "You",
          dueDate: "2024-01-10",
          priority: "high",
          tags: ["setup", "typescript"]
        }
      ]
    }
  ]);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  const addTask = (columnId: string) => {
    const newTask: Task = {
      id: Date.now().toString(),
      title: "New Task",
      description: "Click to edit",
      priority: "medium",
      tags: []
    };

    setColumns(prev => prev.map(col => 
      col.id === columnId 
        ? { ...col, tasks: [...col.tasks, newTask] }
        : col
    ));
  };

  const handleCreateProject = (projectData: any) => {
    // In a real app, this would save to the database
    console.log("Creating project:", projectData);
    setShowProjectForm(false);
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setShowProjectForm(true);
  };

  const handleUpdateProject = (projectData: any) => {
    // In a real app, this would update the database
    console.log("Updating project:", projectData);
    setShowProjectForm(false);
    setEditingProject(null);
  };

  const handleDeleteProject = (projectId: string) => {
    // In a real app, this would delete from the database
    console.log("Deleting project:", projectId);
    setShowDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      {/* Header with Project Actions */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Project Management</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowTemplates(true)}
            className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors flex items-center gap-2"
          >
            <FileType className="h-4 w-4" />
            Templates
          </button>
          <button
            onClick={() => setShowProjectForm(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
          >
            <FolderPlus className="h-4 w-4" />
            New Project
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex gap-6 overflow-x-auto pb-4">
      {columns.map((column) => (
        <div key={column.id} className="flex-shrink-0 w-80">
          <div className={`${column.color} rounded-lg p-4`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-lg">{column.title}</h3>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {column.tasks.length}
                </span>
                <button
                  onClick={() => addTask(column.id)}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  <Plus className="h-4 w-4" />
                </button>
                <button className="p-1 hover:bg-white/20 rounded transition-colors">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="space-y-3">
              {column.tasks.map((task) => (
                <div
                  key={task.id}
                  className="bg-white dark:bg-gray-700 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium text-sm">{task.title}</h4>
                    <div className={`w-3 h-3 rounded-full ${getPriorityColor(task.priority)}`} />
                  </div>
                  
                  {task.description && (
                    <p className="text-xs text-muted-foreground mb-3">
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-2">
                      {task.assignee && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{task.assignee}</span>
                        </div>
                      )}
                      {task.dueDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {task.tags && task.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {task.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 dark:bg-gray-600 rounded text-xs"
                        >
                          <Tag className="h-2 w-2" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
      </div>

      {/* Project Form Modal */}
      <ProjectForm
        isOpen={showProjectForm}
        onClose={() => {
          setShowProjectForm(false);
          setEditingProject(null);
        }}
        onSubmit={editingProject ? handleUpdateProject : handleCreateProject}
        project={editingProject}
        title={editingProject ? "Edit Project" : "Create Project"}
      />

      {/* Project Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card border rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Project Templates</h2>
              <button
                onClick={() => setShowTemplates(false)}
                className="p-2 hover:bg-accent/60 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <ProjectTemplates
                onSelectTemplate={(template) => {
                  // In a real app, this would create a new project from the template
                  console.log("Selected template:", template);
                  setShowTemplates(false);
                }}
                onClose={() => setShowTemplates(false)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={!!showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(null)}
        onConfirm={() => showDeleteConfirm && handleDeleteProject(showDeleteConfirm)}
        title="Delete Project"
        message="Are you sure you want to delete this project? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  );
}
