"use client";

import { Navigation } from "@/components/navigation";
import { LocalFileManager } from "@/components/files/local-file-manager";

export default function FilesPage() {
  const handleFileSelect = (file: any) => {
    console.log('Selected file:', file);
    // Handle file selection - could open in preview, edit, etc.
  };

  const handleDirectorySelect = (path: string) => {
    console.log('Selected directory:', path);
    // Handle directory selection
  };

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Brain Server Files</h1>
          <p className="text-muted-foreground">Access and manage files from your local brain server directory</p>
        </div>

        <LocalFileManager 
          basePath="/brain-server"
          onFileSelect={handleFileSelect}
          onDirectorySelect={handleDirectorySelect}
        />
      </main>

      <Navigation />
    </div>
  );
}
