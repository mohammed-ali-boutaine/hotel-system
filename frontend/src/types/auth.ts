import { UserType } from "./user";

export interface AuthResponse {
  token: string;
  user: UserType;
}
