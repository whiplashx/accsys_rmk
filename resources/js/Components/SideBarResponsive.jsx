// components/Sidebar.jsx
import { useState } from 'react';
import NavLink from '@/Components/NavLink';
import Dropdown from '@/Components/Dropdown';
import { Link, usePage } from '@inertiajs/react';
import ApplicationLogo from './ApplicationLogo';
import ProfileSection from './ProfileSection';

export default function Sidebar() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const user = usePage().props.auth.user;
    
    return (
    <>

        <div className="lg:hidden fixed flex top-0 left-0 z-50 w-full bg-green-800 p-4 flex justify-between items-center">
                    <button
                        className="text-white p-2  flex align-left rounded hover:bg-green-700"
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    >
                        <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                            {isSidebarOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                        
                    </button>
                    
                                <ApplicationLogo />
    
                            
                            
                    <span className="text-white text-lg font-bold"></span>
                    <span className="text-white text-lg font-bold"></span>
                    <span className="text-white text-lg font-bold"></span>
                </div>
        <div className="lg:flex">
            {/* Mobile Navigation Toggle */}
                
                
       
           

            {/* Sidebar */}
            <aside
    className={`fixed top-0 left-0 w-64 h-full bg-white shadow-lg transform z-50 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
    } transition-transform duration-300 lg:relative lg:translate-x-0 lg:h-screen`}
>
    <div className="p-4 bg-green-800 text-white">
        <div className="flex items-center">
            <ApplicationLogo />
            <span className="ml-4 text-lg font-semibold">MinSU</span>
        </div>
    </div>

    <nav className="mt-6 flex fixed">
        {/* Nav Links */}
        <ul className=''>
                        <li className="px-4 py-3 hover:bg-gray-200">
                            <NavLink 
                                href={route('dashboard')} 
                                active={route().current('dashboard')}
                                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                            >
                                <svg className="w-5 h-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                <span>Dashboard</span>
                            </NavLink>
                        </li>

                        <li className="px-4 py-3 hover:bg-gray-200">
                            <NavLink 
                                href={route('dashboard')} 
                                active={route().current('dashboard')}
                                className="flex items-center space-x-2 text-gray-700 hover:text-gray-900"
                            >
                            <svg className="w-5 h-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 2h10a2 2 0 012 2v16a2 2 0 01-2 2H7a2 2 0 01-2-2V4a2 2 0 012-2z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6" />
                            </svg>

                                <span>Accreditation</span>
                            </NavLink>
                        </li>
                        
                        <li className="px-4 py-3 hover:bg-gray-50">
                            <NavLink 
                                href={route('dashboard')} 
                                active={route().current('dashboard')}
                                className="flex items-center space-x-2 text-gray-700 hover:text-gray-800"
                            >
                                <svg className="w-5 h-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span>Scheduling</span>
                            </NavLink>
                        </li>

                        <li className="px-4 py-3 hover:bg-gray-50">
                            <NavLink 
                                href={route('dashboard')} 
                                active={route().current('dashboard')}
                                className="flex items-center space-x-2 text-gray-700 hover:text-gray-800"
                            >
                                <svg className="w-5 h-5 text-gray-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                </svg>
                                <span>Accounts</span>
                            </NavLink>
                        </li>
                    </ul>
    </nav>
</aside>

{/* Overlay */}
{isSidebarOpen && (
    <div
        className="fixed inset-0 bg-black opacity-50 z-40 lg:hidden"
        onClick={() => setIsSidebarOpen(false)}
    ></div>
)}
</div>
</>
    );
  
}