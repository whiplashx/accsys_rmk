import SideBarResponsive from '@/Components/SideBarResponsive';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Breadcrumbs from '@/Components/Breadcrumbs';
import ProfileDropdown from '@/Components/ProfileSection';


import React from 'react';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';

export default function AuthenticatedLayout({ children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
  return (
    <div className="min-h-screen bg-gray-100">
      <SideBarResponsive >
        <Breadcrumbs/>
        
        </SideBarResponsive>
        
    </div>
  );
}
