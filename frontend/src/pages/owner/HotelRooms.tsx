import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Loader2, Plus } from "lucide-react";
import axiosInstance from "../../utils/axios";
import { Room } from "../../types";
import { RoomCard } from "../../components/room/RoomCard";

const HotelRooms: React.FC = () => {
  const { hotelId } = useParams<{ hotelId: string }>();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [hotelName, setHotelName] = useState<string>("Hotel");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);

        // Fetch rooms for this hotel
        const roomsResponse = await axiosInstance.get(
          `/hotels/${hotelId}/rooms`
        );
        const roomsData = roomsResponse.data?.data || roomsResponse.data;

        // Set hotel name if available
        if (roomsData.length > 0 && roomsData[0]?.hotel?.name) {
          setHotelName(roomsData[0].hotel.name);
        }

        setRooms(Array.isArray(roomsData) ? roomsData : []);
        setLoading(false);
      } catch (err) {
        setError("Failed to load rooms");
        setLoading(false);
        console.error(err);
      }
    };

    if (hotelId) {
      fetchRooms();
    }
  }, [hotelId]);

  const handleDeleteRoom = async (roomId: number) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await axiosInstance.delete(`/rooms/${roomId}`);
        setRooms(rooms.filter((room) => room.id !== roomId));
      } catch (err) {
        setError("Failed to delete room");
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin h-8 w-8" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 mt-8">{error}</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Rooms for {hotelName}
          </h1>
          <p className="text-gray-600">{rooms.length} rooms available</p>
        </div>
        <Link
          to={`/owner/hotels/${hotelId}/rooms/new`}
          className="flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <Plus size={18} className="mr-2" /> Add New Room
        </Link>
      </div>

      {rooms.length === 0 ? (
        <div className="text-center p-10 bg-gray-50 rounded-lg">
          <h3 className="text-xl font-medium text-gray-600">No rooms yet!</h3>
          <p className="mt-2 text-gray-500">
            Start by adding a new room to this hotel.
          </p>
          <Link
            to={`/owner/hotels/${hotelId}/rooms/new`}
            className="mt-4 inline-flex items-center bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
          >
            <Plus size={18} className="mr-2" /> Add First Room
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} onDelete={handleDeleteRoom} />
          ))}
        </div>
      )}
    </div>
  );
};

export default HotelRooms;
