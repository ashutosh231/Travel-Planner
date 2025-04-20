# Travel Planner Application

## Overview
Travel Planner is a comprehensive travel booking and management system built with React, PHP, and MySQL. 
The application allows users to browse destinations, book accommodations, and manage their travel itineraries.

## Features
- User authentication and profile management
- Destination browsing and filtering
- Accommodation selection
- Booking and payment processing
- User query system with admin responses
- Admin dashboard for managing bookings and queries
- Responsive design for all devices

## Technology Stack
- **Frontend**: React.js, TailwindCSS, Framer Motion
- **Backend**: PHP, MySQL
- **Email**: PHPMailer
- **Authentication**: Custom JWT implementation

## Installation

### Prerequisites
- XAMPP (or similar PHP/MySQL environment)
- Node.js and npm

### Setup Instructions
1. Clone the repository to your XAMPP htdocs folder
2. Navigate to the Frontend directory and run `npm install`
3. Run `npm run dev` to start the development server
4. Import the database schema from the `database` folder
5. Access the application at `http://localhost:3000`

## Admin Access
To access the admin dashboard:
1. Login with an admin account
2. Navigate to `/admin` route
3. Manage bookings, users, and queries

## Security Notes
Please refer to PHPMailer's SECURITY.md for security-related information.
