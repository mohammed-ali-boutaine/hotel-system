import { create } from "zustand";
// import axios from "axios";
import { Hotel } from "../types/hotel";
import axiosInstance from "../utils/axios";

interface WishlistStore {
  wishlist: Hotel[];
  loading: boolean;
  error: string | null;
  fetchWishlist: () => Promise<void>;
  toggleWishlist: (hotelId: number) => Promise<void>;
}

export const useWishlistStore = create<WishlistStore>((set, get) => ({
  wishlist: [],
  loading: false,
  error: null,

  fetchWishlist: async () => {
    try {
      set({ loading: true, error: null });
      // const response = await axios.get("/api/wishlist");
      const response = await axiosInstance.get("/wishlist")

      console.log(response);
      
      set({ wishlist: response.data.data, loading: false });
    } catch (error) {
      set({ error: "Failed to fetch wishlist", loading: false });
      console.error("Error fetching wishlist:", error);
    }
  },

  toggleWishlist: async (hotelId: number) => {
    try {
      // const response = await axios.post(`/api/hotels/${hotelId}/wishlist`);
      const response = await axiosInstance.post(`/hotels/${hotelId}/wishlist`)
console.log(response);

      // Update local state based on the response
      const currentWishlist = get().wishlist;
      const isInWishlist = currentWishlist.some(
        (hotel) => hotel.id === hotelId
      );

      if (isInWishlist) {
        set({
          wishlist: currentWishlist.filter((hotel) => hotel.id !== hotelId),
        });
      } else {
        // If added to wishlist, we'll need to fetch the updated wishlist
        // since we don't have the full hotel data
        get().fetchWishlist();
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      throw error;
    }
  },
}));
