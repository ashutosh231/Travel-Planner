<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json");

// Enable error reporting for debugging
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database connection
$servername = "localhost";
$username = "root"; // Change if needed
$password = ""; // Change if needed
$database = "tour_planner"; // Change to your actual database name

$conn = new mysqli($servername, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed: " . $conn->connect_error]));
}

// Read JSON input
$data = json_decode(file_get_contents("php://input"), true);

// Debugging: Log the received data
file_put_contents("php://stderr", "Received Data: " . print_r($data, true));

// Check if bookings table has necessary columns
$tableCheck = $conn->query("DESCRIBE bookings");
$columns = [];
while ($row = $tableCheck->fetch_assoc()) {
    $columns[] = $row['Field'];
}

// Debug log columns
file_put_contents("php://stderr", "Existing columns: " . implode(", ", $columns) . "\n");

// Check if admin_status column exists
if (!in_array('admin_status', $columns)) {
    // Add admin_status column
    file_put_contents("php://stderr", "Adding missing admin_status column\n");
    $conn->query("ALTER TABLE bookings ADD COLUMN admin_status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending'");
}

// Check if created_at column exists
if (!in_array('created_at', $columns)) {
    // Add created_at column
    file_put_contents("php://stderr", "Adding missing created_at column\n");
    $conn->query("ALTER TABLE bookings ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP");
}

// Check if all required fields are present
if (isset($data['destination'], $data['accommodation'], $data['totalCost'], $data['date'], $data['status'], $data['email'], $data['bookingId'])) {
    $destination = $conn->real_escape_string($data['destination']);
    $accommodation = $conn->real_escape_string($data['accommodation']);
    $totalCost = $conn->real_escape_string($data['totalCost']);
    $date = $conn->real_escape_string($data['date']);
    $status = $conn->real_escape_string($data['status']);
    $email = $conn->real_escape_string($data['email']);
    $bookingId = $conn->real_escape_string($data['bookingId']);
    
    // Fetch the user's name from their email
    $nameQuery = "SELECT name FROM users WHERE email = ?";
    $nameStmt = $conn->prepare($nameQuery);
    $nameStmt->bind_param("s", $email);
    $nameStmt->execute();
    $nameResult = $nameStmt->get_result();
    
    if ($nameResult->num_rows > 0) {
        $user = $nameResult->fetch_assoc();
        $bookedBy = $conn->real_escape_string($user['name']);
        
        // Check if booking already exists
        $checkStmt = $conn->prepare("SELECT * FROM bookings WHERE booking_id = ?");
        $checkStmt->bind_param("s", $bookingId);
        $checkStmt->execute();
        $checkResult = $checkStmt->get_result();
        
        if ($checkResult->num_rows > 0) {
            // Booking already exists, update it
            file_put_contents("php://stderr", "Booking already exists, updating...\n");
            $updateSql = "UPDATE bookings SET 
                          destination = ?, 
                          accommodation = ?, 
                          total_cost = ?, 
                          booking_date = ?, 
                          status = ?, 
                          booked_by = ?, 
                          email = ? 
                          WHERE booking_id = ?";
                          
            $updateStmt = $conn->prepare($updateSql);
            $updateStmt->bind_param("ssssssss", 
                $destination, 
                $accommodation, 
                $totalCost, 
                $date, 
                $status, 
                $bookedBy, 
                $email, 
                $bookingId
            );
            
            if ($updateStmt->execute()) {
                echo json_encode([
                    "status" => "success", 
                    "message" => "Booking updated successfully",
                    "booking_id" => $bookingId,
                    "booked_by" => $bookedBy,
                    "email" => $email
                ]);
            } else {
                file_put_contents("php://stderr", "SQL Error on update: " . $updateStmt->error . "\n");
                echo json_encode(["status" => "error", "message" => "Error updating booking: " . $updateStmt->error]);
            }
            
            $updateStmt->close();
        } else {
            // Insert new booking
            file_put_contents("php://stderr", "Creating new booking...\n");
            $insertSql = "INSERT INTO bookings 
                         (booking_id, destination, accommodation, total_cost, booking_date, status, booked_by, email, admin_status) 
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'pending')";
                        
            $insertStmt = $conn->prepare($insertSql);
            $insertStmt->bind_param("ssssssss", 
                $bookingId, 
                $destination, 
                $accommodation, 
                $totalCost, 
                $date, 
                $status, 
                $bookedBy, 
                $email
            );
            
            if ($insertStmt->execute()) {
                echo json_encode([
                    "status" => "success", 
                    "message" => "Booking saved successfully",
                    "booking_id" => $bookingId,
                    "booked_by" => $bookedBy,
                    "email" => $email
                ]);
                
                // Trigger admin notification - you would call the notification API here
                // This is a simplified approach - in production you might want to use a job queue
                $adminNotifyUrl = "http://localhost/img/Travel-Planner/backend/notify_admin_new_booking.php";
                $adminNotifyData = json_encode(["bookingId" => $bookingId]);
                
                $ch = curl_init($adminNotifyUrl);
                curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
                curl_setopt($ch, CURLOPT_POSTFIELDS, $adminNotifyData);
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_HTTPHEADER, array(
                    'Content-Type: application/json',
                    'Content-Length: ' . strlen($adminNotifyData)
                ));
                
                $result = curl_exec($ch);
                curl_close($ch);
            } else {
                file_put_contents("php://stderr", "SQL Error on insert: " . $insertStmt->error . "\n");
                echo json_encode(["status" => "error", "message" => "Error saving booking: " . $insertStmt->error]);
            }
            
            $insertStmt->close();
        }
        
        $checkStmt->close();
    } else {
        echo json_encode(["status" => "error", "message" => "User not found with email: " . $email]);
    }
    
    $nameStmt->close();
} else {
    $missing = [];
    if (!isset($data['destination'])) $missing[] = 'destination';
    if (!isset($data['accommodation'])) $missing[] = 'accommodation';
    if (!isset($data['totalCost'])) $missing[] = 'totalCost';
    if (!isset($data['date'])) $missing[] = 'date';
    if (!isset($data['status'])) $missing[] = 'status';
    if (!isset($data['email'])) $missing[] = 'email';
    if (!isset($data['bookingId'])) $missing[] = 'bookingId';
    
    echo json_encode([
        "status" => "error", 
        "message" => "Invalid input - missing required fields: " . implode(", ", $missing)
    ]);
}

$conn->close();
?>
