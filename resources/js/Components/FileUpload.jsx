import React, { useState, useRef, useEffect } from "react";
import { CloudIcon } from 'lucide-react';

export default function FileUploadDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDraggingContainer, setIsDraggingContainer] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (isDraggingContainer) {
        setPosition(prevPosition => ({
          x: prevPosition.x + e.movementX,
          y: prevPosition.y + e.movementY
        }));
      }
    };

    const handleMouseUp = () => {
      setIsDraggingContainer(false);
    };

    if (isDraggingContainer) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDraggingContainer]);

  const handleDragStart = (e) => {
    e.preventDefault();
    setIsDraggingContainer(true);
  };
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    // Handle file drop here
    const files = Array.from(e.dataTransfer.files);
    console.log('Dropped files:', files);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Upload Files
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div 
        ref={containerRef}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          cursor: isDraggingContainer ? 'grabbing' : 'grab'
        }}
        className="bg-white rounded-lg shadow-xl max-w-md w-full"
      >
        <div 
          className="p-6"
          onMouseDown={handleDragStart}
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Upload files</h2>
            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-700 text-3xl">
              ×
            </button>
          </div>
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`mt-4 border-2 border-dashed rounded-lg p-8 text-center ${
              isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <CloudIcon className="h-12 w-12 text-gray-400" />
              <p className="text-lg font-medium">Drop files here</p>
              <p className="text-sm text-gray-500">Supported format: PDF</p>
              <p className="text-sm text-gray-500 mt-2">OR</p>
              <button
                className="text-blue-500 hover:text-blue-600 mt-1"
                onClick={() => document.getElementById('file-upload').click()}
              >
                Browse files
              </button>
              <input
                id="file-upload"
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  console.log('Selected files:', files);
                }}
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            >
              Upload
            </button>
          </div>
        </div>
        <div className="text-xs text-gray-500 text-center pb-4">
          Made with Visly
        </div>
      </div>
    </div>
  );
}

