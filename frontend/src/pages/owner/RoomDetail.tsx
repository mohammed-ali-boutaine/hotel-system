import axiosInstance from "../../utils/axios";
import LoadingSpinner from "../../components/static/LoadingSpinner";
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Room } from "../../types";

const RoomDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/rooms/${id}`);
        setRoom(response.data.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching room details:", err);
        setError("Failed to fetch room details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRoomData();
    }
  }, [id]);

  const handleNextImage = () => {
    if (room?.images && room.images.length > 0) {
      setActiveImageIndex((prev) => (prev + 1) % room.images.length);
    }
  };

  const handlePrevImage = () => {
    if (room?.images && room.images.length > 0) {
      setActiveImageIndex(
        (prev) => (prev - 1 + room.images.length) % room.images.length
      );
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this room?")) return;
    try {
      await axiosInstance.delete(`/rooms/${id}`);
      navigate(-1);
    } catch (err) {
      console.error(err);
      alert("Failed to delete room.");
    }
  };

  if (loading) return <LoadingSpinner />;
  if (error) return (
    <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-md bg-red-50 border border-red-200">
      <div className="text-red-500 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-lg font-medium">{error}</p>
        <button 
          onClick={() => navigate(-1)} 
          className="mt-4 px-4 py-2 text-white rounded-lg" 
          style={{ backgroundColor: 'var(--primary-color)' }}
        >
          Go Back
        </button>
      </div>
    </div>
  );
  if (!room) return (
    <div className="max-w-4xl mx-auto p-6 rounded-lg shadow-md bg-gray-50 border border-gray-200">
      <div className="text-center py-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-lg font-medium text-gray-700">Room not found.</p>
        <button 
          onClick={() => navigate(-1)} 
          className="mt-4 px-4 py-2 text-white rounded-lg" 
          style={{ backgroundColor: 'var(--primary-color)' }}
        >
          Return to Rooms
        </button>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-xl shadow-lg border" style={{ borderColor: 'var(--main-border)' }}>
      {/* Image Gallery */}
      <div className="mb-8">
        <div className="relative rounded-xl overflow-hidden h-96">
          {room.images && room.images.length > 0 ? (
            <>
              <img
                src={`http://127.0.0.1:8000/storage/${room.images[activeImageIndex].image_path}`}
                alt={`Room ${room.room_number}`}
                className="w-full h-full object-cover"
              />
              {room.images.length > 1 && (
                <div className="absolute inset-0 flex items-center justify-between">
                  <button
                    onClick={handlePrevImage}
                    className="ml-4 bg-white bg-opacity-80 text-gray-800 w-10 h-10 flex items-center justify-center rounded-full hover:bg-opacity-100 transition-all"
                    style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="mr-4 bg-white bg-opacity-80 text-gray-800 w-10 h-10 flex items-center justify-center rounded-full hover:bg-opacity-100 transition-all"
                    style={{ boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
              
              {/* Image Counter */}
              <div className="absolute bottom-4 right-4 bg-white px-3 py-1 rounded-full text-sm font-medium shadow-md">
                {activeImageIndex + 1} / {room.images.length}
              </div>
              
              {/* Room Type Badge */}
              <div 
                className="absolute top-4 left-4 px-3 py-1 rounded-full text-white text-sm font-medium"
                style={{ backgroundColor: 'var(--primary-color)' }}
              >
                {room.type}
              </div>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-gray-500 font-medium">No images available for this room</p>
            </div>
          )}
        </div>
        
        {/* Image Thumbnails */}
        {room.images && room.images.length > 1 && (
          <div className="mt-4 flex space-x-2 overflow-x-auto pb-2">
            {room.images.map((image, index) => (
              <img
                key={index}
                src={`http://127.0.0.1:8000/storage/${image.image_path}`}
                alt={`Room thumbnail ${index + 1}`}
                className={`h-20 w-28 object-cover cursor-pointer rounded-lg transition-all ${
                  activeImageIndex === index 
                    ? 'ring-2 ring-offset-2 scale-105' 
                    : 'opacity-70 hover:opacity-100'
                }`}
                style={{ 
                  '--tw-ring-color': activeImageIndex === index ? 'var(--primary-color)' : 'transparent' 
                } as React.CSSProperties}
                onClick={() => setActiveImageIndex(index)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Room Name and Availability Tag */}
      <div className="flex flex-wrap items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{room.name}</h1>
        <div 
          className={`px-4 py-1 rounded-full text-sm font-medium ${
            room.is_available 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}
        >
          {room.is_available ? "Available" : "Not Available"}
        </div>
      </div>

      {/* Room Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Details */}
        <div className="lg:col-span-2">
          <div className="prose max-w-none mb-8">
            <p className="text-gray-700 text-lg leading-relaxed">{room.description}</p>
          </div>
          
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4 pb-2 border-b" style={{ borderColor: 'var(--main-border)' }}>
              Room Information
            </h2>
            <div className="grid grid-cols-2 gap-y-4">
              <div>
                <p className="text-gray-500 text-sm">Room Number</p>
                <p className="font-medium">{room.room_number}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Floor</p>
                <p className="font-medium">{room.floor}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Capacity</p>
                <p className="font-medium">{room.capacity} {room.capacity > 1 ? "people" : "person"}</p>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Beds</p>
                <p className="font-medium">{room.bed_numbers}</p>
              </div>
            </div>
          </div>

          {/* Amenities */}
          {room.amenities && room.amenities.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4 pb-2 border-b" style={{ borderColor: 'var(--main-border)' }}>
                Amenities
              </h2>
              <div className="flex flex-wrap gap-2">
                {room.amenities.map((amenity, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-sm flex items-center"
                    style={{ backgroundColor: 'var(--gray-color)', color: '#505050' }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {amenity}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Price and Actions */}
        <div>
          <div className="sticky top-6 bg-gray-50 p-6 rounded-xl border shadow-sm" style={{ borderColor: 'var(--main-border)' }}>
            <div className="flex justify-between items-center mb-6">
              <div>
                <p className="text-gray-500">Price per night</p>
                <p className="text-3xl font-bold" style={{ color: "var(--secondary-color)" }}>${room.price_per_night}</p>
              </div>
            </div>


            
            <div className="space-y-3">
              <button
                onClick={() => navigate(`/owner/hotels/${room.hotel?.id}/rooms/${id}/edit`)}
                className="w-full py-2 bg-white border border-gray-300 text-gray-700 rounded-lg flex items-center justify-center font-medium hover:bg-gray-50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Edit Room
              </button>
              <button
                onClick={handleDelete}
                className="w-full py-2 bg-white border border-red-300 text-red-600 rounded-lg flex items-center justify-center font-medium hover:bg-red-50 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                Delete Room
              </button>
            </div>
            
            <div className="mt-6 pt-6 border-t text-center" style={{ borderColor: 'var(--main-border)' }}>
              <p className="text-sm text-gray-500">
                Need assistance? Contact support
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomDetail;