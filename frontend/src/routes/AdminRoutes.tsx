import { Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import PrivateRoute from "./PrivateRoute";
import { UserType } from "../types";
import AdminDashboard from "../pages/admin/AdminDashboard";
import TagsManagement from "../pages/admin/TagsManagement";
import HotelsManagement from "../pages/admin/HotelsManagement";
import RoomsManagement from "../pages/admin/RoomsManagement";
import UsersManagement from "../pages/admin/UsersManagement";
import BookingsManagement from "../pages/admin/BookingsManagement";
import ProfilePage from "../pages/ProfilePage";
import NotFound from "../components/static/NotFound";
// import { useUserStore } from "../store/useUserStore";
// import { useEffect } from "react";

// Admin Pages
// import AdminDashboard from "../pages/admin/Dashboard";
// import TagsManagement from "../pages/admin/TagsManagement";
// import HotelsManagement from "../pages/admin/HotelsManagement";
// import RoomsManagement from "../pages/admin/RoomsManagement";
// import UsersManagement from "../pages/admin/UsersManagement";

export const AdminRoutes = (user?: UserType | null) => {
  // const { user, fetchUserFromToken } = useUserStore();

  // useEffect(() => {
  //   if (!user) {
  //     fetchUserFromToken();
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return (
    // <Routes>
    user && (
      <Route
        path="/admin"
        element={
          <PrivateRoute allowedRoles={["admin", "super-admin"]} user={user} />
        }
      >
        <Route element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="tags" element={<TagsManagement />} />
          <Route path="hotels" element={<HotelsManagement />} />
          <Route path="rooms" element={<RoomsManagement />} />
          <Route path="users" element={<UsersManagement />} />
          <Route path="bookings" element={<BookingsManagement />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="*" element={<NotFound />} />


        </Route>
      </Route>
    )

    //   user &&    (   <Route
    //   path="/admin"
    //   element={
    //     <PrivateRoute allowedRoles={["admin", "super-admin"]} user={user} />
    //   }
    // >
    //   <Route element={<AdminLayout />}>
    //     {/* Admin specific routes would go here */}
    //   </Route>
    // </Route>)
    // }

    // </Routes>
  );
};
