import { useState, useEffect } from "react";
import { Box, Typography, CircularProgress } from "@mui/material";
import BookingList from "../../components/booking/BookingList";
import axiosInstance from "../../utils/axios";
import { BookingType } from "../../types";

const BookingsManagement = () => {
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/admin/bookings");
        setBookings(response.data.bookings);
        setError(null);
      } catch (err) {
        setError("Failed to fetch bookings");
        console.error("Error fetching bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (error) {
    return (
      <Box textAlign="center" py={4}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Bookings Management
      </Typography>
      {loading ? (
        <Box display="flex" justifyContent="center" py={4}>
          <CircularProgress />
        </Box>
      ) : (
        <BookingList
          bookings={bookings}
          loading={loading}
          showHotelInfo={true}
        />
      )}
    </Box>
  );
};

export default BookingsManagement;
