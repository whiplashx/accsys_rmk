import React, { useEffect, useRef } from 'react';
import TaskForceLayout from "@/Layouts/TaskForceLayout";

export default function DocumentViewer() {
    const iframeRef = useRef(null);

    useEffect(() => {
        // Disable right click
        const handleContextMenu = (e) => {
            e.preventDefault();
        };

        // Prevent keyboard shortcuts for saving/printing
        const handleKeyDown = (e) => {
            // Prevent Ctrl+S, Ctrl+P, Ctrl+Shift+S
            if ((e.ctrlKey && (e.key === 's' || e.key === 'p')) || 
                (e.ctrlKey && e.shiftKey && e.key === 's')) {
                e.preventDefault();
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
                {/* Add a transparent overlay to prevent direct interactions */}
                <div className="absolute inset-0 z-10" style={{ pointerEvents: 'none' }}></div>
                <div className="h-[calc(100vh-4rem)] overflow-auto">
                    <iframe
                        ref={iframeRef}
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
                        onLoad={() => {
                            // Add styling to disable downloads in iframe content if possible
                            try {
                                const iframeDocument = iframeRef.current.contentDocument || 
                                                     iframeRef.current.contentWindow.document;
                                
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
                            } catch (e) {
                                console.log('Unable to modify iframe content due to same-origin policy');
                            }
                        }}
                    />
                </div>
                <div className="absolute bottom-4 right-4 z-20 bg-red-600 text-white px-3 py-2 rounded shadow">
                    Download Disabled
                </div>
            </div>
        </TaskForceLayout>
    );
}