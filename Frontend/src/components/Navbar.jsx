import { VscChromeClose } from "react-icons/vsc";
import { GiHamburgerMenu } from "react-icons/gi";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "/Applications/XAMPP/xamppfiles/htdocs/projectX/Frontend/src/assets/Logo.png";

export default function Navbar() {
  const [navbarState, setNavbarState] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profileImage, setProfileImage] = useState("");
  const [userInitials, setUserInitials] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedImage = localStorage.getItem("profileImage");
    const storedName = localStorage.getItem("userName");

    setIsLoggedIn(!!token);
    setProfileImage(storedImage || "");

    if (storedName) {
      const nameParts = storedName.split(" ");
      const initials =
        nameParts.length > 1
          ? nameParts[0][0] + nameParts[1][0]
          : nameParts[0][0];
      setUserInitials(initials.toUpperCase());
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    setProfileDropdownOpen(false);
    navigate("/login");
  };

  const exploreRoutes = {
    Destinations: "/recommend",
    Activities: "/activities",
    Accommodation: "/accommodation",
    TravelTips: "/travel-tips",
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Accommodation", path: "/accommodation" },
    { name: "My Bookings", path: "/my-bookings" },
  ];

  return (
    <nav className="w-full px-6 py-4 text-white bg-opacity-30 backdrop-blur-md border-b border-gray-500 shadow-lg relative z-50 ">
      <div className="flex justify-between items-center">
        <Link
          to="/"
          className="text-2xl font-bold uppercase tracking-wide hover:text-teal-400 transition duration-300"
        >
          <img src={Logo} alt="Logo" className="w-35 h-15 rounded-lg " />
        </Link>

        {/* Mobile Menu Icon */}
        <div className="md:hidden" onClick={() => setNavbarState(!navbarState)}>
          {navbarState ? (
            <VscChromeClose className="text-3xl cursor-pointer hover:text-teal-400 transition duration-300" />
          ) : (
            <GiHamburgerMenu className="text-3xl cursor-pointer hover:text-teal-400 transition duration-300" />
          )}
        </div>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-8 items-center z-50">
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                className="text-lg hover:text-teal-400 transition duration-300"
              >
                {link.name}
              </Link>
            </li>
          ))}
          <li className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="text-lg flex items-center hover:text-teal-400 transition duration-300"
            >
              Explore
              <svg
                className={`ml-1 w-4 h-4 transition-transform duration-300 ${
                  dropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
            {dropdownOpen && (
              <ul className="absolute left-0 top-full mt-2 w-48 bg-white text-black rounded-md shadow-lg overflow-hidden animate-fadeIn z-100">
                {Object.keys(exploreRoutes).map((item) => (
                  <li key={item}>
                    <Link
                      to={exploreRoutes[item]}
                      className="block px-4 py-2 hover:bg-teal-400 hover:text-white transition duration-300"
                      onClick={() => setDropdownOpen(false)}
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </li>
        </ul>

        {/* Profile / Login */}
        <div className="hidden md:flex items-center gap-4">
          <Link to="/booking">
            <button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-pink-500 hover:to-purple-500 text-white px-4 py-2 rounded-lg transition duration-300 shadow-md">
              Book Now
            </button>
          </Link>

          {isLoggedIn ? (
            <div className="relative">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="w-10 h-10 rounded-full cursor-pointer border-2 border-white hover:shadow-md transition duration-300"
                  onClick={() =>
                    setProfileDropdownOpen(!profileDropdownOpen)
                  }
                />
              ) : (
                <div
                  className="w-10 h-10 flex items-center justify-center rounded-full cursor-pointer border-2 border-white bg-gray-500 text-white font-bold text-lg"
                  onClick={() =>
                    setProfileDropdownOpen(!profileDropdownOpen)
                  }
                >
                  {userInitials}
                </div>
              )}

              {/* Profile Dropdown */}
              {profileDropdownOpen && (
                <ul className="absolute right-0 top-full mt-2 w-48 bg-white bg-opacity-80 backdrop-blur-md text-black rounded-md shadow-lg">
                  <li>
                    <Link
                      to="/profile"
                      className="block px-4 py-2 hover:bg-purple-400 hover:text-white transition duration-300"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      My Profile
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/my-bookings"
                      className="block px-4 py-2 hover:bg-purple-400 hover:text-white transition duration-300"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      My Bookings
                    </Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 bg-red-500 text-white hover:bg-red-600 transition duration-300"
                    >
                      Logout
                    </button>
                  </li>
                </ul>
              )}
            </div>
          ) : (
            <Link to="/login">
              <button className="bg-gradient-to-r from-teal-500 to-blue-500 hover:from-blue-500 hover:to-teal-500 text-white px-4 py-2 rounded-lg transition duration-300 shadow-md">
                Login
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {navbarState && (
        <div className="md:hidden absolute top-full left-0 w-full bg-gray-900 bg-opacity-70 backdrop-blur-md shadow-lg border-t border-gray-700">
          <ul className="flex flex-col items-center gap-4 py-4">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className="text-lg hover:text-teal-400 transition duration-300"
                  onClick={() => setNavbarState(false)}
                >
                  {link.name}
                </Link>
              </li>
            ))}
            {isLoggedIn ? (
              <li>
                <button
                  onClick={handleLogout}
                  className="px-6 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition duration-300"
                >
                  Logout
                </button>
              </li>
            ) : (
              <li>
                <Link to="/login">
                  <button className="px-6 py-2 text-white bg-gradient-to-r from-teal-500 to-blue-500 hover:from-blue-500 hover:to-teal-500 rounded-lg text-lg uppercase hover:shadow-md transition duration-300">
                    Login
                  </button>
                </Link>
              </li>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
}
