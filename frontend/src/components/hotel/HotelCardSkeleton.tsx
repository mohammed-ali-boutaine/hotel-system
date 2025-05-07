import React from "react";

const HotelCardSkeleton: React.FC = () => {
  return (
    <div className="relative">
      <div className="animate-pulse">
        {/* Image skeleton */}
        <div className="sm:rounded-[15px] rounded-xl overflow-hidden h-[300px] bg-gray-200"></div>

        {/* Content skeleton */}
        <div className="mt-3">
          <div className="flex justify-between">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-[40px]"></div>
          </div>
          <div className="h-4 bg-gray-200 rounded w-3/4 mt-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3 mt-3"></div>
        </div>
      </div>
    </div>
  );
};

export default HotelCardSkeleton;
