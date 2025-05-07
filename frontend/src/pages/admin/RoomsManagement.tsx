import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  IconButton,
  CardActionArea,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  BedOutlined,
  PersonOutline,
} from "@mui/icons-material";
import axiosInstance from "../../utils/axios";

interface Room {
  id: number;
  hotel_id: number;
  name: string;
  description: string;
  price_per_night: number;
  capacity: number;
  room_number: string;
  type: string;
  created_at: string;
  hotel?: {
    name: string;
  };
}

interface Hotel {
  id: number;
  name: string;
}

const RoomsManagement = () => {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/admin/rooms");
      setRooms(response.data.rooms);
      setError(null);
    } catch (err) {
      setError("Failed to fetch rooms");
      console.error("Error fetching rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchHotels = async () => {
    try {
      const response = await axiosInstance.get("/hotels");
      setHotels(response.data.data);
    } catch (err) {
      console.error("Error fetching hotels:", err);
    }
  };

  useEffect(() => {
    fetchRooms();
    fetchHotels();
  }, []);

  const handleViewDetails = (roomId: number) => {
    window.open(`/rooms/${roomId}`, "_blank");
  };

  const handleDelete = async (roomId: number) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      try {
        await axiosInstance.delete(`/admin/rooms/${roomId}`);
        await fetchRooms();
      } catch (err) {
        setError("Failed to delete room");
        console.error("Error deleting room:", err);
      }
    }
  };

  if (error) {
    return (
      <Box textAlign="center" py={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <Typography variant="h4">Rooms Management</Typography>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <CircularProgress />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {rooms.map((room) => (
            <div key={room.id} className="flex flex-col h-full">
              <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardActionArea
                  onClick={() => handleViewDetails(room.id)}
                  className="flex-grow"
                >
                  <div className="h-48 bg-gray-100 flex items-center justify-center">
                    <BedOutlined sx={{ fontSize: 60, color: "grey.400" }} />
                  </div>
                  <CardContent className="p-4 flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0 mr-2">
                        <h3
                          className="text-lg font-semibold truncate"
                          title={room.name}
                        >
                          {room.name}
                        </h3>
                        <p
                          className="text-sm text-gray-600 truncate"
                          title={room.hotel?.name || "No Hotel"}
                        >
                          {room.hotel?.name || "No Hotel"}
                        </p>
                      </div>
                      <Chip
                        label={`$${room.price_per_night}`}
                        size="small"
                        color="primary"
                      />
                    </div>

                    <div className="flex flex-wrap gap-2 mt-3">
                      <Chip
                        icon={<PersonOutline fontSize="small" />}
                        label={`${room.capacity} guests`}
                        size="small"
                        variant="outlined"
                      />
                      <Chip
                        icon={<BedOutlined fontSize="small" />}
                        label={room.type}
                        size="small"
                        variant="outlined"
                      />
                    </div>

                    {room.description && (
                      <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                        {room.description}
                      </p>
                    )}
                  </CardContent>
                </CardActionArea>
                <div className="flex justify-end p-2 border-t border-gray-100">
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(room.id);
                    }}
                    size="small"
                    title="View Details"
                    className="mr-1"
                  >
                    <VisibilityIcon
                      fontSize="small"
                      className="text-blue-500"
                    />
                  </IconButton>
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(room.id);
                    }}
                    size="small"
                    title="Delete Room"
                  >
                    <DeleteIcon fontSize="small" className="text-red-500" />
                  </IconButton>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RoomsManagement;
