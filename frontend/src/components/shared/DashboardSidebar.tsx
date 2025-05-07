import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  PlusSquare,
  Bed,
  Calendar,
  Tags,
  Users,
  BarChart,
} from "lucide-react";

interface DashboardSidebarProps {
  type: "admin" | "owner";
  isOpen: boolean;
}

const DashboardSidebar = ({ type, isOpen }: DashboardSidebarProps) => {
  const location = useLocation();
  const adminLinks = [
    { name: "Dashboard", href: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "Tags", href: "/admin/tags", icon: <Tags size={20} /> },
    { name: "Hotels", href: "/admin/hotels", icon: <Building2 size={20} /> },
    { name: "Rooms", href: "/admin/rooms", icon: <Bed size={20} /> },
    { name: "Users", href: "/admin/users", icon: <Users size={20} /> },
    { name: "Bookings", href: "/admin/bookings", icon: <Calendar size={20} /> },
  ];

  const ownerLinks = [
    { name: "Dashboard", href: "/owner", icon: <LayoutDashboard size={20} /> },
    {
      name: "View Hotels",
      href: "/owner/hotels",
      icon: <Building2 size={20} />,
    },
    {
      name: "Add Hotel",
      href: "/owner/hotels/new",
      icon: <PlusSquare size={20} />,
    },
    { name: "Manage Rooms", href: "/owner/rooms", icon: <Bed size={20} /> },
    { name: "Bookings", href: "/owner/bookings", icon: <Calendar size={20} /> },
    {
      name: "Statistics",
      href: "/owner/statistics",
      icon: <BarChart size={20} />,
    },
  ];

  const links = type === "admin" ? adminLinks : ownerLinks;

  const isActive = (path: string) => {
    return (
      location.pathname === path || location.pathname.startsWith(`${path}/`)
    );
  };

  return (
    <div
      className={`fixed left-0 z-10 h-full shadow-lg transition-all duration-300 ease-in-out ${
        isOpen ? "w-64" : "w-0 md:w-16"
      }`}
      style={{
        top: "55px",
        backgroundColor: "var(--gray-color)",
      }}
    >
      <div className="flex flex-col h-full py-6 overflow-hidden">
        {links.map((link) => {
          const active = isActive(link.href);
          return (
            <Link
              key={link.name}
              to={link.href}
              className={`flex items-center mb-1 px-5 py-3 transition-all duration-200 rounded-r-lg
                ${isOpen ? "justify-start mx-2" : "justify-center mx-1"}
                ${
                  active
                    ? "bg-opacity-50 text-white font-medium"
                    : "text-slate-600 hover:bg-opacity-30 hover:text-white"
                }`}
              style={{
                backgroundColor: active
                  ? "var(--secondary-color)"
                  : "transparent",
              }}
            >
              <span className={active ? "text-white" : ""}>{link.icon}</span>
              {isOpen && (
                <span className="ml-3 whitespace-nowrap transition-opacity duration-200">
                  {link.name}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default DashboardSidebar;
