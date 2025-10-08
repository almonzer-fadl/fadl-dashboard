"use client";

import { useState } from "react";
import { Music, Brain, Briefcase, Film, Github, Mail, Calendar, FileText } from "lucide-react";

export function AppLinks() {
  const [searchQuery, setSearchQuery] = useState("");

  const apps = [
    { name: "Music", icon: Music, color: "bg-pink-500", href: "/music" },
    { name: "AI Tools", icon: Brain, color: "bg-purple-500", href: "/ai" },
    { name: "Portfolio", icon: Briefcase, color: "bg-blue-500", href: "/portfolio" },
    { name: "Media Tracker", icon: Film, color: "bg-red-500", href: "/media" },
    { name: "GitHub", icon: Github, color: "bg-gray-800", href: "/github" },
    { name: "Email", icon: Mail, color: "bg-green-500", href: "/email" },
    { name: "Calendar", icon: Calendar, color: "bg-indigo-500", href: "/calendar" },
    { name: "Documents", icon: FileText, color: "bg-yellow-500", href: "/docs" },
  ];

  const filteredApps = apps.filter(app =>
    app.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="bg-card border rounded-xl p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Quick Access</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search apps..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-4 gap-4">
        {filteredApps.map((app, index) => {
          const Icon = app.icon;
          return (
            <a
              key={index}
              href={app.href}
              className="flex flex-col items-center p-4 rounded-lg hover:bg-accent/60 transition-all duration-300 hover:scale-105 group"
            >
              <div className={`${app.color} p-3 rounded-xl mb-2 group-hover:scale-110 transition-transform duration-300`}>
                <Icon className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-medium text-center">{app.name}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}
