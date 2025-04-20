<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

// Database connection
$host = "localhost";
$username = "root";
$password = "";
$database = "tour_planner";

$conn = new mysqli($host, $username, $password, $database);

// Check connection
if ($conn->connect_error) {
    die(json_encode(["status" => "error", "message" => "Database connection failed: " . $conn->connect_error]));
}

// Get JSON input
$data = json_decode(file_get_contents("php://input"));

if (isset($data->email) && isset($data->name) && isset($data->subject) && isset($data->message)) {
    $email = $conn->real_escape_string($data->email);
    $name = $conn->real_escape_string($data->name);
    $subject = $conn->real_escape_string($data->subject);
    $message = $conn->real_escape_string($data->message);

    // Insert query into database
    $stmt = $conn->prepare("INSERT INTO user_queries (user_email, user_name, subject, message) VALUES (?, ?, ?, ?)");
    $stmt->bind_param("ssss", $email, $name, $subject, $message);
    
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Your query has been submitted successfully!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to submit query: " . $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "Invalid input data"]);
}

$conn->close();
?>
