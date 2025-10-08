"use client";

import { useState, useEffect } from "react";
import { 
  Calendar, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  MapPin, 
  Users,
  MoreHorizontal,
  Edit,
  Trash2
} from "lucide-react";
import { Modal } from "@/components/ui/modal";
import { Form, FormField, validators } from "@/components/ui/form";

interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  start: Date;
  end: Date;
  allDay: boolean;
  location?: string;
  attendees?: string[];
  category: 'work' | 'personal' | 'meeting' | 'deadline' | 'reminder';
  color: string;
  isRecurring: boolean;
  recurrencePattern?: string;
}

interface CalendarWidgetProps {
  onEventClick?: (event: CalendarEvent) => void;
  onDateClick?: (date: Date) => void;
  onEventCreate?: (event: Omit<CalendarEvent, 'id'>) => void;
  onEventUpdate?: (event: CalendarEvent) => void;
  onEventDelete?: (eventId: string) => void;
}

export function CalendarWidget({ 
  onEventClick, 
  onDateClick, 
  onEventCreate, 
  onEventUpdate, 
  onEventDelete 
}: CalendarWidgetProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');
  const [events, setEvents] = useState<CalendarEvent[]>([]);

  // Mock events data
  useEffect(() => {
    const mockEvents: CalendarEvent[] = [
      {
        id: '1',
        title: 'Team Meeting',
        description: 'Weekly team standup',
        start: new Date(2024, 0, 15, 10, 0),
        end: new Date(2024, 0, 15, 11, 0),
        allDay: false,
        location: 'Conference Room A',
        attendees: ['John Doe', 'Jane Smith'],
        category: 'meeting',
        color: 'blue',
        isRecurring: true,
        recurrencePattern: 'weekly'
      },
      {
        id: '2',
        title: 'Project Deadline',
        description: 'Submit final project deliverables',
        start: new Date(2024, 0, 20, 17, 0),
        end: new Date(2024, 0, 20, 17, 0),
        allDay: false,
        category: 'deadline',
        color: 'red',
        isRecurring: false
      },
      {
        id: '3',
        title: 'Personal Time',
        description: 'Gym session',
        start: new Date(2024, 0, 16, 18, 0),
        end: new Date(2024, 0, 16, 19, 30),
        allDay: false,
        location: 'Fitness Center',
        category: 'personal',
        color: 'green',
        isRecurring: false
      }
    ];
    setEvents(mockEvents);
  }, []);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.toDateString() === date.toDateString();
    });
  };

  const getCategoryColor = (category: CalendarEvent['category']) => {
    switch (category) {
      case 'work': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'personal': return 'bg-green-100 text-green-800 border-green-200';
      case 'meeting': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'deadline': return 'bg-red-100 text-red-800 border-red-200';
      case 'reminder': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    onDateClick?.(date);
  };

  const handleEventClick = (event: CalendarEvent) => {
    onEventClick?.(event);
  };

  const handleCreateEvent = (eventData: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      ...eventData,
      id: Date.now().toString()
    };
    setEvents(prev => [newEvent, ...prev]);
    onEventCreate?.(eventData);
    setShowEventForm(false);
  };

  const handleUpdateEvent = (eventData: CalendarEvent) => {
    setEvents(prev => prev.map(event => 
      event.id === eventData.id ? eventData : event
    ));
    onEventUpdate?.(eventData);
    setShowEventForm(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
    onEventDelete?.(eventId);
  };

  const days = getDaysInMonth(currentDate);
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex items-center gap-2">
          <div className="flex gap-1 bg-muted p-1 rounded-lg">
            <button
              onClick={() => setViewMode('month')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                viewMode === 'month' ? 'bg-background text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                viewMode === 'week' ? 'bg-background text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 text-sm rounded transition-colors ${
                viewMode === 'day' ? 'bg-background text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Day
            </button>
          </div>
          <button
            onClick={() => setShowEventForm(true)}
            className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateMonth('prev')}
          className="p-2 hover:bg-accent/60 rounded-lg transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => setCurrentDate(new Date())}
          className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors text-sm"
        >
          Today
        </button>
        <button
          onClick={() => navigateMonth('next')}
          className="p-2 hover:bg-accent/60 rounded-lg transition-colors"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-card border rounded-lg overflow-hidden">
        {/* Day Headers */}
        <div className="grid grid-cols-7 bg-muted/30">
          {dayNames.map(day => (
            <div key={day} className="p-3 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            if (!day) {
              return <div key={index} className="h-24 border-r border-b border-border"></div>;
            }

            const dayEvents = getEventsForDate(day);
            const isToday = day.toDateString() === new Date().toDateString();
            const isSelected = selectedDate?.toDateString() === day.toDateString();

            return (
              <div
                key={day.getTime()}
                className={`h-24 border-r border-b border-border p-1 cursor-pointer hover:bg-accent/30 transition-colors ${
                  isToday ? 'bg-primary/10' : ''
                } ${isSelected ? 'bg-accent/50' : ''}`}
                onClick={() => handleDateClick(day)}
              >
                <div className={`text-sm font-medium mb-1 ${isToday ? 'text-primary font-bold' : ''}`}>
                  {day.getDate()}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 2).map(event => (
                    <div
                      key={event.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEventClick(event);
                      }}
                      className={`text-xs p-1 rounded border truncate cursor-pointer hover:opacity-80 transition-opacity ${getCategoryColor(event.category)}`}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-muted-foreground">
                      +{dayEvents.length - 2} more
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Event Form Modal */}
      <EventForm
        isOpen={showEventForm}
        onClose={() => {
          setShowEventForm(false);
          setEditingEvent(null);
        }}
        onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}
        event={editingEvent}
        selectedDate={selectedDate}
        title={editingEvent ? "Edit Event" : "Create Event"}
      />
    </div>
  );
}

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: any) => void;
  event?: CalendarEvent | null;
  selectedDate?: Date | null;
  title?: string;
}

