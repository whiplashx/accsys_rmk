import React from 'react';

export default function Progress({ value = 100 }) {
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (value / 100) * circumference;
  
  return (
    <div className="relative w-48 h-48 flex items-center justify-center bg-gray-100 rounded-lg ">
      <svg className="transform -rotate-90 w-40 h-40">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#40E0D0" />
            <stop offset="100%" stopColor="#00CED1" />
          </linearGradient>
        </defs>
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke="#1a1a1a"
          strokeWidth="8"
          fill="none"
        />
        <circle
          cx="80"
          cy="80"
          r={radius}
          stroke="url(#gradient)"
          strokeWidth="8"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute text-3xl font-semibold text-gray-900">
        {value}%
      </div>
    </div>
  );
}

