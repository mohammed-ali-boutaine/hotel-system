import { useEffect, useState } from "react";
import { useBookingStore } from "../store/useBookingStore";
import { BookingType } from "../types";
import Button from "../components/static/Button";
// import { Button } from "@mui/material";
// import EditButton from "../components/static/EditButton";

interface CategorizedBookings {
  upcoming: BookingType[];
  active: BookingType[];
  past: BookingType[];
  cancelled: BookingType[];
}

const BookingsPage = () => {
  const { bookings, loading, error, fetchUserBookings, cancelBooking } =
    useBookingStore();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchUserBookings();
    setIsRefreshing(false);
  };

  const handleCancelBooking = async (bookingId: number) => {
    if (window.confirm("Are you sure you want to cancel this booking?")) {
      await cancelBooking(bookingId);
      await fetchUserBookings();
    }
  };

  // Debugging: Log bookings structure
  useEffect(() => {
    console.log("Bookings structure:", bookings);
    // console.log("Bookings upcoming length:", bookings?.upcoming?.length);
  }, [bookings]);

  useEffect(() => {
    fetchUserBookings();
  }, [fetchUserBookings]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  // Get the categorized bookings directly from bookings
  const categorizedBookings: CategorizedBookings = {
    upcoming: bookings?.upcoming || [],
    active: bookings?.active || [],
    past: bookings?.past || [],
    cancelled: bookings?.cancelled || [],
  };

  const BookingTableRow = ({ booking }: { booking: BookingType }) => (
    <tr className="border-b hover:bg-gray-50">
      <td className="py-4 px-4">Room #{booking.room_id}</td>
      <td className="py-4 px-4">{new Date(booking.check_in).toLocaleDateString()}</td>
      <td className="py-4 px-4">{new Date(booking.check_out).toLocaleDateString()}</td>
      <td className="py-4 px-4">${booking.total_price}</td>
      <td className="py-4 px-4">
        <span
          className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
            booking.status === "active"
              ? "bg-green-100 text-green-800"
              : booking.status === "cancelled"
              ? "bg-red-100 text-red-800"
              : booking.status === "past"
              ? "bg-gray-100 text-gray-800"
              : "bg-blue-100 text-blue-800"
          }`}
        >
          {booking.status}
        </span>
      </td>
      <td className="py-4 px-4 text-right">
        {booking.status === "upcoming" && (
          <button
            onClick={() => handleCancelBooking(booking.id)}
            className="px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
          >
            Cancel
          </button>
        )}
      </td>
    </tr>
  );

  const BookingTableSection = ({
    title,
    bookings,
  }: {
    title: string;
    bookings: BookingType[];
  }) => (
    <div className="mb-8">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>
      {bookings.length === 0 ? (
        <p className="text-gray-500">
          No {title.toLowerCase()} bookings found.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border rounded-lg">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left">Room</th>
                <th className="py-3 px-4 text-left">Check-in</th>
                <th className="py-3 px-4 text-left">Check-out</th>
                <th className="py-3 px-4 text-left">Price</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => (
                <BookingTableRow key={booking.id} booking={booking} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Bookings</h1>
        <div className="flex gap-4">
          <Button onClick={handleRefresh}
            disabled={isRefreshing}>

          {isRefreshing ? "Refreshing..." : "Refresh"}

          </Button>
          {/* <button
            
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
          </button> */}
        </div>
      </div>

      <BookingTableSection
        title="Upcoming"
        bookings={categorizedBookings.upcoming}
      />
      <BookingTableSection 
        title="Active" 
        bookings={categorizedBookings.active} 
      />
      <BookingTableSection 
        title="Past" 
        bookings={categorizedBookings.past} 
      />
      <BookingTableSection
        title="Cancelled"
        bookings={categorizedBookings.cancelled}
      />
    </div>
  );
};

export default BookingsPage;