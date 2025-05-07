import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Hotel } from "../types";
import axiosInstance from "../utils/axios";
import HotelMap from "../components/map/HotelMap";
import ImageSlider from "../components/ImageSlider/ImageSlider";
import FullScreenGallery from "../components/ImageSlider/FullScreenGallery";
import Button from "../components/static/Button";
import { useUserStore } from "../store/useUserStore";
import { notifyError, notifySuccess } from "../utils/toast";

const HotelDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useUserStore();
  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [galleryOpen, setGalleryOpen] = useState<boolean>(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [bookingDates, setBookingDates] = useState({
    checkIn: "",
    checkOut: "",
  });
  const [guestCount, setGuestCount] = useState<number>(1);
  const [bookingLoading, setBookingLoading] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<string>("price_asc");

  useEffect(() => {
    const fetchHotelDetail = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/hotels/${id}`);
        console.log(response.data);

        // Ensure coordinate is properly parsed if it's a string
        const hotelData = response.data;
        if (hotelData.coordinate && typeof hotelData.coordinate === "string") {
          try {
            hotelData.coordinate = JSON.parse(hotelData.coordinate);
          } catch (e) {
            console.error("Error parsing coordinates:", e);
            hotelData.coordinate = { lat: 0, lng: 0 };
          }
        }

        setHotel(hotelData);
        setError(null);
      } catch (err) {
        console.error("Error fetching hotel details:", err);
        setError("Failed to load hotel details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchHotelDetail();
    }
  }, [id]);

  // Helper to get all image URLs for the hotel
  const getAllImageUrls = (hotelObj: Hotel | null) => {
    if (!hotelObj) return [];

    const imageUrls: string[] = [];

    // Add cover image if it exists
    if (hotelObj.cover_path) {
      imageUrls.push(`http://127.0.0.1:8000/storage/${hotelObj.cover_path}`);
    }

    // Add profile image if it exists
    if (hotelObj.profile_path) {
      imageUrls.push(`http://127.0.0.1:8000/storage/${hotelObj.profile_path}`);
    }

    // Add room images if they exist
    hotelObj.rooms?.forEach((room) => {
      if (room.images && room.images.length > 0) {
        room.images.forEach((image) => {
          imageUrls.push(`http://127.0.0.1:8000/storage/${image.image_path}`);
        });
      }
    });

    return imageUrls;
  };

  // Handle opening the fullscreen gallery with a specific image
  const openGallery = (index: number) => {
    setSelectedImageIndex(index);
    setGalleryOpen(true);
  };

  const handleQuickBook = async () => {
    if (!user) {
      notifyError("Please login to book a room");
      navigate("/login");
      return;
    }

    if (user.role !== "client") {
      notifyError("Only clients can book rooms");
      return;
    }

    if (!hotel?.rooms || hotel.rooms.length === 0) {
      notifyError("No rooms available for booking");
      return;
    }

    if (!bookingDates.checkIn || !bookingDates.checkOut) {
      notifyError("Please select check-in and check-out dates");
      return;
    }

    try {
      setBookingLoading(true);
      await axiosInstance.post("/bookings", {
        room_id: hotel.rooms[0].id,
        check_in: bookingDates.checkIn,
        check_out: bookingDates.checkOut,
        number_of_guests: guestCount,
        special_requests: "",
      });

      notifySuccess("Room booked successfully!");
      navigate("/profile");
    } catch (err: any) {
      if (err.response?.data?.message) {
        notifyError(err.response.data.message);
      } else {
        notifyError("Failed to book room. Please try again.");
      }
    } finally {
      setBookingLoading(false);
    }
  };

  // Add filtering and sorting logic
  const getFilteredAndSortedRooms = () => {
    if (!hotel?.rooms) return [];

    let filteredRooms = [...hotel.rooms];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredRooms = filteredRooms.filter(
        (room) =>
          room.name.toLowerCase().includes(query) ||
          room.description.toLowerCase().includes(query) ||
          room.type.toLowerCase().includes(query)
      );
    }

    // Apply tag filters
    if (selectedTags.length > 0) {
      filteredRooms = filteredRooms.filter((room) => {
        // Get room amenities as an array
        const roomAmenities = Array.isArray(room.amenities)
          ? room.amenities
          : room.amenities
          ? [room.amenities]
          : [];

        // Check if room has all selected tags
        return selectedTags.every((tag) =>
          roomAmenities.some((amenity) =>
            amenity.toLowerCase().includes(tag.toLowerCase())
          )
        );
      });
    }

    // Apply sorting
    switch (sortBy) {
      case "price_asc":
        filteredRooms.sort((a, b) => a.price_per_night - b.price_per_night);
        break;
      case "price_desc":
        filteredRooms.sort((a, b) => b.price_per_night - a.price_per_night);
        break;
      case "capacity":
        filteredRooms.sort((a, b) => b.capacity - a.capacity);
        break;
      default:
        break;
    }

    return filteredRooms;
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-96 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
          <div className="h-6 bg-gray-200 w-1/2 rounded mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="h-48 bg-gray-200 rounded"></div>
            <div className="h-48 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Hotel not found</h2>
          <p className="mt-2 text-gray-600">
            The hotel you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hotel Name & Location Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{hotel.name}</h1>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-500"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="ml-1 text-gray-700">
              {hotel.city}, {hotel.country}
            </span>
          </div>
          <div className="flex items-center">
            <a
              href={hotel.website}
              className="text-blue-600 hover:underline flex items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              Visit Website
            </a>
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-3">
            <div className="rounded-lg overflow-hidden h-96 bg-gray-100">
              <div className="w-full h-full flex items-center justify-center">
                <ImageSlider
                  images={getAllImageUrls(hotel)}
                  onImageClick={(index) => openGallery(index)}
                  className="w-full h-full object-contain cursor-pointer"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {/* Show thumbnails of available images */}
            <div className="grid grid-cols-2 gap-2">
              {/* Show first 4 thumbnails or less if there aren't enough images */}
              {getAllImageUrls(hotel)
                .slice(0, 4)
                .map((imgUrl, index) => (
                  <div
                    key={index}
                    className="rounded-lg overflow-hidden h-20 bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => openGallery(index)}
                  >
                    <img
                      src={imgUrl}
                      alt={`Hotel image ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-hotel.png";
                      }}
                    />
                  </div>
                ))}

              {/* Show "more images" thumbnail if there are more than 4 images */}
              {getAllImageUrls(hotel).length > 4 && (
                <div
                  className="rounded-lg overflow-hidden h-20 bg-gray-100 relative cursor-pointer"
                  onClick={() => openGallery(4)}
                >
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white">
                    <span>+{getAllImageUrls(hotel).length - 4} more</span>
                  </div>
                  {getAllImageUrls(hotel)[4] && (
                    <img
                      src={getAllImageUrls(hotel)[4]}
                      alt={`Hotel image 5`}
                      className="w-full h-full object-cover opacity-70"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder-hotel.png";
                      }}
                    />
                  )}
                </div>
              )}
            </div>

            {/* Hotel Quick Info Section */}
            <div className="bg-white p-4 rounded-lg shadow border border-gray-100">
              <h3 className="font-medium text-lg mb-2">Quick Info</h3>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                  <span className="text-gray-700">
                    {hotel.rooms?.length || 0} Rooms Available
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-gray-500 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span className="text-gray-700">
                    {hotel.city}, {hotel.country}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hotel Description & Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2">
          <div className="border-b pb-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold">{hotel.name}</h2>
                <p className="text-gray-600">Hosted by {hotel.owner?.name}</p>
              </div>
              <div>
                <img
                  src={
                    hotel.profile_path
                      ? `http://127.0.0.1:8000/storage/${hotel.profile_path}`
                      : "/placeholder-hotel.png"
                  }
                  alt={hotel.owner?.name || "Hotel owner"}
                  className="w-12 h-12 rounded-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = "/placeholder-hotel.png";
                  }}
                />
              </div>
            </div>
          </div>

          <div className="mb-6">
            <h3 className="text-xl font-medium mb-4">About this hotel</h3>
            <p className="text-gray-700 whitespace-pre-line">
              {hotel.description}
            </p>
          </div>

          {hotel.tags && hotel.tags.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-medium mb-4">
                What this hotel offers
              </h3>
              <div className="grid grid-cols-2 gap-4">
                {hotel.tags.map((tag, index) => (
                  <div key={index} className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{tag.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 h-fit sticky top-8">
          <div className="mb-4">
            <div className="flex items-center">
              <span className="font-semibold text-2xl text-gray-900">
                ${hotel.rooms_min_price_per_night || "Price unavailable"}
              </span>
              <span className="ml-1 text-gray-600">/night</span>
            </div>
            {hotel.reviews_avg_rating && (
              <div className="flex items-center mt-1">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="ml-1 text-sm text-gray-700">
                  {hotel.reviews_avg_rating} ·{" "}
                  <span className="underline">Reviews</span>
                </span>
              </div>
            )}
          </div>

          <div className="mb-6">
            <div className="border rounded-lg overflow-hidden">
              <div className="p-4 border-b">
                <div className="grid grid-cols-2">
                  <div className="border-r pr-2">
                    <label className="block text-xs text-gray-600 uppercase">
                      Check-in
                    </label>
                    <input
                      type="date"
                      className="mt-1 block w-full border-none p-0 focus:ring-0 text-sm"
                      min={new Date().toISOString().split("T")[0]}
                      value={bookingDates.checkIn}
                      onChange={(e) =>
                        setBookingDates({
                          ...bookingDates,
                          checkIn: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="pl-2">
                    <label className="block text-xs text-gray-600 uppercase">
                      Check-out
                    </label>
                    <input
                      type="date"
                      className="mt-1 block w-full border-none p-0 focus:ring-0 text-sm"
                      min={
                        bookingDates.checkIn ||
                        new Date().toISOString().split("T")[0]
                      }
                      value={bookingDates.checkOut}
                      onChange={(e) =>
                        setBookingDates({
                          ...bookingDates,
                          checkOut: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="p-4">
                <label className="block text-xs text-gray-600 uppercase">
                  Guests
                </label>
                <select
                  className="mt-1 block w-full border-none p-0 focus:ring-0 text-sm"
                  value={guestCount}
                  onChange={(e) => setGuestCount(parseInt(e.target.value))}
                >
                  {[...Array(10)].map((_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1} {i === 0 ? "guest" : "guests"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <Button
            fullWidth={true}
            onClick={handleQuickBook}
            disabled={
              !bookingDates.checkIn || !bookingDates.checkOut || bookingLoading
            }
          >
            {bookingLoading ? "Processing..." : "Book Now"}
          </Button>

          <div className="mt-4 text-center text-gray-500 text-sm">
            You won't be charged yet
          </div>

          {hotel.rooms_min_price_per_night && (
            <div className="mt-6 border-t pt-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">
                  ${hotel.rooms_min_price_per_night} x 5 nights
                </span>
                <span>
                  $
                  {(parseFloat(hotel.rooms_min_price_per_night) * 5).toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Cleaning fee</span>
                <span>$60.00</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Service fee</span>
                <span>$45.00</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-4 mt-4">
                <span>Total before taxes</span>
                <span>
                  $
                  {(
                    parseFloat(hotel.rooms_min_price_per_night) * 5 +
                    60 +
                    45
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Available Rooms Section */}
      <div className="border-t pt-8">
        <div className="flex flex-col space-y-4 mb-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Available Rooms</h2>
            <div className="flex items-center space-x-2">
              <label htmlFor="sort" className="text-sm text-gray-600">
                Sort by:
              </label>
              <select
                id="sort"
                className="border rounded-lg px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="capacity">Capacity</option>
              </select>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search rooms by name, type, or description..."
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400 absolute right-3 top-2.5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          {/* Tag Filters */}
          <div className="flex flex-wrap gap-2">
            {hotel?.tags?.map((tag) => (
              <button
                key={tag.id}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedTags.includes(tag.name)
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => {
                  setSelectedTags((prev) =>
                    prev.includes(tag.name)
                      ? prev.filter((t) => t !== tag.name)
                      : [...prev, tag.name]
                  );
                }}
              >
                {tag.name}
                {selectedTags.includes(tag.name) && (
                  <span className="ml-1">×</span>
                )}
              </button>
            ))}
          </div>

          {/* Clear Filters Button */}
          {(searchQuery || selectedTags.length > 0) && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedTags([]);
              }}
              className="text-sm text-blue-600 hover:text-blue-800 self-start"
            >
              Clear all filters
            </button>
          )}

          {/* Results Count */}
          <div className="text-sm text-gray-600">
            {getFilteredAndSortedRooms().length} rooms found
          </div>
        </div>

        {getFilteredAndSortedRooms().length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {getFilteredAndSortedRooms().map((room) => (
              <div
                key={room.id}
                className="border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                {/* Room Images Carousel */}
                <div className="relative">
                  <div className="relative h-64 overflow-hidden bg-gray-100">
                    {room.images && room.images.length > 0 ? (
                      <>
                        <div className="h-full overflow-hidden flex items-center justify-center">
                          <ImageSlider
                            images={room.images.map(
                              (image) =>
                                `http://127.0.0.1:8000/storage/${image.image_path}`
                            )}
                            onImageClick={(index) => {
                              // Calculate the index in the full gallery
                              const hotelImagesCount =
                                (hotel.cover_path ? 1 : 0) +
                                (hotel.profile_path ? 1 : 0);

                              // Find the starting index for this room's images
                              let startIndex = hotelImagesCount;
                              for (
                                let i = 0;
                                i < hotel.rooms.indexOf(room);
                                i++
                              ) {
                                if (hotel.rooms[i].images) {
                                  startIndex += hotel.rooms[i].images.length;
                                }
                              }

                              openGallery(startIndex + index);
                            }}
                            className="w-full h-full object-cover cursor-pointer"
                          />
                        </div>
                        {/* Image counter badge */}
                        {room.images.length > 1 && (
                          <div className="absolute bottom-2 right-2 bg-gray-900 bg-opacity-70 text-white text-xs px-2 py-1 rounded-md">
                            <span>{room.images.length} photos</span>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-16 w-16 text-gray-300"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>
                </div>

                {/* Room Info */}
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-xl text-gray-900">
                        {room.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        {room.type} · Room {room.room_number} · Floor{" "}
                        {room.floor}
                      </p>
                    </div>
                    <div className="flex items-center bg-blue-50 px-3 py-1 rounded-full">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 text-blue-600 mr-1"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                      </svg>
                      <span className="text-sm font-medium text-blue-700">
                        {room.capacity} guests
                      </span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-gray-700 mb-4 line-clamp-2">
                      {room.description}
                    </p>
                  </div>

                  {/* Room features */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Room features
                    </h4>
                    <div className="grid grid-cols-2 gap-y-2">
                      {room.bed_numbers > 0 && (
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-gray-500 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-sm text-gray-600">
                            {room.bed_numbers} beds
                          </span>
                        </div>
                      )}
                      {room.amenities && room.amenities.includes("wifi") && (
                        <div className="flex items-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4 text-gray-500 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          <span className="text-sm text-gray-600">
                            Free WiFi
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom section with price and button */}
                  <div className="flex justify-between items-center border-t pt-4 mt-2">
                    <div>
                      <span className="font-semibold text-xl">
                        ${room.price_per_night}
                      </span>
                      <span className="text-gray-600 text-sm">/night</span>
                    </div>

                    <Button to={`/rooms/${room.id}`}>
                      <span>View Details</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 border rounded-lg">
            <p className="text-gray-500">No rooms available at the moment.</p>
          </div>
        )}
      </div>

      {/* Location Section */}
      <div className="mt-12 border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">Location</h2>
        <div
          className="bg-gray-100 rounded-lg overflow-hidden"
          style={{ height: "400px" }}
        >
          {hotel.coordinate && (
            <HotelMap
              lat={hotel.coordinate.lat}
              lng={hotel.coordinate.lng}
              hotelName={hotel.name}
            />
          )}
        </div>
        <p className="mt-4 text-gray-700">{hotel.address}</p>
      </div>

      {/* Contact Section */}
      <div className="mt-12 border-t pt-8 pb-12">
        <h2 className="text-2xl font-bold mb-6">Contact</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex items-center">
            <div className="bg-gray-100 p-3 rounded-full mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Phone</h3>
              <p className="text-gray-600">{hotel.phone}</p>
            </div>
          </div>
          <div className="flex items-center">
            <div className="bg-gray-100 p-3 rounded-full mr-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-gray-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <div>
              <h3 className="font-medium">Email</h3>
              <p className="text-gray-600">{hotel.email}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Fullscreen Gallery */}
      {galleryOpen && (
        <FullScreenGallery
          images={getAllImageUrls(hotel)}
          initialIndex={selectedImageIndex}
          onClose={() => setGalleryOpen(false)}
        />
      )}
    </div>
  );
};

export default HotelDetailPage;
