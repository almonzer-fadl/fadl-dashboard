import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const BRAIN_SERVER_PATH = process.env.BRAIN_SERVER_PATH || '/path/to/brain-server';
const ALLOWED_PATHS = [
  '/brain-server/media',
  '/brain-server/documents', 
  '/brain-server/logs',
  '/brain-server/database'
];

function isPathAllowed(requestedPath: string): boolean {
  const normalizedPath = path.normalize(requestedPath);
  return ALLOWED_PATHS.some(allowedPath => 
    normalizedPath.startsWith(allowedPath) || normalizedPath === allowedPath
  );
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const requestedPath = searchParams.get('path');
    
    if (!requestedPath) {
      return NextResponse.json(
        { error: 'Path parameter is required' },
        { status: 400 }
      );
    }

    const fullPath = path.join(BRAIN_SERVER_PATH, requestedPath);

    // Security check
    if (!isPathAllowed(fullPath)) {
      return NextResponse.json(
        { error: 'Access denied: Path not allowed' },
        { status: 403 }
      );
    }

    // Check if file exists and is a file (not directory)
    try {
      const stats = await fs.stat(fullPath);
      
      if (stats.isDirectory()) {
        return NextResponse.json(
          { error: 'Path is a directory, not a file' },
          { status: 400 }
        );
      }

      // Read file content
      const fileBuffer = await fs.readFile(fullPath);
      
      // Get file extension for proper content type
      const ext = path.extname(fullPath).toLowerCase();
      let contentType = 'application/octet-stream';
      
      if (ext === '.txt' || ext === '.md') {
        contentType = 'text/plain; charset=utf-8';
      } else if (ext === '.json') {
        contentType = 'application/json';
      } else if (ext === '.html') {
        contentType = 'text/html';
      } else if (ext === '.css') {
        contentType = 'text/css';
      } else if (ext === '.js') {
        contentType = 'application/javascript';
      }

      return new NextResponse(fileBuffer, {
        headers: {
          'Content-Type': contentType,
          'Content-Length': fileBuffer.length.toString(),
          'Cache-Control': 'no-cache'
        }
      });

    } catch (error) {
      if ((error as any).code === 'ENOENT') {
        return NextResponse.json(
          { error: 'File not found' },
          { status: 404 }
        );
      }
      throw error;
    }

  } catch (error) {
    console.error('Error reading file:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
