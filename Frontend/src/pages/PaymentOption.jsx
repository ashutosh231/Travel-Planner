import axios from "axios"; // Import axios for API calls
import { useNavigate } from "react-router-dom";
import { FaCreditCard, FaGooglePay, FaApplePay, FaQrcode, FaUniversity } from "react-icons/fa";

export default function FakePaymentPage() {
  const navigate = useNavigate();

  const handlePayment = async () => {
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
      status: "Pending",
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
          <img src=" https://w7.pngwing.com/pngs/431/554/png-transparent-barcode-scanners-qr-code-2d-code-creative-barcode-miscellaneous-angle-text-thumbnail.png" alt="QR Code" className="w-40 h-40 rounded-lg shadow-lg" />
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
              <FaGooglePay className="mr-2" /> Upi Apps
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