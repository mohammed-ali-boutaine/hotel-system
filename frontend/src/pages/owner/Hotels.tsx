import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Hotel } from "../../types/hotel";
import axiosInstance from "../../utils/axios";
import LoadingSpinner from "../../components/static/LoadingSpinner";
import Button from "../../components/static/Button";
import DetailLink from "../../components/static/DetailLink";
import DeleteButton from "../../components/static/DeleteButton";
import EditButton from "../../components/static/EditButton";
// import { useUserStore } from "../../store/useUserStore";
// 
const Hotels: React.FC = () => {
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // const {user} = useUserStore()

  // console.log(user);
  
  const location = useLocation();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const url = "/owner/hotels";

        const response = await axiosInstance.get(url);

        setHotels(response.data.data);
        setError(null);
      } catch (err) {
        setError("Failed to fetch hotels");
        console.error("Error fetching hotels:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHotels();
  }, [location.pathname]);

  const handleDelete = async (id: number) => {
    try {
      await axiosInstance.delete(`/hotels/${id}`);
      setHotels(hotels.filter((hotel) => hotel.id !== id));
      console.log("Hotel deleted successfully:", id);
    } catch (err) {
      console.error("Error deleting hotel:", err);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-red-600">Error: {error}</div>
      </div>
    );


  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">
          My Hotels
        </h1>
        <Link to="/owner/hotels/new">
          <Button>Add New Hotel</Button>
        </Link>
      </div>

      {/* Hotels container */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <div
            key={hotel.id}
            className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 w-full relative"
          >
            <div className="absolute top-2 right-2 flex gap-2 z-10">
              <EditButton  to={`/owner/hotels/${hotel.id}/edit`} />
              {/* update button redirection  */}
     

              {/* delete button  */}
              <DeleteButton
                onClick={() => {
                  handleDelete(hotel.id);
                }}
              />
            </div>
            {/* )} */}

            {/* Hotel Image with hover zoom effect */}
            <div className="overflow-hidden">
              {hotel.cover_path ? (
                <img
                  src={`http://127.0.0.1:8000/storage/${hotel.profile_path}`}
                  alt={hotel.name}
                  className="w-full h-64 object-cover transition-transform duration-500 hover:scale-110"
                />
              ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                  <span className="text-gray-500">No image available</span>
                </div>
              )}
            </div>

            <div className="p-5">
              <h2 className="text-lg font-semibold mb-1 hover:text-blue-600 transition-colors duration-300">
                {hotel.name}
              </h2>
              <p className="text-gray-600 text-sm mb-1">
                <span className="inline-block mr-1">📍</span>
                {hotel.city}, {hotel.country}
              </p>
              <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                {hotel.description}
              </p>

              <div className="mt-4">
                {/* Side-by-side buttons instead of stacked */}
                <div className="flex gap-2">
                  {/* // detail link  */}
                  <DetailLink to={`/owner/hotels/${hotel.id}`} />

                  <DetailLink
                    to={`/owner/hotels/${hotel.id}/rooms`}
                    name="Rooms"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <Link to={`/owner/hotels/${hotel.id}/bookings`}       className="flex-1 gap-1.5 py-2 px-3 text-center border border-gray-300 rounded-md hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-all duration-300 text-gray-700 flex items-center justify-center"
 >
            
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-500 hover:text-blue-600 transition-colors duration-300"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 7h18M3 12h18m-7 5h7m-7 0a2 2 0 01-2-2m2 2a2 2 0 002-2m-2 2a2 2 0 01-2-2m2 2a2 2 0 002-2"
                      />
                    </svg>
                      Bookings
                    {/* </Button> */}
                  {/* Booking */}
                  </Link>

                  {/* <DetailLink
                    to={`/owner/hotels/${hotel.id}/rooms`}
                    name="Rooms"
                  /> */}
                </div>
              </div>
            </div>
          </div>
        ))}

        {hotels.length === 0 && (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500 text-lg">No hotels found</p>
           
          </div>
        )}
      </div>
    </div>
  );
};

export default Hotels;
