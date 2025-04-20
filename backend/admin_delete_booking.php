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

if (isset($data['bookingId'])) {
    $bookingId = $conn->real_escape_string($data['bookingId']);

    // Delete booking
    $deleteQuery = "DELETE FROM bookings WHERE booking_id = ?";
    $stmt = $conn->prepare($deleteQuery);
    $stmt->bind_param("s", $bookingId);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Booking deleted successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to delete booking: " . $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "Invalid input - bookingId is required"]);
}

$conn->close();
?>
