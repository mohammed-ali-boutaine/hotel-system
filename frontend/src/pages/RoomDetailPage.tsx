import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
// import { RoomType } from "../types";
import FullScreenGallery from "../components/ImageSlider/FullScreenGallery";
import ImageSlider from "../components/ImageSlider/ImageSlider";
import { useRoomStore } from "../store/useRoomStore";
import { useUserStore } from "../store/useUserStore";
import { notifyError, notifySuccess } from "../utils/toast";
import axiosInstance from "../utils/axios";

const RoomDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { room, loading, error, fetchRoomDetail } = useRoomStore();
  const { user } = useUserStore();
  const navigate = useNavigate();
  const [activeImage, setActiveImage] = useState<number>(0);
  const [galleryOpen, setGalleryOpen] = useState<boolean>(false);
  const [bookingDates, setBookingDates] = useState({
    checkIn: "",
    checkOut: "",
  });
  const [guestCount, setGuestCount] = useState<number>(1);
  const [totalNights, setTotalNights] = useState<number>(1);
  const [bookingLoading, setBookingLoading] = useState<boolean>(false);

  useEffect(() => {
    if (bookingDates.checkIn && bookingDates.checkOut) {
      const start = new Date(bookingDates.checkIn);
      const end = new Date(bookingDates.checkOut);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      setTotalNights(diffDays || 1);
    }
  }, [bookingDates]);

  useEffect(() => {
    if (id) {
      fetchRoomDetail(id);
    }
  }, [id, fetchRoomDetail]);

  useEffect(() => {
    if (room?.capacity && guestCount > room.capacity) {
      setGuestCount(1);
    }
  }, [room, guestCount]);

  const handleBooking = async () => {
    if (!user) {
      notifyError("Please login to book a room");
      navigate("/login");
      return;
    }

    if (user.role !== "client") {
      notifyError("Only clients can book rooms");
      return;
    }

    if (!bookingDates.checkIn || !bookingDates.checkOut) {
      notifyError("Please select check-in and check-out dates");
      return;
    }

    try {
      setBookingLoading(true);
      const response = await axiosInstance.post("/bookings", {
        room_id: room?.id,
        check_in: bookingDates.checkIn,
        check_out: bookingDates.checkOut,
        number_of_guests: guestCount,
        special_requests: "",
      });

      notifySuccess("Room booked successfully!");
      navigate("/profile"); // Redirect to profile page where they can see their bookings
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

  const getRoomImageUrls = () => {
    if (!room || !room.images || room.images.length === 0) {
      return ["/placeholder-room.png"];
    }

    return room.images.map(
      (image) => `http://127.0.0.1:8000/storage/${image.image_path}`
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-96 bg-gray-200 rounded mb-6"></div>
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
            <div className="h-24 bg-gray-200 rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-2">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
            </div>
            <div className="h-64 bg-gray-200 rounded"></div>
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

  if (!room) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Room not found</h2>
          <p className="mt-2 text-gray-600">
            The room you're looking for doesn't exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <nav className="flex items-center text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-gray-700">
          Home
        </Link>
        <svg className="h-4 w-4 mx-2" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
            clipRule="evenodd"
          />
        </svg>
        {room.hotel && (
          <>
            <Link
              to={`/hotels/${room.hotel.id}`}
              className="hover:text-gray-700"
            >
              {room.hotel.name}
            </Link>
            <svg
              className="h-4 w-4 mx-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </>
        )}
        <span className="text-gray-700">{room.name}</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">{room.name}</h1>
        <div className="flex items-center mt-1">
          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
            {room.type}
          </span>
          <span className="mx-2 text-gray-400">•</span>
          <span className="text-gray-700">
            Room {room.room_number}, Floor {room.floor}
          </span>
          {room.is_available ? (
            <span className="ml-3 bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              Available
            </span>
          ) : (
            <span className="ml-3 bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
              Not Available
            </span>
          )}
        </div>
      </div>

      <div className="mb-8">
        <div className="relative">
          <div className="rounded-xl overflow-hidden h-96 bg-gray-100">
            {room.images && room.images.length > 0 ? (
              <div className="w-full h-full flex items-center justify-center">
                <ImageSlider
                  images={getRoomImageUrls()}
                  onImageClick={() => setGalleryOpen(true)}
                  className="w-full h-full object-contain cursor-pointer"
                />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-200">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-16 w-16 text-gray-400"
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

          {room.images && room.images.length > 1 && (
            <div className="flex space-x-2 mt-4 overflow-x-auto pb-2">
              {room.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => {
                    setActiveImage(index);
                    setGalleryOpen(true);
                  }}
                  className="w-24 h-16 flex-shrink-0 rounded-md overflow-hidden hover:opacity-90 transition-opacity"
                >
                  <img
                    src={`http://127.0.0.1:8000/storage/${image.image_path}`}
                    alt={`Room view ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-room.png";
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="md:col-span-2">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">About this room</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {room.description}
            </p>

            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                </svg>
                <span>
                  <strong>{room.capacity}</strong> guests maximum
                </span>
              </div>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-gray-500 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
                <span>
                  <strong>{room.bed_numbers}</strong> beds
                </span>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">House rules</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-3">Check-in & Check-out</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <span className="font-medium">Check-in:</span> After 3:00
                      PM
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <span className="font-medium">Check-out:</span> Before
                      11:00 AM
                    </div>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-3">Policies</h3>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <span className="font-medium">No smoking</span>
                    </div>
                  </li>
                  <li className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <span className="font-medium">No parties or events</span>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Cancellation policy</h2>
            <p className="text-gray-700 mb-4">
              Free cancellation for 48 hours. After that, cancel before 3:00 PM
              on the day of check-in and get a full refund, minus the service
              fee.
            </p>
            <ul className="mt-4 space-y-2 text-gray-700">
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-green-500 mr-2"
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
                <span>Free cancellation for 48 hours</span>
              </li>
              <li className="flex items-start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-green-500 mr-2"
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
                <span>Full refund before 3:00 PM on check-in day</span>
              </li>
            </ul>
          </div>

          {room.hotel && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">About the place</h2>
              <div className="flex items-center mb-4">
                <div className="mr-4">
                  <img
                    src={`http://127.0.0.1:8000/storage/${room.hotel.profile_path}`}
                    alt={room.hotel.name}
                    className="w-16 h-16 rounded-lg object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder-hotel.png";
                    }}
                  />
                </div>
                <div>
                  <h3 className="font-medium text-lg">{room.hotel.name}</h3>
                  <p className="text-gray-600">
                    {room.hotel.city}, {room.hotel.country}
                  </p>
                </div>
              </div>

              <p className="text-gray-700 whitespace-pre-line mb-4">
                {room.hotel.description}
              </p>

              {room.hotel.tags && room.hotel.tags.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-base font-medium mb-2">Hotel features</h4>
                  <div className="flex flex-wrap gap-2">
                    {room.hotel.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700"
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-4">
                <Link
                  to={`/hotels/${room.hotel.id}`}
                  className="text-blue-600 hover:underline flex items-center"
                >
                  <span>View more about this hotel</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          )}

          {room.amenities && room.amenities.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">
                What this room offers
              </h2>
              <div className="grid grid-cols-2 gap-4">
                {room.amenities.map((amenity, index) => (
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
                    <span className="capitalize">
                      {amenity.replace("_", " ")}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {room.hotel && (
            <div className="border-t pt-8">
              <h2 className="text-2xl font-semibold mb-4">
                Location & Contact
              </h2>
              <div className="mb-4">
                <h3 className="font-medium mb-2">Address</h3>
                <p className="text-gray-700">{room.hotel.address}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h3 className="font-medium mb-2">Contact</h3>
                  <div className="space-y-1">
                    <p className="text-gray-700 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2 text-gray-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      {room.hotel.phone}
                    </p>
                    <p className="text-gray-700 flex items-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4 mr-2 text-gray-500"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                      </svg>
                      {room.hotel.email}
                    </p>
                    {room.hotel.website && (
                      <p className="text-gray-700 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2 text-gray-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <a
                          href={room.hotel.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {room.hotel.website.replace(/^https?:\/\//, "")}
                        </a>
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-2">City</h3>
                  <p className="text-gray-700">
                    {room.hotel.city}, {room.hotel.country}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 h-fit sticky top-8">
          <div className="mb-4">
            <div className="flex items-center">
              <span className="font-semibold text-2xl text-gray-900">
                ${room.price_per_night}
              </span>
              <span className="ml-1 text-gray-600">/night</span>
            </div>
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
                      onChange={(e) =>
                        setBookingDates({
                          ...bookingDates,
                          checkIn: e.target.value,
                        })
                      }
                      min={new Date().toISOString().split("T")[0]}
                      required
                    />
                  </div>
                  <div className="pl-2">
                    <label className="block text-xs text-gray-600 uppercase">
                      Check-out
                    </label>
                    <input
                      type="date"
                      className="mt-1 block w-full border-none p-0 focus:ring-0 text-sm"
                      onChange={(e) =>
                        setBookingDates({
                          ...bookingDates,
                          checkOut: e.target.value,
                        })
                      }
                      min={
                        bookingDates.checkIn ||
                        new Date().toISOString().split("T")[0]
                      }
                      required
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
                  {[...Array(room.capacity)].map((_, i) => (
                    <option key={i} value={i + 1}>
                      {i + 1} {i === 0 ? "guest" : "guests"}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <button
            onClick={handleBooking}
            disabled={
              !bookingDates.checkIn ||
              !bookingDates.checkOut ||
              !room.is_available ||
              bookingLoading
            }
            className={`w-full ${
              room.is_available && !bookingLoading
                ? "bg-rose-600 hover:bg-rose-700"
                : "bg-gray-400 cursor-not-allowed"
            } text-white rounded-lg py-3 font-medium transition-colors`}
          >
            {bookingLoading
              ? "Processing..."
              : room.is_available
              ? "Reserve"
              : "Not Available"}
          </button>

          <div className="mt-4 text-center text-gray-500 text-sm">
            You won't be charged yet
          </div>

          {bookingDates.checkIn && bookingDates.checkOut && (
            <div className="mt-6 border-t pt-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">
                  ${room.price_per_night} x {totalNights}{" "}
                  {totalNights === 1 ? "night" : "nights"}
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Cleaning fee</span>
                <span>$40.00</span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Service fee</span>
                <span>$35.00</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-4 mt-4">
                <span>Total before taxes</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {galleryOpen && (
        <FullScreenGallery
          images={getRoomImageUrls()}
          initialIndex={activeImage}
          onClose={() => setGalleryOpen(false)}
        />
      )}
    </div>
  );
};

export default RoomDetailPage;
