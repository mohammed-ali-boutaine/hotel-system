import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axios";
import { RoomType } from "../../types";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaBed,
  FaUsers,
  FaDollarSign,
} from "react-icons/fa";
import LoadingSpinner from "../static/LoadingSpinner";

const RoomList: React.FC = () => {
  const { hotelId } = useParams<{ hotelId: string }>();
  const navigate = useNavigate();
  const [rooms, setRooms] = useState<RoomType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRooms();
  }, [hotelId]);

  const fetchRooms = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/hotels/${hotelId}/rooms`);
      setRooms(response.data.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching rooms:", err);
      setError("Failed to load rooms");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (roomId: number) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await axiosInstance.delete(`/rooms/${roomId}`);
        setRooms(rooms.filter((room) => room.id !== roomId));
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
          onClick={() => fetchRooms()}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Rooms</h1>
        <button
          onClick={() => navigate(`/owner/hotels/${hotelId}/rooms/new`)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
        >
          <FaPlus className="mr-2" />
          Add New Room
        </button>
      </div>

      {rooms.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">No rooms found. Add your first room!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
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
                    <span>{room.number_of_guests} guests</span>
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
                      onClick={() => navigate(`/owner/rooms/${room.id}/edit`)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(room.id)}
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
      )}
    </div>
  );
};

export default RoomList;
