import { create } from "zustand";
import axiosInstance from "../utils/axios";
import { RoomType } from "../types";

interface RoomStore {
  room: RoomType | null;
  loading: boolean;
  error: string | null;
  fetchRoomDetail: (roomId: string) => Promise<void>;
  resetRoom: () => void;
}

export const useRoomStore = create<RoomStore>((set) => ({
  room: null,
  loading: false,
  error: null,

  fetchRoomDetail: async (roomId: string) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.get(`/rooms/${roomId}`);
      set({ room: response.data.data, loading: false });
    } catch (err) {
      console.error("Error fetching room details:", err);
      set({
        error: "Failed to load room details. Please try again later.",
        loading: false,
      });
    }
  },

  resetRoom: () => {
    set({ room: null, error: null });
  },
}));
