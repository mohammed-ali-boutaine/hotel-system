import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  MessageSquare,
  Heart,
  HelpCircle,
  LogOut,
  Phone,
  Home,
} from "lucide-react";
import axiosInstance from "../../utils/axios";
import { useUserStore } from "../../store/useUserStore";
import { UserType } from "../../types";

// Menu items shared across different user roles
// const COMMON_MENU_ITEMS = [
//   { to: "/profile", icon: User, label: "Profile" },
//   { to: "/help", icon: HelpCircle, label: "Help Center" },
//   { to: "/contact", icon: Phone, label: "Contact" },
// ] as const;

// // Menu items specific to client users
// const CLIENT_MENU_ITEMS = [
//   { to: "/wishlist", icon: Heart, label: "Wishlist" },
//   { to: "/messages", icon: MessageSquare, label: "Messages" },
//   { to: "/become-host", icon: Home, label: "Become a Host" },
// ] as const;

// Role-specific menu items
const ROLE_SPECIFIC_ITEMS = {
  client: [
    { to: "/profile", icon: User, label: "Profile" },
    { to: "/bookings", icon: MessageSquare, label: "My Bookings" },
    { to: "/wishlist", icon: Heart, label: "Wishlist" },
    { to: "/messages", icon: MessageSquare, label: "Messages" },
    { to: "/help", icon: HelpCircle, label: "Help Center" },
    { to: "/contact", icon: Phone, label: "Contact" },
  ],
  owner: [
    { to: "/owner/profile", icon: User, label: "Profile" },
    { to: "/owner/hotels", icon: Home, label: "My Hotels" },
    // { to: "/owner/messages", icon: MessageSquare, label: "Messages" },
    { to: "/owner/help", icon: HelpCircle, label: "Help Center" },
    { to: "/owner/contact", icon: Phone, label: "Contact" },
  ],
  admin: [
    { to: "/admin", icon: User, label: "Admin Dashboard" },
    { to: "/admin/profile", icon: User, label: "Profile" },
    { to: "/admin/settings", icon: HelpCircle, label: "Settings" },
  ],
  "super-admin": [
    { to: "/super-admin", icon: User, label: "Control Panel" },
    { to: "/super-admin/admins", icon: User, label: "Manage Admins" },
    { to: "/super-admin/settings", icon: HelpCircle, label: "System Settings" },
  ],
};

type ProfileHeaderProps = {
  user: UserType;
};

const ProfileSection: React.FC<ProfileHeaderProps> = ({ user }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const logoutStore = useUserStore((state) => state.logout);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Toggle dropdown visibility
  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Function to get initial of user's name
  const getInitial = (name?: string) => {
    if (!name || typeof name !== "string") return "U";
    return name.trim().charAt(0).toUpperCase();
  };

  // Logout function
  const logout = async () => {
    try {
      // Call the logout API endpoint
      await axiosInstance.post("/logout");

      // Update the store to clear user data
      logoutStore();

      // Close the dropdown
      setIsDropdownOpen(false);

      // Redirect to the login page after successful logout
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
      // Optionally, you could show a toast or alert here
    }
  };

  // Get menu items based on user role
  const getMenuItems = () => {
    const role = user?.role || "client";
    return ROLE_SPECIFIC_ITEMS[role as keyof typeof ROLE_SPECIFIC_ITEMS] || ROLE_SPECIFIC_ITEMS.client;
  };

  const menuItems = getMenuItems();

  return (
    <div
      className="relative"
      ref={dropdownRef}
      role="navigation"
      aria-label="User menu"
    >
      <div
        className="flex items-center space-x-2 cursor-pointer"
        onClick={toggleDropdown}
        onKeyDown={(e) => e.key === "Enter" && toggleDropdown()}
        tabIndex={0}
        role="button"
        aria-expanded={isDropdownOpen}
        aria-haspopup="true"
      >
        <span className="text-sm font-medium text-gray-700 hidden sm:block">
          {user?.name || "User"}
        </span>
        {user?.profile_path ? (
          <img
            // src={`user.profile_path`}
            src={'http://127.0.0.1:8000/storage/'+user.profile_path}

            alt="Profile"
            className="w-10 h-10 rounded-full object-cover border border-gray-200"
          />
        ) : (
          <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center  font-medium text-[var(--primary-color)]  border-2 border-[var(--primary-color)]">
            {getInitial(user?.name)}
          </div>
        )}
      </div>

      {/* Dropdown menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg overflow-hidden z-10">
          <div className="py-1">
            {/* User info at top of dropdown */}
            <div className="px-4 py-3 border-b border-gray-100">
              <p className="text-sm font-medium text-gray-800">{user?.name}</p>
              <p className="text-xs text-gray-500 truncate">{user?.email}</p>
            </div>
            
            {/* Menu items */}
            {menuItems.map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={() => setIsDropdownOpen(false)}
              >
                <Icon size={16} className="mr-3 text-gray-500" />
                {label}
              </Link>
            ))}
            
            {/* Logout button */}
            <div className="border-t border-gray-200 my-1"></div>
            <button
              onClick={logout}
              className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            >
              <LogOut size={16} className="mr-3 text-gray-500" />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileSection;