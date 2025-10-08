"use client";

import { useState } from "react";
import { 
  Search, 
  Plus, 
  Settings, 
  Music, 
  Brain, 
  Briefcase, 
  Film, 
  Github, 
  Mail, 
  Calendar, 
  FileText, 
  Database,
  Monitor,
  Smartphone,
  Globe,
  Code,
  Palette,
  BarChart3,
  Shield,
  Zap,
  Star,
  MoreHorizontal,
  Edit,
  Trash2,
  Grid,
  List
} from "lucide-react";

interface App {
  id: string;
  name: string;
  description: string;
  icon: any;
  color: string;
  url: string;
  category: string;
  isInstalled: boolean;
  isStarred: boolean;
  lastUsed?: string;
  version?: string;
}

export function AppLauncher() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const categories = [
    "All",
    "Development",
    "Design",
    "Productivity",
    "Media",
    "Communication",
    "Utilities",
    "Games"
  ];

  const [apps, setApps] = useState<App[]>([
    {
      id: "1",
      name: "Music Player",
      description: "Your personal music collection and streaming",
      icon: Music,
      color: "bg-pink-500",
      url: "/music",
      category: "Media",
      isInstalled: true,
      isStarred: true,
      lastUsed: "2 hours ago",
      version: "2.1.0"
    },
    {
      id: "2",
      name: "AI Assistant",
      description: "AI-powered tools and automation",
      icon: Brain,
      color: "bg-purple-500",
      url: "/ai",
      category: "Productivity",
      isInstalled: true,
      isStarred: true,
      lastUsed: "1 day ago",
      version: "1.5.2"
    },
    {
      id: "3",
      name: "Portfolio",
      description: "Your professional portfolio website",
      icon: Briefcase,
      color: "bg-blue-500",
      url: "/portfolio",
      category: "Development",
      isInstalled: true,
      isStarred: false,
      lastUsed: "3 days ago",
      version: "3.0.1"
    },
    {
      id: "4",
      name: "Media Tracker",
      description: "Track movies, TV shows, and books",
      icon: Film,
      color: "bg-red-500",
      url: "/media",
      category: "Media",
      isInstalled: true,
      isStarred: false,
      lastUsed: "1 week ago",
      version: "1.2.3"
    },
    {
      id: "5",
      name: "GitHub",
      description: "Code repository and collaboration",
      icon: Github,
      color: "bg-gray-800",
      url: "/github",
      category: "Development",
      isInstalled: true,
      isStarred: true,
      lastUsed: "5 minutes ago",
      version: "Latest"
    },
    {
      id: "6",
      name: "Email Client",
      description: "Manage all your email accounts",
      icon: Mail,
      color: "bg-green-500",
      url: "/email",
      category: "Communication",
      isInstalled: true,
      isStarred: false,
      lastUsed: "1 hour ago",
      version: "2.0.0"
    },
    {
      id: "7",
      name: "Calendar",
      description: "Schedule and event management",
      icon: Calendar,
      color: "bg-indigo-500",
      url: "/calendar",
      category: "Productivity",
      isInstalled: true,
      isStarred: true,
      lastUsed: "30 minutes ago",
      version: "1.8.5"
    },
    {
      id: "8",
      name: "Document Editor",
      description: "Rich text editor and document management",
      icon: FileText,
      color: "bg-yellow-500",
      url: "/docs",
      category: "Productivity",
      isInstalled: true,
      isStarred: false,
      lastUsed: "2 days ago",
      version: "4.2.1"
    },
    {
      id: "9",
      name: "Database Manager",
      description: "Manage and query your databases",
      icon: Database,
      color: "bg-cyan-500",
      url: "/database",
      category: "Development",
      isInstalled: false,
      isStarred: false,
      version: "1.0.0"
    },
    {
      id: "10",
      name: "System Monitor",
      description: "Monitor system performance and resources",
      icon: Monitor,
      color: "bg-orange-500",
      url: "/monitor",
      category: "Utilities",
      isInstalled: false,
      isStarred: false,
      version: "2.3.0"
    },
    {
      id: "11",
      name: "Mobile App",
      description: "Mobile version of the dashboard",
      icon: Smartphone,
      color: "bg-teal-500",
      url: "/mobile",
      category: "Development",
      isInstalled: false,
      isStarred: false,
      version: "1.0.0"
    },
    {
      id: "12",
      name: "Web Browser",
      description: "Built-in web browser",
      icon: Globe,
      color: "bg-emerald-500",
      url: "/browser",
      category: "Utilities",
      isInstalled: false,
      isStarred: false,
      version: "1.5.2"
    }
  ]);

  const filteredApps = apps.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === "All" || app.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleStar = (appId: string) => {
    setApps(prev => prev.map(app => 
      app.id === appId ? { ...app, isStarred: !app.isStarred } : app
    ));
  };

  const toggleInstall = (appId: string) => {
    setApps(prev => prev.map(app => 
      app.id === appId ? { ...app, isInstalled: !app.isInstalled } : app
    ));
  };

  const createCustomApp = () => {
    const newApp: App = {
      id: Date.now().toString(),
      name: "Custom App",
      description: "Click to edit description",
      icon: Code,
      color: "bg-gray-500",
      url: "/custom",
      category: "Utilities",
      isInstalled: false,
      isStarred: false,
      version: "1.0.0"
    };
    setApps(prev => [newApp, ...prev]);
  };

  return (
    <div className="space-y-6">
      {/* Header with Search and Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search apps..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
          >
            {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          </button>
          <button className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </button>
          <button
            onClick={createCustomApp}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add App
          </button>
        </div>
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category === "All" ? null : category)}
            className={`px-4 py-2 rounded-lg text-sm transition-colors ${
              (!selectedCategory && category === "All") || selectedCategory === category
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted hover:bg-muted/80'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Apps Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filteredApps.map((app) => {
            const Icon = app.icon;
            return (
              <div
                key={app.id}
                className="bg-card border rounded-xl p-4 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="flex flex-col items-center text-center">
                  <div className={`${app.color} p-3 rounded-xl mb-3 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="font-medium text-sm mb-1 truncate w-full" title={app.name}>
                    {app.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {app.description}
                  </p>
                  <div className="flex items-center gap-1 mb-2">
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      app.isInstalled 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
                    }`}>
                      {app.isInstalled ? 'Installed' : 'Available'}
                    </span>
                    {app.isStarred && <Star className="h-3 w-3 text-yellow-500 fill-current" />}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => toggleStar(app.id)}
                      className="p-1 hover:bg-accent/60 rounded transition-colors"
                    >
                      <Star className={`h-3 w-3 ${app.isStarred ? 'text-yellow-500 fill-current' : 'text-muted-foreground'}`} />
                    </button>
                    <button
                      onClick={() => toggleInstall(app.id)}
                      className={`px-2 py-1 text-xs rounded transition-colors ${
                        app.isInstalled
                          ? 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-300'
                          : 'bg-primary text-primary-foreground hover:bg-primary/90'
                      }`}
                    >
                      {app.isInstalled ? 'Uninstall' : 'Install'}
                    </button>
                    <button className="p-1 hover:bg-accent/60 rounded transition-colors">
                      <MoreHorizontal className="h-3 w-3 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-card border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">App</th>
                  <th className="text-left p-4 font-medium">Category</th>
                  <th className="text-left p-4 font-medium">Status</th>
                  <th className="text-left p-4 font-medium">Last Used</th>
                  <th className="text-left p-4 font-medium">Version</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApps.map((app) => {
                  const Icon = app.icon;
                  return (
                    <tr key={app.id} className="hover:bg-accent/60 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className={`${app.color} p-2 rounded-lg`}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <p className="font-medium">{app.name}</p>
                            <p className="text-sm text-muted-foreground">{app.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {app.category}
                      </td>
                      <td className="p-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          app.isInstalled 
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                            : 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300'
                        }`}>
                          {app.isInstalled ? 'Installed' : 'Available'}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {app.lastUsed || 'Never'}
                      </td>
                      <td className="p-4 text-sm text-muted-foreground">
                        {app.version}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => toggleStar(app.id)}
                            className="p-1 hover:bg-accent/60 rounded transition-colors"
                          >
                            <Star className={`h-4 w-4 ${app.isStarred ? 'text-yellow-500 fill-current' : 'text-muted-foreground'}`} />
                          </button>
                          <button
                            onClick={() => toggleInstall(app.id)}
                            className={`px-2 py-1 text-xs rounded transition-colors ${
                              app.isInstalled
                                ? 'bg-red-100 text-red-800 hover:bg-red-200 dark:bg-red-900/20 dark:text-red-300'
                                : 'bg-primary text-primary-foreground hover:bg-primary/90'
                            }`}
                          >
                            {app.isInstalled ? 'Uninstall' : 'Install'}
                          </button>
                          <button className="p-1 hover:bg-accent/60 rounded transition-colors">
                            <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredApps.length === 0 && (
        <div className="text-center py-12">
          <Monitor className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No apps found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery || selectedCategory
              ? "Try adjusting your search or filter criteria"
              : "Add your first app to get started"
            }
          </p>
          <button
            onClick={createCustomApp}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add App
          </button>
        </div>
      )}
    </div>
  );
}
