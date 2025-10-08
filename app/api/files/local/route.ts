import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { stat, readdir } from 'fs/promises';

// Configuration for your brain server directory
const BRAIN_SERVER_PATH = process.env.BRAIN_SERVER_PATH || '/path/to/brain-server';
const ALLOWED_PATHS = [
  '/brain-server/media',
  '/brain-server/documents', 
  '/brain-server/logs',
  '/brain-server/database'
];

interface LocalFileItem {
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

// Security check to ensure we only access allowed paths
function isPathAllowed(requestedPath: string): boolean {
  const normalizedPath = path.normalize(requestedPath);
  return ALLOWED_PATHS.some(allowedPath => 
    normalizedPath.startsWith(allowedPath) || normalizedPath === allowedPath
  );
}

// Get MIME type based on file extension
function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes: Record<string, string> = {
    '.txt': 'text/plain',
    '.md': 'text/markdown',
    '.json': 'application/json',
    '.pdf': 'application/pdf',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.png': 'image/png',
    '.gif': 'image/gif',
    '.mp4': 'video/mp4',
    '.mp3': 'audio/mpeg',
    '.zip': 'application/zip',
    '.doc': 'application/msword',
    '.docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    '.xls': 'application/vnd.ms-excel',
    '.xlsx': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  };
  return mimeTypes[ext] || 'application/octet-stream';
}

// Convert file stats to LocalFileItem
async function fileStatsToItem(filePath: string, stats: any): Promise<LocalFileItem> {
  const relativePath = path.relative(BRAIN_SERVER_PATH, filePath);
  const isDirectory = stats.isDirectory();
  
  return {
    id: Buffer.from(filePath).toString('base64'),
    name: path.basename(filePath),
    path: relativePath,
    type: isDirectory ? 'directory' : 'file',
    size: isDirectory ? undefined : stats.size,
    mimeType: isDirectory ? undefined : getMimeType(filePath),
    lastModified: stats.mtime.toISOString(),
    isHidden: path.basename(filePath).startsWith('.'),
    permissions: stats.mode.toString(8),
    parentPath: path.dirname(relativePath) === '.' ? undefined : path.dirname(relativePath)
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedPath = searchParams.get('path') || '/';
    const fullPath = path.join(BRAIN_SERVER_PATH, requestedPath);

    // Security check
    if (!isPathAllowed(fullPath)) {
      return NextResponse.json(
        { error: 'Access denied: Path not allowed' },
        { status: 403 }
      );
    }

    // Check if path exists
    try {
      const stats = await stat(fullPath);
      
      if (!stats.isDirectory()) {
        return NextResponse.json(
          { error: 'Path is not a directory' },
          { status: 400 }
        );
      }

      // Read directory contents
      const files = await readdir(fullPath);
      const fileItems: LocalFileItem[] = [];

      for (const file of files) {
        try {
          const filePath = path.join(fullPath, file);
          const fileStats = await stat(filePath);
          const item = await fileStatsToItem(filePath, fileStats);
          fileItems.push(item);
        } catch (error) {
          console.error(`Error reading file ${file}:`, error);
          // Continue with other files
        }
      }

      // Sort: directories first, then files, both alphabetically
      fileItems.sort((a, b) => {
        if (a.type !== b.type) {
          return a.type === 'directory' ? -1 : 1;
        }
        return a.name.localeCompare(b.name);
      });

      return NextResponse.json(fileItems);

    } catch (error) {
      if ((error as any).code === 'ENOENT') {
        return NextResponse.json(
          { error: 'Directory not found' },
          { status: 404 }
        );
      }
      throw error;
    }

  } catch (error) {
    console.error('Error reading directory:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
