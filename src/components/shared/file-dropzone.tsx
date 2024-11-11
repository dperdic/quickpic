"use client";

import React, { useCallback, useState, useRef } from "react";
import { useFileState } from "@/lib/file-context";

interface FileDropzoneProps {
  children: React.ReactNode;
  acceptedFileTypes: string[];
  dropText: string;
}

export const FileDropzone: React.FC<FileDropzoneProps> = ({
  children,
  acceptedFileTypes,
  dropText,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const dragCounter = useRef(0);
  const { setCurrentFile } = useFileState();

  const handleDrag = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDragIn = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current++;

    if (e.dataTransfer?.items && e.dataTransfer.items.length > 0) {
      setIsDragging(true);
    }
  }, []);

  const handleDragOut = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounter.current--;

    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      dragCounter.current = 0;

      const files = e.dataTransfer?.files;
      if (files && files.length > 0) {
        const droppedFile = files[0];
        if (
          droppedFile &&
          (acceptedFileTypes.includes(droppedFile.type) ||
            acceptedFileTypes.some((type) =>
              droppedFile.name.toLowerCase().endsWith(type.replace("*", "")),
            ))
        ) {
          setCurrentFile(droppedFile);
        }
      }
    },
    [acceptedFileTypes, setCurrentFile],
  );

  return (
    <div
      onDragEnter={handleDragIn}
      onDragLeave={handleDragOut}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      className="h-full w-full"
    >
      {isDragging && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="animate-in fade-in zoom-in relative flex h-[90%] w-[90%] transform items-center justify-center rounded-xl border-2 border-dashed border-white/30 transition-all duration-200 ease-out">
            <p className="text-2xl font-semibold text-white">{dropText}</p>
          </div>
        </div>
      )}
      {children}
    </div>
  );
};