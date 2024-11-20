import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import NavLink from './NavLink';

const ProfileDropdown = ({ data }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="fixed top-4 right-4 z-50" ref={dropdownRef}>
      <div className="relative">
        {/* Profile Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-3 bg-white rounded-full pl-2 pr-3 py-1.5 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200"
        >
          <div className="relative">
            <img 
              src="/api/placeholder/32/32" 
              alt={`${data?.name}'s profile`} 
              className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-100"
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-white rounded-full"></div>
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium text-gray-700">{data?.name}</span>
            <ChevronDown 
              size={16}
              className={`text-gray-500 transform transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            />
          </div>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
            {/* User Info Header */}
            <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
              <div className="text-sm font-semibold text-gray-800">{data?.name}</div>
              <div className="text-xs text-gray-500 truncate">{data?.email}</div>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              <a 
                href={route('profile.edit')}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                <span className="flex-grow">Profile Settings</span>
              </a>
              <a 
                href="#account"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                <span className="flex-grow">Account Preferences</span>
              </a>
              <div className="h-px bg-gray-200 my-1"></div>
              <a 
                href="#help"
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-200"
              >
                <span className="flex-grow">Help & Support</span>
              </a>
              <div className="h-px bg-gray-200 my-1"></div>
              <a 
                href={route('logout')}
                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
              >
                <span className="flex-grow">Log Out</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileDropdown;