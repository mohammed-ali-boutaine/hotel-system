import { Outlet } from "react-router-dom";
import { useState } from "react";
import { Menu } from "lucide-react";
import Logo from "../components/static/Logo";
import { useUserStore } from "../store/useUserStore";
import DashboardSidebar from "../components/shared/DashboardSidebar";
import ProfileSection from "../components/navbars/ProfileSection";

const OwnerLayout = () => {
  const { user, loading } = useUserStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="h-screen">
      {/* Main Navbar */}
      <div className="fixed top-0 left-0 right-0 z-10 bg-white shadow-sm">
        <div className="flex items-center justify-between px-4 py-2">
          <div className="flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 mr-2 text-gray-700 rounded-md hover:bg-gray-100"
            >
              <Menu size={24} />
            </button>
            <Logo to="/owner" />
          </div>
          {loading ? (
            <div className="animate-spin">Loading...</div>
          ) : (
            user && <ProfileSection user={user} />
          )}
        </div>
      </div>

      {/* Sidebar */}
      <DashboardSidebar type="owner" isOpen={sidebarOpen} />

      {/* Main Content */}
      <div
        className={`relative min-h-full pt-16 ${
          sidebarOpen ? "ml-64" : "md:ml-16"
        } transition-all duration-300`}
      >
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default OwnerLayout;
