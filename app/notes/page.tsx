import { Navigation } from "@/components/navigation";
import { KnowledgeBase } from "@/components/notes/knowledge-base";

export default function NotesPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Knowledge Base</h1>
          <p className="text-muted-foreground">Your personal Obsidian-style note-taking system</p>
        </div>

        <KnowledgeBase />
      </main>

      <Navigation />
    </div>
  );
}
