import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  CardActionArea,
  List,
  ListItem,
  Divider,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Hotel as HotelIcon,
  BedOutlined,
  PersonOutline,
} from "@mui/icons-material";
import axiosInstance from "../../utils/axios";
import { HotelType } from "../../types";

const HotelsManagement = () => {
  const [hotels, setHotels] = useState<HotelType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<HotelType | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isRoomsModalOpen, setIsRoomsModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    name: "",
    city: "",
    country: "",
    description: "",
  });

  const getImageUrl = (path: string | undefined) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `http://127.0.0.1:8000/storage${
      path.startsWith("/") ? "" : "/"
    }${path}`;
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  const fetchHotels = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/admin/hotels");
      setHotels(response.data.hotels);
      setError(null);
    } catch (err) {
      setError("Failed to fetch hotels");
      console.error("Error fetching hotels:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (hotelId: string | number) => {
    if (window.confirm("Are you sure you want to delete this hotel?")) {
      try {
        await axiosInstance.delete(`/admin/hotels/${hotelId}`);
        await fetchHotels();
      } catch (err) {
        setError("Failed to delete hotel");
        console.error("Error deleting hotel:", err);
      }
    }
  };

  const handleViewDetails = (hotelId: string | number) => {
    window.open(`/hotels/${hotelId}`, "_blank");
  };

  const handleEditSubmit = async () => {
    if (!selectedHotel) return;

    try {
      await axiosInstance.put(`/hotels/${selectedHotel.id}`, editFormData);
      setIsEditDialogOpen(false);
      fetchHotels();
    } catch (err) {
      setError("Failed to update hotel");
      console.error("Error updating hotel:", err);
    }
  };

  const handleShowRooms = (hotel: HotelType) => {
    setSelectedHotel(hotel);
    setIsRoomsModalOpen(true);
  };

  const calculateAverageRating = (reviews: HotelType["reviews"]) => {
    if (!reviews || reviews.length === 0) return null;
    const sum = reviews.reduce((acc, review) => acc + (review.rating || 0), 0);
    return (sum / reviews.length).toFixed(1);
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
        <Typography variant="h4">Hotels Management</Typography>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-8">
          <CircularProgress />
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {hotels.map((hotel) => (
            <div key={hotel.id} className="flex flex-col h-full">
              <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                <CardActionArea
                  onClick={() => handleShowRooms(hotel)}
                  className="flex-grow"
                >
                  {hotel.cover_path ? (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={getImageUrl(hotel.cover_path)}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-48 bg-gray-100 flex items-center justify-center">
                      <HotelIcon sx={{ fontSize: 60, color: "grey.400" }} />
                    </div>
                  )}
                  <CardContent className="p-4 flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1 min-w-0 mr-2">
                        <h3
                          className="text-lg font-semibold truncate"
                          title={hotel.name}
                        >
                          {hotel.name}
                        </h3>
                        <p
                          className="text-sm text-gray-600 truncate"
                          title={`${hotel.city}, ${hotel.country}`}
                        >
                          {hotel.city}, {hotel.country}
                        </p>
                      </div>
                      <Chip
                        label={calculateAverageRating(hotel.reviews) || "N/A"}
                        size="small"
                        color={
                          Number(calculateAverageRating(hotel.reviews)) >= 4
                            ? "success"
                            : "default"
                        }
                      />
                    </div>

                    <div className="flex items-center text-sm text-gray-600 mt-3">
                      <BedOutlined fontSize="small" />
                      <span className="ml-2">
                        {hotel.rooms?.length || 0} Rooms
                      </span>
                    </div>
                  </CardContent>
                </CardActionArea>
                <div className="flex justify-end p-2 border-t border-gray-100">
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewDetails(hotel.id);
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
                      handleDelete(hotel.id);
                    }}
                    size="small"
                    title="Delete Hotel"
                  >
                    <DeleteIcon fontSize="small" className="text-red-500" />
                  </IconButton>
                </div>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Edit Hotel</DialogTitle>
        <DialogContent>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField
              label="Name"
              value={editFormData.name}
              onChange={(e) =>
                setEditFormData({ ...editFormData, name: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="City"
              value={editFormData.city}
              onChange={(e) =>
                setEditFormData({ ...editFormData, city: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Country"
              value={editFormData.country}
              onChange={(e) =>
                setEditFormData({ ...editFormData, country: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Description"
              value={editFormData.description}
              onChange={(e) =>
                setEditFormData({
                  ...editFormData,
                  description: e.target.value,
                })
              }
              multiline
              rows={4}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            color="primary"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rooms Modal */}
      <Dialog
        open={isRoomsModalOpen}
        onClose={() => setIsRoomsModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>{selectedHotel?.name} - Rooms</DialogTitle>
        <DialogContent dividers>
          {selectedHotel && (
            <>
              {selectedHotel.rooms && selectedHotel.rooms.length > 0 ? (
                <List>
                  {selectedHotel.rooms.map((room, index) => (
                    <React.Fragment key={room.id}>
                      {index > 0 && <Divider component="li" />}
                      <ListItem>
                        <Box className="w-full">
                          <Box className="flex justify-between items-start">
                            <Box>
                              <Typography
                                variant="subtitle1"
                                className="font-medium"
                              >
                                {room.name || `Room #${room.id}`}
                              </Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {room.type || "Standard Room"}
                              </Typography>
                            </Box>
                            <Typography
                              variant="subtitle1"
                              color="primary"
                              className="font-semibold"
                            >
                              ${room.price_per_night}
                            </Typography>
                          </Box>

                          <Box className="flex flex-wrap gap-2 mt-2">
                            <Chip
                              icon={<PersonOutline fontSize="small" />}
                              label={`${room.capacity} guests`}
                              size="small"
                              variant="outlined"
                            />
                            <Chip
                              icon={<BedOutlined fontSize="small" />}
                              label={`${room.bed_numbers} beds`}
                              size="small"
                              variant="outlined"
                            />
                            <Chip
                              label={
                                room.is_available ? "Available" : "Unavailable"
                              }
                              size="small"
                              color={room.is_available ? "success" : "error"}
                              variant="outlined"
                            />
                          </Box>

                          {room.description && (
                            <Typography
                              variant="body2"
                              className="mt-2 text-gray-600"
                            >
                              {room.description}
                            </Typography>
                          )}
                        </Box>
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              ) : (
                <Typography variant="body1" className="text-center py-6">
                  No rooms available for this hotel.
                </Typography>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsRoomsModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default HotelsManagement;
