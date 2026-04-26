import React from 'react';

interface Props {
  className?: string;
}

export default function Logo({ className = "w-8 h-8" }: Props) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 32 32" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Front box (current state) */}
      <rect x="12" y="12" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="2.5" />
      
      {/* Back box (previous state, dotted) */}
      <rect x="6" y="6" width="14" height="14" rx="3" stroke="currentColor" strokeWidth="2.5" strokeDasharray="3 3" className="opacity-40" />
      
      {/* Connecting dots (representing diff/time) */}
      <circle cx="12" cy="12" r="2" fill="currentColor" />
      <circle cx="20" cy="20" r="2" fill="currentColor" />
      
      {/* Glow effect */}
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
    </svg>
  );
}
