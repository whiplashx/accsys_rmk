// components/Breadcrumbs.jsx
import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import ProfileSection from './ProfileSection';

export default function Breadcrumbs() {
    const { url } = usePage();
    
    // Convert URL path to breadcrumb items
    const getPathItems = () => {
        const paths = url.split('/').filter(item => item);
        let items = [];
        let fullPath = '';
        
        // Add home as first item
        items.push({
            name: 'Home',
            path: '/',
            current: paths.length === 0
        });
        
        // Build rest of the path items
        paths.forEach((item, index) => {
            fullPath += `/${item}`;
            items.push({
                name: item.charAt(0).toUpperCase() + item.slice(1),
                path: fullPath,
                current: index === paths.length - 1
            });
        });
        
        return items;
    };

    const pathItems = getPathItems();

    return (
        <>

<div className="bg-white w-full shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-3">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              {pathItems.map((item, index) => (
                <li key={item.path} className="inline-flex items-center">
                  {index > 0 && (
                    <svg 
                      className="w-4 h-4 text-green-600" 
                      fill="currentColor" 
                      viewBox="0 0 20 20"
                    >
                      <path 
                        fillRule="evenodd" 
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  <div className={`${index > 0 ? 'ml-1 md:ml-2' : ''} whitespace-nowrap`}>
                    {!item.current ? (
                      <Link
                        href={item.path}
                        className="inline-flex items-center text-sm font-medium text-green-700 hover:text-green-900 hover:underline"
                      >
                        {item.name}
                      </Link>
                    ) : (
                      <span className="text-sm font-medium text-green-500">
                        {item.name}
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        </div>
      </div>
    </div>
    </>
    );
}