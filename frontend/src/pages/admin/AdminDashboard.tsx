import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axios";
import { Link } from "react-router-dom";
import {
  // Hotel,
  BedOutlined,
  // Group,
  CalendarToday,
  ConfirmationNumber,
  // Paid,
  // TrendingUp,
  Business,
  Person,
  AttachMoney,
  Percent,
} from "@mui/icons-material";

interface DashboardStats {
  totalHotels: number;
  totalRooms: number;
  totalUsers: number;
  totalBookings: number;
  recentBookings: any[];
  recentUsers: any[];
  bookingStats: {
    confirmed: number;
    pending: number;
    cancelled: number;
  };
  revenueStats: {
    total: number;
  };
  occupancyRate: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalHotels: 0,
    totalRooms: 0,
    totalUsers: 0,
    totalBookings: 0,
    recentBookings: [],
    recentUsers: [],
    bookingStats: {
      confirmed: 0,
      pending: 0,
      cancelled: 0,
    },
    revenueStats: {
      total: 0,
    },
    occupancyRate: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [hotelsRes, roomsRes, usersRes, bookingsRes] = await Promise.all([
          axiosInstance.get("/admin/hotels"),
          axiosInstance.get("/admin/rooms"),
          axiosInstance.get("/admin/users"),
          axiosInstance.get("/admin/bookings"),
        ]);

        console.log("Hotels Data:", hotelsRes);
        console.log("Rooms Data:", roomsRes);
        console.log("Users Data:", usersRes);
        console.log("Bookings Data:", bookingsRes.data.bookings);

        const bookings = bookingsRes.data.bookings;
        const bookingStats = {
          confirmed: bookings.filter((b: any) => b.status === "confirmed")
            .length,
          pending: bookings.filter((b: any) => b.status === "pending").length,
          cancelled: bookings.filter((b: any) => b.status === "cancelled")
            .length,
        };

        // Calculate revenue (assuming each booking has a price field)
        const totalRevenue = bookings.reduce(
          (sum: number, b: any) => sum + (b.price || 0),
          0
        );

        // Calculate occupancy rate (simplified)
        const totalRooms = roomsRes.data.rooms.length;
        const occupiedRooms = bookings.filter(
          (b: any) => b.status === "confirmed"
        ).length;
        const occupancyRate =
          totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;

        setStats({
          totalHotels: hotelsRes.data.hotels.length,
          totalRooms: roomsRes.data.rooms.length,
          totalUsers: usersRes.data.users.length,
          totalBookings: bookings.length,
          recentBookings: bookings.slice(0, 5),
          recentUsers: usersRes.data.users.slice(0, 5),
          bookingStats,
          revenueStats: {
            total: totalRevenue,
          },
          occupancyRate,
        });
        setError(null);
      } catch (err) {
        setError("Failed to fetch dashboard data");
        console.error("Error fetching dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return <div className="bg-red-50 text-red-600 p-4 rounded-md">{error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Hotels"
          value={stats.totalHotels}
          icon={<Business />}
          color="bg-gradient-to-br from-blue-500 to-blue-600"
        />
        <StatCard
          title="Total Rooms"
          value={stats.totalRooms}
          icon={<BedOutlined />}
          color="bg-gradient-to-br from-emerald-500 to-emerald-600"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={<Person />}
          color="bg-gradient-to-br from-violet-500 to-violet-600"
        />
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={<CalendarToday />}
          color="bg-gradient-to-br from-amber-500 to-amber-600"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <ConfirmationNumber className="mr-2 text-blue-500" />
            Booking Status
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center text-gray-700">
                <div className="h-3 w-3 rounded-full bg-emerald-500 mr-2"></div>
                <span>Confirmed</span>
              </div>
              <span className="font-medium text-emerald-600">
                {stats.bookingStats.confirmed}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center text-gray-700">
                <div className="h-3 w-3 rounded-full bg-amber-500 mr-2"></div>
                <span>Pending</span>
              </div>
              <span className="font-medium text-amber-600">
                {stats.bookingStats.pending}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center text-gray-700">
                <div className="h-3 w-3 rounded-full bg-red-500 mr-2"></div>
                <span>Cancelled</span>
              </div>
              <span className="font-medium text-red-600">
                {stats.bookingStats.cancelled}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <AttachMoney className="mr-2 text-emerald-500" />
            Revenue
          </h3>
          <div className="text-2xl font-bold text-emerald-600">
            ${stats.revenueStats.total.toLocaleString()}
          </div>
          <p className="text-sm text-gray-600 mt-1">Total Revenue</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Percent className="mr-2 text-blue-500" />
            Occupancy Rate
          </h3>
          <div className="text-2xl font-bold text-blue-600">
            {stats.occupancyRate.toFixed(1)}%
          </div>
          <p className="text-sm text-gray-600 mt-1">Current Occupancy</p>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Bookings */}
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <CalendarToday className="mr-2 text-blue-500" fontSize="small" />
              Recent Bookings
            </h2>
            <Link
              to="/admin/bookings"
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {stats.recentBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-100 hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="font-medium">Booking #{booking.id}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(booking.created_at).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-emerald-600">
                    ${booking.price?.toLocaleString()}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      booking.status === "confirmed"
                        ? "bg-emerald-100 text-emerald-800"
                        : booking.status === "cancelled"
                        ? "bg-red-100 text-red-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {booking.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold flex items-center">
              <Person className="mr-2 text-violet-500" fontSize="small" />
              Recent Users
            </h2>
            <Link
              to="/admin/users"
              className="text-violet-600 hover:text-violet-800 text-sm font-medium"
            >
              View All
            </Link>
          </div>
          <div className="space-y-4">
            {stats.recentUsers.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-md border border-gray-100 hover:bg-gray-100 transition-colors"
              >
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    user.role === "admin"
                      ? "bg-violet-100 text-violet-800"
                      : user.role === "owner"
                      ? "bg-emerald-100 text-emerald-800"
                      : "bg-blue-100 text-blue-800"
                  }`}
                >
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

interface StatCardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}

const StatCard = ({ title, value, icon, color }: StatCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-6 hover:shadow-lg transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-semibold mt-1">{value}</p>
        </div>
        <div className={`${color} p-3 rounded-full text-white shadow-md`}>
          {icon}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
