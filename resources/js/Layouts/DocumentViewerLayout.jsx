import React, { useEffect } from 'react';
import { Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function DocumentViewerLayout({ children }) {
    // Add security measures to prevent downloads
    useEffect(() => {
        const handleContextMenu = (e) => e.preventDefault();
        const handleKeyDown = (e) => {
            if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'p' || e.key === 'a')) {
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

    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {/* Header with logo */}
            <header className="bg-green-900 text-white shadow-lg">
                <div className="max-w-7xl mx-auto py-3 px-4 sm:px-6 flex justify-between items-center">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <ApplicationLogo className="h-9 w-auto" />
                            <span className="font-semibold text-xl">Mindoro State University</span>
                        </Link>
                    </div>
                    <div className="text-gray-300">
                        Document Viewer
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 md:p-6">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white shadow-inner py-3 text-center text-sm text-gray-500">
                <div className="max-w-7xl mx-auto">
                    <p>This document is for authorized viewing only. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}