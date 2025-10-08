"use client";

import { useState, useRef, useCallback } from "react";
import { Upload, X, File, Image, Video, Music, Archive, FileText, CheckCircle, AlertCircle } from "lucide-react";
import { Modal } from "@/components/ui/modal";

interface FileUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (files: File[]) => void;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
}

interface UploadFile {
  file: File;
  id: string;
  status: "pending" | "uploading" | "success" | "error";
  progress: number;
  error?: string;
}

export function FileUpload({ 
  isOpen, 
  onClose, 
  onUpload, 
  maxFiles = 10,
  maxSize = 50,
  acceptedTypes = ["*"]
}: FileUploadProps) {
  const [uploadFiles, setUploadFiles] = useState<UploadFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileIcon = (file: File) => {
    const mimeType = file.type;
    if (mimeType.startsWith("image/")) {
      return <Image className="h-8 w-8 text-green-500" />;
    } else if (mimeType.startsWith("video/")) {
      return <Video className="h-8 w-8 text-red-500" />;
    } else if (mimeType.startsWith("audio/")) {
      return <Music className="h-8 w-8 text-purple-500" />;
    } else if (mimeType.includes("zip") || mimeType.includes("rar")) {
      return <Archive className="h-8 w-8 text-orange-500" />;
    } else if (mimeType.includes("pdf") || mimeType.includes("text")) {
      return <FileText className="h-8 w-8 text-blue-500" />;
    } else {
      return <File className="h-8 w-8 text-gray-500" />;
    }
  };

  const validateFile = (file: File): string | null => {
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      return `File size must be less than ${maxSize}MB`;
    }

    // Check file type
    if (acceptedTypes[0] !== "*") {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const mimeType = file.type;
      
      const isAccepted = acceptedTypes.some(type => {
        if (type.startsWith('.')) {
          return fileExtension === type.substring(1);
        } else if (type.includes('/')) {
          return mimeType.startsWith(type);
        }
        return false;
      });

      if (!isAccepted) {
        return `File type not supported. Accepted types: ${acceptedTypes.join(', ')}`;
      }
    }

    return null;
  };

  const handleFiles = useCallback((files: FileList | File[]) => {
    const fileArray = Array.from(files);
    const newUploadFiles: UploadFile[] = [];

    fileArray.forEach((file) => {
      const error = validateFile(file);
      const uploadFile: UploadFile = {
        file,
        id: Math.random().toString(36).substr(2, 9),
        status: error ? "error" : "pending",
        progress: 0,
        error
      };
      newUploadFiles.push(uploadFile);
    });

    setUploadFiles(prev => [...prev, ...newUploadFiles].slice(0, maxFiles));
  }, [maxFiles, maxSize, acceptedTypes]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  }, [handleFiles]);

  const removeFile = (fileId: string) => {
    setUploadFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const simulateUpload = async (uploadFile: UploadFile) => {
    setUploadFiles(prev => prev.map(f => 
      f.id === uploadFile.id 
        ? { ...f, status: "uploading", progress: 0 }
        : f
    ));

    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setUploadFiles(prev => prev.map(f => 
        f.id === uploadFile.id 
          ? { ...f, progress }
          : f
      ));
    }

    setUploadFiles(prev => prev.map(f => 
      f.id === uploadFile.id 
        ? { ...f, status: "success", progress: 100 }
        : f
    ));
  };

  const handleUpload = async () => {
    const pendingFiles = uploadFiles.filter(f => f.status === "pending");
    
    for (const uploadFile of pendingFiles) {
      await simulateUpload(uploadFile);
    }

    // Call the onUpload callback with successfully uploaded files
    const successfulFiles = uploadFiles
      .filter(f => f.status === "success")
      .map(f => f.file);
    
    if (successfulFiles.length > 0) {
      onUpload(successfulFiles);
    }

    onClose();
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const getStatusIcon = (status: UploadFile["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case "uploading":
        return <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />;
      default:
        return null;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Upload Files" size="lg">
      <div className="space-y-6">
        {/* Drop Zone */}
        <div
          className={`
            border-2 border-dashed rounded-xl p-8 text-center transition-colors
            ${isDragOver 
              ? "border-primary bg-primary/5" 
              : "border-muted-foreground/25 hover:border-primary/50"
            }
          `}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">
            {isDragOver ? "Drop files here" : "Drag & drop files here"}
          </h3>
          <p className="text-muted-foreground mb-4">
            or click to browse files
          </p>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Choose Files
          </button>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileInput}
            accept={acceptedTypes.join(",")}
            className="hidden"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Max {maxFiles} files, {maxSize}MB each
          </p>
        </div>

        {/* File List */}
        {uploadFiles.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-semibold">Files to Upload ({uploadFiles.length})</h4>
            <div className="max-h-64 overflow-y-auto space-y-2">
              {uploadFiles.map((uploadFile) => (
                <div
                  key={uploadFile.id}
                  className="flex items-center gap-3 p-3 border rounded-lg"
                >
                  {getFileIcon(uploadFile.file)}
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{uploadFile.file.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatFileSize(uploadFile.file.size)}
                    </p>
                    {uploadFile.error && (
                      <p className="text-sm text-destructive">{uploadFile.error}</p>
                    )}
                    {uploadFile.status === "uploading" && (
                      <div className="w-full bg-muted rounded-full h-2 mt-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadFile.progress}%` }}
                        />
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {getStatusIcon(uploadFile.status)}
                    <button
                      onClick={() => removeFile(uploadFile.id)}
                      className="p-1 hover:bg-accent/60 rounded transition-colors"
                    >
                      <X className="h-4 w-4 text-muted-foreground" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleUpload}
            disabled={uploadFiles.length === 0 || uploadFiles.some(f => f.status === "error")}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Upload {uploadFiles.filter(f => f.status !== "error").length} Files
          </button>
        </div>
      </div>
    </Modal>
  );
}
