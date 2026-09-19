import React, { useId } from 'react';

interface ErexLogoProps {
  className?: string;
  withGlow?: boolean;
}

export function ErexLogo({ className = "w-8 h-8", withGlow = false }: ErexLogoProps) {
  const gradId = useId();

  return (
    <div className={`relative inline-flex items-center justify-center flex-shrink-0 ${className}`}>
      {withGlow && (
        <div 
          className="absolute inset-0 rounded-full blur-md opacity-50 pointer-events-none"
          style={{
            background: 'radial-gradient(circle, rgba(46, 94, 255, 0.4) 0%, rgba(22, 199, 154, 0.2) 100%)'
          }}
        />
      )}
      <svg 
        viewBox="0 0 200 200" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full relative z-10"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="200" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#2E5EFF" />
            <stop offset="1" stopColor="#16C79A" />
          </linearGradient>
        </defs>
        <polygon points="34,44 172,44 158,70 30,70" fill={`url(#${gradId})`} />
        <polygon points="34,87 138,87 124,113 30,113" fill={`url(#${gradId})`} />
        <polygon points="34,130 172,130 158,156 30,156" fill={`url(#${gradId})`} />
      </svg>
    </div>
  );
}
