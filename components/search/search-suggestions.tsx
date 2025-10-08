"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Clock, Star, FileText, Folder, Tag, User, Calendar } from "lucide-react";

interface SearchSuggestion {
  id: string;
  type: 'recent' | 'saved' | 'suggestion' | 'file' | 'project' | 'task' | 'note';
  title: string;
  description?: string;
  path?: string;
  tags?: string[];
  icon: React.ReactNode;
  score: number;
}

interface SearchSuggestionsProps {
  query: string;
  onSelect: (suggestion: SearchSuggestion) => void;
  onClose: () => void;
  isOpen: boolean;
}

export function SearchSuggestions({ query, onSelect, onClose, isOpen }: SearchSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Mock data for suggestions
  const mockSuggestions: SearchSuggestion[] = [
    {
      id: '1',
      type: 'recent',
      title: 'Project Dashboard Design',
      description: 'Recent project',
      path: '/projects/dashboard-design',
      icon: <Folder className="h-4 w-4" />,
      score: 0.9
    },
    {
      id: '2',
      type: 'saved',
      title: 'Meeting Notes Template',
      description: 'Saved search',
      path: '/notes/templates/meeting',
      icon: <FileText className="h-4 w-4" />,
      score: 0.8
    },
    {
      id: '3',
      type: 'file',
      title: 'brain-server/documents/project-proposal.pdf',
      description: 'PDF document',
      path: '/brain-server/documents/project-proposal.pdf',
      icon: <FileText className="h-4 w-4" />,
      score: 0.7
    },
    {
      id: '4',
      type: 'task',
      title: 'Implement user authentication',
      description: 'High priority task',
      path: '/tasks/auth-implementation',
      icon: <Tag className="h-4 w-4" />,
      score: 0.6
    },
    {
      id: '5',
      type: 'note',
      title: 'API Documentation',
      description: 'Technical notes',
      path: '/notes/api-docs',
      icon: <FileText className="h-4 w-4" />,
      score: 0.5
    }
  ];

  // Filter suggestions based on query
  useEffect(() => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    setLoading(true);
    
    // Simulate API call delay
    const timer = setTimeout(() => {
      const filtered = mockSuggestions
        .filter(suggestion => 
          suggestion.title.toLowerCase().includes(query.toLowerCase()) ||
          suggestion.description?.toLowerCase().includes(query.toLowerCase()) ||
          suggestion.tags?.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
        )
        .sort((a, b) => b.score - a.score)
        .slice(0, 8);

      setSuggestions(filtered);
      setLoading(false);
    }, 150);

    return () => clearTimeout(timer);
  }, [query]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex(prev => Math.max(prev - 1, 0));
          break;
        case 'Enter':
          e.preventDefault();
          if (suggestions[selectedIndex]) {
            onSelect(suggestions[selectedIndex]);
          }
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, suggestions, selectedIndex, onSelect, onClose]);

  // Reset selected index when suggestions change
  useEffect(() => {
    setSelectedIndex(0);
  }, [suggestions]);

  // Scroll selected item into view
  useEffect(() => {
    if (containerRef.current) {
      const selectedElement = containerRef.current.children[selectedIndex] as HTMLElement;
      if (selectedElement) {
        selectedElement.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [selectedIndex]);

  if (!isOpen || (!loading && suggestions.length === 0)) {
    return null;
  }

  const getTypeLabel = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'recent': return 'Recent';
      case 'saved': return 'Saved';
      case 'suggestion': return 'Suggestion';
      case 'file': return 'File';
      case 'project': return 'Project';
      case 'task': return 'Task';
      case 'note': return 'Note';
      default: return 'Result';
    }
  };

  const getTypeColor = (type: SearchSuggestion['type']) => {
    switch (type) {
      case 'recent': return 'text-blue-500';
      case 'saved': return 'text-yellow-500';
      case 'suggestion': return 'text-green-500';
      case 'file': return 'text-gray-500';
      case 'project': return 'text-purple-500';
      case 'task': return 'text-orange-500';
      case 'note': return 'text-indigo-500';
      default: return 'text-gray-500';
    }
  };

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-card border rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
      <div ref={containerRef} className="py-2">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* Quick Actions */}
            <div className="px-4 py-2 border-b">
              <div className="text-xs font-medium text-muted-foreground mb-2">Quick Actions</div>
              <div className="flex gap-2">
                <button
                  onClick={() => onSelect({
                    id: 'search-all',
                    type: 'suggestion',
                    title: `Search for "${query}"`,
                    description: 'Search across all content',
                    icon: <Search className="h-4 w-4" />,
                    score: 1
                  })}
                  className="px-3 py-1 text-sm bg-muted hover:bg-muted/80 rounded transition-colors"
                >
                  Search All
                </button>
                <button
                  onClick={() => onSelect({
                    id: 'search-files',
                    type: 'suggestion',
                    title: `Search files for "${query}"`,
                    description: 'Search only in files',
                    icon: <FileText className="h-4 w-4" />,
                    score: 1
                  })}
                  className="px-3 py-1 text-sm bg-muted hover:bg-muted/80 rounded transition-colors"
                >
                  Files Only
                </button>
              </div>
            </div>

            {/* Suggestions */}
            {suggestions.length > 0 ? (
              <div className="py-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion.id}
                    onClick={() => onSelect(suggestion)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-accent/50 transition-colors ${
                      index === selectedIndex ? 'bg-accent/50' : ''
                    }`}
                  >
                    <div className={`${getTypeColor(suggestion.type)}`}>
                      {suggestion.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">{suggestion.title}</span>
                        <span className={`text-xs px-2 py-1 rounded ${getTypeColor(suggestion.type)} bg-muted`}>
                          {getTypeLabel(suggestion.type)}
                        </span>
                      </div>
                      {suggestion.description && (
                        <p className="text-sm text-muted-foreground truncate">
                          {suggestion.description}
                        </p>
                      )}
                      {suggestion.path && (
                        <p className="text-xs text-muted-foreground truncate">
                          {suggestion.path}
                        </p>
                      )}
                    </div>
                    {suggestion.type === 'recent' && (
                      <Clock className="h-4 w-4 text-muted-foreground" />
                    )}
                    {suggestion.type === 'saved' && (
                      <Star className="h-4 w-4 text-yellow-500" />
                    )}
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center">
                <Search className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No suggestions found</p>
              </div>
            )}

            {/* Search History */}
            <div className="px-4 py-2 border-t">
              <div className="text-xs font-medium text-muted-foreground mb-2">Recent Searches</div>
              <div className="space-y-1">
                {['dashboard design', 'meeting notes', 'project proposal'].map((term, index) => (
                  <button
                    key={index}
                    onClick={() => onSelect({
                      id: `history-${index}`,
                      type: 'recent',
                      title: term,
                      description: 'Recent search',
                      icon: <Clock className="h-4 w-4" />,
                      score: 0.5
                    })}
                    className="w-full flex items-center gap-2 px-2 py-1 text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 rounded transition-colors"
                  >
                    <Clock className="h-3 w-3" />
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
