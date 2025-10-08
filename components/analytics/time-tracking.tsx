"use client";

import { useState, useEffect } from "react";
import { Play, Pause, Square, Clock, Calendar, BarChart3, Target, TrendingUp, Timer, Activity } from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Form, FormField, validators } from "@/components/ui/form";

interface TimeEntry {
  id: string;
  taskId?: string;
  projectId?: string;
  description: string;
  startTime: string;
  endTime?: string;
  duration: number; // in minutes
  category: string;
  tags: string[];
  isActive: boolean;
  createdAt: string;
}

interface TimeTrackingProps {
  currentTask?: {
    id: string;
    title: string;
    projectName?: string;
  };
  onTimeUpdate?: (entry: TimeEntry) => void;
}

export function TimeTracking({ currentTask, onTimeUpdate }: TimeTrackingProps) {
  const [isTracking, setIsTracking] = useState(false);
  const [currentEntry, setCurrentEntry] = useState<TimeEntry | null>(null);
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [showAddEntry, setShowAddEntry] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isTracking && currentEntry) {
      interval = setInterval(() => {
        const startTime = new Date(currentEntry.startTime).getTime();
        const now = Date.now();
        const elapsed = Math.floor((now - startTime) / 1000 / 60); // minutes
        setElapsedTime(elapsed);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTracking, currentEntry]);

  const startTracking = () => {
    const newEntry: TimeEntry = {
      id: Date.now().toString(),
      taskId: currentTask?.id,
      description: currentTask?.title || "Manual time entry",
      startTime: new Date().toISOString(),
      duration: 0,
      category: "work",
      tags: [],
      isActive: true,
      createdAt: new Date().toISOString()
    };

    setCurrentEntry(newEntry);
    setIsTracking(true);
  };

  const pauseTracking = () => {
    if (currentEntry) {
      const updatedEntry = {
        ...currentEntry,
        duration: elapsedTime,
        isActive: false
      };
      
      setTimeEntries(prev => [updatedEntry, ...prev]);
      setCurrentEntry(null);
      setIsTracking(false);
      setElapsedTime(0);
      
      onTimeUpdate?.(updatedEntry);
    }
  };

  const stopTracking = () => {
    if (currentEntry) {
      const endTime = new Date().toISOString();
      const updatedEntry = {
        ...currentEntry,
        endTime,
        duration: elapsedTime,
        isActive: false
      };
      
      setTimeEntries(prev => [updatedEntry, ...prev]);
      setCurrentEntry(null);
      setIsTracking(false);
      setElapsedTime(0);
      
      onTimeUpdate?.(updatedEntry);
    }
  };

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
  };

  const getTotalTimeToday = () => {
    const today = selectedDate;
    return timeEntries
      .filter(entry => entry.startTime.startsWith(today))
      .reduce((total, entry) => total + entry.duration, 0);
  };

  const getTotalTimeThisWeek = () => {
    const startOfWeek = new Date(selectedDate);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(endOfWeek.getDate() + 6);

    return timeEntries
      .filter(entry => {
        const entryDate = new Date(entry.startTime);
        return entryDate >= startOfWeek && entryDate <= endOfWeek;
      })
      .reduce((total, entry) => total + entry.duration, 0);
  };

  const getCategoryStats = () => {
    const stats: Record<string, number> = {};
    timeEntries.forEach(entry => {
      stats[entry.category] = (stats[entry.category] || 0) + entry.duration;
    });
    return stats;
  };

  return (
    <div className="space-y-6">
      {/* Current Timer */}
      <div className="bg-card border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Time Tracking</h3>
          <div className="flex items-center gap-2">
            <Timer className="h-5 w-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              {isTracking ? "Tracking" : "Stopped"}
            </span>
          </div>
        </div>

        {currentTask && (
          <div className="mb-4 p-3 bg-muted/30 rounded-lg">
            <p className="font-medium">{currentTask.title}</p>
            {currentTask.projectName && (
              <p className="text-sm text-muted-foreground">{currentTask.projectName}</p>
            )}
          </div>
        )}

        <div className="text-center mb-6">
          <div className="text-4xl font-mono font-bold mb-2">
            {formatTime(elapsedTime)}
          </div>
          <p className="text-sm text-muted-foreground">
            {isTracking ? "Elapsed time" : "Ready to start"}
          </p>
        </div>

        <div className="flex justify-center gap-3">
          {!isTracking ? (
            <button
              onClick={startTracking}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors flex items-center gap-2"
            >
              <Play className="h-4 w-4" />
              Start Tracking
            </button>
          ) : (
            <>
              <button
                onClick={pauseTracking}
                className="px-6 py-3 bg-muted hover:bg-muted/80 rounded-lg transition-colors flex items-center gap-2"
              >
                <Pause className="h-4 w-4" />
                Pause
              </button>
              <button
                onClick={stopTracking}
                className="px-6 py-3 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors flex items-center gap-2"
              >
                <Square className="h-4 w-4" />
                Stop
              </button>
            </>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">Today</span>
          </div>
          <div className="text-2xl font-bold">{formatTime(getTotalTimeToday())}</div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">This Week</span>
          </div>
          <div className="text-2xl font-bold">{formatTime(getTotalTimeThisWeek())}</div>
        </div>

        <div className="bg-card border rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="h-4 w-4 text-purple-500" />
            <span className="text-sm font-medium">Goal</span>
          </div>
          <div className="text-2xl font-bold">8:00</div>
          <div className="text-xs text-muted-foreground">Daily target</div>
        </div>
      </div>

      {/* Time Entries */}
      <div className="bg-card border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Entries</h3>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={() => setShowAddEntry(true)}
              className="px-3 py-1 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm"
            >
              Add Entry
            </button>
          </div>
        </div>

        <div className="space-y-2">
          {timeEntries
            .filter(entry => entry.startTime.startsWith(selectedDate))
            .map((entry) => (
              <div
                key={entry.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors"
              >
                <div className="flex-1">
                  <p className="font-medium">{entry.description}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{new Date(entry.startTime).toLocaleTimeString()}</span>
                    {entry.endTime && (
                      <span>- {new Date(entry.endTime).toLocaleTimeString()}</span>
                    )}
                    <span className="px-2 py-1 bg-muted rounded text-xs">{entry.category}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold">{formatTime(entry.duration)}</div>
                  <div className="text-xs text-muted-foreground">
                    {entry.tags.map(tag => `#${tag}`).join(' ')}
                  </div>
                </div>
              </div>
            ))}

          {timeEntries.filter(entry => entry.startTime.startsWith(selectedDate)).length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-12 w-12 mx-auto mb-4" />
              <p>No time entries for this date</p>
            </div>
          )}
        </div>
      </div>

      {/* Category Breakdown */}
      <div className="bg-card border rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Time by Category</h3>
        <div className="space-y-3">
          {Object.entries(getCategoryStats()).map(([category, duration]) => (
            <div key={category} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-primary"></div>
                <span className="capitalize">{category}</span>
              </div>
              <div className="font-mono font-bold">{formatTime(duration)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Time Entry Modal */}
      <TimeEntryForm
        isOpen={showAddEntry}
        onClose={() => setShowAddEntry(false)}
        onSubmit={(entry) => {
          setTimeEntries(prev => [entry, ...prev]);
          setShowAddEntry(false);
        }}
      />
    </div>
  );
}

interface TimeEntryFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (entry: TimeEntry) => void;
}

function TimeEntryForm({ isOpen, onClose, onSubmit }: TimeEntryFormProps) {
  const [formData, setFormData] = useState({
    description: "",
    startTime: new Date().toISOString().slice(0, 16),
    endTime: new Date().toISOString().slice(0, 16),
    category: "work",
    tags: [] as string[]
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [newTag, setNewTag] = useState("");

  const categories = ["work", "meeting", "break", "learning", "personal"];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    const start = new Date(formData.startTime);
    const end = new Date(formData.endTime);
    
    if (start >= end) {
      newErrors.endTime = "End time must be after start time";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const start = new Date(formData.startTime);
      const end = new Date(formData.endTime);
      const duration = Math.floor((end.getTime() - start.getTime()) / 1000 / 60);

      const entry: TimeEntry = {
        id: Date.now().toString(),
        description: formData.description,
        startTime: formData.startTime,
        endTime: formData.endTime,
        duration,
        category: formData.category,
        tags: formData.tags,
        isActive: false,
        createdAt: new Date().toISOString()
      };

      onSubmit(entry);
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
    <Modal isOpen={isOpen} onClose={onClose} title="Add Time Entry" size="md">
      <Form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <FormField
            label="Description"
            name="description"
            type="text"
            value={formData.description}
            onChange={(value) => setFormData(prev => ({ ...prev, description: value as string }))}
            placeholder="What did you work on?"
            required
            error={errors.description}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Start Time"
              name="startTime"
              type="datetime-local"
              value={formData.startTime}
              onChange={(value) => setFormData(prev => ({ ...prev, startTime: value as string }))}
              required
            />

            <FormField
              label="End Time"
              name="endTime"
              type="datetime-local"
              value={formData.endTime}
              onChange={(value) => setFormData(prev => ({ ...prev, endTime: value as string }))}
              required
              error={errors.endTime}
            />
          </div>

          <FormField
            label="Category"
            name="category"
            type="select"
            value={formData.category}
            onChange={(value) => setFormData(prev => ({ ...prev, category: value as string }))}
            options={categories.map(cat => ({ value: cat, label: cat.charAt(0).toUpperCase() + cat.slice(1) }))}
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
            Add Entry
          </button>
        </div>
      </Form>
    </Modal>
  );
}
