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

if (isset($data->id) && isset($data->reply)) {
    $id = $data->id;
    $reply = $conn->real_escape_string($data->reply);

    // Update query with reply
    $stmt = $conn->prepare("UPDATE user_queries SET reply = ?, status = 'answered', updated_at = CURRENT_TIMESTAMP WHERE id = ?");
    $stmt->bind_param("si", $reply, $id);
    
    if ($stmt->execute()) {
        echo json_encode(["status" => "success", "message" => "Reply sent successfully!"]);
    } else {
        echo json_encode(["status" => "error", "message" => "Failed to send reply: " . $stmt->error]);
    }

    $stmt->close();
} else {
    echo json_encode(["status" => "error", "message" => "Invalid input data"]);
}

$conn->close();
?>
