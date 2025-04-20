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

if (isset($data->userId) && isset($data->name)) {
    $userId = $data->userId;
    $name = $conn->real_escape_string($data->name);

    $stmt = $conn->prepare("UPDATE users SET name = ? WHERE id = ?");
    $stmt->bind_param("si", $name, $userId);

    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "User updated successfully"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to update user"]);
    }

    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "Invalid input"]);
}

$conn->close();
?>
