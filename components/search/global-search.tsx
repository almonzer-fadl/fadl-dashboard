"use client";

import { useState } from "react";
import { Search, FileText, FolderOpen, Clock, Tag, Star } from "lucide-react";
import { SearchSuggestions } from "./search-suggestions";

interface SearchResult {
  id: string;
  title: string;
  content: string;
  type: "note" | "project" | "task" | "file";
  tags: string[];
  createdAt: string;
  isStarred: boolean;
}

export function GlobalSearch() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Mock search results
  const mockResults: SearchResult[] = [
    {
      id: "1",
      title: "Project Ideas",
      content: "New project ideas for the dashboard application...",
      type: "note",
      tags: ["ideas", "projects"],
      createdAt: "2024-01-15",
      isStarred: true
    },
    {
      id: "2",
      title: "Dashboard Design",
      content: "Design specifications for the main dashboard...",
      type: "project",
      tags: ["design", "ui"],
      createdAt: "2024-01-14",
      isStarred: false
    },
    {
      id: "3",
      title: "Implement Authentication",
      content: "Set up JWT authentication system...",
      type: "task",
      tags: ["backend", "auth"],
      createdAt: "2024-01-13",
      isStarred: false
    },
    {
      id: "4",
      title: "Meeting Notes",
      content: "Notes from the quarterly planning meeting...",
      type: "note",
      tags: ["meeting", "planning"],
      createdAt: "2024-01-12",
      isStarred: false
    }
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      const filtered = mockResults.filter(result => 
        result.title.toLowerCase().includes(query.toLowerCase()) ||
        result.content.toLowerCase().includes(query.toLowerCase()) ||
        result.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))
      );
      setResults(filtered);
    } else {
      setResults([]);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "note":
        return <FileText className="h-4 w-4" />;
      case "project":
        return <FolderOpen className="h-4 w-4" />;
      case "task":
        return <Clock className="h-4 w-4" />;
      case "file":
        return <FileText className="h-4 w-4" />;
      default:
        return <FileText className="h-4 w-4" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "note":
        return "text-blue-500";
      case "project":
        return "text-green-500";
      case "task":
        return "text-orange-500";
      case "file":
        return "text-purple-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Search Input */}
      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search across all content..."
            value={searchQuery}
            onChange={(e) => {
              handleSearch(e.target.value);
              setShowSuggestions(e.target.value.length > 0);
            }}
            onFocus={() => setShowSuggestions(searchQuery.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full pl-12 pr-4 py-4 text-lg border rounded-xl bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          
          {/* Search Suggestions */}
          <SearchSuggestions
            query={searchQuery}
            onSelect={(suggestion) => {
              setSearchQuery(suggestion.title);
              setShowSuggestions(false);
              handleSearch(suggestion.title);
            }}
            onClose={() => setShowSuggestions(false)}
            isOpen={showSuggestions}
          />
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedType(null)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              !selectedType ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            All
          </button>
          <button
            onClick={() => setSelectedType("note")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedType === "note" ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            Notes
          </button>
          <button
            onClick={() => setSelectedType("project")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedType === "project" ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setSelectedType("task")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              selectedType === "task" ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80'
            }`}
          >
            Tasks
          </button>
        </div>
      </div>

      {/* Search Results */}
      <div className="space-y-4">
        {results
          .filter(result => !selectedType || result.type === selectedType)
          .map((result) => (
            <div
              key={result.id}
              className="bg-card border rounded-xl p-6 hover:shadow-lg transition-all duration-300 cursor-pointer"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`${getTypeColor(result.type)}`}>
                    {getTypeIcon(result.type)}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold">{result.title}</h3>
                    <p className="text-sm text-muted-foreground capitalize">
                      {result.type} • {new Date(result.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {result.isStarred && (
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                )}
              </div>

              <p className="text-muted-foreground mb-4 line-clamp-2">
                {result.content}
              </p>

              <div className="flex flex-wrap gap-1">
                {result.tags.map((tag, index) => (
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
          ))}

        {searchQuery && results.length === 0 && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search terms or check your spelling
            </p>
          </div>
        )}

        {!searchQuery && (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Start searching</h3>
            <p className="text-muted-foreground">
              Enter a search term to find content across your dashboard
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
