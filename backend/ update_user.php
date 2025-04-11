<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Enable error reporting
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Database Connection
$servername = "localhost";
$username = "root"; // Change if needed
$password = ""; // Change if needed
$database = "tour_planner"; // Change to your actual database name

$conn = mysqli_connect($servername, $username, $password, $database);

// Check database connection
if (!$conn) {
    die(json_encode(["error" => "Database connection failed: " . mysqli_connect_error()]));
}

// Ensure only POST requests are allowed
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(["error" => "Only POST requests are allowed"]);
    exit;
}

// Read the incoming JSON data
$rawData = file_get_contents("php://input");
$data = json_decode($rawData, true);

// Debugging output
var_dump($rawData);
var_dump($data);
var_dump($_SERVER['REQUEST_METHOD']);

if (isset($data['email']) && isset($data['name'])) {
    $email = mysqli_real_escape_string($conn, $data['email']);
    $name = mysqli_real_escape_string($conn, $data['name']);

    $sql = "UPDATE users SET name='$name' WHERE email='$email'";
    if (mysqli_query($conn, $sql)) {
        echo json_encode(["message" => "User updated successfully"]);
    } else {
        echo json_encode(["error" => "Update failed: " . mysqli_error($conn)]);
    }
} else {
    echo json_encode(["error" => "Invalid request"]);
}

// Close the database connection
mysqli_close($conn);
?>