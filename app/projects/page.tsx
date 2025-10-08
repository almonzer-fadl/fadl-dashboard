import { Navigation } from "@/components/navigation";
import { KanbanBoard } from "@/components/projects/kanban-board";

export default function ProjectsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Projects</h1>
          <p className="text-muted-foreground">Manage your projects with our Trello-style kanban board</p>
        </div>

        <KanbanBoard />
      </main>

      <Navigation />
    </div>
  );
}
