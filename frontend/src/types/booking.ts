import { Room } from "./room";

export interface Booking {
  id: number;
  room_id: number;
  client_id: number;
  check_in: string;
  check_out: string;
  number_of_guests: number;
  total_price: number;
  status: string;
  created_at?: string;
  updated_at?: string;
  room?: Room;
}
