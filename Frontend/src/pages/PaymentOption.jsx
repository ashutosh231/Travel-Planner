import axios from "axios"; // Import axios for API calls
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaCreditCard, FaGooglePay, FaApplePay, FaQrcode, FaUniversity } from "react-icons/fa";

export default function FakePaymentPage() {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    // Get user email from localStorage when component mounts
    const email = localStorage.getItem("userEmail");
    if (email) {
      setUserEmail(email);
    } else {
      // If no email is found, redirect to login
      navigate("/login");
    }
  }, [navigate]);

  const handlePayment = async () => {
    // Generate a booking ID with the same format as in MyBookings.jsx
    const generateBookingId = () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let id = "BK";
      for (let i = 0; i < 8; i++) {
        id += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return id;
    };

    const bookingId = generateBookingId();

    const formatDateForMySQL = (isoDate) => {
      const date = new Date(isoDate);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    };

    const bookingDetails = {
      destination: JSON.parse(sessionStorage.getItem("selectedDestination"))?.title || "Unknown Destination", // Fallback to avoid null
      accommodation: JSON.parse(sessionStorage.getItem("selectedAccommodation"))?.title || "Unknown Accommodation", // Fallback to avoid null
      totalCost: sessionStorage.getItem("totalCost") || "0",
      date: formatDateForMySQL(new Date().toISOString()), // Format the date for MySQL
      status: "Confirmed",
      email: userEmail, // Include the user's email in the booking details
      bookingId: bookingId // Add the generated bookingId
    };

    console.log("Sending booking details:", bookingDetails); // Debugging log

    try {
      const response = await axios.post(
        "http://localhost/img/Travel-Planner/backend/save_booking.php",
        bookingDetails
      );

      console.log("API Response:", response.data); // Debugging log

      if (response.data.status === "success") {
        console.log("Booking saved successfully:", response.data.message);
        
        // Save bookingId to sessionStorage for reference on success page
        sessionStorage.setItem("bookingId", bookingId);
        
        navigate("/success"); // Redirect to success page
      } else {
        console.error("Error saving booking:", response.data.message);
      }
    } catch (error) {
      console.error("Error during API call:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-richblack-900 text-white p-6">
      <div className="w-full max-w-lg bg-gray-800 text-white rounded-3xl shadow-2xl p-10 border border-gray-700">
        
        {/* Header */}
        <h2 className="text-3xl font-extrabold text-center mb-6 flex items-center justify-center gap-2">
          <FaQrcode className="text-blue-500 text-4xl" /> Secure Payment
        </h2>

        {/* QR Code Payment Option */}
        <div className="flex flex-col items-center mb-6">
          {/* Fixed QR code image URL with proper fallback */}
          <img 
            src="https://w7.pngwing.com/pngs/431/554/png-transparent-barcode-scanners-qr-code-2d-code-creative-barcode-miscellaneous-angle-text-thumbnail.png" 
            alt="QR Code" 
            className="w-40 h-40 rounded-lg shadow-lg"
            onError={(e) => {
              e.target.onerror = null; 
              e.target.src = "https://via.placeholder.com/150?text=QR+Code";
            }}
          />
          <p className="mt-2 text-gray-300 text-sm">Scan the QR Code to Pay</p>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-600 my-4"></div>

        {/* Payment Methods */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Choose Payment Method</h3>
          <div className="space-y-3">
            <button className="w-full flex items-center justify-center py-3 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-all">
              <FaCreditCard className="mr-2" /> Credit / Debit Card
            </button>
            <button className="w-full flex items-center justify-center py-3 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition-all">
              <FaGooglePay className="mr-2" /> UPI Apps
            </button>
            <button className="w-full flex items-center justify-center py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-all">
              <FaUniversity className="mr-2" /> Net Banking
            </button>
          </div>
        </div>

        {/* Pay Now Button */}
        <button
          className="w-full py-4 bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold text-lg rounded-full shadow-lg hover:from-green-600 hover:to-blue-600 transition-all"
          onClick={handlePayment}
        >
          Pay Now
        </button>
      </div>
    </div>
  );
}