import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Footer from "./components/Footer";
import Recommend from "./components/Recommend";
import Services from "./components/Services";
import Testimonials from "./components/Testimonials"; // Fixed import
import ScrollToTop from "./components/ScrollToTop";
import About from "./components/About";
import Activities from "./components/Activities";
import Accommodation from "./components/Accomodation"; // Fixed spelling
import TravelTips from "./components/TravelTips";
import BookingPage from "./pages/BookingPage";
import DestinationBooking from "./pages/DestinationBooking";
import AccommodationBooking from "./pages/AccommodationBooking";
import Payment from "./pages/Payment";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import PaymentOption from "./pages/PaymentOption";
import Success from "./pages/PaymentSuccess";
import Profile from "./components/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import MyBookings from "./pages/MyBookings";
import DestinationDetails from "./components/DestinationDetails";
import AccommodationDetails from "./components/AccomodationDetails" // ✅ Correct
 // Fixed import

function App() {
  return (
    <div className="font-sans scroll-smooth bg-black">
      <ScrollToTop />
      <Navbar />
      <Routes>
        {/* Home Page */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <Services />
              <Recommend />
              <Testimonials />
              <About />
            </>
          }
        />
        {/* Individual Pages */}
        <Route path="/about" element={<About />} />
        <Route path="/recommend" element={<Recommend />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/activities" element={<Activities />} />
        <Route path="/accommodation" element={<Accommodation />} />
        <Route path="/travel-tips" element={<TravelTips />} />
        <Route path="/booking" element={<BookingPage />} />
        <Route path="/select-destination" element={<DestinationBooking />} />
        <Route path="/select-accommodation" element={<AccommodationBooking />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/paymentOption" element={<PaymentOption />} />
        <Route path="/success" element={<Success />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/destination-details" element={<DestinationDetails />} />
        <Route path="/accomodation-details" element={<AccommodationDetails />} />
        {/* 404 Page */}
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
