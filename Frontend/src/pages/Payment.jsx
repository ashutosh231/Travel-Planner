import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaCreditCard, 
  FaCheckCircle, 
  FaMapMarkerAlt, 
  FaHotel, 
  FaMoneyBillWave,
  FaUserFriends,
  FaStar,
  FaCalendarAlt,
  FaUsers
} from 'react-icons/fa';
import { motion } from "framer-motion";

export default function PaymentPage() {
  const navigate = useNavigate();
  const [selectedDestination, setSelectedDestination] = useState(null);
  const [selectedAccommodation, setSelectedAccommodation] = useState(null);
  const [numNights, setNumNights] = useState(1);
  const [totalCost, setTotalCost] = useState(0);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    const storedDestination = sessionStorage.getItem("selectedDestination");
    const storedAccommodation = sessionStorage.getItem("selectedAccommodation");
    const storedNights = sessionStorage.getItem("numNights"); // Fetch the correct number of nights
    const storedMembers = sessionStorage.getItem("members");

    if (storedDestination) setSelectedDestination(JSON.parse(storedDestination));
    if (storedAccommodation) setSelectedAccommodation(JSON.parse(storedAccommodation));
    if (storedNights) setNumNights(parseInt(storedNights, 10)); // Set the correct number of nights
    if (storedMembers) setMembers(JSON.parse(storedMembers));

    if (storedDestination && storedAccommodation) {
      const destination = JSON.parse(storedDestination);
      const accommodation = JSON.parse(storedAccommodation);
      const accommodationCost = accommodation.cost * (storedNights ? parseInt(storedNights, 10) : 1);
      const destinationCost = destination.cost;
      const baseCost = accommodationCost + destinationCost;
      const serviceFee = 0; // Correct 10% service fee with rounding
      setTotalCost(baseCost + serviceFee); // Total cost includes service fee
    }
  }, []);

  const handlePayment = () => {
    sessionStorage.setItem("totalCost", totalCost);
    navigate("/paymentOption");
  };

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

  return (
    <div className="min-h-screen  bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white relative overflow-hidden p-4 md:p-8">
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

      <div className="relative z-10 flex justify-center items-center min-h-screen">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl bg-gray-900/70 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden border border-white/10"
        >
          {/* Header with decorative elements */}
          <div className="relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10"></div>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-8 px-6 relative"
            >
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent opacity-30"></div>
              <h2 className="text-4xl font-bold mb-3">
                <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-amber-300 bg-clip-text text-transparent">
                  Booking Summary
                </span>
              </h2>
              <p className="text-purple-200 max-w-md mx-auto">Review your trip details before proceeding to payment</p>
              <div className="flex justify-center mt-4">
                <div className="p-3 bg-purple-900/50 rounded-full border border-purple-500/30">
                  <FaCreditCard className="text-purple-300 text-3xl" />
                </div>
              </div>
            </motion.div>
          </div>

          <div className="p-6 md:p-8">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {/* Destination Section */}
              {selectedDestination && (
                <motion.div
                  variants={itemVariants}
                  className="p-6 bg-gray-800/40 rounded-xl border border-white/10 relative overflow-hidden"
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
                        <p className="text-2xl font-bold text-white mb-1">{selectedDestination.title}</p>
                        <p className="text-sm text-purple-300 font-medium mb-4">{selectedDestination.location}</p>
                        <p className="text-gray-300 text-sm leading-relaxed">{selectedDestination.description}</p>
                        <p className="text-pink-300 text-lg leading-relaxed">{selectedDestination.cost}</p>
                        
                        <div className="flex flex-wrap gap-3 mt-5">
                          <div className="flex items-center gap-2 text-sm bg-purple-900/30 px-3 py-1.5 rounded-lg border border-purple-500/20">
                            <FaCalendarAlt className="text-purple-300 text-xs" />
                            <span className="text-purple-100">Best season: {selectedDestination.bestSeason || "All year"}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm bg-purple-900/30 px-3 py-1.5 rounded-lg border border-purple-500/20">
                            <FaUsers className="text-purple-300 text-xs" />
                            <span className="text-purple-100">Popular with {selectedDestination.popularWith || "Everyone"}</span>
                          </div>
                        </div>
                      </div>
                      <div className="relative h-48 rounded-xl overflow-hidden border-2 border-white/10 shadow-lg">
                        <img 
                          src={selectedDestination.image} 
                          alt={selectedDestination.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Accommodation Section */}
              {selectedAccommodation && (
                <motion.div
                  variants={itemVariants}
                  className="p-6 bg-gray-800/40 rounded-xl border border-white/10 relative overflow-hidden"
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
                        <span className="text-sm font-medium">{selectedAccommodation.rating || '4.5'}</span>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="md:col-span-2">
                        <p className="text-2xl font-bold text-white mb-1">{selectedAccommodation.title}</p>
                        <p className="text-sm text-pink-300 font-medium mb-4">{selectedAccommodation.location}</p>
                        
                        <div className="grid grid-cols-2 gap-4 mb-5">
                          <div className="bg-gray-900/50 p-3 rounded-lg border border-white/5">
                            <p className="text-xs text-gray-400 mb-1">Per Night</p>
                            <p className="text-xl font-bold text-purple-300">Rs. {selectedAccommodation.cost.toLocaleString()}</p>
                          </div>
                          <div className="bg-gray-900/50 p-3 rounded-lg border border-white/5">
                            <p className="text-xs text-gray-400 mb-1">Nights</p>
                            <p className="text-xl font-bold text-pink-300">{numNights}</p>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2">
                          {selectedAccommodation.amenities?.slice(0, 4).map((amenity, i) => (
                            <span key={i} className="text-xs bg-gray-900/50 px-2.5 py-1 rounded-full border border-white/5">
                              {amenity}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="relative h-48 rounded-xl overflow-hidden border-2 border-white/10 shadow-lg">
                        <img 
                          src={selectedAccommodation.image} 
                          alt={selectedAccommodation.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Group Members Section */}
              {members.length > 0 && (
                <motion.div
                  variants={itemVariants}
                  className="p-6 bg-gray-800/40 rounded-xl border border-white/10 relative overflow-hidden"
                >
                  <div className="absolute -right-10 -bottom-10 w-32 h-32 bg-blue-500/10 rounded-full filter blur-2xl"></div>
                  <div className="relative z-10">
                    <h3 className="text-xl font-bold flex items-center gap-3 text-blue-200 mb-5">
                      <div className="p-2 bg-blue-900/50 rounded-lg border border-blue-500/30">
                        <FaUserFriends className="text-blue-300" />
                      </div>
                      <span>Group Members ({members.length})</span>
                    </h3>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {members.map((member, index) => (
                        <div key={index} className="bg-gray-900/50 p-4 rounded-lg border border-white/10 hover:border-blue-500/30 transition-colors">
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
                  <h3 className="text-xl font-bold flex items-center gap-3 text-white mb-4">
                    <div className="p-2 bg-green-900/50 rounded-lg border border-green-500/30">
                      <FaMoneyBillWave className="text-green-300" />
                    </div>
                    <span>Payment Summary</span>
                  </h3>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <p className="text-gray-300">Destination</p>
                      <p className="font-medium text-white">Rs. {selectedDestination?.cost}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-gray-300">Accommodation x {numNights} nights</p>
                      <p className="font-medium text-white">Rs. {(selectedAccommodation?.cost * numNights)}</p>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-gray-300">Service Fee (10%)</p>
                      <p className="font-medium text-white">Rs. {Math.round((Number(selectedDestination?.cost || 0) + Number(selectedAccommodation?.cost || 0) * numNights) * 0.1)}</p>
                    </div>
                    <div className="h-px bg-white/10 my-3"></div>
                    <div className="flex justify-between items-center">
                      <p className="text-gray-300 font-medium">Total</p>
                      <p className="text-2xl font-bold text-green-400">
                      Rs. {
                           Number(selectedDestination?.cost ?? 0) +
                           Number(selectedAccommodation?.cost ?? 0) * numNights +
                          Math.round(
                          (Number(selectedDestination?.cost ?? 0) + Number(selectedAccommodation?.cost ?? 0) * numNights) * 0.1
                          )
                         }
                        </p>           
                      {/* <p className="text-2xl font-bold text-green-400">Rs. {Number(selectedDestination?.cost ?? 0) + Number(selectedAccommodation?.cost * numNights)+{Math.round((Number(selectedDestination?.cost || 0) + Number(selectedAccommodation?.cost || 0) * numNights) * 0.1)}</p> */}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Payment Button */}
              <motion.div
                variants={itemVariants}
                className="pt-4"
              >
                <button
                  onClick={handlePayment}
                  className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-medium hover:scale-[1.02] transition-transform shadow-lg shadow-purple-500/20 hover:shadow-purple-500/40 flex items-center justify-center gap-3 relative overflow-hidden group"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600/30 to-pink-600/30 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                  <span className="relative z-10 flex items-center gap-3">
                    <FaCheckCircle className="text-white text-xl" />
                    <span className="text-lg font-semibold">Complete Booking</span>
                  </span>
                </button>
                
                <p className="text-center text-xs text-gray-400 mt-3">
                  By proceeding, you agree to our Terms of Service and Privacy Policy
                </p>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

