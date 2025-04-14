import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";

const Profile = () => {
  const { isLoggedIn } = useContext(UserContext);
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    location: "",
    bio: "",
    gender: "",
    dob: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isPageLoaded, setIsPageLoaded] = useState(false);
  const locationRef = useRef(null);
  
  const cities = [
    "Delhi", "Mumbai", "Kolkata", "Chennai", "Bengaluru", "Hyderabad", "Ahmedabad", "Pune", "Jaipur",
    "Lucknow", "Kanpur", "Nagpur", "Indore", "Bhopal", "Surat", "Vadodara", "Ludhiana", "Agra",
    "Varanasi", "Prayagraj", "Meerut", "Patna", "Ranchi", "Bhubaneswar", "Guwahati", "Dehradun",
    "Chandigarh", "Amritsar", "Jalandhar", "Faridabad", "Gurgaon", "Noida", "Ghaziabad",
    "Coimbatore", "Madurai", "Visakhapatnam", "Vijayawada", "Thiruvananthapuram", "Kochi",
    "Kozhikode", "Mangaluru", "Mysuru", "Hubballi", "Belagavi", "Nashik", "Aurangabad",
    "Kolhapur", "Solapur", "Udaipur", "Jodhpur", "Kota", "Ajmer", "Bikaner", "Gwalior",
    "Jabalpur", "Raipur", "Bilaspur", "Siliguri", "Durgapur", "Asansol", "Cuttack",
    "Jamshedpur", "Srinagar", "Jammu", "Shimla", "Manali", "Leh", "Panaji", "Margao",
    "Vasco da Gama"
  ];

  // Set page as loaded for animations
  useEffect(() => {
    setIsPageLoaded(true);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost/projectX/backend/get_user_data.php");
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }
        const data = await response.json();
        if (!data.name || !data.email) {
          throw new Error("Invalid user data received");
        }
        setUserData(data);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError(error.message || "Unable to fetch user data.");
      }
    };

    fetchUserData();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (locationRef.current && !locationRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [locationRef]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));

    if (name === "location") {
      if (value) {
        const filteredSuggestions = cities.filter((city) =>
          city.toLowerCase().startsWith(value.toLowerCase())
        );
        setSuggestions(filteredSuggestions);
      } else {
        setSuggestions([]);
      }
    }
  };

  const handleSuggestionClick = (city) => {
    setUserData((prev) => ({ ...prev, location: city }));
    setSuggestions([]);
  };

  const saveDetails = async () => {
    try {
      const response = await fetch("http://localhost/Travel-Planner/backend/update_user.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (!response.ok || data.error) {
        throw new Error(data.error || "Update failed");
      }

      setMessage(data.message || "Details saved successfully");
      setError("");
    } catch (err) {
      setError(err.message);
      setMessage("");
    }
  };

  // Form section styling from SignUp page
  const sectionStyle = "bg-white/10 backdrop-blur-md rounded-xl p-5 border border-white/20 shadow-lg hover:shadow-xl transition-all duration-500 hover:bg-white/15";
  const headerStyle = "text-xl font-semibold text-purple-300 mb-3 flex items-center gap-2";
  const inputStyle = "bg-white/20 rounded-xl p-3 w-full text-sm text-gray-200 placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-400 focus:bg-white/30 transition duration-300";

  return (
    <div className="relative w-full min-h-screen overflow-y-auto overflow-x-hidden bg-gradient-to-br from-richblack-900 via-purple-900/20 to-richblack-800">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1935&auto=format&fit=crop')] bg-cover bg-center opacity-10"></div>
        <div className="absolute w-96 h-96 rounded-full bg-purple-600/20 blur-3xl -top-10 -left-10 animate-pulse"></div>
        <div className="absolute w-96 h-96 rounded-full bg-pink-600/20 blur-3xl -bottom-10 -right-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute w-72 h-72 rounded-full bg-blue-600/20 blur-3xl bottom-20 left-1/4 animate-pulse" style={{ animationDelay: '3s' }}></div>
      </div>

      <div className={`w-full min-h-screen flex items-center justify-center p-6 transition-opacity duration-1000 ${isPageLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="w-full max-w-6xl">
          {/* Header */}
          <div className="text-center mb-8 transform transition-all duration-700">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-purple-400 bg-clip-text text-transparent mb-4">
              Your Profile
            </h1>
            <p className="text-gray-300 text-lg max-w-2xl mx-auto">
              Manage your details and preferences to personalize your travel experience with us.
            </p>
            <div className="w-40 h-1.5 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto mt-5"></div>
          </div>

          {/* Alert messages */}
          {error && (
            <div className="w-full max-w-3xl mx-auto mb-6 bg-red-500/20 backdrop-blur-md border border-red-500/30 rounded-xl p-4 text-white text-center">
              {error}
            </div>
          )}
          {message && (
            <div className="w-full max-w-3xl mx-auto mb-6 bg-green-500/20 backdrop-blur-md border border-green-500/30 rounded-xl p-4 text-white text-center">
              {message}
            </div>
          )}

          {/* Form sections with staggered entrance */}
          <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Personal Information */}
            <div className={`${sectionStyle} transform transition-all duration-700 delay-100 ${isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <h3 className={headerStyle}>
                <span className="text-pink-400 text-2xl">👤</span> Personal Information
              </h3>
              <div className="space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={userData.name}
                  onChange={handleInputChange}
                  className={inputStyle}
                />
                <div className="grid grid-cols-2 gap-4">
                  <select
                    name="gender"
                    value={userData.gender}
                    onChange={handleInputChange}
                    className={`${inputStyle} cursor-pointer appearance-none`}
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Non-binary">Non-binary</option>
                    <option value="Other">Other</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                  <input
                    type="date"
                    name="dob"
                    placeholder="Date of Birth"
                    value={userData.dob}
                    onChange={handleInputChange}
                    className={inputStyle}
                  />
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className={`${sectionStyle} transform transition-all duration-700 delay-200 ${isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
              <h3 className={headerStyle}>
                <span className="text-pink-400 text-2xl">📱</span> Contact Details
              </h3>
              <div className="space-y-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={userData.email}
                  onChange={handleInputChange}
                  className={inputStyle}
                  disabled
                />
                <input
                  type="text"
                  name="phone"
                  placeholder="Phone Number"
                  value={userData.phone}
                  onChange={handleInputChange}
                  className={inputStyle}
                />
                <div className="relative" ref={locationRef}>
                  <input
                    type="text"
                    name="location"
                    placeholder="Enter Location"
                    value={userData.location}
                    onChange={handleInputChange}
                    className={inputStyle}
                  />
                  {suggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 max-h-60 overflow-auto bg-black/50 backdrop-blur-xl rounded-xl border border-white/20 shadow-lg">
                      {suggestions.map((city, index) => (
                        <div
                          key={index}
                          className="p-3 cursor-pointer hover:bg-white/20 text-gray-200 text-sm transition-colors duration-200"
                          onClick={() => handleSuggestionClick(city)}
                        >
                          {city}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className={`${sectionStyle} transform transition-all duration-700 delay-300 ${isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'} col-span-1 lg:col-span-2`}>
              <h3 className={headerStyle}>
                <span className="text-pink-400 text-2xl">✨</span> About You
              </h3>
              <div className="space-y-4">
                <textarea
                  name="bio"
                  placeholder="Tell us about yourself and your travel preferences..."
                  value={userData.bio}
                  onChange={handleInputChange}
                  rows="4"
                  className={`${inputStyle} resize-none`}
                ></textarea>
              </div>
            </div>
          </div>

          {/* Submit button */}
          <div className="flex flex-col items-center space-y-6 mt-8">
            <button
              className={`w-full max-w-md h-14 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 text-white font-bold rounded-xl text-lg hover:scale-105 transition-all duration-500 shadow-lg hover:shadow-purple-500/30 flex items-center justify-center gap-2 bg-size-200 animate-gradient ${isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              onClick={saveDetails}
              style={{ transitionDelay: '500ms' }}
            >
              <span className="text-xl">💾</span>
              Save Changes
            </button>

            <button
              className={`text-purple-400 hover:text-purple-300 transition-all duration-300 ${isPageLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
              onClick={() => navigate('/')}
              style={{ transitionDelay: '600ms' }}
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;