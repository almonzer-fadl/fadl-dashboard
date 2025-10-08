"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Form, FormField, validators } from "@/components/ui/form";
import { Calendar, Tag, FileText, Users } from "lucide-react";

interface Project {
  id?: string;
  name: string;
  description: string;
  status: string;
  priority: string;
  dueDate: string;
  tags: string[];
  assignees: string[];
}

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (project: Project) => void;
  project?: Project;
  title?: string;
}

export function ProjectForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  project,
  title = "Create Project"
}: ProjectFormProps) {
  const [formData, setFormData] = useState<Project>({
    name: project?.name || "",
    description: project?.description || "",
    status: project?.status || "todo",
    priority: project?.priority || "medium",
    dueDate: project?.dueDate || "",
    tags: project?.tags || [],
    assignees: project?.assignees || []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newTag, setNewTag] = useState("");

  const statusOptions = [
    { value: "todo", label: "To Do" },
    { value: "in-progress", label: "In Progress" },
    { value: "review", label: "Review" },
    { value: "done", label: "Done" },
    { value: "cancelled", label: "Cancelled" }
  ];

  const priorityOptions = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" }
  ];

  const assigneeOptions = [
    { value: "you", label: "You" },
    { value: "team", label: "Team" },
    { value: "external", label: "External" }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Validate name
    const nameError = validators.required(formData.name);
    if (nameError) newErrors.name = nameError;

    // Validate description
    const descriptionError = validators.minLength(10)(formData.description);
    if (descriptionError) newErrors.description = descriptionError;

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

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const addAssignee = (assignee: string) => {
    if (!formData.assignees.includes(assignee)) {
      setFormData(prev => ({
        ...prev,
        assignees: [...prev.assignees, assignee]
      }));
    }
  };

  const removeAssignee = (assigneeToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      assignees: prev.assignees.filter(assignee => assignee !== assigneeToRemove)
    }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <Form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Project Name */}
          <div className="md:col-span-2">
            <FormField
              label="Project Name"
              name="name"
              type="text"
              value={formData.name}
              onChange={(value) => setFormData(prev => ({ ...prev, name: value as string }))}
              placeholder="Enter project name"
              required
              error={errors.name}
              helpText="Choose a descriptive name for your project"
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <FormField
              label="Description"
              name="description"
              type="textarea"
              value={formData.description}
              onChange={(value) => setFormData(prev => ({ ...prev, description: value as string }))}
              placeholder="Describe what this project is about..."
              rows={4}
              error={errors.description}
              helpText="Provide a detailed description of the project goals and scope"
            />
          </div>

          {/* Status */}
          <FormField
            label="Status"
            name="status"
            type="select"
            value={formData.status}
            onChange={(value) => setFormData(prev => ({ ...prev, status: value as string }))}
            options={statusOptions}
            helpText="Current status of the project"
          />

          {/* Priority */}
          <FormField
            label="Priority"
            name="priority"
            type="select"
            value={formData.priority}
            onChange={(value) => setFormData(prev => ({ ...prev, priority: value as string }))}
            options={priorityOptions}
            helpText="Priority level for this project"
          />

          {/* Due Date */}
          <FormField
            label="Due Date"
            name="dueDate"
            type="date"
            value={formData.dueDate}
            onChange={(value) => setFormData(prev => ({ ...prev, dueDate: value as string }))}
            helpText="When should this project be completed?"
          />

          {/* Tags */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">
              Tags
            </label>
            <div className="space-y-3">
              {/* Add new tag */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag..."
                  className="flex-1 px-3 py-2 border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Tag className="h-4 w-4" />
                </button>
              </div>
              
              {/* Display tags */}
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded text-sm"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="hover:text-destructive transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Assignees */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">
              Assignees
            </label>
            <div className="space-y-3">
              {/* Add assignee */}
              <div className="flex gap-2">
                <select
                  value=""
                  onChange={(e) => {
                    if (e.target.value) {
                      addAssignee(e.target.value);
                      e.target.value = "";
                    }
                  }}
                  className="flex-1 px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select assignee...</option>
                  {assigneeOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Users className="h-4 w-4" />
                </button>
              </div>
              
              {/* Display assignees */}
              {formData.assignees.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.assignees.map((assignee, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded text-sm"
                    >
                      {assigneeOptions.find(opt => opt.value === assignee)?.label || assignee}
                      <button
                        type="button"
                        onClick={() => removeAssignee(assignee)}
                        className="hover:text-destructive transition-colors"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Form Actions */}
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
            {project ? "Update Project" : "Create Project"}
          </button>
        </div>
      </Form>
    </Modal>
  );
}
