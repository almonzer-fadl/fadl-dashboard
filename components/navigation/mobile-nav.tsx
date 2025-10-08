"use client";

import { useState } from "react";
import {
  Home,
  FolderOpen,
  StickyNote,
  Search,
  Settings,
  BarChart3,
  FileText,
  Calendar,
  Mail,
  Music,
  Brain,
  Briefcase,
  Film,
  Github,
  Database,
  Users,
  Shield,
  Bell,
  Palette,
  Monitor,
  Menu,
  X,
  ChevronDown
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "../theme-toggle";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const pathname = usePathname();

  const navSections = [
    {
      id: "main",
      title: "Main",
      items: [
        { id: "home", href: "/", icon: Home, label: "Home" },
        { id: "projects", href: "/projects", icon: FolderOpen, label: "Projects" },
        { id: "tasks", href: "/tasks", icon: StickyNote, label: "Tasks" },
        { id: "notes", href: "/notes", icon: FileText, label: "Notes" },
        { id: "analytics", href: "/analytics", icon: BarChart3, label: "Analytics" },
      ]
    },
    {
      id: "content",
      title: "Content",
      items: [
        { id: "files", href: "/files", icon: Database, label: "Files" },
        { id: "search", href: "/search", icon: Search, label: "Search" },
        { id: "calendar", href: "/calendar", icon: Calendar, label: "Calendar" },
      ]
    },
    {
      id: "apps",
      title: "Apps",
      items: [
        { id: "apps", href: "/apps", icon: Monitor, label: "App Launcher" },
        { id: "music", href: "/music", icon: Music, label: "Music" },
        { id: "brain", href: "/brain", icon: Brain, label: "AI Tools" },
        { id: "portfolio", href: "/portfolio", icon: Briefcase, label: "Portfolio" },
        { id: "media", href: "/media", icon: Film, label: "Media" },
        { id: "github", href: "/github", icon: Github, label: "GitHub" },
        { id: "email", href: "/email", icon: Mail, label: "Email" },
      ]
    },
    {
      id: "system",
      title: "System",
      items: [
        { id: "settings", href: "/settings", icon: Settings, label: "Settings" },
        { id: "notifications", href: "/notifications", icon: Bell, label: "Notifications" },
        { id: "users", href: "/users", icon: Users, label: "Users" },
        { id: "security", href: "/security", icon: Shield, label: "Security" },
        { id: "themes", href: "/themes", icon: Palette, label: "Themes" },
      ]
    }
  ];

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId);
  };

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-card border rounded-lg shadow-lg"
      >
        <Menu className="h-6 w-6" />
      </button>

      {/* Mobile Navigation Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
          
          {/* Navigation Panel */}
          <div className="relative w-80 h-full bg-card border-r shadow-xl overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-accent/60 rounded-lg transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Navigation Sections */}
            <div className="p-4 space-y-2">
              {navSections.map((section) => (
                <div key={section.id}>
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full flex items-center justify-between p-3 text-left hover:bg-accent/60 rounded-lg transition-colors"
                  >
                    <span className="font-medium">{section.title}</span>
                    <ChevronDown 
                      className={`h-4 w-4 transition-transform ${
                        expandedSection === section.id ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  
                  {expandedSection === section.id && (
                    <div className="ml-4 space-y-1 mt-2">
                      {section.items.map((item) => {
                        const Icon = item.icon;
                        const active = isActive(item.href);
                        
                        return (
                          <Link
                            key={item.id}
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${
                              active 
                                ? 'bg-primary text-primary-foreground' 
                                : 'hover:bg-accent/60'
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                            <span>{item.label}</span>
                          </Link>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-card">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Theme</span>
                <ThemeToggle />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Bottom Navigation for Mobile
export function MobileBottomNav() {
  const pathname = usePathname();

  const bottomNavItems = [
    { id: "home", href: "/", icon: Home, label: "Home" },
    { id: "projects", href: "/projects", icon: FolderOpen, label: "Projects" },
    { id: "tasks", href: "/tasks", icon: StickyNote, label: "Tasks" },
    { id: "notes", href: "/notes", icon: FileText, label: "Notes" },
    { id: "analytics", href: "/analytics", icon: BarChart3, label: "Analytics" },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-card border-t">
      <div className="flex">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`flex-1 flex flex-col items-center gap-1 p-3 transition-colors ${
                active 
                  ? 'text-primary' 
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

function isActive(href: string) {
  // This would be implemented with usePathname in a real component
  return false;
}
