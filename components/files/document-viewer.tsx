"use client";

import { useState, useEffect } from "react";
import { X, Download, ZoomIn, ZoomOut, RotateCw, Maximize, Minimize, ChevronLeft, ChevronRight } from "lucide-react";
import { Modal } from "@/components/ui/modal";

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  file: {
    name: string;
    path: string;
    mimeType: string;
    size: number;
  };
}

export function DocumentViewer({ isOpen, onClose, file }: DocumentViewerProps) {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fileContent, setFileContent] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && file) {
      loadFileContent();
    }
  }, [isOpen, file]);

  const loadFileContent = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/files/local/content?path=${encodeURIComponent(file.path)}`);
      
      if (!response.ok) {
        throw new Error('Failed to load file');
      }

      if (file.mimeType.startsWith('text/')) {
        const text = await response.text();
        setFileContent(text);
      } else if (file.mimeType === 'application/pdf') {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setFileContent(url);
      } else if (file.mimeType.startsWith('image/')) {
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        setFileContent(url);
      } else {
        throw new Error('Unsupported file type');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load file');
    } finally {
      setLoading(false);
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 300));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 25));
  };

  const handleResetZoom = () => {
    setZoom(100);
  };

  const handleRotate = () => {
    setRotation(prev => (prev + 90) % 360);
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const handleDownload = () => {
    if (fileContent) {
      const link = document.createElement('a');
      link.href = fileContent;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading document...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <X className="h-12 w-12 text-destructive mx-auto mb-4" />
            <p className="text-destructive mb-2">Failed to load document</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
        </div>
      );
    }

    if (file.mimeType.startsWith('text/')) {
      return (
        <div className="h-96 overflow-auto">
          <pre className="whitespace-pre-wrap text-sm font-mono p-4 bg-muted rounded">
            {fileContent}
          </pre>
        </div>
      );
    }

    if (file.mimeType === 'application/pdf') {
      return (
        <div className="h-96">
          <iframe
            src={fileContent || ''}
            className="w-full h-full border-0"
            style={{ transform: `scale(${zoom / 100}) rotate(${rotation}deg)` }}
          />
        </div>
      );
    }

    if (file.mimeType.startsWith('image/')) {
      return (
        <div className="flex items-center justify-center h-96">
          <img
            src={fileContent || ''}
            alt={file.name}
            className="max-w-full max-h-full object-contain"
            style={{ 
              transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
              transition: 'transform 0.2s ease-in-out'
            }}
          />
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <X className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Preview not available for this file type</p>
        </div>
      </div>
    );
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={file.name}
      size={isFullscreen ? "full" : "xl"}
      className={isFullscreen ? "fixed inset-0 z-50" : ""}
    >
      <div className="space-y-4">
        {/* File Info */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span>Size: {formatFileSize(file.size)}</span>
            <span>Type: {file.mimeType}</span>
          </div>
          <div className="flex items-center gap-2">
            <span>Zoom: {zoom}%</span>
            {rotation !== 0 && <span>Rotation: {rotation}°</span>}
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between p-2 border rounded-lg bg-muted/30">
          <div className="flex items-center gap-2">
            <button
              onClick={handleZoomOut}
              disabled={zoom <= 25}
              className="p-2 hover:bg-accent/60 rounded transition-colors disabled:opacity-50"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <button
              onClick={handleResetZoom}
              className="px-3 py-1 text-sm bg-muted hover:bg-muted/80 rounded transition-colors"
            >
              {zoom}%
            </button>
            <button
              onClick={handleZoomIn}
              disabled={zoom >= 300}
              className="p-2 hover:bg-accent/60 rounded transition-colors disabled:opacity-50"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            {(file.mimeType.startsWith('image/') || file.mimeType === 'application/pdf') && (
              <button
                onClick={handleRotate}
                className="p-2 hover:bg-accent/60 rounded transition-colors"
              >
                <RotateCw className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={handleFullscreen}
              className="p-2 hover:bg-accent/60 rounded transition-colors"
            >
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </button>
            <button
              onClick={handleDownload}
              className="p-2 hover:bg-accent/60 rounded transition-colors"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Document Content */}
        <div className="border rounded-lg overflow-hidden">
          {renderContent()}
        </div>

        {/* Navigation (for multi-page documents) */}
        {(file.mimeType === 'application/pdf') && (
          <div className="flex items-center justify-center gap-4 p-2 border rounded-lg bg-muted/30">
            <button className="p-2 hover:bg-accent/60 rounded transition-colors">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm text-muted-foreground">Page 1 of 1</span>
            <button className="p-2 hover:bg-accent/60 rounded transition-colors">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
}
