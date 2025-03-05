import React from 'react';
import { Link } from '@inertiajs/react';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function DocumentViewerLayout({ children }) {
    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white shadow">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center">
                        {/* Replace the nested anchor tags with a single Link component */}
                        <Link href="/" className="flex items-center">
                            <ApplicationLogo className="h-9 w-auto text-gray-800" />
                            <span className="ml-3 text-xl font-semibold text-gray-800">Document Viewer</span>
                        </Link>
                        
                        <div>
                            <Link
                                href={route('dashboard')}
                                className="text-sm text-gray-700 underline hover:text-gray-900"
                            >
                                Back to Dashboard
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            <main className="py-8">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {children}
                </div>
            </main>
            
            <footer className="bg-white shadow-inner mt-auto py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} MinSU Accreditation System
                    </div>
                </div>
            </footer>
        </div>
    );
}