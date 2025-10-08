"use client";

import { useState } from "react";
import { 
  Upload, 
  Search, 
  Filter, 
  Grid, 
  List, 
  Folder, 
  File, 
  Image, 
  FileText, 
  Music, 
  Video, 
  Archive,
  Download,
  Share,
  Trash2,
  Star,
  MoreHorizontal,
  Plus,
  FolderPlus
} from "lucide-react";
import { FileUpload } from "./file-upload";

interface FileItem {
  id: string;
  name: string;
  type: "file" | "folder";
  mimeType?: string;
  size: number;
  modifiedAt: string;
  isStarred: boolean;
  path: string;
  tags: string[];
}

export function FileManager() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
  const [currentPath, setCurrentPath] = useState("/");
  const [showUpload, setShowUpload] = useState(false);

  const [files, setFiles] = useState<FileItem[]>([
    {
      id: "1",
      name: "Project Documents",
      type: "folder",
      size: 0,
      modifiedAt: "2024-01-15",
      isStarred: true,
      path: "/Project Documents",
      tags: ["work", "projects"]
    },
    {
      id: "2",
      name: "dashboard-design.fig",
      type: "file",
      mimeType: "application/figma",
      size: 2048576,
      modifiedAt: "2024-01-14",
      isStarred: false,
      path: "/dashboard-design.fig",
      tags: ["design", "figma"]
    },
    {
      id: "3",
      name: "meeting-notes.md",
      type: "file",
      mimeType: "text/markdown",
      size: 15360,
      modifiedAt: "2024-01-13",
      isStarred: true,
      path: "/meeting-notes.md",
      tags: ["notes", "meetings"]
    },
    {
      id: "4",
      name: "screenshot.png",
      type: "file",
      mimeType: "image/png",
      size: 512000,
      modifiedAt: "2024-01-12",
      isStarred: false,
      path: "/screenshot.png",
      tags: ["images", "screenshots"]
    },
    {
      id: "5",
      name: "presentation.pdf",
      type: "file",
      mimeType: "application/pdf",
      size: 3145728,
      modifiedAt: "2024-01-11",
      isStarred: false,
      path: "/presentation.pdf",
      tags: ["documents", "presentations"]
    },
    {
      id: "6",
      name: "code-snippets",
      type: "folder",
      size: 0,
      modifiedAt: "2024-01-10",
      isStarred: false,
      path: "/code-snippets",
      tags: ["code", "snippets"]
    }
  ]);

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    file.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getFileIcon = (file: FileItem) => {
    if (file.type === "folder") {
      return <Folder className="h-6 w-6 text-blue-500" />;
    }

    const mimeType = file.mimeType || "";
    if (mimeType.startsWith("image/")) {
      return <Image className="h-6 w-6 text-green-500" />;
    } else if (mimeType.startsWith("video/")) {
      return <Video className="h-6 w-6 text-red-500" />;
    } else if (mimeType.startsWith("audio/")) {
      return <Music className="h-6 w-6 text-purple-500" />;
    } else if (mimeType.includes("pdf")) {
      return <FileText className="h-6 w-6 text-red-500" />;
    } else if (mimeType.includes("zip") || mimeType.includes("rar")) {
      return <Archive className="h-6 w-6 text-orange-500" />;
    } else {
      return <File className="h-6 w-6 text-gray-500" />;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const toggleStar = (fileId: string) => {
    setFiles(prev => prev.map(file => 
      file.id === fileId ? { ...file, isStarred: !file.isStarred } : file
    ));
  };

  const toggleSelection = (fileId: string) => {
    setSelectedFiles(prev => 
      prev.includes(fileId) 
        ? prev.filter(id => id !== fileId)
        : [...prev, fileId]
    );
  };

  const selectAll = () => {
    setSelectedFiles(filteredFiles.map(file => file.id));
  };

  const clearSelection = () => {
    setSelectedFiles([]);
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
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </button>
          <button 
            onClick={() => setShowUpload(true)}
            className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </button>
          <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
            <FolderPlus className="h-4 w-4 mr-2" />
            New Folder
          </button>
        </div>
      </div>

      {/* View Controls and Selection */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode("grid")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "grid" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
            }`}
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded-lg transition-colors ${
              viewMode === "list" ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
            }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {selectedFiles.length > 0 && (
            <>
              <span className="text-sm text-muted-foreground">
                {selectedFiles.length} selected
              </span>
              <button
                onClick={clearSelection}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Clear
              </button>
              <button
                onClick={selectAll}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                Select All
              </button>
            </>
          )}
        </div>
      </div>

      {/* Files Grid/List */}
      {viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className={`bg-card border rounded-xl p-4 hover:shadow-lg transition-all duration-300 cursor-pointer ${
                selectedFiles.includes(file.id) ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => toggleSelection(file.id)}
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-3">
                  {getFileIcon(file)}
                </div>
                <h3 className="font-medium text-sm mb-1 truncate w-full" title={file.name}>
                  {file.name}
                </h3>
                <p className="text-xs text-muted-foreground mb-2">
                  {file.type === "folder" ? "Folder" : formatFileSize(file.size)}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStar(file.id);
                    }}
                    className="p-1 hover:bg-accent/60 rounded transition-colors"
                  >
                    <Star className={`h-3 w-3 ${file.isStarred ? 'text-yellow-500 fill-current' : 'text-muted-foreground'}`} />
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 hover:bg-accent/60 rounded transition-colors"
                  >
                    <MoreHorizontal className="h-3 w-3 text-muted-foreground" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-4 font-medium">Name</th>
                  <th className="text-left p-4 font-medium">Size</th>
                  <th className="text-left p-4 font-medium">Modified</th>
                  <th className="text-left p-4 font-medium">Tags</th>
                  <th className="text-left p-4 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((file) => (
                  <tr
                    key={file.id}
                    className={`hover:bg-accent/60 transition-colors cursor-pointer ${
                      selectedFiles.includes(file.id) ? "bg-accent/30" : ""
                    }`}
                    onClick={() => toggleSelection(file.id)}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {getFileIcon(file)}
                        <div>
                          <p className="font-medium">{file.name}</p>
                          <p className="text-sm text-muted-foreground">{file.path}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {file.type === "folder" ? "—" : formatFileSize(file.size)}
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {new Date(file.modifiedAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-1">
                        {file.tags.slice(0, 2).map((tag, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-muted rounded text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                        {file.tags.length > 2 && (
                          <span className="px-2 py-1 bg-muted rounded text-xs">
                            +{file.tags.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleStar(file.id);
                          }}
                          className="p-1 hover:bg-accent/60 rounded transition-colors"
                        >
                          <Star className={`h-4 w-4 ${file.isStarred ? 'text-yellow-500 fill-current' : 'text-muted-foreground'}`} />
                        </button>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-1 hover:bg-accent/60 rounded transition-colors"
                        >
                          <Download className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <button
                          onClick={(e) => e.stopPropagation()}
                          className="p-1 hover:bg-accent/60 rounded transition-colors"
                        >
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {filteredFiles.length === 0 && (
        <div className="text-center py-12">
          <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No files found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery
              ? "Try adjusting your search terms"
              : "Upload files or create folders to get started"
            }
          </p>
          <button 
            onClick={() => setShowUpload(true)}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Files
          </button>
        </div>
      )}

      {/* File Upload Modal */}
      <FileUpload
        isOpen={showUpload}
        onClose={() => setShowUpload(false)}
        onUpload={(files) => {
          // In a real app, this would handle the actual file upload
          console.log("Uploading files:", files);
          setShowUpload(false);
        }}
        maxFiles={10}
        maxSize={50}
        acceptedTypes={["*"]}
      />
    </div>
  );
}
