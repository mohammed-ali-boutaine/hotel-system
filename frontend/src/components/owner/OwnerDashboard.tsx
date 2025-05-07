import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import HotelList from "../hotel/HotelList";
import HotelDetail from "../hotel/HotelDetail";
import Button from "../static/Button";
import { HotelType } from "../../types";

// interface Hotel {
//   id: number;
//   name: string;
//   address: string;
//   city: string;
//   country: string;
//   description: string | null;
//   profile_path: string | null;
//   cover_path: string | null;
//   coordinates: {
//     lat: number;
//     lng: number;
//   };
//   owner_id: number;
//   created_at: string;
//   updated_at: string;
// }

interface DashboardStats {
  totalHotels: number;
  countriesCount: number;
  citiesCount: number;
  recentActivity: {
    id: number;
    type: string;
    details: string;
    date: string;
  }[];
}

const OwnerDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [selectedHotel, setSelectedHotel] = useState<HotelType | null>(null);
  const [stats, setStats] = useState<DashboardStats>({
    totalHotels: 0,
    countriesCount: 0,
    citiesCount: 0,
    recentActivity: [],
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  // const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/dashboard");
        setStats(response.data);
        // setError(null);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setStats({
          totalHotels: 5,
          countriesCount: 3,
          citiesCount: 4,
          recentActivity: [
            {
              id: 1,
              type: "create",
              details: 'Added "Grand Hotel"',
              date: "2025-04-15T14:30:00",
            },
            {
              id: 2,
              type: "update",
              details: 'Updated "Beach Resort" location',
              date: "2025-04-10T09:15:00",
            },
            {
              id: 3,
              type: "delete",
              details: 'Removed "Old Motel"',
              date: "2025-04-05T16:45:00",
            },
          ],
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const handleAddNewHotel = () => {
    navigate("/hotels/new");
  };

  const handleEditHotel = (hotel: HotelType) => {
    navigate(`/hotels/edit/${hotel.id}`);
  };

  const handleViewHotel = (hotel: HotelType) => {
    setSelectedHotel(hotel);
  };

  const handleDeleteHotel = (hotelId: number) => {
    console.log(`Hotel ${hotelId} deleted`);
    setStats((prev) => ({
      ...prev,
      totalHotels: prev.totalHotels - 1,
      recentActivity: [
        {
          id: Date.now(),
          type: "delete",
          details: "Deleted a hotel",
          date: new Date().toISOString(),
        },
        ...prev.recentActivity.slice(0, 4),
      ],
    }));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-gradient-to-r  ">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl font-semibold mb-2">
                Dashboard
              </h1>
            </div>

            <Button onClick={handleAddNewHotel}>Add New Hotel</Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-pulse flex space-x-4">
              <div className="rounded-full bg-indigo-200 h-12 w-12"></div>
              <div className="flex-1 space-y-4 py-1">
                <div className="h-4 bg-indigo-200 rounded w-3/4"></div>
                <div className="space-y-2">
                  <div className="h-4 bg-indigo-200 rounded"></div>
                  <div className="h-4 bg-indigo-200 rounded w-5/6"></div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-rose-50 text-rose-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 w-7"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                      Total Hotels
                    </h2>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.totalHotels}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-50 text-blue-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 w-7"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                      Countries
                    </h2>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.countriesCount}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-amber-50 text-amber-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-7 w-7"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <h2 className="text-gray-500 text-sm font-medium uppercase tracking-wider">
                      Cities
                    </h2>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.citiesCount}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Your Hotels
                </h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <HotelList
                    onEdit={handleEditHotel}
                    onDelete={handleDeleteHotel}
                    onView={handleViewHotel}
                  />
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Recent Activity
                </h2>
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="divide-y divide-gray-100">
                    {stats.recentActivity.length === 0 ? (
                      <div className="px-6 py-8 text-gray-500 text-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-10 w-10 mx-auto text-gray-300 mb-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <p>No recent activity</p>
                      </div>
                    ) : (
                      stats.recentActivity.map((activity) => (
                        <div
                          key={activity.id}
                          className="p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center">
                            <div
                              className={`flex-shrink-0 h-9 w-9 rounded-full flex items-center justify-center
                              ${
                                activity.type === "create"
                                  ? "bg-green-50 text-green-500"
                                  : activity.type === "update"
                                  ? "bg-blue-50 text-blue-500"
                                  : "bg-rose-50 text-rose-500"
                              }`}
                            >
                              {activity.type === "create" ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              ) : activity.type === "update" ? (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                </svg>
                              ) : (
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-5 w-5"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </div>
                            <div className="ml-4 flex-1">
                              <p className="text-sm font-medium text-gray-900">
                                {activity.details}
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                {new Date(activity.date).toLocaleDateString(
                                  "en-US",
                                  {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  }
                                )}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {selectedHotel && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <HotelDetail
              hotel={selectedHotel}
              onClose={() => setSelectedHotel(null)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
