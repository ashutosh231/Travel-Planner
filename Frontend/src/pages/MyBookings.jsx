import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaTicketAlt,
  FaMapMarkerAlt, 
  FaHotel, 
  FaUserFriends,
  FaStar,
  FaCalendarAlt,
  FaCreditCard,
  FaDownload,
  FaShareAlt,
  FaCheckCircle
} from 'react-icons/fa';
import { motion } from "framer-motion";

export default function MyBookingsPage() {
  const navigate = useNavigate();
  const [booking, setBooking] = useState({
    destination: null,
    accommodation: null,
    numNights: 0,
    totalCost: 0,
    members: [],
    bookingId: "",
    bookingDate: "",
    paymentMethod: "",
    checkInDate: null,
    checkOutDate: null
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Simulate loading data from storage or API
    setTimeout(() => {
      // Get all booking data from sessionStorage
      const storedDestination = sessionStorage.getItem("selectedDestination");
      const storedAccommodation = sessionStorage.getItem("selectedAccommodation");
      const storedNights = sessionStorage.getItem("numNights");
      const storedMembers = sessionStorage.getItem("members");
      const storedTotalCost = sessionStorage.getItem("totalCost");
      const storedCheckInDate = sessionStorage.getItem("checkInDate");
      const storedCheckOutDate = sessionStorage.getItem("checkOutDate");
      const paymentMethod = sessionStorage.getItem("paymentMethod") || "Credit Card";
      
      // Generate a random booking ID
      const generateBookingId = () => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let id = "BK";
        for (let i = 0; i < 8; i++) {
          id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
      };
      
      // Format current date as booking date
      const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      };

      // Set booking data
      setBooking({
        destination: storedDestination ? JSON.parse(storedDestination) : null,
        accommodation: storedAccommodation ? JSON.parse(storedAccommodation) : null,
        numNights: storedNights ? parseInt(storedNights, 10) : 3,
        totalCost: storedTotalCost ? parseFloat(storedTotalCost) : 0,
        members: storedMembers ? JSON.parse(storedMembers) : [],
        bookingId: generateBookingId(),
        bookingDate: formatDate(new Date()),
        paymentMethod,
        checkInDate: storedCheckInDate ? formatDate(JSON.parse(storedCheckInDate)) : formatDate(new Date()),
        checkOutDate: storedCheckOutDate ? formatDate(JSON.parse(storedCheckOutDate)) : formatDate(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000))
      });
      
      setIsLoading(false);
    }, 1000);
  }, []);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut"
      }
    }
  };

  const handleNewBooking = () => {
    // Clear existing booking data
    sessionStorage.removeItem("selectedDestination");
    sessionStorage.removeItem("selectedAccommodation");
    sessionStorage.removeItem("numNights");
    sessionStorage.removeItem("members");
    sessionStorage.removeItem("totalCost");
    sessionStorage.removeItem("checkInDate");
    sessionStorage.removeItem("checkOutDate");
    sessionStorage.removeItem("paymentMethod");
    
    // Navigate to home or recommendation page
    navigate("/recommend");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex justify-center items-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-purple-200 text-lg font-medium">Loading your booking...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 relative overflow-hidden p-4 md:p-8">
      {/* Floating particles background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-white/5"
            style={{
              width: Math.random() * 10 + 5 + 'px',
              height: Math.random() * 10 + 5 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%'
            }}
            animate={{
              y: [0, (Math.random() - 0.5) * 100],
              x: [0, (Math.random() - 0.5) * 50],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        ))}
      </div>

      {/* Glowing blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-20 -left-20 w-80 h-80 bg-purple-600 rounded-full filter blur-[100px] opacity-20"></div>
        <div className="absolute -bottom-20 -right-20 w-80 h-80 bg-indigo-600 rounded-full filter blur-[100px] opacity-20"></div>
      </div>

      <div className="relative z-10 flex justify-center items-center min-h-screen py-12">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl"
        >
          {/* Success message */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 text-center"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
              <FaCheckCircle className="text-green-400 text-3xl" />
            </div>
            <h1 className="text-3xl md:text-4xl font-extrabold mb-2 text-white">Booking Confirmed!</h1>
            <p className="text-purple-200">Your vacation is booked and ready to enjoy.</p>
          </motion.div>

          {/* Booking Ticket */}
          <motion.div 
            className="bg-gray-900/70 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/10 mb-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Ticket Header with decorative elements */}
            <div className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10"></div>
              <motion.div
                variants={itemVariants}
                className="text-center py-6 px-6 relative"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30"></div>
                <div className="flex items-center justify-center gap-3 mb-2">
                  <FaTicketAlt className="text-purple-300 text-xl" />
                  <h2 className="text-2xl font-bold text-purple-200">Booking Confirmation</h2>
                </div>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="text-sm font-medium text-purple-300">Reference:</span>
                  <span className="text-lg font-bold text-white">{booking.bookingId}</span>
                </div>
              </motion.div>
              
              {/* Ticket divider with dotted line and circles */}
              <div className="relative h-8 flex items-center">
                <div className="absolute left-0 w-4 h-8 bg-gray-900 rounded-r-full"></div>
                <div className="absolute right-0 w-4 h-8 bg-gray-900 rounded-l-full"></div>
                <div className="border-t-2 border-dashed border-white/20 w-full"></div>
              </div>
            </div>

            <div className="p-6 md:p-8">
              {/* Main Booking Details */}
              <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-900/50 rounded-lg border border-purple-500/30">
                      <FaCalendarAlt className="text-purple-300" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Booking Date</p>
                      <p className="text-white font-medium">{booking.bookingDate}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-900/50 rounded-lg border border-purple-500/30">
                      <FaCreditCard className="text-purple-300" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Payment Method</p>
                      <p className="text-white font-medium">{booking.paymentMethod}</p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-green-900/50 rounded-lg border border-green-500/30">
                      <FaCalendarAlt className="text-green-300" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Check-in</p>
                      <p className="text-white font-medium">{booking.checkInDate}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="p-2 bg-red-900/50 rounded-lg border border-red-500/30">
                      <FaCalendarAlt className="text-red-300" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Check-out</p>
                      <p className="text-white font-medium">{booking.checkOutDate}</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Destination Section */}
              {booking.destination && (
                <motion.div
                  variants={itemVariants}
                  className="p-6 bg-gray-800/40 rounded-xl border border-white/10 relative overflow-hidden mb-6"
                >
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-purple-500/10 rounded-full filter blur-2xl"></div>
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold flex items-center gap-3 text-purple-200">
                        <div className="p-2 bg-purple-900/50 rounded-lg border border-purple-500/30">
                          <FaMapMarkerAlt className="text-purple-300" />
                        </div>
                        <span>Destination</span>
                      </h3>
                      <div className="flex items-center gap-1 text-amber-400">
                        <FaStar className="text-sm" />
                        <span className="text-sm font-medium">4.8</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        <p className="text-2xl font-bold text-white mb-1">{booking.destination.title}</p>
                        <p className="text-sm text-purple-300 font-medium mb-4">{booking.destination.location}</p>
                        <p className="text-gray-300 text-sm leading-relaxed">{booking.destination.description}</p>
                      </div>
                      <div className="relative h-40 rounded-xl overflow-hidden border-2 border-white/10 shadow-lg">
                        <img 
                          src={booking.destination.image} 
                          alt={booking.destination.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Accommodation Section */}
              {booking.accommodation && (
                <motion.div
                  variants={itemVariants}
                  className="p-6 bg-gray-800/40 rounded-xl border border-white/10 relative overflow-hidden mb-6"
                >
                  <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-pink-500/10 rounded-full filter blur-2xl"></div>
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-xl font-bold flex items-center gap-3 text-pink-200">
                        <div className="p-2 bg-pink-900/50 rounded-lg border border-pink-500/30">
                          <FaHotel className="text-pink-300" />
                        </div>
                        <span>Accommodation</span>
                      </h3>
                      <div className="flex items-center gap-1 text-amber-400">
                        <FaStar className="text-sm" />
                        <span className="text-sm font-medium">{booking.accommodation.rating || '4.5'}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        <p className="text-2xl font-bold text-white mb-1">{booking.accommodation.title}</p>
                        <p className="text-sm text-pink-300 font-medium mb-2">{booking.accommodation.location}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-gray-900/50 p-3 rounded-lg border border-white/5">
                            <p className="text-xs text-gray-400 mb-1">Per Night</p>
                            <p className="text-lg font-bold text-purple-300">Rs. {booking.accommodation.cost.toLocaleString()}</p>
                          </div>
                          <div className="bg-gray-900/50 p-3 rounded-lg border border-white/5">
                            <p className="text-xs text-gray-400 mb-1">Total Nights</p>
                            <p className="text-lg font-bold text-pink-300">{booking.numNights}</p>
                          </div>
                        </div>
                      </div>
                      <div className="relative h-40 rounded-xl overflow-hidden border-2 border-white/10 shadow-lg">
                        <img 
                          src={booking.accommodation.image} 
                          alt={booking.accommodation.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Group Members Section */}
              {booking.members.length > 0 && (
                <motion.div
                  variants={itemVariants}
                  className="p-6 bg-gray-800/40 rounded-xl border border-white/10 relative overflow-hidden mb-6"
                >
                  <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-blue-500/10 rounded-full filter blur-2xl"></div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold flex items-center gap-3 text-blue-200 mb-5">
                      <div className="p-2 bg-blue-900/50 rounded-lg border border-blue-500/30">
                        <FaUserFriends className="text-blue-300" />
                      </div>
                      <span>Group Members ({booking.members.length})</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {booking.members.map((member, index) => (
                        <div key={index} className="bg-gray-900/50 p-4 rounded-lg border border-white/10">
                          <div className="flex justify-between items-start">
                            <div>
                              <p className="font-medium text-white">Member {index + 1}</p>
                              <p className="text-sm text-blue-300 mt-1">{member.name || 'Not specified'}</p>
                            </div>
                            <span className="text-xs bg-blue-900/30 px-2 py-1 rounded-full text-blue-200">
                              {member.age ? `${member.age} yrs` : 'Age not specified'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Total Cost Section */}
              <motion.div
                variants={itemVariants}
                className="p-6 bg-gradient-to-r from-purple-900/50 to-pink-900/50 rounded-xl border border-white/10 relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5"></div>
                <div className="relative z-10">
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-bold text-white">Total Payment</h3>
                    <p className="text-2xl font-bold text-green-400">Rs. {booking.totalCost.toLocaleString()}</p>
                  </div>
                  <p className="text-sm text-gray-400 mt-2">Payment completed successfully</p>
                </div>
              </motion.div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              className="flex-1 py-3 px-6 bg-gray-800/50 hover:bg-gray-800/70 border border-white/10 rounded-xl transition duration-300 flex items-center justify-center gap-2"
              onClick={() => window.print()}
            >
              <FaDownload className="text-purple-300" />
              <span>Download Ticket</span>
            </button>
            
            <button
              className="flex-1 py-3 px-6 bg-gray-800/50 hover:bg-gray-800/70 border border-white/10 rounded-xl transition duration-300 flex items-center justify-center gap-2"
              onClick={() => {
                // Share functionality would go here
                alert("Sharing functionality would be implemented here");
              }}
            >
              <FaShareAlt className="text-blue-300" />
              <span>Share Itinerary</span>
            </button>
            
            <button
              className="flex-1 py-3 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl font-medium transition-all shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 flex items-center justify-center gap-2"
              onClick={handleNewBooking}
            >
              <FaTicketAlt className="text-white" />
              <span className="font-medium">New Booking</span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}