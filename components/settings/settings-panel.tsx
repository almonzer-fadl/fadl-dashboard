"use client";

import { useState } from "react";
import { Settings, User, Shield, Database, Bell, Palette, Monitor } from "lucide-react";

export function SettingsPanel() {
  const [activeTab, setActiveTab] = useState("general");

  const tabs = [
    { id: "general", label: "General", icon: Settings },
    { id: "profile", label: "Profile", icon: User },
    { id: "security", label: "Security", icon: Shield },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "data", label: "Data & Sync", icon: Database },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      {/* Sidebar */}
      <div className="lg:col-span-1">
        <div className="bg-card border rounded-xl p-4">
          <h3 className="font-semibold mb-4">Settings</h3>
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeTab === tab.id
                      ? 'bg-primary text-primary-foreground'
                      : 'hover:bg-accent/60'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3">
        <div className="bg-card border rounded-xl p-6">
          {activeTab === "general" && <GeneralSettings />}
          {activeTab === "profile" && <ProfileSettings />}
          {activeTab === "security" && <SecuritySettings />}
          {activeTab === "notifications" && <NotificationSettings />}
          {activeTab === "appearance" && <AppearanceSettings />}
          {activeTab === "data" && <DataSettings />}
        </div>
      </div>
    </div>
  );
}

function GeneralSettings() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-6">General Settings</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Dashboard Name</label>
          <input
            type="text"
            defaultValue="Zenith Core Dashboard"
            className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Default View</label>
          <select className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="dashboard">Dashboard</option>
            <option value="projects">Projects</option>
            <option value="notes">Notes</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium">Auto-save</label>
            <p className="text-xs text-muted-foreground">Automatically save changes</p>
          </div>
          <input type="checkbox" defaultChecked className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

function ProfileSettings() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Profile Settings</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Display Name</label>
          <input
            type="text"
            defaultValue="Fadl"
            className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Email</label>
          <input
            type="email"
            defaultValue="fadl@example.com"
            className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Bio</label>
          <textarea
            rows={3}
            placeholder="Tell us about yourself..."
            className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>
    </div>
  );
}

function SecuritySettings() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Security Settings</h2>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium">Two-Factor Authentication</label>
            <p className="text-xs text-muted-foreground">Add an extra layer of security</p>
          </div>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            Enable
          </button>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium">VPN Integration</label>
            <p className="text-xs text-muted-foreground">Route all traffic through VPN</p>
          </div>
          <input type="checkbox" defaultChecked className="h-4 w-4" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Session Timeout</label>
          <select className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="15">15 minutes</option>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="240">4 hours</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function NotificationSettings() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Notification Settings</h2>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium">Email Notifications</label>
            <p className="text-xs text-muted-foreground">Receive notifications via email</p>
          </div>
          <input type="checkbox" defaultChecked className="h-4 w-4" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium">Push Notifications</label>
            <p className="text-xs text-muted-foreground">Browser push notifications</p>
          </div>
          <input type="checkbox" className="h-4 w-4" />
        </div>
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium">Task Reminders</label>
            <p className="text-xs text-muted-foreground">Remind me about due tasks</p>
          </div>
          <input type="checkbox" defaultChecked className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

function AppearanceSettings() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Appearance Settings</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Theme</label>
          <div className="grid grid-cols-3 gap-4">
            <button className="p-4 border rounded-lg hover:bg-accent/60 transition-colors">
              <Monitor className="h-6 w-6 mx-auto mb-2" />
              <span className="text-sm">System</span>
            </button>
            <button className="p-4 border rounded-lg hover:bg-accent/60 transition-colors">
              <div className="h-6 w-6 mx-auto mb-2 bg-white border rounded"></div>
              <span className="text-sm">Light</span>
            </button>
            <button className="p-4 border rounded-lg hover:bg-accent/60 transition-colors">
              <div className="h-6 w-6 mx-auto mb-2 bg-black border rounded"></div>
              <span className="text-sm">Dark</span>
            </button>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Font Size</label>
          <select className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="small">Small</option>
            <option value="medium" selected>Medium</option>
            <option value="large">Large</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium">Animations</label>
            <p className="text-xs text-muted-foreground">Enable smooth animations</p>
          </div>
          <input type="checkbox" defaultChecked className="h-4 w-4" />
        </div>
      </div>
    </div>
  );
}

function DataSettings() {
  return (
    <div>
      <h2 className="text-xl font-bold mb-6">Data & Sync Settings</h2>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium">Auto Sync</label>
            <p className="text-xs text-muted-foreground">Automatically sync data across devices</p>
          </div>
          <input type="checkbox" defaultChecked className="h-4 w-4" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Backup Frequency</label>
          <select className="w-full px-3 py-2 border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary">
            <option value="daily">Daily</option>
            <option value="weekly" selected>Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium">Offline Mode</label>
            <p className="text-xs text-muted-foreground">Enable offline access</p>
          </div>
          <input type="checkbox" defaultChecked className="h-4 w-4" />
        </div>
        <div className="pt-4 border-t">
          <button className="px-4 py-2 bg-destructive text-destructive-foreground rounded-lg hover:bg-destructive/90 transition-colors">
            Export All Data
          </button>
        </div>
      </div>
    </div>
  );
}