function EventForm({ isOpen, onClose, onSubmit, event, selectedDate, title = "Create Event" }: EventFormProps) {
  const [formData, setFormData] = useState({
    title: event?.title || "",
    description: event?.description || "",
    start: event?.start ? event.start.toISOString().slice(0, 16) : (selectedDate ? selectedDate.toISOString().slice(0, 16) : ""),
    end: event?.end ? event.end.toISOString().slice(0, 16) : (selectedDate ? new Date(selectedDate.getTime() + 60 * 60 * 1000).toISOString().slice(0, 16) : ""),
    allDay: event?.allDay || false,
    location: event?.location || "",
    attendees: event?.attendees?.join(", ") || "",
    category: event?.category || "work",
    isRecurring: event?.isRecurring || false,
    recurrencePattern: event?.recurrencePattern || "weekly"
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const categories = [
    { value: 'work', label: 'Work' },
    { value: 'personal', label: 'Personal' },
    { value: 'meeting', label: 'Meeting' },
    { value: 'deadline', label: 'Deadline' },
    { value: 'reminder', label: 'Reminder' }
  ];

  const recurrencePatterns = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' }
  ];

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.start) {
      newErrors.start = "Start time is required";
    }

    if (!formData.end) {
      newErrors.end = "End time is required";
    }

    if (formData.start && formData.end) {
      const start = new Date(formData.start);
      const end = new Date(formData.end);
      if (start >= end) {
        newErrors.end = "End time must be after start time";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      const eventData = {
        ...formData,
        start: new Date(formData.start),
        end: new Date(formData.end),
        attendees: formData.attendees ? formData.attendees.split(',').map(email => email.trim()) : [],
        ...(event && { id: event.id })
      };

      onSubmit(eventData);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <Form onSubmit={handleSubmit}>
        <div className="space-y-4">
          <FormField
            label="Event Title"
            name="title"
            type="text"
            value={formData.title}
            onChange={(value) => setFormData(prev => ({ ...prev, title: value as string }))}
            placeholder="Enter event title"
            required
            error={errors.title}
          />

          <FormField
            label="Description"
            name="description"
            type="textarea"
            value={formData.description}
            onChange={(value) => setFormData(prev => ({ ...prev, description: value as string }))}
            placeholder="Enter event description"
            rows={3}
          />

          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="Start Time"
              name="start"
              type="datetime-local"
              value={formData.start}
              onChange={(value) => setFormData(prev => ({ ...prev, start: value as string }))}
              required
              error={errors.start}
            />

            <FormField
              label="End Time"
              name="end"
              type="datetime-local"
              value={formData.end}
              onChange={(value) => setFormData(prev => ({ ...prev, end: value as string }))}
              required
              error={errors.end}
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="allDay"
              checked={formData.allDay}
              onChange={(e) => setFormData(prev => ({ ...prev, allDay: e.target.checked }))}
              className="rounded border-gray-300"
            />
            <label htmlFor="allDay" className="text-sm font-medium">
              All day event
            </label>
          </div>

          <FormField
            label="Location"
            name="location"
            type="text"
            value={formData.location}
            onChange={(value) => setFormData(prev => ({ ...prev, location: value as string }))}
            placeholder="Enter location"
          />

          <FormField
            label="Attendees"
            name="attendees"
            type="text"
            value={formData.attendees}
            onChange={(value) => setFormData(prev => ({ ...prev, attendees: value as string }))}
            placeholder="Enter email addresses separated by commas"
            helpText="Separate multiple email addresses with commas"
          />

          <FormField
            label="Category"
            name="category"
            type="select"
            value={formData.category}
            onChange={(value) => setFormData(prev => ({ ...prev, category: value as string }))}
            options={categories}
          />

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isRecurring"
              checked={formData.isRecurring}
              onChange={(e) => setFormData(prev => ({ ...prev, isRecurring: e.target.checked }))}
              className="rounded border-gray-300"
            />
            <label htmlFor="isRecurring" className="text-sm font-medium">
              Recurring event
            </label>
          </div>

          {formData.isRecurring && (
            <FormField
              label="Recurrence Pattern"
              name="recurrencePattern"
              type="select"
              value={formData.recurrencePattern}
              onChange={(value) => setFormData(prev => ({ ...prev, recurrencePattern: value as string }))}
              options={recurrencePatterns}
            />
          )}
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
            {event ? "Update Event" : "Create Event"}
          </button>
        </div>
      </Form>
    </Modal>
  );
}
