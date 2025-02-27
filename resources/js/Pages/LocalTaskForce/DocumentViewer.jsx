import React, { useEffect } from 'react';
import TaskForceLayout from "@/Layouts/TaskForceLayout";

export default function DocumentViewer() {
    useEffect(() => {
        // Disable right click
        const handleContextMenu = (e) => {
            e.preventDefault();
        };
        document.addEventListener('contextmenu', handleContextMenu);
        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
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
            <div className="min-h-screen bg-gray-100">
                <div className="h-[calc(100vh-4rem)] overflow-auto">
                    <iframe
                        src={`/file/view/${documentPath}#toolbar=0&scrollbar=1`}
                        title="Document Viewer"
                        className="w-full h-full border-none"
                        style={{
                            pointerEvents: 'auto',
                            touchAction: 'auto',
                            overflow: 'auto'
                        }}
                    />
                </div>
            </div>
        </TaskForceLayout>
    );
}