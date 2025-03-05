import React from 'react';

export default function ApplicationLogo({ className }) {
    // Remove any <a> tags if they exist in this component
    // Just return the logo SVG or image without any anchor tags
    return (
        <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
            {/* This is just a placeholder SVG. Keep your actual logo SVG here */}
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
        </svg>
    );
}
