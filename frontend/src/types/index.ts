import { HotelType } from "./hotel";

// Re-export all types for easy imports
export * from "./hotel";
export * from "./review";
export * from "./room";
export * from "./tag";
export * from "./user";
export * from "./form";

export interface RoomType {
  id: number;
  hotel_id: number;
  name: string;
  room_number: string;
  type: string;
  floor: number | null;
  is_available: boolean;
  description: string | null;
  bed_numbers: number;
  capacity: number;
  price_per_night: number;
  amenities: string[] | null;
  images: RoomImage[];
  hotel?: HotelType;
  bookings?: BookingType[];
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}

export interface RoomImage {
  id: number;
  room_id: number;
  image_path: string;
  is_primary: boolean;
}

export interface BookingType {
  id: number;
  client_id: number;
  room_id: number;
  check_in: string;
  check_out: string;
  number_of_guests: number;
  total_price: number;
  status: string;
  created_at: string;
  updated_at: string;
  room?: {
    id: number;
    name: string;
    hotel?: {
      id: number;
      name: string;
    };
  };
}

export interface Tag {
  id: string;
  name: string;
  icon_path: string; // URL or class for the icon
}

export interface Hotel {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  website: string;
  coordinate: {
    lat: number;
    lng: number;
  };
  cover_path: string;
  profile_path: string;
  owner?: {
    id: string;
    name: string;
  };
  rooms: Room[];
  tags: Tag[];
  rooms_min_price_per_night?: string;
  reviews_avg_rating?: number;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  type: string;
  room_number: string;
  floor: number;
  capacity: number;
  price_per_night: number;
  bed_numbers: number;
  amenities: string[];
  images: RoomImage[];
  is_available?: true;
  hotel?: HotelType;
}

export interface RoomImage {
  id: number;
  image_path: string;
}

export interface Tag {
  id: string;
  name: string;
}
