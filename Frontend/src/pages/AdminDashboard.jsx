import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import {
  FaChartLine,
  FaUsers,
  FaCalendarCheck,
  FaSignOutAlt,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglass,
  FaSearch,
  FaBell,
  FaClipboardList,
  FaPlaneDeparture,
  FaHotel,
  FaMoneyBillWave,
  FaClock,
  FaUserEdit,
  FaUserPlus,
  FaTrash,
  FaEye,
  FaCalendarAlt
} from "react-icons/fa";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [adminEmail, setAdminEmail] = useState("");
  const [stats, setStats] = useState({
    totalBookings: 0,
    approved: 0,
    pending: 0,
    rejected: 0,
    revenue: 0
  });
  const [activeSection, setActiveSection] = useState("dashboard");
  const [users, setUsers] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [topDestinations, setTopDestinations] = useState([]);

  useEffect(() => {
    const email = localStorage.getItem("userEmail");
    const isAdmin = localStorage.getItem("isAdmin") === "true";
    
    if (!email || !isAdmin) {
      navigate("/login");
      return;
    }
    
    setAdminEmail(email);
    fetchBookings(email);
    fetchUsers();
    fetchRecentActivities();
    fetchTopDestinations();
  }, [navigate]);

  useEffect(() => {
    let filtered = [...bookings];
    
    if (activeTab !== "all") {
      filtered = filtered.filter(booking => booking.admin_status === activeTab);
    }
    
    if (searchQuery) {
      filtered = filtered.filter(booking => 
        booking.booking_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.booked_by?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        booking.email?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    setFilteredBookings(filtered);
  }, [bookings, activeTab, searchQuery]);

  const fetchBookings = async (email) => {
    try {
      setIsLoading(true);
      const response = await axios.get(`http://localhost/img/Travel-Planner/backend/admin_get_bookings.php?email=${email}`);
      
      if (response.data.status === "success") {
        setBookings(response.data.bookings || []);
        calculateStats(response.data.bookings || []);
      } else {
        alert("Failed to fetch bookings: " + response.data.message);
        setBookings([]);
        calculateStats([]);
      }
    } catch (error) {
      alert("Error connecting to server. Please check your connection or try again later.");
      setBookings([]);
      calculateStats([]);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateStats = (bookingsData) => {
    const approved = bookingsData.filter(b => b.admin_status === "approved").length;
    const pending = bookingsData.filter(b => b.admin_status === "pending").length;
    const rejected = bookingsData.filter(b => b.admin_status === "rejected").length;
    
    const revenue = bookingsData
      .filter(b => b.admin_status === "approved")
      .reduce((sum, booking) => sum + parseFloat(booking.total_cost || 0), 0);
    
    setStats({
      totalBookings: bookingsData.length,
      approved,
      pending,
      rejected,
      revenue
    });
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      const response = await axios.post("http://localhost/img/Travel-Planner/backend/admin_update_booking.php", {
        adminEmail: adminEmail,
        bookingId: bookingId,
        status: status
      });
      
      if (response.data.status === "success") {
        setBookings(bookings.map(booking => 
          booking.booking_id === bookingId 
            ? { ...booking, admin_status: status }
            : booking
        ));
      }
    } catch (error) {
      console.error("API call failed:", error);
    }
  };

  const deleteBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to delete this booking?")) return;

    try {
      const response = await axios.post("http://localhost/img/Travel-Planner/backend/admin_delete_booking.php", {
        bookingId,
      });
      if (response.data.status === "success") {
        alert("Booking deleted successfully!");
        setBookings(bookings.filter((booking) => booking.booking_id !== bookingId));
      } else {
        alert("Failed to delete booking: " + response.data.message);
      }
    } catch (error) {
      alert("An error occurred while deleting the booking.");
    }
  };

  const fetchUsers = async (query = "") => {
    try {
      const response = await axios.get(`http://localhost/img/Travel-Planner/backend/admin_get_users.php?search=${query}`);
      if (response.data && Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        setUsers([]);
      }
    } catch (error) {
      setUsers([]);
    }
  };

  const fetchRecentActivities = async () => {
    try {
      const response = await axios.get("http://localhost/img/Travel-Planner/backend/get_recent_activities.php");
      if (response.data.status === "success") {
        setRecentActivities(response.data.activities);
      } else {
        setRecentActivities([]);
      }
    } catch (error) {
      setRecentActivities([]);
    }
  };

  const fetchTopDestinations = async () => {
    try {
      const response = await axios.get("http://localhost/img/Travel-Planner/backend/get_top_destinations.php");
      if (response.data.status === "success") {
        setTopDestinations(response.data.destinations);
      } else {
        setTopDestinations([]);
      }
    } catch (error) {
      setTopDestinations([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const editUser = async (userId, updatedData) => {
    try {
      const response = await axios.post("http://localhost/img/Travel-Planner/backend/admin_edit_user.php", {
        userId,
        ...updatedData,
      });
      if (response.data.status === "success") {
        alert("User updated successfully!");
        fetchUsers();
      } else {
        alert("Failed to update user: " + response.data.message);
      }
    } catch (error) {
      alert("An error occurred while updating the user.");
    }
  };

  const deleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      const response = await axios.post("http://localhost/img/Travel-Planner/backend/admin_delete_user.php", {
        userId,
      });
      if (response.data.status === "success") {
        alert("User deleted successfully!");
        fetchUsers();
      } else {
        alert("Failed to delete user: " + response.data.message);
      }
    } catch (error) {
      alert("An error occurred while deleting the user.");
    }
  };

  const StatusBadge = ({ status }) => {
    if (status === "approved") {
      return (
        <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs flex items-center">
          <FaCheckCircle className="mr-1" /> Approved
        </span>
      );
    } else if (status === "rejected") {
      return (
        <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs flex items-center">
          <FaTimesCircle className="mr-1" /> Rejected
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs flex items-center">
          <FaHourglass className="mr-1" /> Pending
        </span>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
          <p className="mt-2 text-gray-700">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Sidebar */}
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl w-64 flex-shrink-0 rounded-r-2xl">
        <div className="p-4">
          <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Admin Panel
          </h2>
        </div>
        <nav className="mt-6">
          <button
            onClick={() => setActiveSection("dashboard")}
            className={`w-full flex items-center px-4 py-3 rounded-lg ${
              activeSection === "dashboard" ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-white/10"
            }`}
          >
            <FaChartLine className="w-5 h-5 mr-3" />
            Dashboard
          </button>
          <button
            onClick={() => setActiveSection("users")}
            className={`w-full flex items-center px-4 py-3 rounded-lg ${
              activeSection === "users" ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-white/10"
            }`}
          >
            <FaUsers className="w-5 h-5 mr-3" />
            Users
          </button>
          <button
            onClick={() => setActiveSection("bookings")}
            className={`w-full flex items-center px-4 py-3 rounded-lg ${
              activeSection === "bookings" ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-white/10"
            }`}
          >
            <FaCalendarCheck className="w-5 h-5 mr-3" />
            Bookings
          </button>
          <Link
            to="/admin/queries"
            className={`w-full flex items-center px-4 py-3 rounded-lg ${
              activeSection === "queries" ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-white/10"
            }`}
          >
            <FaClipboardList className="w-5 h-5 mr-3" />
            Queries
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-3 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg"
          >
            <FaSignOutAlt className="w-5 h-5 mr-3" />
            Logout
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-8">
        {activeSection === "dashboard" && (
          <div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6">
              Dashboard
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-blue-500/20 rounded-full">
                    <FaCalendarCheck className="text-blue-400 text-xl" />
                  </div>
                  <h3 className="text-gray-400 font-medium">Total Bookings</h3>
                </div>
                <p className="text-3xl font-bold text-white">{stats.totalBookings}</p>
                <div className="mt-2 text-sm text-blue-400">All time bookings</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-yellow-500/20 rounded-full">
                    <FaClock className="text-yellow-400 text-xl" />
                  </div>
                  <h3 className="text-gray-400 font-medium">Pending Approval</h3>
                </div>
                <p className="text-3xl font-bold text-white">{stats.pending}</p>
                <div className="mt-2 text-sm text-yellow-400">Waiting for review</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-purple-500/20 rounded-full">
                    <FaUsers className="text-purple-400 text-xl" />
                  </div>
                  <h3 className="text-gray-400 font-medium">Total Users</h3>
                </div>
                <p className="text-3xl font-bold text-white">{users.length}</p>
                <div className="mt-2 text-sm text-purple-400">Registered users</div>
              </div>
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-green-500/20 rounded-full">
                    <FaMoneyBillWave className="text-green-400 text-xl" />
                  </div>
                  <h3 className="text-gray-400 font-medium">Revenue</h3>
                </div>
                <p className="text-3xl font-bold text-white">₹{stats.revenue.toLocaleString()}</p>
                <div className="mt-2 text-sm text-green-400">Total earnings</div>
              </div>
            </div>

            {/* Recent Activities and Top Destinations */}
            <div className="grid grid-cols-1 lg:grid-cols-7 gap-8 mt-8">
              {/* Recent Activities */}
              <div className="lg:col-span-4 bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <FaBell className="text-pink-500 mr-2" />
                  Recent Activities
                </h3>
                <div className="space-y-4">
                  {recentActivities.length > 0 ? (
                    recentActivities.map((activity, index) => (
                      <div
                        key={index}
                        className="bg-gray-700/50 rounded-lg p-3 border border-gray-700 hover:shadow-md transition-shadow duration-300"
                      >
                        <div className="flex items-start">
                          <div className="p-2 rounded-lg bg-gray-900 mr-3">
                            {activity.type === "booking" && <FaCalendarAlt className="text-blue-400" />}
                            {activity.type === "query" && <FaClipboardList className="text-purple-400" />}
                            {activity.type === "admin" && <FaUserEdit className="text-orange-400" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <span className="font-medium text-white">
                                {activity.type === "query" || activity.type === "admin" ? activity.email : activity.user}
                              </span>
                              <span className="text-gray-400 text-xs">{new Date(activity.time).toLocaleString()}</span>
                            </div>
                            <p className="text-gray-300 text-sm">
                              {activity.type === "booking" && `made a booking for ${activity.detail}`}
                              {activity.type === "query" && `submitted a query: ${activity.detail}`}
                              {activity.type === "admin" && `You answered ${activity.email}'s query: ${activity.detail}`}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">No recent activities found.</p>
                  )}
                </div>
              </div>

              {/* Top Traveling Destinations */}
              <div className="lg:col-span-3 bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-xl p-6">
                <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                  <FaPlaneDeparture className="text-blue-500 mr-2" />
                  Top Traveling Destinations
                </h3>
                <div className="space-y-4">
                  {topDestinations.length > 0 ? (
                    topDestinations.map((destination, index) => (
                      <div
                        key={index}
                        className="bg-gray-700/50 rounded-lg p-3 border border-gray-700 hover:shadow-md transition-shadow duration-300"
                      >
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-white">{destination.name}</span>
                          <span className="text-gray-300 text-sm">{destination.bookings} bookings</span>
                        </div>
                        <div className="mt-2 w-full bg-gray-600 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                            style={{ width: `${(destination.bookings / 30) * 100}%` }}
                          ></div>
                        </div>
                        <div className="mt-1 text-right text-sm text-green-400">
                          ₹{destination.revenue.toLocaleString()} revenue
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-400">No top destinations found.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === "users" && (
          <div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6">
              Users Management
            </h2>
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-900">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Registration Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Bookings
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-white/10">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-gray-300">
                              {user.name.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">{user.name}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-300">{user.email}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                          {user.registration_date}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-900 text-blue-300">
                            {user.bookings_count}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              className="text-yellow-400 hover:text-yellow-300"
                              onClick={() => {
                                const updatedName = prompt("Enter new name for the user:", user.name);
                                if (updatedName) {
                                  editUser(user.id, { name: updatedName });
                                }
                              }}
                            >
                              <FaUserEdit />
                            </button>
                            <button
                              className="text-red-400 hover:text-red-300"
                              onClick={() => deleteUser(user.id)}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeSection === "bookings" && (
          <div>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-6">
              Bookings Management
            </h2>
            <div className="flex justify-between items-center mb-6">
              <div className="flex gap-4">
                <div className="flex bg-gray-800 rounded-lg">
                  <button
                    onClick={() => setActiveTab("all")}
                    className={`px-4 py-2 rounded-lg ${
                      activeTab === "all" ? "bg-blue-600 text-white" : "text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setActiveTab("pending")}
                    className={`px-4 py-2 rounded-lg ${
                      activeTab === "pending" ? "bg-yellow-600 text-white" : "text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    Pending
                  </button>
                  <button
                    onClick={() => setActiveTab("approved")}
                    className={`px-4 py-2 rounded-lg ${
                      activeTab === "approved" ? "bg-green-600 text-white" : "text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    Approved
                  </button>
                  <button
                    onClick={() => setActiveTab("rejected")}
                    className={`px-4 py-2 rounded-lg ${
                      activeTab === "rejected" ? "bg-red-600 text-white" : "text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    Rejected
                  </button>
                </div>
                
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search bookings..."
                    className="px-4 py-2 bg-gray-800 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white pr-10 w-64"
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <FaSearch className="text-gray-400" />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 shadow-xl rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead className="bg-gray-900">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Booking ID
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Customer
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Destination
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Amount
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-gray-800 divide-y divide-gray-700">
                    {filteredBookings.length > 0 ? (
                      filteredBookings.map((booking, index) => (
                        <tr key={booking.booking_id || index} className="hover:bg-white/10">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-400 font-medium">
                            {booking.booking_id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-white">{booking.booked_by}</div>
                            <div className="text-xs text-gray-400">{booking.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {booking.destination}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {booking.booking_date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-400 font-medium">
                            ₹{parseFloat(booking.total_cost).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={booking.admin_status || "pending"} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              {(booking.admin_status === "pending" || !booking.admin_status) && (
                                <>
                                  <button 
                                    onClick={() => updateBookingStatus(booking.booking_id, "approved")}
                                    className="text-green-400 hover:text-green-300"
                                  >
                                    <FaCheckCircle className="w-5 h-5" />
                                  </button>
                                  <button 
                                    onClick={() => updateBookingStatus(booking.booking_id, "rejected")}
                                    className="text-red-400 hover:text-red-300"
                                  >
                                    <FaTimesCircle className="w-5 h-5" />
                                  </button>
                                </>
                              )}
                              <button className="text-blue-400 hover:text-blue-300">
                                <FaEye className="w-5 h-5" />
                              </button>
                              <button 
                                onClick={() => deleteBooking(booking.booking_id)}
                                className="text-red-400 hover:text-red-300"
                              >
                                <FaTrash className="w-5 h-5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="7" className="px-6 py-8 text-center text-gray-400">
                          {isLoading ? (
                            <div className="flex justify-center items-center">
                              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mr-3"></div>
                              Loading bookings...
                            </div>
                          ) : (
                            "No bookings found matching your criteria"
                          )}
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
