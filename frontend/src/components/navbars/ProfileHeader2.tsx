// import { Link, useNavigate } from "react-router-dom";

// import {
//   User,
//   MessageSquare,
//   Heart,
//   HelpCircle,
//   LogOut,
//   Phone,
//   Home,
// } from "lucide-react";
// import axiosInstance from "../../utils/axios";
// import { UserType } from "../../types";
// import { useUserStore } from "../../store/useUserStore";
// import { useEffect, useRef, useState } from "react";

// const MENU_ITEMS = [
//   { to: "/profile", icon: User, label: "Profile" },
//   { to: "/wishlist", icon: Heart, label: "Wishlist" },
//   { to: "/messages", icon: MessageSquare, label: "Messages" },
//   { to: "/become-host", icon: Home, label: "Become a Host" },
//   { to: "/help", icon: HelpCircle, label: "Help Center" },
//   { to: "/contact", icon: Phone, label: "Contact" },
// ] as const;

// type ProfileHeaderProps = {
//   user: UserType;
// };

// const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user }) => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const logoutStore = useUserStore((state) => state.logout);
//   const navigate = useNavigate();

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(event.target as Node)
//       ) {
//         setIsDropdownOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // Toggle dropdown visibility
//   const toggleDropdown = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   // Function to get initial of user's name
//   const getInitial = (name: string) => {
//     if (!name || typeof name !== "string") return "U";
//     return name.trim().charAt(0).toUpperCase();
//   };

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

//   return (
//     <div
//       className="relative"
//       ref={dropdownRef}
//       role="navigation"
//       aria-label="User menu"
//     >
//       <div
//         className="flex items-center space-x-2 cursor-pointer"
//         onClick={toggleDropdown}
//         onKeyDown={(e) => e.key === "Enter" && toggleDropdown()}
//         tabIndex={0}
//         role="button"
//         aria-expanded={isDropdownOpen}
//         aria-haspopup="true"
//       >
//         <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-medium">
//           {getInitial(user.name)}
//         </div>
//       </div>

//       {/* Dropdown menu */}
//       {isDropdownOpen && (
//         <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg overflow-hidden z-10">
//           <div className="py-1">
//             {MENU_ITEMS.map(({ to, icon: Icon, label }) => (
//               <Link
//                 key={to}
//                 to={to}
//                 className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//               >
//                 <Icon size={16} className="mr-3 text-gray-500" />
//                 {label}
//               </Link>
//             ))}
//             <div className="border-t border-gray-200 my-1"></div>
//             <button
//               onClick={logout}
//               className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100  cursor-pointer"
//             >
//               <LogOut size={16} className="mr-3 text-gray-500" />
//               Logout
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ProfileHeader;
