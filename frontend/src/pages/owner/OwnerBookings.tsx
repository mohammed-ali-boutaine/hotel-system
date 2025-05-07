import React, { useEffect, useState } from "react";
// import axios from "axios";
import { useUserStore } from "../../store/useUserStore";
// import BookingList from "../../components/booking/BookingList";
import { Alert, Container, Typography } from "@mui/material";
import { BookingType } from "../../types";
import BookingList from "../../components/booking/BookingList";
import axiosInstance from "../../utils/axios";

const OwnerBookings: React.FC = () => {
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useUserStore();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get("/owner/bookings")
        console.log("Response data:", response.data.data);
        
     //    const response = await axios.get(
     //      `${process.env.REACT_APP_API_URL}/owner/bookings`,
     //      {
     //        headers: {
     //          Authorization: `Bearer ${token}`,
     //        },
     //      }
     //    );
        setBookings(response.data.data);
        setError(null);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        setError("Failed to load bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        All Bookings
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <BookingList bookings={bookings} loading={loading} showHotelInfo={true} />
    </Container>
  );
};

export default OwnerBookings;
