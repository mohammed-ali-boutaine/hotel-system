import { Route } from "react-router-dom";
import ClientLayout from "../layouts/ClientLayout";
import Homepage from "../pages/HomePage";
import ProfilePage from "../pages/ProfilePage";
import HotelDetailPage from "../pages/HotelDetailPage";
import RoomDetailPage from "../pages/RoomDetailPage";
import WishlistPage from "../pages/WishlistPage";
import BookingsPage from "../pages/BookingsPage";
import PrivateRoute from "./PrivateRoute";
import { UserType } from "../types";

export const ClientRoutes = (user?: UserType | null) => (
  <Route path="/" element={<ClientLayout />}>
    <Route index element={<Homepage />} />
    <Route path="hotels/:id" element={<HotelDetailPage />} />
    <Route path="rooms/:id" element={<RoomDetailPage />} />
    {user && (
      <Route
        element={
          <PrivateRoute
            allowedRoles={["client", "admin", "super-admin"]}
            user={user}
          />
        }
      >
        <Route path="profile" element={<ProfilePage />} />
        <Route path="wishlist" element={<WishlistPage />} />
        <Route path="bookings" element={<BookingsPage />} />
      </Route>
    )}
  </Route>
);
