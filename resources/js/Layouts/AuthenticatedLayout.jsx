import SideBarResponsive from '@/Components/SideBarResponsive';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Breadcrumbs from '@/Components/Breadcrumbs';
import ProfileDropdown from '@/Components/ProfileSection';


import React from 'react';

export default function AuthenticatedLayout({ children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        {/* Sidebar - Fixed position */}
        <div className="fixed h-screen">
          <SideBarResponsive />
        </div>
        
        {/* Sidebar Space Placeholder - Ensures main content doesn't go under sidebar */}
        <div className="w-64 shrink-0" /> {/* Width matches sidebar width */}
        
        {/* Main Content Area - Takes remaining space */}
        <div className="flex-1 min-h-screen">
          {/* Top Navigation Area */}
          <div className="flex justify-between items-center p-4">
            <div className="fixed w-full h-1"><Breadcrumbs />
            </div>            
            <ProfileDropdown />
          </div>
          
          {/* Main Content */}
          <main className="p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
