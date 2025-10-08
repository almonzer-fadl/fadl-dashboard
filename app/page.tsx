import Image from "next/image";
import { QuickStats } from "@/components/dashboard/quick-stats";
import { AppLinks } from "@/components/dashboard/app-links";
import { RecentTasks } from "@/components/dashboard/recent-tasks";
import { Navigation } from "@/components/navigation";
import { LaserFlow } from "@/components/laser-flow";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <LaserFlow />
      
      {/* Main Dashboard */}
      <main className="container mx-auto px-4 py-8">
        {/* Header with Logo */}
        <div className="flex items-center justify-center mb-8">
          <Image
            src="/logos/logoBlackTextNoBg.png"
            alt="Zenith Core Logo"
            width={200}
            height={60}
            className="dark:hidden"
            priority
          />
          <Image
            src="/logos/logoWhiteTextNoBg.png"
            alt="Zenith Core Logo"
            width={200}
            height={60}
            className="hidden dark:block"
            priority
          />
        </div>

        {/* Quick Stats */}
        <div className="mb-8">
          <QuickStats />
        </div>

        {/* Magic Bento Grid */}
        <div className="magic-bento">
          <div className="col-span-1 lg:col-span-2">
            <AppLinks />
          </div>
          <div className="col-span-1">
            <RecentTasks />
          </div>
        </div>

        {/* Additional Dashboard Sections */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-card border rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Recent Notes</h3>
            <div className="space-y-2">
              <div className="p-2 rounded hover:bg-accent/60 transition-colors">
                <p className="font-medium">Project Ideas</p>
                <p className="text-sm text-muted-foreground">2 hours ago</p>
              </div>
              <div className="p-2 rounded hover:bg-accent/60 transition-colors">
                <p className="font-medium">Meeting Notes</p>
                <p className="text-sm text-muted-foreground">Yesterday</p>
              </div>
            </div>
          </div>

          <div className="bg-card border rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full p-2 rounded hover:bg-accent/60 transition-colors text-left">
                + New Task
              </button>
              <button className="w-full p-2 rounded hover:bg-accent/60 transition-colors text-left">
                + New Note
              </button>
              <button className="w-full p-2 rounded hover:bg-accent/60 transition-colors text-left">
                + New Project
              </button>
            </div>
          </div>

          <div className="bg-card border rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">System Status</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">VPN Connection</span>
                <span className="text-green-500 text-sm">● Connected</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Database</span>
                <span className="text-green-500 text-sm">● Online</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Sync Status</span>
                <span className="text-green-500 text-sm">● Up to date</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom Navigation */}
      <Navigation />
    </div>
  );
}
