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
if (isset($data['destination'], $data['accommodation'], $data['totalCost'], $data['date'], $data['status'])) {
    $destination = $conn->real_escape_string($data['destination']);
    $accommodation = $conn->real_escape_string($data['accommodation']);
    $totalCost = $conn->real_escape_string($data['totalCost']);
    $date = $conn->real_escape_string($data['date']);
    $status = $conn->real_escape_string($data['status']);

    // Debugging: Log the SQL query
    $sql = "INSERT INTO bookings (destination, accommodation, total_cost, booking_date, status) 
            VALUES ('$destination', '$accommodation', '$totalCost', '$date', '$status')";
    file_put_contents("php://stderr", "SQL Query: $sql\n");

    if ($conn->query($sql) === TRUE) {
        echo json_encode(["status" => "success", "message" => "Booking saved successfully"]);
    } else {
        // Debugging: Log the SQL error
        file_put_contents("php://stderr", "SQL Error: " . $conn->error . "\n");
        echo json_encode(["status" => "error", "message" => "Error saving booking: " . $conn->error]);
    }
} else {
    echo json_encode(["status" => "error", "message" => "Invalid input"]);
}

$conn->close();
?>
