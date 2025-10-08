"use client";

import { useState, useEffect } from "react";
import { 
  Folder, 
  File, 
  Image, 
  FileText, 
  Music, 
  Video, 
  Archive,
  Search,
  Grid,
  List,
  RefreshCw,
  Home,
  ChevronRight,
  Download,
  Eye,
  Calendar,
  HardDrive
} from "lucide-react";
import { LocalFileSystem, LocalFileItem } from "@/lib/file-system";
import { DocumentViewer } from "./document-viewer";

interface LocalFileManagerProps {
  basePath?: string;
  onFileSelect?: (file: LocalFileItem) => void;
  onDirectorySelect?: (path: string) => void;
}

export function LocalFileManager({ 
  basePath = "/brain-server",
  onFileSelect,
  onDirectorySelect 
}: LocalFileManagerProps) {
  const [currentPath, setCurrentPath] = useState(basePath);
  const [files, setFiles] = useState<LocalFileItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [breadcrumbs, setBreadcrumbs] = useState<Array<{name: string, path: string}>>([]);
  const [selectedFile, setSelectedFile] = useState<LocalFileItem | null>(null);
  const [showViewer, setShowViewer] = useState(false);

  const fileSystem = new LocalFileSystem();

  // Load directory contents
  const loadDirectory = async (path: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const contents = await fileSystem.getDirectoryContents(path);
      setFiles(contents);
      
      // Update breadcrumbs
      const pathParts = path.split('/').filter(Boolean);
      const breadcrumbItems = pathParts.map((part, index) => ({
        name: part,
        path: '/' + pathParts.slice(0, index + 1).join('/')
      }));
      setBreadcrumbs(breadcrumbItems);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load directory');
      console.error('Error loading directory:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadDirectory(currentPath);
  }, [currentPath]);

  // Get file icon based on type and MIME type
  const getFileIcon = (file: LocalFileItem) => {
    if (file.type === 'directory') {
      return <Folder className="h-8 w-8 text-blue-500" />;
    }

    const mimeType = file.mimeType || '';
    
    if (mimeType.startsWith('image/')) {
      return <Image className="h-8 w-8 text-green-500" />;
    } else if (mimeType.startsWith('video/')) {
      return <Video className="h-8 w-8 text-red-500" />;
    } else if (mimeType.startsWith('audio/')) {
      return <Music className="h-8 w-8 text-purple-500" />;
    } else if (mimeType.includes('pdf') || mimeType.includes('text')) {
      return <FileText className="h-8 w-8 text-blue-500" />;
    } else if (mimeType.includes('zip') || mimeType.includes('rar')) {
      return <Archive className="h-8 w-8 text-orange-500" />;
    } else {
      return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  // Format file size
  const formatFileSize = (bytes?: number) => {
    if (!bytes) return '';
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Handle directory navigation
  const navigateToDirectory = (path: string) => {
    setCurrentPath(path);
    onDirectorySelect?.(path);
  };

  // Handle file selection
  const handleFileClick = (file: LocalFileItem) => {
    if (file.type === 'directory') {
      navigateToDirectory(file.path);
    } else {
      onFileSelect?.(file);
    }
  };

  // Handle file preview
  const handleFilePreview = (file: LocalFileItem) => {
    setSelectedFile(file);
    setShowViewer(true);
  };

  // Filter files based on search query
  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Group files by type
  const directories = filteredFiles.filter(file => file.type === 'directory');
  const fileItems = filteredFiles.filter(file => file.type === 'file');

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <HardDrive className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-xl font-semibold">Brain Server Files</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => loadDirectory(currentPath)}
            disabled={loading}
            className="p-2 hover:bg-accent/60 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <button
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="p-2 hover:bg-accent/60 rounded-lg transition-colors"
          >
            {viewMode === 'grid' ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <button
          onClick={() => navigateToDirectory('/brain-server')}
          className="flex items-center gap-1 hover:text-foreground transition-colors"
        >
          <Home className="h-4 w-4" />
          Brain Server
        </button>
        {breadcrumbs.map((crumb, index) => (
          <div key={index} className="flex items-center gap-2">
            <ChevronRight className="h-4 w-4" />
            <button
              onClick={() => navigateToDirectory(crumb.path)}
              className="hover:text-foreground transition-colors"
            >
              {crumb.name}
            </button>
          </div>
        ))}
      </div>

      {/* Search */}
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

      {/* Error State */}
      {error && (
        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
          <p className="text-destructive">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* Files Grid/List */}
      {!loading && !error && (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
          : "space-y-2"
        }>
          {/* Directories First */}
          {directories.map((file) => (
            <div
              key={file.id}
              onClick={() => handleFileClick(file)}
              className={`
                flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer
                ${viewMode === 'list' ? 'flex-row' : 'flex-col text-center'}
              `}
            >
              {getFileIcon(file)}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{file.name}</p>
                <p className="text-sm text-muted-foreground">
                  {new Date(file.lastModified).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}

          {/* Files */}
          {fileItems.map((file) => (
            <div
              key={file.id}
              onClick={() => handleFileClick(file)}
              className={`
                flex items-center gap-3 p-3 rounded-lg border hover:bg-accent/50 transition-colors cursor-pointer
                ${viewMode === 'list' ? 'flex-row' : 'flex-col text-center'}
              `}
            >
              {getFileIcon(file)}
              <div className="flex-1 min-w-0">
                <p className="font-medium truncate">{file.name}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{formatFileSize(file.size)}</span>
                  <span>•</span>
                  <span>{new Date(file.lastModified).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleFilePreview(file);
                  }}
                  className="p-1 hover:bg-accent/60 rounded transition-colors"
                >
                  <Eye className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle file download
                  }}
                  className="p-1 hover:bg-accent/60 rounded transition-colors"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredFiles.length === 0 && (
        <div className="text-center py-12">
          <Folder className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {searchQuery ? 'No files found' : 'Empty directory'}
          </h3>
          <p className="text-muted-foreground">
            {searchQuery 
              ? 'Try adjusting your search terms'
              : 'This directory is empty'
            }
          </p>
        </div>
      )}

      {/* Document Viewer Modal */}
      {selectedFile && (
        <DocumentViewer
          isOpen={showViewer}
          onClose={() => {
            setShowViewer(false);
            setSelectedFile(null);
          }}
          file={{
            name: selectedFile.name,
            path: selectedFile.path,
            mimeType: selectedFile.mimeType || 'application/octet-stream',
            size: selectedFile.size || 0
          }}
        />
      )}
    </div>
  );
}
