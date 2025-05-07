import { Navigate, Outlet } from "react-router-dom";
import { UserRole, UserType } from "../types/user"; // Adjust the import path as needed

interface PrivateRouteProps {
  allowedRoles: UserRole[];
  user: UserType | null;
}

const PrivateRoute = ({ allowedRoles, user }: PrivateRouteProps) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Admin can access all routes
  if (user.role === "admin" || user.role === "super-admin") {
    return <Outlet />;
  }

  // Check if user's role is allowed
  if (!allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    return <Navigate to={`/${user.role}`} replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
