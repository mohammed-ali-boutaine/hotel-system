import { create } from "zustand";
import { Tag } from "../types";
import axiosInstance from "../utils/axios";

interface TagStore {
  tags: Tag[];
  loading: boolean;
  error: string | null;
  fetchTags: () => Promise<void>;
}

export const useTagStore = create<TagStore>((set) => ({
  tags: [],
  loading: false,
  error: null,

  fetchTags: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.get("/tags");
      set({ tags: response.data.data || [], loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch tags",
        loading: false,
      });
    }
  },
}));
