import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { Hotel } from "../../types";
import HotelCardSkeleton from "./HotelCardSkeleton";
import { useWishlistStore } from "../../store/useWishlistStore";
import { useUserStore } from "../../store/useUserStore";

interface HotelCardProps {
  hotel: Hotel;
  loading?: boolean;
}

const HotelCard: React.FC<HotelCardProps> = ({ hotel, loading = false }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);
  const [isImageLoaded, setIsImageLoaded] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const { wishlist, toggleWishlist } = useWishlistStore();
  const { user } = useUserStore();
  const isWishlisted = wishlist.some((w) => w.id === hotel.id);

  // Create images array from hotel data and room images
  const images = [];

  // Add hotel profile image if available
  if (hotel.profile_path) {
    images.push({
      url: `http://127.0.0.1:8000/storage/${hotel.profile_path}`,
      alt: hotel.name,
    });
  }

  // Add hotel cover image if available
  if (hotel.cover_path) {
    images.push({
      url: `http://127.0.0.1:8000/storage/${hotel.cover_path}`,
      alt: `${hotel.name} - cover`,
    });
  }

  // Add room images if available
  if (hotel.rooms && hotel.rooms.length > 0) {
    hotel.rooms.forEach((room) => {
      if (room.images && room.images.length > 0) {
        room.images.forEach((image) => {
          images.push({
            url: `http://127.0.0.1:8000/storage/${image.image_path}`,
            alt: `${hotel.name} - ${room.name}`,
          });
        });
      }
    });
  }

  // If no images are available, use a placeholder
  if (images.length === 0) {
    images.push({ url: "/placeholder-hotel.png", alt: "Hotel placeholder" });
  }

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
      setIsImageLoaded(false);
    }
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (currentImageIndex < images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
      setIsImageLoaded(false);
    }
  };

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      // Redirect to login if user is not authenticated
      window.location.href = "/login";
      return;
    }

    try {
      await toggleWishlist(hotel.id);
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  if (loading) {
    return <HotelCardSkeleton />;
  }

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative w-full h-full" style={{ opacity: 1 }}>
        {/* Wishlist button */}
        <div
          className={`absolute right-4 top-4 z-10 cursor-pointer duration-150 inline-flex justify-center items-center rounded-full h-[35px] w-[35px] backdrop-blur-md ${
            isWishlisted
              ? "bg-red-500 text-white"
              : "hover:bg-red-500 hover:text-white bg-white bg-opacity-55"
          }`}
          onClick={handleWishlistToggle}
        >
          <Heart size={18} fill={isWishlisted ? "currentColor" : "none"} />
        </div>

        {/* Hotel link with images */}
        <Link to={`/hotels/${hotel.id}`} className="block">
          <div className="relative sm:rounded-[15px] rounded-xl overflow-hidden h-[300px]">
            {/* Loading skeleton while image loads */}
            {!isImageLoaded && (
              <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>
            )}

            <img
              alt={
                images[currentImageIndex]?.alt ||
                `Hotel image ${currentImageIndex + 1}`
              }
              src={images[currentImageIndex]?.url}
              className={`w-full h-[300px] object-cover transition-opacity duration-300 ${
                isImageLoaded ? "opacity-100" : "opacity-0"
              }`}
              onLoad={handleImageLoad}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = "/placeholder-hotel.png";
                setIsImageLoaded(true);
              }}
            />

            {/* Image pagination indicator */}
            {images.length > 1 && (
              <div className="absolute bottom-3 w-full flex justify-center gap-1 z-[5]">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 rounded-full ${
                      index === currentImageIndex ? "bg-white" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            )}

            {/* Navigation buttons - only show when hovered or on mobile */}
            {(isHovered || window.innerWidth < 768) && images.length > 1 && (
              <>
                {currentImageIndex > 0 && (
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10 hover:bg-[#ffffffcd] duration-200 bg-[#ffffffb6] shadow-xs inline-flex items-center justify-center w-[30px] rounded-full h-[30px]"
                    aria-label="Previous image"
                  >
                    <ChevronLeft size={19} color="rgba(0, 0, 0, 0.64)" />
                  </button>
                )}

                {currentImageIndex < images.length - 1 && (
                  <button
                    onClick={handleNextImage}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 z-10 hover:bg-[#ffffffcd] duration-200 bg-[#ffffffb6] shadow-xs inline-flex items-center justify-center w-[30px] rounded-full h-[30px]"
                    aria-label="Next image"
                  >
                    <ChevronRight size={19} color="rgba(0, 0, 0, 0.64)" />
                  </button>
                )}
              </>
            )}
          </div>
        </Link>

        {/* Hotel details */}
        <div className="mt-2">
          <div className="flex justify-between">
            <h3 className="font-[550] text-sm">{`${hotel.city}, ${hotel.country}`}</h3>

            {/* Display rating if available */}
            {hotel.reviews && hotel.reviews.length > 0 && (
              <div className="inline-flex items-center justify-center gap-x-1.5">
                <Star size={14} fill="currentColor" />
                <span>{calculateAverageRating(hotel.reviews)}</span>
              </div>
            )}
          </div>
          <h4 className="font-normal text-[14px] text-[#717171] truncate">
            {hotel.name}
          </h4>
          <div className="mt-1.5">
            {hotel.rooms && hotel.rooms.length > 0 ? (
              <>
                <span className="text-[17px] font-medium">
                  ${getLowestPrice(hotel.rooms)}
                </span>{" "}
                <span>night</span>
              </>
            ) : (
              <span className="text-[17px] text-gray-500">
                Price unavailable
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Utility functions
const calculateAverageRating = (reviews: any[]) => {
  if (!reviews || reviews.length === 0) return null;
  const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
  return (sum / reviews.length).toFixed(1);
};

const getLowestPrice = (rooms: any[]) => {
  if (!rooms || rooms.length === 0) return null;
  const prices = rooms
    .map((room) => room.price_per_night)
    .filter((price) => price);
  return prices.length ? Math.min(...prices) : null;
};

export default HotelCard;
