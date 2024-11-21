import SideBarResponsive from '@/Components/SideBarResponsive';
import { Head, Link, usePage } from '@inertiajs/react';
import { useState } from 'react';
import Breadcrumbs from '@/Components/Breadcrumbs';
import ProfileSection from '@/Components/ProfileSection';


import React from 'react';

export default function AuthenticatedLayout({ children }) {

  return (
    <div className="min-h-screen bg-gray-100">
      <SideBarResponsive >
        <Breadcrumbs/>
        <main>
            {children}
        </main>
        </SideBarResponsive>
    </div>
  );
}
