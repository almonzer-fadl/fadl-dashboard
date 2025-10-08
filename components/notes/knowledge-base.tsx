"use client";

import { useState } from "react";
import { Search, Plus, FileText, Tag, Calendar, Link, Star, MoreHorizontal, FileType } from "lucide-react";
import { NoteTemplates } from "./note-templates";

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isStarred: boolean;
  links: string[];
}

export function KnowledgeBase() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showTemplates, setShowTemplates] = useState(false);
  const [notes, setNotes] = useState<Note[]>([
    {
      id: "1",
      title: "Project Ideas",
      content: "## New Project Ideas\n\n- Build a personal dashboard\n- Create a note-taking app\n- Develop a habit tracker\n\n## Resources\n- [React Documentation](https://react.dev)\n- [Next.js Guide](https://nextjs.org/docs)",
      tags: ["ideas", "projects", "planning"],
      createdAt: "2024-01-10",
      updatedAt: "2024-01-15",
      isStarred: true,
      links: ["#project-dashboard", "#note-taking"]
    },
    {
      id: "2",
      title: "Meeting Notes - Q1 Planning",
      content: "## Q1 Planning Meeting\n\n### Key Points\n- Review Q4 performance\n- Set Q1 goals\n- Discuss new initiatives\n\n### Action Items\n- [ ] Prepare quarterly report\n- [ ] Schedule team reviews\n- [ ] Update project timelines",
      tags: ["meeting", "planning", "work"],
      createdAt: "2024-01-12",
      updatedAt: "2024-01-12",
      isStarred: false,
      links: ["#quarterly-planning", "#team-reviews"]
    },
    {
      id: "3",
      title: "Learning Resources",
      content: "## Programming Resources\n\n### Frontend\n- React patterns and best practices\n- TypeScript advanced features\n- CSS Grid and Flexbox\n\n### Backend\n- Node.js performance optimization\n- Database design principles\n- API security best practices",
      tags: ["learning", "programming", "resources"],
      createdAt: "2024-01-08",
      updatedAt: "2024-01-14",
      isStarred: true,
      links: ["#frontend", "#backend"]
    }
  ]);

  const allTags = Array.from(new Set(notes.flatMap(note => note.tags)));

  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || note.tags.includes(selectedTag);
    return matchesSearch && matchesTag;
  });

  const toggleStar = (noteId: string) => {
    setNotes(prev => prev.map(note => 
      note.id === noteId ? { ...note, isStarred: !note.isStarred } : note
    ));
  };

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "New Note",
      content: "Start writing...",
      tags: [],
      createdAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      isStarred: false,
      links: []
    };
    setNotes(prev => [newNote, ...prev]);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-card border rounded-xl p-4 sticky top-4">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="mb-4 space-y-2">
            <button
              onClick={createNewNote}
              className="w-full flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              New Note
            </button>
            <button
              onClick={() => setShowTemplates(true)}
              className="w-full flex items-center gap-2 px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
            >
              <FileType className="h-4 w-4" />
              Templates
            </button>
          </div>

          <div className="mb-4">
            <h3 className="font-semibold mb-2">Tags</h3>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedTag(null)}
                className={`w-full text-left px-2 py-1 rounded text-sm transition-colors ${
                  !selectedTag ? 'bg-accent' : 'hover:bg-accent/60'
                }`}
              >
                All Notes
              </button>
              {allTags.map(tag => (
                <button
                  key={tag}
                  onClick={() => setSelectedTag(tag)}
                  className={`w-full text-left px-2 py-1 rounded text-sm transition-colors ${
                    selectedTag === tag ? 'bg-accent' : 'hover:bg-accent/60'
                  }`}
                >
                  #{tag}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Quick Stats</h3>
            <div className="text-sm text-muted-foreground space-y-1">
              <div>Total Notes: {notes.length}</div>
              <div>Starred: {notes.filter(n => n.isStarred).length}</div>
              <div>Tags: {allTags.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3">
        <div className="space-y-4">
          {filteredNotes.map((note) => (
            <div
              key={note.id}
              className="bg-card border rounded-xl p-6 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-bold">{note.title}</h3>
                    {note.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(note.updatedAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      {note.content.length} chars
                    </div>
                  </div>
                </div>
                <button className="p-2 hover:bg-accent/60 rounded transition-colors">
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>

              <div className="prose prose-sm max-w-none mb-4">
                <div className="whitespace-pre-wrap text-muted-foreground">
                  {note.content.substring(0, 200)}
                  {note.content.length > 200 && "..."}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex flex-wrap gap-1">
                  {note.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded text-xs"
                    >
                      <Tag className="h-2 w-2" />
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  {note.links.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Link className="h-3 w-3" />
                      {note.links.length} links
                    </div>
                  )}
                  <button
                    onClick={() => toggleStar(note.id)}
                    className="p-1 hover:bg-accent/60 rounded transition-colors"
                  >
                    <Star className={`h-4 w-4 ${note.isStarred ? 'text-yellow-500 fill-current' : 'text-muted-foreground'}`} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredNotes.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No notes found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || selectedTag 
                  ? "Try adjusting your search or filter criteria"
                  : "Create your first note to get started"
                }
              </p>
              {!searchQuery && !selectedTag && (
                <button
                  onClick={createNewNote}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Create Note
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Templates Modal */}
      {showTemplates && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-card border rounded-xl shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Note Templates</h2>
              <button
                onClick={() => setShowTemplates(false)}
                className="p-2 hover:bg-accent/60 rounded-lg transition-colors"
              >
                ×
              </button>
            </div>
            <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
              <NoteTemplates
                onSelectTemplate={(template) => {
                  // In a real app, this would create a new note from the template
                  console.log("Selected template:", template);
                  setShowTemplates(false);
                }}
                onClose={() => setShowTemplates(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
