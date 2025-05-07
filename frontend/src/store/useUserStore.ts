// store/useUserStore.ts
import { UserType } from "../types";
import { create } from "zustand";
import axiosInstance from "../utils/axios";
import axios, { AxiosError } from "axios";
// import { log } from "console";

interface ApiResponse {
  user: UserType;
}

type Store = {
  user: UserType | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  setUser: (user: UserType, token: string) => void;
  fetchUserFromToken: () => Promise<void>;
  updateUser: (updatedUser: UserType) => Promise<UserType>;
  logout: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
  }) => Promise<void>;
  updatePassword: (oldPassword: string, newPassword: string) => Promise<void>;
};

const getInitialToken = (): string | null => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("token");
  }
  return null;
};

export const useUserStore = create<Store>((set) => ({
  user: null,
  token: getInitialToken(),
  loading: true,
  error: null,

  setUser: (user, token) => {
    localStorage.setItem("token", token);
    set({ user, token, error: null, loading: false });
  },

  fetchUserFromToken: async () => {
    const token = getInitialToken();
    if (!token) {
      set({ loading: false });
      return;
    }

    try {
      set({ loading: true, error: null });

      const response = await axiosInstance.get<ApiResponse>("/me");
      set({
        user: response.data.user,
        token,
        loading: false,
      });
    } catch (error) {
      console.error("Fetch user error:", error);
      localStorage.removeItem("token");
      set({
        user: null,
        token: null,
        loading: false,
        error: error instanceof Error ? error.message : "Failed to fetch user",
      });
    }
  },

  updateUser: async (updatedUser: UserType) => {
    try {
      console.log("Updating user with data:", updatedUser);

      set({ loading: true, error: null });

      let requestData: any = updatedUser;
      const headers: Record<string, string> = {};

      // If we have a profile picture (File), use FormData
      if (updatedUser.profile_path instanceof File) {
        const formData = new FormData();

        Object.entries(updatedUser).forEach(([key, value]) => {
          if (value !== null && value !== undefined) {
            if (value instanceof File) {
              formData.append(key, value);
            } else if (typeof value === "object") {
              formData.append(key, JSON.stringify(value));
            } else {
              formData.append(key, String(value));
            }
          }
        });

        requestData = formData;
        headers["Content-Type"] = "multipart/form-data"; // axios needs this ONLY when sending FormData
      }

      const response = await axiosInstance.patch<ApiResponse>(
        "/me",
        requestData,
        { headers }
      );

      console.log("User updated:", response.data);

      set({
        user: response.data.user,
        loading: false,
      });

      return response.data.user;
    } catch (error) {
      console.error("Update user error:", error);

      const errorMessage =
        axios.isAxiosError(error) &&
        (error as AxiosError<{ message: string }>).response?.data?.message
          ? (error as AxiosError<{ message: string }>).response?.data.message
          : error instanceof Error
          ? error.message
          : "Failed to update user";

      set({
        loading: false,
        error: errorMessage,
      });

      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, token: null, error: null, loading: false });
  },

  login: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.post("/login", { email, password });
      const { user, token } = response.data;
      localStorage.setItem("token", token);
      set({ user, token, loading: false });
    } catch (error) {
      console.error("Login error:", error);

      const errorMessage =
        axios.isAxiosError(error) &&
        (error as AxiosError<{ message: string }>).response?.data?.message
          ? (error as AxiosError<{ message: string }>).response?.data.message
          : error instanceof Error
          ? error.message
          : "Failed to login";

      set({
        loading: false,
        error: errorMessage,
      });

      throw error;
    }
  },

  register: async (userData) => {
    try {
      set({ loading: true, error: null });
      const response = await axiosInstance.post("/register", userData);
      const { user, token } = response.data;
      localStorage.setItem("token", token);
      set({ user, token, loading: false });
    } catch (error) {
      console.error("Register error:", error);

      const errorMessage =
        axios.isAxiosError(error) &&
        (error as AxiosError<{ message: string }>).response?.data?.message
          ? (error as AxiosError<{ message: string }>).response?.data.message
          : error instanceof Error
          ? error.message
          : "Failed to register";

      set({
        loading: false,
        error: errorMessage,
      });

      throw error;
    }
  },

  updatePassword: async (oldPassword: string, newPassword: string) => {
    try {
      set({ loading: true, error: null });

      const response = await axiosInstance.post("/me/password", {
        current_password: oldPassword,
        password: newPassword,
        password_confirmation: newPassword,
      });

      set({ loading: false });

      return response.data;
    } catch (error) {
      console.error("Password update error:", error);

      const errorMessage =
        axios.isAxiosError(error) &&
        (error as AxiosError<{ message: string }>).response?.data?.message
          ? (error as AxiosError<{ message: string }>).response?.data.message
          : error instanceof Error
          ? error.message
          : "Failed to update password";

      set({
        loading: false,
        error: errorMessage,
      });

      throw error;
    }
  },
}));
