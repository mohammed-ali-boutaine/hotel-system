import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axios";
import { HotelType, Tag } from "../../types";
import MapPicker from "../../components/map/MapPicker";
import HotelMap from "../../components/map/HotelMap";
import Input from "../../components/static/Input";
import TextArea from "../../components/static/TextArea";
import FileUpload from "../../components/static/FileUpload";
import TagSelector from "../../components/tags/TagSelector";
import {
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaGlobe,
  FaStar,
  FaCalendarAlt,
  FaUsers,
  FaPlus,
  FaEdit,
  FaTrash,
  FaBed,
  FaDollarSign,
} from "react-icons/fa";
import LoadingSpinner from "../../components/static/LoadingSpinner";

const HotelDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState<HotelType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<HotelType>({
    id: 0,
    name: "",
    address: "",
    city: "",
    country: "",
    description: "",
    profile_path: null,
    cover_path: null,
    tags: [],
    coordinate: {
      lat: 0,
      lng: 0,
    },
    email: "",
    phone: "",
    website: "",
  });

  useEffect(() => {
    if(id) {
    fetchHotel();
    }
    // console.log(hotel);
  }, [id]);

  const fetchHotel = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/hotels/${id}`);
      const hotelData = response.data;
      console.log("hotel data:", hotelData);

      console.log(hotelData.tags);

      // Parse the coordinate string if it comes as a string
      if (hotelData.coordinate && typeof hotelData.coordinate === "string") {
        try {
          hotelData.coordinate = JSON.parse(hotelData.coordinate);
        } catch (e) {
          console.error("Error parsing coordinates:", e);
          hotelData.coordinate = { lat: 0, lng: 0 };
        }
      }

      // Ensure tags are properly formatted
      if (hotelData.tags) {
        // Check if tags are objects with id and name properties (from pivot table)
        if (
          Array.isArray(hotelData.tags) &&
          hotelData.tags.length > 0 &&
          typeof hotelData.tags[0] === "object"
        ) {
          // Map complex tag objects to their name property or string representation
          hotelData.tags = hotelData.tags.map((tag: Tag) =>
            tag.name ? tag.name : tag.id ? String(tag.id) : "Unknown"
          );
        }
      }

      setHotel(hotelData);
      setFormData(hotelData);
      setError(null);
    } catch (err) {
      console.error("Error fetching hotel:", err);
      setError("Failed to load hotel details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files.length > 0) {
      setFormData({
        ...formData,
        [name]: files[0],
      });
    }
  };

  const handleTagsChange = (selectedTagIds: Tag[]) => {
    setFormData({
      ...formData,
      tags: selectedTagIds,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const hotelData = new FormData();

      // Append all fields except files
      hotelData.append("name", formData.name);
      hotelData.append("address", formData.address);
      hotelData.append("city", formData.city);
      hotelData.append("country", formData.country);
      hotelData.append("description", formData.description);
      hotelData.append("email", formData.email);
      hotelData.append("phone", formData.phone);
      if (formData.website) {
        hotelData.append("website", formData.website);
      }

      // Append tags
      formData.tags.forEach((tagId, index) => {
        hotelData.append(`tags[${index}]`, tagId.toString());
      });

      // Append coordinate
      hotelData.append("coordinate[lat]", String(formData.coordinate.lat));
      hotelData.append("coordinate[lng]", String(formData.coordinate.lng));

      // Append files only if they are File objects
      if (formData.profile_path instanceof File) {
        hotelData.append("profile_path", formData.profile_path);
      }
      if (formData.cover_path instanceof File) {
        hotelData.append("cover_path", formData.cover_path);
      }

      await axiosInstance.put(`/hotels/${id}`, hotelData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setIsEditing(false);
      fetchHotel(); // Refresh the hotel data
    } catch (err) {
      console.error("Error updating hotel:", err);
      setError("Failed to update hotel");
    }
  };

  const handleDeleteRoom = async (roomId: number) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await axiosInstance.delete(`/rooms/${roomId}`);
        fetchHotel(); // Refresh hotel data to update rooms list
      } catch (err) {
        console.error("Error deleting room:", err);
        setError("Failed to delete room");
      }
    }
  };

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded">
        <p>{error}</p>
        <button
          onClick={() => fetchHotel()}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!hotel) {
    return <div>Hotel not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">{hotel.name}</h1>
            <p className="text-gray-600 mt-1">
              <FaMapMarkerAlt className="inline-block mr-2" />
              {hotel.city}, {hotel.country}
            </p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => navigate(`/owner/hotels/${id}/edit`)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Edit Hotel
            </button>
            <button
              onClick={() => navigate("/owner/hotels")}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300"
            >
              Back to List
            </button>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              label="Hotel Name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />

            <Input
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="City"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
              />

              <Input
                label="Country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                required
              />
            </div>

            <TextArea
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Phone Number *"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
              />

              <Input
                label="Email Address *"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <Input
              label="Website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              // helperText="Optional: Enter your hotel's website URL"
            />

            <TagSelector
              selectedTags={formData.tags}
              onChange={handleTagsChange}
            />

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <MapPicker
                onPick={(coords) =>
                  setFormData((prev) => ({
                    ...prev,
                    coordinate: { lat: coords.latitude, lng: coords.longitude },
                  }))
                }
                defaultCoords={{
                  latitude: formData.coordinate.lat,
                  longitude: formData.coordinate.lng,
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FileUpload
                label="Profile Image"
                id="profile_path"
                name="profile_path"
                onChange={handleFileChange}
                helperText="Upload a logo or main image for the hotel"
              />

              <FileUpload
                label="Cover Image"
                id="cover_path"
                name="cover_path"
                onChange={handleFileChange}
                helperText="Upload a banner image for the hotel"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        ) : (
          <div className="space-y-8">
            {/* Cover Image */}
            {hotel.cover_path && (
              <div className="relative h-96 rounded-lg overflow-hidden">
                <img
                  src={`http://127.0.0.1:8000/storage/${hotel.cover_path}`}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                />
                {hotel.profile_path && (
                  <div className="absolute bottom-4 left-4">
                    <img
                      src={`http://127.0.0.1:8000/storage/${hotel.profile_path}`}
                      alt={`${hotel.name} logo`}
                      className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column - Hotel Information */}
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Hotel Information
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-500">Description</p>
                      <p className="text-gray-900 mt-1">{hotel.description}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Address</p>
                      <p className="text-gray-900 mt-1">{hotel.address}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-500">City</p>
                        <p className="text-gray-900 mt-1">{hotel.city}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Country</p>
                        <p className="text-gray-900 mt-1">{hotel.country}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location Map */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">Location</h2>
                  <div className="h-64 bg-gray-100 rounded-lg overflow-hidden">
                    <HotelMap
                      lat={hotel.coordinate.lat}
                      lng={hotel.coordinate.lng}
                      hotelName={hotel.name}
                    />
                  </div>
                </div>
              </div>

              {/* Right Column - Additional Information */}
              <div className="space-y-6">
                {/* Quick Stats */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <FaStar className="text-yellow-400 mr-2" />
                      <span className="text-gray-700">4.5 Rating</span>
                    </div>
                    <div className="flex items-center">
                      <FaCalendarAlt className="text-blue-400 mr-2" />
                      <span className="text-gray-700">24 Bookings</span>
                    </div>
                    <div className="flex items-center">
                      <FaUsers className="text-green-400 mr-2" />
                      <span className="text-gray-700">120 Guests</span>
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Contact Information
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <FaPhone className="text-gray-400 mr-2" />
                      <span className="text-gray-700">
                        {hotel.phone || "Not provided"}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FaEnvelope className="text-gray-400 mr-2" />
                      <span className="text-gray-700">
                        {hotel.email || "Not provided"}
                      </span>
                    </div>
                    {hotel.website && (
                      <div className="flex items-center">
                        <FaGlobe className="text-gray-400 mr-2" />
                        <a
                          href={
                            hotel.website.startsWith("http")
                              ? hotel.website
                              : `https://${hotel.website}`
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {hotel.website}
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div className="bg-white rounded-lg shadow-md p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Amenities & Features
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {Array.isArray(hotel.tags) ? (
                      hotel.tags.map((tag, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                        >
                          {typeof tag === "object"
                            ? tag.name || `Tag ${tag.id || index}`
                            : String(tag)}
                        </span>
                      ))
                    ) : (
                      <span className="text-gray-500">No tags available</span>
                    )}
                  </div>
                </div>

               
              </div>
            </div>
          </div>
        )}

        {/* Rooms Section */}
        <div className="mt-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Rooms</h2>
            <button
              onClick={() => navigate(`/owner/hotels/${id}/rooms/new`)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
            >
              <FaPlus className="mr-2" />
              Add New Room
            </button>
          </div>

          {hotel.rooms && hotel.rooms.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {hotel.rooms.map((room) => (
                <div
                  key={room.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  {room.images && room.images.length > 0 && (
                    <div className="relative h-48">
                      <img
                        src={`http://127.0.0.1:8000/storage/${room.images[0].image_path}`}
                        alt={room.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h2 className="text-xl font-semibold mb-2">{room.name}</h2>
                    <p className="text-gray-600 mb-4 line-clamp-2">
                      {room.description}
                    </p>
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="flex items-center">
                        <FaBed className="text-gray-400 mr-2" />
                        <span>{room.bed_numbers} beds</span>
                      </div>
                      <div className="flex items-center">
                        <FaUsers className="text-gray-400 mr-2" />
                        <span>{room.capacity} guests</span>
                      </div>
                      <div className="flex items-center">
                        <FaDollarSign className="text-gray-400 mr-2" />
                        <span>${room.price_per_night}/night</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          room.is_available
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {room.is_available ? "Available" : "Not Available"}
                      </span>
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            navigate(`/owner/hotels/${id}/rooms/${room.id}/edit`)
                          }
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteRoom(room.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg shadow-md">
              <p className="text-gray-500">
                No rooms found. Add your first room!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HotelDetail;
