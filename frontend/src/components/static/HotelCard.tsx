import React, { useState } from 'react';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';

interface BookingCardProps {
  location: string;
  description: string;
  dateRange: string;
  price: number;
  rating: number;
  images: string[];
  currency?: string;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
}

const HotelCard: React.FC<BookingCardProps> = ({
  location,
  description,
  dateRange,
  price,
  rating,
  images,
  currency = '$',
  isFavorite = false,
  onFavoriteToggle = () => {},
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const goToNextImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const goToPrevImage = () => {
    setCurrentImageIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
  };

  return (
    <div className="max-w-xs rounded-lg overflow-hidden shadow-md bg-white">
      {/* Image container with heart icon and navigation */}
      <div className="relative">
        <div className="bg-gray-300 h-52 w-full relative">
          {/* Images */}
          {images.length > 0 ? (
            <div 
              className="absolute inset-0 bg-cover bg-center transition-opacity duration-300" 
              style={{ backgroundImage: `url(${images[currentImageIndex] || '/api/placeholder/400/320'})` }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
              <img src="/api/placeholder/400/320" alt="placeholder" />
            </div>
          )}
          
          {/* Heart/favorite button */}
          <button 
            className="absolute top-2 right-2 p-1 rounded-full bg-white/80 hover:bg-white z-10"
            onClick={onFavoriteToggle}
          >
            <Heart 
              size={20} 
              className={isFavorite ? "text-red-500 fill-red-500" : "text-gray-500"} 
            />
          </button>
          
          {/* Navigation arrows - only show if multiple images */}
          {images.length > 1 && (
            <>
              <button 
                className="absolute left-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-white/80 hover:bg-white z-10"
                onClick={goToPrevImage}
              >
                <ChevronLeft size={20} className="text-gray-700" />
              </button>
              
              <button 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 rounded-full bg-white/80 hover:bg-white z-10"
                onClick={goToNextImage}
              >
                <ChevronRight size={20} className="text-gray-700" />
              </button>
            </>
          )}
          
          {/* Pagination dots */}
          {images.length > 1 && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center">
              <div className="flex space-x-1">
                {images.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goToImage(i)}
                    className={`h-1.5 w-1.5 rounded-full ${
                      i === currentImageIndex ? 'bg-white' : 'bg-white/50'
                    }`}
                    aria-label={`Go to image ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Content */}
      <div className="p-3">
        {/* Location + Rating */}
        <div className="flex justify-between items-center mb-1">
          <h3 className="font-medium text-sm">{location}</h3>
          <div className="flex items-center">
            <span className="text-xs mr-1">★</span>
            <span className="text-xs">{rating.toFixed(2)}</span>
          </div>
        </div>
        
        {/* Property details */}
        <p className="text-gray-500 text-xs mb-1">{description}</p>
        
        {/* Date range */}
        <p className="text-gray-500 text-xs mb-1">{dateRange}</p>
        
        {/* Price */}
        <p className="mt-2 text-sm">
          <span className="font-semibold">{currency}{price}</span>
          <span className="text-gray-500"> night</span>
        </p>
      </div>
    </div>
  );
};

export default HotelCard;