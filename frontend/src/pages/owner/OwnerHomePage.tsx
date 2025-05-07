import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FaHotel,
  FaPlus,
  FaChartLine,
  FaUsers,
  FaCalendarAlt,
  FaStar,
  FaMoneyBillWave,
} from "react-icons/fa";
import axiosInstance from "../../utils/axios";
import LoadingSpinner from "../../components/static/LoadingSpinner";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
// import { useUserStore } from '../../store/useUserStore';
// import { log } from 'console';

interface Statistics {
  total_hotels: number;
  total_rooms: number;
  average_rating: number;
  total_revenue: number;
  monthly_revenue: Array<{
    month: number;
    year: number;
    revenue: number;
  }>;
  occupancy_rate: number;
  total_bookings: number;
}

const OwnerHomePage: React.FC = () => {
  const [stats, setStats] = useState<Statistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/owner/statistics");
      // console.log(response);
      
      setStats(response.data.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching statistics:", err);
      setError("Failed to load statistics");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const formatMonthlyData = (data: Statistics["monthly_revenue"] | undefined) => {
    if (!data || !Array.isArray(data)) {
      return [];
    }
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    return data.map((item) => ({
      name: `${months[item.month - 1]} ${item.year}`,
      revenue: item.revenue,
    }));
  };

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="bg-red-100 text-red-700 p-4 rounded">
        <p>{error}</p>
        <button
          onClick={() => fetchStatistics()}
          className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!stats) return null;
  // return "home page"
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Owner Dashboard</h1>
          <div className="text-sm text-gray-600">
            Last updated: {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <FaHotel className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Hotels</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {stats.total_hotels}
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <FaCalendarAlt className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Bookings</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {stats.total_bookings}
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-yellow-100 rounded-lg mr-4">
                <FaStar className="text-yellow-600 text-xl" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Average Rating</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {stats.average_rating}
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg mr-4">
                <FaMoneyBillWave className="text-purple-600 text-xl" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Revenue</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {formatCurrency(stats.total_revenue)}
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm mb-8">
          <h2 className="text-xl font-semibold mb-4">Monthly Revenue</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={formatMonthlyData(stats.monthly_revenue)}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ fill: "#6366f1" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Additional Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-lg mr-4">
                <FaUsers className="text-blue-600 text-xl" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Total Rooms</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {stats.total_rooms}
                </h3>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 rounded-lg mr-4">
                <FaChartLine className="text-green-600 text-xl" />
              </div>
              <div>
                <p className="text-gray-600 text-sm">Occupancy Rate</p>
                <h3 className="text-2xl font-bold text-gray-800">
                  {stats.occupancy_rate}%
                </h3>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/owner/hotels"
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-blue-100 rounded-lg mr-4 group-hover:bg-blue-200 transition-colors">
                <FaHotel className="text-blue-600 text-xl" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">My Hotels</h2>
            </div>
            <p className="text-gray-600">
              Manage your hotel listings, update information, and view bookings
            </p>
          </Link>

          <Link
            to="/owner/hotels/new"
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center mb-4">
              <div className="p-3 bg-green-100 rounded-lg mr-4 group-hover:bg-green-200 transition-colors">
                <FaPlus className="text-green-600 text-xl" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Add New Hotel
              </h2>
            </div>
            <p className="text-gray-600">
              Create a new hotel listing and start accepting bookings
            </p>
          </Link>

          <div className="bg-white p-6 rounded-xl shadow-sm">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-purple-100 rounded-lg mr-4">
                <FaUsers className="text-purple-600 text-xl" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800">
                Upcoming Bookings
              </h2>
            </div>
            <div className="space-y-3">
              <p className="text-gray-600">
                You have {stats.total_bookings} total bookings
              </p>
              <Link
                to="/owner/bookings"
                className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center"
              >
                View all bookings
                <svg
                  className="w-4 h-4 ml-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerHomePage;
