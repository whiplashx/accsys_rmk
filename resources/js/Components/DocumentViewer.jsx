import React, { useEffect } from 'react';
import TaskForceLayout from "@/Layouts/TaskForceLayout";

const DocumentViewer = () => {
    useEffect(() => {
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
    const taskName = queryParams.get('taskName');
    const uploader = queryParams.get('uploader') || 'Unknown';
    const rating = queryParams.get('rating') || 'Not rated';

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
            <div className="p-6 bg-gray-100">
                <div className="mb-6 space-y-4">
                    <h1 className="text-3xl font-bold text-gray-800">
                        {taskName || 'Document Viewer'}
                    </h1>
                    <div className="flex space-x-8">
                        <div className="flex items-center">
                            <span className="text-gray-600 font-medium">Uploaded by:</span>
                            <span className="ml-2 text-gray-800">{uploader}</span>
                        </div>
                        <div className="flex items-center">
                            <span className="text-gray-600 font-medium">Self-Survey Rating:</span>
                            <span className="ml-2 text-gray-800">{rating}</span>
                        </div>
                    </div>
                </div>
                <div className="flex-1">
                    <iframe
                        src={`/file/view/${documentPath}#toolbar=0&scrollbar=1`}
                        title="Document Viewer"
                        className="w-full h-[calc(100vh-12rem)]"
                        style={{
                            border: 'none',
                            display: 'block'
                        }}
                    />
                </div>
            </div>
        </TaskForceLayout>
    );
};

export default DocumentViewer;

