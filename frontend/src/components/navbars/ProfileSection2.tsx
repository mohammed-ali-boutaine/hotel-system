// import { useState, useRef, useEffect } from "react";
// import { Link, useNavigate } from "react-router-dom";
// // import { useUserStore } from "../../store/useUserStore";
// import { LogOut } from "lucide-react";
// import axiosInstance from "../../utils/axios";
// import { useUserStore } from "../../store/useUserStore";
// import { UserType } from "../../types";


// import {
//   User,
//   MessageSquare,
//   Heart,
//   HelpCircle,
//   LogOut,
//   Phone,
//   Home,
// } from "lucide-react";
// // Define the UserType interface
// // interface UserType {
// //   id: number;
// //   name: string;
// //   email: string;
// //   role: "client" | "admin" | "owner" | "super-admin";
// //   phone?: string;
// //   profile_path?: string;
// //   created_at: string;
// //   updated_at: string;
// // }

// const MENU_ITEMS = [
//   { to: "/profile", icon: User, label: "Profile" },
//   { to: "/wishlist", icon: Heart, label: "Wishlist" },
//   { to: "/messages", icon: MessageSquare, label: "Messages" },
//   { to: "/become-host", icon: Home, label: "Become a Host" },
//   { to: "/help", icon: HelpCircle, label: "Help Center" },
//   { to: "/contact", icon: Phone, label: "Contact" },
// ] as const;


// interface ProfileHeaderProps {
//   user: UserType;
// }

// const ProfileSection = ({ user }: ProfileHeaderProps) => {
//   const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const logoutStore = useUserStore((state) => state.logout);
//   const navigate = useNavigate();

//     // Close dropdown when clicking outside
//     useEffect(() => {
//       const handleClickOutside = (event: MouseEvent) => {
//         if (
//           dropdownRef.current &&
//           !dropdownRef.current.contains(event.target as Node)
//         ) {
//           setIsDropdownOpen(false);
//         }
//       };
  
//       document.addEventListener("mousedown", handleClickOutside);
//       return () => {
//         document.removeEventListener("mousedown", handleClickOutside);
//       };
//     }, []);

    


//   // Define profile links based on role
//   const getProfileLinks = () => {
//     switch (user.role) {
//       case "owner":
//         return [
//           { name: "Profile", href: "/owner/profile" },
//           { name: "Contact", href: "/owner/contact" },
//           { name: "Help", href: "/owner/help" },
//           // ,
//           // { name: "Logout", href: "/logout" },
//         ];
//       case "admin":
//         return [
//           { name: "Admin Dashboard", href: "/admin" },
//           { name: "Profile", href: "/admin/profile" },
//           { name: "Settings", href: "/admin/settings" },
//         ];
//       case "super-admin":
//         return [
//           { name: "Control Panel", href: "/super-admin" },
//           { name: "Manage Admins", href: "/super-admin/admins" },
//           { name: "System Settings", href: "/super-admin/settings" },
//           // { name: "Logout", href: "/logout" },
//         ];
//       case "client":
//       default:
//         return [
//           { name: "Profile", href: "/profile" },
//           { name: "My Bookings", href: "/bookings" },
//           { name: "Help", href: "/help" },
//           // { name: "Logout", href: "/logout" },
//         ];
//     }
//   };

//     // Toggle dropdown visibility
//     const toggleDropdown = () => {
//       setIsDropdownOpen(!isDropdownOpen);
//     };



 
//   const logout = async () => {
//     try {
//       // Call the logout API endpoint
//       await axiosInstance.post("/logout");

//       // Update the store to clear user data
//       logoutStore();

//       // Close the dropdown
//       setIsDropdownOpen(false);

//       // Redirect to the login page after successful logout
//       navigate("/login", { replace: true });
//     } catch (error) {
//       console.error("Logout failed:", error);
//       // Optionally, you could show a toast or alert here
//     }
//   };
//   // Get links based on user role
//   const profileLinks = getProfileLinks();

//   const toggleProfileDropdown = () => {
//     setProfileDropdownOpen(!profileDropdownOpen);
//   };

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setProfileDropdownOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // Get first character of name for avatar fallback
//   const getInitial = () => {
//     if (user?.name) return user.name.charAt(0).toUpperCase();
//     return "U"; // Default fallback
//   };

//   return (
//     <div className="relative" ref={dropdownRef}>
//       <button
//         onClick={toggleProfileDropdown}
//         className="flex items-center space-x-2 focus:outline-none"
//       >
//         <span className="text-sm font-medium text-gray-700">
//           {user?.name || "User"}
//         </span>
//         <div className="relative">
//           {user?.profile_path ? (
//             <img
//               src={user.profile_path}
//               alt="Profile"
//               className="w-8 h-8 rounded-full object-cover border border-gray-200"
//             />
//           ) : (
//             <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white font-medium">
//               {getInitial()}
//             </div>
//           )}
//         </div>
//       </button>

//       {/* Dropdown menu */}
//       {profileDropdownOpen && (
//         <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
//           {profileLinks.map((link) => (
//             <Link
//               key={link.name}
//               to={link.href}
//               className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//               onClick={() => setProfileDropdownOpen(false)}
//             >
//               {link.name}
//             </Link>
//           ))}
//           <div className="border-t border-gray-200 my-1"></div>
//           <button
//             onClick={logout}
//             className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100  cursor-pointer"
//           >
//             <LogOut size={16} className="mr-3 text-gray-500" />
//             Logout
//           </button>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfileSection;
