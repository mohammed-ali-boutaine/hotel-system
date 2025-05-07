export type UserRole = "client" | "admin" | "owner" | "super-admin";

export interface UserType {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  profile_path?: null | string | File;
  address?: string;
  created_at: string;
  updated_at: string;
}
