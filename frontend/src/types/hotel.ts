import { Review } from "./review";
import { Room } from "./room";
import { Tag } from "./tag";
import { UserType } from "./user";

export interface Hotel {
  id: number | string;
  name: string;
  address: string;
  city: string;
  country: string;
  tags: Tag[];
  description: string;
  email: string;
  phone: string;
  website: string;
  coordinate: {
    lat: number;
    lng: number;
  };
  profile_path?: string | null | File;
  cover_path?: string | null | File;
  owner?: UserType;
  rooms?: Room[];
  reviews?: Review[];
  created_at?: string;
  updated_at?: string;
}

export interface HotelFormErrors {
  name?: string;
  address?: string;
  city?: string;
  country?: string;
  tags?: string;
  description?: string;
  email?: string;
  phone?: string;
  website?: string;
  profile_path?: string;
  cover_path?: string;
  coordinate?: string;
}

export type HotelType = Hotel;
