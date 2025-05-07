import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

interface FullScreenGalleryProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

const FullScreenGallery: React.FC<FullScreenGalleryProps> = ({
  images,
  initialIndex = 0,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [isLoading, setIsLoading] = useState(true);
  const [backgroundImage, setBackgroundImage] = useState("");

  useEffect(() => {
    // Set the background image based on the current image
    if (images[currentIndex]) {
      setBackgroundImage(images[currentIndex]);
    }
    // Disable body scroll when gallery is open
    document.body.style.overflow = "hidden";
    return () => {
      // Re-enable body scroll when gallery is closed
      document.body.style.overflow = "auto";
    };
  }, [currentIndex, images]);

  const handleNext = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    setIsLoading(true);
  };

  const handlePrev = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
    setIsLoading(true);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowRight") handleNext();
    if (e.key === "ArrowLeft") handlePrev();
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Blurred background image */}
      <div
        className="absolute inset-0 bg-black bg-opacity-80"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          filter: "blur(15px)",
          opacity: 0.4,
        }}
      />

      {/* Overlay gradient for better visibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />

      {/* Rest of the gallery UI */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-white p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          aria-label="Close gallery"
        >
          <X size={24} />
        </button>

        {/* Image counter */}
        <div className="absolute top-4 left-4 text-white px-3 py-1.5 rounded-full bg-black bg-opacity-50 backdrop-blur-sm">
          <span className="font-medium">
            {currentIndex + 1} / {images.length}
          </span>
        </div>

        {/* Main image container */}
        <div className="w-full h-full flex items-center justify-center p-8">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white"></div>
            </div>
          )}

          <img
            src={images[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            className="max-h-full max-w-full object-contain transition-opacity duration-300 drop-shadow-lg"
            onLoad={() => setIsLoading(false)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>

        {/* Thumbnails at the bottom with improved styling */}
        <div className="absolute bottom-4 left-0 right-0">
          <div className="flex justify-center gap-2 overflow-x-auto px-4 py-3 backdrop-blur-sm bg-black/30">
            {images.map((img, index) => (
              <div
                key={index}
                className={`w-16 h-16 flex-shrink-0 cursor-pointer transition-all rounded overflow-hidden ${
                  currentIndex === index
                    ? "ring-2 ring-white opacity-100 scale-105"
                    : "opacity-60 hover:opacity-100 hover:scale-105"
                }`}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsLoading(true);
                }}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation buttons with improved styling */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-all hover:scale-110"
          aria-label="Previous image"
        >
          <ChevronLeft size={28} />
        </button>

        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 backdrop-blur-sm text-white p-3 rounded-full hover:bg-black/70 transition-all hover:scale-110"
          aria-label="Next image"
        >
          <ChevronRight size={28} />
        </button>
      </div>
    </div>
  );
};

export default FullScreenGallery;
