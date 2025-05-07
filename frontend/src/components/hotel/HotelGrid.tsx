import React, { useState, useEffect } from "react";
import { Hotel } from "../../types";
import HotelCardSkeleton from "./HotelCardSkeleton";
import HotelCard from "./HotelCard";

interface HotelGridProps {
  hotels: Hotel[];
  loading?: boolean;
  columns?: {
    sm?: number;
    md?: number;
    lg?: number;
    xl?: number;
  };
  gap?: string;
  skeletonCount?: number;
  itemsPerPage?: number;
}

const HotelGrid: React.FC<HotelGridProps> = ({
  hotels,
  loading = false,
  columns = {
    sm: 1,
    md: 2,
    lg: 3,
    xl: 4,
  },
  gap = "gap-x-6 gap-y-8",
  skeletonCount = 9,
  itemsPerPage = 12,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentHotels, setCurrentHotels] = useState<Hotel[]>([]);
  const [totalPages, setTotalPages] = useState(1);

  // Reset to first page when hotels data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [hotels]);

  // Update currentHotels whenever hotels or currentPage changes
  useEffect(() => {
    // Calculate total pages
    const calculatedTotalPages = Math.max(
      1,
      Math.ceil(hotels.length / itemsPerPage)
    );
    setTotalPages(calculatedTotalPages);

    // Get current hotels to display
    const indexOfLastHotel = currentPage * itemsPerPage;
    const indexOfFirstHotel = indexOfLastHotel - itemsPerPage;

    // Ensure currentPage is never beyond total pages
    if (currentPage > calculatedTotalPages && calculatedTotalPages > 0) {
      setCurrentPage(calculatedTotalPages);
    } else {
      setCurrentHotels(hotels.slice(indexOfFirstHotel, indexOfLastHotel));
    }
  }, [hotels, currentPage, itemsPerPage]);

  // Change page
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    // Scroll to top when changing pages
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Navigate to previous and next page
  const goToPrevPage = () => {
    if (currentPage > 1) {
      paginate(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      paginate(currentPage + 1);
    }
  };

  // Determine grid columns based on screen size
  const getGridColsClasses = () => {
    const classes = [];

    if (columns.sm) classes.push(`grid-cols-${columns.sm}`);
    if (columns.md) classes.push(`md:grid-cols-${columns.md}`);
    if (columns.lg) classes.push(`lg:grid-cols-${columns.lg}`);
    if (columns.xl) classes.push(`xl:grid-cols-${columns.xl}`);

    return classes.join(" ");
  };

  const gridClasses = `grid ${getGridColsClasses()} ${gap}`;

  if (loading) {
    // When loading, show skeleton placeholders
    return (
      <div className={gridClasses}>
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <HotelCardSkeleton key={`skeleton-${index}`} />
        ))}
      </div>
    );
  }

  if (!hotels || hotels.length === 0) {
    // When no hotels are found
    return (
      <div className="col-span-full py-10 text-center">
        <h2 className="text-xl font-medium mb-2">No hotels found</h2>
        <p className="text-gray-500">
          Try adjusting your search or browse different categories
        </p>
      </div>
    );
  }

  // Render actual hotel cards with pagination
  return (
    <>
      <div className={gridClasses}>
        {currentHotels.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center mt-8 space-x-2">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className={`px-3 py-1 rounded-md ${
              currentPage === 1
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white border-1 border-[var(--primary-color)] text-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-white"
            }`}
            aria-label="Previous page"
          >
            Previous
          </button>

          {/* Page numbers */}
          <div className="flex space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(
              (number) => {
                // Display current page, first page, last page, and pages adjacent to current page
                if (
                  number === 1 ||
                  number === totalPages ||
                  (number >= currentPage - 1 && number <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={number}
                      onClick={() => paginate(number)}
                      className={`w-8 h-8 rounded-md ${
                        currentPage === number
                          ? "bg-[var(--primary-color)] text-white border-[var(--primary-color)]"
                          : "bg-white border-1 border-[var(--primary-color)] text-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-white"
                      }`}
                      aria-label={`Go to page ${number}`}
                      aria-current={currentPage === number ? "page" : undefined}
                    >
                      {number}
                    </button>
                  );
                }

                // Add ellipsis for gaps in pagination
                if (
                  (number === 2 && currentPage > 3) ||
                  (number === totalPages - 1 && currentPage < totalPages - 2)
                ) {
                  return (
                    <span key={number} className="px-2" aria-hidden="true">
                      &hellip;
                    </span>
                  );
                }

                return null;
              }
            )}
          </div>

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className={`px-3 py-1 rounded-md ${
              currentPage === totalPages
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-white border-1 border-[var(--primary-color)] text-[var(--primary-color)] hover:bg-[var(--primary-color)] hover:text-white"
            }`}
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export default HotelGrid;
