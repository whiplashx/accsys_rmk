import SideBarResponsive from '@/Components/SideBarResponsive';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Breadcrumbs from '@/Components/Breadcrumbs';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <SideBarResponsive></SideBarResponsive>

            {/* Main content area */}
                <main className="flex-1 p-6">
                <Breadcrumbs></Breadcrumbs>
                 {children}
                </main>
            </div>
    
    );
}
