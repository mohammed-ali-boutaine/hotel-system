import { create } from "zustand";
// import { Booking } from "../types";
import axiosInstance from "../utils/axios";
import { BookingType } from "../types";

interface BookingStore {
  bookings: BookingType[];
  currentBooking: BookingType | null;
  loading: boolean;
  error: string | null;
  createBooking: (bookingData: {
    room_id: number;
    check_in: string;
    check_out: string;
    number_of_guests: number;
    special_requests?: string;
  }) => Promise<void>;
  fetchUserBookings: () => Promise<void>;
  cancelBooking: (bookingId: number) => Promise<void>;
}

export const useBookingStore = create<BookingStore>((set) => ({
  bookings: [],
  currentBooking: null,
  loading: false,
  error: null,

  createBooking: async (bookingData) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.post("/bookings", bookingData);
      console.log(response);

      set({ currentBooking: response.data.data, loading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to create booking",
        loading: false,
      });
      throw error; // Re-throw to handle in the component
    }
  },

  fetchUserBookings: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.get("/bookings");
      console.log(response.data);
      
      set({ bookings: response.data || [], loading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch bookings",
        loading: false,
      });
    }
  },

  cancelBooking: async (bookingId: number) => {
    try {
      set({ loading: true, error: null });
      await axiosInstance.delete(`/bookings/${bookingId}`);
      set((state) => ({
        bookings: state.bookings.filter((booking) => booking.id !== bookingId),
        loading: false,
      }));
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to cancel booking",
        loading: false,
      });
      throw error;
    }
  },
}));
