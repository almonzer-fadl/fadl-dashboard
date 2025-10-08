"use client";

import { useState } from "react";
import { FolderPlus, Plus, Edit, Trash2, Copy, Star, Clock, Users, Target, FileText } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Form, FormField, validators } from "@/components/ui/form";

interface ProjectTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  isStarred: boolean;
  template: {
    name: string;
    description: string;
    status: string;
    priority: string;
    dueDate?: string;
    tasks: Array<{
      title: string;
      description: string;
      status: string;
      priority: string;
      assignee?: string;
      tags: string[];
    }>;
    settings: {
      autoAssign: boolean;
      defaultPriority: string;
      defaultStatus: string;
      estimatedDuration: number; // in days
    };
  };
  createdAt: string;
  updatedAt: string;
}

interface ProjectTemplatesProps {
  onSelectTemplate: (template: ProjectTemplate) => void;
  onClose: () => void;
}

export function ProjectTemplates({ onSelectTemplate, onClose }: ProjectTemplatesProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<ProjectTemplate | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [templates, setTemplates] = useState<ProjectTemplate[]>([
    {
      id: "1",
      name: "Web Development Project",
      description: "Complete web development project template with frontend, backend, and deployment phases",
      category: "Development",
      tags: ["web", "development", "fullstack"],
      isStarred: true,
      template: {
        name: "{{project_name}}",
        description: "{{project_description}}",
        status: "active",
        priority: "high",
        dueDate: "{{due_date}}",
        tasks: [
          {
            title: "Project Setup",
            description: "Initialize project structure, repository, and development environment",
            status: "todo",
            priority: "high",
            assignee: "{{lead_developer}}",
            tags: ["setup", "infrastructure"]
          },
          {
            title: "UI/UX Design",
            description: "Create wireframes, mockups, and design system",
            status: "todo",
            priority: "high",
            assignee: "{{designer}}",
            tags: ["design", "ui", "ux"]
          },
          {
            title: "Frontend Development",
            description: "Implement user interface and client-side functionality",
            status: "todo",
            priority: "high",
            assignee: "{{frontend_developer}}",
            tags: ["frontend", "react", "ui"]
          },
          {
            title: "Backend Development",
            description: "Develop server-side logic, APIs, and database integration",
            status: "todo",
            priority: "high",
            assignee: "{{backend_developer}}",
            tags: ["backend", "api", "database"]
          },
          {
            title: "Testing",
            description: "Write and execute unit, integration, and end-to-end tests",
            status: "todo",
            priority: "medium",
            assignee: "{{qa_engineer}}",
            tags: ["testing", "qa", "automation"]
          },
          {
            title: "Deployment",
            description: "Deploy application to production environment",
            status: "todo",
            priority: "high",
            assignee: "{{devops_engineer}}",
            tags: ["deployment", "devops", "production"]
          }
        ],
        settings: {
          autoAssign: true,
          defaultPriority: "medium",
          defaultStatus: "todo",
          estimatedDuration: 30
        }
      },
      createdAt: "2024-01-10",
      updatedAt: "2024-01-15"
    },
    {
      id: "2",
      name: "Content Creation Workflow",
      description: "Template for content creation projects including research, writing, editing, and publishing",
      category: "Content",
      tags: ["content", "writing", "publishing"],
      isStarred: true,
      template: {
        name: "{{content_title}}",
        description: "{{content_description}}",
        status: "active",
        priority: "medium",
        dueDate: "{{publish_date}}",
        tasks: [
          {
            title: "Research & Planning",
            description: "Conduct research, create outline, and plan content structure",
            status: "todo",
            priority: "high",
            assignee: "{{researcher}}",
            tags: ["research", "planning", "outline"]
          },
          {
            title: "Content Creation",
            description: "Write first draft of content",
            status: "todo",
            priority: "high",
            assignee: "{{writer}}",
            tags: ["writing", "content", "draft"]
          },
          {
            title: "Review & Editing",
            description: "Review content for accuracy, clarity, and style",
            status: "todo",
            priority: "medium",
            assignee: "{{editor}}",
            tags: ["editing", "review", "quality"]
          },
          {
            title: "Visual Assets",
            description: "Create or source images, graphics, and multimedia content",
            status: "todo",
            priority: "medium",
            assignee: "{{designer}}",
            tags: ["visual", "graphics", "multimedia"]
          },
          {
            title: "Publishing",
            description: "Format and publish content to target platforms",
            status: "todo",
            priority: "high",
            assignee: "{{publisher}}",
            tags: ["publishing", "formatting", "distribution"]
          }
        ],
        settings: {
          autoAssign: false,
          defaultPriority: "medium",
          defaultStatus: "todo",
          estimatedDuration: 14
        }
      },
      createdAt: "2024-01-08",
      updatedAt: "2024-01-12"
    },
    {
      id: "3",
      name: "Product Launch Campaign",
      description: "Comprehensive product launch template covering marketing, sales, and support preparation",
      category: "Marketing",
      tags: ["marketing", "launch", "product"],
      isStarred: false,
      template: {
        name: "{{product_name}} Launch",
        description: "Launch campaign for {{product_name}}",
        status: "active",
        priority: "urgent",
        dueDate: "{{launch_date}}",
        tasks: [
          {
            title: "Market Research",
            description: "Analyze target market, competitors, and customer needs",
            status: "todo",
            priority: "high",
            assignee: "{{market_researcher}}",
            tags: ["research", "market", "analysis"]
          },
          {
            title: "Branding & Messaging",
            description: "Develop brand identity, key messages, and positioning",
            status: "todo",
            priority: "high",
            assignee: "{{brand_manager}}",
            tags: ["branding", "messaging", "positioning"]
          },
          {
            title: "Marketing Materials",
            description: "Create brochures, presentations, and promotional content",
            status: "todo",
            priority: "medium",
            assignee: "{{marketing_designer}}",
            tags: ["materials", "promotional", "content"]
          },
          {
            title: "Sales Training",
            description: "Train sales team on product features and selling points",
            status: "todo",
            priority: "high",
            assignee: "{{sales_manager}}",
            tags: ["training", "sales", "education"]
          },
          {
            title: "Support Preparation",
            description: "Set up customer support systems and documentation",
            status: "todo",
            priority: "medium",
            assignee: "{{support_manager}}",
            tags: ["support", "documentation", "systems"]
          },
          {
            title: "Launch Event",
            description: "Plan and execute product launch event",
            status: "todo",
            priority: "urgent",
            assignee: "{{event_manager}}",
            tags: ["event", "launch", "presentation"]
          }
        ],
        settings: {
          autoAssign: true,
          defaultPriority: "high",
          defaultStatus: "todo",
          estimatedDuration: 60
        }
      },
      createdAt: "2024-01-05",
      updatedAt: "2024-01-10"
    },
    {
      id: "4",
      name: "Research & Development",
      description: "Template for R&D projects including hypothesis, experimentation, and analysis phases",
      category: "Research",
      tags: ["research", "development", "experimentation"],
      isStarred: false,
      template: {
        name: "{{research_topic}} R&D",
        description: "Research and development project for {{research_topic}}",
        status: "active",
        priority: "medium",
        dueDate: "{{completion_date}}",
        tasks: [
          {
            title: "Literature Review",
            description: "Review existing research and documentation",
            status: "todo",
            priority: "high",
            assignee: "{{researcher}}",
            tags: ["literature", "review", "research"]
          },
          {
            title: "Hypothesis Formation",
            description: "Develop research hypotheses and objectives",
            status: "todo",
            priority: "high",
            assignee: "{{lead_researcher}}",
            tags: ["hypothesis", "objectives", "planning"]
          },
          {
            title: "Experimental Design",
            description: "Design experiments and testing procedures",
            status: "todo",
            priority: "high",
            assignee: "{{methodologist}}",
            tags: ["experiment", "design", "methodology"]
          },
          {
            title: "Data Collection",
            description: "Execute experiments and collect data",
            status: "todo",
            priority: "medium",
            assignee: "{{data_collector}}",
            tags: ["data", "collection", "experimentation"]
          },
          {
            title: "Data Analysis",
            description: "Analyze collected data and draw conclusions",
            status: "todo",
            priority: "high",
            assignee: "{{data_analyst}}",
            tags: ["analysis", "statistics", "conclusions"]
          },
          {
            title: "Report Writing",
            description: "Document findings and create research report",
            status: "todo",
            priority: "medium",
            assignee: "{{technical_writer}}",
            tags: ["report", "documentation", "findings"]
          }
        ],
        settings: {
          autoAssign: false,
          defaultPriority: "medium",
          defaultStatus: "todo",
          estimatedDuration: 90
        }
      },
      createdAt: "2024-01-03",
      updatedAt: "2024-01-08"
    }
  ]);

  const categories = ["All", "Development", "Content", "Marketing", "Research", "Design", "Business"];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !selectedCategory || selectedCategory === "All" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleCreateTemplate = (templateData: any) => {
    const newTemplate: ProjectTemplate = {
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

  const duplicateTemplate = (template: ProjectTemplate) => {
    const duplicatedTemplate: ProjectTemplate = {
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
        <h2 className="text-2xl font-bold">Project Templates</h2>
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
                <FolderPlus className="h-5 w-5 text-muted-foreground" />
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

            {/* Template Stats */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
              <div className="flex items-center gap-1">
                <FileText className="h-3 w-3" />
                {template.template.tasks.length} tasks
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {template.template.settings.estimatedDuration} days
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {template.template.settings.autoAssign ? 'Auto-assign' : 'Manual'}
              </div>
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
          <FolderPlus className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
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
  template?: ProjectTemplate | null;
  title?: string;
}

function TemplateForm({ isOpen, onClose, onSubmit, template, title = "Create Template" }: TemplateFormProps) {
  const [formData, setFormData] = useState({
    name: template?.name || "",
    description: template?.description || "",
    category: template?.category || "Development",
    tags: template?.tags || []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newTag, setNewTag] = useState("");

  const categories = ["Development", "Content", "Marketing", "Research", "Design", "Business"];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.description.trim()) newErrors.description = "Description is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      // For now, we'll create a basic template structure
      // In a real app, this would be more comprehensive
      const templateData = {
        ...formData,
        template: {
          name: "{{project_name}}",
          description: "{{project_description}}",
          status: "active",
          priority: "medium",
          tasks: [],
          settings: {
            autoAssign: false,
            defaultPriority: "medium",
            defaultStatus: "todo",
            estimatedDuration: 30
          }
        }
      };
      
      onSubmit(templateData);
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
            type="textarea"
            value={formData.description}
            onChange={(value) => setFormData(prev => ({ ...prev, description: value as string }))}
            placeholder="Describe what this template is for"
            rows={3}
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
