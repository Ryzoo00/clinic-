import React from 'react';

const Spinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className={`${sizeClasses[size]} border-4 border-medical-200 border-t-medical-600 rounded-full animate-spin`}></div>
    </div>
  );
};

export default Spinner;
