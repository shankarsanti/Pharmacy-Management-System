import React from 'react';

const LoadingSpinner = ({ text = 'Loading...' }) => (
    <div className="flex flex-col items-center justify-center py-20">
        <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-sm text-gray-500 mt-4">{text}</p>
    </div>
);

export default LoadingSpinner;
