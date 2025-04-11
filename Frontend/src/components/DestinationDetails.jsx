import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Testimonials from "./Testimonials";
import { FaArrowLeft, FaStar, FaMapMarkerAlt, FaClock, FaMoneyBillWave, FaHeart } from "react-icons/fa";
import { IoIosPeople } from "react-icons/io";
import { destinations } from "../data/Recommend";

export default function DestinationDetails() {
  const [destination, setDestination] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
    const data = sessionStorage.getItem("selectedDestination");
    if (data) {
      setDestination(JSON.parse(data));
      // Check if this destination is in favorites (mock implementation)
      setIsFavorite(Math.random() > 0.5); // Random for demo
    } else {
      navigate("/"); // Redirect if no data is found
    }
  }, [navigate]);

  if (!destination) return null;

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // Here you would typically update your state/API
  };

  return (
    <section className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 text-white py-12 px-4 sm:px-8 md:px-12 lg:px-20">
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          {/* Back Button */}
          <motion.button
            whileHover={{ x: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate(-1)}
            className="flex items-center mb-8 text-sm px-5 py-2.5 bg-gradient-to-r from-purple-600/30 to-pink-600/30 hover:from-purple-700/40 hover:to-pink-700/40 rounded-full shadow-lg backdrop-blur-sm border border-purple-500/20 transition-all duration-300 group"
          >
            <FaArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Destinations
          </motion.button>

          {/* Main Content */}
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Image Gallery */}
            <div className="relative w-full h-[400px] sm:h-[500px] overflow-hidden rounded-2xl shadow-2xl">
              <motion.img
                src={destination.image}
                alt={destination.title}
                className={`w-full h-full object-cover ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: imageLoaded ? 1 : 0, scale: 1 }}
                transition={{ duration: 0.8 }}
                onLoad={() => setImageLoaded(true)}
              />
              
              {/* Loading Skeleton */}
              {!imageLoaded && (
                <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-pink-900/20 animate-pulse"></div>
              )}
              
              {/* Favorite Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={toggleFavorite}
                className="absolute top-4 right-4 p-3 bg-black/50 backdrop-blur-sm rounded-full shadow-lg"
                aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
              >
                <FaHeart 
                  className={`text-xl ${isFavorite ? 'text-pink-500 fill-current' : 'text-white/70'}`}
                />
              </motion.button>
            </div>

            {/* Destination Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="space-y-6"
            >
              <div>
                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                  {destination.title}
                </h1>
                <p className="mt-3 text-lg text-gray-300 leading-relaxed">
                  {destination.subTitle}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <motion.div 
                  whileHover={{ y: -5 }}
                  className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 backdrop-blur-sm"
                >
                  <div className="flex items-center">
                    <FaMoneyBillWave className="text-pink-500 mr-2" />
                    <span className="font-semibold">Cost</span>
                  </div>
                  <p className="mt-1 text-xl font-bold">Rs. {destination.cost}</p>
                  <p className="text-xs text-gray-400">per person</p>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -5 }}
                  className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 backdrop-blur-sm"
                >
                  <div className="flex items-center">
                    <FaClock className="text-purple-500 mr-2" />
                    <span className="font-semibold">Duration</span>
                  </div>
                  <p className="mt-1 text-xl font-bold">{destination.duration}</p>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -5 }}
                  className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 backdrop-blur-sm"
                >
                  <div className="flex items-center">
                    <FaMapMarkerAlt className="text-blue-400 mr-2" />
                    <span className="font-semibold">Distance</span>
                  </div>
                  <p className="mt-1 text-xl font-bold">{destination.distance}</p>
                </motion.div>

                <motion.div 
                  whileHover={{ y: -5 }}
                  className="p-4 bg-gray-800/50 rounded-xl border border-gray-700/50 backdrop-blur-sm"
                >
                  <div className="flex items-center">
                    <FaStar className="text-yellow-400 mr-2" />
                    <span className="font-semibold">Rating</span>
                  </div>
                  <div className="flex items-center mt-1">
                    <span className="text-xl font-bold mr-2">{destination.rating}</span>
                    <span className="text-sm text-gray-400">({destination.reviews} reviews)</span>
                  </div>
                </motion.div>
              </div>

              {/* Highlights */}
              <div className="pt-4">
                <h3 className="text-xl font-semibold mb-3 text-pink-400">Trip Highlights</h3>
                <ul className="space-y-2">
                  {destination.tripHighlights && destination.tripHighlights.map((highlight, index) => (
                    <motion.li 
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      className="flex items-start"
                    >
                      <span className="inline-block w-1.5 h-1.5 mt-2.5 mr-2 bg-pink-500 rounded-full"></span>
                      <span>{highlight}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <motion.button
                  whileHover={{ scale: 1.03, boxShadow: "0 0 20px rgba(219, 39, 119, 0.5)" }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white px-8 py-4 rounded-xl shadow-lg font-semibold hover:from-pink-700 hover:to-purple-700 transition-all duration-300 flex items-center justify-center"
                  onClick={() => navigate("/booking")}
                >
                  <span>Book Now</span>
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                  </svg>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 px-8 py-4 rounded-xl font-semibold bg-gray-800/50 border border-gray-700 hover:bg-gray-700/50 transition-all duration-300 flex items-center justify-center"
                >
                  <IoIosPeople className="mr-2 text-lg" />
                  <span>Group Discount</span>
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* Additional Sections */}
          <div className="mt-24">
            <Testimonials />
          </div>
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
