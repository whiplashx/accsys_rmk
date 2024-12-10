import React, { useState, useRef } from "react";
import { CloudIcon } from 'lucide-react';

export default function FileUploadDialog({ onUpload }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

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
    const files = Array.from(e.dataTransfer.files);
    onUpload(files);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`mt-4 border-3 border-dashed rounded-lg p-8 text-center ${
        isDragging ? "border-blue-500 bg-blue-50" : "border-gray-300"
      }`}
    >
      <div className="flex flex-col items-center gap-3">
        <CloudIcon className="h-16 w-16 text-gray-400" />
        <p className="text-xl font-medium">Drop files here</p>
        <p className="text-base text-gray-500">Supported format: PDF</p>
        <p className="text-base text-gray-500 mt-3">OR</p>
        <button
          className="text-blue-500 hover:text-blue-600 mt-2 text-lg"
          onClick={() => fileInputRef.current.click()}
        >
          Browse files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            onUpload(files);
          }}
        />
      </div>
    </div>
  );
}

