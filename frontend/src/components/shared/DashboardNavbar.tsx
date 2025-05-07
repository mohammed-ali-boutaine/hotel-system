import { NavLink } from "react-router-dom";
import { useUserStore } from "../../store/useUserStore";

interface DashboardNavbarProps {
  type: "admin" | "owner";
}

const DashboardNavbar = ({ type }: DashboardNavbarProps) => {
  const { user } = useUserStore();

  const adminRoutes = [
    { path: "/admin", label: "Dashboard" },
    { path: "/admin/tags", label: "Tags" },
    { path: "/admin/hotels", label: "Hotels" },
    { path: "/admin/rooms", label: "Rooms" },
    { path: "/admin/users", label: "Users" },
    { path: "/admin/bookings", label: "Bookings" },
  ];

  const ownerRoutes = [
    { path: "/owner", label: "Dashboard" },
    { path: "/owner/hotels", label: "Hotels" },
    { path: "/owner/rooms", label: "Rooms" },
    { path: "/owner/bookings", label: "Bookings" },
    { path: "/owner/statistics", label: "Statistics" },
  ];

  const routes = type === "admin" ? adminRoutes : ownerRoutes;

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <h1 className="text-xl font-bold text-gray-800">
                {type === "admin" ? "Admin Dashboard" : "Owner Dashboard"}
              </h1>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              {routes.map((route) => (
                <NavLink
                  key={route.path}
                  to={route.path}
                  className={({ isActive }) =>
                    `inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                      isActive
                        ? "border-indigo-500 text-gray-900"
                        : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }`
                  }
                >
                  {route.label}
                </NavLink>
              ))}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <div className="ml-3 relative">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-700">
                  Welcome, {user?.name}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user?.role === "admin"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {user?.role}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className="sm:hidden">
        <div className="pt-2 pb-3 space-y-1">
          {routes.map((route) => (
            <NavLink
              key={route.path}
              to={route.path}
              className={({ isActive }) =>
                `block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  isActive
                    ? "bg-indigo-50 border-indigo-500 text-indigo-700"
                    : "border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700"
                }`
              }
            >
              {route.label}
            </NavLink>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default DashboardNavbar;
