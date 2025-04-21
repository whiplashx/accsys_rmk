import DocumentViewerLayout from '@/Layouts/DocumentViewerLayout';
import React, { useState, useEffect } from 'react';

console.log('DocumentViewer component loaded');
const DocumentViewer = () => {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Implement security measures
    useEffect(() => {
        // Check if document exists (to avoid issues during SSR)
        if (typeof document !== 'undefined') {
            // Prevent right-clicking
            const handleContextMenu = (e) => {
                e.preventDefault();
                return false;
            };
            
            // Prevent keyboard shortcuts
            const handleKeyDown = (e) => {
                // Prevent Ctrl+S, Ctrl+P, etc.
                if ((e.ctrlKey || e.metaKey) && 
                    (e.key === 's' || e.key === 'p' || e.key === 'a')) {
                    e.preventDefault();
                    return false;
                }
            };
            
            document.addEventListener('contextmenu', handleContextMenu);
            document.addEventListener('keydown', handleKeyDown);
            
            return () => {
                document.removeEventListener('contextmenu', handleContextMenu);
                document.removeEventListener('keydown', handleKeyDown);
            };
        }
    }, []);

    const queryParams = new URLSearchParams(window.location.search);
    const documentPath = queryParams.get('path');
    const taskName = queryParams.get('taskName');
    const uploader = queryParams.get('uploader') || 'Unknown';
    const rating = queryParams.get('rating') || 'Not rated';

    useEffect(() => {
        if (documentPath) {
            setLoading(true);
            setError(null);
            
            setTimeout(() => {
                setLoading(false);
            }, 1000);
        }
    }, [documentPath]);

    if (loading) return (
        <DocumentViewerLayout>
            <div className="flex items-center justify-center h-full">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        </DocumentViewerLayout>
    );

    if (error) return (
        <DocumentViewerLayout>
            <div className="flex items-center justify-center h-full text-red-500">
                <p>Error loading document: {error}</p>
            </div>
        </DocumentViewerLayout>
    );

    if (!documentPath) return (
        <DocumentViewerLayout>
            <div className="flex items-center justify-center h-full text-gray-500">
                <p>No document selected</p>
            </div>
        </DocumentViewerLayout>
    );

    // Determine the file type to render appropriate viewer
    const fileExtension = documentPath.split('.').pop().toLowerCase();
    
    // PDF viewer with disabled download options
    if (fileExtension === 'pdf') {
        return (
            <DocumentViewerLayout>
                <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4">
                    <p className="font-bold">View Only</p>
                    <p>This document is for viewing purposes only and cannot be downloaded.</p>
                </div>
                <div className="w-full h-full relative">
                    <iframe
                        src={`${documentPath}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
                        className="w-full h-[calc(100vh-200px)]"
                        title="PDF Document Viewer"
                        sandbox="allow-scripts allow-same-origin"
                    />
                    {/* Protection overlay */}
                    <div className="absolute top-0 left-0 w-full h-12 bg-transparent"></div>
                </div>
            </DocumentViewerLayout>
        );
    }
    
    // Image viewer with protection
    if (['jpg', 'jpeg', 'png', 'gif'].includes(fileExtension)) {
        return (
            <DocumentViewerLayout>
                <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4">
                    <p className="font-bold">View Only</p>
                    <p>This image is for viewing purposes only and cannot be downloaded.</p>
                </div>
                <div className="flex items-center justify-center h-[calc(100vh-200px)] bg-gray-800 relative">
                    <div className="relative">
                        {/* Watermark overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none">
                            <span className="text-white text-5xl font-bold transform rotate-45">VIEW ONLY</span>
                        </div>
                        <img 
                            src={documentPath} 
                            alt="Document" 
                            className="max-w-full max-h-[calc(100vh-200px)] object-contain pointer-events-none"
                            style={{userSelect: 'none'}}
                            onDragStart={(e) => e.preventDefault()}
                        />
                    </div>
                </div>
            </DocumentViewerLayout>
        );
    }
    
    // For other document types - show message but no download option
    return (
        <DocumentViewerLayout>
            <div className="flex flex-col items-center justify-center h-full">
                <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6">
                    <p className="font-bold">This file type ({fileExtension}) cannot be previewed directly.</p>
                    <p>For security reasons, downloading is disabled. Please contact your administrator for access to the original file.</p>
                </div>
                <div className="text-center">
                    <p className="text-gray-600">File: {documentPath.split('/').pop()}</p>
                    <p className="text-gray-600">Type: {fileExtension.toUpperCase()}</p>
                </div>
            </div>
        </DocumentViewerLayout>
    );
};

export default DocumentViewer;

