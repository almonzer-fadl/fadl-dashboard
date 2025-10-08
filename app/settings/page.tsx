import { Navigation } from "@/components/navigation";
import { SettingsPanel } from "@/components/settings/settings-panel";

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Settings</h1>
          <p className="text-muted-foreground">Configure your dashboard preferences and system settings</p>
        </div>

        <SettingsPanel />
      </main>

      <Navigation />
    </div>
  );
}
