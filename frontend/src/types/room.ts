import { Hotel } from "./hotel";
import { Image } from "./Image";

export interface Room {
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
  images: Image[];
  hotel?: Hotel;
  // bookings?: BookingType[];
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
}
