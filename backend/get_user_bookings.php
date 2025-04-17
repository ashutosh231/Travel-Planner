<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
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

// Get the user email
$data = json_decode(file_get_contents("php://input"), true);
$email = isset($data['email']) ? $data['email'] : null;

// If no email in POST data, check GET parameter
if (!$email && isset($_GET['email'])) {
    $email = $_GET['email'];
}

if ($email) {
    // Prepare query to get the most recent booking for this user - query directly by email
    $query = "SELECT * FROM bookings 
              WHERE email = ? 
              ORDER BY created_at DESC 
              LIMIT 1";
              
    $stmt = $conn->prepare($query);
    $stmt->bind_param("s", $email);
    $stmt->execute();
    $result = $stmt->get_result();
    
    if ($result->num_rows > 0) {
        $booking = $result->fetch_assoc();
        echo json_encode([
            "status" => "success",
            "booking" => $booking
        ]);
    } else {
        echo json_encode([
            "status" => "error",
            "message" => "No bookings found for this user"
        ]);
    }
    
    $stmt->close();
} else {
    echo json_encode([
        "status" => "error",
        "message" => "Email is required"
    ]);
}

$conn->close();
?>
