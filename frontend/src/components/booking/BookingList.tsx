import React from "react";
// import { Booking } from "../../types/booking";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Skeleton,
  Divider,
} from "@mui/material";
import { format } from "date-fns";
import HotelIcon from "@mui/icons-material/Hotel";
import PersonIcon from "@mui/icons-material/Person";
import DateRangeIcon from "@mui/icons-material/DateRange";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { BookingType } from "../../types";

interface BookingListProps {
  bookings: BookingType[];
  loading: boolean;
  showHotelInfo?: boolean;
}

const BookingList: React.FC<BookingListProps> = ({
  bookings,
  loading,
  showHotelInfo = false,
}) => {
  // Function to determine status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "success";
      case "pending":
        return "warning";
      case "cancelled":
        return "error";
      case "completed":
        return "info";
      default:
        return "default";
    }
  };
  console.info(bookings);

  if (loading) {
    return (
      <Box>
        {[1, 2, 3].map((item) => (
          <Card key={item} sx={{ mb: 2 }}>
            <CardContent>
              <Skeleton variant="text" width="40%" height={40} />
              <Skeleton variant="text" width="70%" />
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="50%" />
            </CardContent>
          </Card>
        ))}
      </Box>
    );
  }

  if (bookings.length === 0) {
    return (
      <Box textAlign="center" py={4}>
        <Typography variant="h6" color="textSecondary">
          No bookings found
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {bookings.map((booking) => (
        <Card key={booking.id} sx={{ mb: 2 }}>
          <CardContent>
            <Box display="flex" justifyContent="space-between" mb={1}>
              <Typography variant="h6">Booking #{booking.id}</Typography>
              <Chip
                label={booking.status || "Unknown"}
                color={getStatusColor(booking.status || "") as any}
                size="small"
              />
            </Box>

            {showHotelInfo && booking.room?.hotel && (
              <>
                <Typography variant="subtitle1" color="primary" gutterBottom>
                  <HotelIcon
                    fontSize="small"
                    sx={{ mr: 1, verticalAlign: "middle" }}
                  />
                  {booking.room.hotel.name}
                </Typography>
                <Divider sx={{ my: 1 }} />
              </>
            )}

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">
                  <strong>Room:</strong> {booking.room?.name || "Unknown room"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <PersonIcon
                    fontSize="small"
                    sx={{ mr: 0.5, verticalAlign: "middle" }}
                  />
                  <strong>Guests:</strong> {booking.number_of_guests}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="textSecondary">
                  <DateRangeIcon
                    fontSize="small"
                    sx={{ mr: 0.5, verticalAlign: "middle" }}
                  />
                  <strong>Check-in:</strong>{" "}
                  {booking.check_in
                    ? format(new Date(booking.check_in), "MMM dd, yyyy")
                    : "N/A"}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  <DateRangeIcon
                    fontSize="small"
                    sx={{ mr: 0.5, verticalAlign: "middle" }}
                  />
                  <strong>Check-out:</strong>{" "}
                  {booking.check_out
                    ? format(new Date(booking.check_out), "MMM dd, yyyy")
                    : "N/A"}
                </Typography>
              </Grid>
            </Grid>

            <Box
              mt={1}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="body2" color="textSecondary">
                <strong>Client ID:</strong> {booking.client_id}
              </Typography>
              <Typography variant="subtitle1" fontWeight="bold">
                <AttachMoneyIcon
                  fontSize="small"
                  sx={{ verticalAlign: "middle" }}
                />
                {booking.total_price
                  ? `${Number(booking.total_price).toFixed(2)}`
                  : "N/A"}
              </Typography>
            </Box>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
};

export default BookingList;
