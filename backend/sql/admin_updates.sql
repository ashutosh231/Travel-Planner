-- Add 'is_admin' column to users table
ALTER TABLE users ADD COLUMN is_admin TINYINT(1) DEFAULT 0;

-- Update an existing user to make them an admin (replace 'admin@example.com' with your preferred admin email)
UPDATE users SET is_admin = 1 WHERE email = 'admin@example.com';

-- If you don't have a user to make admin, create one:
-- Using a plain text password that will be correctly verified by password_verify()
INSERT INTO users (name, email, password, hashed_password, phone, location, bio, gender, dob, is_admin) 
VALUES ('Admin User', 'admin@example.com', 'Admin@123', '$2y$10$P9GzLBKZ1UhNXr3NXSWRpuBD7wpBRnShHzuQD0tUaX1YkbwJ4vh8e', '1234567890', 'Admin Office', 'System Administrator', 'Other', '2000-01-01', 1);

-- Add status field to bookings table if it doesn't exist already
ALTER TABLE bookings ADD COLUMN admin_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending';
