<?php
header('Content-Type: text/html');
echo "<h1>Database Structure Check</h1>";

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

echo "<p>✅ Connected to database successfully.</p>";

// Check if bookings table exists
$tableResult = $conn->query("SHOW TABLES LIKE 'bookings'");
if ($tableResult->num_rows == 0) {
    echo "<p>❌ Bookings table does not exist. Creating...</p>";
    
    $createTableSQL = "CREATE TABLE bookings (
        id INT(11) NOT NULL AUTO_INCREMENT,
        booking_id VARCHAR(20) NOT NULL,
        destination VARCHAR(255) NOT NULL,
        accommodation VARCHAR(255) NOT NULL,
        total_cost DECIMAL(10,2) NOT NULL,
        booking_date VARCHAR(255) NOT NULL,
        status VARCHAR(50) NOT NULL,
        booked_by VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        admin_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    )";
    
    if ($conn->query($createTableSQL)) {
        echo "<p>✅ Created bookings table successfully.</p>";
    } else {
        echo "<p>❌ Error creating bookings table: " . $conn->error . "</p>";
    }
} else {
    echo "<p>✅ Bookings table exists.</p>";
    
    // Check bookings table structure
    $columns = [];
    $result = $conn->query("DESCRIBE bookings");
    while ($row = $result->fetch_assoc()) {
        $columns[$row['Field']] = $row;
    }
    
    echo "<p>Found columns: " . implode(", ", array_keys($columns)) . "</p>";
    
    // Check if admin_status column exists
    if (!isset($columns['admin_status'])) {
        echo "<p>❌ Missing admin_status column. Adding...</p>";
        if ($conn->query("ALTER TABLE bookings ADD COLUMN admin_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending'")) {
            echo "<p>✅ Added admin_status column.</p>";
        } else {
            echo "<p>❌ Error adding admin_status column: " . $conn->error . "</p>";
        }
    } else {
        echo "<p>✅ admin_status column exists.</p>";
    }
    
    // Check if created_at column exists
    if (!isset($columns['created_at'])) {
        echo "<p>❌ Missing created_at column. Adding...</p>";
        if ($conn->query("ALTER TABLE bookings ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP")) {
            echo "<p>✅ Added created_at column.</p>";
        } else {
            echo "<p>❌ Error adding created_at column: " . $conn->error . "</p>";
        }
    } else {
        echo "<p>✅ created_at column exists.</p>";
    }
}

// Check if reviews table exists
$tableResult = $conn->query("SHOW TABLES LIKE 'reviews'");
if ($tableResult->num_rows == 0) {
    echo "<p>❌ Reviews table does not exist. Creating...</p>";
    
    $createTableSQL = "CREATE TABLE reviews (
        id INT AUTO_INCREMENT PRIMARY KEY,
        booking_id VARCHAR(20) NOT NULL,
        user_email VARCHAR(255) NOT NULL,
        destination VARCHAR(255) NOT NULL,
        accommodation VARCHAR(255) NOT NULL,
        rating INT NOT NULL,
        review_text TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        UNIQUE KEY unique_booking_review (booking_id)
    )";
    
    if ($conn->query($createTableSQL)) {
        echo "<p>✅ Created reviews table successfully.</p>";
    } else {
        echo "<p>❌ Error creating reviews table: " . $conn->error . "</p>";
    }
} else {
    echo "<p>✅ Reviews table exists.</p>";
}

