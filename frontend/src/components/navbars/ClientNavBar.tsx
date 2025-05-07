import React, { useState, useRef, useEffect } from "react";
import Button from "../static/Button";
import { Link } from "react-router-dom";
import SearchBar from "./SearchBar";
import { useUserStore } from "../../store/useUserStore";
import { useWishlistStore } from "../../store/useWishlistStore";
import Logo from "../static/Logo";
import ProfileSection from "./ProfileSection";

const ClientNavBar: React.FC = () => {
  const { user, loading } = useUserStore();
  const { wishlist } = useWishlistStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    useUserStore.getState().fetchUserFromToken();

    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <nav className="bg-white shadow-sm border-b border-[#B0B0B0] relative z-50 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          {loading ? (
            <div className="h-10 bg-gray-100 rounded-full animate-pulse" />
          ) : (
            <div className="flex-shrink-0 flex items-center">
              <Logo to="/" />
            </div>
          )}

          {/* Search Bar */}
          <div className="hidden lg:block flex-grow mx-8">
            <div className="flex items-center justify-center">
              <div className="relative w-full max-w-xl">
                {loading ? (
                  <div className="h-10 bg-gray-100 rounded-full animate-pulse" />
                ) : (
                  <SearchBar />
                )}
              </div>
            </div>
          </div>

          {/* User Section */}
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="flex items-center space-x-4">
                <div className="w-20 h-10 bg-gray-200 rounded animate-pulse" />
              </div>
            ) : user ? (
              <>
                <Link
                  to="/wishlist"
                  className="relative p-2 text-gray-700 hover:text-gray-900"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  {wishlist.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {wishlist.length}
                    </span>
                  )}
                </Link>
                <ProfileSection user={user} />
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button type="button" variant="outline">
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button variant="primary">Sign up</Button>
                </Link>

                {/* Dropdown Menu */}
                <div className="relative" ref={menuRef}>
                  <button
                    className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none transition-colors duration-200"
                    onClick={() => setMenuOpen(!menuOpen)}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  </button>

                  <div
                    className={`absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl py-2 z-50 ring-1 ring-[#B0B0B0] transform transition-all duration-200 ease-in-out ${
                      menuOpen
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 -translate-y-2 pointer-events-none"
                    }`}
                  >
                    {loading ? (
                      <>
                        {[1, 2, 3, 4].map((item) => (
                          <div key={item} className="px-4 py-2">
                            <div className="h-4 bg-gray-200 rounded animate-pulse" />
                          </div>
                        ))}
                      </>
                    ) : (
                      <>
                        <Link
                          to="/contact"
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 font-medium"
                        >
                          Contact
                        </Link>
                        <Link
                          to="/about"
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 font-medium"
                        >
                          About
                        </Link>
                        <Link
                          to="/features"
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 font-medium"
                        >
                          Features
                        </Link>
                        <Link
                          to="/help-center"
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150 font-medium"
                        >
                          Help Center
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ClientNavBar;
