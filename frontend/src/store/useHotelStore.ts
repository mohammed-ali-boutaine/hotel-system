import { create } from "zustand";
import { Hotel } from "../types";
import axiosInstance from "../utils/axios";

interface SearchParams {
  location?: string;
  checkIn?: string;
  checkOut?: string;
  guests?: number;
}

interface HotelStore {
  hotels: Hotel[];
  currentHotel: Hotel | null;
  loading: boolean;
  error: string | null;
  lastFetched: number | null;
  fetchHotels: () => Promise<void>;
  fetchHotelById: (id: string | number) => Promise<void>;
  fetchHomePageHotels: (forceRefresh?: boolean) => Promise<void>;
  searchHotels: (params: SearchParams) => Promise<void>;
}

export const useHotelStore = create<HotelStore>((set, get) => ({
  hotels: [],
  currentHotel: null,
  loading: false,
  error: null,
  lastFetched: null,

  fetchHotels: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.get("/hotels");
      set({ hotels: response.data.data || [], loading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to fetch hotels",
        loading: false,
      });
    }
  },

  fetchHotelById: async (id: string | number) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.get(`/hotels/${id}`);

      // Parse coordinates if they come as a string
      const hotelData = response.data;
      if (hotelData.coordinate && typeof hotelData.coordinate === "string") {
        try {
          hotelData.coordinate = JSON.parse(hotelData.coordinate);
        } catch (e) {
          console.error("Error parsing coordinates:", e);
          hotelData.coordinate = { lat: 0, lng: 0 };
        }
      }

      set({ currentHotel: hotelData, loading: false });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch hotel details",
        loading: false,
      });
    }
  },

  fetchHomePageHotels: async (forceRefresh = false) => {
    const { hotels, lastFetched } = get();
    const now = Date.now();

    // If we have data and it was fetched less than 5 minutes ago, return early
    if (
      !forceRefresh &&
      hotels.length > 0 &&
      lastFetched &&
      now - lastFetched < 5 * 60 * 1000
    ) {
      return;
    }

    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.get("/homePageHotels");
      set({
        hotels: response.data.data || [],
        loading: false,
        lastFetched: Date.now(),
      });
    } catch (error) {
      set({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch homepage hotels",
        loading: false,
      });
    }
  },

  searchHotels: async (params: SearchParams) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.get("/search", { params });
      set({
        hotels: response.data.data || [],
        loading: false,
        lastFetched: Date.now(),
      });
    } catch (error) {
      set({
        error:
          error instanceof Error ? error.message : "Failed to search hotels",
        loading: false,
      });
    }
  },
}));
