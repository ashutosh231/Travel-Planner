-- Create the database if it doesn't exist
CREATE DATABASE IF NOT EXISTS tour_planner;

-- Use the database
USE tour_planner;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,  -- Plain password (for compatibility with existing code)
    hashed_password VARCHAR(255) NOT NULL,  -- Properly hashed password
    phone VARCHAR(20) NOT NULL,
    location VARCHAR(100) NOT NULL,
    bio TEXT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    dob DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create password_reset table for OTP functionality
CREATE TABLE IF NOT EXISTS password_reset (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    otp VARCHAR(10) NOT NULL,
    expiry DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create bookings table
