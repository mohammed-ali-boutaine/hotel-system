import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import {
  Loader2,
  // Edit,
  // Trash2,
  // Bed,
  // Users,
  // DollarSign,
  // Hash,
  // Building,
} from "lucide-react";
import { Room } from "../../types";
import axiosInstance from "../../utils/axios";
import { RoomCard } from "../../components/room/RoomCard";

const Rooms = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axiosInstance.get("owner/rooms");
        setRooms(response.data.data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

  const handleDeleteRoom = async (roomId: number) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await axiosInstance.delete(`/api/rooms/${roomId}`);
        setRooms(rooms.filter((room) => room.id !== roomId));
      } catch (err) {
        // setError("Failed to delete room");
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">All Rooms</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {rooms.map((room) => (
          <RoomCard key={room.id} room={room} onDelete={handleDeleteRoom} />
          // <div key={room.id} className="border p-4 rounded shadow">
          //   <h2 className="text-xl font-semibold">{room.name}</h2>
          //   <p>
          //     <Bed className="inline-block mr-2" />
          //     Beds: {room.bed_numbers}
          //   </p>
          //   <p>
          //     <Users className="inline-block mr-2" />
          //     Capacity: {room.capacity}
          //   </p>
          //   <p>
          //     <DollarSign className="inline-block mr-2" />
          //     Price: ${room.price_per_night}
          //   </p>
          //   <p>
          //     <Hash className="inline-block mr-2" />
          //     Room Number: {room.room_number}
          //   </p>
          //   <p>
          //     <Building className="inline-block mr-2" />
          //     Hotel: {room.hotel?.name || "Unknown"}
          //   </p>
          //   <div className="flex justify-end mt-4">
          //     <Link to={`/owner/rooms/${room.id}/edit`} className="mr-2">
          //       <Edit className="inline-block" />
          //     </Link>
          //     <button>
          //       <Trash2 className="inline-block" />
          //     </button>
          //   </div>
          // </div>
        ))}
      </div>
    </div>
  );
};

export default Rooms;
