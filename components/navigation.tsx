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
  Monitor
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "./theme-toggle";

export function Navigation() {
  const pathname = usePathname();
  
  const navItems = [
    { id: "home", href: "/", icon: Home, label: "Home" },
    { id: "projects", href: "/projects", icon: FolderOpen, label: "Projects" },
    { id: "tasks", href: "/tasks", icon: StickyNote, label: "Tasks" },
    { id: "notes", href: "/notes", icon: FileText, label: "Notes" },
    { id: "analytics", href: "/analytics", icon: BarChart3, label: "Analytics" },
    { id: "files", href: "/files", icon: Database, label: "Files" },
    { id: "search", href: "/search", icon: Search, label: "Search" },
    { id: "apps", href: "/apps", icon: Monitor, label: "Apps" },
    { id: "settings", href: "/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <div className="dock-nav">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;
        
        return (
          <Link
            key={item.id}
            href={item.href}
            className={`dock-item ${isActive ? 'active' : ''}`}
            aria-label={item.label}
          >
            <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
          </Link>
        );
      })}
      <div className="dock-item">
        <ThemeToggle />
      </div>
    </div>
  );
}
