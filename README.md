# 🌍 Travel Planner - Full Stack Application

A comprehensive travel planning and booking platform built with modern technologies.

## 🚀 Tech Stack

### Backend
- **Runtime**: Node.js + Express.js
- **Database**: MongoDB + Mongoose
- **Authentication**: Bcrypt password hashing
- **Email**: Nodemailer (OTP, notifications)
- **API**: RESTful architecture

### Frontend
- **Framework**: React + Vite
- **Styling**: CSS Modules + Tailwind CSS
- **State**: React Hooks
- **HTTP**: Fetch API
- **Animations**: Framer Motion

## ✨ Features

- 👤 **User Authentication**
  - Sign up / Login
  - Password reset with OTP
  - Profile management with photo upload

- 🏨 **Booking System**
  - Browse destinations
  - Book accommodations
  - View booking history
  - Booking status tracking

- ⭐ **Reviews & Ratings**
  - Submit reviews for bookings
  - View all reviews
  - Rating system (1-5 stars)

- 💬 **Query Management**
  - Submit support queries
  - Admin responses
  - Query status tracking

- 👨‍💼 **Admin Dashboard**
  - Manage users
  - Manage bookings
  - Handle queries
  - View analytics

## 📋 Prerequisites

- Node.js 18+
- MongoDB Atlas account (or local MongoDB)
- Gmail account (for email notifications)

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone https://github.com/AryanCodeWizard/Travel-Planner.git
cd Travel-Planner
```

### 2. Setup Backend
```bash
cd backend
npm install

# Create .env file
cp .env.example .env
# Edit .env with your credentials
```

### 3. Setup Frontend
```bash
cd Frontend
npm install

# Create .env file
cp .env.example .env
# Edit with your API URL
```

## 🔐 Environment Variables

### Backend (.env)
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
EMAIL_FROM=Travel Planner <your_email@gmail.com>
NODE_ENV=development
PORT=3000
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:3000/api
```

## 🚀 Running the Application

### Development Mode

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd Frontend
npm run dev
```

Visit: `http://localhost:5173`

## 📦 Deployment

This application is deployed on Netlify with:
- Frontend: Static site hosting
- Backend: Netlify Functions (Serverless)
- Database: MongoDB Atlas

## 🎯 Usage

1. **User Registration**: Create an account with email verification
2. **Browse Destinations**: Explore available travel destinations
3. **Make Bookings**: Book your preferred destination
4. **Track Bookings**: View and manage your bookings
5. **Leave Reviews**: Share your experience after travel
6. **Admin Access**: Manage platform operations (admin only)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License.

## 👥 Team

Developed by AryanCodeWizard and team.

## 📧 Contact

For any queries or support, please contact through the application's query system.

---

⭐ Star this repository if you find it helpful!

## 🛠️ Installation & Setup

