// File System Integration for Local PC Access
// This will connect to your local 'brain server' directory

export interface LocalFileItem {
  id: string;
  name: string;
  path: string;
  type: 'file' | 'directory';
  size?: number;
  mimeType?: string;
  lastModified: string;
  isHidden: boolean;
  permissions: string;
  parentPath?: string;
}

export interface DirectoryStructure {
  path: string;
  name: string;
  type: 'directory';
  children: (LocalFileItem | DirectoryStructure)[];
  lastModified: string;
  size: number;
}

// This will be implemented using Node.js fs module in the backend
export class LocalFileSystem {
  private basePath: string;
  private vpnProxy: boolean;

  constructor(basePath: string = '/path/to/brain-server', vpnProxy: boolean = true) {
    this.basePath = basePath;
    this.vpnProxy = vpnProxy;
  }

  // Get directory contents
  async getDirectoryContents(path: string): Promise<LocalFileItem[]> {
    // This will be implemented in the backend API
    const response = await fetch(`/api/files/local?path=${encodeURIComponent(path)}`);
    return response.json();
  }

  // Get file content
  async getFileContent(path: string): Promise<Buffer> {
    const response = await fetch(`/api/files/local/content?path=${encodeURIComponent(path)}`);
    return response.arrayBuffer();
  }

  // Watch directory for changes
  async watchDirectory(path: string, callback: (event: string, filename: string) => void) {
    // This will use Node.js fs.watch in the backend
    const eventSource = new EventSource(`/api/files/local/watch?path=${encodeURIComponent(path)}`);
    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      callback(data.event, data.filename);
    };
    return eventSource;
  }

  // Get file metadata
  async getFileMetadata(path: string): Promise<LocalFileItem> {
    const response = await fetch(`/api/files/local/metadata?path=${encodeURIComponent(path)}`);
    return response.json();
  }

  // Search files
  async searchFiles(query: string, directory?: string): Promise<LocalFileItem[]> {
    const params = new URLSearchParams({ query });
    if (directory) params.append('directory', directory);
    
    const response = await fetch(`/api/files/local/search?${params}`);
    return response.json();
  }
}

// Directory structure for your brain server
export const BRAIN_SERVER_STRUCTURE = {
  path: '/brain-server',
  name: 'Brain Server',
  type: 'directory' as const,
  children: [
    {
      path: '/brain-server/media',
      name: 'Media',
      type: 'directory' as const,
      children: [],
      lastModified: new Date().toISOString(),
      size: 0
    },
    {
      path: '/brain-server/documents',
      name: 'Documents',
      type: 'directory' as const,
      children: [],
      lastModified: new Date().toISOString(),
      size: 0
    },
    {
      path: '/brain-server/logs',
      name: 'Logs',
      type: 'directory' as const,
      children: [],
      lastModified: new Date().toISOString(),
      size: 0
    },
    {
      path: '/brain-server/database',
      name: 'Database',
      type: 'directory' as const,
      children: [],
      lastModified: new Date().toISOString(),
      size: 0
    }
  ],
  lastModified: new Date().toISOString(),
  size: 0
};
