import { Route } from "react-router-dom";
import OwnerLayout from "../layouts/OwnerLayout";
import OwnerHomePage from "../pages/owner/OwnerHomePage";
import Hotels from "../pages/owner/Hotels";
import HotelForm from "../components/hotel/HotelForm";
import HotelDetail from "../pages/owner/HotelDetail";
import HotelRooms from "../pages/owner/HotelRooms";
import ImprovedRoomForm from "../components/room/ImprovedRoomForm";
import RoomDetail from "../pages/owner/RoomDetail";
import Rooms from "../pages/owner/Rooms";
import ProfilePage from "../pages/ProfilePage";
import HotelBookings from "../pages/owner/HotelBookings";
import OwnerBookings from "../pages/owner/OwnerBookings";
import PrivateRoute from "./PrivateRoute";
// import { useUserStore } from "../store/useUserStore";
// import { useEffect } from "react";
import NotFound from "../components/static/NotFound";
import { UserType } from "../types";

export const OwnerRoutes = (user?: UserType | null) => {
  //   const { user, fetchUserFromToken } = useUserStore();

  //   useEffect(() => {
  //     if (!user) {
  //       fetchUserFromToken();
  //     }
  //     // eslint-disable-next-line react-hooks/exhaustive-deps
  //   }, []);

  return (
    //     <Routes>
    user && (
      <Route
        path="/owner"
        element={
          <PrivateRoute
            allowedRoles={["owner", "admin", "super-admin"]}
            user={user}
          />
        }
      >
        <Route element={<OwnerLayout />}>
          <Route index element={<OwnerHomePage />} />
          <Route path="hotels" element={<Hotels />} />
          <Route path="hotels/new" element={<HotelForm />} />
          <Route path="hotels/:id" element={<HotelDetail />} />
          <Route path="hotels/:id/edit" element={<HotelForm />} />
          <Route path="hotels/:hotelId/rooms" element={<HotelRooms />} />
          <Route
            path="hotels/:hotelId/rooms/new"
            element={<ImprovedRoomForm />}
          />
          <Route
            path="hotels/:hotelId/rooms/:id/edit"
            element={<ImprovedRoomForm isEdit={true} />}
          />
          <Route path="rooms/:id" element={<RoomDetail />} />
          <Route path="rooms" element={<Rooms />} />
          <Route path="bookings" element={<OwnerBookings />} />
          <Route path="hotels/:hotelId/bookings" element={<HotelBookings />} />
          {/* <Route path="booking" element={<ProfilePage />} /> */}
          <Route path="profile" element={<ProfilePage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    )

    //     </Routes>
  );
};