### 1. Install MongoDB

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Windows:** Download from [MongoDB Website](https://www.mongodb.com/try/download/community)

**Linux (Ubuntu):**
```bash
sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

### 2. Clone and Install

```bash
git clone https://github.com/AryanCodeWizard/Travel-Planner.git
cd Travel-Planner
```

### 3. Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

Backend runs on: `http://localhost:3000`

### 4. Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

Frontend runs on: `http://localhost:5173`

## 🔧 Configuration

### Backend Environment Variables (.env)

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/tour_planner

# Server
PORT=3000
NODE_ENV=development

# CORS
CORS_ORIGIN=http://localhost:5173

# Email (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
```

### Frontend Environment Variables (.env)

```env
VITE_API_URL=http://localhost:3000/api
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/forgot-password` - Request OTP
- `POST /api/auth/verify-otp` - Verify OTP
- `POST /api/auth/reset-password` - Reset password

### User
- `GET /api/user/data` - Get user profile
- `POST /api/user/update` - Update profile

### Bookings
- `POST /api/booking/save` - Create booking
- `GET /api/booking/user-bookings` - Get user bookings
- `GET /api/booking/recent-activities` - Recent bookings

### Reviews
- `POST /api/review/submit` - Submit review
- `GET /api/review/all` - Get all reviews

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/bookings` - Get all bookings
- `POST /api/admin/update-booking` - Update booking
- `DELETE /api/admin/delete-booking/:id` - Delete booking

## 📁 Project Structure

```
Travel-Planner/
├── backend/
│   ├── config/
│   │   └── database.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Booking.js
│   │   ├── Review.js
│   │   └── Query.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── user.js
│   │   ├── booking.js
│   │   ├── admin.js
│   │   ├── review.js
│   │   └── query.js
│   ├── utils/
│   │   └── mailer.js
│   └── server.js
│
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── config/
│   │   │   └── api.js
│   │   └── App.jsx
│   └── index.html
│
└── docs/
    ├── QUICK_START.md
    ├── MONGODB_SETUP.md
    ├── MIGRATION_GUIDE.md
    └── MIGRATION_SUMMARY.md
```

## 🚀 Quick Start

```bash
# Terminal 1: Start MongoDB
brew services start mongodb-community  # macOS
sudo systemctl start mongod            # Linux

# Terminal 2: Start Backend
cd backend && npm run dev

# Terminal 3: Start Frontend
cd Frontend && npm run dev
```

Visit: `http://localhost:5173`

## 📚 Documentation

- [Quick Start Guide](QUICK_START.md) - Get started quickly
- [MongoDB Setup](backend/MONGODB_SETUP.md) - Database setup guide
- [Migration Guide](backend/MIGRATION_GUIDE.md) - PHP to Node.js migration
- [Migration Summary](MIGRATION_SUMMARY.md) - Complete migration overview

## 🧪 Testing

### API Health Check
```bash
curl http://localhost:3000/
```

### MongoDB Check
```bash
mongosh
use tour_planner
db.stats()
```

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ CORS protection
- ✅ Environment variable configuration
- ✅ Input validation & sanitization
- ✅ Secure OTP generation
- ✅ Auto-expiring password reset tokens

## 📊 Database Schema

### Collections:
- **users** - User accounts and profiles
- **bookings** - Travel bookings and reservations
- **reviews** - User reviews and ratings
- **queries** - Support queries and tickets
- **passwordresets** - OTP tokens for password reset

## 🌐 Deployment

### MongoDB Atlas (Cloud Database)
1. Create account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster
3. Get connection string
4. Update `.env` with Atlas URI

### Hosting Options
- **Backend**: Heroku, AWS, Azure, DigitalOcean
- **Frontend**: Vercel, Netlify, AWS S3
- **Database**: MongoDB Atlas

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the ISC License.

## 👨‍💻 Authors

- **AryanCodeWizard** - [GitHub](https://github.com/AryanCodeWizard)

## 🙏 Acknowledgments

- MongoDB for the excellent database
- Express.js for the web framework
- React team for the amazing frontend library
- All contributors and supporters

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check documentation in `/docs` folder
- Review troubleshooting in `QUICK_START.md`

---

**Built with ❤️ using Node.js, MongoDB, Express, and React**

🌟 **Star this repo if you found it helpful!**

<div align="center">
  <img src="./screenshots/banner.png" alt="Travel Planner Banner" width="800px">

  ![PHP Version](https://img.shields.io/badge/PHP-7.4+-8892BF.svg)
  ![React Version](https://img.shields.io/badge/React-18.0+-61DAFB.svg)
  ![MySQL Version](https://img.shields.io/badge/MySQL-5.7+-4479A1.svg)
  ![License](https://img.shields.io/badge/License-MIT-green.svg)
  
  <h3>Your complete travel management solution</h3>
  
  <p>
    <a href="#demo">View Demo</a> •
    <a href="#features">Features</a> •
    <a href="#installation">Installation</a> •
    <a href="#tech-stack">Tech Stack</a> •
    <a href="#detailed-setup-guide">Setup Guide</a>
  </p>
</div>

## ✨ At a Glance

Travel Planner is a comprehensive web application that streamlines travel planning and booking. With an intuitive user interface and powerful backend, it helps users discover destinations, book accommodations, plan activities, and manage their entire travel experience from a single platform.

## 🎬 Demo <a name="demo"></a>

<div align="center">
  <table>
    <tr>
      <td align="center"><b>Home Page</b></td>
      <td align="center"><b>Destination Search</b></td>
      <td align="center"><b>Booking Process</b></td>
    </tr>
    <tr>
      <td><img src="./screenshots/home.png" width="250px" /></td>
      <td><img src="./screenshots/destinations.png" width="250px" /></td>
      <td><img src="./screenshots/booking.png" width="250px" /></td>
    </tr>
  </table>
</div>

## 🚀 Features <a name="features"></a>

<div align="center">
  <table>
    <tr>
      <td>
        <h3>👤 User Management</h3>
        <ul>
          <li>Secure authentication system</li>
          <li>User profile customization</li>
          <li>Booking history & preferences</li>
          <li>Password recovery with OTP</li>
        </ul>
      </td>
      <td>
        <h3>🌐 Destination Discovery</h3>
        <ul>
          <li>Curated destination catalog</li>
          <li>Advanced search & filtering</li>
          <li>Detailed destination information</li>
          <li>Location-based recommendations</li>
        </ul>
      </td>
      <td>
        <h3>🏨 Accommodation</h3>
        <ul>
          <li>Diverse lodging options</li>
          <li>Price comparison tools</li>
          <li>Rich property details</li>
          <li>Availability calendar</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>
        <h3>📅 Booking System</h3>
        <ul>
          <li>Streamlined booking flow</li>
          <li>Multiple payment options</li>
          <li>Instant confirmation</li>
          <li>Booking management</li>
        </ul>
      </td>
      <td>
        <h3>⭐ Reviews & Ratings</h3>
        <ul>
          <li>Verified customer reviews</li>
          <li>Rating system</li>
          <li>Photo uploads for reviews</li>
          <li>Helpful sorting and filtering</li>
        </ul>
      </td>
      <td>
        <h3>👨‍💼 Admin Tools</h3>
        <ul>
          <li>Comprehensive dashboard</li>
          <li>User and booking management</li>
          <li>Analytics and reports</li>
          <li>Content management</li>
        </ul>
      </td>
    </tr>
  </table>
</div>

## 💻 Tech Stack <a name="tech-stack"></a>

<div align="center">
  <table>
    <tr>
      <td align="center">
        <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/react/react-original.svg" width="40px" /><br />
        <strong>React.js</strong><br />
        Frontend Framework
      </td>
      <td align="center">
        <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/tailwindcss/tailwindcss-plain.svg" width="40px" /><br />
        <strong>Tailwind CSS</strong><br />
        Styling
      </td>
      <td align="center">
        <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/php/php-original.svg" width="40px" /><br />
        <strong>PHP</strong><br />
        Backend Language
      </td>
      <td align="center">
        <img src="https://raw.githubusercontent.com/devicons/devicon/master/icons/mysql/mysql-original-wordmark.svg" width="40px" /><br />
        <strong>MySQL</strong><br />
        Database
      </td>
    </tr>
  </table>
</div>

Additional technologies:
- **Framer Motion**: Animation library for React
- **PHPMailer**: Email functionality
- **JSON Web Tokens**: Authentication mechanism

## 🏗️ Project Structure
```
Travel-Planner/
├── Frontend/               # React frontend application
│   ├── public/             # Public assets
│   ├── src/                # Source files
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── data/           # Mock data and constants
│   │   └── App.jsx         # Main application component
│   ├── index.html          # HTML entry point
│   └── package.json        # Frontend dependencies
│
├── backend/                # PHP backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Business logic
│   ├── utils/              # Utility functions
│   └── *.php               # API endpoints
│
├── database/               # Database schema and migrations
├── PHPMailer/              # PHPMailer library for emails
└── README.md               # Project documentation
```

## Detailed Setup Guide

### Prerequisites
- [XAMPP](https://www.apachefriends.org/download.html) (version 7.4+ recommended)
- [Node.js](https://nodejs.org/) (version 18+ recommended) and npm
- Git (optional, for cloning the repository)

### Step 1: Setting Up XAMPP
1. Download and install XAMPP from the [official website](https://www.apachefriends.org/download.html)
2. Start the XAMPP Control Panel and start both Apache and MySQL services
3. Verify that services are running correctly:
   - Apache should be green and running on port 80
   - MySQL should be green and running on port 3306

### Step 2: Database Setup
1. Open your browser and go to phpMyAdmin: `http://localhost/phpmyadmin`
2. Create a new database:
   ```sql
   CREATE DATABASE travel_planner;
   ```
3. Select the newly created database and import the schema:
   - Click on the "Import" tab
   - Click "Browse" and navigate to `/Applications/XAMPP/xamppfiles/htdocs/img/Travel-Planner/database/travel_planner.sql`
   - Click "Go" to import the schema

Alternatively, you can set up the database manually with these SQL commands:

```sql
CREATE DATABASE travel_planner;
USE travel_planner;

-- Users Table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert admin user
INSERT INTO users (name, email, password, is_admin) VALUES 
('Admin', 'admin@travelplanner.com', '$2y$10$YourHashedPasswordHere', TRUE);

-- Destinations Table
CREATE TABLE destinations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  location VARCHAR(100) NOT NULL,
  description TEXT,
  image VARCHAR(255),
  cost DECIMAL(10,2) NOT NULL,
  rating DECIMAL(3,1),
  reviews INT DEFAULT 0
);

-- Accommodations Table
CREATE TABLE accommodations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  location VARCHAR(100) NOT NULL,
  description TEXT,
  image VARCHAR(255),
  cost DECIMAL(10,2) NOT NULL,
  rating DECIMAL(3,1),
  reviews INT DEFAULT 0
);

-- Bookings Table
CREATE TABLE bookings (
  booking_id VARCHAR(20) PRIMARY KEY,
  user_id INT,
  destination VARCHAR(100),
  accommodation VARCHAR(100),
  check_in_date DATE,
  check_out_date DATE,
  num_nights INT,
  total_cost DECIMAL(10,2),
  booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  admin_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  payment_method VARCHAR(50),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Reviews Table
CREATE TABLE reviews (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_id VARCHAR(20),
  user_id INT,
  rating INT NOT NULL,
  review_text TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(booking_id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);

-- User Queries Table
CREATE TABLE user_queries (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  user_name VARCHAR(100),
  user_email VARCHAR(100),
  subject VARCHAR(255),
  message TEXT,
  reply TEXT NULL,
  status ENUM('pending', 'answered') DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NULL ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### Step 3: Clone or Download the Project
1. If using Git, clone the repository to your XAMPP's htdocs folder:
   ```bash
   cd /Applications/XAMPP/xamppfiles/htdocs/img
   git clone https://github.com/yourusername/travel-planner.git Travel-Planner
   ```
2. If not using Git, download the ZIP and extract it to:
   ```
   /Applications/XAMPP/xamppfiles/htdocs/img/Travel-Planner
   ```

### Step 4: Configure Backend
1. Navigate to the backend configuration file:
   ```bash
   cd /Applications/XAMPP/xamppfiles/htdocs/img/Travel-Planner/backend/config
   ```

2. Create or edit the `database.php` file with your MySQL credentials:
   ```php
   <?php
   // Database configuration
   define('DB_SERVER', 'localhost');
   define('DB_USERNAME', 'root');  // Default XAMPP username
   define('DB_PASSWORD', '');      // Default XAMPP password is empty
   define('DB_NAME', 'travel_planner');
   
   // Attempt to connect to MySQL database
   $conn = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);
   
   // Check connection
   if ($conn->connect_error) {
       die("Connection failed: " . $conn->connect_error);
   }
   ?>
   ```

3. Configure the email settings in PHPMailer (if using email features):
   ```php
   // Inside email-sending script
   $mail = new PHPMailer(true);
   $mail->isSMTP();
   $mail->Host = 'smtp.gmail.com';  // Or your SMTP server
   $mail->SMTPAuth = true;
   $mail->Username = 'your-email@gmail.com';
   $mail->Password = 'your-app-password';  // Use app password for Gmail
   $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
   $mail->Port = 587;
   ```

### Step 5: Set Up Frontend
1. Navigate to the Frontend directory:
   ```bash
   cd /Applications/XAMPP/xamppfiles/htdocs/img/Travel-Planner/Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. The development server will start, typically at `http://localhost:3000`

### Step 6: Backend Configuration (If Needed)
1. Ensure your API endpoints are correctly pointing to the backend:
   ```javascript
   // Example in your React code
   const API_BASE_URL = 'http://localhost/img/Travel-Planner/backend';
   ```

2. You may need to configure CORS in your PHP backend:
   ```php
   // Add to the top of your PHP API files
   header("Access-Control-Allow-Origin: *");
   header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
   header("Access-Control-Allow-Headers: Content-Type, Authorization");
   ```

### Step 7: Creating Sample Data (Optional)
If you want to populate your database with sample data:

```sql
-- Sample destinations
INSERT INTO destinations (title, location, description, image, cost, rating, reviews) VALUES 
('Great Wall of China', 'Beijing, China', 'One of the Seven Wonders of the World.', 'https://example.com/greatwall.jpg', 499999, 4.9, 8000),
('Taj Mahal', 'Agra, India', 'A symbol of eternal love.', 'https://example.com/tajmahal.jpg', 9999, 4.9, 5500);

-- Sample accommodations
INSERT INTO accommodations (title, location, description, image, cost, rating, reviews) VALUES 
('Luxury Beach Resort', 'Maldives', 'Relax in a private villa with ocean access.', 'https://example.com/resort.jpg', 3499, 4.8, 290),
('Mountain Retreat', 'Swiss Alps', 'Cozy wooden lodge with breathtaking views.', 'https://example.com/lodge.jpg', 4999, 4.9, 340);
```

## Running the Application

### Accessing the Application
1. Frontend: Open your browser and navigate to:
   ```
   http://localhost:3000
   ```

2. Backend API: Available at:
   ```
   http://localhost/img/Travel-Planner/backend/
   ```

### Default User Accounts
For testing purposes, you can use these accounts:

1. Admin Account:
   - Email: admin@travelplanner.com
   - Password: admin123

2. Sample User Account:
   - Email: user@example.com
   - Password: user123

### Testing Features
1. **User Registration**: Create a new account
2. **User Login**: Use the sample account or newly created one
3. **Browse Destinations**: View available destinations
4. **Book Accommodation**: Select dates and complete a booking
5. **Manage Bookings**: View your bookings in the user dashboard
6. **Admin Features**: Log in with the admin account to manage users, bookings, and queries

## Troubleshooting Common Issues

### Database Connection Issues
- **Error**: "Cannot connect to database"
  - **Solution**: Verify MySQL is running in XAMPP Control Panel
  - **Solution**: Double-check database name, username, and password in config file

### API Connection Issues
- **Error**: "Failed to fetch" in browser console
  - **Solution**: Ensure Apache is running
  - **Solution**: Check API endpoint URLs are correct
  - **Solution**: Verify CORS headers are properly set

### Frontend Build Problems
- **Error**: npm dependencies issues
  - **Solution**: Delete node_modules folder and run `npm install` again
  - **Solution**: Make sure you're using a compatible Node.js version

### PHP Errors
- **Error**: "Call to undefined function" or similar
  - **Solution**: Make sure PHP extensions are enabled in php.ini
  - **Solution**: Check XAMPP PHP version is 7.4 or higher

## Additional Resources
- [XAMPP Documentation](https://www.apachefriends.org/documentation.html)
- [React.js Documentation](https://reactjs.org/docs/getting-started.html)
- [PHP Documentation](https://www.php.net/docs.php)
- [MySQL Documentation](https://dev.mysql.com/doc/)

## Contact & Support
- Email: support@travelplanner.com
- GitHub Issues: https://github.com/yourusername/travel-planner/issues
- Developer: Your Name
