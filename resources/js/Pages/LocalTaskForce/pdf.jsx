import React, { useState, useEffect } from 'react';
import TaskForceLayout from "@/Layouts/TaskForceLayout";
import ReactPDFViewer from '@/Components/ReactPDFViewer';

export default function DocumentViewer() {
    const [documentType, setDocumentType] = useState(null);
    const [loading, setLoading] = useState(true);

    // Add event listeners to disable right-click and keyboard shortcuts
    useEffect(() => {
        // Disable right click on the main document
        const handleContextMenu = (e) => {
            e.preventDefault();
            return false;
        };

        // Prevent keyboard shortcuts for saving/printing
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
    }, []);

    const queryParams = new URLSearchParams(window.location.search);
    const documentPath = queryParams.get('path');

    // Determine document type on component mount
    useEffect(() => {
        if (documentPath) {
            // Extract file extension to determine document type
            const extension = documentPath.split('.').pop().toLowerCase();
            setDocumentType(extension);
            setLoading(false);
        }
    }, [documentPath]);

    if (!documentPath) {
        return (
            <TaskForceLayout>
                <div className="flex items-center justify-center min-h-screen bg-gray-100">
                    <div className="text-xl text-gray-600">No document specified</div>
                </div>
            </TaskForceLayout>
        );
    }

    return (
        <TaskForceLayout>
            <div className="min-h-screen bg-gray-100 relative">
                {loading ? (
                    <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
                        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
                    </div>
                ) : documentType === 'pdf' ? (
                    // For PDF documents, use the ReactPDFViewer component
                    <div className="h-[calc(100vh-4rem)] relative">
                        <ReactPDFViewer 
                            url={`/file/view/${documentPath}`}
                            watermarkText="MinSU Accreditation" 
                        />
                        
                        <div className="absolute bottom-4 right-4 z-30 bg-red-600 text-white px-3 py-2 rounded shadow">
                            Download Disabled
                        </div>
                    </div>
                ) : (
                    // For other document types (fallback to iframe)
                    <div className="h-[calc(100vh-4rem)] overflow-auto relative">
                        {/* Add a transparent overlay to prevent direct interactions */}
                        <div className="absolute inset-0 z-10" style={{ pointerEvents: 'none' }}></div>
                        
                        {/* Watermark overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none z-20">
                            <span className="text-black text-5xl font-bold transform rotate-45">VIEW ONLY</span>
                        </div>
                        
                        <iframe
                            src={`/file/view/${documentPath}#toolbar=0&scrollbar=1&download=0&print=0`}
                            title="Document Viewer"
                            className="w-full h-full border-none"
                            style={{
                                pointerEvents: 'auto',
                                touchAction: 'auto',
                                overflow: 'auto',
                                userSelect: 'none',
                                WebkitUserSelect: 'none',
                                MozUserSelect: 'none',
                                msUserSelect: 'none'
                            }}
                            sandbox="allow-scripts allow-same-origin"
                            onContextMenu={(e) => e.preventDefault()}
                            onLoad={(e) => {
                                try {
                                    const iframeDocument = e.target.contentDocument || 
                                                         e.target.contentWindow.document;
                                    
                                    // Create a style element in the iframe
                                    const style = iframeDocument.createElement('style');
                                    style.textContent = `
                                        * {
                                            user-select: none !important;
                                            -webkit-user-select: none !important;
                                            -moz-user-select: none !important;
                                            -ms-user-select: none !important;
                                        }
                                        
                                        a[download], button[download], [data-download], 
                                        .download-button, .print-button {
                                            display: none !important;
                                        }
                                    `;
                                    iframeDocument.head.appendChild(style);
                                    
                                    // Disable right-click in the iframe content
                                    iframeDocument.addEventListener('contextmenu', (e) => {
                                        e.preventDefault();
                                        return false;
                                    });
                                } catch (e) {
                                    console.log('Unable to modify iframe content due to same-origin policy');
                                }
                            }}
                        />
                        
                        <div className="absolute bottom-4 right-4 z-20 bg-red-600 text-white px-3 py-2 rounded shadow">
                            Download Disabled
                        </div>
                    </div>
                )}
            </div>
        </TaskForceLayout>
    );
}