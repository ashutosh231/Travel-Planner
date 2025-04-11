<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$host = "localhost";
$username = "root"; 
$password = ""; 
$database = "tour_planner";

$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["error" => "Database connection failed: " . $conn->connect_error]));
}

// Fetch the most recent user
$query = "SELECT name, email, phone, location, bio, gender, dob FROM users ORDER BY id DESC LIMIT 1";
$result = $conn->query($query);

if ($result && $result->num_rows > 0) {
    echo json_encode($result->fetch_assoc());
} else {
    echo json_encode(["error" => "User not found"]);
}

$result->free();
$conn->close();
?>