"use client";

import { useState } from "react";
import { Link, Unlink, ArrowRight, Clock, CheckCircle, AlertCircle, Plus, X } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Form, FormField, validators } from "@/components/ui/form";

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate?: string;
}

interface TaskDependency {
  id: string;
  taskId: string;
  dependsOn: string;
  type: "blocks" | "blocked_by" | "related";
  description?: string;
}

interface TaskDependenciesProps {
  task: Task;
  allTasks: Task[];
  dependencies: TaskDependency[];
  onAddDependency: (dependency: Omit<TaskDependency, "id">) => void;
  onRemoveDependency: (dependencyId: string) => void;
  onUpdateDependency: (dependencyId: string, updates: Partial<TaskDependency>) => void;
}

export function TaskDependencies({
  task,
  allTasks,
  dependencies,
  onAddDependency,
  onRemoveDependency,
  onUpdateDependency
}: TaskDependenciesProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingDependency, setEditingDependency] = useState<TaskDependency | null>(null);

  const taskDependencies = dependencies.filter(dep => dep.taskId === task.id);
  const blockingTasks = dependencies.filter(dep => dep.dependsOn === task.id && dep.type === "blocks");
  const blockedByTasks = dependencies.filter(dep => dep.taskId === task.id && dep.type === "blocked_by");
  const relatedTasks = dependencies.filter(dep => dep.taskId === task.id && dep.type === "related");

  const getTaskById = (taskId: string) => allTasks.find(t => t.id === taskId);
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "urgent": return "text-red-500";
      case "high": return "text-orange-500";
      case "medium": return "text-yellow-500";
      case "low": return "text-green-500";
      default: return "text-gray-500";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "done": return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "in-progress": return <Clock className="h-4 w-4 text-blue-500" />;
      case "blocked": return <AlertCircle className="h-4 w-4 text-red-500" />;
      default: return <div className="h-4 w-4 rounded-full bg-gray-300" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Task Dependencies</h3>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Dependency
        </button>
      </div>

      {/* Blocked By Tasks */}
      {blockedByTasks.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
            <ArrowRight className="h-4 w-4" />
            Blocked By
          </h4>
          <div className="space-y-2">
            {blockedByTasks.map((dependency) => {
              const blockingTask = getTaskById(dependency.dependsOn);
              if (!blockingTask) return null;

              return (
                <div
                  key={dependency.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(blockingTask.status)}
                    <div>
                      <p className="font-medium">{blockingTask.title}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(blockingTask.priority)}`}>
                          {blockingTask.priority}
                        </span>
                        {blockingTask.dueDate && (
                          <span>{new Date(blockingTask.dueDate).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingDependency(dependency)}
                      className="p-1 hover:bg-accent/60 rounded transition-colors"
                    >
                      <Link className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => onRemoveDependency(dependency.id)}
                      className="p-1 hover:bg-accent/60 rounded transition-colors"
                    >
                      <X className="h-4 w-4 text-destructive" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Blocking Tasks */}
      {blockingTasks.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
            <ArrowRight className="h-4 w-4 rotate-180" />
            Blocks
          </h4>
          <div className="space-y-2">
            {blockingTasks.map((dependency) => {
              const blockedTask = getTaskById(dependency.taskId);
              if (!blockedTask) return null;

              return (
                <div
                  key={dependency.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(blockedTask.status)}
                    <div>
                      <p className="font-medium">{blockedTask.title}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(blockedTask.priority)}`}>
                          {blockedTask.priority}
                        </span>
                        {blockedTask.dueDate && (
                          <span>{new Date(blockedTask.dueDate).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingDependency(dependency)}
                      className="p-1 hover:bg-accent/60 rounded transition-colors"
                    >
                      <Link className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => onRemoveDependency(dependency.id)}
                      className="p-1 hover:bg-accent/60 rounded transition-colors"
                    >
                      <X className="h-4 w-4 text-destructive" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Related Tasks */}
      {relatedTasks.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
            <Link className="h-4 w-4" />
            Related
          </h4>
          <div className="space-y-2">
            {relatedTasks.map((dependency) => {
              const relatedTask = getTaskById(dependency.dependsOn);
              if (!relatedTask) return null;

              return (
                <div
                  key={dependency.id}
                  className="flex items-center justify-between p-3 border rounded-lg bg-muted/30"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(relatedTask.status)}
                    <div>
                      <p className="font-medium">{relatedTask.title}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(relatedTask.priority)}`}>
                          {relatedTask.priority}
                        </span>
                        {relatedTask.dueDate && (
                          <span>{new Date(relatedTask.dueDate).toLocaleDateString()}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingDependency(dependency)}
                      className="p-1 hover:bg-accent/60 rounded transition-colors"
                    >
                      <Link className="h-4 w-4 text-muted-foreground" />
                    </button>
                    <button
                      onClick={() => onRemoveDependency(dependency.id)}
                      className="p-1 hover:bg-accent/60 rounded transition-colors"
                    >
                      <X className="h-4 w-4 text-destructive" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Empty State */}
      {taskDependencies.length === 0 && (
        <div className="text-center py-8">
          <Link className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No Dependencies</h3>
          <p className="text-muted-foreground mb-4">
            This task doesn't have any dependencies yet.
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Add Dependency
          </button>
        </div>
      )}

      {/* Add/Edit Dependency Modal */}
      <DependencyForm
        isOpen={showAddModal || !!editingDependency}
        onClose={() => {
          setShowAddModal(false);
          setEditingDependency(null);
        }}
        onSubmit={(dependencyData) => {
          if (editingDependency) {
            onUpdateDependency(editingDependency.id, dependencyData);
          } else {
            onAddDependency({
              taskId: task.id,
              ...dependencyData
            });
          }
          setShowAddModal(false);
          setEditingDependency(null);
        }}
        task={task}
        allTasks={allTasks}
        dependency={editingDependency}
        title={editingDependency ? "Edit Dependency" : "Add Dependency"}
      />
    </div>
  );
}

interface DependencyFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (dependency: Omit<TaskDependency, "id" | "taskId">) => void;
  task: Task;
  allTasks: Task[];
  dependency?: TaskDependency | null;
  title?: string;
}

function DependencyForm({
  isOpen,
  onClose,
  onSubmit,
  task,
  allTasks,
  dependency,
  title = "Add Dependency"
}: DependencyFormProps) {
  const [formData, setFormData] = useState({
    dependsOn: dependency?.dependsOn || "",
    type: dependency?.type || "blocked_by",
    description: dependency?.description || ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const availableTasks = allTasks.filter(t => t.id !== task.id);

  const typeOptions = [
    { value: "blocked_by", label: "Blocked By" },
    { value: "blocks", label: "Blocks" },
    { value: "related", label: "Related To" }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.dependsOn) {
      newErrors.dependsOn = "Please select a task";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <Form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <FormField
            label="Related Task"
            name="dependsOn"
            type="select"
            value={formData.dependsOn}
            onChange={(value) => setFormData(prev => ({ ...prev, dependsOn: value as string }))}
            options={availableTasks.map(t => ({ value: t.id, label: t.title }))}
            required
            error={errors.dependsOn}
            helpText="Select the task this dependency relates to"
          />

          <FormField
            label="Dependency Type"
            name="type"
            type="select"
            value={formData.type}
            onChange={(value) => setFormData(prev => ({ ...prev, type: value as string }))}
            options={typeOptions}
            helpText="Define the relationship between these tasks"
          />

          <FormField
            label="Description (Optional)"
            name="description"
            type="textarea"
            value={formData.description}
            onChange={(value) => setFormData(prev => ({ ...prev, description: value as string }))}
            placeholder="Add a description for this dependency..."
            rows={3}
            helpText="Explain why these tasks are related"
          />
        </div>

        <div className="flex justify-end gap-3 pt-6 border-t">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            {dependency ? "Update Dependency" : "Add Dependency"}
          </button>
        </div>
      </Form>
    </Modal>
  );
}
