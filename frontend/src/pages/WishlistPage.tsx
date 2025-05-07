import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useWishlistStore } from "../store/useWishlistStore";
import Button from "../components/static/Button";
// import HotelCard from "../components/hotels/HotelCard";
import { Hotel } from "../types/hotel";
import HotelCard from "../components/hotel/HotelCard";

const WishlistPage: React.FC = () => {
  const { wishlist, fetchWishlist, loading } = useWishlistStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  if (loading) {
    return (
      <div className="container min-h-[800px] mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-4 animate-pulse"
            >
              <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!wishlist.length) {
    return (
      <div className="container  min-h-[400px] mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">Your Wishlist is Empty</h2>
        <p className="text-gray-600 mb-8">
          Start adding hotels to your wishlist to see them here!
        </p>
        <Button onClick={() => navigate("/")}
        >
        Browse Hotels

        </Button>

      </div>
    );
  }

  return (
    <div className="container  min-h-[400px] mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((hotel: Hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))} 
      </div>
    </div>
  );
};

export default WishlistPage;
