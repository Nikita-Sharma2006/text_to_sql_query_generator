import React from 'react';

const Loader = ({ size = 'md', className = '', label = 'Invoking Shogun AI...' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4'
  };

  return (
    <div className={`flex flex-col items-center justify-center gap-3 ${className}`}>
      <div 
        className={`
          animate-spin rounded-full border-solid border-[#111111]/10 border-t-[#B8FF4F]
          ${sizeClasses[size]}
        `}
      ></div>
      {label && (
        <span className="font-sans font-medium tracking-tight text-[#6B7280] text-xs animate-pulse">
          {label}
        </span>
      )}
    </div>
  );
};

export default Loader;
