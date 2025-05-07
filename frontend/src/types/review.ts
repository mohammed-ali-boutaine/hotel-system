import { UserType } from "./user";

export interface Review {
  id: number;
  comment: string;
  rating: number;
  hotel_id: number;
  user_id: number;
  user: UserType;
  created_at: string;
  updated_at: string;
}
