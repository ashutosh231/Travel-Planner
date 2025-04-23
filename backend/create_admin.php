<?php
header('Content-Type: text/html');
echo "<h1>Admin Account Creation Tool</h1>";

// Database connection
$host = "localhost";
$username = "root";
$password = "";
$database = "tour_planner";

$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die("<p>Database connection failed: " . $conn->connect_error . "</p>");
}

// Admin credentials
$admin_email = "adiashuto10@gmail.com";
$admin_password = "Admin@123";
$admin_name = "Admin User";

// Create a proper password hash
$hashed_password = password_hash($admin_password, PASSWORD_DEFAULT);

// Check if admin already exists
$check_stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$check_stmt->bind_param("s", $admin_email);
$check_stmt->execute();
$check_stmt->store_result();

if ($check_stmt->num_rows > 0) {
    // Update existing admin
    $update_stmt = $conn->prepare("UPDATE users SET 
                                   password = ?, 
                                   hashed_password = ?,
                                   is_admin = 1 
                                   WHERE email = ?");
    $update_stmt->bind_param("sss", $admin_password, $hashed_password, $admin_email);
    
    if ($update_stmt->execute()) {
        echo "<p>✅ Admin updated successfully!</p>";
        echo "<p>Email: $admin_email</p>";
        echo "<p>Password: $admin_password</p>";
    } else {
        echo "<p>❌ Error updating admin: " . $conn->error . "</p>";
    }
    $update_stmt->close();
} else {
    // Create new admin
    $insert_stmt = $conn->prepare("INSERT INTO users 
                                   (name, email, password, hashed_password, phone, location, bio, gender, dob, is_admin) 
                                   VALUES (?, ?, ?, ?, '1234567890', 'Admin Office', 'System Administrator', 'Other', '2000-01-01', 1)");
    $insert_stmt->bind_param("ssss", $admin_name, $admin_email, $admin_password, $hashed_password);
    
    if ($insert_stmt->execute()) {
        echo "<p>✅ Admin created successfully!</p>";
        echo "<p>Email: $admin_email</p>";
        echo "<p>Password: $admin_password</p>";
    } else {
        echo "<p>❌ Error creating admin: " . $conn->error . "</p>";
    }
    $insert_stmt->close();
}

// Make sure the bookings table has the admin_status column
$result = $conn->query("SHOW COLUMNS FROM bookings LIKE 'admin_status'");

if ($result->num_rows == 0) {
    if ($conn->query("ALTER TABLE bookings ADD COLUMN admin_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending'")) {
        echo "<p>✅ Added 'admin_status' column to bookings table</p>";
    } else {
        echo "<p>❌ Error adding 'admin_status' column: " . $conn->error . "</p>";
    }
}

// Make sure users table has the is_admin column
$result = $conn->query("SHOW COLUMNS FROM users LIKE 'is_admin'");

if ($result->num_rows == 0) {
    if ($conn->query("ALTER TABLE users ADD COLUMN is_admin TINYINT(1) DEFAULT 0")) {
        echo "<p>✅ Added 'is_admin' column to users table</p>";
    } else {
        echo "<p>❌ Error adding 'is_admin' column: " . $conn->error . "</p>";
    }
}

$check_stmt->close();
$conn->close();

echo "<p>Done! You can now log in with the admin credentials above.</p>";
echo "<p><a href='../Frontend/'>Go to Login Page</a></p>";
?>
