import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useHotelStore } from "../store/useHotelStore";
import HotelGrid from "../components/hotel/HotelGrid";
import { Search, MapPin, Calendar, Users } from "lucide-react";

const SearchResultsPage: React.FC = () => {
  const location = useLocation();
  const { hotels, loading, searchHotels } = useHotelStore();
  const searchParams = location.state?.searchParams || {};

  useEffect(() => {
    if (Object.keys(searchParams).length > 0) {
      searchHotels(searchParams);
    }
  }, [searchParams, searchHotels]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Search Summary */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">Search Results</h1>
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          {searchParams.location && (
            <div className="flex items-center">
              <MapPin size={16} className="mr-1" />
              <span>{searchParams.location}</span>
            </div>
          )}
          {searchParams.checkIn && (
            <div className="flex items-center">
              <Calendar size={16} className="mr-1" />
              <span>
                Check-in: {new Date(searchParams.checkIn).toLocaleDateString()}
              </span>
            </div>
          )}
          {searchParams.checkOut && (
            <div className="flex items-center">
              <Calendar size={16} className="mr-1" />
              <span>
                Check-out:{" "}
                {new Date(searchParams.checkOut).toLocaleDateString()}
              </span>
            </div>
          )}
          {searchParams.guests && (
            <div className="flex items-center">
              <Users size={16} className="mr-1" />
              <span>
                {searchParams.guests}{" "}
                {searchParams.guests === 1 ? "guest" : "guests"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-gray-600 mb-4">
        {hotels.length} hotels found
      </div>

      {/* Hotels Grid */}
      <HotelGrid
        hotels={hotels}
        loading={loading}
        columns={{
          sm: 1,
          md: 2,
          lg: 3,
          xl: 4,
        }}
        gap="gap-x-6 gap-y-8"
        skeletonCount={8}
      />
    </div>
  );
};

export default SearchResultsPage;
