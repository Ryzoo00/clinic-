import React from 'react';

const Spinner = ({ size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="relative">
        <div className={`${sizeClasses[size]} border-4 border-medical-200/50 dark:border-medical-800/50 border-t-medical-500 dark:border-t-medical-400 rounded-full animate-spin`}></div>
        <div className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-t-medical-300/30 dark:border-t-medical-300/10 rounded-full animate-spin`} style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
      </div>
    </div>
  );
};

export default Spinner;
