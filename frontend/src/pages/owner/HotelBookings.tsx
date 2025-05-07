import React, { useEffect, useState } from "react";
// import axios from "axios";
import { useUserStore } from "../../store/useUserStore";
import BookingList from "../../components/booking/BookingList";
// import { Booking } from "../../types/booking";
import { Alert, Container, Typography, Box, Button } from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axios";
import { BookingType } from "../../types";

const HotelBookings: React.FC = () => {
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [hotelName, setHotelName] = useState<string>("");
  const { token } = useUserStore();
  const { hotelId } = useParams<{ hotelId: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/hotels/${hotelId}/bookings`);
        console.log(response.data);
        
        // const response = await axios.get(
        //   `${process.env.REACT_APP_API_URL}/hotels/${hotelId}/bookings`,
        //   {
        //     headers: {
        //       Authorization: `Bearer ${token}`,
        //     },
        //   }
        // );
        setBookings(response.data.data);

        // Get hotel name if available in the first booking
        if (
          response.data.data.length > 0 &&
          response.data.data[0].room?.hotel
        ) {
          setHotelName(response.data.data[0].room.hotel.name);
        } else {
          // Alternatively fetch hotel details separately

          const response = await axiosInstance.get(`/hotels/${hotelId}`);
          console.log(response.data);

          // const hotelResponse = await axios.get(
          //   `${process.env.REACT_APP_API_URL}/hotels/${hotelId}`,
          //   {
          //     headers: {
          //       Authorization: `Bearer ${token}`,
          //     },
          //   }
          // );
          setHotelName(response.data.name);
        }

        setError(null);
      } catch (err) {
        console.error("Failed to fetch hotel bookings:", err);
        setError("Failed to load bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token, hotelId]);

  return (
    <Container>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h4" component="h1">
          Bookings for {hotelName || `Hotel #${hotelId}`}
        </Typography>
        <Button
          variant="outlined"
          onClick={() => navigate(`/owner/hotels/${hotelId}`)}
        >
          Back to Hotel
        </Button>
      </Box>

      {error && <Alert severity="error">{error}</Alert>}

      <BookingList
        bookings={bookings}
        loading={loading}
        showHotelInfo={false}
      />
    </Container>
  );
};

export default HotelBookings;
