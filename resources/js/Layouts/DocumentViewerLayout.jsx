import React from 'react';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';

export default function DocumentViewerLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Responsive header */}
      <header className="bg-green-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 gap-4 sm:gap-0">
            <div className="flex items-center space-x-3">
              <ApplicationLogo className="w-10 h-10 text-white" />
              <Link href={'/'} className="text-lg font-semibold text-white hover:text-green-200 transition">
                <span className="hidden sm:inline">Mindoro State University</span>
                <span className="inline sm:hidden">MinSU</span>
              </Link>
            </div>
            <div>
              <Link
                href={route('dashboard')}
                className="text-sm bg-green-700 hover:bg-green-600 px-4 py-2 rounded-md transition-colors duration-200 inline-block"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Responsive main content */}
      <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
        <div className="container mx-auto py-4 sm:py-6 px-3 sm:px-6 lg:px-8">
          {children}
        </div>
      </main>

      {/* Responsive footer */}
      <footer className="bg-white shadow-inner mt-auto py-3 sm:py-4">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="text-center text-xs sm:text-sm text-gray-500">
            &copy; {new Date().getFullYear()} MinSU Accreditation System
          </div>
        </div>
      </footer>
    </div>
  );
}