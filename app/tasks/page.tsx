import { Navigation } from "@/components/navigation";
import { TaskManager } from "@/components/tasks/task-manager";

export default function TasksPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Task Management</h1>
          <p className="text-muted-foreground">Organize and track your tasks with advanced filtering and prioritization</p>
        </div>

        <TaskManager />
      </main>

      <Navigation />
    </div>
  );
}
