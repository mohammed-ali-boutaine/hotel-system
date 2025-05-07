import React from "react";

const LoadingSpinner: React.FC = () => {
  return (
    <div className="absolute inset-0 flex justify-center items-center z-50 bg-white/60">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );
};

export default LoadingSpinner;
