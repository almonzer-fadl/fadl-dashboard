"use client";

import { useState } from "react";
import { FileText, Plus, Edit, Trash2, Copy, Star } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Form, FormField, validators } from "@/components/ui/form";

interface NoteTemplate {
  id: string;
  name: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  isStarred: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NoteTemplatesProps {
  onSelectTemplate: (template: NoteTemplate) => void;
  onClose: () => void;
}

export function NoteTemplates({ onSelectTemplate, onClose }: NoteTemplatesProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<NoteTemplate | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [templates, setTemplates] = useState<NoteTemplate[]>([
    {
      id: "1",
      name: "Meeting Notes",
      description: "Template for recording meeting discussions and action items",
      content: `# Meeting Notes

**Date:** {{date}}
**Attendees:** {{attendees}}
**Location:** {{location}}

## Agenda
- {{agenda_item_1}}
- {{agenda_item_2}}
- {{agenda_item_3}}

## Discussion
{{discussion_notes}}

## Action Items
- [ ] {{action_item_1}} - {{assignee_1}} - {{due_date_1}}
- [ ] {{action_item_2}} - {{assignee_2}} - {{due_date_2}}

## Next Steps
{{next_steps}}`,
      category: "Work",
      tags: ["meeting", "work", "notes"],
      isStarred: true,
      createdAt: "2024-01-10",
      updatedAt: "2024-01-15"
    },
    {
      id: "2",
      name: "Daily Journal",
      description: "Template for daily reflection and planning",
      content: `# Daily Journal - {{date}}

## Today's Goals
- [ ] {{goal_1}}
- [ ] {{goal_2}}
- [ ] {{goal_3}}

## What I Accomplished
{{accomplishments}}

## Challenges Faced
{{challenges}}

## Lessons Learned
{{lessons}}

## Tomorrow's Focus
{{tomorrow_focus}}

## Gratitude
{{gratitude}}`,
      category: "Personal",
      tags: ["journal", "daily", "reflection"],
      isStarred: true,
      createdAt: "2024-01-08",
      updatedAt: "2024-01-12"
    },
    {
      id: "3",
      name: "Project Planning",
      description: "Template for planning new projects",
      content: `# Project: {{project_name}}

## Overview
{{project_description}}

## Goals
- {{goal_1}}
- {{goal_2}}
- {{goal_3}}

## Timeline
- **Start Date:** {{start_date}}
- **End Date:** {{end_date}}
- **Milestones:**
  - {{milestone_1}} - {{milestone_1_date}}
  - {{milestone_2}} - {{milestone_2_date}}

## Resources Needed
- {{resource_1}}
- {{resource_2}}
- {{resource_3}}

## Risks & Mitigation
- **Risk:** {{risk_1}} | **Mitigation:** {{mitigation_1}}
- **Risk:** {{risk_2}} | **Mitigation:** {{mitigation_2}}

## Success Metrics
- {{metric_1}}
- {{metric_2}}`,
      category: "Planning",
      tags: ["project", "planning", "management"],
      isStarred: false,
      createdAt: "2024-01-05",
      updatedAt: "2024-01-10"
    },
    {
      id: "4",
      name: "Code Review",
      description: "Template for code review documentation",
      content: `# Code Review: {{feature_name}}

## Overview
{{feature_description}}

## Changes Made
{{changes_summary}}

## Files Modified
- {{file_1}}
- {{file_2}}
- {{file_3}}

## Testing
- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed

## Review Checklist
- [ ] Code follows style guidelines
- [ ] No hardcoded values
- [ ] Error handling implemented
- [ ] Documentation updated
- [ ] Performance considerations addressed

## Comments
{{reviewer_comments}}

## Action Items
- [ ] {{action_item_1}}
- [ ] {{action_item_2}}`,
      category: "Development",
      tags: ["code", "review", "development"],
      isStarred: false,
      createdAt: "2024-01-03",
      updatedAt: "2024-01-08"
    }
  ]);

  const categories = ["All", "Work", "Personal", "Planning", "Development"];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !selectedCategory || selectedCategory === "All" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateTemplate = (templateData: any) => {
    const newTemplate: NoteTemplate = {
      id: Date.now().toString(),
      ...templateData,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setTemplates(prev => [newTemplate, ...prev]);
    setShowCreateForm(false);
  };

  const handleUpdateTemplate = (templateData: any) => {
    setTemplates(prev => prev.map(template => 
      template.id === editingTemplate?.id 
        ? { ...template, ...templateData, updatedAt: new Date().toISOString().split('T')[0] }
        : template
    ));
    setShowCreateForm(false);
    setEditingTemplate(null);
  };

  const handleDeleteTemplate = (templateId: string) => {
    setTemplates(prev => prev.filter(template => template.id !== templateId));
  };

  const toggleStar = (templateId: string) => {
    setTemplates(prev => prev.map(template => 
      template.id === templateId ? { ...template, isStarred: !template.isStarred } : template
    ));
  };

  const duplicateTemplate = (template: NoteTemplate) => {
    const duplicatedTemplate: NoteTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0]
    };
    setTemplates(prev => [duplicatedTemplate, ...prev]);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Note Templates</h2>
        <button
          onClick={() => setShowCreateForm(true)}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Template
        </button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <input
            type="text"
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category === "All" ? null : category)}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                (!selectedCategory && category === "All") || selectedCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <div
            key={template.id}
            className="bg-card border rounded-xl p-4 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-muted-foreground" />
                <h3 className="font-semibold">{template.name}</h3>
                {template.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => toggleStar(template.id)}
                  className="p-1 hover:bg-accent/60 rounded transition-colors"
                >
                  <Star className={`h-4 w-4 ${template.isStarred ? 'text-yellow-500 fill-current' : 'text-muted-foreground'}`} />
                </button>
                <button
                  onClick={() => duplicateTemplate(template)}
                  className="p-1 hover:bg-accent/60 rounded transition-colors"
                >
                  <Copy className="h-4 w-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => {
                    setEditingTemplate(template);
                    setShowCreateForm(true);
                  }}
                  className="p-1 hover:bg-accent/60 rounded transition-colors"
                >
                  <Edit className="h-4 w-4 text-muted-foreground" />
                </button>
                <button
                  onClick={() => handleDeleteTemplate(template.id)}
                  className="p-1 hover:bg-accent/60 rounded transition-colors"
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </button>
              </div>
            </div>

            <p className="text-sm text-muted-foreground mb-3">{template.description}</p>
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs px-2 py-1 bg-muted rounded">{template.category}</span>
              <span className="text-xs text-muted-foreground">
                {new Date(template.updatedAt).toLocaleDateString()}
              </span>
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {template.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 bg-muted rounded"
                >
                  {tag}
                </span>
              ))}
              {template.tags.length > 3 && (
                <span className="text-xs px-2 py-1 bg-muted rounded">
                  +{template.tags.length - 3}
                </span>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => onSelectTemplate(template)}
                className="flex-1 px-3 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
              >
                Use Template
              </button>
              <button
                onClick={() => onSelectTemplate(template)}
                className="px-3 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-sm"
              >
                Preview
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12">
          <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No templates found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || selectedCategory
              ? "Try adjusting your search or filter criteria"
              : "Create your first template to get started"
            }
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Create Template
          </button>
        </div>
      )}

      {/* Template Form Modal */}
      <TemplateForm
        isOpen={showCreateForm}
        onClose={() => {
          setShowCreateForm(false);
          setEditingTemplate(null);
        }}
        onSubmit={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}
        template={editingTemplate}
        title={editingTemplate ? "Edit Template" : "Create Template"}
      />
    </div>
  );
}

