import { Navigation } from "@/components/navigation";
import { AppLauncher } from "@/components/apps/app-launcher";

export default function AppsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">App Launcher</h1>
          <p className="text-muted-foreground">Quick access to all your personal apps and tools</p>
        </div>

        <AppLauncher />
      </main>

      <Navigation />
    </div>
  );
}
