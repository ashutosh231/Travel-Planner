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
        
        // Insert booking with the user's name, email and booking ID
        $sql = "INSERT INTO bookings (booking_id, destination, accommodation, total_cost, booking_date, status, booked_by, email) 
                VALUES ('$bookingId', '$destination', '$accommodation', '$totalCost', '$date', '$status', '$bookedBy', '$email')";
        
        // Debugging: Log the SQL query
        file_put_contents("php://stderr", "SQL Query: $sql\n");
        
        if ($conn->query($sql) === TRUE) {
            echo json_encode([
                "status" => "success", 
                "message" => "Booking saved successfully",
                "booking_id" => $bookingId,
                "booked_by" => $bookedBy,
                "email" => $email
            ]);
        } else {
            // Debugging: Log the SQL error
            file_put_contents("php://stderr", "SQL Error: " . $conn->error . "\n");
            echo json_encode(["status" => "error", "message" => "Error saving booking: " . $conn->error]);
        }
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