interface TemplateFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (template: any) => void;
  template?: NoteTemplate | null;
  title?: string;
}

function TemplateForm({ isOpen, onClose, onSubmit, template, title = "Create Template" }: TemplateFormProps) {
  const [formData, setFormData] = useState({
    name: template?.name || "",
    description: template?.description || "",
    content: template?.content || "",
    category: template?.category || "Personal",
    tags: template?.tags || []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newTag, setNewTag] = useState("");

  const categories = ["Work", "Personal", "Planning", "Development"];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";
    if (!formData.content.trim()) newErrors.content = "Content is required";

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

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="lg">
      <Form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <FormField
            label="Template Name"
            name="name"
            type="text"
            value={formData.name}
            onChange={(value) => setFormData(prev => ({ ...prev, name: value as string }))}
            placeholder="Enter template name"
            required
            error={errors.name}
          />

          <FormField
            label="Description"
            name="description"
            type="text"
            value={formData.description}
            onChange={(value) => setFormData(prev => ({ ...prev, description: value as string }))}
            placeholder="Describe what this template is for"
            required
            error={errors.description}
          />

          <FormField
            label="Category"
            name="category"
            type="select"
            value={formData.category}
            onChange={(value) => setFormData(prev => ({ ...prev, category: value as string }))}
            options={categories.map(cat => ({ value: cat, label: cat }))}
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Tags
            </label>
            <div className="space-y-2">
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
                  Add
                </button>
              </div>
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

          <FormField
            label="Template Content"
            name="content"
            type="textarea"
            value={formData.content}
            onChange={(value) => setFormData(prev => ({ ...prev, content: value as string }))}
            placeholder="Enter the template content. Use {{variable}} for placeholders."
            rows={10}
            required
            error={errors.content}
            helpText="Use {{variable_name}} to create placeholders that can be filled in when using the template"
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
            {template ? "Update Template" : "Create Template"}
          </button>
        </div>
      </Form>
    </Modal>
  );
}