// Check if users table exists
$tableResult = $conn->query("SHOW TABLES LIKE 'users'");
if ($tableResult->num_rows == 0) {
    echo "<p>❌ Users table does not exist.</p>";
} else {
    echo "<p>✅ Users table exists.</p>";
    
    // Check if is_admin column exists in users table
    $usersColumns = [];
    $result = $conn->query("DESCRIBE users");
    while ($row = $result->fetch_assoc()) {
        $usersColumns[$row['Field']] = $row;
    }
    
    if (!isset($usersColumns['is_admin'])) {
        echo "<p>❌ Missing is_admin column in users table. Adding...</p>";
        if ($conn->query("ALTER TABLE users ADD COLUMN is_admin TINYINT(1) DEFAULT 0")) {
            echo "<p>✅ Added is_admin column to users table.</p>";
        } else {
            echo "<p>❌ Error adding is_admin column: " . $conn->error . "</p>";
        }
    } else {
        echo "<p>✅ is_admin column exists in users table.</p>";
    }
    
    // Check if there's at least one admin user
    $adminResult = $conn->query("SELECT * FROM users WHERE is_admin = 1");
    if ($adminResult->num_rows == 0) {
        echo "<p>❌ No admin users found. Creating default admin...</p>";
        
        // Create admin user (with hashed password 'Admin@123')
        $adminInsert = $conn->prepare("INSERT INTO users 
            (name, email, password, hashed_password, phone, location, bio, gender, dob, is_admin) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1)");
        
        $adminName = "Admin User";
        $adminEmail = "admin@example.com";
        $adminPassword = "Admin@123";
        $hashedPassword = password_hash($adminPassword, PASSWORD_DEFAULT);
        $phone = "1234567890";
        $location = "Admin Office";
        $bio = "System Administrator";
        $gender = "Other";
        $dob = "2000-01-01";
        
        $adminInsert->bind_param("sssssssss", 
            $adminName, 
            $adminEmail, 
            $adminPassword, 
            $hashedPassword,
            $phone,
            $location,
            $bio,
            $gender,
            $dob
        );
        
        if ($adminInsert->execute()) {
            echo "<p>✅ Created admin user successfully:</p>";
            echo "<ul>";
            echo "<li>Email: $adminEmail</li>";
            echo "<li>Password: $adminPassword</li>";
            echo "</ul>";
        } else {
            echo "<p>❌ Error creating admin user: " . $adminInsert->error . "</p>";
        }
        
        $adminInsert->close();
    } else {
        echo "<p>✅ Admin user exists.</p>";
        
        // Show admin users
        echo "<p>Admin accounts:</p>";
        echo "<ul>";
        while ($admin = $adminResult->fetch_assoc()) {
            echo "<li>" . $admin['email'] . "</li>";
        }
        echo "</ul>";
    }
}

// Sample data insertion check
$checkBookings = $conn->query("SELECT COUNT(*) as count FROM bookings");
$bookingCount = $checkBookings->fetch_assoc()['count'];
echo "<p>Current booking count: $bookingCount</p>";

if ($bookingCount == 0) {
    echo "<p>No bookings found. Would you like to insert sample booking data?</p>";
    echo "<form method='post'>";
    echo "<input type='hidden' name='insert_sample' value='1'>";
    echo "<button type='submit' style='padding: 5px 10px; background: #4CAF50; color: white; border: none; cursor: pointer;'>Insert Sample Data</button>";
    echo "</form>";
    
    if (isset($_POST['insert_sample'])) {
        // Insert sample booking
        $sampleEmail = "admin@example.com"; // Use admin email or other existing user
        $checkUser = $conn->prepare("SELECT name FROM users WHERE email = ?");
        $checkUser->bind_param("s", $sampleEmail);
        $checkUser->execute();
        $userResult = $checkUser->get_result();
        
        if ($userResult->num_rows > 0) {
            $user = $userResult->fetch_assoc();
            $userName = $user['name'];
            
            // Generate booking ID
            $bookingId = "BK" . strtoupper(substr(md5(uniqid()), 0, 8));
            
            // Sample data
            $destination = "Mountain Retreat";
            $accommodation = "Luxury Suite";
            $totalCost = "4999.00";
            $bookingDate = date("Y-m-d");
            $status = "Confirmed";
            
            $sampleInsert = $conn->prepare("INSERT INTO bookings 
                (booking_id, destination, accommodation, total_cost, booking_date, status, booked_by, email, admin_status, created_at) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending', NOW())");
                
            $sampleInsert->bind_param("ssssssss", 
                $bookingId, 
                $destination, 
                $accommodation, 
                $totalCost, 
                $bookingDate, 
                $status, 
                $userName, 
                $sampleEmail
            );
            
            if ($sampleInsert->execute()) {
                echo "<p>✅ Inserted sample booking successfully:</p>";
                echo "<ul>";
                echo "<li>Booking ID: $bookingId</li>";
                echo "<li>User: $userName ($sampleEmail)</li>";
                echo "<li>Destination: $destination</li>";
                echo "<li>Accommodation: $accommodation</li>";
                echo "</ul>";
            } else {
                echo "<p>❌ Error inserting sample booking: " . $sampleInsert->error . "</p>";
            }
            
            $sampleInsert->close();
        } else {
            echo "<p>❌ Could not find user with email $sampleEmail to create sample booking.</p>";
        }
        
        $checkUser->close();
    }
}

echo "<p><a href='../Frontend/' style='color: blue; text-decoration: underline;'>Go to Frontend</a></p>";

$conn->close();
?>
